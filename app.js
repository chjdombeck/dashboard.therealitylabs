// ─── API Key Config ───────────────────────────────────────────────────────────
function getApiKey() {
  return localStorage.getItem('rl_api_key') || '';
}

// ─── State ───────────────────────────────────────────────────────────────────
const STATE = {
  currentUser: null,
  currentView: 'login',
  viewParams: {},
};

// ─── Exercise & Meditation Libraries (static, no DB needed) ──────────────────
const EXERCISES_LIBRARY = [
  { id: 'ex-1', title: 'Pattern Mapping', type: 'exercise', category: 'Pattern Work', phase: 1, estimatedMinutes: 20, description: 'Identify the recurring patterns in your business and life. Map the belief underneath each one.', instructions: ['Find a quiet space. Open a blank document or journal.', 'List every pattern you notice repeating in your business or life, missed deadlines, avoiding sales calls, self-sabotage before a win.', 'For each pattern, ask: "What belief would produce this behavior?"', 'Write the belief explicitly. Don\'t soften it.', 'Now ask: "When did I first decide this was true?"'] },
  { id: 'ex-2', title: 'Belief Audit', type: 'exercise', category: 'Belief Work', phase: 2, estimatedMinutes: 30, description: 'Surface every limiting belief currently running. Reframe each one using bridge statements, not toxic positivity, real bridges.', instructions: ['List every limiting belief you currently hold about yourself, money, and success. Write fast, don\'t edit.', 'For each belief, write a bridge statement, a statement that is true AND moves toward the desired belief.', 'Example: "I\'m not good enough" → "I\'ve overcome harder things than this" → "I\'m becoming someone who delivers."', 'Read all bridge statements aloud.'] },
  { id: 'ex-3', title: 'Identity Archaeology', type: 'exercise', category: 'Identity', phase: 2, estimatedMinutes: 45, description: 'Trace a current result back to its root belief. Find the exact moment the program was installed.', instructions: ['Pick one result in your life you don\'t want.', 'Ask: what belief would produce this result? Write it.', 'Ask: where did I learn this? What environment, person, or event?', 'Sit with the origin. You\'re not blaming it, you\'re locating it.', 'Now ask: that was true then. Is it still true? What\'s actually true now?'] },
  { id: 'ex-4', title: 'Future Self Letter', type: 'exercise', category: 'Identity', phase: 3, estimatedMinutes: 30, description: 'Write a letter from your future self, 3 years out, to your present self. Present tense. Specific. No vagueness.', instructions: ['Close your eyes. Inhabit the version of you that already has what you want, 3 years from now.', 'Open your eyes and write directly from that identity.', 'Include: what your day looks like, how you feel in your body, what\'s in your business, who surrounds you.', 'Write in present tense. No "I will", only "I am" and "I have."', 'Close the letter. Read it slowly. Notice what lands.'] },
  { id: 'ex-5', title: 'Identity Declaration', type: 'exercise', category: 'Identity', phase: 3, estimatedMinutes: 20, description: 'Write 20 "I am the kind of person who..." statements from your future identity.', instructions: ['Write 20 statements beginning with "I am the kind of person who..."', 'These are not who you are today. These are who you are becoming.', 'Be specific. Not "I am successful", "I am the kind of person who closes $10K deals without flinching."', 'Read them aloud.', 'Pick the 3 that feel most true AND most uncomfortable. Those are the ones doing the work.'] },
  { id: 'ex-6', title: 'The Ladder', type: 'exercise', category: 'Belief Work', phase: 3, estimatedMinutes: 25, description: 'Map the gap between a limiting belief and a desired belief. Build the bridge beliefs that connect them.', instructions: ['Write your current limiting belief at the bottom of a ladder.', 'Write your desired belief at the top.', 'Write 5–7 bridge beliefs that step from one to the other, each one slightly truer than the last.', 'The ladder only works if every rung feels believable. If a rung feels fake, break it into smaller steps.'] },
  { id: 'ex-7', title: 'Vision Integration', type: 'exercise', category: 'Visualization', phase: 4, estimatedMinutes: 40, description: 'Write a full-page description of your desired reality as if it\'s already happened. Sensory, specific, present tense.', instructions: ['Open a blank document. Set a timer for 30 minutes.', 'Write your desired reality in present tense as if it has already happened.', 'Include every sense: what you see, hear, feel in your body, smell, taste.', 'Include: your business numbers, your day-to-day, your relationships, your body, your emotional state.', 'Do not stop. Do not edit. Write through the resistance.', 'When done, read it aloud. Notice where your body contracts, that\'s where the subconscious disagrees.'] },
  { id: 'ex-8', title: 'The Identity Gap', type: 'exercise', category: 'Identity', phase: 5, estimatedMinutes: 20, description: 'Side-by-side: who you\'re being now vs. who you need to be. What decisions would that person make today?', instructions: ['Draw a line down the middle of a page. Label one side "Current Identity" and the other "Required Identity."', 'Fill in both sides honestly. Who are you being? Who do you need to be?', 'List 3 decisions the Required Identity would make today that the current one is avoiding.', 'Make one of them today.'] },
];

