(() => {
  'use strict';
  const screen = document.getElementById('screen');
  const stage = document.getElementById('stage');
  const toast = document.getElementById('toast');
  const soundButton = document.getElementById('sound');
  const state = { page: 'intro', matcha: 0, lilies: 0, sound: false, epoch: 0, ginger: 0 };
  let toastTimer;
  let audio;
  const arrow = '<svg viewBox="0 0 28 24" aria-hidden="true"><path d="M2 12h23m-7-7 7 7-7 7"/></svg>';
  const sprite = (kind, extra = '') => `<span class="sprite ${kind} ${extra}" aria-hidden="true"></span>`;
  const primary = (text, action) => `<button class="primary" data-action="${action}">${text}${arrow}</button>`;
  const jokes = [
    'Ginger?! Noor did NOT approve this guest list.',
    'Ginger has been respectfully escorted out. Again.',
    'He said “I can fix her.” She said “you are literally ginger.”',
    'Even the ginger knows I’m your favorite person.',
    'Okay, fine. One tiny ginger cameo. Zero ginger in your matcha.'
  ];
  const compliments = [
    'One for your beautiful face. My favorite view, always.',
    'One for that clever brain. Yes, I’m a little obsessed.',
    'One for your laugh. Even when my joke was funnier.',
    'One for your kind heart. The world is softer with you in it.',
    'And one because you’re my Noor. That’s my favorite reason.'
  ];

  function announce(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
  }

  function chime(notes = [523.25, 659.25, 783.99]) {
    if (!state.sound) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      audio ??= new Audio();
      if (audio.state === 'suspended') audio.resume().catch(() => {});
      notes.forEach((frequency, i) => {
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        const start = audio.currentTime + i * .085;
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(.035, start + .015);
        gain.gain.exponentialRampToValueAtTime(.001, start + .35);
        oscillator.connect(gain);
        gain.connect(audio.destination);
        oscillator.start(start);
        oscillator.stop(start + .36);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      });
    } catch { /* Sound is optional; the adventure always remains playable. */ }
  }

  function hearts(amount = 12) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const layer = document.getElementById('confetti');
    for (let i = 0; i < amount; i++) {
      const heart = document.createElement('i');
      heart.textContent = i % 3 ? '♡' : '♥';
      heart.style.left = `${20 + Math.random() * 60}%`;
      heart.style.top = `${45 + Math.random() * 40}%`;
      heart.style.animationDelay = `${Math.random() * .25}s`;
      heart.style.fontSize = `${18 + Math.random() * 18}px`;
      layer.appendChild(heart);
      heart.addEventListener('animationend', () => heart.remove(), { once: true });
    }
  }

  function progress(step) {
    for (let i = 1; i <= 3; i++) {
      const item = document.getElementById(`step-${i}`);
      item.classList.toggle('done', i < step);
      if (i === step) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    }
  }

  function show(page, html, className, step, focus = true) {
    state.page = page;
    state.epoch++;
    screen.className = `screen ${className}`;
    screen.innerHTML = html;
    stage.classList.toggle('letter-stage', page === 'letter');
    document.getElementById('legend').hidden = page === 'letter';
    progress(step);
    if (focus) {
      const heading = screen.querySelector('h2');
      heading?.setAttribute('tabindex', '-1');
      heading?.focus({ preventScroll: true });
      const box = stage.getBoundingClientRect();
      if (box.top < 0 || box.top > window.innerHeight * .65) stage.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }

  function ginger(side = '') {
    return `<button class="ginger-peek ${side}" data-action="ginger" aria-label="Tease the ginger">${sprite('ginger')}</button>`;
  }

  function counter(kind, total) {
    return `<div class="counter" role="status" aria-live="polite"><span class="dots" aria-hidden="true">${Array.from({ length: total }, () => '<i></i>').join('')}</span><span id="count">0 / ${total} ${kind === 'matcha' ? 'happy sips' : 'lily bunches'}</span></div>`;
  }

  function intro(focus = false) {
    state.matcha = 0;
    state.lilies = 0;
    show('intro', `<h2>A little sip of happy?</h2><p class="sub">Collect matcha. Pick lilies. Feel very, very loved.</p>${sprite('matcha', 'mascot')}${primary("Let’s make you smile", 'start')}${ginger('left')}${ginger('right')}`, 'intro-screen', 1, focus);
  }

  function matchaGame() {
    state.matcha = 0;
    show('matcha', `<h2>A matcha made for you.</h2><p class="sub">Tap 6 little cups of happiness. The ginger? Your call.</p><div class="collection" aria-label="Collect six matcha cups">${Array.from({ length: 6 }, (_, i) => `<button class="collectible" data-collect="matcha" aria-label="Collect matcha cup ${i + 1}">${sprite('matcha')}</button>`).join('')}</div>${counter('matcha', 6)}${ginger()}`, 'play-screen', 1);
  }

  function matchaDone() {
    show('matcha-done', `${sprite('matcha', 'mascot')}<h2>You’re my cup of everything.</h2><p class="sub">Six happy sips, zero ginger.<br>Now, let’s get my girl her favorite flowers.</p>${primary('Pick some lilies', 'lilies')}`, 'completed-screen', 1);
    chime(); hearts();
  }

  function lilyGame() {
    state.lilies = 0;
    show('lilies', `<h2>Only lilies for my girl.</h2><p class="sub" id="lily-note" aria-live="polite">Pick 5 little bunches. There’s a reason I adore you in every one.</p><div class="collection" aria-label="Pick five lily bunches">${Array.from({ length: 5 }, (_, i) => `<button class="collectible" data-collect="lilies" aria-label="Pick lily bunch ${i + 1}">${sprite('lily')}</button>`).join('')}</div>${counter('lilies', 5)}${ginger()}`, 'play-screen lily-screen', 2);
  }

  function lilyDone() {
    show('lilies-done', `${sprite('lily', 'mascot')}<h2>A whole bouquet of “I love you.”</h2><p class="sub">Beautiful flowers for my beautiful girl.<br>There’s one more thing I made for you…</p>${primary('Find your little surprise', 'envelope')}`, 'completed-screen', 2);
    hearts(); chime();
  }

  function envelope() {
    show('envelope', `<h2>Just between us, Noor jii.</h2><p class="sub">A little letter from your favorite person.</p>${sprite('envelope', 'big-envelope')}${primary('Open my letter', 'letter')}`, 'envelope-screen', 3);
  }

  function letter() {
    show('letter', `<article class="letter-paper" aria-label="A love letter for Noor">${sprite('lily', 'letter-ornament')}<h2 class="letter-salutation">Haiyeee noor jii,</h2><p class="letter-copy">I really miss my baby's voice a lot, i miss my baby's face, and I miss calling my baby so much.</p><p class="letter-copy">You dont have anything to worry about mera jaan, because I will always be here for you and will never leave your side.</p><p class="letter-copy">You say that you dont know how you deserve a guy like me, well Idk how i deserve such a beautiful, smart, funny(im funnier again), and kind girl.</p><p class="letter-copy">You are rare, and since we are married already, I will buy you taco bell.</p><p class="letter-copy">I love you so much mera gulu muluuu</p></article><div class="letter-actions"><button class="primary" data-action="tacos">About that Taco Bell date…</button><button class="text-button" data-action="replay">One more little adventure?</button></div><div id="voucher" class="voucher" role="status" hidden><h3>One Taco Bell date. On me.</h3><p>Admit one very loved Noor + her very corny husband.<br>Includes: tacos, me being funnier, and all my love.</p><p class="voucher-small">A pinky promise from your favorite person. No expiry date.</p></div>`, 'letter-screen', 3);
    chime([523.25, 659.25, 783.99, 1046.5]); hearts(18);
  }

  function collect(button) {
    const kind = button.dataset.collect;
    if (button.disabled || !((kind === 'matcha' && state.page === 'matcha') || (kind === 'lilies' && state.page === 'lilies'))) return;
    button.disabled = true;
    button.classList.add('collected');
    state[kind]++;
    const current = state[kind];
    const total = kind === 'matcha' ? 6 : 5;
    document.getElementById('count').textContent = `${current} / ${total} ${kind === 'matcha' ? 'happy sips' : 'lily bunches'}`;
    screen.querySelectorAll('.dots i').forEach((dot, i) => dot.classList.toggle('filled', i < current));
    if (kind === 'lilies') document.getElementById('lily-note').textContent = compliments[current - 1];
    chime([440 + current * 65]);
    if (current === total) {
      const epoch = state.epoch;
      setTimeout(() => { if (epoch === state.epoch) kind === 'matcha' ? matchaDone() : lilyDone(); }, kind === 'lilies' ? 2100 : 650);
    }
  }

  const actions = {
    start: matchaGame,
    lilies: lilyGame,
    envelope,
    letter,
    ginger: () => { announce(jokes[state.ginger++ % jokes.length]); chime([220, 196]); },
    replay: () => { intro(true); announce('Another adventure? I’d pick you in every single one.'); },
    tacos: button => {
      document.getElementById('voucher').hidden = false;
      button.textContent = 'Date officially promised ♡';
      button.disabled = true;
      hearts(); chime();
      document.getElementById('voucher').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
    }
  };
  screen.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || button.disabled) return;
    if (button.dataset.collect) collect(button);
    else actions[button.dataset.action]?.(button);
  });
  document.getElementById('hug').addEventListener('click', () => {
    announce('A biiig hug from your favorite person. I’m right here, mera jaan.');
    hearts(16); chime();
  });
  soundButton.addEventListener('click', () => {
    state.sound = !state.sound;
    soundButton.setAttribute('aria-pressed', String(state.sound));
    soundButton.setAttribute('aria-label', state.sound ? 'Turn sound off' : 'Turn sound on');
    if (state.sound) chime();
    announce(state.sound ? 'Tiny happy sounds are on.' : 'A little quiet, just for you.');
  });
  intro();
})();
