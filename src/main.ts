import { siteConfig } from './content/site';
import { VintageAudioPlayer } from './audio/player';
import { PoeticCelebration } from './particles/confetti';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const qs = <T extends HTMLElement>(selector: string, root: ParentNode = document): T | null =>
  root.querySelector<T>(selector);

const qsa = <T extends HTMLElement>(selector: string, root: ParentNode = document): T[] =>
  Array.from(root.querySelectorAll<T>(selector));

document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const audioPlayer = new VintageAudioPlayer(siteConfig.music.audioSrc);
  const celebration = createCelebration();

  renderWorldTabs();
  renderPoetry();
  hydratePersonalContent();
  hydrateLetter();

  initAudio(audioPlayer);
  initIntro(audioPlayer, reducedMotion);
  initPhotoLightbox(reducedMotion);
  initHeroEasterEgg(reducedMotion);
  initBirthdayMoment(celebration, reducedMotion);
  initLetter(reducedMotion);
  initSceneTracking();

  if (!reducedMotion) initMotion();

  window.addEventListener('beforeunload', () => audioPlayer.dispose(), { once: true });
});

function createCelebration(): PoeticCelebration | null {
  const canvas = qs<HTMLCanvasElement>('#celebrationCanvas');
  if (!canvas) return null;
  try {
    return new PoeticCelebration(canvas);
  } catch (error) {
    console.warn('Celebration canvas unavailable:', error);
    return null;
  }
}

function renderWorldTabs(): void {
  const container = qs('#worldWords');
  const reflection = qs('#worldReflection');
  if (!container || !reflection) return;

  siteConfig.littleWorld.ideas.forEach((idea, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'world-word' + (index === 0 ? ' active' : '');
    button.textContent = idea.keyword;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');

    button.addEventListener('click', () => {
      qsa<HTMLElement>('.world-word', container).forEach(item => {
        item.classList.remove('active');
        item.setAttribute('aria-selected', 'false');
      });

      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      gsap.to(reflection, {
        opacity: 0,
        y: 5,
        duration: .14,
        onComplete: () => {
          reflection.textContent = idea.reflection;
          gsap.to(reflection, { opacity: 1, y: 0, duration: .3 });
        }
      });
    });

    container.appendChild(button);
  });

  reflection.textContent = siteConfig.littleWorld.ideas[0]?.reflection || '';
}

function renderPoetry(): void {
  const stack = qs('#poetryStack');
  if (!stack) return;

  siteConfig.poetryMoment.scenes.forEach(scene => {
    const article = document.createElement('article');
    article.className = 'poetry-card poet-' + scene.poetId + (scene.isOriginal ? ' is-original' : '');

    const name = document.createElement('span');
    name.className = 'poet-name';
    name.textContent = scene.poetName;

    const verses = document.createElement('div');
    verses.className = 'verses';

    scene.verses.forEach(verseText => {
      const line = document.createElement('p');
      line.className = 'verse';
      line.textContent = verseText;
      verses.appendChild(line);
    });

    const note = document.createElement('p');
    note.className = 'poet-note';
    note.textContent = scene.annotation;

    article.append(name, verses, note);
    stack.appendChild(article);
  });
}

function hydratePersonalContent(): void {
  const photo = qs<HTMLImageElement>('#lojiPhoto');
  if (photo) {
    photo.src = siteConfig.memories.vignette.imageSrc || '';
    photo.alt = siteConfig.memories.vignette.title;
  }

  const caption = qs('#photoCaption');
  if (caption) caption.textContent = siteConfig.memories.vignette.caption;

  const inspiration = qs('#musicInspiration');
  if (inspiration) inspiration.textContent = siteConfig.music.playlist[0] || '';

  const wishes = qs('#wishesList');
  siteConfig.wishes.items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    wishes?.appendChild(li);
  });
}

function hydrateLetter(): void {
  const salutation = qs('#letterSalutation');
  const body = qs('#letterBody');
  const closing = qs('#letterClosing');
  const signature = qs('#letterSignature');
  const date = qs('#letterDate');

  if (salutation) salutation.textContent = siteConfig.letter.salutation;

  siteConfig.letter.bodyParagraphs.forEach(paragraph => {
    const p = document.createElement('p');
    p.textContent = paragraph;
    body?.appendChild(p);
  });

  if (closing) closing.textContent = siteConfig.letter.closing;
  if (signature) signature.textContent = siteConfig.letter.signature;
  if (date) date.textContent = siteConfig.letter.date;
}