const MEDITATIONS_LIBRARY = [
  { id: 'med-1', title: 'Morning Vision Activation', durationMinutes: 5, theme: 'Start the day inside your desired reality', phase: 4, description: 'Before the day gets its hands on you, step into the version of your life that already exists.', audioUrl: null, guidedScript: `Close your eyes. Take three slow breaths.\n\nFeel your feet on the floor. Feel the weight of your body.\n\nNow, imagine it's three years from now. You've built what you set out to build. You are living inside the reality you've been working toward.\n\nWhat does this morning feel like? What do you see when you open your eyes in this reality?\n\nStay here for a moment. Let the details arrive. The space you're in. The feeling in your chest. What's on your mind.\n\nThis is not a fantasy. This is a preview. Your subconscious doesn't know the difference between a vivid image and a real event. You're programming it right now.\n\nBreathe into this reality. Let it become familiar. Let it feel like home.\n\nWhen you're ready, open your eyes. Carry this feeling into your day.` },
  { id: 'med-2', title: 'Future Self Embodiment', durationMinutes: 10, theme: 'Inhabit the identity of who you\'re becoming', phase: 3, description: 'The version of you that already has what you want exists. This meditation takes you there.', audioUrl: null, guidedScript: `Find a comfortable position. Close your eyes.\n\nTake five deep breaths. With each exhale, let the noise of the day fall away.\n\nNow imagine a version of you, three years from now, walking toward you. This is the person who has built the business. Who has done the inner work.\n\nWatch them. Notice how they carry themselves. Their posture. Their pace. The ease in their face.\n\nNow step into them. Feel yourself merge with this version of you. You are now inside their body.\n\nHow does the world look from here? What does it feel like to carry this level of certainty?\n\nStay here. Let this identity become familiar to your nervous system.\n\nThis is who you're becoming. The subconscious is listening.\n\nWhen you're ready, return. But bring a piece of this identity back with you.` },
  { id: 'med-3', title: 'Subconscious Reprogramming Body Scan', durationMinutes: 15, theme: 'Deep relaxation + installing new beliefs', phase: 3, description: 'Your subconscious is most receptive when your body is relaxed. This meditation uses that window.', audioUrl: null, guidedScript: `Lie down or sit in a position where your body can fully relax.\n\nClose your eyes. Take a slow breath in through your nose... and out through your mouth.\n\nBegin to scan your body from the top of your head downward. Wherever you find tension, breathe into it. Let it release.\n\nHead and scalp. Relax.\nFace and jaw. Let go.\nNeck and shoulders. Release.\nChest and heart. Soften.\nStomach. Breathe.\nHips. Release.\nLegs and feet. Let them be heavy.\n\nYou are now deeply relaxed. In this state, your subconscious is fully open.\n\nRepeat these statements silently, slowly, feeling each one:\n\n"I am the kind of person who creates results."\n"My identity determines my reality."\n"I am worthy of the vision I hold."\n"What I am becoming is inevitable."\n"My subconscious is being reprogrammed right now."\n\nStay in this space for a few more moments. Let these truths settle into the body.\n\nWhen you're ready, take a deep breath. Slowly open your eyes.` },
  { id: 'med-4', title: 'Releasing Limiting Beliefs', durationMinutes: 10, theme: 'Dissolve the programs creating resistance', phase: 2, description: 'Limiting beliefs don\'t dissolve by thinking harder about them. This meditation works where they live.', audioUrl: null, guidedScript: `Close your eyes. Settle in.\n\nBring to mind one limiting belief you know is running. Say it clearly in your mind.\n\nNow, where do you feel it in your body? There is always a physical location. Find it.\n\nBreath into that location. Don't try to change it yet. Just be with it.\n\nAsk this belief: when did you arrive? What were you trying to protect me from?\n\nAcknowledge it. It came from somewhere real. It served a purpose.\n\nNow tell it: "I see you. I understand why you came. And I no longer need you to protect me from this."\n\nImagine this belief as a weight in that part of your body. With your next exhale, release it.\n\nIn the space where the old belief lived, install the new one: state it clearly. Feel it in your body.\n\nBreathe it in. Let it land.\n\nOpen your eyes.` },
  { id: 'med-5', title: 'Identity Upgrade', durationMinutes: 8, theme: 'Full-body immersion in your new identity', phase: 3, description: 'A direct, immersive installation of the identity your next level requires.', audioUrl: null, guidedScript: `Sit upright. Close your eyes. Breathe.\n\nState your identity declaration aloud or silently: "I am the kind of person who..."\n\nFeel it. Don't just think it, feel it as true in your body.\n\nNow expand it. What else is true about this version of you? How do they speak? How do they sit?\n\nLet your body shift. Adjust your posture to match this identity. Breathe like this person breathes.\n\nYou are not performing. You are installing.\n\nThe subconscious learns through repetition and feeling. You are giving it both right now.\n\nStay here for as long as you need. Let this identity become your default.\n\nWhen you open your eyes, you carry this person with you.` },
  { id: 'med-6', title: 'Pattern Interruption Reset', durationMinutes: 7, theme: 'Break a pattern. Step into a new one.', phase: 3, description: 'When the old pattern fires, use this reset protocol.', audioUrl: null, guidedScript: `Close your eyes. Take one sharp breath in and hold it for 3 seconds.\n\nExhale completely. Reset.\n\nBring to mind the pattern. The exact moment it shows up. What triggers it?\n\nWatch it like a scene in a film. You are not in it, you're watching it.\n\nNow ask: what identity is producing this pattern? Name it without judgment.\n\nNow ask: what identity produces the opposite behavior?\n\nImagine yourself at the trigger point, and choosing the new response. Feel it in your body.\n\nRun through it three times. Same trigger. New response.\n\nYour nervous system is learning a new pathway.\n\nOpen your eyes. The pattern is no longer automatic. You have a choice now.` },
];

