// ─── Progress ─────────────────────────────────────────────────────────────────
(function() {
  const MILESTONES = [
    { id: 'first-checkin', label: 'First Check-In', desc: 'The identity is forming.', condition: d => d.checkIns >= 1 },
    { id: 'day-7', label: 'Day 7', desc: 'The identity is taking hold.', condition: d => d.streak >= 7 },
    { id: 'first-exercise', label: 'First Exercise Complete', desc: 'The work has begun.', condition: d => d.completedExercises >= 1 },
    { id: 'first-journal', label: 'First Journal Entry', desc: 'You went inside.', condition: d => d.journalEntries >= 1 },
    { id: 'first-scripting', label: 'First Scripting Entry', desc: 'You spoke it into existence.', condition: d => d.scriptingEntries >= 1 },
    { id: 'day-30', label: 'Day 30', desc: '30 days. The person has changed.', condition: d => d.streak >= 30 },
    { id: 'alignment-8', label: 'Alignment 8+', desc: 'Closing the gap.', condition: d => d.avgAlignment >= 8 },
  ];

  APP.register('progress', async () => {
    APP.showLoading();
    const user = APP.STATE.currentUser;
    const [checkIns, exercises, journal, meds] = await Promise.all([
      DB.getCheckIns(user.id),
      DB.getClientExercises(user.id),
      DB.getJournalEntries(user.id),
      DB.getClientMeditations(user.id),
    ]);

    const sortedCI = [...checkIns].sort((a,b) => a.date.localeCompare(b.date));
    const streak = APP.getStreak(checkIns);
    const completedEx = exercises.filter(e => e.status==='completed').length;
    const avgAlignment = checkIns.length > 0 ? Math.round((checkIns.reduce((s,c)=>s+(c.alignment_score||0),0)/checkIns.length)*10)/10 : 0;
    const totalMedSessions = meds.reduce((s,m)=>s+(m.completed_dates?.length||0),0);

    const milestoneData = { checkIns: checkIns.length, streak, completedExercises: completedEx, journalEntries: journal.length, scriptingEntries: journal.filter(e=>e.mode==='scripting').length, avgAlignment };

    const heatmapDays = [];
    for (let i=48;i>=0;i--) { const d=new Date(); d.setDate(d.getDate()-i); const ds=d.toISOString().split('T')[0]; const ci=checkIns.find(c=>c.date===ds); heatmapDays.push({date:ds,active:!!ci,score:ci?.alignment_score}); }

    const last14 = sortedCI.slice(-14);
    const chartW=400, chartH=80;
    const pts = last14.map((ci,i)=>({ x:(i/Math.max(last14.length-1,1))*chartW, y:chartH-((ci.alignment_score/10)*(chartH-10))-5, score:ci.alignment_score, date:ci.date }));
    const polyline = pts.map(p=>`${p.x},${p.y}`).join(' ');

    const content = `
<div style="max-width:900px;margin:0 auto;padding:32px 24px;">
  <div class="fade-in" style="margin-bottom:32px;">
    <div class="label" style="margin-bottom:8px;">Your Journey</div>
    <div style="font-size:1.875rem;font-weight:700;letter-spacing:-0.02em;">Progress</div>
    <div style="font-size:0.9375rem;color:var(--text-muted);margin-top:6px;">Not gamified. A map of transformation.</div>
  </div>

  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px;margin-bottom:28px;">
    ${[{label:'Current Streak',value:streak,unit:streak===1?'day':'days',color:'var(--gold)'},{label:'Check-Ins',value:checkIns.length,unit:'total',color:'#fff'},{label:'Avg Alignment',value:avgAlignment||'-',unit:'/10',color:avgAlignment>=7?'#4ade80':'#fff'},{label:'Exercises',value:completedEx,unit:'completed',color:'#fff'},{label:'Journal',value:journal.length,unit:'entries',color:'#fff'},{label:'Meditations',value:totalMedSessions,unit:'sessions',color:'#fff'}].map(s=>`
    <div class="card" style="padding:18px;"><div class="label" style="margin-bottom:10px;">${s.label}</div><div style="display:flex;align-items:baseline;gap:4px;"><div style="font-size:2rem;font-weight:700;color:${s.color};line-height:1;">${s.value}</div><div style="font-size:0.75rem;color:var(--text-muted);">${s.unit}</div></div></div>`).join('')}
  </div>

  ${last14.length>1?`
  <div class="card" style="padding:24px;margin-bottom:20px;">
    <div class="label" style="margin-bottom:16px;">Alignment Trend</div>
    <svg width="100%" viewBox="0 0 ${chartW} ${chartH}" preserveAspectRatio="none" style="overflow:visible;height:80px;">
      <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(227,151,3,0.3)"/><stop offset="100%" stop-color="rgba(227,151,3,0)"/></linearGradient></defs>
      <polygon points="${polyline} ${chartW},${chartH} 0,${chartH}" fill="url(#cg)"/>
      <polyline points="${polyline}" fill="none" stroke="var(--gold)" stroke-width="2" stroke-linejoin="round"/>
      ${pts.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="var(--gold)"/>`).join('')}
    </svg>
    <div style="display:flex;justify-content:space-between;margin-top:8px;"><span style="font-size:0.75rem;color:var(--text-muted);">${APP.formatDate(last14[0]?.date)}</span><span style="font-size:0.75rem;color:var(--text-muted);">${APP.formatDate(last14[last14.length-1]?.date)}</span></div>
  </div>`:'' }

  <div class="card" style="padding:24px;margin-bottom:20px;">
    <div class="label" style="margin-bottom:14px;">Activity: Last 7 Weeks</div>
    <div style="display:flex;flex-wrap:wrap;gap:4px;">
      ${heatmapDays.map(d=>`<div class="heatmap-dot ${d.active?'active':''}" title="${d.date}${d.score?' · '+d.score+'/10':''}" style="${d.active&&d.score?`opacity:${0.4+(d.score/10)*0.6};`:''}"></div>`).join('')}
    </div>
  </div>

  <div class="card" style="padding:24px;">
    <div class="label" style="margin-bottom:16px;">Milestones</div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      ${MILESTONES.map(m=>{const achieved=m.condition(milestoneData);return`<div style="display:flex;align-items:center;gap:14px;${achieved?'':'opacity:0.4;'}"><div style="width:36px;height:36px;border-radius:50%;background:${achieved?'var(--gold-dim)':'rgba(255,255,255,0.05)'};border:1px solid ${achieved?'var(--gold-line)':'rgba(255,255,255,0.08)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">${achieved?`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2.5"><path d="M9 12l2 2 4-4"/></svg>`:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`}</div><div><div style="font-size:0.9375rem;font-weight:600;color:${achieved?'#fff':'rgba(255,255,255,0.5)'};">${m.label}</div><div style="font-size:0.8125rem;color:${achieved?'var(--gold)':'var(--text-muted)'};">${m.desc}</div></div></div>`;}).join('')}
    </div>
  </div>

  ${user.interview_completed_at?`<div style="margin-top:20px;text-align:center;font-size:0.8125rem;color:var(--text-muted);">Journey started ${APP.formatDate(user.interview_completed_at)}</div>`:''}
</div>`;
    return window.dashboardShell('progress', content);
  });
})();
