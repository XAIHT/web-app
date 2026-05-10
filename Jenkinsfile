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
