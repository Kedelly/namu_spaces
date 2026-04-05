/**
 * ============================================================
 * NAMU SPACES — Main JS (main.js)
 * All NamuDB calls are now async (Firestore).
 * Every render function is async and awaits data.
 * ============================================================
 */

/* ===================== FIREBASE SCRIPTS TAG =====================
   All HTML pages must load Firebase + config BEFORE this file:
   <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
   <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
   <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
   <script src="js/firebase-config.js"></script>
   <script src="js/db.js"></script>
   <script src="js/main.js"></script>
================================================================= */

/* ===================== PAGE LOADER ===================== */
function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  window.addEventListener('load', () => setTimeout(() => loader.classList.add('hidden'), 700));
}

/* ===================== NAVIGATION ===================== */
function initNavigation() {
  const navbar    = document.querySelector('.navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMobile = document.getElementById('nav-mobile');
  if (!navbar) return;

  const isTransparent = navbar.classList.contains('transparent');
  function handleScroll() {
    if (isTransparent) {
      navbar.classList.toggle('scrolled',     window.scrollY > 60);
      navbar.classList.toggle('transparent',  window.scrollY <= 60);
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.classList.toggle('open');
      navMobile.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navMobile.querySelectorAll('.nav-link, .btn').forEach(el =>
      el.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMobile.classList.remove('open');
        document.body.style.overflow = '';
      })
    );
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ===================== WHATSAPP FAB ===================== */
async function initWhatsApp() {
  const fab = document.getElementById('whatsapp-fab');
  if (!fab) return;
  try {
    const s = await NamuDB.getSettings();
    const num = s.whatsapp || '254796975533';
    const msg = encodeURIComponent("Hello Namu Spaces! I'd like to enquire about your interior design services.");
    const url = `https://wa.me/${num}?text=${msg}`;
    document.querySelectorAll('[data-wa-link]').forEach(el => { el.href = url; el.target = '_blank'; el.rel = 'noopener noreferrer'; });
  } catch (e) { console.warn('[WhatsApp] Could not load settings:', e); }
}

/* ===================== CONSULTATION MODAL ===================== */
function initConsultationModal() {
  const overlay = document.getElementById('consultation-modal');
  if (!overlay) return;

  const form    = document.getElementById('consultation-form');
  const closeBtn = overlay.querySelector('.modal-close');

  document.querySelectorAll('[data-open-modal="consultation"]').forEach(btn =>
    btn.addEventListener('click', e => { e.preventDefault(); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; })
  );
  closeBtn?.addEventListener('click', () => { overlay.classList.remove('open'); document.body.style.overflow = ''; });
  overlay.addEventListener('click', e => { if (e.target === overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { overlay.classList.remove('open'); document.body.style.overflow = ''; } });

  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Sending…'; btn.disabled = true;
    try {
      const data = Object.fromEntries(new FormData(form));
      data.type = 'consultation';
      await NamuDB.addInquiry(data);
      showToast("Thank you! We'll be in touch within 24 hours.", 'success');
      form.reset();
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    } catch (err) {
      showToast('Something went wrong. Please try again.', 'error');
    } finally { btn.textContent = orig; btn.disabled = false; }
  });
}

/* ===================== TOAST ===================== */
function showToast(message, type = 'success', duration = 4000) {
  let toast = document.getElementById('ns-toast');
  if (!toast) { toast = document.createElement('div'); toast.id = 'ns-toast'; toast.className = 'toast'; document.body.appendChild(toast); }
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), duration);
}

/* ===================== SCROLL ANIMATIONS ===================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal:not(.visible)');
  if (!elements.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  elements.forEach(el => obs.observe(el));
}

/* ===================== TESTIMONIAL SLIDER ===================== */
function initTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  const dots  = document.querySelector('.slider-controls');
  if (!track) return;
  const slides = track.querySelectorAll('.testimonial-slide');
  if (!slides.length) return;

  let current = 0, interval;

  if (dots) {
    dots.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dots.appendChild(dot);
    });
  }

  function goTo(i) {
    current = i;
    track.style.transform = `translateX(-${i * 100}%)`;
    dots?.querySelectorAll('.slider-dot').forEach((d, j) => d.classList.toggle('active', j === i));
  }
  function next() { goTo((current + 1) % slides.length); }
  function start() { interval = setInterval(next, 5000); }
  function stop()  { clearInterval(interval); }

  track.parentElement?.addEventListener('mouseenter', stop);
  track.parentElement?.addEventListener('mouseleave', start);
  start();
}

