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
     4. THINGS I LOVE — expandable cards
     ============================================================ */
  const loveCards = document.querySelectorAll('.love-card');
  loveCards.forEach(card => {
    if (!card.querySelector('.love-back')){
      const back = document.createElement('span');
      back.className = 'love-back';
      back.textContent = card.dataset.msg || '';
      card.appendChild(back);
    }
    card.addEventListener('click', () => {
      const wasOpen = card.classList.contains('open');
      loveCards.forEach(c => c.classList.remove('open'));
      if (!wasOpen){
        card.classList.add('open');
        const r = card.getBoundingClientRect();
        spawnSparkles(r.left + r.width/2, r.top + 20, 5);
      }
    });
  });

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

  /* ============================================================
     7. MUSIC CONTROLS (autoplay-safe — user initiated only)
     ============================================================ */
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  const musicLabel = musicToggle.querySelector('.music-label');
  const volumeRow = document.getElementById('volumeRow');
  const volumeSlider = document.getElementById('volumeSlider');
  const muteBtn = document.getElementById('muteBtn');

  bgMusic.volume = volumeSlider.value / 100;

  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused){
      bgMusic.play().then(() => {
        musicToggle.classList.add('playing');
        musicLabel.textContent = 'Playing our song';
        volumeRow.classList.add('show');
      }).catch(() => {
        musicLabel.textContent = 'Add assets/our-song.mp3';
      });
    } else {
      bgMusic.pause();
      musicToggle.classList.remove('playing');
      musicLabel.textContent = 'Play our song';
    }
  });

  volumeSlider.addEventListener('input', () => {
    bgMusic.volume = volumeSlider.value / 100;
    if (bgMusic.volume > 0) bgMusic.muted = false;
  });

  muteBtn.addEventListener('click', () => {
    bgMusic.muted = !bgMusic.muted;
    muteBtn.innerHTML = bgMusic.muted ? '&#128263;' : '&#128266;';
  });

});
