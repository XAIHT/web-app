import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import {
  ArrowRight, Download, Eye, Keyboard, Maximize2, PanelsTopLeft,
  ShieldCheck, Terminal, Workflow, X,
} from 'lucide-react';
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { useT } from '@/i18n/context';
import './TerminaterShowcase.css';

const media: Record<string, string> = {
  terminals: '/images/terminater/terminals.webp',
  handover: '/images/terminater/handover.webp',
  workflows: '/images/terminater/workflows.webp',
};
const viewIcons = [Terminal, Keyboard, Workflow];
const benefitIcons = [Eye, PanelsTopLeft, ShieldCheck];

export default function TerminaterShowcase() {
  const c = useT().terminater;
  const [view, setView] = useState('terminals');

  return (
    <section id="terminater" className="terminater-showcase" aria-labelledby="terminater-title">
      <div className="terminater-shell">
        <header className="terminater-heading">
          <span className="section-label">{c.label}</span>
          <h2 id="terminater-title">{c.title}</h2>
          <p className="terminater-headline">{c.headline}</p>
          <p className="terminater-intro">{c.intro}</p>
        </header>

        <Tabs.Root value={view} onValueChange={setView} className="terminater-gallery">
          <Tabs.List className="terminater-tabs" aria-label={c.galleryLabel}>
            {c.views.map((item, index) => {
              const Icon = viewIcons[index];
              return (
                <Tabs.Trigger key={item.id} value={item.id} className="terminater-tab">
                  <Icon size={18} aria-hidden="true" />
                  <span>{item.label}</span>
                </Tabs.Trigger>
              );
            })}
          </Tabs.List>
          {c.views.map((item) => (
            <Tabs.Content key={item.id} value={item.id} className="terminater-panel">
              <figure className="terminater-figure">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="terminater-image-button" aria-label={c.enlarge} title={c.enlarge}>
                      <img src={media[item.id]} alt={item.alt} loading="lazy" decoding="async" width="1440" height="900" />
                      <span className="terminater-enlarge" aria-hidden="true"><Maximize2 size={20} /></span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="terminater-lightbox" showCloseButton={false}>
                    <DialogTitle>{c.title}: {item.label}</DialogTitle>
                    <DialogDescription>{item.title}</DialogDescription>
                    <DialogClose className="terminater-close" aria-label={c.close} title={c.close}>
                      <X size={22} />
                    </DialogClose>
                    <div className="terminater-lightbox-image">
                      <img src={media[item.id]} alt={item.alt} />
                    </div>
                  </DialogContent>
                </Dialog>
                <figcaption>
                  <span className="terminater-caption-label">{c.imageLabel}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </figcaption>
              </figure>
            </Tabs.Content>
          ))}
        </Tabs.Root>

        <div className="terminater-benefits">
          {c.benefits.map((benefit, index) => {
            const Icon = benefitIcons[index];
            return (
              <div key={benefit.title}>
                <Icon size={22} aria-hidden="true" />
                <h3>{benefit.title}</h3>
                <p>{benefit.desc}</p>
              </div>
            );
          })}
        </div>
        <div className="terminater-actions">
          <a className="xaiht-btn xaiht-btn-filled" href="https://github.com/XAIHT/Tlamatini/releases/tag/v1.90.0" target="_blank" rel="noopener noreferrer">
            <Download size={16} aria-hidden="true" />{c.download}
          </a>
          <a className="terminater-explore" href="/tlamatini#features">
            {c.explore}<ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
        <p className="terminater-requirement">{c.requirement}</p>
      </div>
    </section>
  );
}
