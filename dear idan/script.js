(function () {
  var body = document.body;
  var stage = document.querySelector('.stage');
  var page = Number(body.dataset.page) || 1;

  var STATE_KEY = 'disc_state';
  var SRC_KEY = 'disc_src';
  var TIME_KEY = 'disc_time';
  var TS_KEY = 'disc_ts';
  var INTRO_KEY = 'disc_intro';
  var VOL_KEY = 'disc_vol';
  var DEFAULT_VOL = 0.1;

  var HEART = 'M0 6.5C-7 1.5-6.5-5-3-5C-1.2-5 0-3.8 0-2.5C0-3.8 1.2-5 3-5C6.5-5 7 1.5 0 6.5Z';
  var SPARK = 'M0 -9Q1 -1 9 0Q1 1 0 9Q-1 1 -9 0Q-1 -1 0 -9Z';

  var TEXT_ON = 'tap piringan buat stop lagu nya';
  var TEXT_OFF = 'tap piringan buat muter lagu nya';

  function store(k, v) {
    try {
      if (v === undefined) return sessionStorage.getItem(k);
      sessionStorage.setItem(k, v);
    } catch (e) {}
    return null;
  } 

  function spark(cls) {
    return '<svg class="spark ' + cls + '" viewBox="-10 -10 20 20" aria-hidden="true"><path d="' + SPARK + '" fill="#dcbb8f"/></svg>';
  }

  function dots() {
    var out = '';
    for (var i = 1; i <= 4; i++) out += '<i' + (i === page ? ' class="on"' : '') + '></i>';
    return '<div class="dots">' + out + '</div>';
  }

  function girl() {
  return '' +
    '<div class="girl"><svg viewBox="0 0 80 90" aria-hidden="true">' +
    '<path d="M30 8C19 8 15 15 15 24C15 30 14 34 16 38C19 40 24 39 26 36Q30 34 34 36C36 39 41 40 44 38C46 34 45 30 45 24C45 15 41 8 30 8Z" fill="#4b1624"/>' +
    '<circle cx="30" cy="7" r="5" fill="#7a2c3f00"/>' +
    '<circle cx="30" cy="21" r="11" fill="#7a2c3f"/>' +
    '<path d="M19 21C18 11 24 8 30 8C37 8 42 12 41 21C39 17 35 14 31 14C27 15 23 17 19 21Z" fill="#4b1624"/>' +
    '<path d="M8 90V62Q8 40 30 40Q52 40 52 62V90Z" fill="#6d2638"/>' +
    '<g class="arm">' +
    '<path d="M42 49H71" stroke="#6d2638" stroke-width="7" stroke-linecap="round" fill="none"/>' +
    '<circle cx="72" cy="49" r="4.6" fill="#7a2c3f"/>' +
    '</g></svg></div>';
}

  function boy() {
    return '' +
      '<div class="boy"><svg viewBox="0 0 60 80" aria-hidden="true">' +
      '<circle cx="30" cy="16" r="11" fill="#4f1828"/>' +
      '<path d="M8 80V56Q8 34 30 34Q52 34 52 56V80Z" fill="#561a2a"/>' +
      '</svg></div>';
  }

  function player() {
    return '' +
      '<div class="player"><svg viewBox="0 0 80 70" aria-hidden="true">' +
      '<path d="M16 46V70M64 46V70" stroke="#b89569" stroke-width="3" stroke-linecap="round"/>' +
      '<rect x="4" y="10" width="72" height="38" rx="10" fill="#6d2638"/>' +
      '<rect x="4" y="10" width="72" height="38" rx="10" fill="none" stroke="#4b1624" stroke-width="1.5"/>' +
      '<g class="pbtn"><circle cx="24" cy="29" r="10.5" fill="#f1dcc0"/>' +
      '<path class="play-icon" d="M21 23.5L29.5 29L21 34.5Z" fill="#6d2638"/>' +
      '<g class="pause-icon" fill="#6d2638"><rect x="19.6" y="23.6" width="3.4" height="10.8" rx="1.2"/><rect x="25.2" y="23.6" width="3.4" height="10.8" rx="1.2"/></g></g>' +
      '<path d="M42 24H68" stroke="#f1dcc0" stroke-width="2" stroke-linecap="round" opacity=".5"/>' +
      '<circle class="pdot" cx="44" cy="24" r="2.8" fill="#f1dcc0"/>' +
      '<path d="M44 36H68M44 41H62" stroke="#f1dcc0" stroke-width="1.6" stroke-linecap="round" opacity=".35"/>' +
      '</svg></div>' +
      '<span class="note n1"></span><span class="note n2"></span>';
  }

  function disc() {
    return '' +
      '<button class="disc" type="button" aria-label="piringan musik">' +
      '<svg viewBox="0 0 100 100" aria-hidden="true">' +
      '<circle cx="50" cy="50" r="48" fill="#4b1624"/>' +
      '<circle cx="50" cy="50" r="47" fill="none" stroke="#7a2c3f" stroke-width="1.2"/>' +
      '<circle cx="50" cy="50" r="41" fill="none" stroke="#6d2638" stroke-width=".8" opacity=".6"/>' +
      '<circle cx="50" cy="50" r="35" fill="none" stroke="#6d2638" stroke-width=".8" opacity=".6"/>' +
      '<circle cx="50" cy="50" r="29" fill="none" stroke="#6d2638" stroke-width=".8" opacity=".6"/>' +
      '<path d="M50 9A41 41 0 0 1 91 50" fill="none" stroke="#f1dcc0" stroke-width="2.4" stroke-linecap="round" opacity=".35"/>' +
      '<path d="M50 91A41 41 0 0 1 9 50" fill="none" stroke="#f1dcc0" stroke-width="2.4" stroke-linecap="round" opacity=".35"/>' +
      '<circle cx="50" cy="50" r="19" fill="#dcbb8f"/>' +
      '<circle cx="50" cy="50" r="19" fill="none" stroke="#b89569" stroke-width="1"/>' +
      '<g transform="translate(50 49.2) scale(1.3)"><path d="' + HEART + '" fill="#6d2638"/></g>' +
      '</svg>' +
      '<span class="disc-note"></span>' +
      '</button>';
  }

  function volume() {
    return '<input class="vol" type="range" min="0" max="1" step="0.005" aria-label="volume lagu">';
  }

  var scene = '' +
    '<div class="sky">' +
    '<svg class="moon" viewBox="0 0 60 64" aria-hidden="true"><path d="M40 4A28 28 0 0 0 40 60A36 36 0 0 1 40 4Z" fill="#dcbb8f"/></svg>' +
    spark('sp1') + spark('sp2') + spark('sp3') +
    '<i class="dust d1"></i><i class="dust d2"></i><i class="dust d3"></i><i class="dust d4"></i><i class="dust d5"></i>' +
    '</div>' +
    '<div class="ground-line"></div>' +
    '<svg class="arc" viewBox="0 0 140 30" aria-hidden="true"><path d="M2 26Q70 -4 138 26" fill="none" stroke="#d3b78f" stroke-width="1.3" stroke-dasharray="3 5" stroke-linecap="round"/></svg>' +
    (page === 1 ? player() : '') +
    boy() + girl() + dots() + disc() + volume();

  stage.insertAdjacentHTML('beforeend', scene);

  var btn = stage.querySelector('.disc');
  var btnText = stage.querySelector('.disc-note');
  var vol = stage.querySelector('.vol');

  var audio = document.getElementById('song');
  var src = audio ? audio.getAttribute('src') : null;
  if (src) {
    store(SRC_KEY, src);
  } else {
    src = store(SRC_KEY);
    if (src) {
      audio = document.createElement('audio');
      audio.src = src;
      audio.preload = 'auto';
    } else {
      audio = null;
    }
  }
  if (audio) audio.loop = true;

  function savedVolume() {
    var v = parseFloat(store(VOL_KEY));
    if (!isFinite(v)) return DEFAULT_VOL;
    return Math.min(1, Math.max(0, v));
  }

  function volumeSupported() {
    try {
      var t = new Audio();
      t.volume = 0.5;
      return t.volume === 0.5;
    } catch (e) {
      return false;
    }
  }

  var canVolume = !!audio && volumeSupported();

  if (canVolume) {
    var startVol = savedVolume();
    audio.volume = startVol;
    vol.value = startVol;
    vol.style.setProperty('--fill', startVol * 100 + '%');
    vol.addEventListener('input', function () {
      var v = Number(vol.value);
      audio.volume = v;
      vol.style.setProperty('--fill', v * 100 + '%');
      store(VOL_KEY, String(v));
    });
  } else {
    vol.style.display = 'none';
  }

  var introDone = page !== 1;
  var seeked = false;
  var hintTimer = null;

  function hint() {
    btn.classList.add('hint');
    clearTimeout(hintTimer);
    hintTimer = setTimeout(function () {
      btn.classList.remove('hint');
    }, 3500);
  }

  function wanted() {
    return store(STATE_KEY) === 'on';
  }

  function save() {
    if (!audio) return;
    store(TIME_KEY, String(audio.currentTime));
    store(TS_KEY, String(Date.now()));
  }

  function seek() {
    if (!audio || seeked) return;
    seeked = true;
    var t = parseFloat(store(TIME_KEY));
    var ts = Number(store(TS_KEY));
    if (!isFinite(t) || !ts) return;
    var pos = t + (wanted() ? (Date.now() - ts) / 1000 : 0);
    var d = audio.duration;
    if (isFinite(d) && d > 0) pos = pos % d;
    try {
      audio.currentTime = pos;
    } catch (e) {}
  }

  if (audio) {
    if (audio.readyState >= 1) seek();
    else audio.addEventListener('loadedmetadata', seek);
  }

  function ensure() {
    if (!audio || !wanted() || !audio.paused) return;
    var p = audio.play();
    if (p && p.catch) p.catch(function () {});
  }

  function sync() {
    var on = wanted();
    btn.classList.toggle('off', !on);
    btnText.textContent = on ? TEXT_ON : TEXT_OFF;
    body.classList.toggle('playing', on && introDone);
  }

  var unlockEvents = ['pointerup', 'touchend', 'click', 'keydown'];

  function unlock(e) {
    if (e.target && e.target.closest && e.target.closest('.disc, .vol')) return;
    ensure();
  }

  function release() {
    unlockEvents.forEach(function (n) {
      document.removeEventListener(n, unlock, true);
    });
  }

  unlockEvents.forEach(function (n) {
    document.addEventListener(n, unlock, true);
  });

  if (audio) {
    audio.addEventListener('playing', release);
    setInterval(save, 1000);
  }

  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') save();
  });
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      body.classList.remove('opening');
      opening = false;
      stage.classList.remove('leave');
      seeked = false;
      seek();
      sync();
      ensure();
    }
  });

  btn.addEventListener('click', function () {
    if (wanted()) {
      store(STATE_KEY, 'off');
      if (audio) audio.pause();
      save();
    } else {
      store(STATE_KEY, 'on');
      if (audio) {
        var p = audio.play();
        if (p && p.catch) p.catch(function () {});
      }
    }
    sync();
    hint();
  });

  var opening = false;

