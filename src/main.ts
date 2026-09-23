import { siteConfig } from './content/site';
import { VintageAudioPlayer } from './audio/player';
import { PoeticCelebration } from './particles/confetti';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const canvas = document.getElementById('celebrationCanvas') as HTMLCanvasElement | null;
  let celebration: PoeticCelebration | null = null;
  if (canvas) {
    try { celebration = new PoeticCelebration(canvas); } catch (error) { console.warn(error); }
  }

  const audioPlayer = new VintageAudioPlayer(siteConfig.music.audioSrc);
  const audioDock = document.getElementById('audioDock');
  const audioDockIcon = document.getElementById('audioDockIcon');
  const audioDockLabel = document.getElementById('audioDockLabel');
  const musicToggle = document.getElementById('musicToggle');
  const musicStatus = document.getElementById('musicStatus');
  const recordPlayer = document.getElementById('recordPlayer');

  const updateAudioUI = (playing: boolean) => {
    recordPlayer?.classList.toggle('playing', playing);
    if (audioDockIcon) audioDockIcon.textContent = playing ? 'Ⅱ' : '▶';
    if (audioDockLabel) audioDockLabel.textContent = playing ? 'إيقاف' : 'اللحن';
    if (musicToggle) musicToggle.textContent = playing ? 'أوقفي اللحن' : 'شغّلي اللحن';
    if (musicStatus) musicStatus.textContent = playing ? 'اللحن شغال الآن' : 'عود وناي ودف خفيف';
  };
  audioPlayer.subscribe(updateAudioUI);

  const toggleAudio = async () => {
    try {
      await audioPlayer.toggle();
    } catch (error) {
      console.error(error);
      if (musicStatus) musicStatus.textContent = 'اضغطي مرة تانية لتشغيل الصوت';
    }
  };

  audioDock?.addEventListener('click', () => { void toggleAudio(); });
  musicToggle?.addEventListener('click', () => { void toggleAudio(); });
  recordPlayer?.addEventListener('click', () => { void toggleAudio(); });
  recordPlayer?.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      void toggleAudio();
    }
  });

  const intro = document.getElementById('intro');
  const openExperience = document.getElementById('openExperience');

  openExperience?.addEventListener('click', async () => {
    document.body.classList.add('started');
    try { await audioPlayer.play(); } catch (error) { console.warn('Audio start skipped:', error); }

    if (!intro) return;
    const cover = intro.querySelector('.book-cover');
    const pages = intro.querySelector('.book-pages');

    if (reducedMotion) {
      intro.remove();
      return;
    }

    const timeline = gsap.timeline({ onComplete: () => intro.remove() });
    timeline
      .to(cover, {
        rotateY: -112,
        xPercent: -7,
        duration: 1.2,
        ease: 'power3.inOut',
        transformOrigin: 'left center'
      })
      .to(pages, { x: 10, duration: .6, ease: 'power2.out' }, '-=.72')
      .to(intro, { opacity: 0, duration: .45, ease: 'power2.out' }, '-=.15');
  });

  const worldWords = document.getElementById('worldWords');
  const worldReflection = document.getElementById('worldReflection');

  siteConfig.littleWorld.ideas.forEach((idea, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'world-word' + (index === 0 ? ' active' : '');
    button.textContent = idea.keyword;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');

    button.addEventListener('click', () => {
      document.querySelectorAll('.world-word').forEach(el => {
        el.classList.remove('active');
        el.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      if (worldReflection) {
        gsap.to(worldReflection, {
          opacity: 0,
          y: 5,
          duration: .14,
          onComplete: () => {
            worldReflection.textContent = idea.reflection;
            gsap.to(worldReflection, { opacity: 1, y: 0, duration: .3 });
          }
        });
      }
    });

    worldWords?.appendChild(button);
  });

  if (worldReflection) {
    worldReflection.textContent = siteConfig.littleWorld.ideas[0]?.reflection || '';
  }

  const poetryStack = document.getElementById('poetryStack');
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
    poetryStack?.appendChild(article);
  });

  const lojiPhoto = document.getElementById('lojiPhoto') as HTMLImageElement | null;
  const photoCaption = document.getElementById('photoCaption');
  if (lojiPhoto) {
    lojiPhoto.src = siteConfig.memories.vignette.imageSrc || '';
    lojiPhoto.alt = siteConfig.memories.vignette.title;
  }
  if (photoCaption) photoCaption.textContent = siteConfig.memories.vignette.caption;

  const musicInspiration = document.getElementById('musicInspiration');
  if (musicInspiration) {
    musicInspiration.textContent = siteConfig.music.playlist[0] || '';
  }

  const wishesList = document.getElementById('wishesList');
  siteConfig.wishes.items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    wishesList?.appendChild(li);
  });

  document.getElementById('petalButton')?.addEventListener('click', () => {
    celebration?.burst(16);
  });

  const letterStage = document.getElementById('letterStage');
  const letterEnvelope = document.getElementById('letterSeal');
  const finalLetter = document.getElementById('finalLetter');
  const letterSalutation = document.getElementById('letterSalutation');
  const letterBody = document.getElementById('letterBody');
  const letterClosing = document.getElementById('letterClosing');
  const letterSignature = document.getElementById('letterSignature');
  const letterDate = document.getElementById('letterDate');

  if (letterSalutation) letterSalutation.textContent = siteConfig.letter.salutation;
  if (letterBody) {
    siteConfig.letter.bodyParagraphs.forEach(paragraph => {
      const p = document.createElement('p');
      p.textContent = paragraph;
      letterBody.appendChild(p);
    });
  }
  if (letterClosing) letterClosing.textContent = siteConfig.letter.closing;
  if (letterSignature) letterSignature.textContent = siteConfig.letter.signature;
  if (letterDate) letterDate.textContent = siteConfig.letter.date;

  const openLetter = () => {
    if (!letterStage || !letterEnvelope || !finalLetter) return;
    letterStage.classList.add('open');
    finalLetter.setAttribute('aria-hidden', 'false');

    if (reducedMotion) {
      letterEnvelope.style.display = 'none';
      finalLetter.style.display = 'block';
      return;
    }

    const flap = letterEnvelope.querySelector('.envelope-flap');
    const seal = letterEnvelope.querySelector('.envelope-seal');
    const timeline = gsap.timeline();
    timeline
      .to(seal, { scale: .72, opacity: 0, rotate: 14, duration: .3, ease: 'power2.in' })
      .to(flap, { rotateX: 172, duration: .7, ease: 'power3.inOut' }, '-=.03')
      .to(letterEnvelope, { y: 30, opacity: 0, duration: .4, ease: 'power2.in' })
      .set(letterEnvelope, { display: 'none' })
      .set(finalLetter, { display: 'block' })
      .fromTo(finalLetter,
        { opacity: 0, y: 38, scale: .97 },
        { opacity: 1, y: 0, scale: 1, duration: .75, ease: 'power3.out' }
      );
  };

  letterEnvelope?.addEventListener('click', openLetter);

  document.getElementById('closeLetter')?.addEventListener('click', () => {
    if (!letterStage || !letterEnvelope || !finalLetter) return;
    finalLetter.setAttribute('aria-hidden', 'true');

    if (reducedMotion) {
      finalLetter.style.display = 'none';
      letterEnvelope.style.display = 'block';
      letterStage.classList.remove('open');
      return;
    }

    gsap.to(finalLetter, {
      opacity: 0,
      y: 24,
      duration: .32,
      onComplete: () => {
        finalLetter.style.display = 'none';
        letterEnvelope.style.display = 'block';
        gsap.set(letterEnvelope, { opacity: 1, y: 0 });
        gsap.set(letterEnvelope.querySelector('.envelope-flap'), { rotateX: 0 });
        gsap.set(letterEnvelope.querySelector('.envelope-seal'), { opacity: 1, scale: 1, rotate: 0 });
        letterStage.classList.remove('open');
      }
    });
  });

  const chapters = Array.from(document.querySelectorAll<HTMLElement>('.chapter'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const scene = (entry.target as HTMLElement).dataset.scene;
        if (scene) document.body.dataset.scene = scene;
      }
    });
  }, { threshold: .48 });
  chapters.forEach(chapter => observer.observe(chapter));

  if (!reducedMotion) {
    chapters.forEach(chapter => {
      const inner = chapter.querySelector('.chapter-inner');
      if (!inner) return;
      gsap.fromTo(inner,
        { opacity: 0, y: 34, filter: 'blur(7px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: .95,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: chapter,
            start: 'top 74%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    gsap.utils.toArray<HTMLElement>('.poetry-card').forEach(card => {
      const lines = card.querySelectorAll('.verse');
      const note = card.querySelector('.poet-note');
      const name = card.querySelector('.poet-name');
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 68%',
          end: 'center 50%',
          scrub: .5
        }
      });
      timeline
        .from(name, { opacity: 0, y: 16 })
        .from(lines, { opacity: 0, y: 24, stagger: .1 }, '<.05')
        .from(note, { opacity: 0, y: 12 }, '-=.1');
    });

    gsap.to('.keepsake', {
      y: -18,
      rotate: -1,
      ease: 'none',
      scrollTrigger: {
        trigger: '#photo',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.1
      }
    });

    // Premium micro choreography for the approved layout.
    gsap.from('.world-word', {
      opacity: 0,
      y: 14,
      stagger: .07,
      duration: .55,
      ease: 'power2.out',
      scrollTrigger: { trigger: '#world', start: 'top 68%' }
    });

    gsap.from('.record-player', {
      opacity: 0,
      y: 28,
      scale: .96,
      rotate: -1.2,
      duration: .8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#music', start: 'top 70%' }
    });

    gsap.from('.paper-note', {
      opacity: 0,
      y: 30,
      rotate: -1.1,
      scale: .975,
      duration: .85,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#wishes', start: 'top 72%' }
    });

    gsap.from('.birthday-name', {
      opacity: 0,
      scale: .9,
      filter: 'blur(6px)',
      duration: .9,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#birthday', start: 'top 68%' }
    });

    gsap.from('.letter-envelope', {
      opacity: 0,
      y: 26,
      scale: .975,
      duration: .8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#letter', start: 'top 72%' }
    });
  }

  window.addEventListener('beforeunload', () => audioPlayer.dispose());
});