function initAudio(audioPlayer: VintageAudioPlayer): void {
  const dock = qs<HTMLButtonElement>('#audioDock');
  const dockIcon = qs('#audioDockIcon');
  const dockLabel = qs('#audioDockLabel');
  const musicToggle = qs<HTMLButtonElement>('#musicToggle');
  const musicStatus = qs('#musicStatus');
  const recordPlayer = qs('#recordPlayer');

  audioPlayer.subscribe(playing => {
    recordPlayer?.classList.toggle('playing', playing);
    if (dockIcon) dockIcon.textContent = playing ? 'Ⅱ' : '▶';
    if (dockLabel) dockLabel.textContent = playing ? 'إيقاف' : 'اللحن';
    if (musicToggle) musicToggle.textContent = playing ? 'أوقفي اللحن' : 'شغّلي اللحن';
    if (musicStatus) musicStatus.textContent = playing ? 'اللحن شغال الآن' : 'عود وناي ودف خفيف';
  });

  const toggle = async () => {
    try {
      await audioPlayer.toggle();
    } catch (error) {
      console.error('Audio playback failed:', error);
      if (musicStatus) musicStatus.textContent = 'اضغطي مرة تانية لتشغيل الصوت';
    }
  };

  dock?.addEventListener('click', () => void toggle());
  musicToggle?.addEventListener('click', () => void toggle());
  recordPlayer?.addEventListener('click', () => void toggle());
  recordPlayer?.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      void toggle();
    }
  });
}

function initIntro(audioPlayer: VintageAudioPlayer, reducedMotion: boolean): void {
  const intro = qs('#intro');
  const openButton = qs<HTMLButtonElement>('#openExperience');
  if (!intro || !openButton) return;

  const hero = qs('.hero-inner');
  const cover = qs('.book-cover', intro);
  const pages = qs('.book-pages', intro);
  const pageGlow = qs('.book-page-glow', intro);

  if (!reducedMotion && hero) {
    gsap.set(hero, { opacity: 0, y: 22, filter: 'blur(8px)' });
  }

  openButton.addEventListener('click', async () => {
    document.body.classList.add('started');

    try {
      await audioPlayer.play();
    } catch (error) {
      console.warn('Opening soundtrack could not start:', error);
    }

    if (reducedMotion) {
      intro.remove();
      hero?.removeAttribute('style');
      return;
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        intro.remove();
        ScrollTrigger.refresh();
      }
    });

    timeline
      .to(pageGlow, { opacity: 1, scale: 1.05, duration: .38, ease: 'power2.out' }, 0)
      .to(cover, {
        rotateY: -112,
        xPercent: -7,
        duration: 1.18,
        ease: 'power3.inOut',
        transformOrigin: 'left center'
      }, .06)
      .to(pages, { x: 13, rotateY: -2, duration: .62, ease: 'power2.out' }, .3)
      .to(intro, { opacity: 0, duration: .48, ease: 'power2.out' }, .86)
      .to(hero, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: .92,
        ease: 'power3.out'
      }, .86);
  }, { once: true });
}

function initPhotoLightbox(reducedMotion: boolean): void {
  const trigger = qs<HTMLButtonElement>('#photoZoomButton');
  const source = qs<HTMLImageElement>('#lojiPhoto');
  const lightbox = qs('#photoLightbox');
  const image = qs<HTMLImageElement>('#photoLightboxImage');
  const closeButton = qs<HTMLButtonElement>('#photoLightboxClose');
  if (!trigger || !source || !lightbox || !image || !closeButton) return;

  const open = () => {
    image.src = source.currentSrc || source.src;
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.classList.add('is-open');
    document.body.classList.add('lightbox-open');
    closeButton.focus({ preventScroll: true });

    if (!reducedMotion) {
      gsap.fromTo(image,
        { opacity: 0, scale: .94, y: 18 },
        { opacity: 1, scale: 1, y: 0, duration: .48, ease: 'power3.out' }
      );
    }
  };

  const close = () => {
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.classList.remove('is-open');
    document.body.classList.remove('lightbox-open');
    trigger.focus({ preventScroll: true });
  };

  trigger.addEventListener('click', open);
  closeButton.addEventListener('click', close);
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) close();
  });
}

function initHeroEasterEgg(reducedMotion: boolean): void {
  const name = qs('#heroName');
  const toast = qs('#secretToast');
  if (!name || !toast) return;

  let timeout: number | null = null;

  const reveal = () => {
    if (timeout !== null) window.clearTimeout(timeout);
    toast.classList.add('is-visible');

    if (!reducedMotion) {
      gsap.fromTo(toast,
        { opacity: 0, y: 12, scale: .97 },
        { opacity: 1, y: 0, scale: 1, duration: .4, ease: 'power3.out' }
      );
    }

    timeout = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
  };

  name.addEventListener('click', reveal);
  name.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      reveal();
    }
  });
}

function initBirthdayMoment(celebration: PoeticCelebration | null, reducedMotion: boolean): void {
  qs<HTMLButtonElement>('#petalButton')?.addEventListener('click', () => celebration?.burst(16));

  if (reducedMotion || !celebration) return;

  ScrollTrigger.create({
    trigger: '#birthday',
    start: 'top 58%',
    once: true,
    onEnter: () => window.setTimeout(() => celebration.burst(10), 380)
  });
}

