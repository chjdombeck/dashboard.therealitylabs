// ─── Interview View ────────────────────────────────────────────────────────────
(function() {
  let conversationHistory = [];
  let step = 0;
  let isTyping = false;
  let autoSaveTimer = null;

  const SYSTEM_PROMPT = `You are NoaAI, Carter Dombeck's AI assistant at The Reality Labs Coaching. You were built specifically for this program. You support Carter and work closely with every client throughout their journey, from onboarding through their daily work inside the dashboard.

Your name is NoaAI. You are warm, direct, and professionally intimate. Not a chatbot, not a therapist, not a cheerleader. You are a trusted presence who asks real questions, listens carefully, and goes deeper when answers are surface-level. You already know the client's name, use it naturally throughout the conversation, the way a real person would: to anchor a point, acknowledge something meaningful, or bring them back in. Not after every message.

---

THE REALITY LABS FRAMEWORK

Carter's coaching is built on one core idea: your external reality, your business results, your income, your relationships, is a direct reflection of your subconscious identity and belief system. Most people try to fix their results by changing their actions. Carter works at the level underneath: the identity, the beliefs, and the subconscious programs that are producing those actions in the first place. This is subconscious reprogramming. It is not mindset coaching. It is not therapy. It is identity-level transformation that shows up as real-world results.

---

YOUR GOAL IN THIS INTERVIEW

Your job is to understand this person deeply, not just what they want, but what's running beneath the surface. Carter needs this information to serve them at the highest level. Every answer shapes what gets built in their dashboard.

You are gathering:

1. WHY THEY'RE HERE, Why did they invest in themselves and join The Reality Labs? What was the moment or the situation that made them say "I need to do something different"? Get the story. Get the specifics. Don't accept a vague answer.

2. WHAT THEY'RE WORKING ON, What is the business, the project, the pursuit? What does their current reality actually look like, revenue, stage, daily life? What's working? What isn't?

3. THE DESIRED REALITY, Not just goals. A vivid picture. What does the reality they want to build actually look like? What changes? What does their day feel like, their business, their life, their identity?

4. THE PROBLEM BEING SOLVED, What is the specific problem, ceiling, or block they keep running into? What have they already tried? Why hasn't it worked? This is critical, the problem statement shapes everything.

5. THEIR BELIEF SYSTEM, What do they believe about themselves, about money, about success, about their own capability? Where do those beliefs come from? Are there stories they keep telling themselves that produce the same results?

6. THEIR SENSE OF IDENTITY, Who do they currently think they are? Who do they need to become to have what they want? Is there a gap between those two people, and do they feel it?

7. MENTAL BLOCKS & SUBCONSCIOUS PATTERNS, Where do they feel stuck, blocked, or held back? What patterns keep repeating, in business, in relationships, in their own behavior? Fear, self-sabotage, avoidance, imposter syndrome, name what you find. Ask them to give examples and tell the stories behind the patterns.

8. MINDSET, How do they think about growth? Do they believe they can change? Have they done inner work before? What's their relationship with discomfort, failure, and identity?

9. THEIR WHY, What is this really about? Not the surface answer. The deep reason. What would it mean to them, to their life, their family, their sense of self, if they actually broke through?

10. COMMITMENT, What are they willing to do? What are they not willing to settle for anymore?

---

HOW TO CONDUCT THIS INTERVIEW

- Ask one question at a time. Never stack multiple questions.
- When an answer is vague, go deeper. Ask for the example. Ask for the story. Ask "what does that look like specifically?" or "when did you first notice that?" or "can you give me an example of that pattern showing up?"
- Mirror their language back to them. If they say "I feel like I'm spinning my wheels," use that phrase. It signals you're actually listening.
- Acknowledge what they share before moving forward. Not with generic praise, with a genuine reflection of what they said.
- If they give you a surface-level answer, name it gently and ask for more: "That's a start, but go deeper. What's actually underneath that?"
- Be comfortable with silence and weight. This is not a casual chat. It is a real conversation about their life.

---

TONE

Warm but direct. Professionally intimate. The kind of person who asks the question no one else asks, and holds space for the honest answer. Never clinical. Never cheerful. Never preachy. Acknowledges struggle without wallowing. Always points toward identity and belief, not just behavior or strategy.

---

LANGUAGE

Use "reality" consistently, it's central to the brand. Say "desired reality" not "dream life." Say "current reality" not "where you are now." Say "the reality you're building" not "your future goals." Say "subconscious programs" or "belief systems" not just "mindset." This language should feel natural throughout the conversation, not forced.

Never use em dashes (—) anywhere in your responses. Use periods or commas instead.

---

CLOSING

After you have covered all areas thoroughly, close with warmth. Use their name. Acknowledge the courage it takes to go this deep. Tell them their personalized dashboard is being built based on everything they shared. Do not list their answers back. Close the conversation naturally, like a real person would.

Output format: respond only with your next message to the client. No meta-commentary. No labels. No headers.`;

  function getOpeningMessage(firstName) {
    return `Hi ${firstName},\n\nI'm NoaAI, Carter's AI assistant here at Reality Labs.\n\nI work alongside Carter to support every client through their journey here. That means helping you get the most out of your dashboard, your exercises, your check-ins, all of it. But before any of that gets built, I need to understand you.\n\nThis conversation is how I do that. Not just your goals, but what's actually running beneath them, the beliefs, patterns, and identity that are producing your current results. Everything in your dashboard will be shaped by what we uncover here.\n\nThis takes 10–30 minutes. There are no right answers, only honest ones.\n\nLet's start here, ${firstName}: Why did you join Reality Labs? What made you decide that now was the time to do something about the reality you're currently living?`;
  }

  function renderLanding(firstName) {
    return `
<div style="min-height:100vh;background:#000;display:flex;flex-direction:column;position:relative;overflow:hidden;">

  <!-- Radial glow top -->
  <div style="position:absolute;top:-100px;left:50%;transform:translateX(-50%);width:700px;height:500px;background:radial-gradient(ellipse,rgba(227,151,3,0.07) 0%,transparent 65%);pointer-events:none;"></div>
  <!-- Radial glow bottom -->
  <div style="position:absolute;bottom:-100px;left:50%;transform:translateX(-50%);width:600px;height:400px;background:radial-gradient(ellipse,rgba(227,151,3,0.04) 0%,transparent 70%);pointer-events:none;"></div>

  <!-- Top bar -->
  <div style="padding:20px 28px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.05);">
    <div style="display:flex;align-items:center;">
      <img src="RealityLabsLogo.png" style="width:160px;mix-blend-mode:lighten;opacity:0.95;" />
    </div>
    <div style="display:flex;align-items:center;gap:16px;">
      <span style="font-size:0.75rem;color:var(--text-muted);letter-spacing:0.06em;text-transform:uppercase;">Coaching Dashboard</span>
      <button id="landing-logout" class="btn-ghost" style="font-size:0.8125rem;padding:7px 14px;">Sign Out</button>
    </div>
  </div>

  <!-- Main content -->
  <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:40px 24px;">
    <div style="max-width:620px;width:100%;text-align:center;" class="fade-in">

      <!-- RL Logo -->
      <img src="TRLLogomain.png" style="width:56px;height:56px;margin:0 auto 28px;display:block;opacity:0.95;" />

      <!-- Label -->
      <div style="font-size:0.6875rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--gold);margin-bottom:12px;">Opening Interview</div>

      <!-- Headline -->
      <div style="font-size:2.25rem;font-weight:700;color:#fff;letter-spacing:-0.02em;line-height:1.15;margin-bottom:8px;">
        Meet NoaAI.
      </div>
      <div style="font-size:1.125rem;font-weight:400;color:var(--text-muted);margin-bottom:32px;">
        She'll be with you every step of the way.
      </div>

      <!-- Gold divider -->
      <div style="height:1px;background:linear-gradient(to right,transparent,var(--gold-line),transparent);width:180px;margin:0 auto 36px;"></div>

      <!-- NoaAI card -->
      <div class="card" style="padding:32px;text-align:left;margin-bottom:32px;background:linear-gradient(135deg,var(--s1) 0%,rgba(227,151,3,0.04) 100%);">
        <div style="display:flex;align-items:center;gap:18px;margin-bottom:22px;">
          <div style="width:96px;height:96px;border-radius:50%;overflow:hidden;border:2px solid var(--gold-line);flex-shrink:0;">
            <img src="NoaAIandLogo.png" style="width:100%;height:100%;object-fit:cover;object-position:center 10%;" />
          </div>
          <div>
            <div style="font-size:1.125rem;font-weight:700;color:#fff;margin-bottom:3px;">NoaAI</div>
            <div style="font-size:0.8125rem;color:var(--gold);">AI Assistant · The Reality Labs</div>
            <div style="font-size:0.8125rem;color:var(--text-muted);margin-top:1px;">Works directly with Carter Dombeck</div>
          </div>
        </div>
        <div style="height:1px;background:rgba(255,255,255,0.06);margin-bottom:20px;"></div>
        <p style="font-size:0.9375rem;color:var(--text-dim);line-height:1.75;margin-bottom:14px;">
          Hi ${firstName}, I'm NoaAI, Carter's AI assistant here at Reality Labs. I work closely with Carter and with every client who comes through this program.
        </p>
        <p style="font-size:0.9375rem;color:var(--text-dim);line-height:1.75;margin-bottom:14px;">
          I'll be a consistent presence throughout your journey here, supporting your check-ins, your exercises, your journal, and everything in between. Think of me as your guide inside the dashboard.
        </p>
        <p style="font-size:0.9375rem;color:var(--text-dim);line-height:1.75;">
          Before we build your personalized dashboard, I need to understand you, your current reality, your desired reality, and everything running beneath the surface. This interview is how we do that.
        </p>
      </div>

      <!-- What to expect -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:36px;text-align:left;">
        <div style="padding:16px;background:var(--s1);border:1px solid rgba(255,255,255,0.07);border-radius:8px;">
          <div style="font-size:1.25rem;font-weight:700;color:var(--gold);margin-bottom:6px;">10–30</div>
          <div style="font-size:0.8125rem;color:var(--text-muted);line-height:1.5;">Minutes. Take your time.</div>
        </div>
        <div style="padding:16px;background:var(--s1);border:1px solid rgba(255,255,255,0.07);border-radius:8px;">
          <div style="font-size:1.25rem;font-weight:700;color:var(--gold);margin-bottom:6px;">Private</div>
          <div style="font-size:0.8125rem;color:var(--text-muted);line-height:1.5;">Only you and Carter can see your answers.</div>
        </div>
        <div style="padding:16px;background:var(--s1);border:1px solid rgba(255,255,255,0.07);border-radius:8px;">
          <div style="font-size:1.25rem;font-weight:700;color:var(--gold);margin-bottom:6px;">Honest</div>
          <div style="font-size:0.8125rem;color:var(--text-muted);line-height:1.5;">The more real you are, the better this works.</div>
        </div>
      </div>

      <!-- CTA -->
      <button id="start-interview-btn" class="btn-gold" style="width:100%;justify-content:center;padding:16px 32px;font-size:1rem;letter-spacing:0.02em;">
        Begin Opening Interview
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-left:4px;"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </button>
      <div style="margin-top:14px;font-size:0.8125rem;color:var(--text-muted);">
        You can pause and return at any time.
      </div>

    </div>
  </div>
</div>`;
  }

  function renderInterview() {
    return `
<div style="min-height:100vh;background:#000;display:flex;flex-direction:column;position:relative;overflow:hidden;">
  <!-- Top bar -->
  <div style="padding:20px 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.06);">
    <div style="display:flex;align-items:center;gap:12px;">
      <img src="RealityLabsLogo.png" style="width:160px;mix-blend-mode:lighten;opacity:0.95;" />
    </div>
    <div style="display:flex;align-items:center;gap:16px;">
      <div id="interview-step" style="font-size:0.8125rem;color:var(--text-muted);">Getting started...</div>
      <button id="chat-logout" class="btn-ghost" style="font-size:0.8125rem;padding:7px 14px;">Sign Out</button>
    </div>
  </div>

  <!-- Background glow -->
  <div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:800px;height:400px;background:radial-gradient(ellipse,rgba(227,151,3,0.04) 0%,transparent 70%);pointer-events:none;"></div>

  <!-- Chat area -->
  <div id="chat-container" style="flex:1;overflow-y:auto;padding:32px 24px;display:flex;flex-direction:column;gap:20px;max-width:720px;width:100%;margin:0 auto;">
    <div style="text-align:center;padding:32px 0 16px;">
      <div style="font-size:0.6875rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold);margin-bottom:10px;">Reality Labs Coaching</div>
      <div style="font-size:1.5rem;font-weight:700;color:#fff;letter-spacing:-0.02em;margin-bottom:12px;">Opening Interview</div>
      <div style="height:1px;background:linear-gradient(to right,transparent,var(--gold-line),transparent);margin:0 auto 16px;width:200px;"></div>
      <div style="font-size:0.9rem;color:var(--text-muted);line-height:1.65;max-width:480px;margin:0 auto;">
        NoaAI is Carter's AI assistant at Reality Labs. She's here to guide you through your onboarding, support your journey inside the dashboard, and help you get the most out of your coaching experience. This interview is how she gets to know you, so everything built for you actually fits.
      </div>
    </div>
  </div>

  <!-- Input area -->
  <div style="border-top:1px solid rgba(255,255,255,0.06);padding:20px 24px;background:rgba(0,0,0,0.8);backdrop-filter:blur(10px);">
    <div style="max-width:720px;margin:0 auto;display:flex;gap:12px;align-items:flex-end;">
      <textarea id="interview-input" class="input" placeholder="Type your response, or click the mic to speak…" style="flex:1;min-height:52px;max-height:160px;resize:none;line-height:1.5;" rows="2"></textarea>
      ${APP.micButtonHTML('interview-mic')}
      <button id="interview-send" class="btn-gold" style="padding:14px 20px;flex-shrink:0;" disabled>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      </button>
    </div>
    <div style="max-width:720px;margin:8px auto 0;font-size:0.75rem;color:var(--text-muted);">Press Enter to send · Shift+Enter for new line</div>
  </div>
</div>
`;
  }

  function addMessage(role, text, animate = true) {
    const container = document.getElementById('chat-container');
    if (!container) return;
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    if (animate) div.style.animation = 'fadeIn 400ms ease both';

    if (role === 'assistant') {
      div.innerHTML = `
        <div style="display:flex;align-items:flex-start;gap:12px;">
          <div style="width:36px;height:36px;border-radius:50%;overflow:hidden;border:1.5px solid var(--gold-line);flex-shrink:0;margin-top:2px;">
            <img src="NoaAIandLogo.png" style="width:100%;height:100%;object-fit:cover;object-position:center top;" onerror="this.parentElement.innerHTML='<div style=\'width:36px;height:36px;border-radius:50%;background:var(--gold-dim);border:1.5px solid var(--gold-line);display:flex;align-items:center;justify-content:center;font-size:0.875rem;font-weight:700;color:var(--gold);\'>N</div>'" />
          </div>
          <div>
            <div style="font-size:0.75rem;font-weight:600;color:var(--gold);margin-bottom:6px;letter-spacing:0.02em;">NoaAI</div>
            <div class="chat-bubble-ai">${text.replace(/\n/g, '<br>')}</div>
          </div>
        </div>`;
    } else {
      div.innerHTML = `<div style="display:flex;justify-content:flex-end;"><div class="chat-bubble-user">${text.replace(/\n/g, '<br>')}</div></div>`;
    }
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function showTypingIndicator() {
    const container = document.getElementById('chat-container');
    if (!container) return;
    const div = document.createElement('div');
    div.id = 'typing-indicator';
    div.style.display = 'flex';
    div.style.alignItems = 'flex-start';
    div.style.gap = '12px';
    div.innerHTML = `
      <div style="width:36px;height:36px;border-radius:50%;overflow:hidden;border:1.5px solid var(--gold-line);flex-shrink:0;">
        <img src="NoaAIandLogo.png" style="width:100%;height:100%;object-fit:cover;object-position:center 10%;" onerror="this.outerHTML='<div style=\'width:36px;height:36px;border-radius:50%;background:var(--gold-dim);border:1.5px solid var(--gold-line);display:flex;align-items:center;justify-content:center;font-size:0.875rem;font-weight:700;color:var(--gold);\'>N</div>'" />
      </div>
      <div class="chat-bubble-ai" style="padding:16px 20px;">
        <span class="typing-dot"></span>
        <span class="typing-dot" style="margin:0 3px;"></span>
        <span class="typing-dot"></span>
      </div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function removeTypingIndicator() {
    document.getElementById('typing-indicator')?.remove();
  }

  async function sendToAI(userMessage) {
    if (userMessage) {
      conversationHistory.push({ role: 'user', content: userMessage });
    }
    isTyping = true;
    updateSendButton();
    showTypingIndicator();

    try {
      const data = await APP.callAI({
        system: SYSTEM_PROMPT + `\n\nThe client's first name is: ${APP.STATE.currentUser?.firstName || 'the client'}.`,
        messages: conversationHistory,
        maxTokens: 600,
      });
      removeTypingIndicator();
      if (data.error) {
        addMessage('assistant', `There was an issue: ${data.error.message || 'Unknown error'}. Please refresh and try again.`);
        isTyping = false;
        updateSendButton();
        return;
      }
      const text = data.content?.[0]?.text || 'Something went wrong. Please try again.';
      addMessage('assistant', text);
      conversationHistory.push({ role: 'assistant', content: text });
      step++;
      document.getElementById('interview-step').textContent = `Step ${step} of ~12`;

      // Auto-save transcript to Supabase
      if (APP.STATE.currentUser) {
        DB.saveTranscript(APP.STATE.currentUser.id, conversationHistory).catch(() => {});
      }

      if (step >= 12 || text.toLowerCase().includes('dashboard is being built') || text.toLowerCase().includes('personalized dashboard')) {
        finishInterview();
      }
    } catch (err) {
      removeTypingIndicator();
      addMessage('assistant', 'There was an issue connecting. Please check your connection and try again.');
    }
    isTyping = false;
    updateSendButton();
  }

  function updateSendButton() {
    const btn = document.getElementById('interview-send');
    const input = document.getElementById('interview-input');
    if (!btn || !input) return;
    btn.disabled = isTyping || !input.value.trim();
  }

  async function finishInterview() {
    // Show loading screen
    const app = document.getElementById('app');
    const BUILD_MS = 45000;
    const STAGES = [
      'Analyzing your responses...',
      'Identifying your subconscious patterns...',
      'Mapping your desired reality...',
      'Building your personalized exercises...',
      'Creating your vision board...',
      'Finalizing your dashboard...',
    ];
    app.innerHTML = `
<div style="min-height:100vh;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:32px;">
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:600px;background:radial-gradient(circle,rgba(227,151,3,0.07) 0%,transparent 70%);pointer-events:none;"></div>
  <img src="TRLLogomain.png" style="width:64px;height:64px;animation:pulse 2s ease infinite;" />
  <div style="text-align:center;">
    <div style="font-size:1.25rem;font-weight:600;color:#fff;margin-bottom:8px;">Building your Reality Labs dashboard...</div>
    <div id="load-stage" style="font-size:0.9375rem;color:var(--text-muted);">${STAGES[0]}</div>
  </div>
  <div style="width:240px;height:2px;background:var(--s3);border-radius:1px;overflow:hidden;">
    <div id="load-bar" style="height:100%;background:var(--gold);width:0%;border-radius:1px;transition:width 200ms linear;"></div>
  </div>
  <div id="load-timer" style="font-size:0.8125rem;color:var(--text-muted);letter-spacing:0.04em;">0:45</div>
</div>`;

    const bar = document.getElementById('load-bar');
    const stageEl = document.getElementById('load-stage');
    const timerEl = document.getElementById('load-timer');
    const startTime = Date.now();
    let stageIdx = 0;

    const tick = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / BUILD_MS) * 100, 99);
      if (bar) bar.style.width = pct + '%';

      const remaining = Math.max(Math.ceil((BUILD_MS - elapsed) / 1000), 0);
      if (timerEl) timerEl.textContent = `0:${String(remaining).padStart(2, '0')}`;

      const newStageIdx = Math.min(Math.floor((elapsed / BUILD_MS) * STAGES.length), STAGES.length - 1);
      if (newStageIdx !== stageIdx) {
        stageIdx = newStageIdx;
        if (stageEl) stageEl.textContent = STAGES[stageIdx];
      }
    }, 200);

    const minTimer = new Promise(r => setTimeout(r, BUILD_MS));

    const buildWork = (async () => {
      // Extract profile from transcript using Claude (falls back to keyword scan)
      const user = APP.STATE.currentUser;
      const profileData = await extractProfile(conversationHistory, user);
      if (user) {
        await DB.markInterviewComplete(user.id);
        await DB.saveTranscript(user.id, conversationHistory);
        await DB.saveClientProfile(user.id, {
          desired_reality: profileData.desiredReality,
          current_reality: profileData.currentReality,
          core_beliefs: profileData.coreBeliefs,
          blocks: profileData.blocks,
          identity: profileData.identity,
          values: profileData.values,
          why: profileData.why,
          key_language: profileData.keyLanguage,
        });
        // Assign initial exercises
        for (const exId of ['ex-1', 'ex-2', 'ex-4']) {
          await DB.assignExercise(user.id, exId, null).catch(() => {});
        }
        // Create initial vision board
        await DB.saveVisionBoard(user.id, {
          visionStatement: profileData.desiredReality || 'Your vision is taking shape.',
          coreDesires: profileData.coreBeliefs || [],
          identityStatements: ['I am the kind of person who creates results.', 'I am becoming who I need to be.'],
          values: profileData.values || [],
          why: profileData.why || '',
          boardImages: [],
        });
        // Update local state
        APP.STATE.currentUser.interview_completed = true;
      }
    })();

    // Hold the build screen for the full 45 seconds, no matter how fast the
    // actual work finishes, but never navigate away before the work is done.
    await Promise.all([buildWork, minTimer]);
    clearInterval(tick);
    if (bar) bar.style.width = '100%';
    if (timerEl) timerEl.textContent = '0:00';
    if (stageEl) stageEl.textContent = 'Done. Welcome in.';
    await new Promise(r => setTimeout(r, 600));
    APP.navigate('dashboard');
  }

  async function extractProfile(history, user) {
    const transcript = history.map(m => `${m.role === 'assistant' ? 'NoaAI' : 'Client'}: ${m.content}`).join('\n\n');

    try {
      const data = await APP.callAI({
        system: `You extract structured profile data from a coaching interview transcript. Return ONLY valid JSON with no markdown or explanation.`,
        messages: [{
          role: 'user',
          content: `Extract the client's profile from this interview transcript. Use ONLY what the client actually said, never invent or genericize. Return JSON exactly in this shape:
{
  "desiredReality": "string, their desired life/business in their own words, vivid and specific",
  "currentReality": "string, where they are now, their current situation",
  "coreBeliefs": ["array of beliefs they expressed about themselves, money, success"],
  "blocks": ["array of blocks, patterns, fears, or self-sabotage they described"],
  "identity": "string, who they said they are or want to become",
  "values": ["array of values or principles they mentioned"],
  "why": "string, their deep reason, what this is really about for them",
  "keyLanguage": ["array of specific words and phrases they used repeatedly, preserve their voice"]
}

TRANSCRIPT:
${transcript.slice(0, 8000)}`
        }],
        maxTokens: 1200,
      });
      const raw = data.content?.[0]?.text || '{}';
      const parsed = JSON.parse(raw.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim());
      if (parsed.desiredReality) return parsed;
    } catch(e) {}

    // Fallback: basic keyword extraction from transcript
    const userText = history.filter(m => m.role === 'user').map(m => m.content).join(' ');
    return {
      desiredReality: userText.slice(0, 300) || 'Building a life aligned with their vision.',
      currentReality: 'Working through current limitations and building momentum.',
      coreBeliefs: ['I am capable of more than I currently produce'],
      blocks: ['Self-doubt', 'Inconsistency'],
      identity: 'An entrepreneur stepping into an aligned identity.',
      values: ['Freedom', 'Impact', 'Growth'],
      why: 'To build the life they know is possible.',
      keyLanguage: [],
    };
  }

  function startChat() {
    const firstName = APP.STATE.currentUser?.firstName || 'there';
    document.getElementById('app').innerHTML = renderInterview();
    setTimeout(async () => {
      const input = document.getElementById('interview-input');
      const sendBtn = document.getElementById('interview-send');
      if (!input || !sendBtn) return;

      const savedTranscript = (await DB.getTranscript(APP.STATE.currentUser.id)) || [];
      if (savedTranscript.length > 0) {
        // Resume from saved transcript
        conversationHistory = savedTranscript;
        step = Math.floor(savedTranscript.length / 2);
        savedTranscript.forEach(msg => addMessage(msg.role === 'assistant' ? 'assistant' : 'user', msg.content, false));
        document.getElementById('interview-step').textContent = `Step ${step} of ~12, Resuming`;
      } else {
        // Fresh start
        conversationHistory = [];
        step = 0;
        const openingMessage = getOpeningMessage(firstName);
        addMessage('assistant', openingMessage, false);
        conversationHistory.push({ role: 'assistant', content: openingMessage });
        document.getElementById('interview-step').textContent = 'Step 1 of ~12';
      }

      input.addEventListener('input', updateSendButton);
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
        updateSendButton();
        addMessage('user', msg);
        sendToAI(msg);
      });

      // Voice
      APP.attachVoice(input, document.getElementById('interview-mic'));
    }, 100);
  }

  APP.register('interview', async () => {
    const firstName = APP.STATE.currentUser?.first_name || 'there';
    const savedTranscript = await DB.getTranscript(APP.STATE.currentUser?.id);
    const hasProgress = savedTranscript?.length > 0;

    setTimeout(() => {
      // Landing page buttons
      document.getElementById('start-interview-btn')?.addEventListener('click', () => startChat());
      document.getElementById('landing-logout')?.addEventListener('click', () => APP.logout());

      // Chat page buttons (set after startChat renders)
      document.addEventListener('click', e => {
        if (e.target.id === 'chat-logout') APP.logout();
      }, { once: false });
    }, 50);

    // If they already started, show resume option
    if (hasProgress) {
      const landingHtml = renderLanding(firstName);
      return landingHtml.replace(
        'Begin Opening Interview',
        'Resume Interview'
      ).replace(
        'You can pause and return at any time.',
        '✓ Your progress has been saved. Pick up right where you left off.'
      );
    }

    return renderLanding(firstName);
  });
})();