/* ===================== CONTACT FORM ===================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Sending…'; btn.disabled = true;
    try {
      const data = Object.fromEntries(new FormData(form));
      data.type = 'contact';
      await NamuDB.addInquiry(data);
      showToast("Message sent! We'll respond within 24 hours.", 'success');
      form.reset();
    } catch (err) {
      showToast('Something went wrong. Please try again.', 'error');
    } finally { btn.textContent = orig; btn.disabled = false; }
  });
}

/* ===================== PORTFOLIO FILTER ===================== */
async function initPortfolioFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;

  btns.forEach(btn => btn.addEventListener('click', () => {
    btns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderPortfolio(btn.dataset.filter);
  }));

  await renderPortfolio('all');
}

async function renderPortfolio(category) {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;
  grid.innerHTML = '<div class="skeleton" style="height:280px;border-radius:12px;break-inside:avoid;"></div>'.repeat(3);
  try {
    const items = await NamuDB.getPortfolio(category);
    if (!items.length) {
      grid.innerHTML = '<div class="empty-state" style="column-span:all;"><div class="empty-icon">🏗️</div><p>No projects in this category yet.</p></div>';
      return;
    }
    grid.innerHTML = items.map(item => `
      <div class="portfolio-item" onclick="openProject('${item.id}')" role="button" tabindex="0"
           aria-label="View project: ${item.title}"
           onkeydown="if(event.key==='Enter')openProject('${item.id}')">
        <img src="${item.image}" alt="${item.title}" loading="lazy"
             onerror="this.src='https://picsum.photos/seed/proj-fb/600/400'">
        <div class="portfolio-overlay">
          <h3>${item.title}</h3>
          <span>${formatCategory(item.category)} · ${item.year}</span>
        </div>
      </div>`).join('');
  } catch (e) {
    grid.innerHTML = '<div class="empty-state"><p>Could not load portfolio. Please check your connection.</p></div>';
    console.error('[renderPortfolio]', e);
  }
}

function formatCategory(cat) {
  return { residential: 'Residential', commercial: 'Commercial', office: 'Office' }[cat] || cat;
}

