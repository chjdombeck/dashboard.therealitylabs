// ─── Meditations ─────────────────────────────────────────────────────────────
(function() {
  APP.register('meditations', async () => {
    APP.showLoading();
    const user = APP.STATE.currentUser;
    const today = APP.todayStr();
    const userMeds = await DB.getClientMeditations(user.id);

    const content = `
<div style="max-width:900px;margin:0 auto;padding:32px 24px;">
  <div class="fade-in" style="margin-bottom:32px;">
    <div class="label" style="margin-bottom:8px;">Guided Practice</div>
    <div style="font-size:1.875rem;font-weight:700;letter-spacing:-0.02em;">Meditations</div>
    <div style="font-size:0.9375rem;color:var(--text-muted);margin-top:6px;">Visualization and identity installation. Audio-first when available.</div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;">
    ${APP.MEDITATIONS_LIBRARY.map(med => {
      const um = userMeds.find(m => m.meditation_id === med.id);
      const completedToday = um?.completed_dates?.includes(today);
      return `
<div class="card" style="padding:22px;cursor:pointer;" data-nav="meditation-detail" data-params='{"medId":"${med.id}"}'>
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
    <span class="badge badge-muted">${med.durationMinutes} min</span>
    ${completedToday ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>` : ''}
  </div>
  <div style="font-size:1rem;font-weight:600;color:#fff;margin-bottom:6px;">${med.title}</div>
  <div style="font-size:0.8125rem;color:var(--text-muted);margin-bottom:12px;">${med.theme}</div>
  <div style="font-size:0.875rem;color:var(--text-dim);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${med.description}</div>
  <div style="margin-top:16px;">
    <button class="btn-ghost" style="font-size:0.8125rem;padding:8px 14px;width:100%;">
      ${completedToday ? 'View Script' : 'Begin'}
    </button>
  </div>
</div>`;
    }).join('')}
  </div>
</div>`;

    return window.dashboardShell('meditations', content);
  });

  APP.register('meditation-detail', async ({ medId }) => {
    APP.showLoading();
    const med = APP.MEDITATIONS_LIBRARY.find(m => m.id === medId);
    if (!med) return window.dashboardShell('meditations', '<div style="padding:40px;">Not found.</div>');

    const user = APP.STATE.currentUser;
    const today = APP.todayStr();
    const userMeds = await DB.getClientMeditations(user.id);
    const um = userMeds.find(m => m.meditation_id === med.id);
    const completedToday = um?.completed_dates?.includes(today);
    const scriptLines = med.guidedScript ? med.guidedScript.split('\n').filter(l => l.trim()) : [];

    const content = `
<div style="max-width:680px;margin:0 auto;padding:32px 24px;">
  <button class="btn-ghost" data-nav="meditations" style="margin-bottom:24px;font-size:0.8125rem;padding:8px 14px;">← Meditations</button>
  <div class="fade-in">
    <div style="display:flex;gap:8px;margin-bottom:16px;">
      <span class="badge badge-muted">${med.durationMinutes} min</span>
      <span class="badge badge-muted">Phase ${med.phase}</span>
      ${completedToday ? `<span class="badge badge-green">Done today</span>` : ''}
    </div>
    <div style="font-size:2rem;font-weight:700;letter-spacing:-0.02em;margin-bottom:6px;">${med.title}</div>
    <div style="font-size:0.9375rem;color:var(--text-dim);line-height:1.6;margin-bottom:28px;">${med.description}</div>
    <div class="gold-line" style="margin-bottom:28px;"></div>

    <div id="script-reader" style="display:none;">
      <div id="script-line" style="font-size:1.25rem;color:var(--text-dim);line-height:1.7;text-align:center;min-height:120px;display:flex;align-items:center;justify-content:center;padding:40px 20px;background:var(--s1);border:1px solid rgba(227,151,3,0.15);border-radius:8px;margin-bottom:24px;font-style:italic;"></div>
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <button class="btn-ghost" id="prev-line" style="font-size:0.8125rem;padding:8px 14px;">← Prev</button>
        <span id="script-progress" style="font-size:0.8125rem;color:var(--text-muted);"></span>
        <button class="btn-gold" id="next-line" style="font-size:0.875rem;padding:10px 20px;">Next →</button>
      </div>
    </div>

    <div id="script-preview" style="background:var(--s1);border:1px solid rgba(227,151,3,0.1);border-radius:8px;padding:28px;margin-bottom:24px;">
      <div class="label" style="margin-bottom:16px;">Guided Script</div>
      ${scriptLines.map(line => `<p style="font-size:0.9375rem;color:var(--text-dim);line-height:1.7;margin-bottom:16px;font-style:italic;">${line}</p>`).join('')}
    </div>

    <div style="display:flex;gap:12px;flex-wrap:wrap;">
      <button class="btn-gold" id="start-guided">Begin Guided Session</button>
      ${!completedToday ? `<button class="btn-ghost" id="mark-complete-med">Mark Complete</button>` : ''}
    </div>

    ${um?.reflection_note ? `
    <div class="card" style="padding:20px;margin-top:20px;">
      <div class="label" style="margin-bottom:8px;">Your Note</div>
      <div style="font-size:0.9375rem;color:var(--text-dim);line-height:1.6;">${um.reflection_note}</div>
    </div>` : ''}

    <div id="reflection-section" style="display:none;margin-top:20px;">
      <div class="card" style="padding:20px;">
        <div class="label" style="margin-bottom:10px;">Add a Reflection Note</div>
        <textarea class="input" id="med-reflection" placeholder="What came up? What shifted?" rows="3"></textarea>
        <button class="btn-gold" id="save-med-reflection" style="margin-top:12px;font-size:0.875rem;padding:10px 20px;">Save Note</button>
      </div>
    </div>
  </div>
</div>`;

    setTimeout(() => {
      document.querySelectorAll('[data-nav]').forEach(el => {
        el.addEventListener('click', e => { e.preventDefault(); APP.navigate(el.dataset.nav, el.dataset.params ? JSON.parse(el.dataset.params) : {}); });
      });

      let lineIndex = 0;
      const scriptLineEl = document.getElementById('script-line');
      const scriptProgressEl = document.getElementById('script-progress');
      const scriptReader = document.getElementById('script-reader');
      const scriptPreview = document.getElementById('script-preview');

      function showLine() {
        if (!scriptLineEl) return;
        scriptLineEl.style.animation = 'none';
        scriptLineEl.offsetHeight;
        scriptLineEl.style.animation = 'fadeIn 400ms ease both';
        scriptLineEl.textContent = scriptLines[lineIndex] || '';
        if (scriptProgressEl) scriptProgressEl.textContent = `${lineIndex + 1} / ${scriptLines.length}`;
      }

      async function markComplete() {
        const existingDates = um?.completed_dates || [];
        const newDates = existingDates.includes(today) ? existingDates : [...existingDates, today];
        await DB.saveMeditation(user.id, med.id, newDates, um?.reflection_note || '', new Date().toISOString());
      }

      document.getElementById('start-guided')?.addEventListener('click', () => {
        scriptReader.style.display = 'block';
        scriptPreview.style.display = 'none';
        lineIndex = 0;
        showLine();
      });
      document.getElementById('next-line')?.addEventListener('click', async () => {
        if (lineIndex < scriptLines.length - 1) { lineIndex++; showLine(); }
        else {
          scriptReader.style.display = 'none';
          document.getElementById('reflection-section').style.display = 'block';
          await markComplete();
        }
      });
      document.getElementById('prev-line')?.addEventListener('click', () => {
        if (lineIndex > 0) { lineIndex--; showLine(); }
      });
      document.getElementById('mark-complete-med')?.addEventListener('click', async () => {
        await markComplete();
        document.getElementById('reflection-section').style.display = 'block';
        document.getElementById('mark-complete-med').style.display = 'none';
      });
      document.getElementById('save-med-reflection')?.addEventListener('click', async () => {
        const note = document.getElementById('med-reflection')?.value.trim();
        const existingDates = um?.completed_dates || [];
        const newDates = existingDates.includes(today) ? existingDates : [...existingDates, today];
        await DB.saveMeditation(user.id, med.id, newDates, note, new Date().toISOString());
        APP.navigate('meditations');
      });
    }, 50);

    return window.dashboardShell('meditations', content);
  });
})();