const BRAND_LINES = [
  "Your presence should scream safety and security.",
  "You are what you think... except most don't know what they're thinking.",
  "The genius isn't 'doing more'… he just has better access to the subconscious mind.",
  "Identity shifting means building a healthy disgust for the past version of you.",
  "When the subconscious program is set... there's nothing you have 'to do' anymore.",
  "Remove separation... assume you're already that which you seek to be.",
  "The conscious mind tells you to start paddling... the subconscious raises the sails and harnesses the wind.",
  "The biggest lie is that you can't have it all.",
  "Build something beyond comprehension... build something that the mind can't quite wrap its head around.",
  "Thoughts, action-taking, effort, 5%. Identity, beliefs, autopilot, 95%.",
  "You can plant your idea in the subconscious... and it will grow in the background as you go about your days.",
  "YOU will arrive before IT does.",
  "True growth is exponential... you don't want the fragile short-term results.",
  "The algorithm and the content… mind and reality.",
  "Why row your boat when you could harness the wind?",
  "When the results finally come through... it'll just feel like reality catching up to where you've already been.",
  "God sits patiently in your mind, waiting to be identified with.",
  "Once the subconscious mind grabs hold of your idea... there's nothing you have 'to do' anymore.",
  "It has to arrive as a feeling first... it's that feeling that you already are that which you desire to be.",
  "It will arrive as a feeling before it arrives as a material thing.",
  "The tide will rise inside before it spills over and floods your outer world.",
  "Close your eyes... go see who you are when nobody is watching.",
  "Somehow... the person rushing never actually gets there.",
  "Going broke is a form of death… live unafraid to die.",
  "First it will feel impossible… then suddenly it will feel inevitable.",
  "The ability to articulate your thoughts will unexpectedly translate into money in your pocket.",
  "You won't find linear results while playing an exponential game.",
  "Nothing… then everything all at once. Exponential, not linear.",
  "Everything you want is hiding in the way that you think about yourself.",
  "Thoughts are the raw materials.",
  "It's the most confusing thing when you discover that 'doing more' isn't getting you there faster...",
  "Once you live on the frequency… your goal floats right to you, like the air you breathe.",
  "Reality responds to your subconscious.",
  "You get what you are, not what you want.",
  "Change your identity → change your results.",
  "Reality creation is an inside job.",
  "Internal state creates external outcomes.",
];

