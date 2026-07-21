// ─── My Vision ────────────────────────────────────────────────────────────────
(function() {
  APP.register('vision', async () => {
    APP.showLoading();
    const user = APP.STATE.currentUser;
    let board = await DB.getVisionBoard(user.id);
    if (!board) {
      board = { user_id: user.id, vision_statement:'', core_desires:[], identity_statements:['I am the kind of person who creates results.','I am becoming who I need to be.'], values:[], why:'', board_images:[] };
    }

    const visionInterviewDone = !!(board.vision_interview_done);
    const firstName = user.first_name || user.name?.split(' ')[0] || 'there';

    const content = `
<div style="max-width:900px;margin:0 auto;padding:32px 24px;">
  <div class="fade-in" style="margin-bottom:36px;">
    <div class="label" style="margin-bottom:8px;">North Star</div>
    <div style="font-size:1.875rem;font-weight:700;letter-spacing:-0.02em;">My Vision</div>
    <div style="font-size:0.9375rem;color:var(--text-muted);margin-top:6px;">Everything you're working toward. In one place.</div>
  </div>

  <!-- ── Vision Interview ─────────────────────────────────────────────────── -->
  <div class="card fade-in" id="vision-interview-section" style="padding:28px;margin-bottom:28px;background:linear-gradient(135deg,var(--s1) 0%,rgba(227,151,3,0.06) 100%);border:1px solid rgba(227,151,3,0.2);">

    <!-- Header -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:36px;height:36px;border-radius:50%;overflow:hidden;border:1px solid var(--gold-line);flex-shrink:0;">
          <img src="NoaAIandLogo.png" style="width:100%;height:100%;object-fit:cover;object-position:center 10%;" />
        </div>
        <div>
          <div style="font-size:0.9375rem;font-weight:600;color:#fff;">NoaAI</div>
          <div style="font-size:0.75rem;color:var(--gold);">Vision Interview</div>
        </div>
      </div>
      ${visionInterviewDone ? `<button id="redo-vision-interview" class="btn-ghost" style="font-size:0.75rem;padding:6px 12px;">Redo Interview</button>` : ''}
    </div>

    <!-- Intro explanation -->
    <div style="background:rgba(227,151,3,0.06);border:1px solid rgba(227,151,3,0.15);border-radius:8px;padding:14px 16px;margin-bottom:18px;">
      <div style="font-size:0.875rem;color:var(--text-dim);line-height:1.65;">
        <strong style="color:#fff;">How this works:</strong> Use this conversation to talk with NoaAI about your desired reality. She'll ask you 4–5 focused questions to get specific and detailed on your vision. When the interview is complete, NoaAI will generate suggestions for each section of your Vision Board below — and you choose what to add.
      </div>
    </div>

    <div style="height:1px;background:rgba(255,255,255,0.06);margin-bottom:18px;"></div>

    <!-- Chat messages -->
    <div id="vision-chat-messages" style="display:flex;flex-direction:column;gap:16px;margin-bottom:20px;max-height:520px;overflow-y:auto;padding-right:4px;">
      ${visionInterviewDone
        ? `<div style="text-align:center;padding:16px 0;"><div style="font-size:0.875rem;color:var(--text-muted);">Interview complete. Use the sections below — or redo the interview to start fresh.</div></div>`
        : `<div id="vision-chat-loading" style="display:flex;align-items:center;gap:10px;padding:4px 0;">
             <div style="width:28px;height:28px;border-radius:50%;overflow:hidden;border:1px solid var(--gold-line);flex-shrink:0;"><img src="NoaAIandLogo.png" style="width:100%;height:100%;object-fit:cover;object-position:center 10%;" /></div>
             <div style="font-size:0.875rem;color:var(--text-muted);font-style:italic;">NoaAI is getting ready…</div>
           </div>`}
    </div>

    <!-- Input area -->
    <div id="vision-input-area" style="${visionInterviewDone ? 'display:none;' : ''}">
      <div style="display:flex;gap:10px;align-items:flex-end;">
        <textarea id="vision-chat-input" class="input" rows="3" placeholder="Share your answer here… (Enter to send, Shift+Enter for new line)" style="flex:1;resize:none;font-size:0.9375rem;line-height:1.6;"></textarea>
        ${APP.micButtonHTML('vision-chat-mic')}
        <button id="vision-chat-send" class="btn-gold" style="padding:10px 20px;height:fit-content;align-self:flex-end;">Send</button>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:8px;">
        <div id="vision-noa-typing" style="display:none;font-size:0.75rem;color:var(--text-muted);font-style:italic;">NoaAI is thinking…</div>
      </div>
    </div>

  </div>

  <!-- ── Vision Statement ──────────────────────────────────────────────────── -->
  <div class="card" style="padding:28px;margin-bottom:20px;background:linear-gradient(135deg,var(--s1) 0%,rgba(227,151,3,0.04) 100%);">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
      <div class="label">Vision Statement</div>
      <button class="btn-ghost" id="edit-vision-btn" style="font-size:0.75rem;padding:6px 12px;">Edit</button>
    </div>
    <div id="vision-display">${board.vision_statement ? `<div style="font-size:1.0625rem;color:var(--text-dim);line-height:1.8;font-style:italic;">"${board.vision_statement}"</div>` : `<div style="font-size:0.9375rem;color:var(--text-muted);">Your vision statement will appear here after the interview.</div>`}</div>
    <div id="vision-suggestion" style="display:none;"></div>
    <div id="vision-edit" style="display:none;margin-top:12px;">
      <textarea class="input" id="vision-text" rows="5">${board.vision_statement||''}</textarea>
      <button class="btn-gold" id="save-vision" style="margin-top:12px;font-size:0.875rem;">Save</button>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">
    <div class="card" style="padding:24px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <div class="label">Core Desires</div>
        <button class="btn-ghost" id="edit-desires-btn" style="font-size:0.75rem;padding:6px 12px;">Edit</button>
      </div>
      <div id="desires-display">${(board.core_desires||[]).length>0 ? `<ul style="list-style:none;display:flex;flex-direction:column;gap:8px;">${board.core_desires.map(d=>`<li style="display:flex;gap:8px;"><span style="color:var(--gold);margin-top:3px;">—</span><span style="font-size:0.9375rem;color:var(--text-dim);">${d}</span></li>`).join('')}</ul>` : `<div style="font-size:0.875rem;color:var(--text-muted);">Appears after the interview.</div>`}</div>
      <div id="desires-suggestion" style="display:none;"></div>
      <div id="desires-edit" style="display:none;margin-top:8px;"><textarea class="input" id="desires-text" rows="6" placeholder="One desire per line...">${(board.core_desires||[]).join('\n')}</textarea><button class="btn-gold" id="save-desires" style="margin-top:10px;font-size:0.8125rem;">Save</button></div>
    </div>
    <div class="card" style="padding:24px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <div class="label">Core Values</div>
        <button class="btn-ghost" id="edit-values-btn" style="font-size:0.75rem;padding:6px 12px;">Edit</button>
      </div>
      <div id="values-display">${(board.values||[]).length>0 ? `<div style="display:flex;flex-wrap:wrap;gap:8px;">${board.values.map(v=>`<span style="padding:6px 14px;background:var(--gold-dim);border:1px solid var(--gold-line);border-radius:4px;font-size:0.875rem;color:var(--gold);font-weight:500;">${v}</span>`).join('')}</div>` : `<div style="font-size:0.875rem;color:var(--text-muted);">Appears after the interview.</div>`}</div>
      <div id="values-suggestion" style="display:none;"></div>
      <div id="values-edit" style="display:none;margin-top:8px;"><textarea class="input" id="values-text" rows="6" placeholder="One value per line...">${(board.values||[]).join('\n')}</textarea><button class="btn-gold" id="save-values" style="margin-top:10px;font-size:0.8125rem;">Save</button></div>
    </div>
  </div>

  <div class="card" style="padding:24px;margin-bottom:20px;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
      <div class="label">Identity Statements</div>
      <button class="btn-ghost" id="edit-identity-btn" style="font-size:0.75rem;padding:6px 12px;">Edit</button>
    </div>
    <div id="identity-display">${(board.identity_statements||[]).length>0 ? `<div style="display:flex;flex-direction:column;gap:10px;">${board.identity_statements.map(s=>`<div style="padding:12px 16px;background:rgba(227,151,3,0.04);border-left:2px solid var(--gold-line);font-size:0.9375rem;color:var(--text-dim);">${s}</div>`).join('')}</div>` : `<div style="font-size:0.875rem;color:var(--text-muted);">Appears after the interview.</div>`}</div>
    <div id="identity-suggestion" style="display:none;"></div>
    <div id="identity-edit" style="display:none;margin-top:8px;"><textarea class="input" id="identity-text" rows="8" placeholder="One per line...">${(board.identity_statements||[]).join('\n')}</textarea><button class="btn-gold" id="save-identity" style="margin-top:10px;font-size:0.8125rem;">Save</button></div>
  </div>

  <div class="card" style="padding:24px;margin-bottom:20px;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
      <div class="label">The Deep Why</div>
      <button class="btn-ghost" id="edit-why-btn" style="font-size:0.75rem;padding:6px 12px;">Edit</button>
    </div>
    <div id="why-display">${board.why ? `<div style="font-size:1rem;color:var(--text-dim);line-height:1.7;font-style:italic;">"${board.why}"</div>` : `<div style="font-size:0.875rem;color:var(--text-muted);">Appears after the interview.</div>`}</div>
    <div id="why-suggestion" style="display:none;"></div>
    <div id="why-edit" style="display:none;margin-top:8px;"><textarea class="input" id="why-text" rows="3">${board.why||''}</textarea><button class="btn-gold" id="save-why" style="margin-top:10px;font-size:0.8125rem;">Save</button></div>
  </div>

  <div class="card" style="padding:24px;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
      <div class="label">Vision Board</div>
      <label class="btn-ghost" style="font-size:0.75rem;padding:6px 12px;cursor:pointer;">Add Image<input type="file" id="vision-image-upload" accept="image/*" style="display:none;" multiple /></label>
    </div>
    <div id="vision-board-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;">
      ${(board.board_images||[]).length===0 ? `<div style="grid-column:1/-1;padding:32px;text-align:center;border:1px dashed rgba(255,255,255,0.1);border-radius:8px;color:var(--text-muted);font-size:0.875rem;">Upload images of your desired reality.</div>` : board.board_images.map((img,i)=>`<div style="position:relative;aspect-ratio:1;"><img src="${img.url}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;border:1px solid rgba(227,151,3,0.15);" /><button data-remove-img="${i}" style="position:absolute;top:6px;right:6px;width:24px;height:24px;border-radius:50%;background:rgba(0,0,0,0.7);border:none;color:#fff;cursor:pointer;font-size:14px;">×</button></div>`).join('')}
    </div>
  </div>
</div>`;

    setTimeout(async () => {
      // ── Field edit/save wiring ──────────────────────────────────────────────
      const toggle = (editId) => { const el = document.getElementById(editId); if(el) el.style.display = el.style.display==='none'?'block':'none'; };
      document.getElementById('edit-vision-btn')?.addEventListener('click', () => toggle('vision-edit'));
      document.getElementById('edit-desires-btn')?.addEventListener('click', () => toggle('desires-edit'));
      document.getElementById('edit-values-btn')?.addEventListener('click', () => toggle('values-edit'));
      document.getElementById('edit-identity-btn')?.addEventListener('click', () => toggle('identity-edit'));
      document.getElementById('edit-why-btn')?.addEventListener('click', () => toggle('why-edit'));

      const saveBoard = async (updates) => {
        board = { ...board, ...updates };
        await DB.saveVisionBoard(user.id, {
          visionStatement: board.vision_statement || '',
          coreDesires: board.core_desires || [],
          identityStatements: board.identity_statements || [],
          values: board.values || [],
          why: board.why || '',
          boardImages: board.board_images || [],
          vision_interview_done: board.vision_interview_done || false,
        });
      };

      document.getElementById('save-vision')?.addEventListener('click', async () => {
        const val = document.getElementById('vision-text')?.value || '';
        board.vision_statement = val;
        await saveBoard({});
        document.getElementById('vision-display').innerHTML = val ? `<div style="font-size:1.0625rem;color:var(--text-dim);line-height:1.8;font-style:italic;">"${val}"</div>` : `<div style="font-size:0.9375rem;color:var(--text-muted);">Your vision statement will appear here after the interview.</div>`;
        toggle('vision-edit');
      });
      document.getElementById('save-desires')?.addEventListener('click', async () => {
        const items = (document.getElementById('desires-text')?.value||'').split('\n').map(l=>l.trim()).filter(Boolean);
        board.core_desires = items;
        await saveBoard({});
        document.getElementById('desires-display').innerHTML = items.length>0 ? `<ul style="list-style:none;display:flex;flex-direction:column;gap:8px;">${items.map(d=>`<li style="display:flex;gap:8px;"><span style="color:var(--gold);margin-top:3px;">—</span><span style="font-size:0.9375rem;color:var(--text-dim);">${d}</span></li>`).join('')}</ul>` : `<div style="font-size:0.875rem;color:var(--text-muted);">Appears after the interview.</div>`;
        toggle('desires-edit');
      });
      document.getElementById('save-values')?.addEventListener('click', async () => {
        const items = (document.getElementById('values-text')?.value||'').split('\n').map(l=>l.trim()).filter(Boolean);
        board.values = items;
        await saveBoard({});
        document.getElementById('values-display').innerHTML = items.length>0 ? `<div style="display:flex;flex-wrap:wrap;gap:8px;">${items.map(v=>`<span style="padding:6px 14px;background:var(--gold-dim);border:1px solid var(--gold-line);border-radius:4px;font-size:0.875rem;color:var(--gold);font-weight:500;">${v}</span>`).join('')}</div>` : `<div style="font-size:0.875rem;color:var(--text-muted);">Appears after the interview.</div>`;
        toggle('values-edit');
      });
      document.getElementById('save-identity')?.addEventListener('click', async () => {
        const items = (document.getElementById('identity-text')?.value||'').split('\n').map(l=>l.trim()).filter(Boolean);
        board.identity_statements = items;
        await saveBoard({});
        document.getElementById('identity-display').innerHTML = items.length>0 ? `<div style="display:flex;flex-direction:column;gap:10px;">${items.map(s=>`<div style="padding:12px 16px;background:rgba(227,151,3,0.04);border-left:2px solid var(--gold-line);font-size:0.9375rem;color:var(--text-dim);">${s}</div>`).join('')}</div>` : `<div style="font-size:0.875rem;color:var(--text-muted);">Appears after the interview.</div>`;
        toggle('identity-edit');
      });
      document.getElementById('save-why')?.addEventListener('click', async () => {
        const val = document.getElementById('why-text')?.value || '';
        board.why = val;
        await saveBoard({});
        document.getElementById('why-display').innerHTML = val ? `<div style="font-size:1rem;color:var(--text-dim);line-height:1.7;font-style:italic;">"${val}"</div>` : `<div style="font-size:0.875rem;color:var(--text-muted);">Appears after the interview.</div>`;
        toggle('why-edit');
      });

      document.getElementById('vision-image-upload')?.addEventListener('change', e => {
        Array.from(e.target.files).forEach(file => {
          const reader = new FileReader();
          reader.onload = ev => { board.board_images = [...(board.board_images||[]), { url: ev.target.result, caption:'' }]; saveBoard({}); };
          reader.readAsDataURL(file);
        });
      });
      document.querySelectorAll('[data-remove-img]').forEach(btn => {
        btn.addEventListener('click', e => { e.stopPropagation(); const idx = parseInt(btn.dataset.removeImg); const imgs = [...(board.board_images||[])]; imgs.splice(idx,1); board.board_images = imgs; saveBoard({}); });
      });

      document.getElementById('redo-vision-interview')?.addEventListener('click', async () => {
        board.vision_interview_done = false;
        await saveBoard({});
        APP.navigate('vision');
      });

      // ── Start interview if not done ───────────────────────────────────────────
      if (!visionInterviewDone) {
        await runVisionInterview(user, board, saveBoard, firstName);
      }

    }, 100);

    return window.dashboardShell('vision', content);
  });

  // ── Vision Interview Engine ──────────────────────────────────────────────────
  async function runVisionInterview(user, board, saveBoard, firstName) {
    const apiKey = APP.getApiKey();
    if (!apiKey) {
      const loadingEl = document.getElementById('vision-chat-loading');
      if (loadingEl) loadingEl.outerHTML = `<div style="font-size:0.875rem;color:var(--text-muted);">API key not set. Configure your key in settings to use the vision interview.</div>`;
      return;
    }

    let onboardingContext = '';
    try {
      const transcript = await DB.getTranscript(user.id);
      if (transcript && transcript.length > 0) {
        onboardingContext = transcript.filter(m => m.role === 'user').map(m => m.content).join('\n\n');
      }
    } catch(e) {}

    const SYSTEM_PROMPT = `You are NoaAI, Carter Dombeck's AI assistant at The Reality Labs Coaching.

Your job right now is a focused Vision Interview. Ask this client 4–5 targeted questions — one at a time — to build a vivid, detailed picture of their desired reality. Their answers will be used to populate their Vision Board.

${onboardingContext ? `CONTEXT FROM THEIR ONBOARDING INTERVIEW (use this — don't repeat what's already been covered, go deeper):\n\n${onboardingContext.slice(0, 3000)}\n\n` : ''}YOUR QUESTIONS (one at a time, in this order):

1. DESIRED REALITY — Ask them to describe their desired reality as if they're already living it. Day-to-day life, business, income, relationships, sense of self. The more vivid and specific the better.

2. IDENTITY — In that reality, who have they become? How are they different from who they are today? How do they carry themselves, make decisions, think about problems?

3. CORE DESIRES & OUTCOMES — What specific, concrete outcomes tell them they've arrived? Revenue figures, lifestyle specifics, daily experience. Real markers, not vague goals.

4. VALUES — What principles and qualities define who they're becoming? What do they stand for?

5. THE DEEP WHY — What is this really about at a soul level? What would it mean for their life, their family, their legacy if they actually built this?

RULES:
— One question at a time. Never stack questions.
— If an answer is vague, go one level deeper before moving on.
— Mirror their exact language back to them.
— After all 5 areas are covered, close warmly using their name. Tell them their Vision Board suggestions are ready. End your final message with exactly: [VISION_INTERVIEW_COMPLETE]

TONE: Warm, direct, professionally intimate. Not a form — a real conversation.
Output: respond only with your next message. No labels or meta-commentary.`;

    let conversationHistory = [];
    let interviewComplete = false;

    function appendMessage(role, text) {
      const messagesEl = document.getElementById('vision-chat-messages');
      if (!messagesEl) return;
      document.getElementById('vision-chat-loading')?.remove();

      const bubble = document.createElement('div');
      bubble.style.cssText = 'display:flex;gap:12px;align-items:flex-start;';
      if (role === 'assistant') {
        bubble.innerHTML = `
          <div style="flex-shrink:0;width:28px;height:28px;border-radius:50%;overflow:hidden;border:1px solid var(--gold-line);margin-top:2px;">
            <img src="NoaAIandLogo.png" style="width:100%;height:100%;object-fit:cover;object-position:center 10%;" />
          </div>
          <div style="flex:1;font-size:0.9375rem;color:var(--text-dim);line-height:1.7;padding-top:4px;">${text.replace(/\n\n/g,'<br/><br/>').replace(/\n/g,'<br/>')}</div>`;
      } else {
        bubble.innerHTML = `
          <div style="flex:1;"></div>
          <div style="max-width:78%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:10px 10px 2px 10px;padding:12px 16px;font-size:0.9375rem;color:var(--text-dim);line-height:1.65;">${text.replace(/\n/g,'<br/>')}</div>`;
      }
      messagesEl.appendChild(bubble);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    async function sendToNoa(userMessage) {
      if (userMessage) {
        conversationHistory.push({ role: 'user', content: userMessage });
        appendMessage('user', userMessage);
      }

      const typingEl = document.getElementById('vision-noa-typing');
      const sendBtn = document.getElementById('vision-chat-send');
      const inputEl = document.getElementById('vision-chat-input');
      if (typingEl) typingEl.style.display = 'block';
      if (sendBtn) sendBtn.disabled = true;
      if (inputEl) inputEl.disabled = true;

      try {
        // Build messages array — always needs at least one message
        const messages = conversationHistory.length > 0
          ? conversationHistory
          : [{ role: 'user', content: `Please begin the vision interview with ${firstName}.` }];

        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({ model: 'claude-sonnet-4-5', max_tokens: 600, system: SYSTEM_PROMPT, messages }),
        });

        const data = await res.json();
        const reply = data.content?.[0]?.text || '';
        const isComplete = reply.includes('[VISION_INTERVIEW_COMPLETE]');
        const cleanReply = reply.replace('[VISION_INTERVIEW_COMPLETE]', '').trim();

        conversationHistory.push({ role: 'assistant', content: reply });
        appendMessage('assistant', cleanReply);

        if (isComplete) {
          interviewComplete = true;
          if (typingEl) typingEl.style.display = 'none';
          document.getElementById('vision-input-area').style.display = 'none';
          await buildSuggestions(conversationHistory, onboardingContext, user, board, saveBoard, apiKey, firstName);
        }
      } catch(e) {
        appendMessage('assistant', 'Something went wrong. Please refresh and try again.');
      } finally {
        if (typingEl) typingEl.style.display = 'none';
        if (!interviewComplete) {
          if (sendBtn) sendBtn.disabled = false;
          if (inputEl) { inputEl.disabled = false; inputEl.focus(); }
        }
      }
    }

    document.getElementById('vision-chat-send')?.addEventListener('click', () => {
      const inputEl = document.getElementById('vision-chat-input');
      const text = inputEl?.value?.trim();
      if (!text || interviewComplete) return;
      inputEl.value = '';
      sendToNoa(text);
    });
    document.getElementById('vision-chat-input')?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const inputEl = document.getElementById('vision-chat-input');
        const text = inputEl?.value?.trim();
        if (!text || interviewComplete) return;
        inputEl.value = '';
        sendToNoa(text);
      }
    });

    // Voice
    APP.attachVoice(
      document.getElementById('vision-chat-input'),
      document.getElementById('vision-chat-mic')
    );

    // NoaAI asks first
    await sendToNoa(null);
  }

  // ── Build & show suggestions with "Add" buttons ──────────────────────────────
  async function buildSuggestions(visionHistory, onboardingContext, user, board, saveBoard, apiKey, firstName) {
    const messagesEl = document.getElementById('vision-chat-messages');
    const loadingBubble = document.createElement('div');
    loadingBubble.style.cssText = 'display:flex;gap:12px;align-items:flex-start;';
    loadingBubble.innerHTML = `
      <div style="flex-shrink:0;width:28px;height:28px;border-radius:50%;overflow:hidden;border:1px solid var(--gold-line);margin-top:2px;">
        <img src="NoaAIandLogo.png" style="width:100%;height:100%;object-fit:cover;object-position:center 10%;" />
      </div>
      <div style="flex:1;font-size:0.875rem;color:var(--text-muted);font-style:italic;padding-top:6px;">Building your Vision Board suggestions…</div>`;
    messagesEl?.appendChild(loadingBubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    const visionConversation = visionHistory
      .filter(m => !m.content.includes('Please begin the vision interview'))
      .map(m => `${m.role === 'user' ? firstName : 'NoaAI'}: ${m.content.replace('[VISION_INTERVIEW_COMPLETE]','').trim()}`)
      .join('\n\n');

    const extractPrompt = `Extract structured vision board data from this coaching interview. Return ONLY a valid JSON object with these exact fields — no markdown, no code fences, no explanation:

{
  "vision_statement": "A powerful present-tense statement (2-4 sentences, first person, vivid and specific, uses their exact language)",
  "core_desires": ["4-6 specific concrete desires or outcomes they described"],
  "identity_statements": ["4-6 statements starting with 'I am' or 'I am the kind of person who', based on who they described becoming"],
  "values": ["4-8 single words or short phrases for their core values"],
  "why": "1-3 sentences capturing the deep emotional why — in their own language"
}

Use their exact words where possible. Be specific, not generic.

${onboardingContext ? `ONBOARDING CONTEXT:\n${onboardingContext.slice(0, 2000)}\n\n` : ''}VISION INTERVIEW:\n${visionConversation}`;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({ model: 'claude-sonnet-4-5', max_tokens: 1000, messages: [{ role: 'user', content: extractPrompt }] }),
      });

      const data = await res.json();
      const raw = data.content?.[0]?.text || '{}';
      let parsed = {};
      try { parsed = JSON.parse(raw.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim()); } catch(e) {}

      loadingBubble.remove();

      // Auto-save all parsed sections immediately — no button clicks required
      if (parsed.vision_statement) board.vision_statement = parsed.vision_statement;
      if (parsed.core_desires?.length) board.core_desires = parsed.core_desires;
      if (parsed.values?.length) board.values = parsed.values;
      if (parsed.identity_statements?.length) board.identity_statements = parsed.identity_statements;
      if (parsed.why) board.why = parsed.why;
      board.vision_interview_done = true;
      await saveBoard({});

      // Refresh all section displays with newly saved data
      if (board.vision_statement) {
        document.getElementById('vision-display').innerHTML = `<div style="font-size:1.0625rem;color:var(--text-dim);line-height:1.8;font-style:italic;">"${board.vision_statement}"</div>`;
        const vt = document.getElementById('vision-text'); if (vt) vt.value = board.vision_statement;
      }
      if (board.core_desires?.length) {
        document.getElementById('desires-display').innerHTML = `<ul style="list-style:none;display:flex;flex-direction:column;gap:8px;">${board.core_desires.map(d=>`<li style="display:flex;gap:8px;"><span style="color:var(--gold);margin-top:3px;">*</span><span style="font-size:0.9375rem;color:var(--text-dim);">${d}</span></li>`).join('')}</ul>`;
        const dt = document.getElementById('desires-text'); if (dt) dt.value = board.core_desires.join('\n');
      }
      if (board.values?.length) {
        document.getElementById('values-display').innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:8px;">${board.values.map(v=>`<span style="padding:6px 14px;background:var(--gold-dim);border:1px solid var(--gold-line);border-radius:4px;font-size:0.875rem;color:var(--gold);font-weight:500;">${v}</span>`).join('')}</div>`;
        const vvt = document.getElementById('values-text'); if (vvt) vvt.value = board.values.join('\n');
      }
      if (board.identity_statements?.length) {
        document.getElementById('identity-display').innerHTML = `<div style="display:flex;flex-direction:column;gap:10px;">${board.identity_statements.map(s=>`<div style="padding:12px 16px;background:rgba(227,151,3,0.04);border-left:2px solid var(--gold-line);font-size:0.9375rem;color:var(--text-dim);">${s}</div>`).join('')}</div>`;
        const it = document.getElementById('identity-text'); if (it) it.value = board.identity_statements.join('\n');
      }
      if (board.why) {
        document.getElementById('why-display').innerHTML = `<div style="font-size:1rem;color:var(--text-dim);line-height:1.7;font-style:italic;">"${board.why}"</div>`;
        const wt = document.getElementById('why-text'); if (wt) wt.value = board.why;
      }

      // Show a saved confirmation banner in the chat
      const msgContainer = document.getElementById('vision-chat-messages');
      if (msgContainer) {
        const banner = document.createElement('div');
        banner.style.cssText = 'padding:12px 16px;background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.25);border-radius:8px;font-size:0.875rem;color:#4ade80;text-align:center;margin-top:8px;';
        banner.textContent = 'Your Vision Board has been saved. Scroll down to review and edit any section.';
        msgContainer.appendChild(banner);
        msgContainer.scrollTop = msgContainer.scrollHeight;
      }

      // Show redo button
      if (!document.getElementById('redo-vision-interview')) {
        const headerRow = document.querySelector('#vision-interview-section > div:first-child');
        if (headerRow) {
          const redoBtn = document.createElement('button');
          redoBtn.id = 'redo-vision-interview';
          redoBtn.className = 'btn-ghost';
          redoBtn.style.cssText = 'font-size:0.75rem;padding:6px 12px;';
          redoBtn.textContent = 'Redo Interview';
          redoBtn.addEventListener('click', async () => { board.vision_interview_done = false; await saveBoard({}); APP.navigate('vision'); });
          headerRow.appendChild(redoBtn);
        }
      }

    } catch(e) {
      loadingBubble.innerHTML = loadingBubble.innerHTML.replace('Building your Vision Board suggestions…', 'Could not generate suggestions. Please edit the sections below manually.');
    }
  }

  function renderSuggestion(sectionKey, sectionLabel, rawValue, board, saveBoard, onAccept, renderPreview) {
    if (!rawValue) return;
    const container = document.getElementById(`${sectionKey}-suggestion`);
    if (!container) return;

    container.style.display = 'block';
    container.innerHTML = `
      <div style="margin-top:14px;border:1px solid rgba(227,151,3,0.25);border-radius:8px;overflow:hidden;">
        <div style="background:rgba(227,151,3,0.08);padding:10px 14px;display:flex;align-items:center;justify-content:space-between;gap:12px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="width:18px;height:18px;border-radius:50%;overflow:hidden;border:1px solid var(--gold-line);flex-shrink:0;"><img src="NoaAIandLogo.png" style="width:100%;height:100%;object-fit:cover;object-position:center 10%;" /></div>
            <div style="font-size:0.75rem;color:var(--gold);font-weight:600;letter-spacing:0.04em;text-transform:uppercase;">NoaAI's suggestion</div>
          </div>
          <div style="display:flex;gap:8px;">
            <button id="accept-${sectionKey}" class="btn-gold" style="font-size:0.75rem;padding:5px 14px;">Add to ${sectionLabel}</button>
            <button id="dismiss-${sectionKey}" class="btn-ghost" style="font-size:0.75rem;padding:5px 10px;">Dismiss</button>
          </div>
        </div>
        <div style="padding:12px 14px;background:rgba(0,0,0,0.2);">
          ${renderPreview()}
        </div>
      </div>`;

    document.getElementById(`accept-${sectionKey}`)?.addEventListener('click', async () => {
      onAccept(rawValue);
      await saveBoard({});
      container.style.display = 'none';
    });
    document.getElementById(`dismiss-${sectionKey}`)?.addEventListener('click', () => {
      container.style.display = 'none';
    });
  }

})();