function setPage(n) {
  page = n;
  body.dataset.page = String(n);

  var ds = stage.querySelectorAll('.dots i');
  for (var i = 0; i < ds.length; i++) ds[i].classList.toggle('on', i + 1 === n);

  // player + note cuma ada di page 1
  var old = stage.querySelectorAll('.player, .note');
  for (var j = 0; j < old.length; j++) old[j].remove();
  if (n === 1) stage.querySelector('.arc').insertAdjacentHTML('afterend', player());
}

function go(url, push) {
  return fetch(url)
    .then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    })
    .then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var newContent = doc.querySelector('.content');
      if (!newContent) throw new Error('no content');

      // ganti isi page, audio & scene tidak tersentuh
      stage.querySelector('.content').replaceWith(document.importNode(newContent, true));

      var oldPop = stage.querySelector('.popup');
      if (oldPop) oldPop.remove();
      var newPop = doc.querySelector('.popup');
      if (newPop) stage.appendChild(document.importNode(newPop, true));

      document.title = doc.title;
      setPage(Number(doc.body.dataset.page) || 1);

      body.classList.remove('opening');
      opening = false;
      stage.classList.remove('leave');
      window.scrollTo(0, 0);
      if (push) history.pushState({}, '', url);

      bindPage();
      sync();
    })
    .catch(function () {
      window.location.href = url; // fallback: pindah page biasa
    });
}

