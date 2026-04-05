/**
 * ============================================================
 * NAMU SPACES — Main JS (main.js)
 * Shared utilities for all public-facing pages.
 * Handles: navigation, WhatsApp FAB, consultation modal,
 * scroll animations, toast notifications, page loader.
 * ============================================================
 */

/* ===================== PAGE LOADER ===================== */
function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 900);
  });
}

/* ===================== NAVIGATION ===================== */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMobile = document.getElementById('nav-mobile');

  if (!navbar) return;

  // Scroll behaviour
  const isTransparent = navbar.classList.contains('transparent');
  function handleScroll() {
    if (isTransparent) {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
      navbar.classList.toggle('transparent', window.scrollY <= 60);
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile toggle
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.classList.toggle('open');
      navMobile.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on mobile link click
    navMobile.querySelectorAll('.nav-link, .btn').forEach(el => {
      el.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMobile.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ===================== WHATSAPP FAB ===================== */
function initWhatsApp() {
  const settings = NamuDB.getSettings();
  const fab = document.getElementById('whatsapp-fab');
  if (!fab) return;
  const num = settings.whatsapp || '254796975533';
  const msg = encodeURIComponent('Hello Namu Spaces! I\'d like to enquire about your interior design services.');
  fab.href = `https://wa.me/${num}?text=${msg}`;
  fab.target = '_blank';
  fab.rel = 'noopener noreferrer';
}

/* ===================== CONSULTATION MODAL ===================== */
function initConsultationModal() {
  const overlay = document.getElementById('consultation-modal');
  if (!overlay) return;

  const modal = overlay.querySelector('.modal');
  const form = document.getElementById('consultation-form');
  const closeBtn = overlay.querySelector('.modal-close');

  // Open triggers
  document.querySelectorAll('[data-open-modal="consultation"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Close
  closeBtn?.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  function openModal() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Form submit
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const data = Object.fromEntries(new FormData(form));
      data.type = 'consultation';
      NamuDB.addInquiry(data);
      showToast('Thank you! We\'ll be in touch within 24 hours.', 'success');
      form.reset();
      closeModal();
    } catch (err) {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}

/* ===================== TOAST NOTIFICATIONS ===================== */
function showToast(message, type = 'success', duration = 4000) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

/* ===================== SCROLL ANIMATIONS ===================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ===================== TESTIMONIAL SLIDER ===================== */
function initTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  const dotsContainer = document.querySelector('.slider-controls');
  if (!track) return;

  // Don't initialise on an empty track — homepage populates it after main.js runs
  const slides = track.querySelectorAll('.testimonial-slide');
  if (!slides.length) return;

  let current = 0;
  let interval;

  // Build dots
  if (dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  }

  function goTo(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer?.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function next() { goTo((current + 1) % slides.length); }

  function startAuto() { interval = setInterval(next, 5000); }
  function stopAuto() { clearInterval(interval); }

  track.parentElement?.addEventListener('mouseenter', stopAuto);
  track.parentElement?.addEventListener('mouseleave', startAuto);
  startAuto();
}

/* ===================== CONTACT FORM ===================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const data = Object.fromEntries(new FormData(form));
      data.type = 'contact';
      NamuDB.addInquiry(data);
      showToast('Message sent! We\'ll respond within 24 hours.', 'success');
      form.reset();
    } catch (err) {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}

/* ===================== PORTFOLIO FILTER ===================== */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      renderPortfolio(cat);
    });
  });

  renderPortfolio('all');
}

function renderPortfolio(category) {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;
  const items = NamuDB.getPortfolio(category);

  if (!items.length) {
    grid.innerHTML = '<div class="empty-state"><div class="empty-icon">🏗️</div><p>No projects in this category yet.</p></div>';
    return;
  }

  grid.innerHTML = items.map(item => `
    <div class="portfolio-item" onclick="openProject(${item.id})" role="button" tabindex="0"
         aria-label="View project: ${item.title}">
      <img src="${item.image}" alt="${item.title}" loading="lazy"
           onerror="this.src='https://placehold.co/600x400/e8d9c0/8c5e3c?text=Project'">
      <div class="portfolio-overlay">
        <h3>${item.title}</h3>
        <span>${formatCategory(item.category)} · ${item.year}</span>
      </div>
    </div>
  `).join('');
}

