// ─── Exercises ────────────────────────────────────────────────────────────────
(function() {
  const CAT_BG = { 'Belief Work':'rgba(139,92,246,0.15)','Identity':'rgba(227,151,3,0.15)','Visualization':'rgba(34,197,94,0.1)','Pattern Work':'rgba(239,68,68,0.1)','Action':'rgba(59,130,246,0.1)' };
  const CAT_TEXT = { 'Belief Work':'#a78bfa','Identity':'var(--gold)','Visualization':'#4ade80','Pattern Work':'#f87171','Action':'#60a5fa' };

  function exCard(ce, ex) {
    const statusLabels = { assigned:'Assigned', in_progress:'In Progress', completed:'Completed' };
    const statusColors = { assigned:'badge-muted', in_progress:'badge-gold', completed:'badge-green' };
    return `
<div class="card" style="padding:20px;cursor:pointer;" data-nav="exercise-detail" data-params='{"ceId":"${ce.id}"}'>
  <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px;">
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <span class="badge" style="background:${CAT_BG[ex.category]};color:${CAT_TEXT[ex.category]};">${ex.category}</span>
      <span class="badge ${statusColors[ce.status]}">${statusLabels[ce.status]}</span>
    </div>
    <span style="font-size:0.75rem;color:var(--text-muted);white-space:nowrap;">${ex.estimatedMinutes} min</span>
  </div>
  <div style="font-size:1rem;font-weight:600;color:#fff;margin-bottom:6px;">${ex.title}</div>
  <div style="font-size:0.875rem;color:var(--text-dim);line-height:1.5;">${ex.description}</div>
</div>`;
  }

  APP.register('exercises', async () => {
    APP.showLoading();
    const user = APP.STATE.currentUser;
    const userExercises = await DB.getClientExercises(user.id);
    const active = userExercises.filter(e => e.status !== 'completed');
    const completed = userExercises.filter(e => e.status === 'completed');

    const content = `
<div style="max-width:900px;margin:0 auto;padding:32px 24px;">
  <div class="fade-in" style="margin-bottom:32px;">
    <div class="label" style="margin-bottom:8px;">Your Work</div>
    <div style="font-size:1.875rem;font-weight:700;letter-spacing:-0.02em;">Exercises</div>
    <div style="font-size:0.9375rem;color:var(--text-muted);margin-top:6px;">Each exercise targets a specific layer of your subconscious programming.</div>
  </div>
  ${active.length === 0 && completed.length === 0 ? `<div class="card" style="padding:40px;text-align:center;"><div style="font-size:0.9375rem;color:var(--text-muted);">No exercises assigned yet.</div></div>` : ''}
  ${active.length > 0 ? `<div style="margin-bottom:32px;"><div class="label" style="margin-bottom:14px;">Active (${active.length})</div><div style="display:flex;flex-direction:column;gap:12px;">${active.map(ce=>{const ex=APP.EXERCISES_LIBRARY.find(e=>e.id===ce.exercise_id);return ex?exCard(ce,ex):'';}).join('')}</div></div>` : ''}
  ${completed.length > 0 ? `<div><div class="label" style="margin-bottom:14px;">Completed (${completed.length})</div><div style="display:flex;flex-direction:column;gap:12px;">${completed.map(ce=>{const ex=APP.EXERCISES_LIBRARY.find(e=>e.id===ce.exercise_id);return ex?exCard(ce,ex):'';}).join('')}</div></div>` : ''}
</div>`;
    return window.dashboardShell('exercises', content);
  });

  APP.register('exercise-detail', async ({ ceId }) => {
    APP.showLoading();
    const user = APP.STATE.currentUser;
    const exercises = await DB.getClientExercises(user.id);
    const ce = exercises.find(e => e.id === ceId);
    if (!ce) return window.dashboardShell('exercises', '<div style="padding:40px;">Not found.</div>');
    const ex = APP.EXERCISES_LIBRARY.find(e => e.id === ce.exercise_id);
    if (!ex) return window.dashboardShell('exercises', '<div style="padding:40px;">Not found.</div>');

    const content = `
<div style="max-width:720px;margin:0 auto;padding:32px 24px;">
  <button class="btn-ghost" data-nav="exercises" style="margin-bottom:24px;font-size:0.8125rem;padding:8px 14px;">← Exercises</button>
  <div class="fade-in">
    <div style="display:flex;gap:8px;margin-bottom:16px;">
      <span class="badge" style="background:${CAT_BG[ex.category]};color:${CAT_TEXT[ex.category]};">${ex.category}</span>
      <span class="badge badge-muted">Phase ${ex.phase} · ${ex.estimatedMinutes} min</span>
    </div>
    <div style="font-size:2rem;font-weight:700;letter-spacing:-0.02em;margin-bottom:8px;">${ex.title}</div>
    <div style="font-size:0.9375rem;color:var(--text-dim);line-height:1.6;margin-bottom:28px;">${ex.description}</div>
    <div class="gold-line" style="margin-bottom:28px;"></div>
    <div style="margin-bottom:32px;">
      <div class="label" style="margin-bottom:16px;">Instructions</div>
      <ol style="list-style:none;display:flex;flex-direction:column;gap:16px;">
        ${ex.instructions.map((step,i)=>`<li style="display:flex;gap:16px;align-items:flex-start;"><div style="width:28px;height:28px;border-radius:50%;background:var(--gold-dim);border:1px solid var(--gold-line);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:0.75rem;font-weight:700;color:var(--gold);">${i+1}</div><div style="font-size:0.9375rem;color:var(--text-dim);line-height:1.6;padding-top:3px;">${step}</div></li>`).join('')}
      </ol>
    </div>
    ${ce.status !== 'completed' ? `
    <div class="card" style="padding:24px;margin-bottom:24px;">
      <div class="label" style="margin-bottom:12px;">Your Reflection</div>
      <textarea class="input" id="exercise-response" placeholder="What came up for you? What shifted?" rows="5">${ce.response||''}</textarea>
    </div>
    <div style="display:flex;gap:12px;">
      <button class="btn-ghost" id="save-progress">Save Progress</button>
      <button class="btn-gold" id="mark-complete">Mark Complete</button>
    </div>` : `
    <div class="card" style="padding:24px;border-color:rgba(74,222,128,0.2);">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;color:#4ade80;font-weight:600;font-size:0.875rem;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>Completed</div>
      ${ce.response?`<div style="font-size:0.9375rem;color:var(--text-dim);line-height:1.6;font-style:italic;">"${ce.response}"</div>`:''}
    </div>`}
  </div>
</div>`;

    setTimeout(() => {
      document.querySelectorAll('[data-nav]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); APP.navigate(el.dataset.nav, el.dataset.params ? JSON.parse(el.dataset.params) : {}); }));
      document.getElementById('save-progress')?.addEventListener('click', async () => {
        const response = document.getElementById('exercise-response')?.value || '';
        await DB.updateExercise(ce.id, { status: 'in_progress', response });
        const btn = document.getElementById('save-progress');
        btn.textContent = 'Saved ✓';
        setTimeout(() => { btn.textContent = 'Save Progress'; }, 2000);
      });
      document.getElementById('mark-complete')?.addEventListener('click', async () => {
        const response = document.getElementById('exercise-response')?.value || '';
        await DB.updateExercise(ce.id, { status: 'completed', response, completedAt: new Date().toISOString() });
        // Generate activity
        try {
          await DB.createActivity(
            APP.STATE.currentUser.id,
            'exercise_complete',
            `Completed "${ex.title}"`,
            { exercise_id: ex.id, exercise_title: ex.title, category: ex.category, ce_id: ce.id }
          );
        } catch(e) {}
        APP.navigate('exercise-detail', { ceId });
      });
    }, 50);

    return window.dashboardShell('exercises', content);
  });
})();
