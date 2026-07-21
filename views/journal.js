// ─── Journal ──────────────────────────────────────────────────────────────────
(function() {
  const PROMPT_BANK = [
    "Describe in vivid detail what your reality looks like 3 years from now, as if you're already living it.",
    "What is the story you've been telling yourself that has been producing your current results? Write the new story.",
    "List every piece of evidence that proves you are the person who can have what you want.",
    "Write about a time you overcame something that felt impossible. What does that tell you about who you are?",
    "What would the most aligned version of you do today? Be specific.",
    "What pattern keeps showing up in your business? What belief is underneath it?",
    "Who do you need to stop being to have what you want?",
    "Write a letter to your old identity. Thank it. Release it.",
  ];
  const TAGS = ['Vision','Gratitude','Shadow Work','Scripting','Breakthrough','Resistance'];
  const TAG_COLORS = { Vision:'rgba(227,151,3,0.15)',Gratitude:'rgba(74,222,128,0.1)','Shadow Work':'rgba(139,92,246,0.15)',Scripting:'rgba(59,130,246,0.1)',Breakthrough:'rgba(249,115,22,0.15)',Resistance:'rgba(239,68,68,0.1)' };
  const TAG_TEXT = { Vision:'var(--gold)',Gratitude:'#4ade80','Shadow Work':'#a78bfa',Scripting:'#60a5fa',Breakthrough:'#fb923c',Resistance:'#f87171' };

  APP.register('journal', async () => {
    APP.showLoading();
    const user = APP.STATE.currentUser;
    const entries = await DB.getJournalEntries(user.id);
    const content = `
<div style="max-width:900px;margin:0 auto;padding:32px 24px;">
  <div class="fade-in" style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:32px;gap:16px;flex-wrap:wrap;">
    <div>
      <div class="label" style="margin-bottom:8px;">Private Space</div>
      <div style="font-size:1.875rem;font-weight:700;letter-spacing:-0.02em;">Journal</div>
      <div style="font-size:0.9375rem;color:var(--text-muted);margin-top:6px;">Write what's true. The subconscious responds to what you put on the page.</div>
    </div>
    <button class="btn-gold" data-nav="journal-write" data-params='{"mode":"free"}'>New Entry</button>
  </div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:32px;">
    ${[{mode:'prompted',label:'Prompted',desc:'AI-generated prompt'},{mode:'free',label:'Free Write',desc:'Open canvas'},{mode:'scripting',label:'Scripting',desc:'Write it as done'}].map(m=>`
    <button class="card" data-nav="journal-write" data-params='{"mode":"${m.mode}"}' style="padding:20px;text-align:left;cursor:pointer;">
      <div style="font-size:0.9375rem;font-weight:600;color:#fff;margin-bottom:4px;">${m.label}</div>
      <div style="font-size:0.8125rem;color:var(--text-muted);">${m.desc}</div>
    </button>`).join('')}
  </div>
  ${entries.length === 0 ? `<div class="card" style="padding:40px;text-align:center;"><div style="font-size:0.9375rem;color:var(--text-muted);">No entries yet. What's true for you right now?</div></div>` : `
  <div>
    <div class="label" style="margin-bottom:14px;">Past Entries (${entries.length})</div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      ${entries.slice(0,20).map(e=>`
      <div class="card" style="padding:20px;cursor:pointer;" data-nav="journal-entry" data-params='{"entryId":"${e.id}"}'>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
          <div style="font-size:0.8125rem;color:var(--text-muted);">${APP.formatDate(e.created_at)} · ${e.word_count||0} words · ${e.mode}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">${(e.tags||[]).map(t=>`<span class="badge" style="background:${TAG_COLORS[t]||'rgba(255,255,255,0.07)'};color:${TAG_TEXT[t]||'var(--text-muted)'};">${t}</span>`).join('')}</div>
        </div>
        <div style="font-size:0.9375rem;color:var(--text-dim);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${e.content}</div>
      </div>`).join('')}
    </div>
  </div>`}
</div>`;
    return window.dashboardShell('journal', content);
  });

  APP.register('journal-write', ({ mode }) => {
    const user = APP.STATE.currentUser;
    const isScripting = mode === 'scripting';
    const isPrompted = mode === 'prompted';
    const prompt = isPrompted ? PROMPT_BANK[Math.floor(Math.random() * PROMPT_BANK.length)] : null;
    let selectedTags = isScripting ? ['Scripting'] : [];

    const content = `
<div style="max-width:740px;margin:0 auto;padding:32px 24px;">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;">
    <button class="btn-ghost" data-nav="journal" style="font-size:0.8125rem;padding:8px 14px;">← Journal</button>
    <div style="display:flex;align-items:center;gap:12px;">
      <span id="word-count" style="font-size:0.8125rem;color:var(--text-muted);">0 words</span>
      <span id="save-indicator" style="font-size:0.8125rem;color:var(--text-muted);">Draft</span>
      <button class="btn-gold" id="save-entry" style="font-size:0.875rem;padding:10px 20px;">Save Entry</button>
    </div>
  </div>
  ${isScripting?`<div style="margin-bottom:20px;padding:16px 20px;background:rgba(227,151,3,0.06);border:1px solid rgba(227,151,3,0.2);border-radius:8px;font-size:0.875rem;color:var(--gold);font-style:italic;">Write as if it's already done. Present tense. No "I will" — only "I am" and "I have."</div>`:''}
  ${isPrompted&&prompt?`<div style="margin-bottom:20px;padding:20px;background:var(--s1);border:1px solid rgba(227,151,3,0.2);border-radius:8px;"><div class="label" style="margin-bottom:8px;">Today's Prompt</div><div style="font-size:0.9375rem;color:var(--text-dim);line-height:1.6;font-style:italic;">"${prompt}"</div></div>`:''}
  <div style="position:relative;">
    <textarea id="journal-content" class="input" placeholder="Write what's true… or click the mic to speak it." style="min-height:400px;font-size:1rem;line-height:1.7;width:100%;padding-right:56px;"></textarea>
    <div style="position:absolute;bottom:12px;right:12px;">${APP.micButtonHTML('journal-mic')}</div>
  </div>
  <div style="margin-top:20px;"><div class="label" style="margin-bottom:10px;">Tags</div><div style="display:flex;gap:8px;flex-wrap:wrap;">${TAGS.map(t=>`<button class="badge journal-tag" data-tag="${t}" style="cursor:pointer;background:${selectedTags.includes(t)?TAG_COLORS[t]:'rgba(255,255,255,0.07)'};color:${selectedTags.includes(t)?TAG_TEXT[t]:'var(--text-muted)'};padding:6px 12px;">${t}</button>`).join('')}</div></div>
  <div style="margin-top:20px;"><label style="display:flex;align-items:center;gap:8px;cursor:pointer;"><input type="checkbox" id="coach-access" style="accent-color:var(--gold);width:16px;height:16px;" /><span style="font-size:0.875rem;color:var(--text-muted);">Allow coach to read this entry</span></label></div>
</div>`;

    setTimeout(() => {
      document.querySelectorAll('[data-nav]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); APP.navigate(el.dataset.nav, el.dataset.params ? JSON.parse(el.dataset.params) : {}); }));
      const contentEl = document.getElementById('journal-content');
      const wordCountEl = document.getElementById('word-count');

      contentEl?.addEventListener('input', () => {
        const words = contentEl.value.trim().split(/\s+/).filter(Boolean).length;
        wordCountEl.textContent = `${words} words`;
      });

      APP.attachVoice(contentEl, document.getElementById('journal-mic'));

      document.querySelectorAll('.journal-tag').forEach(btn => {
        btn.addEventListener('click', () => {
          const t = btn.dataset.tag;
          if (selectedTags.includes(t)) { selectedTags = selectedTags.filter(x => x !== t); btn.style.background = 'rgba(255,255,255,0.07)'; btn.style.color = 'var(--text-muted)'; }
          else { selectedTags.push(t); btn.style.background = TAG_COLORS[t]||'var(--gold-dim)'; btn.style.color = TAG_TEXT[t]||'var(--gold)'; }
        });
      });

      document.getElementById('save-entry')?.addEventListener('click', async () => {
        const text = contentEl?.value.trim();
        if (!text) return;
        const words = text.split(/\s+/).filter(Boolean).length;
        await DB.saveJournalEntry({
          userId: user.id, date: APP.todayStr(), mode: mode||'free',
          prompt: prompt||null, content: text, wordCount: words,
          tags: selectedTags, coachAccessEnabled: document.getElementById('coach-access')?.checked||false,
        });
        APP.navigate('journal');
      });
    }, 50);

    return window.dashboardShell('journal', content);
  });

  APP.register('journal-entry', async ({ entryId }) => {
    APP.showLoading();
    const user = APP.STATE.currentUser;
    const entries = await DB.getJournalEntries(user.id);
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return window.dashboardShell('journal', '<div style="padding:40px;">Not found.</div>');
    const content = `
<div style="max-width:740px;margin:0 auto;padding:32px 24px;">
  <button class="btn-ghost" data-nav="journal" style="margin-bottom:24px;font-size:0.8125rem;padding:8px 14px;">← Journal</button>
  <div class="fade-in">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <span style="font-size:0.875rem;color:var(--text-muted);">${APP.formatDate(entry.created_at)}</span>
      <span style="color:var(--text-muted);">·</span>
      <span style="font-size:0.875rem;color:var(--text-muted);">${entry.word_count} words · ${entry.mode}</span>
      ${(entry.tags||[]).map(t=>`<span class="badge" style="background:${TAG_COLORS[t]||'rgba(255,255,255,0.07)'};color:${TAG_TEXT[t]||'var(--text-muted)'};">${t}</span>`).join('')}
    </div>
    <div style="font-size:1rem;color:var(--text-dim);line-height:1.8;white-space:pre-wrap;">${entry.content}</div>
  </div>
</div>`;
    return window.dashboardShell('journal', content);
  });
})();
