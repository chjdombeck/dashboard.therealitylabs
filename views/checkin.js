// ─── Daily Check-In ───────────────────────────────────────────────────────────
(function() {

  // ── Question Bank ──────────────────────────────────────────────────────────
  const QUESTION_BANK = {
    desired_reality: [
      { type: 'text', key: 'q1', question: 'Describe one specific detail you can see in your mind right now about your desired reality. Make it vivid, what do you see, feel, or hear?' },
      { type: 'text', key: 'q1', question: 'If you woke up tomorrow fully living your desired reality, what\'s the first thing you\'d notice that\'s different?' },
      { type: 'text', key: 'q1', question: 'Describe your ideal morning, in your desired reality, already done. What does the first hour look like?' },
      { type: 'text', key: 'q1', question: 'What does money feel like in your desired reality? Not how much, how does it feel in your body to have it?' },
      { type: 'text', key: 'q1', question: 'Who are you surrounded by in your desired reality? Describe one person or relationship that\'s part of that life.' },
      { type: 'text', key: 'q1', question: 'What does your workspace or environment look like in your desired reality? Be specific, what do you see when you look around?' },
      { type: 'text', key: 'q1', question: 'What\'s one thing your future self does on a Tuesday that your current self doesn\'t?' },
      { type: 'text', key: 'q1', question: 'In your desired reality, how do you feel when you wake up? What\'s the first emotion that hits before you even get out of bed?' },
    ],
    belief_system: [
      { type: 'text', key: 'q2', question: 'What is one belief that ran in the background today, something you felt or assumed without questioning it?' },
      { type: 'text', key: 'q2', question: 'What belief about yourself would need to change for your desired reality to feel inevitable?' },
      { type: 'text', key: 'q2', question: 'Name one belief you\'ve been carrying that no longer belongs to the version of you that you\'re becoming.' },
      { type: 'text', key: 'q2', question: 'What story did you tell yourself today about why something is hard, slow, or not working? Be honest.' },
      { type: 'text', key: 'q2', question: 'What do you currently believe about money that isn\'t serving you? Where did that belief come from?' },
      { type: 'text', key: 'q2', question: 'What\'s one belief your future self holds that your current self is still resisting?' },
      { type: 'text', key: 'q2', question: 'What belief supported you today, one that felt true, empowering, and aligned with who you\'re becoming?' },
      { type: 'text', key: 'q2', question: 'Finish this sentence honestly: "Deep down, I still believe I\'m not ready because..."' },
    ],
    identity: [
      { type: 'text', key: 'q3', question: 'Who were you being today, not what you did, but who you were being? Does that person match your desired identity?' },
      { type: 'text', key: 'q3', question: 'What would your future self have done differently today? Be specific, one decision, one moment.' },
      { type: 'text', key: 'q3', question: 'Describe the version of you that already has everything you want. How does that person carry themselves?' },
      { type: 'text', key: 'q3', question: 'Where today did your current identity show up instead of your desired identity? What did it look like?' },
      { type: 'text', key: 'q3', question: 'Complete this: "I am the kind of person who...", write it as your future self, not your current self.' },
      { type: 'text', key: 'q3', question: 'What part of your old identity are you still protecting? What would it cost to let it go?' },
      { type: 'text', key: 'q3', question: 'What does the identity you\'re stepping into actually require you to give up? Are you willing?' },
      { type: 'text', key: 'q3', question: 'How did you show up for yourself today? Honest answer, not what you wish you\'d done.' },
    ],
    patterns: [
      { type: 'text', key: 'q4', question: 'What pattern showed up today, a thought, behavior, or feeling you\'ve seen before? What\'s the belief underneath it?' },
      { type: 'text', key: 'q4', question: 'Where did you self-sabotage today, even in a small way? What triggered it?' },
      { type: 'text', key: 'q4', question: 'What are you avoiding right now that your future self would have already done?' },
      { type: 'text', key: 'q4', question: 'What recurring thought kept surfacing today? What is your subconscious trying to tell you?' },
      { type: 'text', key: 'q4', question: 'When did you shrink today, played small, held back, or didn\'t speak up? What was running underneath that?' },
      { type: 'text', key: 'q4', question: 'What pattern are you most aware of right now that\'s keeping your current reality in place?' },
      { type: 'text', key: 'q4', question: 'Where did fear show up today? What did it tell you not to do?' },
      { type: 'text', key: 'q4', question: 'What did you do today that your past self always does, and your future self no longer needs to do?' },
    ],
    grading: [
      { type: 'slider', key: 'identityScore', question: 'On a scale of 1–10, how aligned was your behavior today with your desired identity?', label: 'Identity Alignment' },
      { type: 'slider', key: 'clarityScore', question: 'On a scale of 1–10, how clear do you feel right now on what you\'re building and why?', label: 'Clarity' },
      { type: 'slider', key: 'commitmentScore', question: 'On a scale of 1–10, how committed do you feel to your desired reality right now, not to the work, to the vision?', label: 'Commitment' },
      { type: 'slider', key: 'presenceScore', question: 'On a scale of 1–10, how present did you feel today, actually here, not in your head?', label: 'Presence' },
      { type: 'slider', key: 'momentumScore', question: 'On a scale of 1–10, how much momentum are you feeling in the direction of your desired reality?', label: 'Momentum' },
    ],
    action: [
      { type: 'text', key: 'q5', question: 'What is one action your future self would take tomorrow that your current self is tempted to avoid?' },
      { type: 'text', key: 'q5', question: 'What would closing the gap between who you are today and who you\'re becoming actually require you to do this week?' },
      { type: 'text', key: 'q5', question: 'What did you do today that moved your desired reality closer? If nothing, what got in the way?' },
    ],
  };

  // ── Build daily question set ───────────────────────────────────────────────
  function getDailyQuestions() {
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);

    const pick = (arr, seed) => arr[(dayOfYear + seed) % arr.length];

    return [
      // 1. Always: alignment slider
      { type: 'slider', key: 'alignmentScore', question: 'On a scale of 1–10, how aligned do you feel with your desired reality right now?', label: 'Alignment' },
      // 2. Rotating: desired reality
      pick(QUESTION_BANK.desired_reality, 0),
      // 3. Rotating: belief or pattern (alternating days)
      dayOfYear % 2 === 0
        ? pick(QUESTION_BANK.belief_system, 1)
        : pick(QUESTION_BANK.patterns, 2),
      // 4. Rotating: identity
      pick(QUESTION_BANK.identity, 3),
      // 5. Rotating: grading slider
      pick(QUESTION_BANK.grading, 4),
      // 6. Rotating: action or future self
      pick(QUESTION_BANK.action, 5),
      // 7. Always: triple state sliders
      { type: 'sliders', keys: ['energyScore','focusScore','emotionalScore'], labels: ['Energy','Focus','Emotional State'], question: 'Rate your current state.' },
    ];
  }

  let QUESTIONS = [];
  let currentStep = 0;
  let answers = {};

  function renderStep() {
    const q = QUESTIONS[currentStep];
    const progress = (currentStep / QUESTIONS.length) * 100;
    let inputHtml = '';

    if (q.type === 'slider') {
      const val = answers[q.key] || 5;
      inputHtml = `
<div style="padding:20px 0;">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
    <span style="color:var(--text-muted);font-size:0.8125rem;">1</span>
    <div style="text-align:center;">
      <div style="font-size:3.5rem;font-weight:700;color:var(--gold);line-height:1;" id="slider-display">${val}</div>
      <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">${q.label || ''}</div>
    </div>
    <span style="color:var(--text-muted);font-size:0.8125rem;">10</span>
  </div>
  <input type="range" min="1" max="10" value="${val}" id="checkin-slider" style="width:100%;" />
  <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:0.75rem;color:var(--text-muted);">
    <span>Not at all</span><span>Completely</span>
  </div>
</div>`;
    } else if (q.type === 'text') {
      inputHtml = `<div style="position:relative;margin-top:20px;">
        <textarea class="input" id="checkin-text" placeholder="Be specific and honest. Vague answers stay on the surface." rows="5" style="width:100%;line-height:1.7;padding-right:52px;">${answers[q.key] || ''}</textarea>
        <div style="position:absolute;bottom:10px;right:10px;">${APP.micButtonHTML('checkin-mic')}</div>
      </div>`;
    } else if (q.type === 'sliders') {
      inputHtml = `<div style="display:flex;flex-direction:column;gap:24px;margin-top:20px;">
        ${q.keys.map((key, i) => `
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
              <span style="font-size:0.875rem;font-weight:500;color:var(--text-dim);">${q.labels[i]}</span>
              <span style="font-size:1.125rem;font-weight:700;color:var(--gold);" id="slider-${key}">${answers[key] || 5}</span>
            </div>
            <input type="range" min="1" max="10" value="${answers[key] || 5}" data-key="${key}" class="multi-slider" style="width:100%;" />
          </div>`).join('')}
      </div>`;
    }

    const stepLabel = `${currentStep + 1} of ${QUESTIONS.length}`;

    return `
<div style="min-height:100vh;background:#000;display:flex;flex-direction:column;">
  <div style="padding:20px 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.06);">
    <button data-nav="dashboard" class="btn-ghost" style="padding:8px 14px;font-size:0.8125rem;">← Back</button>
    <div style="font-size:0.8125rem;color:var(--text-muted);">Daily Check-In · ${stepLabel}</div>
    <div style="width:80px;"></div>
  </div>
  <div class="progress-bar" style="height:2px;border-radius:0;"><div class="progress-fill" style="width:${progress}%;"></div></div>
  <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:40px 24px;">
    <div style="max-width:600px;width:100%;" class="fade-in">
      <div style="font-size:0.8125rem;font-weight:600;color:var(--gold);letter-spacing:0.06em;text-transform:uppercase;margin-bottom:16px;">${stepLabel}</div>
      <div style="font-size:1.375rem;font-weight:600;color:#fff;line-height:1.4;margin-bottom:4px;">${q.question}</div>
      ${inputHtml}
      <div style="display:flex;justify-content:flex-end;margin-top:28px;gap:12px;">
        ${currentStep > 0 ? `<button class="btn-ghost" id="checkin-back">Back</button>` : ''}
        <button class="btn-gold" id="checkin-next">${currentStep < QUESTIONS.length - 1 ? 'Continue →' : 'Submit Check-In'}</button>
      </div>
    </div>
  </div>
</div>`;
  }

  APP.register('checkin', async () => {
    const today = APP.todayStr();
    const checkIns = await DB.getCheckIns(APP.STATE.currentUser.id);
    const existing = checkIns.find(c => c.date === today);

    if (existing) {
      return `
<div style="min-height:100vh;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;padding:24px;">
  <div style="text-align:center;">
    <div style="width:64px;height:64px;border-radius:50%;background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.3);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
    </div>
    <div style="font-size:1.5rem;font-weight:700;color:#fff;margin-bottom:8px;">Check-in complete for today.</div>
    <div style="font-size:0.9375rem;color:var(--text-muted);margin-bottom:8px;">Alignment: <span style="color:var(--gold);font-weight:600;">${existing.alignment_score}/10</span></div>
    ${existing.ai_reflection ? `<div style="max-width:520px;margin:20px auto 0;padding:24px;background:var(--s1);border:1px solid rgba(227,151,3,0.2);border-radius:8px;font-size:0.9375rem;color:var(--text-dim);line-height:1.7;font-style:italic;">"${existing.ai_reflection}"</div>` : ''}
  </div>
  <button class="btn-ghost" data-nav="dashboard">← Back to Dashboard</button>
</div>`;
    }

    QUESTIONS = getDailyQuestions();
    currentStep = 0;
    answers = {};
    setTimeout(() => bindCheckinEvents(), 100);
    return renderStep();
  });

  function bindCheckinEvents() {
    const next = document.getElementById('checkin-next');
    const back = document.getElementById('checkin-back');
    const slider = document.getElementById('checkin-slider');
    const display = document.getElementById('slider-display');

    if (slider && display) {
      slider.addEventListener('input', () => {
        display.textContent = slider.value;
        answers[QUESTIONS[currentStep].key] = parseInt(slider.value);
      });
      answers[QUESTIONS[currentStep].key] = parseInt(slider.value);
    }

    // Voice for text steps
    const checkinTextarea = document.getElementById('checkin-text');
    const checkinMic = document.getElementById('checkin-mic');
    if (checkinTextarea && checkinMic) APP.attachVoice(checkinTextarea, checkinMic);

    document.querySelectorAll('.multi-slider').forEach(s => {
      s.addEventListener('input', () => {
        answers[s.dataset.key] = parseInt(s.value);
        const d = document.getElementById(`slider-${s.dataset.key}`);
        if (d) d.textContent = s.value;
      });
      answers[s.dataset.key] = parseInt(s.value);
    });

    back?.addEventListener('click', () => {
      currentStep--;
      document.getElementById('app').innerHTML = renderStep();
      setTimeout(() => bindCheckinEvents(), 50);
    });

    document.querySelectorAll('[data-nav]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); APP.navigate(el.dataset.nav); }));

    next?.addEventListener('click', () => {
      const q = QUESTIONS[currentStep];
      if (q.type === 'text') {
        const t = document.getElementById('checkin-text');
        if (!t?.value.trim()) return;
        answers[q.key] = t.value.trim();
      } else if (q.type === 'sliders') {
        q.keys.forEach(k => { if (!answers[k]) answers[k] = 5; });
      }
      if (currentStep < QUESTIONS.length - 1) {
        currentStep++;
        document.getElementById('app').innerHTML = renderStep();
        setTimeout(() => bindCheckinEvents(), 50);
      } else {
        submitCheckIn();
      }
    });
  }

  async function submitCheckIn() {
    const user = APP.STATE.currentUser;
    document.getElementById('app').innerHTML = `
<div style="min-height:100vh;background:#000;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:20px;">
  <div style="display:flex;gap:8px;"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>
  <div style="font-size:0.9375rem;color:var(--text-muted);">Processing your check-in...</div>
</div>`;

    // Consolidate all text answers into standard fields
    const textAnswers = {};
    QUESTIONS.forEach(q => {
      if (q.type === 'text' && answers[q.key]) {
        if (!textAnswers.q1) textAnswers.q1 = answers[q.key];
        else if (!textAnswers.q2) textAnswers.q2 = answers[q.key];
        else if (!textAnswers.q3) textAnswers.q3 = answers[q.key];
        else textAnswers.q4 = answers[q.key];
      }
    });

    const entry = await DB.saveCheckIn({
      userId: user.id,
      date: APP.todayStr(),
      alignmentScore: answers.alignmentScore || 5,
      gratitude: textAnswers.q1 || '',
      supportingBelief: textAnswers.q2 || '',
      limitingBelief: textAnswers.q3 || '',
      todayAction: textAnswers.q4 || '',
      energyScore: answers.energyScore || 5,
      focusScore: answers.focusScore || 5,
      emotionalScore: answers.emotionalScore || 5,
    });

    // Generate streak milestone activity
    try {
      const allCheckIns = await DB.getCheckIns(user.id);
      const streak = APP.getStreak(allCheckIns);
      const milestones = [3, 7, 14, 21, 30, 60, 90];
      if (milestones.includes(streak)) {
        await DB.createActivity(
          user.id,
          'checkin_streak',
          `${streak}-Day Check-In Streak`,
          { streak, date: APP.todayStr() }
        );
      }
    } catch(e) {}

    // Generate AI reflection using today's actual questions and answers
    const questionAnswerPairs = QUESTIONS
      .filter(q => q.type === 'text' && answers[q.key])
      .map(q => `Q: ${q.question}\nA: ${answers[q.key]}`)
      .join('\n\n');

    const [profile, transcript] = await Promise.all([DB.getClientProfile(user.id), DB.getTranscript(user.id)]);
    const reflection = await generateReflection(questionAnswerPairs, answers.alignmentScore || 5, profile, transcript);
    await DB.updateCheckInReflection(user.id, APP.todayStr(), reflection);

    document.getElementById('app').innerHTML = `
<div style="min-height:100vh;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px;gap:32px;position:relative;">
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;height:500px;background:radial-gradient(circle,rgba(227,151,3,0.05) 0%,transparent 70%);pointer-events:none;"></div>
  <div class="fade-in" style="text-align:center;max-width:580px;width:100%;">
    <div style="width:56px;height:56px;border-radius:50%;background:var(--gold-dim);border:1px solid var(--gold-line);display:flex;align-items:center;justify-content:center;margin:0 auto 24px;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
    </div>
    <div style="font-size:1.5rem;font-weight:700;color:#fff;margin-bottom:8px;">Check-In Complete.</div>
    <div style="font-size:0.875rem;color:var(--text-muted);margin-bottom:28px;">Alignment: <span style="color:var(--gold);font-weight:600;">${answers.alignmentScore || 5}/10</span></div>
    <div class="card" style="padding:24px;text-align:left;margin-bottom:24px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
        <div style="width:28px;height:28px;border-radius:50%;overflow:hidden;border:1px solid var(--gold-line);flex-shrink:0;">
          <img src="NoaAIandLogo.png" style="width:100%;height:100%;object-fit:cover;object-position:center 10%;" />
        </div>
        <div style="font-size:0.8125rem;font-weight:600;color:var(--gold);">NoaAI</div>
      </div>
      <div style="font-size:0.9375rem;color:var(--text-dim);line-height:1.75;font-style:italic;">"${reflection}"</div>
    </div>
    <button class="btn-gold" data-nav="dashboard">Back to Dashboard</button>
  </div>
</div>`;
    document.querySelectorAll('[data-nav]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); APP.navigate(el.dataset.nav); }));
  }

  async function generateReflection(questionAnswerPairs, alignmentScore, profile, transcript) {
    const apiKey = APP.getApiKey();
    if (!apiKey) {
      const reflections = [
        `The pattern you identified today is the program. It's not a character flaw, it's an installed belief running on autopilot. The fact that you can name it means you're no longer fully inside it.`,
        `Notice the gap between the identity you described and the one that showed up today. That gap is not failure. That gap is the work.`,
        `What you wrote about your desired reality is already real in your subconscious. The more vividly you return to it, the more the external world reorganizes to match it.`,
        `The belief you named is the ceiling. Your results will never outgrow it until the identity beneath it changes. You're in the right place.`,
      ];
      return reflections[new Date().getDate() % reflections.length];
    }
    try {
      const transcriptContext = transcript?.length
        ? `\n\nINTERVIEW MEMORY (what they shared in their onboarding):\n${transcript.filter(m=>m.role==='user').map(m=>m.content).join('\n').slice(0,2000)}`
        : '';
      const system = `You are NoaAI, the AI assistant for The Reality Labs Coaching platform. A client just completed their daily check-in.

Their profile: ${JSON.stringify(profile)}
Their alignment score today: ${alignmentScore}/10${transcriptContext}

Write a 2–3 sentence reflection in Carter Dombeck's voice: direct, warm, grounded, identity-first.
Reference something specific from what they actually wrote today, not generic encouragement.
Connect what they shared back to their specific desired reality or blocks from their interview if relevant.
Never say "great job", "amazing", or any generic praise.
End with something that points them forward or a slightly uncomfortable truth.
Never use em dashes (—) anywhere in your response. Use periods or commas instead.`;

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
        body: JSON.stringify({ model: 'claude-sonnet-4-5', max_tokens: 220, system, messages: [{ role: 'user', content: questionAnswerPairs }] }),
      });
      const data = await res.json();
      return data.content?.[0]?.text || 'Your check-in is recorded.';
    } catch { return 'Your check-in is recorded. The pattern you named is the work.'; }
  }
})();