// ─── Router ───────────────────────────────────────────────────────────────────
const VIEWS = {};
function register(name, fn) { VIEWS[name] = fn; }

function navigate(view, params = {}) {
  STATE.currentView = view;
  STATE.viewParams = params;
  render();
}

function render() {
  const app = document.getElementById('app');
  const view = VIEWS[STATE.currentView];
  if (view) {
    const result = view(STATE.viewParams || {});
    if (result && result.then) {
      result.then(html => { if (html) { app.innerHTML = html; bindEvents(); } });
    } else if (result) {
      app.innerHTML = result;
      bindEvents();
    }
  }
}

function bindEvents() {
  if (typeof window.initAvatarUpload === 'function') window.initAvatarUpload();
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      navigate(el.dataset.nav, el.dataset.params ? JSON.parse(el.dataset.params) : {});
    });
  });
  document.querySelectorAll('[data-action]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      if (el.dataset.action === 'logout') logout();
    });
  });
  updateFeedBadges();
}

function getFeedLastSeen(key) {
  return localStorage.getItem(key) ? new Date(localStorage.getItem(key)) : new Date(0);
}

function countNewItems(items, lastSeen) {
  return items.filter(a => new Date(a.created_at) > lastSeen).length;
}

function renderBadge(count) {
  if (!count) return '';
  const display = count > 99 ? '99+' : String(count);
  return `<span style="min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:var(--gold);color:#000;font-size:0.6875rem;font-weight:700;display:inline-flex;align-items:center;justify-content:center;line-height:1;margin-left:auto;">${display}</span>`;
}

function updateFeedBadges() {
  const user = STATE.currentUser;
  if (!user) return;

  // ── Client feed badge ──────────────────────────────────────────────────────
  const clientBadgeEl = document.getElementById('client-feed-badge');
  if (clientBadgeEl) {
    const lastSeen = getFeedLastSeen(`rl_feed_seen_${user.id}`);
    // Count from localStorage (works for demo; for real users falls back to 0 until feed is loaded)
    const myItems = (typeof DB !== 'undefined' && DB.demoGet) ? (DB.demoGet(`rl_demo_activity_${user.id}`) || []) : [];
    const coachItems = (typeof DB !== 'undefined' && DB.demoGet) ? [
      ...(DB.demoGet('rl_demo_activity_demo-admin-1') || []),
    ].filter(a => a.type === 'coach_post' || (a.metadata && a.metadata.target_client_id === user.id)) : [];
    const total = countNewItems([...myItems, ...coachItems], lastSeen);
    clientBadgeEl.innerHTML = renderBadge(total);
  }

  // ── Admin feed badge ───────────────────────────────────────────────────────
  const adminBadgeEl = document.getElementById('admin-feed-badge');
  if (adminBadgeEl) {
    const lastSeen = getFeedLastSeen(`rl_feed_seen_admin_${user.id}`);
    const allClients = (typeof DB !== 'undefined' && DB.demoGet) ? (DB.demoGet('rl_demo_clients') || []) : [];
    let allItems = [];
    allClients.forEach(c => {
      allItems = allItems.concat(DB.demoGet(`rl_demo_activity_${c.id}`) || []);
    });
    allItems = allItems.concat(DB.demoGet('rl_demo_activity_demo-client-1') || []);
    const total = countNewItems(allItems, lastSeen);
    adminBadgeEl.innerHTML = renderBadge(total);
  }
}

