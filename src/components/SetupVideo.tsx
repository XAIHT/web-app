import { useRef, useState } from 'react';
import { CirclePlay, ExternalLink, Play, X } from 'lucide-react';
import { useT } from '@/i18n/context';
import './SetupVideo.css';

const videoId = '8bQcWyqL9kg';
const duration = '10:06';

export default function SetupVideo({ featured = false }: { featured?: boolean }) {
  const copy = useT().setupVideo;
  const dialog = useRef<HTMLDialogElement>(null);
  const [playing, setPlaying] = useState(false);
  const title = `${copy.title} · ${copy.language}`;
  const open = () => {
    dialog.current?.showModal();
    setPlaying(true);
  };

  return (
    <>
      <button type="button" className={featured ? 'setup-video-feature' : 'setup-video-cta'}
        aria-haspopup="dialog" onClick={open}>
        {featured ? (
          <>
            <span className="setup-video-poster">
              <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="" loading="lazy" width="480" height="360" />
              <span className="setup-video-play"><Play size={22} fill="currentColor" aria-hidden="true" /></span>
            </span>
            <span className="setup-video-copy">
              <span className="section-label">{copy.language} · {duration}</span>
              <strong>{copy.title}</strong>
              <span>{copy.description}</span>
            </span>
          </>
        ) : (
          <><CirclePlay size={20} aria-hidden="true" />{copy.action}<small>{duration}</small></>
        )}
      </button>
      <dialog ref={dialog} className="setup-video-dialog" aria-label={title}
        onClose={() => setPlaying(false)}
        onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className="setup-video-inner">
          <header>
            <div><span className="section-label">{copy.language} · {duration}</span><h2>{copy.title}</h2></div>
            <button type="button" autoFocus aria-label={copy.close} title={copy.close} onClick={() => dialog.current?.close()}><X aria-hidden="true" /></button>
          </header>
          {playing && <iframe title={title} src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />}
          <footer><a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer">{copy.external}<ExternalLink size={15} aria-hidden="true" /></a></footer>
        </div>
      </dialog>
    </>
  );
}