document.addEventListener('click', function (e) {
  var a = e.target.closest ? e.target.closest('a.btn') : null;
  if (!a) return;
  e.preventDefault();
  if (opening || stage.classList.contains('leave')) return;
  save();
  var href = a.getAttribute('href');

  if (a.classList.contains('btn-open')) {
    opening = true;
    body.classList.add('opening');
    setTimeout(function () { go(href, true); }, 1800);
    return;
  }

  stage.classList.add('leave');
  setTimeout(function () { go(href, true); }, 380);
});

// tombol back/forward browser
window.addEventListener('popstate', function () {
  go(location.href, false);
});

  function runIntro() {
    var t = 900;
    setTimeout(function () {
      body.classList.remove('away');
      body.classList.add('walk');
    }, t);
    t += 3800;
    setTimeout(function () {
      body.classList.remove('walk');
      body.classList.add('reach');
    }, t);
    t += 750;
    setTimeout(function () {
      body.classList.add('press');
      store(STATE_KEY, 'on');
      store(TIME_KEY, '0');
      store(TS_KEY, String(Date.now()));
      ensure();
    }, t);
    t += 520;
    setTimeout(function () {
      body.classList.remove('press');
      body.classList.remove('intro');
      introDone = true;
      store(INTRO_KEY, '1');
      sync();
    }, t);
    t += 700;
    setTimeout(function () {
      body.classList.remove('reach');
    }, t);
    t += 500;
    setTimeout(function () {
      btn.classList.add('show');
      vol.classList.add('show');
      hint();
    }, t);
  }

 if (page === 1 && !store(INTRO_KEY)) {
  sync();
  var gate = document.createElement('div');
  gate.className = 'gate';
  gate.innerHTML =
    '<div class="gate-box" role="dialog" aria-modal="true">' +
    '<span class="gate-badge"><svg class="heart" viewBox="-8 -8 16 16" aria-hidden="true"><path d="' + HEART + '"/></svg></span>' +
    '<h2 class="gate-title">Selamat datang,<br>kesayanganku</h2>' +
    '<button class="gate-btn" type="button">Mulai</button>' +
    '</div>';
  stage.appendChild(gate);

  gate.querySelector('.gate-btn').addEventListener('click', function () {
    if (audio) {
      try {
        var p = audio.play();
        if (p && p.catch) p.catch(function () {});
        audio.pause();
        audio.currentTime = 0;
      } catch (e) {}
    }
    gate.classList.add('gone');
    setTimeout(function () { gate.remove(); }, 600);
    runIntro();
  });
} else {
    body.classList.remove('away');
    introDone = true;
    sync();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        body.classList.remove('intro');
        sync();
      });
    });
    setTimeout(function () {
      btn.classList.add('show');
      vol.classList.add('show');
    }, 500);
    ensure();
  }