// ─── Auth ──────────────────────────────────────────────────────────────────────
async function login(username, password) {
  const user = await DB.login(username, password);
  STATE.currentUser = user;
  return user;
}

async function logout() {
  await DB.logout();
  STATE.currentUser = null;
  navigate('login');
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getDailyLine() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000);
  return BRAND_LINES[dayOfYear % BRAND_LINES.length];
}

function getStreak(checkIns) {
  const sorted = [...checkIns].sort((a, b) => b.date.localeCompare(a.date));
  if (!sorted.length) return 0;
  let streak = 0;
  let date = new Date();
  for (const entry of sorted) {
    const d = new Date(entry.date);
    const diff = Math.floor((date - d) / 86400000);
    if (diff <= 1) { streak++; date = d; }
    else break;
  }
  return streak;
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function formatDate(str) {
  if (!str) return '';
  return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function showLoading(msg = 'Loading...') {
  document.getElementById('app').innerHTML = `
<div style="min-height:100vh;background:#000;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:20px;">
  <img src="TRLLogomain.png" style="width:48px;height:48px;animation:pulse 2s ease infinite;" />
  <div style="font-size:0.9375rem;color:var(--text-muted);">${msg}</div>
</div>`;
}

// ─── Global Voice Input ───────────────────────────────────────────────────────
// Click to start, click again to stop. Never auto-sends, user clicks Send manually.
function attachVoice(inputEl, btnEl) {
  if (!inputEl || !btnEl) return;
  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognitionAPI) {
    btnEl.title = 'Voice input requires Chrome or Edge.';
    btnEl.style.opacity = '0.4';
    btnEl.addEventListener('click', () => alert('Voice input requires Chrome or Edge.'));
    return;
  }

  const svgEl = btnEl.querySelector('svg');
  let recognition = null;
  let listening = false;

  function setActive(on) {
    btnEl.style.background  = on ? 'rgba(227,151,3,0.18)' : '';
    btnEl.style.borderColor = on ? 'var(--gold)' : '';
    btnEl.style.animation   = on ? 'pulse 1.2s ease infinite' : '';
    if (svgEl) svgEl.setAttribute('stroke', on ? 'var(--gold)' : 'rgba(255,255,255,0.7)');
  }

  function start() {
    recognition = new SpeechRecognitionAPI();
    recognition.continuous     = true;   // never stops on silence
    recognition.interimResults = true;
    recognition.lang           = 'en-US';
    listening = true;
    setActive(true);

    const baseText = inputEl.value.trimEnd();
    let committed = '';

    recognition.onresult = e => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) committed += t;
        else interim = t;
      }
      const full = baseText ? baseText + ' ' + (committed + interim) : committed + interim;
      inputEl.value = full;
      inputEl.dispatchEvent(new Event('input'));
      inputEl.style.height = 'auto';
      inputEl.style.height = Math.min(inputEl.scrollHeight, 200) + 'px';
    };

    recognition.onend = () => {
      // Only restart if still supposed to be listening (handles browser auto-stop)
      if (listening) recognition.start();
    };

    recognition.onerror = e => {
      if (e.error === 'aborted') return; // user clicked stop, expected
      listening = false;
      setActive(false);
    };

    recognition.start();
  }

  function stop() {
    listening = false;
    setActive(false);
    recognition?.stop();
    recognition = null;
  }

  btnEl.addEventListener('click', () => { if (listening) stop(); else start(); });
}

function micButtonHTML(id) {
  return `<button id="${id}" title="Click to speak" style="width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.15);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background 0.2s,border-color 0.2s;">
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
  </button>`;
}

window.APP = {
  STATE, navigate, login, logout, register, bindEvents,
  getDailyLine, getStreak, todayStr, formatDate, showLoading,
  EXERCISES_LIBRARY, MEDITATIONS_LIBRARY, BRAND_LINES, getApiKey,
  attachVoice, micButtonHTML,
};

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  showLoading();
  const user = await DB.getSession();
  if (user && user.is_active !== false) {
    STATE.currentUser = user;
    if (user.role === 'admin') navigate('admin-dashboard');
    else if (!user.interview_completed) navigate('interview');
    else navigate('dashboard');
  } else {
    navigate('login');
  }
});
