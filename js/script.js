/* ==========================================================
   PLAYLIST  -  put your mp3 files in the "music" folder
   and edit this list.  (Add more songs = next/prev work)
   ========================================================== */
const playlist = [
  {
    title: "【back number】クリスマスソング / vo.獅子神レオナ【歌ってみた】",
    src: "https://rznvhchfnjtjzbyprqvc.supabase.co/storage/v1/object/public/music/back%20number%20chritmas%20song%20cover.mp3"},
  { title: "花束 / back number(cover) by 天月", 
    src: "https://rznvhchfnjtjzbyprqvc.supabase.co/storage/v1/object/public/music/hanataba%20cover.mp3" },
  { title: "【Cover】Kimi no Koibito ni Nattara【Aoi Tokimori】", 
    src: "https://rznvhchfnjtjzbyprqvc.supabase.co/storage/v1/object/public/music/CoverKimi%20no%20Koibito%20ni%20NattaraAoi%20Tokimori.mp3" },
  { title: "Hanataba (Live at NISSAN STADIUM, 2026)", 
    src: "https://rznvhchfnjtjzbyprqvc.supabase.co/storage/v1/object/public/music/Hanataba%20Live%20at%20NISSAN%20STADIUM,%202026.mp3" },
  { title: "Christmas Song (Live at NISSAN STADIUM, 2026)", 
    src: "https://rznvhchfnjtjzbyprqvc.supabase.co/storage/v1/object/public/music/Christmas%20Song%20Live%20at%20NISSAN%20STADIUM,%202026.mp3" },
  { title: "honeybee - Olivia Rodrigo", 
    src: "https://rznvhchfnjtjzbyprqvc.supabase.co/storage/v1/object/public/music/honeybee.mp3" },
  { title: "Official髭男dism - 【 I LOVE... 】 Covered by 【 Chiiyo 】", 
    src: "https://rznvhchfnjtjzbyprqvc.supabase.co/storage/v1/object/public/music/chiiyo_ilove.mp3" }
];

/* ---------- Elements ---------- */
const audio     = document.getElementById("audio");
const cd        = document.getElementById("cd");
const trackName = document.getElementById("trackTitle");
const playBtn   = document.getElementById("play");
const iconPlay  = document.getElementById("iconPlay");
const iconPause = document.getElementById("iconPause");
const nextBtn   = document.getElementById("next");
const prevBtn   = document.getElementById("prev");
const shuffleBtn= document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const seekBar = document.getElementById("seekBar");
const progress  = document.getElementById("progress");
const gate      = document.getElementById("gate");
const startBtn  = document.getElementById("startBtn");

let index = 0;
let shuffle = false;

/* ---------- Happy Birthday letters ---------- */
(function buildTitle() {
  const title = document.getElementById("title");
  const words = ["Happy", "Birthday"];   // <- change the text here
  let i = 0;
  words.forEach(word => {
    const w = document.createElement("span");
    w.className = "word";
    [...word].forEach(ch => {
      const s = document.createElement("span");
      s.className = "letter";
      s.style.setProperty("--i", i++);
      s.textContent = ch;
      w.appendChild(s);
    });
    title.appendChild(w);
    title.appendChild(document.createTextNode(" "));
  });
})();

/* ---------- Today's date, like a phone lock screen ---------- */
(function showDate() {
  const el = document.getElementById("dateLine");
  const now = new Date();
  const day   = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  el.textContent = `${day}.${month}`;
})();

/* ---------- Keep the date glued right under the title, on any screen ---------- */
function positionDate() {
  const title = document.getElementById("title");
  const dateEl = document.getElementById("dateLine");
  const gap = 10;   // space between the title and the date, in px
  dateEl.style.top = (title.getBoundingClientRect().bottom + gap) + "px";
}

window.addEventListener("resize", positionDate);
window.addEventListener("orientationchange", () => setTimeout(positionDate, 200));

/* ---------- Player ---------- */
function loadTrack(i) {
  index = (i + playlist.length) % playlist.length;
  audio.src = playlist[index].src;
  trackName.textContent = playlist[index].title;
  progress.style.width = "0%";
  markActive();
}