function formatCategory(cat) {
  const map = { residential: 'Residential', commercial: 'Commercial', office: 'Office' };
  return map[cat] || cat;
}

function openProject(id) {
  const item = NamuDB.getPortfolio('all').find(p => p.id === id);
  if (!item) return;

  let overlay = document.getElementById('project-modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'project-modal-overlay';
    overlay.className = 'modal-overlay project-modal';
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="proj-title">
      <button class="modal-close" onclick="closeProjectModal()" aria-label="Close">×</button>
      <div class="project-modal-img">
        <img src="${item.image}" alt="${item.title}"
             onerror="this.src='https://placehold.co/800x450/e8d9c0/8c5e3c?text=Project'">
      </div>
      <div class="project-modal-body">
        <span class="card-tag">${formatCategory(item.category)}</span>
        <h2 id="proj-title">${item.title}</h2>
        <div class="project-meta">
          <div class="project-meta-item"><strong>Location</strong>${item.location}</div>
          <div class="project-meta-item"><strong>Year</strong>${item.year}</div>
        </div>
        <p>${item.description}</p>
        <div class="d-flex gap-1 mt-2" style="flex-wrap:wrap;">
          <button class="btn btn-primary btn-sm" data-open-modal="consultation">Book Similar Project</button>
        </div>
      </div>
    </div>`;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeProjectModal();
  });

  // Re-bind modal triggers inside project modal
  overlay.querySelectorAll('[data-open-modal="consultation"]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeProjectModal();
      document.getElementById('consultation-modal')?.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
}

function closeProjectModal() {
  const overlay = document.getElementById('project-modal-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ===================== BLOG RENDER ===================== */
function renderBlogCards(containerId, limit = 99) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const posts = NamuDB.getBlogPosts().slice(0, limit);

  if (!posts.length) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">✍️</div><p>No articles published yet.</p></div>';
    return;
  }

  container.innerHTML = posts.map(post => `
    <article class="blog-card reveal">
      <div class="blog-card-img">
        <img src="${post.image}" alt="${post.title}" loading="lazy"
             onerror="this.src='https://placehold.co/600x380/e8d9c0/8c5e3c?text=Article'">
      </div>
      <div class="blog-card-body">
        <div class="blog-meta">
          <span class="blog-cat">${post.category}</span>
          <span class="blog-date">${NamuDB.formatDate(post.date)}</span>
        </div>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <a href="blog.html?id=${post.id}" class="blog-read-more">Read Article →</a>
      </div>
    </article>
  `).join('');

  initScrollAnimations();
}

/* ===================== SERVICES RENDER ===================== */
function renderServiceCards(containerId, featuredOnly = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const services = featuredOnly ? NamuDB.getFeaturedServices() : NamuDB.getServices();

  if (!services.length) {
    container.innerHTML = '<div class="empty-state"><p>Services coming soon.</p></div>';
    return;
  }

  container.innerHTML = services.map(svc => `
    <div class="service-card reveal">
      <div class="service-card-img">
        <img src="${svc.image}" alt="${svc.title}" loading="lazy"
             onerror="this.src='https://placehold.co/600x340/e8d9c0/8c5e3c?text=Service'">
      </div>
      <div class="service-card-body">
        <div class="service-icon">${svc.icon}</div>
        <h3>${svc.title}</h3>
        <p>${svc.excerpt || svc.description.substring(0, 120) + '…'}</p>
        <span class="price-badge">${svc.price}</span>
        <div style="margin-top:1.2rem;">
          <button class="btn btn-outline btn-sm" data-open-modal="consultation">Enquire</button>
        </div>
      </div>
    </div>
  `).join('');

  // Rebind modal triggers
  container.querySelectorAll('[data-open-modal="consultation"]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('consultation-modal')?.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  initScrollAnimations();
}

/* ===================== TESTIMONIALS RENDER ===================== */
function renderTestimonials() {
  const track = document.querySelector('.testimonial-track');
  if (!track) return;

  const testimonials = NamuDB.getTestimonials();
  if (!testimonials.length) { track.parentElement.style.display = 'none'; return; }

  track.innerHTML = testimonials.map(t => `
    <div class="testimonial-slide">
      <div class="testimonial-card">
        <p class="testimonial-quote">"${t.quote}"</p>
        <div class="testimonial-author">
          <img src="${t.image}" alt="${t.name}"
               onerror="this.src='https://placehold.co/80/e8d9c0/8c5e3c?text=${t.name.charAt(0)}'">
          <div class="author-info">
            <div class="author-name">${t.name}</div>
            <div class="author-title">${t.role}</div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

/* ===================== POPULATE SITE SETTINGS ===================== */
function populateSiteSettings() {
  const s = NamuDB.getSettings();

  // Update all whatsapp links
  const waLinks = document.querySelectorAll('[data-wa-link]');
  const waMsg = encodeURIComponent('Hello Namu Spaces! I\'d like to enquire about your interior design services.');
  waLinks.forEach(el => { el.href = `https://wa.me/${s.whatsapp}?text=${waMsg}`; });

  // Social links
  document.querySelectorAll('[data-social="instagram"]').forEach(el => { el.href = s.instagram; });
  document.querySelectorAll('[data-social="tiktok"]').forEach(el => { el.href = s.tiktok; });
  document.querySelectorAll('[data-social="facebook"]').forEach(el => { el.href = s.facebook; });
  document.querySelectorAll('[data-social="pinterest"]').forEach(el => { el.href = s.pinterest; });

  // Contact info
  document.querySelectorAll('[data-setting="phone"]').forEach(el => { el.textContent = s.phone; });
  document.querySelectorAll('[data-setting="email"]').forEach(el => { el.textContent = s.email; });
  document.querySelectorAll('[data-setting="address"]').forEach(el => { el.textContent = s.address; });

  // Business hours
  if (s.businessHours) {
    document.querySelectorAll('[data-setting="hours-monfri"]').forEach(el => { el.textContent = s.businessHours.monFri; });
    document.querySelectorAll('[data-setting="hours-sat"]').forEach(el => { el.textContent = s.businessHours.saturday; });
    document.querySelectorAll('[data-setting="hours-sun"]').forEach(el => { el.textContent = s.businessHours.sunday; });
  }
}

/* ===================== BLOG POST READER ===================== */
function initBlogReader() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');
  const container = document.getElementById('blog-post-content');
  if (!container) return;

  if (!postId) {
    renderBlogCards('blog-grid');
    return;
  }

  const post = NamuDB.getBlogPost(parseInt(postId));
  if (!post) {
    container.innerHTML = '<div class="empty-state"><p>Article not found.</p></div>';
    return;
  }

  document.title = `${post.title} — Namu Spaces`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = post.excerpt;

  container.innerHTML = `
    <div class="blog-detail-content">
      <div class="breadcrumb">
        <a href="blog.html">Blog</a> / <span>${post.category}</span>
      </div>
      <h1 style="margin-bottom:1rem;">${post.title}</h1>
      <div class="blog-meta" style="margin-bottom:2rem;">
        <span class="blog-cat">${post.category}</span>
        <span class="blog-date">By ${post.author} · ${NamuDB.formatDate(post.date)}</span>
      </div>
      <div class="blog-detail-hero">
        <img src="${post.image}" alt="${post.title}" loading="lazy"
             onerror="this.src='https://placehold.co/900x400/e8d9c0/8c5e3c?text=Article'">
      </div>
      ${post.content}
    </div>`;
}

/* ===================== INIT ALL ===================== */
document.addEventListener('DOMContentLoaded', () => {
  NamuDB.init();
  initLoader();
  initNavigation();
  initWhatsApp();
  initConsultationModal();
  initScrollAnimations();
  populateSiteSettings();
  // Note: initTestimonialSlider() is called by individual pages AFTER
  // renderTestimonials() populates the track. Calling it here on an empty
  // track is a no-op (guarded above), but skip it to keep intent clear.
  initContactForm();
  initPortfolioFilter();
  initBlogReader();
});