function initLetter(reducedMotion: boolean): void {
  const stage = qs('#letterStage');
  const envelope = qs<HTMLButtonElement>('#letterSeal');
  const letter = qs<HTMLElement>('#finalLetter');
  const closeButton = qs<HTMLButtonElement>('#closeLetter');
  const signature = qs('#letterSignature');
  if (!stage || !envelope || !letter || !closeButton || !signature) return;

  const open = () => {
    stage.classList.add('open');
    letter.setAttribute('aria-hidden', 'false');

    if (reducedMotion) {
      envelope.style.display = 'none';
      letter.style.display = 'block';
      return;
    }

    const flap = qs('.envelope-flap', envelope);
    const seal = qs('.envelope-seal', envelope);

    gsap.timeline()
      .to(seal, { scale: .72, opacity: 0, rotate: 14, duration: .3, ease: 'power2.in' })
      .to(flap, { rotateX: 172, duration: .7, ease: 'power3.inOut' }, '-=.03')
      .to(envelope, { y: 30, opacity: 0, duration: .4, ease: 'power2.in' })
      .set(envelope, { display: 'none' })
      .set(letter, { display: 'block' })
      .fromTo(letter,
        { opacity: 0, y: 38, scale: .97 },
        { opacity: 1, y: 0, scale: 1, duration: .75, ease: 'power3.out' }
      )
      .fromTo(signature,
        { opacity: 0, clipPath: 'inset(0 100% 0 0)', letterSpacing: '.16em' },
        { opacity: 1, clipPath: 'inset(0 0% 0 0)', letterSpacing: '0em', duration: .7, ease: 'power2.out' },
        '-=.15'
      );
  };

  const close = () => {
    letter.setAttribute('aria-hidden', 'true');

    if (reducedMotion) {
      letter.style.display = 'none';
      envelope.style.display = 'block';
      stage.classList.remove('open');
      return;
    }

    gsap.to(letter, {
      opacity: 0,
      y: 24,
      duration: .32,
      onComplete: () => {
        letter.style.display = 'none';
        envelope.style.display = 'block';
        gsap.set(envelope, { opacity: 1, y: 0 });
        gsap.set(qs('.envelope-flap', envelope), { rotateX: 0 });
        gsap.set(qs('.envelope-seal', envelope), { opacity: 1, scale: 1, rotate: 0 });
        gsap.set(signature, { clearProps: 'all' });
        stage.classList.remove('open');
      }
    });
  };

  envelope.addEventListener('click', open);
  closeButton.addEventListener('click', close);
}

function initSceneTracking(): void {
  const chapters = qsa<HTMLElement>('.chapter');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const scene = (entry.target as HTMLElement).dataset.scene;
      if (scene) document.body.dataset.scene = scene;
    });
  }, { threshold: .48 });

  chapters.forEach(chapter => observer.observe(chapter));
}

function initMotion(): void {
  qsa<HTMLElement>('.chapter').forEach(chapter => {
    if (chapter.id === 'hero') return;

    const inner = qs('.chapter-inner', chapter);
    if (!inner) return;

    gsap.fromTo(inner,
      { opacity: 0, y: 30, filter: 'blur(6px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: .9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: chapter,
          start: 'top 74%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  qsa<HTMLElement>('.poetry-card').forEach(card => {
    const lines = qsa<HTMLElement>('.verse', card);
    const note = qs('.poet-note', card);
    const name = qs('.poet-name', card);

    gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top 68%',
        end: 'center 50%',
        scrub: .45
      }
    })
      .from(name, { opacity: 0, y: 14 })
      .from(lines, { opacity: 0, y: 22, stagger: .09 }, '<.05')
      .from(note, { opacity: 0, y: 10 }, '-=.08');
  });

  gsap.to('.keepsake', {
    y: -16,
    rotate: -1,
    ease: 'none',
    scrollTrigger: {
      trigger: '#photo',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.1
    }
  });

  gsap.from('.world-word', {
    opacity: 0,
    y: 12,
    stagger: .06,
    duration: .5,
    ease: 'power2.out',
    scrollTrigger: { trigger: '#world', start: 'top 68%' }
  });

  gsap.from('.record-player', {
    opacity: 0,
    y: 24,
    scale: .97,
    rotate: -1,
    duration: .75,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#music', start: 'top 70%' }
  });

  gsap.from('.paper-note', {
    opacity: 0,
    y: 26,
    rotate: -.8,
    scale: .98,
    duration: .8,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#wishes', start: 'top 72%' }
  });

  gsap.from('.birthday-name', {
    opacity: 0,
    scale: .91,
    filter: 'blur(5px)',
    duration: .85,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#birthday', start: 'top 68%' }
  });

  gsap.from('.letter-envelope', {
    opacity: 0,
    y: 24,
    scale: .98,
    duration: .75,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#letter', start: 'top 72%' }
  });

  gsap.to('.moon-window', {
    yPercent: -10,
    ease: 'none',
    scrollTrigger: {
      trigger: '#story',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5
    }
  });

  gsap.to('.ambient-vignette', {
    yPercent: 4,
    ease: 'none',
    scrollTrigger: {
      trigger: '#story',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 2
    }
  });
}