async function openProject(id) {
  let overlay = document.getElementById('project-modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'project-modal-overlay';
    overlay.className = 'modal-overlay project-modal';
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = '<div class="modal" style="display:flex;align-items:center;justify-content:center;min-height:300px;"><div class="skeleton" style="width:100%;height:300px;border-radius:8px;"></div></div>';
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  overlay.addEventListener('click', e => { if (e.target === overlay) closeProjectModal(); });

  try {
    const item = await NamuDB._db.collection('portfolio').doc(id).get();
    if (!item.exists) { closeProjectModal(); return; }
    const p = { id: item.id, ...item.data() };
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <button class="modal-close" onclick="closeProjectModal()">×</button>
        <div class="project-modal-img"><img src="${p.image}" alt="${p.title}" onerror="this.src='https://picsum.photos/seed/proj/800/450'"></div>
        <div class="project-modal-body">
          <span class="card-tag">${formatCategory(p.category)}</span>
          <h2>${p.title}</h2>
          <div class="project-meta">
            <div class="project-meta-item"><strong>Location</strong>${p.location || ''}</div>
            <div class="project-meta-item"><strong>Year</strong>${p.year || ''}</div>
          </div>
          <p>${p.description || ''}</p>
          <div class="d-flex gap-1 mt-2" style="flex-wrap:wrap;">
            <button class="btn btn-primary btn-sm" data-open-modal="consultation">Book Similar Project</button>
          </div>
        </div>
      </div>`;
    overlay.querySelectorAll('[data-open-modal="consultation"]').forEach(btn =>
      btn.addEventListener('click', () => {
        closeProjectModal();
        document.getElementById('consultation-modal')?.classList.add('open');
        document.body.style.overflow = 'hidden';
      })
    );
  } catch (e) {
    overlay.innerHTML = '<div class="modal"><button class="modal-close" onclick="closeProjectModal()">×</button><div style="padding:3rem;text-align:center;"><p>Could not load project details.</p></div></div>';
  }
}

function closeProjectModal() {
  const overlay = document.getElementById('project-modal-overlay');
  if (overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
}

/* ===================== BLOG RENDER ===================== */
async function renderBlogCards(containerId, limit = 99) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '<div class="skeleton" style="height:400px;border-radius:12px;"></div>'.repeat(Math.min(limit, 3));
  try {
    const posts = (await NamuDB.getBlogPosts()).slice(0, limit);
    if (!posts.length) {
      container.innerHTML = '<div class="empty-state"><div class="empty-icon">✍️</div><p>No articles published yet.</p></div>';
      return;
    }
    container.innerHTML = posts.map(post => `
      <article class="blog-card reveal">
        <div class="blog-card-img">
          <img src="${post.image}" alt="${post.title}" loading="lazy"
               onerror="this.src='https://picsum.photos/seed/blog-fb/600/380'">
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
      </article>`).join('');
    initScrollAnimations();
  } catch (e) {
    container.innerHTML = '<div class="empty-state"><p>Could not load articles.</p></div>';
    console.error('[renderBlogCards]', e);
  }
}

/* ===================== SERVICES RENDER ===================== */
async function renderServiceCards(containerId, featuredOnly = false) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '<div class="skeleton" style="height:420px;border-radius:12px;"></div>'.repeat(featuredOnly ? 3 : 5);
  try {
    const services = featuredOnly ? await NamuDB.getFeaturedServices() : await NamuDB.getServices();
    if (!services.length) {
      container.innerHTML = '<div class="empty-state"><p>Services coming soon.</p></div>';
      return;
    }
    container.innerHTML = services.map(svc => `
      <div class="service-card reveal">
        <div class="service-card-img">
          <img src="${svc.image}" alt="${svc.title}" loading="lazy"
               onerror="this.src='https://picsum.photos/seed/svc-fb/600/340'">
        </div>
        <div class="service-card-body">
          <div class="service-icon">${svc.icon}</div>
          <h3>${svc.title}</h3>
          <p>${svc.excerpt || (svc.description || '').substring(0, 120) + '…'}</p>
          <span class="price-badge">${svc.price}</span>
          <div style="margin-top:1.2rem;">
            <button class="btn btn-outline btn-sm" data-open-modal="consultation">Enquire</button>
          </div>
        </div>
      </div>`).join('');
    container.querySelectorAll('[data-open-modal="consultation"]').forEach(btn =>
      btn.addEventListener('click', () => {
        document.getElementById('consultation-modal')?.classList.add('open');
        document.body.style.overflow = 'hidden';
      })
    );
    initScrollAnimations();
  } catch (e) {
    container.innerHTML = '<div class="empty-state"><p>Could not load services.</p></div>';
    console.error('[renderServiceCards]', e);
  }
}

/* ===================== TESTIMONIALS RENDER ===================== */
async function renderTestimonials() {
  const track = document.querySelector('.testimonial-track');
  if (!track) return;
  try {
    const list = await NamuDB.getTestimonials();
    if (!list.length) { track.closest('section')?.style.setProperty('display','none'); return; }
    track.innerHTML = list.map(t => `
      <div class="testimonial-slide">
        <div class="testimonial-card">
          <p class="testimonial-quote">"${t.quote}"</p>
          <div class="testimonial-author">
            <img src="${t.image}" alt="${t.name}"
                 onerror="this.src='https://picsum.photos/seed/avi/80/80'">
            <div class="author-info">
              <div class="author-name">${t.name}</div>
              <div class="author-title">${t.role}</div>
            </div>
          </div>
        </div>
      </div>`).join('');
  } catch (e) { console.error('[renderTestimonials]', e); }
}

/* ===================== POPULATE SITE SETTINGS ===================== */
async function populateSiteSettings() {
  try {
    const s = await NamuDB.getSettings();
    const waMsg = encodeURIComponent("Hello Namu Spaces! I'd like to enquire about your interior design services.");
    const waUrl = `https://wa.me/${s.whatsapp || '254796975533'}?text=${waMsg}`;
    document.querySelectorAll('[data-wa-link]').forEach(el => { el.href = waUrl; el.target = '_blank'; el.rel = 'noopener'; });
    document.querySelectorAll('[data-social="instagram"]').forEach(el => { el.href = s.instagram || '#'; });
    document.querySelectorAll('[data-social="tiktok"]').forEach(el => { el.href = s.tiktok || '#'; });
    document.querySelectorAll('[data-social="facebook"]').forEach(el => { el.href = s.facebook || '#'; });
    document.querySelectorAll('[data-social="pinterest"]').forEach(el => { el.href = s.pinterest || '#'; });
    document.querySelectorAll('[data-setting="phone"]').forEach(el => { el.textContent = s.phone || ''; });
    document.querySelectorAll('[data-setting="email"]').forEach(el => { el.textContent = s.email || ''; if (el.tagName === 'A') el.href = 'mailto:' + s.email; });
    document.querySelectorAll('[data-setting="address"]').forEach(el => { el.textContent = s.address || ''; });
    if (s.businessHours) {
      document.querySelectorAll('[data-setting="hours-monfri"]').forEach(el => { el.textContent = s.businessHours.monFri || ''; });
      document.querySelectorAll('[data-setting="hours-sat"]').forEach(el => { el.textContent = s.businessHours.saturday || ''; });
      document.querySelectorAll('[data-setting="hours-sun"]').forEach(el => { el.textContent = s.businessHours.sunday || ''; });
    }
  } catch (e) { console.warn('[populateSiteSettings]', e); }
}

/* ===================== BLOG POST READER ===================== */
async function initBlogReader() {
  const postId    = new URLSearchParams(window.location.search).get('id');
  const container = document.getElementById('blog-post-content');
  if (!container) return;

  if (!postId) { await renderBlogCards('blog-grid'); return; }

  container.innerHTML = '<div class="skeleton" style="height:400px;border-radius:12px;margin-bottom:2rem;"></div><div class="skeleton" style="height:24px;border-radius:4px;margin-bottom:1rem;width:60%;"></div><div class="skeleton" style="height:18px;border-radius:4px;margin-bottom:0.5rem;"></div><div class="skeleton" style="height:18px;border-radius:4px;width:80%;"></div>';
  try {
    const post = await NamuDB.getBlogPost(postId);
    if (!post) { container.innerHTML = '<div class="empty-state"><p>Article not found.</p><a href="blog.html" class="btn btn-outline mt-2">Back to Blog</a></div>'; return; }
    document.title = `${post.title} — Namu Spaces`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = post.excerpt || '';
    container.innerHTML = `
      <div class="blog-detail-content">
        <div class="breadcrumb"><a href="blog.html">Blog</a> / <span>${post.category}</span></div>
        <h1 style="margin-bottom:1rem;">${post.title}</h1>
        <div class="blog-meta" style="margin-bottom:2rem;">
          <span class="blog-cat">${post.category}</span>
          <span class="blog-date">By ${post.author} · ${NamuDB.formatDate(post.date)}</span>
        </div>
        <div class="blog-detail-hero">
          <img src="${post.image}" alt="${post.title}" loading="lazy"
               onerror="this.src='https://picsum.photos/seed/blog-single/900/400'">
        </div>
        ${post.content || ''}
      </div>`;
  } catch (e) {
    container.innerHTML = '<div class="empty-state"><p>Could not load article. Please check your connection.</p></div>';
  }
}

/* ===================== INIT ALL ===================== */
document.addEventListener('DOMContentLoaded', async () => {
  initLoader();
  initNavigation();
  initConsultationModal();
  initScrollAnimations();
  initContactForm();
  initPortfolioFilter();

  // Async init — runs in parallel for speed
  await Promise.all([
    populateSiteSettings(),
    initWhatsApp(),
  ]);

  initBlogReader();
});
