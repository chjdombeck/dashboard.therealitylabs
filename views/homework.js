// ─── Homework ─────────────────────────────────────────────────────────────────
(function() {
  const TYPE_BG = { Reading:'rgba(59,130,246,0.15)',Exercise:'rgba(227,151,3,0.15)','Real-World Action':'rgba(249,115,22,0.15)',Reflection:'rgba(139,92,246,0.15)',Challenge:'rgba(239,68,68,0.1)' };
  const TYPE_TEXT = { Reading:'#60a5fa',Exercise:'var(--gold)','Real-World Action':'#fb923c',Reflection:'#a78bfa',Challenge:'#f87171' };
  const STATUS = { pending:'Pending',in_progress:'In Progress',submitted:'Submitted',reviewed:'Reviewed' };

  function isOverdue(hw) { return hw.status==='pending' && hw.due_date && hw.due_date < APP.todayStr(); }

  function hwCard(item) {
    const od = isOverdue(item);
    return `<div class="card" style="padding:20px;cursor:pointer;${od?'border-color:rgba(239,68,68,0.3);':''}" data-nav="homework-detail" data-params='{"hwId":"${item.id}"}'>
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px;flex-wrap:wrap;">
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <span class="badge" style="background:${TYPE_BG[item.type]||'rgba(255,255,255,0.07)'};color:${TYPE_TEXT[item.type]||'var(--text-muted)'};">${item.type}</span>
          <span class="badge badge-muted">${STATUS[item.status]}</span>
          ${od?`<span class="badge" style="background:rgba(239,68,68,0.1);color:#f87171;">Overdue</span>`:''}
        </div>
        ${item.due_date?`<span style="font-size:0.75rem;color:${od?'#f87171':'var(--text-muted)'};">${APP.formatDate(item.due_date)}</span>`:''}
      </div>
      <div style="font-size:1rem;font-weight:600;color:#fff;margin-bottom:6px;">${item.title}</div>
      <div style="font-size:0.875rem;color:var(--text-dim);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${item.description||''}</div>
      ${item.coach_feedback?`<div style="margin-top:12px;padding:10px 12px;background:var(--gold-dim);border:1px solid var(--gold-line);border-radius:6px;font-size:0.8125rem;color:var(--gold);">Coach feedback available</div>`:''}
    </div>`;
  }

  APP.register('homework', async () => {
    APP.showLoading();
    const hw = await DB.getHomework(APP.STATE.currentUser.id);
    const overdue = hw.filter(h => isOverdue(h));
    const active = hw.filter(h => !isOverdue(h) && h.status !== 'reviewed' && h.status !== 'submitted');
    const done = hw.filter(h => h.status === 'submitted' || h.status === 'reviewed');

    const content = `
<div style="max-width:900px;margin:0 auto;padding:32px 24px;">
  <div class="fade-in" style="margin-bottom:32px;">
    <div class="label" style="margin-bottom:8px;">Assigned Work</div>
    <div style="font-size:1.875rem;font-weight:700;letter-spacing:-0.02em;">Homework</div>
    <div style="font-size:0.9375rem;color:var(--text-muted);margin-top:6px;">Specific tasks assigned by Carter. Do the work.</div>
  </div>
  ${overdue.length>0?`<div style="margin-bottom:28px;"><div class="label" style="color:#f87171;margin-bottom:12px;">Overdue</div><div style="display:flex;flex-direction:column;gap:10px;">${overdue.map(hwCard).join('')}</div></div>`:''}
  ${active.length>0?`<div style="margin-bottom:28px;"><div class="label" style="margin-bottom:12px;">Active</div><div style="display:flex;flex-direction:column;gap:10px;">${active.map(hwCard).join('')}</div></div>`:''}
  ${done.length>0?`<div><div class="label" style="margin-bottom:12px;">Submitted / Reviewed</div><div style="display:flex;flex-direction:column;gap:10px;">${done.map(hwCard).join('')}</div></div>`:''}
  ${hw.length===0?`<div class="card" style="padding:40px;text-align:center;color:var(--text-muted);">No homework assigned yet.</div>`:''}
</div>`;
    return window.dashboardShell('homework', content);
  });

  APP.register('homework-detail', async ({ hwId }) => {
    APP.showLoading();
    const user = APP.STATE.currentUser;
    const hw = await DB.getHomework(user.id);
    const item = hw.find(h => h.id === hwId);
    if (!item) return window.dashboardShell('homework', '<div style="padding:40px;">Not found.</div>');
    const isLocked = item.status === 'submitted' || item.status === 'reviewed';

    const content = `
<div style="max-width:720px;margin:0 auto;padding:32px 24px;">
  <button class="btn-ghost" data-nav="homework" style="margin-bottom:24px;font-size:0.8125rem;padding:8px 14px;">← Homework</button>
  <div class="fade-in">
    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <span class="badge" style="background:${TYPE_BG[item.type]};color:${TYPE_TEXT[item.type]};">${item.type}</span>
      <span class="badge badge-muted">${STATUS[item.status]}</span>
    </div>
    <div style="font-size:2rem;font-weight:700;letter-spacing:-0.02em;margin-bottom:8px;">${item.title}</div>
    ${item.due_date?`<div style="font-size:0.875rem;color:var(--text-muted);margin-bottom:16px;">Due: ${APP.formatDate(item.due_date)}</div>`:''}
    <div style="font-size:0.9375rem;color:var(--text-dim);line-height:1.6;margin-bottom:28px;">${item.description||''}</div>
    <div class="gold-line" style="margin-bottom:28px;"></div>
    ${item.coach_feedback?`<div style="margin-bottom:28px;padding:20px;background:var(--gold-dim);border:1px solid var(--gold-line);border-radius:8px;"><div class="label" style="color:var(--gold);margin-bottom:10px;">Coach Feedback</div><div style="font-size:0.9375rem;color:var(--text-dim);line-height:1.6;">${item.coach_feedback}</div></div>`:''}
    ${!isLocked?`
    <div class="label" style="margin-bottom:12px;">Your Submission</div>
    <textarea class="input" id="hw-submission" placeholder="Submit your work..." rows="6">${item.submission_text||''}</textarea>
    <div style="display:flex;gap:12px;margin-top:16px;">
      <button class="btn-ghost" id="save-hw">Save Draft</button>
      <button class="btn-gold" id="submit-hw">Submit</button>
    </div>`:
    `<div class="card" style="padding:20px;"><div class="label" style="margin-bottom:10px;">Your Submission</div><div style="font-size:0.9375rem;color:var(--text-dim);line-height:1.6;">${item.submission_text||'No text submitted.'}</div></div>`}
  </div>
</div>`;

    setTimeout(() => {
      document.querySelectorAll('[data-nav]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); APP.navigate(el.dataset.nav, el.dataset.params ? JSON.parse(el.dataset.params) : {}); }));
      document.getElementById('save-hw')?.addEventListener('click', async () => {
        await DB.updateHomework(hwId, { status: 'in_progress', submissionText: document.getElementById('hw-submission')?.value||'' });
        APP.navigate('homework-detail', { hwId });
      });
      document.getElementById('submit-hw')?.addEventListener('click', async () => {
        await DB.updateHomework(hwId, { status: 'submitted', submissionText: document.getElementById('hw-submission')?.value||'', submittedAt: new Date().toISOString() });
        APP.navigate('homework');
      });
    }, 50);

    return window.dashboardShell('homework', content);
  });
})();