var yes, wait, answer, popup;

  function openPopup() {
    if (!popup) return;
    popup.classList.add('show');
    popup.setAttribute('aria-hidden', 'false');
  }

  function closePopup() {
    if (!popup) return;
    popup.classList.remove('show');
    popup.setAttribute('aria-hidden', 'true');
  }

 function bindPage() {
  yes = document.querySelector('.btn-yes');
  wait = document.querySelector('.btn-wait');
  answer = document.querySelector('.answer');
  popup = document.querySelector('.popup');

  if (yes) {
    yes.addEventListener('click', function () {
      setAnswer('Makasih sudah mau memaafkan aku.', 'Aku sayang kamu, Idan.');
      hearts();
      setTimeout(openPopup, 1100);
    });
  }
  if (wait) wait.addEventListener('click', showSad);
  if (popup) {
    popup.addEventListener('click', function (e) {
      if (e.target === popup || (e.target.closest && e.target.closest('.popup-close'))) closePopup();
    });
  }
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closePopup();
});

bindPage();

  function setAnswer(small, big) {
  var s = answer.querySelector('.small');
  var b = answer.querySelector('.big');
  answer.classList.add('swap');
  setTimeout(function () {
    answer.classList.remove('sad');
    var old = answer.querySelector('.scatter');
    if (old) old.remove();
    s.textContent = small;
    b.textContent = big;
    answer.classList.remove('swap');
  }, 350);
}

function showSad() {
  answer.classList.add('swap');
  setTimeout(function () {
    answer.classList.add('sad');
    if (!answer.querySelector('.scatter')) {
      var box = document.createElement('div');
      box.className = 'scatter';
      box.innerHTML =
        '<span class="w w1">Sayang,</span>' +
        '<span class="w w2">maafin</span>' +
        '<span class="w w3">aku</span>' +
        '<span class="w w4">dongg</span>' +
        '<img class="pic" src="picture/kucing%20sedih.webp" alt="kucing sedih">';
      answer.querySelector('.big').insertAdjacentElement('afterend', box);
    }
    answer.classList.remove('swap');
  }, 350);
}

  function hearts() {
    for (var i = 0; i < 16; i++) {
      var el = document.createElement('span');
      var size = 12 + Math.random() * 18;
      el.className = 'floater';
      el.style.left = 12 + Math.random() * 76 + '%';
      el.style.animationDelay = Math.random() * 1.2 + 's';
      el.style.animationDuration = 2.8 + Math.random() * 1.6 + 's';
      el.innerHTML = '<svg width="' + size + '" height="' + size + '" viewBox="-8 -8 16 16"><path d="' + HEART + '"/></svg>';
      stage.appendChild(el);
      (function (node) {
        setTimeout(function () {
          node.remove();
        }, 6000);
      })(el);
    }
  }
})();