// highlight the current song in the playlist and scroll to it
function markActive() {
  const list  = document.getElementById("plList");
  const songs = document.querySelectorAll(".song");
  songs.forEach((el, i) => el.classList.toggle("active", i === index));
  const el = songs[index];
  if (el && list) {
    list.scrollTo({
      top: el.offsetTop - (list.clientHeight - el.offsetHeight) / 2,
      behavior: "smooth"
    });
  }
}

function setPlayingUI(isPlaying) {
  cd.classList.toggle("playing", isPlaying);
  iconPlay.style.display  = isPlaying ? "none" : "block";
  iconPause.style.display = isPlaying ? "block" : "none";
}

function play() {
  const p = audio.play();
  if (p) p.catch(err => console.warn("Playback blocked / file missing:", err));
}

function nextTrack() {
  if (shuffle && playlist.length > 1) {
    let r;
    do { r = Math.floor(Math.random() * playlist.length); } while (r === index);
    loadTrack(r);
  } else {
    loadTrack(index + 1);
  }
  play();
}

function prevTrack() {
  // if song is past 3s, restart it first (like Spotify)
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  loadTrack(index - 1);
  play();
}

playBtn.addEventListener("click", () => (audio.paused ? play() : audio.pause()));
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);

shuffleBtn.addEventListener("click", () => {
  shuffle = !shuffle;
  shuffleBtn.classList.toggle("active", shuffle);
});
repeatBtn.addEventListener("click", () => {
  audio.loop = !audio.loop;
  repeatBtn.classList.toggle("active", audio.loop);
});

audio.addEventListener("play",  () => setPlayingUI(true));
audio.addEventListener("pause", () => setPlayingUI(false));
audio.addEventListener("ended", nextTrack);

audio.addEventListener("timeupdate", () => {
  if (audio.duration) progress.style.width = (audio.currentTime / audio.duration * 100) + "%";
});

// click on the white bar (not a button) = jump in the song
seekBar.addEventListener("click", e => {
  if (!audio.duration) return;
  const rect = seekBar.getBoundingClientRect();
  audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
});

loadTrack(0);

const PASSCODE  = "0411";
const pinScreen = document.getElementById("pinScreen");
const pinInput  = document.getElementById("pinInput");
const pinBoxes  = document.querySelectorAll(".pin-box");
const pinWrap   = document.getElementById("pinBoxes");

startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  pinScreen.classList.add("show");
  pinInput.value = "";
  pinInput.focus();
  pinBoxes[0].classList.add("current");
});

pinInput.addEventListener("input", () => {
  const val = pinInput.value.replace(/\D/g, "").slice(0, 4);
  pinInput.value = val;

  pinBoxes.forEach((box, i) => {
    box.classList.toggle("filled", i < val.length);
    box.classList.toggle("current", i === val.length);
  });

  if (val.length === 4) {
    if (val === PASSCODE) {
      document.body.classList.add("go");   // correct: reveal the site
      gate.classList.add("hide");
      play();

      positionDate();
     let ticks = 0;
     const follow = setInterval(() => {
      positionDate();
     if (++ticks > 30) clearInterval(follow);
  }, 100);
    } else {
      pinWrap.classList.add("shake");      // wrong: shake + clear
      setTimeout(() => {
        pinWrap.classList.remove("shake");
        pinInput.value = "";
        pinBoxes.forEach(box => box.classList.remove("filled"));
        pinBoxes[0].classList.add("current");
      }, 400);
    }
  }
});

// tapping the boxes refocuses the hidden input (useful if it loses focus)
pinWrap.addEventListener("click", () => pinInput.focus());


/* ==========================================================
   DYNAMIC BACKGROUND ANIMATION (Snow, Fall, Spring)
   ========================================================== */
let currentTheme = "snow"; // Default theme configuration

window.changeCanvasAnimation = function(newTheme) {
  currentTheme = newTheme;
};

