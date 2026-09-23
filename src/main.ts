import { siteConfig } from './content/site';
import { VintageAudioPlayer } from './audio/player';
import { PoeticCelebration } from './particles/confetti';
import { icons } from './utils/icons';

// Asset URLs handled by Vite bundler
import botanicalSvg from './assets/images/botanical.svg';
import calligraphySvg from './assets/images/calligraphy.svg';
import vinylSvg from './assets/images/vinyl.svg';
import bookSvg from './assets/images/book.svg';

const imageMap = {
  botanical: botanicalSvg,
  calligraphy: calligraphySvg,
  vinyl: vinylSvg,
  book: bookSvg
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Celebration Engine
  const canvas = document.getElementById('celebrationCanvas') as HTMLCanvasElement;
  let celebration: PoeticCelebration | null = null;
  if (canvas) {
    try {
      celebration = new PoeticCelebration(canvas);
    } catch (e) {
      console.warn('Canvas particles initialization skipped:', e);
    }
  }

  // 2. Initialize Vintage Audio Player
  const audioPlayer = new VintageAudioPlayer();

  // Audio UI elements
  const stickyAudioBar = document.getElementById('stickyAudioBar');
  const stickyAudioToggle = document.getElementById('stickyAudioToggle');
  const stickyAudioIcon = document.getElementById('stickyAudioIcon');
  const btnMainPlayToggle = document.getElementById('btnMainPlayToggle');
  const mainPlayBtnIcon = document.getElementById('mainPlayBtnIcon');
  const mainPlayBtnText = document.getElementById('mainPlayBtnText');
  const turntableVinyl = document.getElementById('turntableVinyl');
  const turntableAssembly = document.getElementById('turntableAssembly');

  const updateAudioUI = (isPlaying: boolean) => {
    // Turntable animation
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

    // Sticky Controller
    if (stickyAudioBar) {
      if (isPlaying) {
        stickyAudioBar.classList.add('playing');
      } else {
        stickyAudioBar.classList.remove('playing');
      }
    }

    // Toggle icons and text
    const playSvg = icons.play;
    const pauseSvg = icons.pause;

    if (stickyAudioIcon) {
      stickyAudioIcon.innerHTML = isPlaying ? pauseSvg : playSvg;
    }

    if (mainPlayBtnIcon) {
      mainPlayBtnIcon.innerHTML = isPlaying ? pauseSvg : playSvg;
    }

    if (mainPlayBtnText) {
      mainPlayBtnText.textContent = isPlaying ? 'إيقاف مؤقت' : 'تشغيل الموسيقى';
    }
  };

  audioPlayer.subscribe(updateAudioUI);

  const togglePlayback = () => {
    audioPlayer.toggle();
  };

  stickyAudioToggle?.addEventListener('click', togglePlayback);
  btnMainPlayToggle?.addEventListener('click', togglePlayback);
  turntableVinyl?.addEventListener('click', togglePlayback);

  // 3. Opening Screen Interaction
  const openingScreen = document.getElementById('openingScreen');
  const btnOpenManuscript = document.getElementById('btnOpenManuscript');

  btnOpenManuscript?.addEventListener('click', () => {
    if (openingScreen) {
      openingScreen.classList.add('hidden');
      setTimeout(() => {
        openingScreen.style.display = 'none';
      }, 1050);
    }
    // Gentle welcome dust burst
    celebration?.burst(30);
  });

  // 4. Render Her Little World (Editorial Interactive)
  const worldTagsContainer = document.getElementById('worldTagsContainer');
  const worldDetailTitle = document.getElementById('worldDetailTitle');
  const worldDetailTag = document.getElementById('worldDetailTag');
  const worldDetailDesc = document.getElementById('worldDetailDesc');
  const worldDetailQuote = document.getElementById('worldDetailQuote');

  if (worldTagsContainer && siteConfig.littleWorld.items.length > 0) {
    siteConfig.littleWorld.items.forEach((item, index) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `world-tag-chip ${index === 0 ? 'active' : ''}`;
      chip.setAttribute('role', 'tab');
      chip.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      chip.dataset.id = item.id;

      const iconSvg = (icons as Record<string, string>)[item.symbol] || icons.feather;
      chip.innerHTML = `
        <span class="chip-icon" aria-hidden="true">${iconSvg}</span>
        <span>${item.title}</span>
      `;

      chip.addEventListener('click', () => {
        // Toggle active states
        document.querySelectorAll('.world-tag-chip').forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-selected', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-selected', 'true');

        // Update detail panel
        if (worldDetailTitle) worldDetailTitle.textContent = item.title;
        if (worldDetailTag) worldDetailTag.textContent = item.tag;
        if (worldDetailDesc) worldDetailDesc.textContent = item.description;
        if (worldDetailQuote) worldDetailQuote.textContent = item.quote;
      });

      worldTagsContainer.appendChild(chip);
    });
  }

  // 5. Render Poetry Signature Moment
  const poetryContainer = document.getElementById('poetryScenesContainer');
  if (poetryContainer) {
    siteConfig.poetryMoment.scenes.forEach(scene => {
      const card = document.createElement('article');
      card.className = `poetry-scene-card reveal-fade-up ${scene.isOriginal ? 'original-scene' : ''}`;

      const versesHtml = scene.verses
        .map((verse, vIdx) => {
          const isHighlight = scene.isOriginal && vIdx === 1;
          return `<p class="verse-line ${isHighlight ? 'highlight' : ''}">${verse}</p>`;
        })
        .join('');

      card.innerHTML = `
        <header class="poet-header">
          <h3 class="poet-name">${scene.poetName}</h3>
          <span class="poet-era">${scene.poetEra}</span>
        </header>

        <div class="poet-verses">
          ${versesHtml}
        </div>

        <p class="scene-commentary">«${scene.commentary}»</p>
      `;

      poetryContainer.appendChild(card);
    });
  }

  // 6. Render Memory / Photo Experience
  const memoriesGrid = document.getElementById('memoriesGrid');
  if (memoriesGrid) {
    const rotations = [-1.5, 1.8, -1.2, 1.5];

    siteConfig.memories.items.forEach((memory, idx) => {
      const polaroid = document.createElement('figure');
      polaroid.className = 'memory-polaroid reveal-fade-up';
      const rot = rotations[idx % rotations.length];
      polaroid.style.transform = `rotate(${rot}deg)`;

      const imgSrc = memory.imageSrc || imageMap[memory.placeholderType] || imageMap.botanical;

      polaroid.innerHTML = `
        <div class="polaroid-tape" aria-hidden="true"></div>
        <div class="polaroid-photo-frame">
          <img src="${imgSrc}" alt="${memory.title}" loading="lazy" decoding="async" />
        </div>
        <figcaption class="polaroid-caption-area">
          <h3 class="polaroid-title">${memory.title}</h3>
          <p class="polaroid-caption">${memory.caption}</p>
        </figcaption>
      `;

      memoriesGrid.appendChild(polaroid);
    });
  }

  // 7. Render Personal Wishes
  const wishesList = document.getElementById('wishesList');
  if (wishesList) {
    siteConfig.personalWishes.wishes.forEach((wish, idx) => {
      const item = document.createElement('div');
      item.className = 'wish-item reveal-fade-up';

      const romanOrArabicNum = (idx + 1).toString().padStart(2, '0');

      item.innerHTML = `
        <span class="wish-number" aria-hidden="true">${romanOrArabicNum}.</span>
        <p class="wish-text">${wish}</p>
      `;

      wishesList.appendChild(item);
    });
  }

  // 8. Birthday Reveal & Petals Burst Interaction
  const btnPetalsBurst = document.getElementById('btnPetalsBurst');
  btnPetalsBurst?.addEventListener('click', () => {
    celebration?.burst(55);
  });

  // Auto burst when birthday section scrolls into view
  const birthdaySection = document.getElementById('birthday-reveal');
  let hasBurstOnScroll = false;
  if (birthdaySection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasBurstOnScroll) {
          hasBurstOnScroll = true;
          celebration?.burst(40);
        }
      });
    }, { threshold: 0.4 });
    observer.observe(birthdaySection);
  }

  // 9. Final Sealed Letter Interaction
  const waxEnvelope = document.getElementById('waxEnvelope');
  const waxSealBtn = document.getElementById('waxSealBtn');
  const unfoldedLetter = document.getElementById('unfoldedLetter');
  const letterParagraphs = document.getElementById('letterParagraphs');
  const signatureName = document.getElementById('signatureName');
  const signatureDate = document.getElementById('signatureDate');
  const btnResealLetter = document.getElementById('btnResealLetter');

  // Populate letter content
  if (letterParagraphs) {
    letterParagraphs.innerHTML = siteConfig.finalLetter.bodyParagraphs
      .map(p => `<p>${p}</p>`)
      .join('');
  }
  if (signatureName) signatureName.textContent = siteConfig.finalLetter.signature;
  if (signatureDate) signatureDate.textContent = siteConfig.finalLetter.signatureDate;

  const openLetter = () => {
    if (waxEnvelope && unfoldedLetter) {
      waxEnvelope.style.display = 'none';
      unfoldedLetter.classList.add('open');
      unfoldedLetter.setAttribute('aria-hidden', 'false');
      // Celebratory burst for the opened letter
      celebration?.burst(60);
    }
  };

  const closeLetter = () => {
    if (waxEnvelope && unfoldedLetter) {
      unfoldedLetter.classList.remove('open');
      unfoldedLetter.setAttribute('aria-hidden', 'true');
      waxEnvelope.style.display = 'block';
    }
  };

  waxEnvelope?.addEventListener('click', openLetter);
  waxSealBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    openLetter();
  });
  btnResealLetter?.addEventListener('click', closeLetter);

  // 10. Scroll Observer for Reveal Animations
  const revealElements = document.querySelectorAll('.reveal-fade-up');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('visible'));
  }
});
