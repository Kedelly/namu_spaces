/**
 * ============================================================
 * NAMU SPACES — Database Management (db.js)
 * Uses localStorage as a client-side database.
 * All website content is stored here and read on every page load.
 * Admin panel reads and writes to this database.
 * ============================================================
 */

const NamuDB = (() => {
  const DB_KEY = 'namu_spaces_db';
  const VERSION = '1.1.0';

  /* ===================== DEFAULT SEED DATA ===================== */
  const defaultData = {
    version: VERSION,
    settings: {
      siteName: 'Namu Spaces',
      tagline: 'Functional. Calm. Intentional.',
      description: 'Namu Spaces is a Kenyan interior design studio focused on creating thoughtful, functional, and beautiful interiors.',
      phone: '+254 796 975 533',
      whatsapp: '254796975533',
      email: 'wabombamedina60@gmail.com',
      address: 'Design Studio, Nairobi, Kenya',
      instagram: 'https://www.instagram.com/namu_spaces?igsh=YzljYTk1ODg3Zg==',
      tiktok: 'https://vm.tiktok.com/ZMHKoCaAnbgMd-tQvB0/',
      facebook: 'https://facebook.com/namuspaces',
      pinterest: 'https://pinterest.com/namuspaces',
      heroImage: 'https://picsum.photos/seed/hero-interior/1200/900',
      aboutImage: 'https://picsum.photos/seed/blog-nature/900/600',
      businessHours: {
        monFri: '8:00 AM – 6:00 PM',
        saturday: '9:00 AM – 4:00 PM',
        sunday: 'By Appointment'
      }
    },

    services: [
      {
        id: 1,
        title: 'Interior Design Consultation',
        excerpt: 'A focused session to understand your space, needs, and vision.',
        description: 'Our consultation service is the ideal starting point for your interior design journey. In a thorough 2–3 hour session, we explore your space, lifestyle preferences, and design aspirations. You will receive professional advice on colour palettes, furniture placement, lighting, and décor all tailored to your unique vision and budget.',
        price: 'From KES 15,000',
        duration: '2–3 Hours',
        icon: '🏡',
        image: 'https://picsum.photos/seed/consult-svc/800/500',
        featured: true,
        order: 1
      },
      {
        id: 2,
        title: 'Space Planning & Layout',
        excerpt: 'Optimise every square metre of your home or office.',
        description: 'Great design starts with smart planning. We create detailed floor plans and spatial layouts that maximise flow, function, and comfort. Whether you have a compact apartment in Westlands or a spacious villa in Karen, we design with purpose ensuring every room works beautifully for the people who use it.',
        price: 'From KES 25,000',
        duration: '3–5 Days',
        icon: '📐',
        image: 'https://picsum.photos/seed/planning-svc/800/500',
        featured: true,
        order: 2
      },
      {
        id: 3,
        title: 'Mood Boards & Design Concepts',
        excerpt: 'See your future space before a single piece of furniture moves.',
        description: 'We craft curated mood boards that capture the essence of your ideal space combining textures, colours, finishes, and furniture to paint a vivid picture of what your home could feel like. This service gives you clarity, confidence, and a creative direction before any purchasing decisions are made.',
        price: 'From KES 18,000',
        duration: '5–7 Days',
        icon: '🎨',
        image: 'https://picsum.photos/seed/moodboard-svc/800/500',
        featured: true,
        order: 3
      },
      {
        id: 4,
        title: '3D Render Designs',
        excerpt: 'Photorealistic visualisations of your space before it is built.',
        description: 'Experience your redesigned space in stunning detail with our professional 3D rendering service. We produce photorealistic digital visuals that let you see exactly how your interiors will look from the sofa fabric to the lighting ambience long before implementation begins. Perfect for clients who need clarity and precision.',
        price: 'From KES 35,000',
        duration: '7–14 Days',
        icon: '🖥️',
        image: 'https://picsum.photos/seed/renders-svc/800/500',
        featured: false,
        order: 4
      },
      {
        id: 5,
        title: 'Interior Styling',
        excerpt: 'The finishing touches that bring a space to life.',
        description: 'Interior styling is the art of the details the artwork, cushions, rugs, plants, and accessories that transform a room from functional to extraordinary. We source, select, and style every element with intention, ensuring your space feels curated, cohesive, and uniquely yours. Ideal for homes, show apartments, and commercial spaces.',
        price: 'From KES 20,000',
        duration: '1–3 Days',
        icon: '✨',
        image: 'https://picsum.photos/seed/styling-svc/800/500',
        featured: false,
        order: 5
      }
    ],

    portfolio: [
      {
        id: 1,
        title: 'The Serene Apartment — Kilimani',
        category: 'residential',
        description: 'A light-filled two-bedroom apartment transformed with earthy tones, natural materials, and thoughtful storage solutions. The brief was "calm and clutter-free." We delivered exactly that.',
        image: 'https://res.cloudinary.com/dswbdhom6/image/upload/v1775379739/Image_ku6za9.png',
        year: 2024,
        location: 'Kilimani, Nairobi',
        featured: true
      },
      {
        id: 2,
        title: 'Creative Co-Working Studio — Westlands',
        category: 'commercial',
        description: 'A dynamic co-working space designed to inspire productivity and collaboration. Warm wood tones, curved furniture, and biophilic elements create an environment people genuinely enjoy working in.',
        image: 'https://res.cloudinary.com/dswbdhom6/image/upload/v1775379712/WhatsApp_Image_2026-03-03_at_01.23.09_1_xc7ncc.jpg',
        year: 2024,
        location: 'Westlands, Nairobi',
        featured: true
      },
      {
        id: 3,
        title: 'The Karen Villa — Master Suite',
        category: 'residential',
        description: 'A luxurious master bedroom suite combining African-inspired textiles with contemporary furniture. The result is deeply personal and timelessly elegant.',
        image: 'https://picsum.photos/seed/bedroom-proj/900/700',
        year: 2024,
        location: 'Karen, Nairobi',
        featured: true
      },
      {
        id: 4,
        title: 'Boutique Law Office — CBD',
        category: 'office',
        description: 'A sophisticated office space that communicates trust and professionalism without feeling cold. Rich wood panelling, leather accents, and curated art create the perfect client impression.',
        image: 'https://picsum.photos/seed/office-proj/900/700',
        year: 2023,
        location: 'Nairobi CBD',
        featured: false
      },
      {
        id: 5,
        title: 'Open-Plan Family Home — Runda',
        category: 'residential',
        description: 'A family home redesign prioritising open flow, child-friendly materials, and spaces that grow with the family. The kitchen island became the heart of daily life.',
        image: 'https://picsum.photos/seed/family-proj/900/700',
        year: 2023,
        location: 'Runda, Nairobi',
        featured: false
      },
      {
        id: 6,
        title: 'Minimalist Therapy Studio — Lavington',
        category: 'commercial',
        description: 'A calming therapy and wellness studio designed to put clients immediately at ease. Soft neutrals, curved lines, and careful acoustic treatment create a sanctuary of calm.',
        image: 'https://picsum.photos/seed/therapy-proj/900/700',
        year: 2023,
        location: 'Lavington, Nairobi',
        featured: false
      }
    ],

    blog: [
      {
        id: 1,
        title: '5 Ways to Make a Small Nairobi Apartment Feel Bigger',
        excerpt: 'Living in a compact space doesn\'t mean sacrificing style or comfort. Here are five design strategies we use with our Nairobi clients to open up small apartments.',
        content: `<p>Nairobi's housing market means many of us are working with compact spaces — studio apartments in Kilimani, one-bedrooms in Westlands, or cosy units in South B. But a small footprint doesn't have to mean a cramped feel. At Namu Spaces, we've transformed dozens of petite Nairobi apartments into airy, functional homes.</p>

<h2>1. Embrace Light Colours</h2>
<p>Light, warm neutrals think cream, blush beige, soft sage reflect natural light and make walls feel further away. We particularly love warm whites with terracotta accents, a palette that feels both spacious and deeply Kenyan.</p>

<h2>2. Invest in Multi-Functional Furniture</h2>
<p>A bed with integrated storage, a dining table that folds against the wall, or a sofa that converts to a guest bed — multi-functional pieces are the backbone of smart small-space design. Every piece should work twice as hard.</p>

<h2>3. Use Vertical Space</h2>
<p>The wall space above eye level is often completely ignored. Tall bookshelves, wall-mounted art arrangements, and ceiling-height curtains draw the eye upward, creating the perception of height and space.</p>

<h2>4. Limit Visual Clutter</h2>
<p>In small spaces, every item is visible. We recommend a "love it or need it" rule for décor every object should earn its place. Closed storage for everyday items, and thoughtfully chosen accessories for personality.</p>

<h2>5. Use Mirrors Strategically</h2>
<p>A well-placed mirror can double the apparent size of a room. Opposite a window, a large mirror reflects natural light and creates a sense of depth. We love oversized, simple-framed mirrors as both functional and artistic elements.</p>

<p>Would you like us to transform your Nairobi apartment? <a href="contact.html">Get in touch</a> for a consultation.</p>`,
        author: 'Medina Wabomba',
        date: '2024-11-15',
        category: 'Design Tips',
        image: 'https://picsum.photos/seed/apart-proj/900/700',
        published: true
      },
      {
        id: 2,
        title: 'Biophilic Design: Bringing Nature Into Your Nairobi Home',
        excerpt: 'Nairobi is famously green. But are you bringing enough of that natural world inside? Biophilic design is the answer and it\'s more accessible than you think.',
        content: `<p>Nairobi sits at the edge of a national park, surrounded by greenery and blessed with extraordinary natural light. Yet many of our homes feel disconnected from the world outside. Biophilic design — the practice of connecting interiors with the natural world is changing that.</p>

<h2>What is Biophilic Design?</h2>
<p>Biophilic design is rooted in the idea that humans have an innate connection to nature. Spaces that incorporate natural elements plants, wood, stone, water, natural light, natural views make us feel calmer, more creative, and more productive.</p>

<h2>Plants as Architecture</h2>
<p>Large indoor plants fiddle-leaf figs, monstera, snake plants aren't just decorative. They define space, add height and texture, improve air quality, and create a sense of life and movement. We design around them like furniture.</p>

<h2>Natural Materials</h2>
<p>Wood, stone, rattan, linen, jute, leather materials that originated in nature bring warmth and grounding to any interior. We source locally where possible, celebrating Kenyan craft and materials.</p>

<h2>Light as a Design Element</h2>
<p>Natural light is free, beautiful, and transformative. We design around it placing seating near windows, using sheer curtains that allow light to filter warmly through, and positioning mirrors to redirect sunlight deeper into rooms.</p>

<p>Ready to bring more nature into your home? <a href="contact.html">Book a consultation</a> with our team.</p>`,
        author: 'Medina Wabomba',
        date: '2024-10-22',
        category: 'Design Trends',
        image: 'https://picsum.photos/seed/blog-nature/900/600',
        published: true
      },
      {
        id: 3,
        title: 'How to Choose the Right Colour Palette for Your Home',
        excerpt: 'Colour is the most powerful tool in an interior designer\'s kit. Here\'s how we approach colour selection for Kenyan homes and the principles we swear by.',
        content: `<p>Nothing transforms a space quite like colour. The right palette can make a room feel larger, warmer, more sophisticated, or more energising. At Namu Spaces, colour selection is one of the most exciting parts of our consultation process.</p>

<h2>Start with How You Want to Feel</h2>
<p>Before looking at paint swatches, ask yourself: how do I want to feel in this room? Calm and rested (bedroom)? Energised and creative (home office)? Warm and sociable (dining room)? Let the emotion guide the colour.</p>

<h2>The 60-30-10 Rule</h2>
<p>A classic interior design formula that always works: 60% dominant colour (walls, large furniture), 30% secondary colour (upholstery, curtains), and 10% accent colour (cushions, artwork, accessories). This creates a balanced, cohesive look.</p>

<h2>Consider Nairobi's Natural Light</h2>
<p>Nairobi's equatorial light is bright and warm. Colours that look muted in London showrooms can appear quite vivid here. Always test paint samples on your actual walls at different times of day before committing.</p>

<h2>Warm vs Cool</h2>
<p>Warm colours (creams, terracottas, ochres, warm greens) suit Nairobi's climate and landscape beautifully. Cool tones (greys, blues, whites) can feel refreshing in Nairobi's heat but need careful balancing to avoid clinical coldness.</p>

<p>Struggling with colour decisions? Our <a href="services.html">consultation service</a> includes a full colour and palette presentation tailored to your specific space.</p>`,
        author: 'Medina Wabomba',
        date: '2024-09-10',
        category: 'Design Tips',
        image: 'https://picsum.photos/seed/blog-colour/900/600',
        published: true
      }
    ],

    testimonials: [
      {
        id: 1,
        name: 'Aisha M.',
        role: 'Homeowner, Kilimani',
        quote: 'Namu Spaces completely transformed my apartment. I gave them a brief and they delivered something even better than I had imagined — calm, beautiful, and so me. The whole process felt collaborative and fun.',
        image: 'https://randomuser.me/api/portraits/women/33.jpg',
        rating: 5,
        active: true
      },
      {
        id: 2,
        name: 'David K.',
        role: 'Business Owner, Westlands',
        quote: 'Our co-working space needed a redesign that would attract clients and inspire our team. Namu Spaces understood the brief perfectly. The space looks incredible — we get compliments daily.',
        image: 'https://randomuser.me/api/portraits/men/45.jpg',
        rating: 5,
        active: true
      },
      {
        id: 3,
        name: 'Wanjiru N.',
        role: 'Architect, Karen',
        quote: 'As someone who works in the built environment, I had high expectations. Namu Spaces exceeded them. The 3D renders were exceptional, and the final space was even better in real life. Highly recommend.',
        image: 'https://randomuser.me/api/portraits/women/68.jpg',
        rating: 5,
        active: true
      },
      {
        id: 4,
        name: 'James O.',
        role: 'Tech Executive, Runda',
        quote: 'I never thought a consultation could be this valuable. In two hours, they gave me more clarity and direction than I\'d found in months of searching online. Worth every shilling.',
        image: 'https://randomuser.me/api/portraits/men/22.jpg',
        rating: 5,
        active: true
      }
    ],

    team: [
      {
        id: 1,
        name: 'Medina Wabomba',
        role: 'Founder & Lead Interior Designer',
        bio: 'Medina founded Namu Spaces with a passion for creating interiors that feel genuinely lived in spaces that balance beauty with the rhythms of daily life. With a background in spatial design and a deep love for Kenyan craft and culture, she leads every project with intention.',
        image: 'https://res.cloudinary.com/dswbdhom6/image/upload/v1775388886/Alhamdulillahi_Nimeiva_%EF%B8%8F__MUA__tiffanydontez_WEBP__0_rrv1si.jpg',
        order: 1
      }
    ],

    inquiries: [],
    nextInquiryId: 1
  };

  /* ===================== CORE DB METHODS ===================== */

  /**
   * Initialise the database. Seeds default data on first load.
   * Also applies patch migrations to fix known stale data issues.
   */
  function init() {
    const existing = localStorage.getItem(DB_KEY);
    if (!existing) {
      localStorage.setItem(DB_KEY, JSON.stringify(defaultData));
      console.log('[NamuDB] Database initialised with seed data.');
    } else {
      // Check version and migrate if needed
      const db = JSON.parse(existing);
      if (db.version !== VERSION) {
        const merged = deepMerge(defaultData, db);
        merged.version = VERSION;
        localStorage.setItem(DB_KEY, JSON.stringify(merged));
        console.log('[NamuDB] Database migrated to version', VERSION);
      } else {
        // Patch: fix known broken Unsplash hotlink URLs in team images
        let patched = false;
        const brokenDomains = ['images.unsplash.com/photo', 'placehold.co'];
        if (db.team && db.team.length) {
          db.team.forEach((member, i) => {
            if (!member.image || brokenDomains.some(d => member.image.includes(d))) {
              // Replace with reliable randomuser.me portrait based on member id
              const portraits = ['women/44', 'women/65', 'men/32', 'women/28', 'men/76'];
              const pick = portraits[(member.id - 1) % portraits.length];
              db.team[i].image = `https://randomuser.me/api/portraits/${pick}.jpg`;
              patched = true;
            }
          });
        }
        if (patched) {
          localStorage.setItem(DB_KEY, JSON.stringify(db));
          console.log('[NamuDB] Patched stale team image URLs.');
        }
      }
    }
  }

  /** Read the entire database */
  function getAll() {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : defaultData;
  }

  /** Save the entire database */
  function saveAll(data) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  }

  /** Get a top-level section (services, portfolio, blog, etc.) */
  function getSection(section) {
    const db = getAll();
    return db[section] || [];
  }

  /** Get site settings */
  function getSettings() {
    const db = getAll();
    return db.settings || defaultData.settings;
  }

  /** Update site settings */
  function updateSettings(updates) {
    const db = getAll();
    db.settings = { ...db.settings, ...updates };
    saveAll(db);
    return db.settings;
  }

  /* ===================== SERVICES ===================== */
  function getServices() { return getSection('services').sort((a, b) => a.order - b.order); }
  function getFeaturedServices() { return getServices().filter(s => s.featured); }

  function addService(service) {
    const db = getAll();
    const newId = Math.max(0, ...db.services.map(s => s.id)) + 1;
    db.services.push({ ...service, id: newId });
    saveAll(db);
    return newId;
  }

  function updateService(id, updates) {
    const db = getAll();
    const idx = db.services.findIndex(s => s.id === parseInt(id));
    if (idx >= 0) { db.services[idx] = { ...db.services[idx], ...updates }; saveAll(db); return true; }
    return false;
  }

  function deleteService(id) {
    const db = getAll();
    db.services = db.services.filter(s => s.id !== parseInt(id));
    saveAll(db);
  }

  /* ===================== PORTFOLIO ===================== */
  function getPortfolio(category = 'all') {
    const items = getSection('portfolio');
    return category === 'all' ? items : items.filter(p => p.category === category);
  }
  function getFeaturedPortfolio() { return getSection('portfolio').filter(p => p.featured); }

  function addPortfolioItem(item) {
    const db = getAll();
    const newId = Math.max(0, ...db.portfolio.map(p => p.id)) + 1;
    db.portfolio.push({ ...item, id: newId });
    saveAll(db);
    return newId;
  }

  function updatePortfolioItem(id, updates) {
    const db = getAll();
    const idx = db.portfolio.findIndex(p => p.id === parseInt(id));
    if (idx >= 0) { db.portfolio[idx] = { ...db.portfolio[idx], ...updates }; saveAll(db); return true; }
    return false;
  }

  function deletePortfolioItem(id) {
    const db = getAll();
    db.portfolio = db.portfolio.filter(p => p.id !== parseInt(id));
    saveAll(db);
  }

  /* ===================== BLOG ===================== */
  function getBlogPosts(publishedOnly = true) {
    const posts = getSection('blog');
    return publishedOnly ? posts.filter(p => p.published) : posts;
  }

  function getBlogPost(id) {
    return getSection('blog').find(p => p.id === parseInt(id));
  }

  function addBlogPost(post) {
    const db = getAll();
    const newId = Math.max(0, ...db.blog.map(p => p.id)) + 1;
    db.blog.push({ ...post, id: newId, date: post.date || new Date().toISOString().split('T')[0] });
    saveAll(db);
    return newId;
  }

  function updateBlogPost(id, updates) {
    const db = getAll();
    const idx = db.blog.findIndex(p => p.id === parseInt(id));
    if (idx >= 0) { db.blog[idx] = { ...db.blog[idx], ...updates }; saveAll(db); return true; }
    return false;
  }

  function deleteBlogPost(id) {
    const db = getAll();
    db.blog = db.blog.filter(p => p.id !== parseInt(id));
    saveAll(db);
  }

  /* ===================== TESTIMONIALS ===================== */
  function getTestimonials(activeOnly = true) {
    const t = getSection('testimonials');
    return activeOnly ? t.filter(t => t.active) : t;
  }

  function addTestimonial(t) {
    const db = getAll();
    const newId = Math.max(0, ...db.testimonials.map(t => t.id)) + 1;
    db.testimonials.push({ ...t, id: newId });
    saveAll(db);
    return newId;
  }

  function updateTestimonial(id, updates) {
    const db = getAll();
    const idx = db.testimonials.findIndex(t => t.id === parseInt(id));
    if (idx >= 0) { db.testimonials[idx] = { ...db.testimonials[idx], ...updates }; saveAll(db); return true; }
    return false;
  }

  function deleteTestimonial(id) {
    const db = getAll();
    db.testimonials = db.testimonials.filter(t => t.id !== parseInt(id));
    saveAll(db);
  }

  /* ===================== TEAM ===================== */
  function getTeam() { return getSection('team').sort((a, b) => a.order - b.order); }

  function addTeamMember(member) {
    const db = getAll();
    const newId = Math.max(0, ...db.team.map(m => m.id)) + 1;
    db.team.push({ ...member, id: newId });
    saveAll(db);
    return newId;
  }

  function updateTeamMember(id, updates) {
    const db = getAll();
    const idx = db.team.findIndex(m => m.id === parseInt(id));
    if (idx >= 0) { db.team[idx] = { ...db.team[idx], ...updates }; saveAll(db); return true; }
    return false;
  }

  function deleteTeamMember(id) {
    const db = getAll();
    db.team = db.team.filter(m => m.id !== parseInt(id));
    saveAll(db);
  }

  /* ===================== INQUIRIES ===================== */
  function getInquiries() { return getSection('inquiries').sort((a, b) => new Date(b.date) - new Date(a.date)); }

  function addInquiry(inquiry) {
    const db = getAll();
    const newId = (db.nextInquiryId || 1);
    db.inquiries.push({
      ...inquiry,
      id: newId,
      date: new Date().toISOString(),
      status: 'new',
      read: false
    });
    db.nextInquiryId = newId + 1;
    saveAll(db);
    return newId;
  }

  function updateInquiryStatus(id, status) {
    const db = getAll();
    const idx = db.inquiries.findIndex(i => i.id === parseInt(id));
    if (idx >= 0) {
      db.inquiries[idx].status = status;
      db.inquiries[idx].read = true;
      saveAll(db);
      return true;
    }
    return false;
  }

  function markInquiryRead(id) {
    const db = getAll();
    const idx = db.inquiries.findIndex(i => i.id === parseInt(id));
    if (idx >= 0) { db.inquiries[idx].read = true; saveAll(db); }
  }

  function deleteInquiry(id) {
    const db = getAll();
    db.inquiries = db.inquiries.filter(i => i.id !== parseInt(id));
    saveAll(db);
  }

  function getUnreadCount() {
    return getSection('inquiries').filter(i => !i.read).length;
  }

  /* ===================== AUTH ===================== */
  /**
   * Admin auth — uses SHA-256 hash stored in localStorage.
   * Default password: NamuAdmin2024!
   * Hash is generated on first access.
   */
  const AUTH_KEY = 'namu_admin_auth';
  const SESSION_KEY = 'namu_admin_session';
  // Default password hash for: NamuAdmin2024!
  const DEFAULT_PASS_HASH = 'c29c6266e9cf96b61ecff3ecf0e7b22e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0';

  async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'namu_salt_2024');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function setAdminPassword(newPassword) {
    const hash = await hashPassword(newPassword);
    localStorage.setItem(AUTH_KEY, JSON.stringify({ hash, set: true }));
    return hash;
  }

  async function verifyPassword(password) {
    const storedAuth = localStorage.getItem(AUTH_KEY);
    const hash = await hashPassword(password);

    if (!storedAuth) {
      // First time — default password
      const defaultHash = await hashPassword('NamuAdmin2024!');
      return hash === defaultHash;
    }

    const { hash: storedHash } = JSON.parse(storedAuth);
    return hash === storedHash;
  }

  function setSession() {
    const session = {
      token: Math.random().toString(36).substring(2) + Date.now(),
      expires: Date.now() + (8 * 60 * 60 * 1000) // 8 hours
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session.token;
  }

  function isLoggedIn() {
    const sessionData = sessionStorage.getItem(SESSION_KEY);
    if (!sessionData) return false;
    const { expires } = JSON.parse(sessionData);
    return Date.now() < expires;
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  /* ===================== UTILITIES ===================== */
  function deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-KE', options);
  }

  function formatDateTime(dateStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateStr).toLocaleDateString('en-KE', options);
  }

  /** Reset database to defaults (admin use only) */
  function resetToDefaults() {
    localStorage.setItem(DB_KEY, JSON.stringify(defaultData));
    console.log('[NamuDB] Database reset to defaults.');
  }

  /* ===================== PUBLIC API ===================== */
  return {
    init,
    getAll, saveAll,
    getSettings, updateSettings,
    // Services
    getServices, getFeaturedServices, addService, updateService, deleteService,
    // Portfolio
    getPortfolio, getFeaturedPortfolio, addPortfolioItem, updatePortfolioItem, deletePortfolioItem,
    // Blog
    getBlogPosts, getBlogPost, addBlogPost, updateBlogPost, deleteBlogPost,
    // Testimonials
    getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial,
    // Team
    getTeam, addTeamMember, updateTeamMember, deleteTeamMember,
    // Inquiries
    getInquiries, addInquiry, updateInquiryStatus, markInquiryRead, deleteInquiry, getUnreadCount,
    // Auth
    hashPassword, setAdminPassword, verifyPassword, setSession, isLoggedIn, logout,
    // Utils
    formatDate, formatDateTime, resetToDefaults
  };
})();
