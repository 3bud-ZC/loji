import { siteConfig } from './content/site';
import { VintageAudioPlayer } from './audio/player';
import { PoeticCelebration } from './particles/confetti';
import { icons } from './utils/icons';

// Asset URLs handled by Vite
import botanicalSvg from './assets/images/botanical.svg';
import calligraphySvg from './assets/images/calligraphy.svg';
import vinylSvg from './assets/images/vinyl.svg';
import bookSvg from './assets/images/book.svg';

const placeholderImages: Record<string, string> = {
  botanical: botanicalSvg,
  calligraphy: calligraphySvg,
  vinyl: vinylSvg,
  book: bookSvg
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Particle Celebration Engine
  const canvas = document.getElementById('celebrationCanvas') as HTMLCanvasElement;
  let celebration: PoeticCelebration | null = null;
  if (canvas) {
    try {
      celebration = new PoeticCelebration(canvas);
    } catch (e) {
      console.warn('Celebration canvas init skipped:', e);
    }
  }

  // 2. Audio Engine
  const audioPlayer = new VintageAudioPlayer(siteConfig.music.audioSrc);

  const stickyAudioBar = document.getElementById('stickyAudioBar');
  const stickyAudioToggle = document.getElementById('stickyAudioToggle');
  const stickyAudioIcon = document.getElementById('stickyAudioIcon');
  const btnMainPlayToggle = document.getElementById('btnMainPlayToggle');
  const mainPlayBtnText = document.getElementById('mainPlayBtnText');
  const turntableVinyl = document.getElementById('turntableVinyl');
  const turntableAssembly = document.getElementById('turntableAssembly');

  const updateAudioUI = (isPlaying: boolean) => {
    if (turntableVinyl) {
      if (isPlaying) {
        turntableVinyl.classList.add('spinning');
      } else {
        turntableVinyl.classList.remove('spinning');
      }
    }

    if (turntableAssembly) {
      if (isPlaying) {
        turntableAssembly.classList.add('playing');
      } else {
        turntableAssembly.classList.remove('playing');
      }
    }

    if (stickyAudioBar) {
      if (isPlaying) {
        stickyAudioBar.classList.add('playing');
      } else {
        stickyAudioBar.classList.remove('playing');
      }
    }

    if (stickyAudioIcon) {
      stickyAudioIcon.innerHTML = isPlaying ? icons.pause : icons.play;
    }

    if (mainPlayBtnText) {
      mainPlayBtnText.textContent = isPlaying ? 'أوقفيها.' : 'شغّليها.';
    }
  };

  audioPlayer.subscribe(updateAudioUI);

  const toggleAudio = () => {
    audioPlayer.toggle();
  };

  stickyAudioToggle?.addEventListener('click', toggleAudio);
  btnMainPlayToggle?.addEventListener('click', toggleAudio);
  turntableVinyl?.addEventListener('click', toggleAudio);
  turntableVinyl?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleAudio();
    }
  });

  // 3. Opening Transition
  const openingScreen = document.getElementById('openingScreen');
  const btnOpenManuscript = document.getElementById('btnOpenManuscript');

  btnOpenManuscript?.addEventListener('click', () => {
    if (openingScreen) {
      openingScreen.classList.add('hidden');
      setTimeout(() => {
        openingScreen.style.display = 'none';
      }, 950);
    }
    document.body.classList.add('manuscript-open');
    celebration?.burst(25);
  });

  // 4. Her Little World (Spatial Editorial)
  const worldWordsRow = document.getElementById('worldWordsRow');
  const reflectionText = document.getElementById('reflectionText');

  if (worldWordsRow && siteConfig.littleWorld.ideas.length > 0) {
    siteConfig.littleWorld.ideas.forEach((idea, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `world-word-btn ${index === 0 ? 'active' : ''}`;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      btn.textContent = idea.keyword;

      btn.addEventListener('click', () => {
        document.querySelectorAll('.world-word-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        if (reflectionText) {
          reflectionText.style.opacity = '0';
          setTimeout(() => {
            reflectionText.textContent = idea.reflection;
            reflectionText.style.opacity = '1';
          }, 180);
        }
      });

      worldWordsRow.appendChild(btn);
    });

    if (reflectionText && siteConfig.littleWorld.ideas[0]) {
      reflectionText.textContent = siteConfig.littleWorld.ideas[0].reflection;
    }
  }

  // 5. Poetry Signature Moment
  const poetryFlow = document.getElementById('poetryFlow');
  if (poetryFlow) {
    siteConfig.poetryMoment.scenes.forEach(scene => {
      const sceneEl = document.createElement('div');
      sceneEl.className = `poetry-individual-scene reveal-ink poet-${scene.poetId} ${scene.isOriginal ? 'original-scene' : ''}`;

      const versesHtml = scene.verses
        .map(verse => `<p class="verse-line">${verse}</p>`)
        .join('');

      sceneEl.innerHTML = `
        <span class="scene-poet-name">${scene.poetName}</span>
        <div class="poetry-verses-group">
          ${versesHtml}
        </div>
        <p class="scene-annotation ${scene.isOriginal ? 'original-voice' : ''}">${scene.annotation}</p>
      `;

      poetryFlow.appendChild(sceneEl);
    });
  }

  // 6. Memory Vignette
  const memoryVignetteImg = document.getElementById('memoryVignetteImg') as HTMLImageElement;
  const memoryVignetteCaption = document.getElementById('memoryVignetteCaption');

  if (memoryVignetteImg) {
    const v = siteConfig.memories.vignette;
    const resolvedImg = v.imageSrc || placeholderImages[v.placeholderType] || placeholderImages.botanical;
    memoryVignetteImg.addEventListener('load', () => {
      memoryVignetteImg.classList.add('loaded');
    }, { once: true });
    memoryVignetteImg.src = resolvedImg;
    memoryVignetteImg.alt = v.title;
  }
  if (memoryVignetteCaption) {
    memoryVignetteCaption.textContent = siteConfig.memories.vignette.caption;
  }

  // 7. Classic listening notes
  const musicPlaylist = document.getElementById('musicPlaylist');
  if (musicPlaylist) {
    siteConfig.music.playlist.forEach(track => {
      const li = document.createElement('li');
      li.textContent = track;
      musicPlaylist.appendChild(li);
    });
  }

  // 8. Personal Wishes (Concise Poetic Fragments)
  const wishesLines = document.getElementById('wishesLines');
  if (wishesLines) {
    siteConfig.wishes.items.forEach(itemText => {
      const li = document.createElement('li');
      li.textContent = itemText;
      wishesLines.appendChild(li);
    });
  }

  // 9. Birthday Reveal & Petals
  const btnPetalsBurst = document.getElementById('btnPetalsBurst');
  btnPetalsBurst?.addEventListener('click', () => {
    celebration?.burst(50);
  });

  const birthdaySection = document.getElementById('birthday-reveal');
  let hasBurst = false;
  if (birthdaySection) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasBurst) {
          hasBurst = true;
          celebration?.burst(35);
        }
      });
    }, { threshold: 0.35 });
    obs.observe(birthdaySection);
  }

  // 10. Final Sealed Letter
  const waxEnvelope = document.getElementById('waxEnvelope');
  const waxSealBtn = document.getElementById('waxSealBtn');
  const unfoldedLetter = document.getElementById('unfoldedLetter');
  const letterParagraphs = document.getElementById('letterParagraphs');
  const letterClosing = document.getElementById('letterClosing');
  const signatureName = document.getElementById('signatureName');
  const signatureDate = document.getElementById('signatureDate');
  const btnResealLetter = document.getElementById('btnResealLetter');

  if (letterParagraphs) {
    letterParagraphs.innerHTML = siteConfig.letter.bodyParagraphs
      .map(p => `<p>${p}</p>`)
      .join('');
  }
  if (letterClosing) letterClosing.textContent = siteConfig.letter.closing;
  if (signatureName) signatureName.textContent = siteConfig.letter.signature;
  if (signatureDate) signatureDate.textContent = siteConfig.letter.date;

  const openLetter = () => {
    if (waxEnvelope && unfoldedLetter) {
      waxEnvelope.style.display = 'none';
      unfoldedLetter.classList.add('open');
      unfoldedLetter.setAttribute('aria-hidden', 'false');
      celebration?.burst(50);
    }
  };

  const closeLetter = () => {
    if (waxEnvelope && unfoldedLetter) {
      unfoldedLetter.classList.remove('open');
      unfoldedLetter.setAttribute('aria-hidden', 'true');
      waxEnvelope.style.display = 'flex';
    }
  };

  waxEnvelope?.addEventListener('click', openLetter);
  waxEnvelope?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openLetter();
    }
  });
  waxSealBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    openLetter();
  });
  btnResealLetter?.addEventListener('click', closeLetter);

  // 11. Scroll Observer for Gentle Manuscript Reveals
  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-ink');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }
});