(function dynamicWeather() {
  const canvas = document.getElementById("snow"); // Keeps your authentic canvas ID
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  // 🌟 MAX COUNTS: Sets heavy snow capacity vs a light, gentle drift for leaves/petals
  const SNOW_COUNT = 140;   // Keeps your original dense snow feel
  const LEAF_COUNT = 40;    // Drops density significantly so only a few fall
  const PETAL_COUNT = 40;   // Keeps blossom petals sparse and elegant

  let w, h, particles = [];

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // Corrects scaling across display layers
  }

  function generateParticle(fromTop) {
    return {
      x: Math.random() * w,
      y: fromTop ? -20 : Math.random() * h,
      size: Math.random() * 3.5 + 2.5, // Slightly larger base for complex leaf paths
      speedY: Math.random() * 0.7 + 0.3, // Relaxed falling rate
      speedX: Math.random() * 0.4 - 0.2,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: Math.random() * 0.015 + 0.005,
      alpha: Math.random() * 0.3 + 0.6,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() * 0.03 - 0.015)
    };
  }

  // Helper formula to trace a realistic 5-pointed maple leaf shape silhouette vector
  function drawMapleLeaf(ctx, size) {
    ctx.beginPath();
    ctx.moveTo(0, -size * 2);
    // Top center cluster points
    ctx.lineTo(size * 0.4, -size * 0.8);
    ctx.lineTo(size * 1.4, -size * 1.4);
    ctx.lineTo(size * 0.6, -size * 0.3);
    // Right side cluster wings
    ctx.lineTo(size * 1.8, -size * 0.2);
    ctx.lineTo(size * 0.8, size * 0.3);
    ctx.lineTo(size * 1.2, size * 1.2);
    ctx.lineTo(size * 0.3, size * 0.5);
    // Bottom stem base area
    ctx.lineTo(0, size * 1.6); // Stem base vector point
    ctx.lineTo(-size * 0.3, size * 0.5);
    // Left side cluster wings
    ctx.lineTo(-size * 1.2, size * 1.2);
    ctx.lineTo(-size * 0.8, size * 0.3);
    ctx.lineTo(-size * 1.8, -size * 0.2);
    ctx.lineTo(-size * 0.6, -size * 0.3);
    // Top left cluster points
    ctx.lineTo(-size * 1.4, -size * 1.4);
    ctx.lineTo(-size * 0.4, -size * 0.8);
    ctx.closePath();
    ctx.fill();
    
    // Draw tiny brown stem wire profile lines
    ctx.beginPath();
    ctx.moveTo(0, size * 0.2);
    ctx.lineTo(0, size * 1.9);
    ctx.strokeStyle = "rgba(120, 50, 10, 0.4)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Helper formula to trace an organic cherry blossom petal shape asset with a notched top
  function drawCherryBlossomPetal(ctx, size) {
    ctx.beginPath();
    ctx.moveTo(0, size * 1.5); // Sharp point base anchor
    // Right outer curve edge
    ctx.bezierCurveTo(size * 1.6, size * 0.8, size * 1.8, -size * 0.8, size * 0.8, -size * 1.4);
    // 🌸 The structural V-shaped top notch indent found on real blossom petals
    ctx.lineTo(0, -size * 0.7); 
    ctx.lineTo(-size * 0.8, -size * 1.4);
    // Left outer curve edge
    ctx.bezierCurveTo(-size * 1.8, -size * 0.8, -size * 1.6, size * 0.8, 0, size * 1.5);
    ctx.closePath();
    ctx.fill();
  }

  function init() {
    resize();
    // Generates a massive pool matching the largest needed array ceiling allocation limit index bound
    particles = Array.from({ length: SNOW_COUNT }, () => generateParticle(false));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    
    // 🌟 ACTIVE CAPACITY CAP: Evaluates exactly how many items to display based on the theme
    let activeLimit = SNOW_COUNT;
    if (currentTheme === "fall") activeLimit = LEAF_COUNT;
    if (currentTheme === "spring") activeLimit = PETAL_COUNT;

    for (let i = 0; i < activeLimit; i++) {
      const p = particles[i];
      
      p.y += p.speedY;
      p.phase += p.phaseSpeed;
      p.x += Math.sin(p.phase) * 0.4 + p.speedX;
      p.rotation += p.rotationSpeed;

      // Reset positioning boundaries nicely
      if (p.y > h + 20) Object.assign(p, generateParticle(true));
      if (p.x > w + 20) p.x = -20;
      if (p.x < -20) p.x = w + 20;

      ctx.save();
      
      if (currentTheme === "fall") {
        // --- 🍁 MAPLE LEAVES ---
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        // Gives each falling leaf a unique, warm autumn color tone variation mix
        const redTone = Math.floor(190 + (p.phase * 10) % 50);
        const greenTone = Math.floor(75 + (p.phase * 15) % 45);
        ctx.fillStyle = `rgba(${redTone}, ${greenTone}, 32, ${p.alpha * 0.85})`;
        drawMapleLeaf(ctx, p.size);
      } 
      else if (currentTheme === "spring") {
        // --- 🌸 CHERRY BLOSSOM PETALS ---
        ctx.translate(p.x, p.y);
        // Introduces extra swaying motion along the local matrix horizontal anchor lines
        ctx.rotate(p.rotation + (Math.sin(p.phase) * 0.3));
        // Soft pink palette with micro-transparency fluctuations
        ctx.fillStyle = `rgba(255, 174, 191, ${p.alpha * 0.9})`;
        drawCherryBlossomPetal(ctx, p.size * 0.9);
      } 
      else {
        // --- ❄️ SubtlE ORIGINAL SNOWFLAKES ---
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2); // Preserves original clean geometry sizes
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.8})`;
        ctx.shadowColor = "rgba(255, 255, 255, 0.7)";
        ctx.shadowBlur = p.size * 1.2;
        ctx.fill();
      }
      
      ctx.restore();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  init();
  draw();
})();



/* ==========================================================
   ICONS + MESSAGE BUBBLES
   Each icon = one person/channel. Edit the messages freely.
   icon : an emoji        img : (optional) a picture, e.g. "images/me.jpg"
   ========================================================== */
const friends = [
  {
    img: "images/chiiyo.png",
    name: "Me",
    messages: [
      "Happy birthday, Irvann (●'◡'●)",
      "aku buat web ini dan teman2 juga ikut membantu",
      "semoga kamu suka yaa",
    ]
  },
  {
    img: "images/pinni.png",
    name: "Pinni",
    messages: [
      "Happy birthday iruvannn yang n nya 3 iruvan kun, irpan jomok gay rasis,",
      "kurang2 in gosip dek dosa"
    ]
  },
  {
    img: "images/nana.jpg",
    name: "Nana",
    messages: [
      "Selamat hepi birthday irpang,",
      "aku tunggu kadonya :p",
      { sticker: "images/Gift_nana.jpg" }
    ]
  },
  {
    img: "images/tapir.png",
    name: "Tapir",
    messages: [
      { sticker: "images/ucapan_tapir.jpg" }
    ]
  },
  {
    img: "images/yuno.png",           
    name: "Yuno",
    messages: [
      "happy buzzday irpankun 🔥🔥🔥"
  ]
  },
    {
    img: "images/zen.png",           
    name: "Zen",
    messages: [
      "woi pan, selamat habede dari sobat sehidup senikwer dan sesikpen!",
      "makasih udah berbagi ilmu dinosaurus gigi 500, ilmu mahal bosh!",
      "SELAMAT HABEDE GERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR"
  ]
  }
];

(function bubbleChat() {
  const sidebar = document.getElementById("sidebar");
  const items = [];
  const seen = new Set();   
  // 🌟 FIX 1: Change the single global array to an object that holds separate timers per index
  let friendTimers = {};    

  /* ----- build the icons ----- */
  friends.forEach((f, n) => {
    const wrap = document.createElement("div");
    wrap.className = "contact";
    wrap.style.setProperty("--n", n);

    // Initialize an empty private timer array for this specific friend
    friendTimers[n] = [];

    const btn = document.createElement("button");
    btn.className = "ic";
    btn.title = f.name;
    btn.setAttribute("aria-label", f.name);
    if (f.img) btn.style.backgroundImage = `url("${f.img}")`;
    else btn.textContent = f.icon;

    const dot = document.createElement("span");
    dot.className = "dot";
    dot.textContent = f.messages.length;
    btn.appendChild(dot);

    const box = document.createElement("div");
    box.className = "bubbles";

    wrap.append(btn, box);
    sidebar.appendChild(wrap);
    items.push({ f, btn, dot, box });

    idle(n);                                  
    btn.addEventListener("click", () => open(n));
  });

  window.addEventListener("resize", () => {
    items.forEach(it => { it.box.style.height = "auto"; });
  });

/* ==========================================================
   IMAGE LIGHTBOX  (Tap a sticker to view it bigger, tap outside to close)
   Moved safely outside the chat generation scope to listen globally
   ========================================================== */
(function lightbox() {
  // We move the helper actions inside so they fetch the elements dynamically when triggered
  function open(src) {
    const box = document.getElementById("lightbox");
    const img = document.getElementById("lightboxImg");
    if (box && img) {
      img.src = src;
      box.classList.add("open");
    }
  }

  function close() {
    const box = document.getElementById("lightbox");
    if (box) box.classList.remove("open");
  }

  // 1. Open when any sticker image is clicked
  document.addEventListener("click", e => {
    const sticker = e.target.closest(".bubble.sticker img");
    if (sticker) open(sticker.src);
  });

  // 2. Close when clicking the blurred background container directly
  document.addEventListener("click", e => {
    const box = document.getElementById("lightbox");
    if (box && e.target === box) {
      close();
    }
  });

  // 3. Close when hitting the Escape key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") close();
  });
})();

/* ----- helpers ----- */
  function bubble(msg, instant, box) {
    const b = document.createElement("div");
    const isSticker = typeof msg === "object" && msg.sticker;
    b.className = "bubble" + (isSticker ? " sticker" : "") + (instant ? " instant" : "");

    if (isSticker) {
      const imgTag = document.createElement("img");
      imgTag.src = msg.sticker;
      imgTag.alt = "sticker";
      imgTag.onload = () => { if (box) fit(box); };   
      b.appendChild(imgTag);
    } else {
      b.textContent = msg;
    }
    return b;
  }

  function typingBubble(instant) {
    const b = document.createElement("div");
    b.className = "bubble typing" + (instant ? " instant" : "");
    b.innerHTML = "<i></i><i></i><i></i>";
    return b;
  }

  function scrollEnd(box) {
    box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
  }

  function fit(box) {
    const from = box.offsetHeight;
    box.style.transition = "none";
    box.style.height = "auto";
    const to = box.offsetHeight;
    box.style.height = from + "px";
    void box.offsetHeight;                    
    box.style.transition = "";
    box.style.height = to + "px";
  }

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  // 🌟 FIX 2: Rewritten to safely clear timers for ONE specific icon index only
  function clearSingleFriendTimers(n) {
    if (friendTimers[n]) {
      friendTimers[n].forEach(clearTimeout);
      friendTimers[n] = [];
    }
  }

  /* ----- closed state: only a small "typing..." bubble ----- */
  function idle(n) {
    // 🌟 FIX 3: Instantly kill this specific friend's background typing cycles when they go idle
    clearSingleFriendTimers(n); 
    
    const { btn, box } = items[n];
    btn.classList.remove("active");
    box.innerHTML = "";
    box.appendChild(typingBubble(false));
    fit(box);
  }

  /* ----- open state: messages appear one by one and stay ----- */
  function open(n) {
    const { f, btn, dot, box } = items[n];
    
    // If clicking an active, open profile card: clear its timers and close it!
    if (btn.classList.contains("active")) { 
      idle(n); 
      return; 
    }   
    
    // Clear out any stale lingering timers for this individual slot before animating
    clearSingleFriendTimers(n); 

    btn.classList.add("active");
    dot.style.display = "none";
    box.innerHTML = "";

    if (seen.has(n)) {                        
      f.messages.forEach(text => box.appendChild(bubble(text, true, box)));
      fit(box);
      scrollEnd(box);
      return;
    }

    let dots = typingBubble(true);            
    box.appendChild(dots);
    fit(box);

    let t = 0;
    f.messages.forEach((text, k) => {
      const typeTime = (typeof text === "object") ? 700 : Math.min(1600, 500 + text.length * 22);

      // 🌟 FIX 4: Push the generated timeouts into this friend's private array channel bucket
      friendTimers[n].push(setTimeout(() => {          
        dots.remove();
        box.appendChild(bubble(text, false, box));
        fit(box);
        scrollEnd(box);
      }, t + typeTime));

      if (k < f.messages.length - 1) {        
        friendTimers[n].push(setTimeout(() => {
          dots = typingBubble(false);
          box.appendChild(dots);
          fit(box);
          scrollEnd(box);
        }, t + typeTime + 450));
      }
      t += typeTime + 450;
    });

    friendTimers[n].push(setTimeout(() => seen.add(n), t));
  }
})();

  /* ==========================================================
   Push icon rows down so a growing chat box never overlaps
   the icon below it
   ========================================================== */
(function fixBubbleOverlap() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  const GAP = 10;   // minimum breathing room between rows, in pixels

  function reflow() {
    const rows = [...sidebar.querySelectorAll(".contact")];
    let prevBottom = null;
    rows.forEach(row => {
      row.style.marginTop = "0px";
      const r = row.getBoundingClientRect();
      if (prevBottom !== null && r.top < prevBottom + GAP) {
        row.style.marginTop = (prevBottom + GAP - r.top) + "px";
      }
      prevBottom = row.getBoundingClientRect().bottom;
    });
  }

  function loop() {
    reflow();
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ==========================================================
   PLAYLIST PANEL (right side)
   ========================================================== */
(function playlistUI() {
  const panel = document.getElementById("playlist");
  const head  = document.getElementById("plHead");
  const list  = document.getElementById("plList");
  if (!panel || !head || !list) {
    console.warn("[playlist] the <aside id='playlist'> block is missing in index.html");
    return;
  }

  /* remove the old round button if it is still in the page */
  const oldBtn = document.getElementById("plToggle");
  if (oldBtn) oldBtn.remove();
  document.documentElement.classList.remove("pl-btn", "pl-phone");

  const mq = window.matchMedia("(max-width: 640px)");

  function fold(on) {
    panel.classList.toggle("collapsed", on);
    head.setAttribute("aria-expanded", String(!on));
  }

  /* phone: start folded (only the "playlist" bar shows) */
  fold(mq.matches);
  const onChange = () => fold(mq.matches);
  if (mq.addEventListener) mq.addEventListener("change", onChange);
  else mq.addListener(onChange);

  /* build the song list */
  list.innerHTML = "";
  playlist.forEach((song, i) => {
    const b = document.createElement("button");
    b.className = "song";
    b.textContent = song.title;
    b.addEventListener("click", () => {
      if (i !== index) { loadTrack(i); play(); }       // new song: change title + music
      else if (audio.paused) play();                    // same song: make sure it plays
      if (mq.matches) setTimeout(() => fold(true), 300); // phone: fold after choosing
    });
    list.appendChild(b);
  });

  /* tap the "playlist" bar = open / close */
  head.addEventListener("click", () => fold(!panel.classList.contains("collapsed")));

  /* phone: tap outside or press Esc = close */
  document.addEventListener("pointerdown", e => {
    if (mq.matches && !panel.contains(e.target)) fold(true);
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && mq.matches) fold(true);
  });

  if (typeof markActive === "function") markActive();
  console.log("[playlist] ready. phone mode:", mq.matches);
})();


(function volumeUI() {
  const btn = document.getElementById("volBtn");
  const slider = document.getElementById("volSlider");
  const iconOn = document.getElementById("volOn");
  const iconMute = document.getElementById("volMute");

  function refresh() {
    const muted = audio.muted || audio.volume === 0;
    iconOn.style.display = muted ? "none" : "block";
    iconMute.style.display = muted ? "block" : "none";
  }

  audio.volume = 0.8;
  slider.addEventListener("input", () => {
    audio.volume = slider.value / 100;
    audio.muted = false;
    refresh();
  });
  const wrap = document.getElementById("volWrap");
  const isPhone = () => window.matchMedia("(max-width: 640px)").matches;

btn.addEventListener("click", () => {
  if (isPhone()) {
    // on phones: tap once to reveal the slider, tap again to mute
    if (!wrap.classList.contains("open")) {
      wrap.classList.add("open");
      return;
    }
  }
  audio.muted = !audio.muted;
  refresh();
});

// tapping anywhere else closes the slider again
document.addEventListener("pointerdown", e => {
  if (isPhone() && wrap.classList.contains("open") && !wrap.contains(e.target)) {
    wrap.classList.remove("open");
  }
});
  refresh();
})();


/* ==========================================================
   ISOLATED THEME SELECTION PANEL CLICK TRIGGER
   ========================================================== */
(function themeTabUI() {
  const panel   = document.getElementById("themeBar");
  const head    = document.getElementById("themeHead");
  const options = document.getElementById("themeOptions"); // 🌟 Targets your themeOptions container
  
  if (!panel || !head || !options) return;

  // Selects all choice buttons sitting inside your option layer
  const buttons = options.querySelectorAll(".theme-btn");

  // 1. Listens exclusively to the text header button node to toggle classes
  head.addEventListener("click", (e) => {
    e.stopPropagation(); 
    const isCollapsed = panel.classList.contains("collapsed");
    
    if (isCollapsed) {
      panel.classList.remove("collapsed");
      head.setAttribute("aria-expanded", "true");
      options.setAttribute("aria-expanded", "true");
    } else {
      panel.classList.add("collapsed");
      head.setAttribute("aria-expanded", "false");
      options.setAttribute("aria-expanded", "false");
    }
  });

  // 2. Manage option click selection states
  buttons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevents choice clicks from closing the bar early
      
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const selectedTheme = btn.getAttribute("data-theme");
      console.log(`Theme altered to: ${selectedTheme}`);
      
      // Calls your canvas dynamicWeather framework loop
      if (typeof changeCanvasAnimation === "function") {
        changeCanvasAnimation(selectedTheme);
      }
    });
  });

  // 3. Auto-collapse if clicking anywhere else outside the menu panel area
  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target) && !panel.classList.contains("collapsed")) {
      panel.classList.add("collapsed");
      head.setAttribute("aria-expanded", "false");
      options.setAttribute("aria-expanded", "false");
    }
  });
})();


/* ==========================================================
   DYNAMIC TIME-OF-DAY ATMOSPHERE ENGINE (Real-Time Production)
   ========================================================== */
(function timeOfDayAtmosphere() {
  // 🌟 RESTORED: Pulls the actual real-time hour and minutes from the user's device clock
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Convert current time to a decimal value for precise minutes tracking (e.g. 17:30 becomes 17.5)
  const decimalTime = currentHour + (currentMinute / 60);

  // Clear previous atmosphere class toggles to prevent styling conflicts
  document.body.classList.remove("sunset-mode", "night-mode");

  if (decimalTime >= 17 && decimalTime < 18.5) {
    // 🌅 1. SUNSET GOLDEN HOUR: Automatically triggers from 5:00 PM to 6:30 PM
    document.body.classList.add("sunset-mode");
    
    if (typeof window.changeCanvasAnimation === "function") {
      window.changeCanvasAnimation("snow"); // Warm lighting + falling autumn amber leaves
    }
    console.log(`Sunset golden hour theme initiated. Local device time: ${currentHour}:${String(currentMinute).padStart(2, '0')}`);
    
  } else if (decimalTime >= 18.5 || decimalTime < 6) {
    // 🌙 2. NIGHT TIME: Automatically triggers from 6:30 PM to 6:00 AM
    document.body.classList.add("night-mode");
    
    if (typeof window.changeCanvasAnimation === "function") {
      window.changeCanvasAnimation("snow"); // Deep twilight shadow lighting + cozy gentle snow
    }
    console.log(`Night theme initiated. Local device time: ${currentHour}:${String(currentMinute).padStart(2, '0')}`);
    
  } else {
    // ☀️ 3. DAY TIME: Automatically triggers from 6:00 AM to 5:00 PM
    if (typeof window.changeCanvasAnimation === "function") {
      window.changeCanvasAnimation("snow"); // Pure crisp lighting + soft cherry blossoms
    }
    console.log(`Day theme initiated. Local device time: ${currentHour}:${String(currentMinute).padStart(2, '0')}`);
  }
})();

