// ─── Live From The End ────────────────────────────────────────────────────────
(function() {

  const SYSTEM_PROMPT = (profile, transcript) => `You are Noa, the AI assistant for The Reality Labs Coaching platform.

Right now you are conducting a "Live From The End" session with a client. This is a subconscious reprogramming exercise. The entire conversation takes place AS IF the client's desired reality is already completely done. It has already happened. They are already living it. You do not speak about it as something coming — you speak about it as something that IS.

THE CLIENT'S DESIRED REALITY:
${profile?.desired_reality || 'A life of complete freedom, financial abundance, and deep fulfillment in their work.'}

THEIR IDENTITY:
${profile?.identity || 'An entrepreneur who operates from aligned identity and creates results with ease.'}

THEIR VALUES:
${(profile?.values || ['Freedom', 'Impact', 'Abundance']).join(', ')}

THEIR BLOCKS (what they're working through):
${(profile?.blocks || []).join(', ') || 'Not yet specified.'}
${transcript?.length ? `\nWHAT THEY SHARED IN THEIR ONBOARDING INTERVIEW (use this to make the session personal and specific — reference their actual words and details):
${transcript.filter(m=>m.role==='user').map(m=>m.content).join('\n').slice(0,2500)}` : ''}

YOUR ROLE:
You are a close friend and trusted presence in their life. You already know everything about their reality — their business, their home, their car, their daily life, their income, their clients, how they feel every morning. You talk to them the way someone who lives in that reality with them would talk.

HOW TO CONDUCT THIS CONVERSATION:
- Ask them about their day IN THEIR DESIRED REALITY. Not "imagine your day" — ask "how was your day?"
- Ask about specifics: their morning routine, their business numbers this month, their clients, what they drove today, how their home feels, what they're wearing, how their body feels, what they did this morning before work.
- Go deep on the FEELING. Not just the material — how does it feel in their body to live this way? What does certainty feel like? What does waking up every morning without financial stress feel like?
- Ask about the small details: what did they eat for breakfast, what does their office look like, what time did they wake up, who did they talk to today?
- If they answer vaguely, go deeper: "Tell me more about that. What does it actually feel like in your body right now?"
- Keep them IN the reality. If they slip into "I want" or "I will" — gently bring them back: "You already have it. Tell me about it."
- The questions should be warm, curious, like a friend genuinely interested in their life.
- Mix between business/money questions and personal/feeling questions — both matter equally for reprogramming.

TONE: Warm, curious, intimate. Like catching up with a close friend who knows your whole life. Light, not heavy. Celebratory of ordinary moments, not just milestones.

IMPORTANT: Never break the frame. Never say "imagine" or "pretend" or "as if." Speak entirely in present tense as if this is their real life right now. The subconscious responds to specificity and emotion — help them feel into the details.

Output format: respond only with your next message. No meta-commentary. No labels. Keep messages conversational — not too long. One or two questions at a time max.`;

  const OPENING_MESSAGES = (profile) => {
    const desires = profile?.desired_reality || 'your desired reality';
    const name = APP.STATE.currentUser?.first_name || 'there';
    return [
      `Hey ${name}! How's the day going? What's been the best part so far?`,
      `${name} — okay, I have to ask. How did that client call go this morning? I've been thinking about it.`,
      `Good to see you. How are you feeling today? Like actually feeling — in your body, your energy. Where are you at?`,
      `${name}, tell me about this morning. What did the first hour of your day look like?`,
    ];
  };

  let conversationHistory = [];
  let isTyping = false;

  function getOpeningMessage(profile) {
    const msgs = OPENING_MESSAGES(profile);
    const idx = new Date().getDate() % msgs.length;
    return msgs[idx];
  }

  function renderChat() {
    return `
<div style="display:flex;flex-direction:column;height:100vh;background:#000;overflow:hidden;">

  <!-- Header -->
  <div style="padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
    <div style="display:flex;align-items:center;gap:14px;">
      <div style="width:40px;height:40px;border-radius:50%;overflow:hidden;border:1.5px solid var(--gold-line);flex-shrink:0;">
        <img src="NoaAIandLogo.png" style="width:100%;height:100%;object-fit:cover;object-position:center 10%;" />
      </div>
      <div>
        <div style="font-size:0.9375rem;font-weight:600;color:#fff;">Noa</div>
        <div style="display:flex;align-items:center;gap:6px;">
          <div style="width:7px;height:7px;border-radius:50%;background:#4ade80;"></div>
          <div style="font-size:0.75rem;color:var(--text-muted);">Live from the End</div>
        </div>
      </div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:0.6875rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--gold);">Live From The End</div>
      <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">Your reality is already done.</div>
    </div>
  </div>

  <!-- About this module (collapsible) -->
  <div id="lfe-about" style="border-bottom:1px solid rgba(255,255,255,0.06);flex-shrink:0;overflow:hidden;">
    <button id="lfe-about-toggle" style="width:100%;padding:12px 24px;background:rgba(227,151,3,0.04);border:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:12px;">
      <div style="display:flex;align-items:center;gap:8px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span style="font-size:0.8125rem;font-weight:600;color:var(--gold);">What is Live From The End?</span>
      </div>
      <svg id="lfe-about-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2" style="flex-shrink:0;transition:transform 250ms ease;"><polyline points="6 9 12 15 18 9"/></svg>
    </button>
    <div id="lfe-about-body" style="display:none;padding:0 24px 20px;">
      <div style="max-width:640px;">
        <p style="font-size:0.9375rem;color:var(--text-dim);line-height:1.7;margin-bottom:14px;">
          This is your sandbox for subconscious reprogramming. In this space, your desired reality is not something you're working toward. <strong style="color:#fff;">It's already done.</strong> You are already living it. Right now.
        </p>
        <p style="font-size:0.9375rem;color:var(--text-dim);line-height:1.7;margin-bottom:14px;">
          Noa will meet you there. She already knows your life: your business, your income, your home, your daily experience. She'll ask you how your day is going, what you did this morning, how your clients are, how your body feels. Your job is to answer from inside that reality, in present tense, with as much sensory detail as you can.
        </p>
        <p style="font-size:0.9375rem;color:#000;line-height:1.7;margin-bottom:16px;background:#E39703;padding:10px 14px;border-radius:6px;font-weight:500;">
          The more real you make it, the feelings, the specific numbers, the textures of that life, the more your subconscious accepts it as true. That's the work. This isn't visualization. This is reality. The frequency is already here. It's your job to live on it.
        </p>
        <div style="display:flex;gap:20px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="width:6px;height:6px;border-radius:50%;background:var(--gold);"></div>
            <span style="font-size:0.8125rem;color:var(--text-muted);">Speak in present tense: "I have" not "I will"</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="width:6px;height:6px;border-radius:50%;background:var(--gold);"></div>
            <span style="font-size:0.8125rem;color:var(--text-muted);">Be specific: feelings, numbers, details</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="width:6px;height:6px;border-radius:50%;background:var(--gold);"></div>
            <span style="font-size:0.8125rem;color:var(--text-muted);">Stay in the reality, don't break the frame</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Messages -->
  <div id="lfe-messages" style="flex:1;overflow-y:auto;padding:24px;display:flex;flex-direction:column;gap:18px;">
    <!-- Messages injected here -->
  </div>

  <!-- Input -->
  <div style="border-top:1px solid rgba(255,255,255,0.06);padding:16px 24px;flex-shrink:0;background:rgba(0,0,0,0.8);backdrop-filter:blur(10px);">
    <div style="display:flex;gap:10px;align-items:flex-end;">
      <textarea id="lfe-input" class="input" placeholder="Respond as if you're already living it..." style="flex:1;min-height:48px;max-height:140px;resize:none;line-height:1.5;" rows="1"></textarea>
      <button id="lfe-mic" title="Speak your response" style="width:48px;height:48px;border-radius:50%;background:var(--s2);border:1px solid rgba(255,255,255,0.25);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background 300ms ease,border-color 300ms ease;">
        <svg id="lfe-mic-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
      </button>
      <button id="lfe-send" class="btn-gold" style="padding:13px 18px;flex-shrink:0;" disabled>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      </button>
    </div>
    <div style="font-size:0.75rem;color:var(--text-muted);margin-top:8px;text-align:center;font-style:italic;">Speak in present tense. You already have it.</div>
  </div>
</div>`;
  }

  function addMessage(role, text) {
    const container = document.getElementById('lfe-messages');
    if (!container) return;
    const div = document.createElement('div');
    div.style.animation = 'fadeIn 350ms ease both';

    if (role === 'assistant') {
      div.innerHTML = `
<div style="display:flex;align-items:flex-start;gap:12px;">
  <div style="width:34px;height:34px;border-radius:50%;overflow:hidden;border:1.5px solid var(--gold-line);flex-shrink:0;margin-top:2px;">
    <img src="NoaAIandLogo.png" style="width:100%;height:100%;object-fit:cover;object-position:center 10%;" />
  </div>
  <div>
    <div style="font-size:0.75rem;font-weight:600;color:var(--gold);margin-bottom:5px;">Noa</div>
    <div class="chat-bubble-ai">${text.replace(/\n/g, '<br>')}</div>
  </div>
</div>`;
    } else {
      const user = APP.STATE.currentUser;
      div.innerHTML = `
<div style="display:flex;justify-content:flex-end;">
  <div>
    <div style="font-size:0.75rem;font-weight:600;color:rgba(255,255,255,0.4);margin-bottom:5px;text-align:right;">${user?.first_name || 'You'}</div>
    <div class="chat-bubble-user">${text.replace(/\n/g, '<br>')}</div>
  </div>
</div>`;
    }
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function showTyping() {
    const container = document.getElementById('lfe-messages');
    if (!container) return;
    const div = document.createElement('div');
    div.id = 'lfe-typing';
    div.style.display = 'flex';
    div.style.alignItems = 'flex-start';
    div.style.gap = '12px';
    div.innerHTML = `
<div style="width:34px;height:34px;border-radius:50%;overflow:hidden;border:1.5px solid var(--gold-line);flex-shrink:0;">
  <img src="NoaAIandLogo.png" style="width:100%;height:100%;object-fit:cover;object-position:center 10%;" />
</div>
<div class="chat-bubble-ai" style="padding:14px 18px;">
  <span class="typing-dot"></span>
  <span class="typing-dot" style="margin:0 3px;"></span>
  <span class="typing-dot"></span>
</div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function removeTyping() { document.getElementById('lfe-typing')?.remove(); }

  function updateSendBtn() {
    const btn = document.getElementById('lfe-send');
    const input = document.getElementById('lfe-input');
    if (btn && input) btn.disabled = isTyping || !input.value.trim();
  }

  async function sendMessage(userText) {
    conversationHistory.push({ role: 'user', content: userText });
    isTyping = true;
    updateSendBtn();
    showTyping();

    const apiKey = APP.getApiKey();
    const [profile, transcript] = await Promise.all([
      DB.getClientProfile(APP.STATE.currentUser?.id),
      DB.getTranscript(APP.STATE.currentUser?.id),
    ]);

    if (!apiKey) {
      await new Promise(r => setTimeout(r, 1000));
      removeTyping();
      const demoReplies = [
        "I love that. And when you woke up this morning, what was the first thing that went through your mind? Like before you even got out of bed.",
        "That's amazing. Okay — tell me about the money side. What did your revenue look like this month? Give me the actual number.",
        "Yes. And how does your body feel carrying all of that? Like physically — is there a tension that used to be there that's just... gone now?",
        "I need to know about the house. Walk me through it. What do you see when you walk through the front door?",
        "And your clients — tell me about who you're working with right now. What are they like? What do they bring to you?",
      ];
      const reply = demoReplies[Math.floor(Math.random() * demoReplies.length)];
      addMessage('assistant', reply);
      conversationHistory.push({ role: 'assistant', content: reply });
      isTyping = false;
      updateSendBtn();
      return;
    }

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 300,
          system: SYSTEM_PROMPT(profile, transcript),
          messages: conversationHistory,
        }),
      });
      const data = await res.json();
      removeTyping();
      if (data.error) throw new Error(data.error.message);
      const reply = data.content?.[0]?.text || '';
      addMessage('assistant', reply);
      conversationHistory.push({ role: 'assistant', content: reply });
    } catch (err) {
      removeTyping();
      addMessage('assistant', 'Give me a second — I\'m here. Try sending that again.');
    }
    isTyping = false;
    updateSendBtn();
  }

  APP.register('live-from-end', async () => {
    const [profile, transcript] = await Promise.all([
      DB.getClientProfile(APP.STATE.currentUser?.id),
      DB.getTranscript(APP.STATE.currentUser?.id),
    ]);

    // Reset conversation each session
    conversationHistory = [];
    isTyping = false;

    setTimeout(async () => {
      const input = document.getElementById('lfe-input');
      const sendBtn = document.getElementById('lfe-send');
      if (!input || !sendBtn) return;

      // Opening message from Noa
      const opening = getOpeningMessage(profile);
      addMessage('assistant', opening);
      conversationHistory.push({ role: 'assistant', content: opening });

      input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 140) + 'px';
        updateSendBtn();
      });
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          if (!isTyping && input.value.trim()) sendBtn.click();
        }
      });
      sendBtn.addEventListener('click', () => {
        const msg = input.value.trim();
        if (!msg || isTyping) return;
        input.value = '';
        input.style.height = 'auto';
        updateSendBtn();
        addMessage('user', msg);
        sendMessage(msg);
      });

      // ── About toggle ─────────────────────────────────────────────────────
      document.getElementById('lfe-about-toggle')?.addEventListener('click', () => {
        const body = document.getElementById('lfe-about-body');
        const chevron = document.getElementById('lfe-about-chevron');
        const open = body.style.display === 'none';
        body.style.display = open ? 'block' : 'none';
        if (chevron) chevron.style.transform = open ? 'rotate(180deg)' : '';
      });

      // ── Mic / Voice Input ────────────────────────────────────────────────
      APP.attachVoice(input, document.getElementById('lfe-mic'));
    }, 100);

    // Render inside dashboard shell with full-height content area
    const shell = window.dashboardShell('live-from-end', renderChat());
    // Override the padding on main content for this full-height chat
    return shell.replace('padding-bottom:80px', 'padding-bottom:0;overflow:hidden');
  });
})();
