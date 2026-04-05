/**
 * ============================================================
 * NAMU SPACES — Firestore Database Module (db.js)
 *
 * KEY DESIGN DECISION:
 * All queries that filter with .where() do NOT use .orderBy()
 * in the same query. Firestore requires manually-created composite
 * indexes for where+orderBy combinations — which break silently.
 * Instead we fetch with a simple query and sort client-side.
 * ============================================================
 */

const NamuDB = (() => {
  'use strict';

  /* =================== SEED DATA =================== */
  const SEED = {
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
      businessHours: { monFri: '8:00 AM – 6:00 PM', saturday: '9:00 AM – 4:00 PM', sunday: 'By Appointment' }
    },
    services: [
      { title: 'Interior Design Consultation', excerpt: 'A focused session to understand your space, needs, and vision.', description: 'Our consultation service is the ideal starting point for your interior design journey. In a thorough 2–3 hour session, we explore your space, lifestyle preferences, and design aspirations — all tailored to your unique vision and budget.', price: 'From KES 15,000', duration: '2–3 Hours', icon: '🏡', image: 'https://picsum.photos/seed/consult-svc/800/500', featured: true, order: 1 },
      { title: 'Space Planning & Layout', excerpt: 'Optimise every square metre of your home or office.', description: 'Great design starts with smart planning. We create detailed floor plans and spatial layouts that maximise flow, function, and comfort — ensuring every room works beautifully for the people who use it.', price: 'From KES 25,000', duration: '3–5 Days', icon: '📐', image: 'https://picsum.photos/seed/planning-svc/800/500', featured: true, order: 2 },
      { title: 'Mood Boards & Design Concepts', excerpt: 'See your future space before a single piece of furniture moves.', description: 'We craft curated mood boards that capture the essence of your ideal space — combining textures, colours, finishes, and furniture to paint a vivid picture of what your home could feel like.', price: 'From KES 18,000', duration: '5–7 Days', icon: '🎨', image: 'https://picsum.photos/seed/moodboard-svc/800/500', featured: true, order: 3 },
      { title: '3D Render Designs', excerpt: 'Photorealistic visualisations of your space before it is built.', description: 'Experience your redesigned space in stunning detail with our professional 3D rendering service. We produce photorealistic digital visuals before implementation begins — perfect for clients who need clarity.', price: 'From KES 35,000', duration: '7–14 Days', icon: '🖥️', image: 'https://picsum.photos/seed/renders-svc/800/500', featured: false, order: 4 },
      { title: 'Interior Styling', excerpt: 'The finishing touches that bring a space to life.', description: 'Interior styling is the art of the details — artwork, cushions, rugs, plants, and accessories that transform a room from functional to extraordinary. We source, select, and style every element with intention.', price: 'From KES 20,000', duration: '1–3 Days', icon: '✨', image: 'https://picsum.photos/seed/styling-svc/800/500', featured: false, order: 5 }
    ],
    portfolio: [
      { title: 'The Serene Apartment — Kilimani', category: 'residential', description: 'A light-filled two-bedroom apartment transformed with earthy tones, natural materials, and thoughtful storage solutions.', image: 'https://picsum.photos/seed/apart-proj/900/700', year: 2024, location: 'Kilimani, Nairobi', featured: true },
      { title: 'Creative Co-Working Studio — Westlands', category: 'commercial', description: 'A dynamic co-working space designed to inspire productivity and collaboration with warm wood tones and biophilic elements.', image: 'https://picsum.photos/seed/cowork-proj/900/700', year: 2024, location: 'Westlands, Nairobi', featured: true },
      { title: 'The Karen Villa — Master Suite', category: 'residential', description: 'A luxurious master bedroom suite combining African-inspired textiles with contemporary furniture.', image: 'https://picsum.photos/seed/bedroom-proj/900/700', year: 2024, location: 'Karen, Nairobi', featured: true },
      { title: 'Boutique Law Office — CBD', category: 'office', description: 'A sophisticated office space that communicates trust and professionalism. Rich wood panelling and curated art create the perfect client impression.', image: 'https://picsum.photos/seed/office-proj/900/700', year: 2023, location: 'Nairobi CBD', featured: false },
      { title: 'Open-Plan Family Home — Runda', category: 'residential', description: 'A family home redesign prioritising open flow and child-friendly materials. The kitchen island became the heart of daily life.', image: 'https://picsum.photos/seed/family-proj/900/700', year: 2023, location: 'Runda, Nairobi', featured: false },
      { title: 'Minimalist Therapy Studio — Lavington', category: 'commercial', description: 'A calming therapy and wellness studio designed to put clients immediately at ease. Soft neutrals and curved lines create a sanctuary.', image: 'https://picsum.photos/seed/therapy-proj/900/700', year: 2023, location: 'Lavington, Nairobi', featured: false }
    ],
    blog: [
      { title: '5 Ways to Make a Small Nairobi Apartment Feel Bigger', excerpt: "Living in a compact space doesn't mean sacrificing style or comfort. Here are five strategies we use with our Nairobi clients.", content: '<p>A small footprint does not have to mean a cramped feel. At Namu Spaces, we have transformed dozens of petite Nairobi apartments into airy, functional homes.</p><h2>1. Embrace Light Colours</h2><p>Light, warm neutrals reflect natural light and make walls feel further away.</p><h2>2. Multi-Functional Furniture</h2><p>Every piece should work twice as hard.</p><h2>3. Use Vertical Space</h2><p>Tall bookshelves and ceiling-height curtains draw the eye upward.</p><h2>4. Limit Visual Clutter</h2><p>Every object should earn its place.</p><h2>5. Mirrors Strategically</h2><p>A well-placed mirror can double the apparent size of a room.</p>', author: 'Medina Wabomba', date: '2024-11-15', category: 'Design Tips', image: 'https://picsum.photos/seed/apart-proj/900/600', published: true },
      { title: 'Biophilic Design: Bringing Nature Into Your Home', excerpt: "Nairobi is famously green. But are you bringing enough of that natural world inside? Biophilic design is more accessible than you think.", content: '<p>Nairobi sits at the edge of a national park, surrounded by greenery and blessed with extraordinary natural light. Biophilic design connects interiors with the natural world.</p><h2>Plants as Architecture</h2><p>Large indoor plants define space, add texture, and improve air quality.</p><h2>Natural Materials</h2><p>Wood, stone, rattan, linen — materials that originated in nature bring warmth to any interior.</p><h2>Light as a Design Element</h2><p>Natural light is free and beautiful. Design around it.</p>', author: 'Medina Wabomba', date: '2024-10-22', category: 'Design Trends', image: 'https://picsum.photos/seed/blog-nature/900/600', published: true },
      { title: 'How to Choose the Right Colour Palette for Your Home', excerpt: "Colour is the most powerful tool in a designer's kit. Here's how we approach colour selection for Kenyan homes.", content: '<p>Nothing transforms a space quite like colour. The right palette can make a room feel larger, warmer, or more energising.</p><h2>Start with Emotion</h2><p>Ask yourself: how do I want to feel in this room? Let emotion guide the colour.</p><h2>The 60-30-10 Rule</h2><p>60% dominant colour, 30% secondary, 10% accent. This creates a balanced, cohesive look.</p><h2>Test in Nairobi Light</h2><p>Always test paint samples on your actual walls at different times of day before committing.</p>', author: 'Medina Wabomba', date: '2024-09-10', category: 'Design Tips', image: 'https://picsum.photos/seed/blog-colour/900/600', published: true }
    ],
    testimonials: [
      { name: 'Aisha M.', role: 'Homeowner, Kilimani', quote: 'Namu Spaces completely transformed my apartment. I gave them a brief and they delivered something even better than I had imagined — calm, beautiful, and so me.', image: 'https://randomuser.me/api/portraits/women/33.jpg', rating: 5, active: true },
      { name: 'David K.', role: 'Business Owner, Westlands', quote: 'Our co-working space needed a redesign that would attract clients and inspire our team. Namu Spaces understood the brief perfectly. The space looks incredible.', image: 'https://randomuser.me/api/portraits/men/45.jpg', rating: 5, active: true },
      { name: 'Wanjiru N.', role: 'Architect, Karen', quote: 'As someone who works in the built environment, I had high expectations. Namu Spaces exceeded them. The 3D renders were exceptional.', image: 'https://randomuser.me/api/portraits/women/68.jpg', rating: 5, active: true },
      { name: 'James O.', role: 'Tech Executive, Runda', quote: 'I never thought a consultation could be this valuable. In two hours, they gave me more clarity than I had found in months of searching online.', image: 'https://randomuser.me/api/portraits/men/22.jpg', rating: 5, active: true }
    ],
    team: [
      { name: 'Medina Wabomba', role: 'Founder & Lead Interior Designer', bio: 'Medina founded Namu Spaces with a passion for creating interiors that feel genuinely lived in — spaces that balance beauty with the rhythms of daily life.', image: 'https://randomuser.me/api/portraits/women/44.jpg', order: 1 }
    ]
  };

  /* =================== HELPERS =================== */
  function snap2arr(snapshot) {
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  /* =================== SETTINGS =================== */
  async function getSettings() {
    try {
      const snap = await _db.collection('settings').doc('main').get();
      return snap.exists ? snap.data() : SEED.settings;
    } catch (e) {
      console.error('[NamuDB] getSettings:', e);
      return SEED.settings;
    }
  }
  async function updateSettings(updates) {
    await _db.collection('settings').doc('main').set(updates, { merge: true });
  }

  /* =================== SERVICES =================== */
  // NOTE: All filtered queries fetch everything and sort/filter client-side
  // to avoid Firestore composite index requirements.

  async function getServices() {
    const snap = await _db.collection('services').get();
    return snap2arr(snap).sort((a, b) => (a.order || 0) - (b.order || 0));
  }
  async function getFeaturedServices() {
    const all = await getServices();
    return all.filter(s => s.featured);
  }
  async function addService(data) {
    const ref = await _db.collection('services').add({
      ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return ref.id;
  }
  async function updateService(id, data) {
    await _db.collection('services').doc(id).update({
      ...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
  async function deleteService(id) {
    await _db.collection('services').doc(id).delete();
  }

  /* =================== PORTFOLIO =================== */
  async function getPortfolio(category = 'all') {
    const snap = await _db.collection('portfolio').get();
    let items = snap2arr(snap).sort((a, b) => (b.year || 0) - (a.year || 0));
    if (category && category !== 'all') {
      items = items.filter(p => p.category === category);
    }
    return items;
  }
  async function getFeaturedPortfolio() {
    const all = await getPortfolio('all');
    return all.filter(p => p.featured);
  }
  async function addPortfolioItem(data) {
    const ref = await _db.collection('portfolio').add({
      ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return ref.id;
  }
  async function updatePortfolioItem(id, data) {
    await _db.collection('portfolio').doc(id).update({
      ...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
  async function deletePortfolioItem(id) {
    await _db.collection('portfolio').doc(id).delete();
  }

  /* =================== BLOG =================== */
  async function getBlogPosts(publishedOnly = true) {
    const snap = await _db.collection('blog').get();
    let posts = snap2arr(snap).sort((a, b) => {
      const da = a.date || '';
      const db = b.date || '';
      return db.localeCompare(da); // descending date
    });
    if (publishedOnly) posts = posts.filter(p => p.published);
    return posts;
  }
  async function getBlogPost(id) {
    const snap = await _db.collection('blog').doc(id).get();
    return snap.exists ? { id: snap.id, ...snap.data() } : null;
  }
  async function addBlogPost(data) {
    const ref = await _db.collection('blog').add({
      ...data,
      date: data.date || new Date().toISOString().split('T')[0],
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return ref.id;
  }
  async function updateBlogPost(id, data) {
    await _db.collection('blog').doc(id).update({
      ...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
  async function deleteBlogPost(id) {
    await _db.collection('blog').doc(id).delete();
  }

  /* =================== TESTIMONIALS =================== */
  async function getTestimonials(activeOnly = true) {
    const snap = await _db.collection('testimonials').get();
    let items = snap2arr(snap);
    if (activeOnly) items = items.filter(t => t.active);
    return items;
  }
  async function addTestimonial(data) {
    const ref = await _db.collection('testimonials').add({
      ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return ref.id;
  }
  async function updateTestimonial(id, data) {
    await _db.collection('testimonials').doc(id).update(data);
  }
  async function deleteTestimonial(id) {
    await _db.collection('testimonials').doc(id).delete();
  }

  /* =================== TEAM =================== */
  async function getTeam() {
    const snap = await _db.collection('team').get();
    return snap2arr(snap).sort((a, b) => (a.order || 0) - (b.order || 0));
  }
  async function addTeamMember(data) {
    const ref = await _db.collection('team').add({
      ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return ref.id;
  }
  async function updateTeamMember(id, data) {
    await _db.collection('team').doc(id).update(data);
  }
  async function deleteTeamMember(id) {
    await _db.collection('team').doc(id).delete();
  }

  /* =================== INQUIRIES =================== */
  async function getInquiries() {
    const snap = await _db.collection('inquiries').get();
    return snap2arr(snap).sort((a, b) => {
      const ta = a.createdAt ? (a.createdAt.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt).getTime()) : 0;
      const tb = b.createdAt ? (b.createdAt.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt).getTime()) : 0;
      return tb - ta; // newest first
    });
  }
  async function addInquiry(data) {
    const ref = await _db.collection('inquiries').add({
      ...data,
      status: 'new',
      read: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return ref.id;
  }
  async function updateInquiryStatus(id, status) {
    await _db.collection('inquiries').doc(id).update({ status, read: true });
  }
  async function markInquiryRead(id) {
    await _db.collection('inquiries').doc(id).update({ read: true });
  }
  async function deleteInquiry(id) {
    await _db.collection('inquiries').doc(id).delete();
  }
  async function getUnreadCount() {
    const snap = await _db.collection('inquiries').where('read', '==', false).get();
    return snap.size;
  }

  /* =================== AUTH =================== */
  async function signIn(email, password) {
    const cred = await _auth.signInWithEmailAndPassword(email, password);
    return cred.user;
  }
  async function signOut() { await _auth.signOut(); }
  function onAuthChange(cb) { return _auth.onAuthStateChanged(cb); }
  function currentUser() { return _auth.currentUser; }
  async function isLoggedIn() {
    return new Promise(resolve => {
      const unsub = _auth.onAuthStateChanged(user => { unsub(); resolve(!!user); });
    });
  }
  async function updateAdminPassword(currentPassword, newPassword) {
    const user = _auth.currentUser;
    if (!user) throw new Error('Not signed in.');
    const cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    await user.reauthenticateWithCredential(cred);
    await user.updatePassword(newPassword);
  }

  /* =================== SETUP =================== */
  async function needsSetup() {
    try {
      const snap = await _db.collection('settings').doc('main').get();
      return !snap.exists;
    } catch (e) { return true; }
  }

  async function seedDefaultData(onProgress) {
    const p = onProgress || (() => {});
    p('Seeding settings…');
    await _db.collection('settings').doc('main').set(SEED.settings);

    p('Seeding services (5)…');
    const b1 = _db.batch();
    SEED.services.forEach(item => b1.set(_db.collection('services').doc(), item));
    await b1.commit();

    p('Seeding portfolio (6 projects)…');
    const b2 = _db.batch();
    SEED.portfolio.forEach(item => b2.set(_db.collection('portfolio').doc(), item));
    await b2.commit();

    p('Seeding blog (3 articles)…');
    const b3 = _db.batch();
    SEED.blog.forEach(item => b3.set(_db.collection('blog').doc(), item));
    await b3.commit();

    p('Seeding testimonials…');
    const b4 = _db.batch();
    SEED.testimonials.forEach(item => b4.set(_db.collection('testimonials').doc(), item));
    await b4.commit();

    p('Seeding team…');
    const b5 = _db.batch();
    SEED.team.forEach(item => b5.set(_db.collection('team').doc(), item));
    await b5.commit();

    p('Complete! ✓');
  }

  /* =================== UTILITIES =================== */
  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-KE', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch (e) { return dateStr; }
  }

  function formatDateTime(ts) {
    if (!ts) return '—';
    try {
      const d = ts.toDate ? ts.toDate() : new Date(ts);
      return d.toLocaleDateString('en-KE', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch (e) { return '—'; }
  }

  return {
    getSettings, updateSettings,
    getServices, getFeaturedServices, addService, updateService, deleteService,
    getPortfolio, getFeaturedPortfolio, addPortfolioItem, updatePortfolioItem, deletePortfolioItem,
    getBlogPosts, getBlogPost, addBlogPost, updateBlogPost, deleteBlogPost,
    getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial,
    getTeam, addTeamMember, updateTeamMember, deleteTeamMember,
    getInquiries, addInquiry, updateInquiryStatus, markInquiryRead, deleteInquiry, getUnreadCount,
    signIn, signOut, onAuthChange, currentUser, isLoggedIn, updateAdminPassword,
    needsSetup, seedDefaultData,
    formatDate, formatDateTime,
    _db, _auth
  };
})();
