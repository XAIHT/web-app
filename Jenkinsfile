pipeline {
  agent { label 'linux' }

  options {
    timestamps()
    disableConcurrentBuilds()
    timeout(time: 30, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  environment {
    GCP_PROJECT     = 'xaiht-492820'
    REGION          = 'us-central1'
    IMAGE_REPO      = 'us-central1-docker.pkg.dev/xaiht-492820/xaiht-images/xaiht-app'
    VM_HOST         = '136.116.194.179'
    VM_USER         = 'jenkins-deployer'
    DOCKER_BUILDKIT = '1'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        script {
          env.SHORT_SHA = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        }
      }
    }

    stage('Sync lockfile with package.json') {
      steps {
        sh '''
          set -eu
          # Self-heal: Tlamatini's AutoBot bumps package.json versions
          # without regenerating package-lock.json, which makes 'npm ci'
          # in the Build image stage below fail. This step regenerates
          # the lockfile in-place using the SAME image the Dockerfile
          # uses, so the build always sees a lockfile that matches
          # package.json — no matter what upstream forgot.
          #
          # The Jenkins agent's workspace isn't visible to Docker
          # Desktop's daemon via bind mount, so we shuffle package.json
          # and package-lock.json through a helper container via docker
          # cp / docker exec.
          #
          # Hardened 2026-10-01 after builds #20 and #21 "hung" here:
          # a stale lockfile (18 ranges bumped in package.json on
          # 2026-09-27) made npm re-resolve from an EMPTY cache on every
          # build. With registry.npmjs.org crawling at 150-250 KB/s
          # (typescript's metadata alone is 15.7 MB), npm outlived the
          # helper's old 10-minute "sleep 600" and was killed mid-run,
          # silently, behind --loglevel=error. Now:
          #   - npm's cache lives in the named Docker volume
          #     xaiht-npm-cache, so metadata is downloaded once and only
          #     revalidated afterwards;
          #   - npm is bounded by NPM_SYNC_TIMEOUT and fails with a named
          #     reason; the helper always outlives it;
          #   - --loglevel=http prints every registry fetch, so progress
          #     is visible in the console instead of one frozen line;
          #   - the helper is removed on success, failure AND abort, and
          #     helpers left behind by older aborted builds are swept.
          HELPER="lockfile-sync-${BUILD_NUMBER}"
          NPM_CACHE_VOLUME="xaiht-npm-cache"
          NPM_SYNC_TIMEOUT=900    # seconds npm may run (15 min)
          HELPER_LIFETIME=1200    # helper outlives npm by 5 min

          cleanup() { docker rm -f "$HELPER" >/dev/null 2>&1 || true; }
          trap cleanup EXIT
          trap 'cleanup; exit 130' INT
          trap 'cleanup; exit 143' TERM

          docker ps -aq --filter "name=lockfile-sync-" | xargs -r docker rm -f >/dev/null 2>&1 || true
          docker volume create "$NPM_CACHE_VOLUME" >/dev/null
          docker run -d --name "$HELPER" \
            -v "$NPM_CACHE_VOLUME":/root/.npm \
            --entrypoint sh node:20-alpine -c "sleep $HELPER_LIFETIME" >/dev/null

          docker cp package.json      "$HELPER":/tmp/package.json
          docker cp package-lock.json "$HELPER":/tmp/package-lock.json

          BEFORE=$(sha256sum package-lock.json | cut -c1-12)
          echo ">>> Syncing package-lock.json (npm limit ${NPM_SYNC_TIMEOUT}s, cache volume ${NPM_CACHE_VOLUME})"
          if ! docker exec -w /tmp "$HELPER" timeout -s TERM "$NPM_SYNC_TIMEOUT" \
                 npm install --package-lock-only --no-audit --no-fund \
                 --loglevel=http --fetch-retries=4 --fetch-retry-maxtimeout=120000; then
            echo ">>> FAILED: npm could not sync package-lock.json within ${NPM_SYNC_TIMEOUT}s."
            echo ">>> Likely cause: registry.npmjs.org is slow or unreachable from Docker."
            echo ">>> Lasting fix: commit an in-sync package-lock.json so this step has nothing to fetch."
            exit 1
          fi
          docker cp "$HELPER":/tmp/package-lock.json ./package-lock.json
          AFTER=$(sha256sum package-lock.json | cut -c1-12)

          if [ "$BEFORE" = "$AFTER" ]; then
            echo ">>> Lockfile already in sync with package.json - no changes."
          else
            echo ">>> Lockfile was OUT OF SYNC (self-healed at build time)."
            echo ">>>   before sha256: ${BEFORE}"
            echo ">>>   after  sha256: ${AFTER}"
          fi
        '''
      }
    }

    stage('Build image') {
      steps {
        sh '''
          set -eu
          docker build \
            -t "${IMAGE_REPO}:${SHORT_SHA}" \
            -t "${IMAGE_REPO}:latest" \
            .
        '''
      }
    }

    stage('Push to Artifact Registry') {
      steps {
        withCredentials([file(credentialsId: 'gcp-jenkins-deployer-sa', variable: 'GCLOUD_KEY')]) {
          sh '''
            set -eu
            gcloud auth activate-service-account --key-file="$GCLOUD_KEY"
            gcloud auth print-access-token \
              | docker login -u oauth2accesstoken --password-stdin https://us-central1-docker.pkg.dev
            docker push "${IMAGE_REPO}:${SHORT_SHA}"
            docker push "${IMAGE_REPO}:latest"
          '''
        }
      }
    }

    stage('Deploy: restart on VM') {
      steps {
        withCredentials([sshUserPrivateKey(
          credentialsId: 'xaiht-vm-deployer-ssh',
          keyFileVariable: 'SSH_KEY'
        )]) {
          sh '''
            set -eu
            ssh -i "$SSH_KEY" \
              -o StrictHostKeyChecking=accept-new \
              -o BatchMode=yes \
              "${VM_USER}@${VM_HOST}" '
                set -u
                echo "Triggering restart..."
                sudo systemctl restart xaiht-app || echo "  restart returned non-zero (slow docker pull); continuing to poll"
                echo "Polling systemctl is-active (up to 3 minutes)..."
                for i in $(seq 1 36); do
                  state=$(systemctl is-active xaiht-app || true)
                  echo "  attempt $i: $state"
                  if [ "$state" = "active" ]; then
                    sudo systemctl status xaiht-app --no-pager | head -n 20
                    exit 0
                  fi
                  sleep 5
                done
                echo "Service did not reach active state in 3 minutes"
                sudo systemctl status xaiht-app --no-pager | head -n 30
                exit 1
              '
          '''
        }
      }
    }

    stage('Smoke test') {
      steps {
        sh '''
          set -eu
          for i in 1 2 3 4 5 6 7 8 9 10; do
            code=$(curl -s -o /dev/null -w "%{http_code}" https://xaiht.org/ || echo 000)
            echo "attempt $i: HTTP $code"
            if [ "$code" = "200" ] || [ "$code" = "302" ] || [ "$code" = "304" ]; then exit 0; fi
            sleep 3
          done
          echo "site did not return 2xx/3xx after 10 attempts"
          exit 1
        '''
      }
    }
  }

  post {
    success {
      echo "Deployed ${env.SHORT_SHA} to https://xaiht.org"
    }
    failure {
      echo "Deploy failed for ${env.SHORT_SHA}"
    }
  }
}
