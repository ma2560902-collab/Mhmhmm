document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     0. FX LAYER — floating hearts + sparkles on tap
     ============================================================ */
  const fxLayer = document.getElementById('fxLayer');

  function spawnHeart(x, y){
    const heart = document.createElement('span');
    heart.className = 'fx-heart';
    heart.textContent = '❤';
    heart.style.left = (x - 10) + 'px';
    heart.style.top  = (y - 10) + 'px';
    heart.style.color = ['#DE9BAC','#C9B6DE','#6E2A3B'][Math.floor(Math.random()*3)];
    fxLayer.appendChild(heart);
    setTimeout(() => heart.remove(), 2700);
  }

  function spawnSparkles(x, y, count = 4){
    for(let i=0;i<count;i++){
      const s = document.createElement('span');
      s.className = 'fx-spark';
      const angle = Math.random() * Math.PI * 2;
      const dist = 20 + Math.random() * 30;
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      s.style.setProperty('--dx', Math.cos(angle)*dist + 'px');
      fxLayer.appendChild(s);
      setTimeout(() => s.remove(), 1700);
    }
  }

  document.addEventListener('pointerdown', (e) => {
    // avoid spawning fx on buttons/inputs so taps stay crisp
    if (e.target.closest('button, input, a')) return;
    spawnHeart(e.clientX, e.clientY);
    spawnSparkles(e.clientX, e.clientY, 3);
  });

  /* ============================================================
     1. GATE -> GREET -> MAIN TRANSITION
     ============================================================ */
  const gate = document.getElementById('gate');
  const greet = document.getElementById('greet');
  const openBtn = document.getElementById('openBtn');

  document.body.classList.add('locked');

  openBtn.addEventListener('click', () => {
    spawnHeart(window.innerWidth/2, window.innerHeight/2);
    gate.classList.add('fading');
    setTimeout(() => {
      greet.classList.add('show');
    }, 500);

    setTimeout(() => {
      greet.classList.add('hide');
      document.body.classList.remove('locked');
      gate.style.display = 'none';
      setTimeout(() => { greet.style.display = 'none'; }, 950);
    }, 2600);
  });

  /* ============================================================
     2. SCROLL PROGRESS BAR
     ============================================================ */
  const progressFill = document.getElementById('progressFill');
  function updateProgress(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressFill.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ============================================================
     3. SCROLL REVEAL (letter paragraphs, gift lines, finale lines)
     ============================================================ */
  const revealTargets = document.querySelectorAll('[data-p]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });
  revealTargets.forEach(el => revealObserver.observe(el));

  /* ============================================================
     4. THINGS I LOVE — cards with a small sparkle on tap
     ============================================================ */
  const loveCards = document.querySelectorAll('.love-card');
  loveCards.forEach(card => {
    card.addEventListener('click', () => {
      const r = card.getBoundingClientRect();
      spawnSparkles(r.left + r.width/2, r.top + r.height/2, 5);
    });
  });

  /* ============================================================
     5. MEMORIES — lightbox
     ============================================================ */
  const polaroids = document.querySelectorAll('.polaroid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  polaroids.forEach(p => {
    p.addEventListener('click', () => {
      if (p.classList.contains('img-missing')) return; // nothing to show yet
      const img = p.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = '';
      lightbox.classList.add('show');
    });
  });
  function closeLightbox(){ lightbox.classList.remove('show'); }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  /* ============================================================
     6. FINALE — stars + heart draw + replay
     ============================================================ */
  const starsWrap = document.getElementById('stars');
  for (let i=0; i<45; i++){
    const star = document.createElement('span');
    star.className = 'star';
    star.style.left = Math.random()*100 + '%';
    star.style.top = Math.random()*100 + '%';
    star.style.animationDelay = (Math.random()*3) + 's';
    starsWrap.appendChild(star);
  }

  const finaleHeart = document.getElementById('finaleHeart');
  const replayBtn = document.getElementById('replayBtn');
  const finaleSection = document.getElementById('finale-section');

  const finaleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        setTimeout(() => finaleHeart.classList.add('show'), 3600);
        setTimeout(() => replayBtn.classList.add('show'), 4400);
        finaleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  finaleObserver.observe(finaleSection);

  replayBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
