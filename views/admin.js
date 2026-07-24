// ─── Admin Dashboard ──────────────────────────────────────────────────────────
(function() {
  function adminShell(activeTab, content) {
    return `
<div style="display:flex;min-height:100vh;background:#000;">
  <div style="width:240px;flex-shrink:0;background:var(--s1);border-right:1px solid rgba(227,151,3,0.15);display:flex;flex-direction:column;height:100vh;position:sticky;top:0;overflow-y:auto;">
    <div style="padding:20px 20px;border-bottom:1px solid rgba(255,255,255,0.06);">
      <img src="RealityLabsLogo.png" style="width:180px;mix-blend-mode:lighten;opacity:0.95;" />
    </div>
    <div style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:12px;">
      ${(()=>{ const u = APP.STATE.currentUser; const av = DB.getAvatar(u?.id); const ini = `${u?.first_name?.[0]||''}${u?.last_name?.[0]||''}`.toUpperCase() || 'CD'; return `<div style="width:40px;height:40px;border-radius:50%;overflow:hidden;border:2px solid rgba(227,151,3,0.4);background:rgba(227,151,3,0.12);display:flex;align-items:center;justify-content:center;font-size:0.875rem;font-weight:700;color:var(--gold);flex-shrink:0;">${av?`<img src="${av}" style="width:100%;height:100%;object-fit:cover;"/>`:ini}</div>`; })()}
      <div>
        <div style="font-size:0.8125rem;font-weight:600;color:#fff;">${APP.STATE.currentUser?.first_name||'Carter'} ${APP.STATE.currentUser?.last_name||'Dombeck'}</div>
        <div style="font-size:0.75rem;color:var(--gold);margin-top:2px;">Admin · Coach</div>
      </div>
    </div>
    <nav style="padding:12px;flex:1;">
      ${[
        { id:'admin-dashboard', label:'Client Overview', icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
        { id:'admin-feed', label:'Activity Feed', icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>' },
        { id:'admin-clients', label:'Manage Clients', icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
        { id:'admin-settings', label:'Settings', icon:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' },
      ].map(item=>`<a class="nav-item ${activeTab===item.id?'active':''}" data-nav="${item.id}" style="margin-bottom:2px;"><span style="opacity:0.7;">${item.icon}</span><span>${item.label}</span>${item.id==='admin-feed'?`<span id="admin-feed-badge"></span>`:''}</a>`).join('')}
      <div class="gold-line" style="margin:12px 4px;"></div>
      <a class="nav-item" data-nav="dashboard" style="margin-bottom:2px;"><span style="opacity:0.7;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></span><span>My Dashboard</span></a>
    </nav>
    <div style="padding:12px;border-top:1px solid rgba(255,255,255,0.06);">
      <a class="nav-item" data-action="logout"><span style="opacity:0.7;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span><span>Sign Out</span></a>
    </div>
  </div>
  <div style="flex:1;overflow:auto;">${content}</div>
</div>`;
  }

  function bindAdmin() {
    document.querySelectorAll('[data-nav]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); APP.navigate(el.dataset.nav, el.dataset.params ? JSON.parse(el.dataset.params) : {}); }));
    document.querySelectorAll('[data-action]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); if (el.dataset.action === 'logout') APP.logout(); }));
  }

  APP.register('admin-dashboard', async () => {
    APP.showLoading();
    const clients = await DB.getAllClients();
    const clientData = await Promise.all(clients.map(async c => {
      const [checkIns, hw] = await Promise.all([DB.getCheckIns(c.id), DB.getHomework(c.id)]);
      const streak = APP.getStreak(checkIns);
      const lastCI = checkIns[0];
      const pendingHW = hw.filter(h => h.status === 'submitted').length;
      return { ...c, streak, checkInCount: checkIns.length, lastCI, pendingHW };
    }));

    const content = `
<div style="max-width:1100px;margin:0 auto;padding:32px 24px;">
  <div class="fade-in" style="margin-bottom:32px;">
    <div class="label" style="margin-bottom:8px;">Coach View</div>
    <div style="font-size:1.875rem;font-weight:700;letter-spacing:-0.02em;">All Clients</div>
    <div style="font-size:0.9375rem;color:var(--text-muted);margin-top:6px;">${clients.length} client${clients.length!==1?'s':''}</div>
  </div>
  ${clients.length===0?`<div class="card" style="padding:40px;text-align:center;"><div style="font-size:0.9375rem;color:var(--text-muted);margin-bottom:12px;">No clients yet.</div><button class="btn-gold" data-nav="admin-clients">Add First Client</button></div>`:`
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;">
    ${clientData.map(c=>`
    <div class="card" style="padding:22px;cursor:pointer;" data-nav="admin-client-detail" data-params='{"clientId":"${c.id}"}'>
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px;">
        <div style="display:flex;align-items:center;gap:12px;">
          ${(()=>{ const av=DB.getAvatar(c.id); const ini=`${c.first_name?.[0]||''}${c.last_name?.[0]||''}`.toUpperCase(); return `<div style="width:42px;height:42px;border-radius:50%;overflow:hidden;border:2px solid rgba(227,151,3,0.3);background:rgba(227,151,3,0.1);display:flex;align-items:center;justify-content:center;font-size:0.875rem;font-weight:700;color:var(--gold);flex-shrink:0;">${av?`<img src="${av}" style="width:100%;height:100%;object-fit:cover;" />`:ini}</div>`; })()}
          <div><div style="font-size:1rem;font-weight:600;color:#fff;">${c.first_name} ${c.last_name}</div><div style="font-size:0.8125rem;color:var(--text-muted);margin-top:2px;">@${c.username||'-'}</div></div>
        </div>
        <span class="badge ${c.is_active?'badge-green':'badge-muted'}">${c.is_active?'Active':'Inactive'}</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px;">
        <div style="text-align:center;padding:10px;background:var(--s2);border-radius:6px;"><div style="font-size:1.25rem;font-weight:700;color:var(--gold);">${c.streak}</div><div style="font-size:0.6875rem;color:var(--text-muted);margin-top:2px;">Streak</div></div>
        <div style="text-align:center;padding:10px;background:var(--s2);border-radius:6px;"><div style="font-size:1.25rem;font-weight:700;color:#fff;">${c.checkInCount}</div><div style="font-size:0.6875rem;color:var(--text-muted);margin-top:2px;">Check-ins</div></div>
        <div style="text-align:center;padding:10px;background:var(--s2);border-radius:6px;"><div style="font-size:1.25rem;font-weight:700;color:${c.pendingHW>0?'#fb923c':'#fff'}">${c.pendingHW}</div><div style="font-size:0.6875rem;color:var(--text-muted);margin-top:2px;">Pending HW</div></div>
      </div>
      <div style="font-size:0.8125rem;color:var(--text-muted);display:flex;justify-content:space-between;">
        <span>${c.interview_completed?'✓ Interview done':'⚬ Interview pending'}</span>
        <span>${c.lastCI?`Last: ${APP.formatDate(c.lastCI.date)}`:'No check-ins'}</span>
      </div>
    </div>`).join('')}
  </div>`}
</div>`;
    setTimeout(bindAdmin, 50);
    return adminShell('admin-dashboard', content);
  });

  APP.register('admin-clients', async () => {
    APP.showLoading();
    const clients = await DB.getAllClients();
    const content = `
<div style="max-width:900px;margin:0 auto;padding:32px 24px;">
  <div class="fade-in" style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:32px;gap:16px;flex-wrap:wrap;">
    <div><div class="label" style="margin-bottom:8px;">Client Management</div><div style="font-size:1.875rem;font-weight:700;letter-spacing:-0.02em;">Clients</div></div>
    <button class="btn-gold" id="show-create-form">+ New Client</button>
  </div>
  <div id="create-client-form" class="card" style="padding:28px;margin-bottom:28px;display:none;">
    <div style="font-size:1rem;font-weight:600;margin-bottom:20px;">New Client</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">
      <div><label class="label" style="display:block;margin-bottom:6px;">First Name</label><input class="input" id="new-first" placeholder="Alex" /></div>
      <div><label class="label" style="display:block;margin-bottom:6px;">Last Name</label><input class="input" id="new-last" placeholder="Rivera" /></div>
      <div style="grid-column:1/-1;"><label class="label" style="display:block;margin-bottom:6px;">Username</label><input class="input" type="text" id="new-username" placeholder="e.g. alex" /></div>
      <div style="grid-column:1/-1;"><label class="label" style="display:block;margin-bottom:6px;">Password</label><input class="input" type="password" id="new-password" placeholder="Temporary password" /></div>
    </div>
    <div style="display:flex;gap:12px;"><button class="btn-ghost" id="cancel-create">Cancel</button><button class="btn-gold" id="create-client-btn">Create Client</button></div>
    <div id="create-error" style="display:none;color:#f87171;font-size:0.875rem;margin-top:10px;"></div>
    <div id="create-success" style="display:none;color:#4ade80;font-size:0.875rem;margin-top:10px;"></div>
  </div>
  <div style="display:flex;flex-direction:column;gap:10px;">
    ${clients.map(c=>`
    <div class="card" style="padding:18px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
      <div style="display:flex;align-items:center;gap:12px;">
        ${(()=>{ const av=DB.getAvatar(c.id); const ini=`${c.first_name?.[0]||''}${c.last_name?.[0]||''}`.toUpperCase(); return `<div style="width:38px;height:38px;border-radius:50%;overflow:hidden;border:2px solid rgba(227,151,3,0.3);background:rgba(227,151,3,0.1);display:flex;align-items:center;justify-content:center;font-size:0.8125rem;font-weight:700;color:var(--gold);flex-shrink:0;">${av?`<img src="${av}" style="width:100%;height:100%;object-fit:cover;" />`:ini}</div>`; })()}
        <div><div style="font-size:0.9375rem;font-weight:600;color:#fff;">${c.first_name} ${c.last_name}</div><div style="font-size:0.8125rem;color:var(--text-muted);">@${c.username||'-'}</div></div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <span class="badge ${c.is_active?'badge-green':'badge-muted'}">${c.is_active?'Active':'Inactive'}</span>
        <button class="btn-ghost" data-nav="admin-client-detail" data-params='{"clientId":"${c.id}"}' style="font-size:0.8125rem;padding:6px 12px;">View</button>
        <button class="btn-ghost toggle-active" data-client-id="${c.id}" data-active="${c.is_active}" style="font-size:0.8125rem;padding:6px 12px;">${c.is_active?'Deactivate':'Activate'}</button>
      </div>
    </div>`).join('')}
    ${clients.length===0?`<div class="card" style="padding:40px;text-align:center;color:var(--text-muted);">No clients yet.</div>`:''}
  </div>
</div>`;

    setTimeout(() => {
      bindAdmin();
      document.getElementById('show-create-form')?.addEventListener('click', () => { document.getElementById('create-client-form').style.display='block'; });
      document.getElementById('cancel-create')?.addEventListener('click', () => { document.getElementById('create-client-form').style.display='none'; });
      document.getElementById('create-client-btn')?.addEventListener('click', async () => {
        const first=document.getElementById('new-first')?.value.trim(), last=document.getElementById('new-last')?.value.trim(), username=document.getElementById('new-username')?.value.trim().toLowerCase(), password=document.getElementById('new-password')?.value;
        const errEl=document.getElementById('create-error'), successEl=document.getElementById('create-success');
        if (!first||!last||!username||!password) { errEl.textContent='All fields required.'; errEl.style.display='block'; return; }
        try {
          await DB.createClient({ firstName:first, lastName:last, username, password });
          successEl.textContent=`Client ${first} ${last} created. Username: ${username}`;
          successEl.style.display='block'; errEl.style.display='none';
          setTimeout(() => APP.navigate('admin-clients'), 2000);
        } catch(e) { errEl.textContent=e.message||'Failed to create client.'; errEl.style.display='block'; }
      });
      document.querySelectorAll('.toggle-active').forEach(btn => {
        btn.addEventListener('click', async () => {
          const isActive = btn.dataset.active === 'true';
          if (isActive) await DB.deactivateClient(btn.dataset.clientId);
          else await DB.activateClient(btn.dataset.clientId);
          APP.navigate('admin-clients');
        });
      });
    }, 50);
    return adminShell('admin-clients', content);
  });

  APP.register('admin-client-detail', async ({ clientId }) => {
    APP.showLoading();
    const [profile, clientProfile, checkIns, exercises, hw, journal] = await Promise.all([
      DB.getProfile(clientId),
      DB.getClientProfile(clientId),
      DB.getCheckIns(clientId),
      DB.getClientExercises(clientId),
      DB.getHomework(clientId),
      DB.getCoachJournalEntries(clientId),
    ]);
    if (!profile) return adminShell('admin-dashboard', '<div style="padding:40px;">Client not found.</div>');
    const streak = APP.getStreak(checkIns);

    const content = `
<div style="max-width:1000px;margin:0 auto;padding:32px 24px;">
  <button class="btn-ghost" data-nav="admin-dashboard" style="margin-bottom:24px;font-size:0.8125rem;padding:8px 14px;">← All Clients</button>
  <div class="fade-in" style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:28px;gap:16px;flex-wrap:wrap;">
    <div style="display:flex;align-items:center;gap:16px;">
      ${(()=>{ const av=DB.getAvatar(clientId); const ini=`${profile.first_name?.[0]||''}${profile.last_name?.[0]||''}`.toUpperCase(); return `<div style="width:60px;height:60px;border-radius:50%;overflow:hidden;border:2px solid rgba(227,151,3,0.4);background:rgba(227,151,3,0.1);display:flex;align-items:center;justify-content:center;font-size:1.25rem;font-weight:700;color:var(--gold);flex-shrink:0;">${av?`<img src="${av}" style="width:100%;height:100%;object-fit:cover;" />`:ini}</div>`; })()}
      <div><div style="font-size:2rem;font-weight:700;letter-spacing:-0.02em;">${profile.first_name} ${profile.last_name}</div></div>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn-ghost" id="assign-exercise-btn" style="font-size:0.8125rem;">Assign Exercise</button>
      <button class="btn-ghost" id="assign-hw-btn" style="font-size:0.8125rem;">Assign Homework</button>
    </div>
  </div>

  <div id="assign-exercise-panel" class="card" style="padding:24px;margin-bottom:20px;display:none;">
    <div style="font-size:0.9375rem;font-weight:600;margin-bottom:14px;">Assign Exercise</div>
    <select class="input" id="exercise-select" style="margin-bottom:12px;">${APP.EXERCISES_LIBRARY.map(ex=>`<option value="${ex.id}">${ex.title} (Phase ${ex.phase})</option>`).join('')}</select>
    <div style="display:flex;gap:10px;"><button class="btn-ghost" id="cancel-assign-ex" style="font-size:0.8125rem;">Cancel</button><button class="btn-gold" id="confirm-assign-ex" style="font-size:0.875rem;">Assign</button></div>
  </div>

  <div id="assign-hw-panel" class="card" style="padding:24px;margin-bottom:20px;display:none;">
    <div style="font-size:0.9375rem;font-weight:600;margin-bottom:14px;">Assign Homework</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
      <div style="grid-column:1/-1;"><label class="label" style="display:block;margin-bottom:6px;">Title</label><input class="input" id="hw-title" /></div>
      <div style="grid-column:1/-1;"><label class="label" style="display:block;margin-bottom:6px;">Description</label><textarea class="input" id="hw-desc" rows="3"></textarea></div>
      <div><label class="label" style="display:block;margin-bottom:6px;">Type</label><select class="input" id="hw-type">${['Reading','Exercise','Real-World Action','Reflection','Challenge'].map(t=>`<option>${t}</option>`).join('')}</select></div>
      <div><label class="label" style="display:block;margin-bottom:6px;">Due Date</label><input class="input" type="date" id="hw-due" /></div>
    </div>
    <div style="display:flex;gap:10px;"><button class="btn-ghost" id="cancel-hw" style="font-size:0.8125rem;">Cancel</button><button class="btn-gold" id="confirm-hw" style="font-size:0.875rem;">Assign</button></div>
  </div>

  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px;">
    ${[{label:'Streak',value:streak,color:'var(--gold)'},{label:'Check-ins',value:checkIns.length,color:'#fff'},{label:'Exercises',value:`${exercises.filter(e=>e.status==='completed').length}/${exercises.length}`,color:'#fff'},{label:'HW Pending',value:hw.filter(h=>h.status==='submitted').length,color:hw.filter(h=>h.status==='submitted').length>0?'#fb923c':'#fff'}].map(s=>`<div class="card" style="padding:16px;text-align:center;"><div style="font-size:1.5rem;font-weight:700;color:${s.color};">${s.value}</div><div class="label" style="margin-top:4px;">${s.label}</div></div>`).join('')}
  </div>

  ${clientProfile?`
  <div class="card" style="padding:24px;margin-bottom:20px;">
    <div class="label" style="margin-bottom:14px;">Client Profile</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
      <div><div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">DESIRED REALITY</div><div style="font-size:0.875rem;color:var(--text-dim);">${clientProfile.desired_reality||'-'}</div></div>
      <div><div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">IDENTITY</div><div style="font-size:0.875rem;color:var(--text-dim);">${clientProfile.identity||'-'}</div></div>
      <div><div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">BLOCKS</div><div style="font-size:0.875rem;color:var(--text-dim);">${(clientProfile.blocks||[]).join(', ')||'-'}</div></div>
      <div><div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">VALUES</div><div style="font-size:0.875rem;color:var(--text-dim);">${(clientProfile.values||[]).join(', ')||'-'}</div></div>
    </div>
  </div>`:`<div class="card" style="padding:20px;margin-bottom:20px;color:var(--text-muted);font-size:0.875rem;">Interview not completed yet.</div>`}

  ${checkIns.length>0?`
  <div class="card" style="padding:24px;margin-bottom:20px;">
    <div class="label" style="margin-bottom:14px;">Recent Check-Ins</div>
    <div style="display:flex;flex-direction:column;gap:10px;">
      ${checkIns.slice(0,5).map(ci=>`<div style="padding:14px;background:var(--s2);border-radius:6px;border:1px solid rgba(255,255,255,0.06);"><div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="font-size:0.875rem;font-weight:500;">${APP.formatDate(ci.date)}</span><span style="font-size:0.8125rem;color:var(--gold);">Alignment: ${ci.alignment_score}/10</span></div>${ci.limiting_belief?`<div style="font-size:0.8125rem;color:var(--text-muted);">Limiting: "${ci.limiting_belief}"</div>`:''}${ci.ai_reflection?`<div style="font-size:0.8125rem;color:var(--text-dim);margin-top:6px;font-style:italic;">"${ci.ai_reflection}"</div>`:''}</div>`).join('')}
    </div>
  </div>`:''}

  ${hw.length>0?`
  <div class="card" style="padding:24px;margin-bottom:20px;">
    <div class="label" style="margin-bottom:14px;">Homework</div>
    <div style="display:flex;flex-direction:column;gap:10px;">
      ${hw.map(item=>`<div style="padding:14px;background:var(--s2);border-radius:6px;border:1px solid rgba(255,255,255,0.06);">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;flex-wrap:wrap;gap:8px;"><span style="font-size:0.875rem;font-weight:600;">${item.title}</span><span class="badge badge-muted">${item.status}</span></div>
        ${item.submission_text&&item.status==='submitted'?`<div style="font-size:0.8125rem;color:var(--text-dim);margin-bottom:8px;font-style:italic;">"${(item.submission_text||'').slice(0,120)}..."</div>${!item.coach_feedback?`<textarea class="input" id="feedback-${item.id}" placeholder="Write feedback..." rows="2" style="font-size:0.8125rem;"></textarea><button class="btn-gold submit-feedback" data-hw-id="${item.id}" style="margin-top:8px;font-size:0.8125rem;padding:8px 16px;">Send Feedback</button>`:`<div style="padding:8px 12px;background:var(--gold-dim);border:1px solid var(--gold-line);border-radius:4px;font-size:0.8125rem;color:var(--gold);">Feedback sent ✓</div>`}` : ''}
      </div>`).join('')}
    </div>
  </div>`:''}

  ${journal.length>0?`
  <div class="card" style="padding:24px;">
    <div class="label" style="margin-bottom:14px;">Journal (Coach Access Enabled)</div>
    <div style="display:flex;flex-direction:column;gap:10px;">
      ${journal.slice(0,5).map(e=>`<div style="padding:14px;background:var(--s2);border-radius:6px;"><div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:6px;">${APP.formatDate(e.created_at)} · ${e.mode}</div><div style="font-size:0.875rem;color:var(--text-dim);line-height:1.5;">${(e.content||'').slice(0,200)}...</div></div>`).join('')}
    </div>
  </div>`:''}
</div>`;

    setTimeout(() => {
      bindAdmin();
      document.getElementById('assign-exercise-btn')?.addEventListener('click', () => { const p=document.getElementById('assign-exercise-panel'); p.style.display=p.style.display==='none'?'block':'none'; });
      document.getElementById('cancel-assign-ex')?.addEventListener('click', () => { document.getElementById('assign-exercise-panel').style.display='none'; });
      document.getElementById('confirm-assign-ex')?.addEventListener('click', async () => {
        const exId = document.getElementById('exercise-select')?.value;
        if (!exId) return;
        await DB.assignExercise(clientId, exId, APP.STATE.currentUser.id);
        const ex = APP.EXERCISES_LIBRARY.find(e => e.id === exId);
        if (ex) {
          try {
            await DB.createActivity(APP.STATE.currentUser.id, 'coach_assigned_exercise',
              `Assigned "${ex.title}" to ${profile.first_name}`,
              { target_client_id: clientId, exercise_id: exId, exercise_title: ex.title });
          } catch(e) {}
        }
        APP.navigate('admin-client-detail', { clientId });
      });
      document.getElementById('assign-hw-btn')?.addEventListener('click', () => { const p=document.getElementById('assign-hw-panel'); p.style.display=p.style.display==='none'?'block':'none'; });
      document.getElementById('cancel-hw')?.addEventListener('click', () => { document.getElementById('assign-hw-panel').style.display='none'; });
      document.getElementById('confirm-hw')?.addEventListener('click', async () => {
        const title=document.getElementById('hw-title')?.value.trim(), desc=document.getElementById('hw-desc')?.value.trim(), type=document.getElementById('hw-type')?.value, due=document.getElementById('hw-due')?.value;
        if (!title||!desc) return;
        await DB.assignHomework({ userId:clientId, title, description:desc, dueDate:due||null, type:type||'Exercise', assignedBy:APP.STATE.currentUser.id });
        APP.navigate('admin-client-detail', { clientId });
      });
      document.querySelectorAll('.submit-feedback').forEach(btn => {
        btn.addEventListener('click', async () => {
          const feedback = document.getElementById(`feedback-${btn.dataset.hwId}`)?.value.trim();
          if (!feedback) return;
          await DB.updateHomework(btn.dataset.hwId, { coachFeedback:feedback, status:'reviewed', reviewedAt:new Date().toISOString() });
          const hwItem = hw.find(h => h.id === btn.dataset.hwId);
          try {
            await DB.createActivity(APP.STATE.currentUser.id, 'coach_feedback',
              `Carter gave feedback on "${hwItem?.title||'your homework'}"`,
              { target_client_id: clientId, hw_id: btn.dataset.hwId });
          } catch(e) {}
          APP.navigate('admin-client-detail', { clientId });
        });
      });
    }, 50);
    return adminShell('admin-dashboard', content);
  });

  APP.register('admin-feed', async () => {
    APP.showLoading();
    const coachId = APP.STATE.currentUser.id;
    let activities = [];
    try { activities = await DB.getUnifiedFeed(80); } catch(e) {}

    // Only get reactions for non-coach activities (things Carter can react to)
    const reactableIds = activities.filter(a => !['coach_post','coach_assigned_exercise','coach_feedback'].includes(a.type)).map(a => a.id);
    let reactionsMap = {};
    try { if (reactableIds.length) reactionsMap = await DB.getReactions(reactableIds); } catch(e) {}

    function formatPostDate(ts) {
      const d = new Date(ts);
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterdayStart = new Date(todayStart - 86400000);
      const postStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      if (postStart.getTime() === todayStart.getTime()) return `Today at ${time}`;
      if (postStart.getTime() === yesterdayStart.getTime()) return `Yesterday at ${time}`;
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined }) + ` at ${time}`;
    }

    function typeLabel(type) {
      const map = {
        exercise_complete:       { icon: '💪', label: 'Completed an exercise', color: '#a78bfa' },
        checkin_streak:          { icon: '🔥', label: 'Streak milestone',       color: 'var(--gold)' },
        coach_post:              { icon: '📣', label: 'Coaching update',        color: 'var(--gold)' },
        coach_assigned_exercise: { icon: '📋', label: 'Assigned an exercise',   color: '#60a5fa' },
        coach_feedback:          { icon: '✏️', label: 'Gave feedback',          color: '#4ade80' },
      };
      return map[type] || { icon: '⭐', label: type, color: '#fff' };
    }

    function activityCard(a) {
      const { icon, label, color } = typeLabel(a.type);
      const rx = reactionsMap[a.id] || {};
      const isCoachActivity = ['coach_post','coach_assigned_exercise','coach_feedback'].includes(a.type);
      const p = a.profiles || {};
      const displayName = isCoachActivity ? 'Carter · Coach' : (p.first_name ? `${p.first_name} ${p.last_name||''}`.trim() : 'Client');
      const av = DB.getAvatar(a.user_id);
      const ini = isCoachActivity ? 'CD' : `${p.first_name?.[0]||''}${p.last_name?.[0]||''}`.toUpperCase() || '?';
      const borderColor = isCoachActivity ? 'rgba(227,151,3,0.5)' : 'rgba(227,151,3,0.25)';

      return `
<div class="card feed-card" style="padding:20px;margin-bottom:14px;" data-activity-id="${a.id}">
  <div style="display:flex;align-items:flex-start;gap:14px;">
    <div style="width:42px;height:42px;border-radius:50%;overflow:hidden;border:2px solid ${borderColor};background:rgba(227,151,3,0.1);display:flex;align-items:center;justify-content:center;font-size:0.875rem;font-weight:700;color:var(--gold);flex-shrink:0;">
      ${av ? `<img src="${av}" style="width:100%;height:100%;object-fit:cover;" />` : ini}
    </div>
    <div style="flex:1;min-width:0;">
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;margin-bottom:3px;flex-wrap:wrap;">
        <span style="font-size:0.9375rem;font-weight:600;color:#fff;">${displayName}</span>
        <span style="font-size:0.75rem;color:var(--text-muted);white-space:nowrap;">${formatPostDate(a.created_at)}</span>
      </div>
      <div style="font-size:0.8125rem;color:${color};margin-bottom:8px;">${icon} ${label}</div>
      <div style="font-size:0.9375rem;color:var(--text-dim);line-height:1.6;">${a.title}</div>
      ${!isCoachActivity ? `
      <div style="display:flex;align-items:center;gap:10px;margin-top:14px;">
        <button class="btn-ghost feed-like" data-activity-id="${a.id}" style="font-size:0.8125rem;padding:6px 12px;display:flex;align-items:center;gap:6px;${rx.liked?'color:var(--gold);border-color:var(--gold-line);':''}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="${rx.liked?'var(--gold)':'none'}" stroke="${rx.liked?'var(--gold)':'currentColor'}" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
          ${rx.liked ? 'Liked' : 'Like'}
        </button>
        <button class="btn-ghost feed-comment-toggle" data-activity-id="${a.id}" style="font-size:0.8125rem;padding:6px 12px;">
          💬 ${rx.comment ? 'Edit Comment' : 'Comment'}
        </button>
      </div>
      <div class="feed-comment-box" data-activity-id="${a.id}" style="display:${rx.comment?'block':'none'};margin-top:12px;">
        <textarea class="input feed-comment-input" data-activity-id="${a.id}" placeholder="Write a note to ${displayName}…" rows="2" style="font-size:0.875rem;margin-bottom:8px;">${rx.comment||''}</textarea>
        <div style="display:flex;gap:8px;">
          <button class="btn-ghost feed-comment-cancel" data-activity-id="${a.id}" style="font-size:0.8125rem;padding:6px 12px;">Cancel</button>
          <button class="btn-gold feed-comment-save" data-activity-id="${a.id}" style="font-size:0.8125rem;padding:6px 16px;">Send</button>
        </div>
      </div>
      ${rx.comment?`<div class="feed-comment-preview" data-activity-id="${a.id}" style="margin-top:10px;padding:10px 14px;background:var(--gold-dim);border:1px solid var(--gold-line);border-radius:6px;font-size:0.875rem;color:var(--gold);">Your note: "${rx.comment}"</div>`:''}
      ` : ''}
    </div>
  </div>
</div>`;
    }

    const content = `
<div style="max-width:700px;margin:0 auto;padding:32px 24px;">
  <div class="fade-in" style="margin-bottom:32px;">
    <div class="label" style="margin-bottom:8px;">Coach View</div>
    <div style="font-size:1.875rem;font-weight:700;letter-spacing:-0.02em;">Team Feed</div>
    <div style="font-size:0.9375rem;color:var(--text-muted);margin-top:6px;">Everything happening across the coaching program. Post updates your clients will see.</div>
  </div>

  <!-- Post composer -->
  <div class="card" style="padding:20px;margin-bottom:28px;border-color:rgba(227,151,3,0.25);">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
      ${(()=>{ const av=DB.getAvatar(APP.STATE.currentUser?.id); return `<div style="width:36px;height:36px;border-radius:50%;overflow:hidden;border:2px solid rgba(227,151,3,0.4);background:rgba(227,151,3,0.12);display:flex;align-items:center;justify-content:center;font-size:0.8125rem;font-weight:700;color:var(--gold);flex-shrink:0;">${av?`<img src="${av}" style="width:100%;height:100%;object-fit:cover;"/>`:'CD'}</div>`; })()}
      <span style="font-size:0.875rem;font-weight:600;color:#fff;">Post an update · visible to all clients</span>
    </div>
    <textarea class="input" id="coach-post-text" placeholder="Share a coaching insight, motivation, or announcement…" rows="3" style="font-size:0.875rem;margin-bottom:12px;"></textarea>
    <div style="display:flex;justify-content:flex-end;">
      <button class="btn-gold" id="coach-post-btn" style="font-size:0.875rem;padding:8px 20px;">📣 Post</button>
    </div>
    <div id="coach-post-success" style="display:none;margin-top:10px;font-size:0.875rem;color:#4ade80;">Posted. Your clients can see this now.</div>
  </div>

  <div id="feed-list">
    ${activities.length === 0
      ? `<div class="card" style="padding:40px;text-align:center;color:var(--text-muted);">No activity yet. Once clients complete exercises or hit streaks, they'll show up here.</div>`
      : activities.map(activityCard).join('')}
  </div>
</div>`;

    setTimeout(() => {
      bindAdmin();

      // Coach post, after saving, prepend card immediately without reload
      document.getElementById('coach-post-btn')?.addEventListener('click', async () => {
        const text = document.getElementById('coach-post-text')?.value.trim();
        if (!text) return;
        try {
          await DB.createActivity(coachId, 'coach_post', text, { coach_name: 'Carter' });
          document.getElementById('coach-post-text').value = '';
          document.getElementById('coach-post-success').style.display = 'block';
          setTimeout(() => { document.getElementById('coach-post-success').style.display = 'none'; }, 3000);
          // Prepend new card to feed list
          const newItem = { id: `act-preview-${Date.now()}`, user_id: coachId, type: 'coach_post', title: text, created_at: new Date().toISOString(), profiles: { first_name: 'Carter', last_name: '', role: 'admin' } };
          const list = document.getElementById('feed-list');
          if (list) list.insertAdjacentHTML('afterbegin', activityCard(newItem));
        } catch(e) {}
      });

      // Like toggle
      document.querySelectorAll('.feed-like').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.activityId;
          const currentRx = reactionsMap[id] || {};
          const newLiked = !currentRx.liked;
          reactionsMap[id] = { ...currentRx, liked: newLiked };
          try { await DB.saveReaction(id, coachId, newLiked, currentRx.comment || null); } catch(e) {}
          btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="${newLiked?'var(--gold)':'none'}" stroke="${newLiked?'var(--gold)':'currentColor'}" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg> ${newLiked?'Liked':'Like'}`;
          btn.style.color = newLiked ? 'var(--gold)' : '';
          btn.style.borderColor = newLiked ? 'var(--gold-line)' : '';
        });
      });

      // Comment toggle
      document.querySelectorAll('.feed-comment-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
          const box = document.querySelector(`.feed-comment-box[data-activity-id="${btn.dataset.activityId}"]`);
          if (box) box.style.display = box.style.display === 'none' ? 'block' : 'none';
        });
      });

      // Comment cancel
      document.querySelectorAll('.feed-comment-cancel').forEach(btn => {
        btn.addEventListener('click', () => {
          const box = document.querySelector(`.feed-comment-box[data-activity-id="${btn.dataset.activityId}"]`);
          if (box) box.style.display = 'none';
        });
      });

      // Comment save
      document.querySelectorAll('.feed-comment-save').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.activityId;
          const input = document.querySelector(`.feed-comment-input[data-activity-id="${id}"]`);
          const comment = input?.value.trim() || '';
          const currentRx = reactionsMap[id] || {};
          reactionsMap[id] = { ...currentRx, comment };
          try { await DB.saveReaction(id, coachId, currentRx.liked || false, comment || null); } catch(e) {}
          const box = document.querySelector(`.feed-comment-box[data-activity-id="${id}"]`);
          if (box) box.style.display = 'none';
          let preview = document.querySelector(`.feed-comment-preview[data-activity-id="${id}"]`);
          if (comment) {
            if (!preview) {
              preview = document.createElement('div');
              preview.className = 'feed-comment-preview';
              preview.dataset.activityId = id;
              preview.style.cssText = 'margin-top:10px;padding:10px 14px;background:var(--gold-dim);border:1px solid var(--gold-line);border-radius:6px;font-size:0.875rem;color:var(--gold);';
              box.parentNode.appendChild(preview);
            }
            preview.textContent = `Your note: "${comment}"`;
          } else if (preview) {
            preview.remove();
          }
          const toggle = document.querySelector(`.feed-comment-toggle[data-activity-id="${id}"]`);
          if (toggle) toggle.textContent = `💬 ${comment ? 'Edit Comment' : 'Comment'}`;
        });
      });
    }, 50);

    // Mark admin feed as seen
    localStorage.setItem(`rl_feed_seen_admin_${coachId}`, new Date().toISOString());

    return adminShell('admin-feed', content);
  });

  APP.register('admin-settings', () => {
    const content = `
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
  <div class="fade-in" style="margin-bottom:32px;"><div class="label" style="margin-bottom:8px;">Configuration</div><div style="font-size:1.875rem;font-weight:700;letter-spacing:-0.02em;">Settings</div></div>
  <div class="card" style="padding:28px;margin-bottom:20px;">
    <div style="font-size:1rem;font-weight:600;color:#fff;margin-bottom:6px;">NoaAI</div>
    <div style="font-size:0.875rem;color:var(--text-muted);margin-bottom:20px;">Powers the onboarding interview, check-in reflections, journal prompts, and the vision board interview.</div>
    <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:rgba(74,222,128,0.07);border:1px solid rgba(74,222,128,0.2);border-radius:6px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg><span style="font-size:0.875rem;color:#4ade80;font-weight:500;">Configured, no setup needed</span></div>
  </div>
</div>`;

    setTimeout(() => { bindAdmin(); }, 50);
    return adminShell('admin-settings', content);
  });
})();
