document.addEventListener('DOMContentLoaded', () => {

  // ── Custom cursor ────────────────────────────────────
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX  = mouseX;
  let ringY  = mouseY;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  document.querySelectorAll('.work-row').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.textContent = 'View';
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      if (postcardExpanded) {
        dot.textContent = 'flip';
      } else {
        document.body.classList.remove('cursor-hover');
      }
    });
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  // ── About modal ─────────────────────────────────────
  const avatarBtn    = document.getElementById('avatarBtn');
  const aboutOverlay = document.getElementById('aboutOverlay');
  const aboutClose   = document.getElementById('aboutClose');

  const openAbout = () => aboutOverlay.classList.add('is-open');
  if (avatarBtn) avatarBtn.addEventListener('click', openAbout);
  aboutClose.addEventListener('click', () => aboutOverlay.classList.remove('is-open'));
  aboutOverlay.addEventListener('click', e => {
    if (e.target === aboutOverlay) aboutOverlay.classList.remove('is-open');
  });

  // Project/hobby data for detail modal
  const cardData = {
    'card-1': {
      heroImage: 'Synthesis hero image.png',
      templateId: 'ideate-content',
    },
    'card-2': {
      heroImage: 'Chaotic Gradients - 50.jpg',
      overlayImage: 'ampcontrolheroimage.png',
      templateId: 'ampcontrol-content',
    },
    'card-3': {
      heroImage: 'sage background.png',
      overlayImage: 'sage hero image.png',
      templateId: 'sage-content',
    },
    'card-4': {
      heroImage: 'achilles background.png',
      overlayImage: 'aAchilles Hero Image.png',
      templateId: 'achilles-content',
    },
    'card-5': { title: 'Hobbies',  desc: 'A description of this hobby goes here.', tags: ['PERSONAL'] },
    'card-6': { title: 'Hobbies',  desc: 'A description of this hobby goes here.', tags: ['CREATIVE'] },
    'card-7': { title: 'Hobbies',  desc: 'A description of this hobby goes here.', tags: ['PERSONAL'] },
    'card-8': { title: 'Apple',    desc: 'A short description of what this project is about.' },
    'card-9': { title: 'LinkedIn', desc: 'A short description of what this project is about.' },
  };

  // ── Postcard reveal on load ──────────────────────────
  requestAnimationFrame(() => {
    setTimeout(() => {
      const postcard = document.getElementById('postcard');
      if (postcard) postcard.classList.add('revealed');
    }, 120);
  });

  // ── Work row clicks ───────────────────────────────────
  document.querySelectorAll('.work-row[data-card]').forEach(row => {
    row.addEventListener('click', () => openProjectDetail(row.dataset.card));
  });

  // ── Project detail modal ─────────────────────────────
  const detailOverlay = document.getElementById('projectDetailOverlay');
  const detailClose   = document.getElementById('projectDetailClose');
  const detailTitle   = document.getElementById('projectDetailTitle');
  const detailDesc    = document.getElementById('projectDetailDesc');
  const detailTags    = document.getElementById('projectDetailTags');

  const customSlot   = document.getElementById('projectDetailCustom');
  const standardSlot = document.getElementById('projectDetailStandard');

  function openProjectDetail(id) {
    const data = cardData[id];
    if (!data) return;

    // Template-based projects (e.g. IDEATE)
    if (data.templateId) {
      const tpl = document.getElementById(data.templateId);
      customSlot.innerHTML = '';
      customSlot.appendChild(tpl.content.cloneNode(true));
      customSlot.style.display = '';
      standardSlot.style.display = 'none';

      const heroEl = document.getElementById('projectDetailImage');
      if (data.heroImage) {
        heroEl.style.backgroundImage = `url('${data.heroImage}')`;
        heroEl.style.backgroundSize  = 'cover';
        heroEl.style.backgroundPosition = 'center';
        heroEl.style.position = 'relative';
        heroEl.innerHTML = data.overlayImage
          ? `<img src="${data.overlayImage}" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);max-width:80%;max-height:80%;object-fit:contain;">`
          : '';
      } else {
        heroEl.style.backgroundImage = '';
        heroEl.innerHTML = '';
      }

      const inlineHero = document.getElementById('projectDetailHero');
      if (inlineHero) {
        inlineHero.style.backgroundImage = data.heroImage ? `url('${data.heroImage}')` : '';
        inlineHero.innerHTML = data.overlayImage
          ? `<img src="${data.overlayImage}">`
          : '';
      }

      // Carousels
      customSlot.querySelectorAll('.cs-carousel').forEach(carousel => {
        const track  = carousel.querySelector('.cs-carousel-track');
        const slides = carousel.querySelectorAll('.cs-carousel-slide');
        const dots   = carousel.querySelectorAll('.cs-carousel-dot');
        let current  = 0;

        const updateCursorLabel = () => {
          dot.innerHTML = current === 0
            ? 'Scroll <span class="cursor-arrow">→</span>'
            : '<span class="cursor-arrow">←</span> Scroll';
        };

        const goTo = i => {
          current = (i + slides.length) % slides.length;
          track.style.transform = `translateX(-${current * 100}%)`;
          dots.forEach((d, idx) => d.classList.toggle('is-active', idx === current));
          if (document.body.classList.contains('cursor-hover')) updateCursorLabel();
        };

        dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

        carousel.addEventListener('mouseenter', () => {
          updateCursorLabel();
          document.body.classList.add('cursor-hover');
        });
        carousel.addEventListener('mouseleave', () => {
          document.body.classList.remove('cursor-hover');
        });

        // Trackpad / touch swipe
        let startX = 0;
        let dragging = false;

        carousel.addEventListener('pointerdown', e => {
          startX = e.clientX;
          dragging = true;
        });

        carousel.addEventListener('pointerup', e => {
          if (!dragging) return;
          dragging = false;
          const dx = e.clientX - startX;
          if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
        });

        carousel.addEventListener('wheel', e => {
          if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
          e.preventDefault();
          if (e.deltaX > 40) goTo(current + 1);
          else if (e.deltaX < -40) goTo(current - 1);
        }, { passive: false });
      });

      // Video pause/play toggles + expand buttons
      const lightbox      = document.getElementById('csVideoLightbox');
      const lightboxVideo = document.getElementById('csVideoLightboxVideo');
      const lightboxClose = document.getElementById('csVideoLightboxClose');

      const closeLightbox = () => {
        lightbox.classList.remove('is-open');
        lightboxVideo.pause();
        lightboxVideo.src = '';
      };

      lightboxClose.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

      customSlot.querySelectorAll('.cs-video-wrap').forEach(wrap => {
        const video = wrap.querySelector('video');
        if (!video) return;

        // Pause/play toggle
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'cs-video-toggle';
        toggleBtn.setAttribute('aria-label', 'Pause');
        toggleBtn.innerHTML = `<svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><rect x="0" y="0" width="3" height="12" rx="1"/><rect x="7" y="0" width="3" height="12" rx="1"/></svg>`;
        toggleBtn.addEventListener('click', () => {
          if (video.paused) {
            video.play();
            toggleBtn.setAttribute('aria-label', 'Pause');
            toggleBtn.innerHTML = `<svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><rect x="0" y="0" width="3" height="12" rx="1"/><rect x="7" y="0" width="3" height="12" rx="1"/></svg>`;
          } else {
            video.pause();
            toggleBtn.setAttribute('aria-label', 'Play');
            toggleBtn.innerHTML = `<svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><polygon points="0,0 10,6 0,12"/></svg>`;
          }
        });

        // Expand button
        const expandBtn = document.createElement('button');
        expandBtn.className = 'cs-video-expand';
        expandBtn.setAttribute('aria-label', 'Expand');
        expandBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M1 5V1h4M11 7v4H7M1 5l4-4M11 7l-4 4"/></svg>`;
        expandBtn.addEventListener('click', () => {
          lightboxVideo.src = video.src;
          lightboxVideo.load();
          lightboxVideo.play();
          lightbox.classList.add('is-open');
        });

        wrap.appendChild(toggleBtn);
        wrap.appendChild(expandBtn);
      });

      // Next card navigation
      customSlot.querySelectorAll('.cs-next-card[data-next-card]').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
          detailModal.scrollTop = 0;
          openProjectDetail(card.dataset.nextCard);
        });
      });

      // Scroll-spy
      const modal = document.querySelector('.project-detail-modal');

      const navItems = customSlot.querySelectorAll('.cs-nav-item');
      const sectionIds = Array.from(navItems).map(i => i.dataset.target).filter(Boolean);
      const sections = sectionIds.map(id => customSlot.querySelector('#' + id)).filter(Boolean);

      navItems.forEach(item => {
        item.addEventListener('click', () => {
          const target = customSlot.querySelector('#' + item.dataset.target);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });

      let activeId = null;
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            activeId = entry.target.id;
            navItems.forEach(item =>
              item.classList.toggle('is-active', item.dataset.target === activeId)
            );
          }
        });
      }, { root: modal, threshold: 0.25 });

      sections.forEach(s => observer.observe(s));


      detailOverlay.classList.add('is-open');
      return;
    }

    // Standard data-driven projects
    customSlot.style.display  = 'none';
    standardSlot.style.display = '';

    detailTitle.textContent = data.title;
    detailTags.innerHTML    = data.tags.map(t => `<span class="tag">${t}</span>`).join('');

    const heroEl = document.getElementById('projectDetailImage');
    if (data.heroImage) {
      heroEl.style.backgroundImage = `url('${data.heroImage}')`;
      heroEl.style.backgroundSize = 'cover';
      heroEl.style.backgroundPosition = 'center';
      heroEl.style.position = 'relative';
      heroEl.innerHTML = data.overlayImage
        ? `<img src="${data.overlayImage}" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);max-width:80%;max-height:80%;object-fit:contain;border-radius:10px;">`
        : '';
    } else {
      heroEl.style.backgroundImage = '';
      heroEl.innerHTML = '';
    }

    const inlineHero = document.getElementById('projectDetailHero');
    if (inlineHero) {
      inlineHero.style.backgroundImage = data.heroImage ? `url('${data.heroImage}')` : '';
      inlineHero.innerHTML = data.overlayImage
        ? `<img src="${data.overlayImage}">`
        : '';
    }

    const overview = document.getElementById('projectDetailOverview');
    const stats    = document.getElementById('projectDetailStats');

    if (data.overview) {
      overview.textContent = data.overview;
      overview.closest('.project-detail-section').style.display = '';
    } else {
      overview.closest('.project-detail-section').style.display = 'none';
    }

    if (data.timeline || data.teammates || data.contributions) {
      document.getElementById('projectDetailTimeline').textContent     = data.timeline || '—';
      document.getElementById('projectDetailTeammates').textContent    = data.teammates || '—';
      document.getElementById('projectDetailContributions').textContent = data.contributions || '—';
      stats.style.display = '';
    } else {
      stats.style.display = 'none';
    }

    // Initial Problem
    const initialProblemEl = document.getElementById('projectDetailInitialProblem');
    if (data.problem) {
      initialProblemEl.innerHTML = `
        <h2 class="section-heading-large">Initial Problem</h2>
        <h3 class="subsection-title">Problem</h3>
        <p class="project-detail-section-text">${data.problem}</p>`;
      initialProblemEl.style.display = '';
    } else {
      initialProblemEl.style.display = 'none';
    }

    // Research Insights
    const researchEl = document.getElementById('projectDetailResearch');
    if (data.researchUserNeeds || data.researchBusinessGoals) {
      researchEl.innerHTML = `
        <h2 class="section-heading-large">Research Insights</h2>
        <div class="research-cols">
          <div class="research-col">
            <h3 class="subsection-title">User Needs</h3>
            <ul class="research-list">${(data.researchUserNeeds || []).map(n => `<li>${n}</li>`).join('')}</ul>
            <div class="section-image-placeholder"></div>
          </div>
          <div class="research-col">
            <h3 class="subsection-title">Business Goals</h3>
            <ul class="research-list">${(data.researchBusinessGoals || []).map(n => `<li>${n}</li>`).join('')}</ul>
            <div class="section-image-placeholder"></div>
          </div>
        </div>`;
      researchEl.style.display = '';
    } else {
      researchEl.style.display = 'none';
    }

    const designExpEl = document.getElementById('projectDetailDesignExplorations');
    if (data.designExplorations) {
      const de = data.designExplorations;
      const pointsHtml = de.points.map(p => `
        <div class="design-exp-row">
          <div class="design-exp-text">
            <span class="design-exp-num">${p.num}</span>
            ${p.items.map(item => `
              <h3 class="subsection-title" style="margin-top:1rem">${item.title}</h3>
              <p class="project-detail-section-text">${item.desc}</p>
            `).join('')}
          </div>
          <div class="section-image-placeholder"></div>
        </div>`).join('');
      designExpEl.innerHTML = `
        <h2 class="section-heading-large">Design Explorations</h2>
        <p class="project-detail-section-text">${de.intro}</p>
        ${pointsHtml}`;
      designExpEl.style.display = '';
    } else {
      designExpEl.style.display = 'none';
    }

    const designConEl = document.getElementById('projectDetailDesignConstraints');
    if (data.designConstraints) {
      designConEl.innerHTML = `
        <h2 class="section-heading-large">Design Constraints</h2>
        <p class="project-detail-section-text">${data.designConstraints}</p>
        <div class="section-image-placeholder" style="margin-top:2rem"></div>
        <h3 class="constraints-subheading">Applying this to pages</h3>
        <div class="constraints-versions">
          <div class="constraints-version">
            <span class="constraints-version-label">V1</span>
            <div class="section-image-placeholder"></div>
          </div>
          <div class="constraints-version">
            <span class="constraints-version-label">V2</span>
            <div class="section-image-placeholder"></div>
          </div>
        </div>`;
      designConEl.style.display = '';
    } else {
      designConEl.style.display = 'none';
    }

    const featuresEl = document.getElementById('projectDetailFeatures');
    if (data.features) {
      featuresEl.innerHTML = `<h2 class="section-heading-large">Main Features</h2>` +
        data.features.map(f => `
          <div class="feature-block">
            <div class="feature-text">
              <h3 class="feature-title">${f.title}</h3>
              <p class="feature-desc">${f.desc}</p>
            </div>
            <div class="feature-video"></div>
          </div>`).join('');
      featuresEl.style.display = '';
    } else {
      featuresEl.style.display = 'none';
    }

    const impactEl  = document.getElementById('projectDetailImpact');
    const metricsEl = document.getElementById('projectDetailMetrics');
    const hmwEl     = document.getElementById('projectDetailHmw');

    if (data.impact) {
      metricsEl.innerHTML = data.impact.map(m => `
        <div class="impact-metric">
          <span class="impact-stat">${m.stat}</span>
          <span class="impact-desc">${m.desc}</span>
        </div>`).join('');
      impactEl.style.display = '';
    } else {
      impactEl.style.display = 'none';
    }

    if (data.hmw) {
      hmwEl.innerHTML = `<p class="project-hmw-text">${data.hmw}</p>`;
      hmwEl.style.cssText = 'display: flex; justify-content: center; padding: 5rem 0;';
    } else {
      hmwEl.style.display = 'none';
    }


    const reflectionsEl = document.getElementById('projectDetailReflections');
    if (data.reflections) {
      reflectionsEl.innerHTML = `
        <h2 class="section-heading-large">Reflections</h2>
        ${data.reflections.map(p => `<p class="project-detail-section-text">${p}</p>`).join('')}`;
      reflectionsEl.style.display = '';
    } else {
      reflectionsEl.style.display = 'none';
    }

    detailOverlay.classList.add('is-open');
  }

  const detailExpand = document.getElementById('projectDetailExpand');
  const detailModal  = document.querySelector('.project-detail-modal');
  const expandIcons  = ['<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M1 5V1h4M11 7v4H7M1 5l4-4M11 7l-4 4"/></svg>',
                        '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 1V5H1M7 11V7h4M5 1L1 5M7 11l4-4"/></svg>'];

  detailExpand.addEventListener('click', () => {
    const expanded = detailModal.classList.toggle('is-expanded');
    detailExpand.innerHTML = expandIcons[expanded ? 1 : 0];
  });

  const closeDetail = () => { detailModal.classList.remove('is-expanded'); detailExpand.innerHTML = expandIcons[0]; detailOverlay.classList.remove('is-open'); };
  detailClose.addEventListener('click', closeDetail);
  document.querySelector('.cs-modal-nav .min-logo').addEventListener('click', closeDetail);
  detailOverlay.addEventListener('click', e => {
    if (e.target === detailOverlay) detailOverlay.classList.remove('is-open');
  });

  // ── Postcard pop-out ──────────────────────────────────
  const postcardEl = document.getElementById('postcard');
  const backdrop   = document.createElement('div');
  backdrop.className = 'postcard-backdrop';
  document.body.appendChild(backdrop);

  let postcardExpanded = false;

  function openPostcard() {
    if (postcardExpanded || !postcardEl.classList.contains('revealed')) return;
    postcardExpanded = true;
    postcardEl.classList.add('is-expanded');
    backdrop.classList.add('is-open');
    dot.textContent = 'flip';
  }

  function closePostcard() {
    if (!postcardExpanded) return;
    postcardExpanded = false;
    postcardEl.classList.remove('is-expanded', 'is-flipped');
    postcardEl.classList.add('is-collapsing');
    backdrop.classList.remove('is-open');
    document.body.classList.remove('cursor-hover');
    postcardEl.addEventListener('animationend', () => {
      postcardEl.classList.remove('is-collapsing');
    }, { once: true });
  }

  postcardEl.addEventListener('click', e => {
    if (e.target.closest('.work-row')) return;
    if (postcardExpanded) {
      postcardEl.classList.toggle('is-flipped');
      const flipped = postcardEl.classList.contains('is-flipped');
      dot.textContent = flipped ? 'Flip' : 'Flip';
    } else {
      openPostcard();
    }
  });

  backdrop.addEventListener('click', closePostcard);

  // Cursor hint on postcard hover
  postcardEl.addEventListener('mouseenter', () => {
    dot.textContent = postcardExpanded ? 'flip' : 'Open';
    document.body.classList.add('cursor-hover');
  });
  postcardEl.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-hover');
  });

});
