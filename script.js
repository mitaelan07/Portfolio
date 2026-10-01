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

  document.querySelectorAll('.work-row, .experiment-row').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.textContent = 'View';
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
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
      heroImage: '',
      templateId: 'ideate-content',
    },
    'card-10': {
      heroImage: '',
      previewImage: 'Chaotic Gradients - 66.jpg',
      previewOverlayImage: 'Atlas-Thumbnail.png',
      templateId: 'atlas-content',
    },
    'card-2': {
      heroImage: '',
      previewImage: 'Chaotic Gradients - 98.jpg',
      previewOverlayImage: 'ampcontrolheroimage.png',
      overlayRadius: '4px',
      templateId: 'ampcontrol-content',
    },
    'card-3': {
      heroImage: '',
      previewImage: 'Sage-Background.webp',
      previewOverlayImage: 'Sage-Thumbnail2.png',
      templateId: 'sage-content',
    },
    'card-4': {
      heroImage: '',
      previewImage: 'achilles background.jpg',
      previewOverlayImage: 'aAchilles Hero Image.png',
      templateId: 'achilles-content',
    },
    'card-5': { title: 'Hobbies',  desc: 'A description of this hobby goes here.', tags: ['PERSONAL'] },
    'card-6': { title: 'Hobbies',  desc: 'A description of this hobby goes here.', tags: ['CREATIVE'] },
    'card-7': { title: 'Hobbies',  desc: 'A description of this hobby goes here.', tags: ['PERSONAL'] },
    'card-8': {
      title: 'Apple',
      desc: 'A short description of what this project is about.',
      previewImage: 'Apple-Thumbnail.webp',
    },
    'card-9': {
      title: 'LinkedIn',
      desc: 'A short description of what this project is about.',
      previewImage: 'LinkedIn-thumbnail.webp',
    },
    'card-12': {
      heroImage: '',
      previewImage: 'PTPAL-thumbnail background.jpg',
      previewOverlayImage: 'PTPAL-Thumbnail.png',
      templateId: 'ptpal-content',
    },
  };

  // ── Postcard reveal on load (after headline finishes) ──
  requestAnimationFrame(() => {
    setTimeout(() => {
      const postcard = document.getElementById('postcard');
      if (postcard) postcard.classList.add('revealed');
    }, 1500);
  });

  // ── Work/experiment row clicks ────────────────────────
  document.querySelectorAll('.work-row[data-card], .experiment-row[data-card]').forEach(row => {
    row.addEventListener('click', () => openProjectDetail(row.dataset.card));
  });

  // ── Work row hover preview (shown while postcard is expanded) ──
  const workPreview = document.getElementById('workPreview');

  function positionWorkPreview(clientX, clientY) {
    const offset = 24;
    const previewWidth  = workPreview.offsetWidth  || 240;
    const previewHeight = workPreview.offsetHeight || 160;

    let left = clientX + offset;
    let top  = clientY + offset;

    if (left + previewWidth > window.innerWidth - 12) {
      left = clientX - offset - previewWidth;
    }
    if (top + previewHeight > window.innerHeight - 12) {
      top = clientY - offset - previewHeight;
    }

    workPreview.style.left = `${left}px`;
    workPreview.style.top = `${top}px`;
  }

  document.querySelectorAll('.work-row[data-card], .experiment-row[data-card]').forEach(row => {
    const data = cardData[row.dataset.card];
    const previewBg = data && (data.previewImage || data.heroImage);
    const previewOverlay = data && (data.previewOverlayImage || data.overlayImage);
    if (!data || (!previewBg && !previewOverlay)) return;

    row.addEventListener('mouseenter', e => {
      if (!postcardExpanded) return;
      workPreview.style.backgroundImage = previewBg ? `url('${previewBg}')` : '';
      workPreview.innerHTML = previewOverlay
        ? `<img src="${previewOverlay}" alt="" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);max-width:${data.overlaySize || '80%'};max-height:${data.overlaySize || '80%'};object-fit:contain;border-radius:${data.overlayRadius || '0'};">`
        : '';
      positionWorkPreview(e.clientX, e.clientY);
      workPreview.classList.add('is-visible');
    });

    row.addEventListener('mousemove', e => {
      if (!postcardExpanded) return;
      positionWorkPreview(e.clientX, e.clientY);
    });

    row.addEventListener('mouseleave', () => {
      workPreview.classList.remove('is-visible');
    });
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

      // Atlas has its own sticky back button — hide the shared ✕ for it only
      detailClose.style.display = data.templateId === 'atlas-content' ? 'none' : '';

      const heroEl = document.getElementById('projectDetailImage');
      if (data.heroImage) {
        heroEl.style.display = '';
        heroEl.style.backgroundImage = `url('${data.heroImage}')`;
        heroEl.style.backgroundSize  = 'cover';
        heroEl.style.backgroundPosition = 'center';
        heroEl.style.backgroundColor = 'transparent';
        heroEl.style.position = 'relative';
        heroEl.innerHTML = data.overlayImage
          ? `<img src="${data.overlayImage}" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);max-width:${data.overlaySize || '80%'};max-height:${data.overlaySize || '80%'};object-fit:contain;">`
          : '';
      } else {
        heroEl.style.display = 'none';
        heroEl.style.backgroundImage = '';
        heroEl.innerHTML = '';
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
      const lightboxImage = document.getElementById('csVideoLightboxImage');
      const lightboxClose = document.getElementById('csVideoLightboxClose');

      const closeLightbox = () => {
        lightbox.classList.remove('is-open');
        lightboxVideo.pause();
        lightboxVideo.src = '';
        lightboxImage.src = '';
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
          lightboxImage.style.display = 'none';
          lightboxVideo.style.display = '';
          lightboxVideo.src = video.src;
          lightboxVideo.load();
          lightboxVideo.play();
          lightbox.classList.add('is-open');
        });

        wrap.appendChild(toggleBtn);
        wrap.appendChild(expandBtn);
      });

      // Image expand buttons
      customSlot.querySelectorAll('.cs-img-placeholder').forEach(wrap => {
        const img = wrap.querySelector('img');
        if (!img || wrap.hasAttribute('data-no-expand')) return;

        const expandBtn = document.createElement('button');
        expandBtn.className = 'cs-img-expand';
        expandBtn.setAttribute('aria-label', 'Expand');
        expandBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M1 5V1h4M11 7v4H7M1 5l4-4M11 7l-4 4"/></svg>`;
        expandBtn.addEventListener('click', () => {
          lightboxVideo.pause();
          lightboxVideo.style.display = 'none';
          lightboxImage.style.display = '';
          lightboxImage.src = img.src;
          lightbox.classList.add('is-open');
        });

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

      // Inline case-study cross-links
      customSlot.querySelectorAll('[data-open-case]').forEach(link => {
        link.addEventListener('click', e => {
          e.preventDefault();
          detailModal.scrollTop = 0;
          openProjectDetail(link.dataset.openCase);
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

      // Active section = the last one (in page order) whose top has scrolled
      // up past the activation line. Computed directly from live geometry on
      // every scroll/resize rather than from ambiguous overlapping
      // IntersectionObserver states, since a tall section and the short one
      // right after it can be simultaneously "intersecting" — this picks
      // whichever one the user has actually scrolled to, unambiguously.
      let activeId = null;
      const ACTIVATION_LINE = 120; // px from top of modal

      function updateActiveSection() {
        const modalTop = modal.getBoundingClientRect().top;
        let current = null;
        sections.forEach(s => {
          const relTop = s.getBoundingClientRect().top - modalTop;
          if (relTop <= ACTIVATION_LINE) current = s;
        });
        if (current && current.id !== activeId) {
          activeId = current.id;
          navItems.forEach(item =>
            item.classList.toggle('is-active', item.dataset.target === activeId)
          );
        }
      }

      let scrollSpyTicking = false;
      modal.addEventListener('scroll', () => {
        if (scrollSpyTicking) return;
        scrollSpyTicking = true;
        requestAnimationFrame(() => {
          updateActiveSection();
          scrollSpyTicking = false;
        });
      });
      // Play-on-scroll for videos that need sound (can't use native autoplay)
      customSlot.querySelectorAll('video[data-scroll-autoplay]').forEach(video => {
        const scrollPlayObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              video.play().catch(err => console.warn('scroll-autoplay blocked:', err.name, err.message));
            } else {
              video.pause();
            }
          });
        }, { root: modal, threshold: 0.3 });
        scrollPlayObserver.observe(video);
      });


      detailModal.classList.add('is-expanded');
      detailOverlay.classList.add('is-open');
      document.body.classList.add('modal-open');
      requestAnimationFrame(updateActiveSection);
      return;
    }

    // Standard data-driven projects
    customSlot.style.display  = 'none';
    standardSlot.style.display = '';
    detailClose.style.display = '';

    detailTitle.textContent = data.title;
    detailTags.innerHTML    = data.tags.map(t => `<span class="tag">${t}</span>`).join('');

    const heroEl = document.getElementById('projectDetailImage');
    if (data.heroImage) {
      heroEl.style.display = '';
      heroEl.style.backgroundImage = `url('${data.heroImage}')`;
      heroEl.style.backgroundSize = 'cover';
      heroEl.style.backgroundPosition = 'center';
      heroEl.style.backgroundColor = 'transparent';
      heroEl.style.position = 'relative';
      heroEl.innerHTML = data.overlayImage
        ? `<img src="${data.overlayImage}" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);max-width:80%;max-height:80%;object-fit:contain;border-radius:10px;">`
        : '';
    } else {
      heroEl.style.display = 'none';
      heroEl.style.backgroundImage = '';
      heroEl.innerHTML = '';
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

    detailModal.classList.add('is-expanded');
    detailOverlay.classList.add('is-open');
    document.body.classList.add('modal-open');
  }

  const detailModal = document.querySelector('.project-detail-modal');

  detailClose.addEventListener('click', () => {
    detailModal.classList.remove('is-expanded');
    detailOverlay.classList.remove('is-open');
    document.body.classList.remove('modal-open');
  });

  // Atlas back link (delegated since template content is re-cloned per open)
  customSlot.addEventListener('click', e => {
    if (e.target.closest('[data-atlas-back]')) {
      e.preventDefault();
      detailClose.click();
    }
  });

  // ── Postcard pop-out ──────────────────────────────────
  const postcardEl = document.getElementById('postcard');
  const backdrop   = document.createElement('div');
  backdrop.className = 'postcard-backdrop';
  document.body.appendChild(backdrop);

  let postcardExpanded = false;
  const compressBtn = document.getElementById('postcardCompress');

  function openPostcard() {
    if (postcardExpanded || !postcardEl.classList.contains('revealed')) return;
    postcardExpanded = true;
    postcardEl.classList.add('is-expanded');
    backdrop.classList.add('is-open');
    if (compressBtn) compressBtn.classList.add('is-visible');
  }

  function closePostcard() {
    if (!postcardExpanded) return;
    postcardExpanded = false;
    postcardEl.classList.remove('is-expanded');
    postcardEl.classList.add('is-collapsing');
    backdrop.classList.remove('is-open');
    if (compressBtn) compressBtn.classList.remove('is-visible');
    document.body.classList.remove('cursor-hover');
    workPreview.classList.remove('is-visible');
    postcardEl.addEventListener('animationend', () => {
      postcardEl.classList.remove('is-collapsing');
    }, { once: true });
  }

  // Placeholder intro links (href="#") shouldn't jump the page
  postcardEl.querySelectorAll('.postcard-link[href="#"]').forEach(link => {
    link.addEventListener('click', e => e.preventDefault());
  });

  postcardEl.addEventListener('click', e => {
    if (e.target.closest('.work-row, .experiment-row')) return;
    if (!postcardExpanded) openPostcard();
  });

  backdrop.addEventListener('click', closePostcard);
  if (compressBtn) compressBtn.addEventListener('click', closePostcard);

  // Cursor hint on postcard hover
  postcardEl.addEventListener('mouseenter', () => {
    if (postcardExpanded) return;
    dot.textContent = 'Open';
    document.body.classList.add('cursor-hover');
  });
  postcardEl.addEventListener('mouseleave', () => {
    if (postcardExpanded) return;
    document.body.classList.remove('cursor-hover');
  });

});
