// ─── Dashboard Shell + Home View ───────────────────────────────────────────────
(function() {
  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Home', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
    { id: 'checkin', label: 'Check-In', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>' },
    { id: 'exercises', label: 'Exercises', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>' },
    { id: 'meditations', label: 'Meditations', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z"/><path d="M2 20c0-4 4-7 10-7s10 3 10 7"/></svg>' },
    { id: 'journal', label: 'Journal', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>' },
    { id: 'vision', label: 'My Vision', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' },
    { id: 'progress', label: 'Identity Progress', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
    { id: 'live-from-end', label: 'Live From The End', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
    { id: 'client-feed', label: 'Activity Feed', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
    { id: 'noa', label: 'NoaAI', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z"/><path d="M2 20c0-4 4-7 10-7s10 3 10 7"/></svg>' },
  ];

  function sidebar(activeId) {
    const user = APP.STATE.currentUser;
    const isAdmin = user?.role === 'admin';
    const avatar = DB.getAvatar(user?.id);
    const initials = `${user?.first_name?.[0]||''}${user?.last_name?.[0]||''}`.toUpperCase();
    return `
<div style="width:240px;flex-shrink:0;background:var(--s1);border-right:1px solid rgba(227,151,3,0.15);display:flex;flex-direction:column;height:100vh;position:sticky;top:0;overflow-y:auto;">
  <div style="padding:20px 20px;border-bottom:1px solid rgba(255,255,255,0.06);">
    <img src="RealityLabsLogo.png" style="width:180px;mix-blend-mode:lighten;opacity:0.95;" />
  </div>
  <div style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.06);">
    <div style="display:flex;align-items:center;gap:12px;">
      <div id="avatar-upload-label" title="Double-click to change photo" style="cursor:default;flex-shrink:0;">
        <div id="sidebar-avatar" style="width:44px;height:44px;border-radius:50%;overflow:hidden;border:2px solid rgba(227,151,3,0.4);background:rgba(227,151,3,0.12);display:flex;align-items:center;justify-content:center;font-size:0.9375rem;font-weight:700;color:var(--gold);letter-spacing:0.02em;flex-shrink:0;">
          ${avatar ? `<img src="${avatar}" style="width:100%;height:100%;object-fit:cover;" />` : initials}
        </div>
        <input type="file" id="avatar-file-input" accept="image/*" style="display:none;" />
      </div>
      <div>
        <div style="font-size:0.8125rem;font-weight:600;color:#fff;">${user?.first_name} ${user?.last_name}</div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">${isAdmin ? 'Coach · Admin' : 'Client'}</div>
      </div>
    </div>
  </div>
  <nav style="padding:12px 12px;flex:1;">
    ${NAV_ITEMS.map(item => `
      <a class="nav-item ${activeId === item.id ? 'active' : ''}" data-nav="${item.id}" style="margin-bottom:2px;">
        <span style="opacity:0.7;">${item.icon}</span>
        <span>${item.label}</span>
        ${item.id === 'client-feed' ? `<span id="client-feed-badge"></span>` : ''}
      </a>`).join('')}
    ${isAdmin ? `
    <div class="gold-line" style="margin:12px 4px;"></div>
    <a class="nav-item" data-nav="admin-dashboard" style="margin-bottom:2px;">
      <span style="opacity:0.7;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></span>
      <span>Coach View</span>
    </a>` : ''}
  </nav>
  <div style="padding:12px 12px;border-top:1px solid rgba(255,255,255,0.06);">
    <a class="nav-item" data-action="logout">
      <span style="opacity:0.7;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span>
      <span>Sign Out</span>
    </a>
  </div>
</div>`;
  }

  function mobileNav(activeId) {
    return `
<div style="position:fixed;bottom:0;left:0;right:0;background:var(--s1);border-top:1px solid rgba(227,151,3,0.15);display:flex;z-index:100;padding-bottom:env(safe-area-inset-bottom);">
  ${NAV_ITEMS.slice(0,5).map(item => `
    <button class="tab-btn ${activeId === item.id ? 'active' : ''}" data-nav="${item.id}" style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 0;">
      ${item.icon}
      <span style="font-size:0.6875rem;">${item.label}</span>
    </button>`).join('')}
</div>`;
  }

  function dashboardShell(activeId, content) {
    return `
<div style="display:flex;min-height:100vh;background:#000;">
  <div class="hidden-mobile">${sidebar(activeId)}</div>
  <div style="flex:1;overflow:auto;padding-bottom:80px;" id="main-content">${content}</div>
  <div class="show-mobile" style="display:none;">${mobileNav(activeId)}</div>
</div>
<style>
  @media (max-width: 768px) {
    .hidden-mobile { display: none !important; }
    .show-mobile { display: block !important; }
    #main-content { padding-bottom: 80px; }
  }
</style>`;
  }

  // ── Home / Today View ──────────────────────────────────────────────────────
  APP.register('dashboard', async () => {
    APP.showLoading();
    const user = APP.STATE.currentUser;
    const today = APP.todayStr();

    const [checkIns, exercises, journal, vision] = await Promise.all([
      DB.getCheckIns(user.id),
      DB.getClientExercises(user.id),
      DB.getJournalEntries(user.id),
      DB.getVisionBoard(user.id),
    ]);

    const todayCheckIn = checkIns.find(c => c.date === today);
    const streak = APP.getStreak(checkIns);
    const lastJournal = journal[0];
    const assignedEx = exercises.find(e => e.status === 'assigned');
    const exerciseDetail = assignedEx ? APP.EXERCISES_LIBRARY.find(e => e.id === assignedEx.exercise_id) : null;

    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      const ci = checkIns.find(c => c.date === ds);
      last7.push(ci?.alignment_score || null);
    }
    const sparkline = last7.map((v, i) => `${(i/6)*200},${v ? 40-((v/10)*36) : 40}`).join(' ');
    const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    const content = `
<div style="max-width:900px;margin:0 auto;padding:32px 24px;">
  <div class="fade-in" style="margin-bottom:36px;">
    <div style="font-size:0.8125rem;color:var(--text-muted);letter-spacing:0.04em;text-transform:uppercase;margin-bottom:6px;">${dateStr}</div>
    <div style="font-size:1.875rem;font-weight:700;color:#fff;letter-spacing:-0.02em;line-height:1.1;">
      ${user.role === 'admin' ? 'Good to see you, Carter.' : `Welcome back, ${user.first_name}.`}
    </div>
    <div style="color:var(--gold);font-size:0.9375rem;margin-top:8px;font-style:italic;">"${APP.getDailyLine()}"</div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;" class="fade-in-delay-1">
    <div class="card" style="padding:24px;grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;gap:20px;background:linear-gradient(135deg,var(--s1) 0%,rgba(227,151,3,0.06) 100%);">
      <div>
        <div class="label" style="margin-bottom:8px;">Daily Practice</div>
        <div style="font-size:1.125rem;font-weight:600;color:#fff;margin-bottom:6px;">${todayCheckIn ? 'Check-In Complete' : "Today's Check-In"}</div>
        <div style="font-size:0.875rem;color:var(--text-muted);">${todayCheckIn ? 'You showed up today. That\'s identity in action.' : 'Take 5 minutes. Check in with where you are.'}</div>
      </div>
      ${todayCheckIn
        ? `<div style="display:flex;flex-direction:column;align-items:center;gap:6px;color:#4ade80;white-space:nowrap;">
             <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" style="filter:drop-shadow(0 0 8px rgba(74,222,128,0.5));"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
             <span style="font-size:0.8125rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">Done</span>
           </div>`
        : `<button class="btn-gold" data-nav="checkin" style="white-space:nowrap;">Start Check-In</button>`}
    </div>

    <div class="card" style="padding:24px;">
      <div class="label" style="margin-bottom:12px;">Current Streak</div>
      <div style="display:flex;align-items:baseline;gap:8px;">
        <div style="font-size:3rem;font-weight:700;color:var(--gold);line-height:1;">${streak}</div>
        <div style="color:var(--text-muted);font-size:0.875rem;">days</div>
      </div>
      <div style="font-size:0.8125rem;color:var(--text-muted);margin-top:8px;">${streak === 0 ? 'Start today.' : streak < 7 ? 'The identity is forming.' : streak < 30 ? 'The identity is taking hold.' : 'The identity is yours.'}</div>
    </div>

    <div class="card" style="padding:24px;">
      <div class="label" style="margin-bottom:12px;">7-Day Alignment</div>
      ${last7.some(v => v !== null)
        ? `<svg width="100%" height="44" viewBox="0 0 200 44" preserveAspectRatio="none" style="overflow:visible;"><polyline points="${sparkline}" fill="none" stroke="rgba(227,151,3,0.5)" stroke-width="1.5" stroke-linejoin="round"/>${last7.map((v,i)=>v?`<circle cx="${(i/6)*200}" cy="${40-(v/10)*36}" r="3" fill="var(--gold)"/>`:'').join('')}</svg>`
        : `<div style="font-size:0.875rem;color:var(--text-muted);padding-top:8px;">Complete check-ins to see your alignment trend.</div>`}
    </div>

    <div class="card" style="padding:24px;">
      <div class="label" style="margin-bottom:16px;">Today's Focus</div>
      <div style="display:flex;flex-direction:column;gap:12px;">

        <!-- Daily Check-In -->
        <div style="display:flex;align-items:center;gap:14px;padding:14px 16px;background:var(--s2);border-radius:8px;border:1px solid ${todayCheckIn ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)'};">
          <div style="width:36px;height:36px;border-radius:6px;background:${todayCheckIn ? 'rgba(74,222,128,0.1)' : 'var(--gold-dim)'};border:1px solid ${todayCheckIn ? 'rgba(74,222,128,0.3)' : 'var(--gold-line)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${todayCheckIn ? '#4ade80' : 'var(--gold)'}" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:0.9375rem;font-weight:600;color:${todayCheckIn ? 'rgba(255,255,255,0.5)' : '#fff'};"${todayCheckIn ? ' style="text-decoration:line-through;color:rgba(255,255,255,0.4);"' : ''}>Daily Check-In</div>
            <div style="font-size:0.8125rem;color:var(--text-muted);margin-top:2px;">${todayCheckIn ? 'Completed today' : '5 min · Build the daily habit'}</div>
          </div>
          ${todayCheckIn
            ? `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" style="flex-shrink:0;filter:drop-shadow(0 0 6px rgba(74,222,128,0.4));"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>`
            : `<button class="btn-gold" data-nav="checkin" style="font-size:0.8125rem;padding:7px 14px;white-space:nowrap;flex-shrink:0;">Start</button>`}
        </div>

        <!-- Active Exercise (if any) -->
        ${exerciseDetail ? `
        <div style="display:flex;align-items:center;gap:14px;padding:14px 16px;background:var(--s2);border-radius:8px;border:1px solid ${assignedEx.status === 'completed' ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)'};">
          <div style="width:36px;height:36px;border-radius:6px;background:${assignedEx.status === 'completed' ? 'rgba(74,222,128,0.1)' : 'var(--gold-dim)'};border:1px solid ${assignedEx.status === 'completed' ? 'rgba(74,222,128,0.3)' : 'var(--gold-line)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${assignedEx.status === 'completed' ? '#4ade80' : 'var(--gold)'}" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:0.9375rem;font-weight:600;color:${assignedEx.status === 'completed' ? 'rgba(255,255,255,0.4)' : '#fff'};">${exerciseDetail.title}</div>
            <div style="font-size:0.8125rem;color:var(--text-muted);margin-top:2px;">${exerciseDetail.estimatedMinutes} min · ${exerciseDetail.category}</div>
          </div>
          ${assignedEx.status === 'completed'
            ? `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" style="flex-shrink:0;filter:drop-shadow(0 0 6px rgba(74,222,128,0.4));"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>`
            : `<button class="btn-ghost" data-nav="exercises" style="font-size:0.8125rem;padding:7px 14px;white-space:nowrap;flex-shrink:0;">Open</button>`}
        </div>` : `
        <div style="padding:14px 16px;background:var(--s2);border-radius:8px;border:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:0.875rem;color:var(--text-muted);">No exercises assigned yet. Your coach will add them soon.</div>
        </div>`}

      </div>
    </div>

    <div class="card" style="padding:24px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
        <div class="label">Last Journal Entry</div>
        <button class="btn-ghost" data-nav="journal" style="font-size:0.75rem;padding:6px 12px;">Open Journal</button>
      </div>
      ${lastJournal
        ? `<div style="font-size:0.875rem;color:var(--text-dim);line-height:1.6;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;">${lastJournal.content}</div><div style="font-size:0.75rem;color:var(--text-muted);margin-top:8px;">${APP.formatDate(lastJournal.created_at)}</div>`
        : `<div style="font-size:0.875rem;color:var(--text-muted);">No entries yet. Write what's true right now.</div>`}
    </div>

    ${vision?.vision_statement ? `
    <div class="card" style="padding:24px;grid-column:1/-1;border-color:rgba(227,151,3,0.15);">
      <div class="label" style="margin-bottom:10px;">Your Vision</div>
      <div style="font-size:0.9375rem;color:var(--text-dim);line-height:1.6;font-style:italic;">"${vision.vision_statement}"</div>
      <button class="btn-ghost" data-nav="vision" style="font-size:0.8125rem;padding:8px 14px;margin-top:14px;">View Vision Board</button>
    </div>` : ''}
  </div>

  <!-- ── Calendar ──────────────────────────────────────────────────────────── -->
  <div class="card fade-in" id="calendar-section" style="padding:24px;margin-top:20px;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
      <div>
        <div class="label">Calendar</div>
        <div style="font-size:0.8125rem;color:var(--text-muted);margin-top:3px;">Schedule your coaching calls and other events</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <button id="cal-prev" class="btn-ghost" style="padding:6px 10px;font-size:1rem;line-height:1;">‹</button>
        <div id="cal-month-label" style="font-size:0.9375rem;font-weight:600;color:#fff;min-width:130px;text-align:center;"></div>
        <button id="cal-next" class="btn-ghost" style="padding:6px 10px;font-size:1rem;line-height:1;">›</button>
      </div>
    </div>
    <div id="cal-grid"></div>

    <!-- Event modal (hidden) -->
    <div id="cal-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:200;align-items:center;justify-content:center;">
      <div style="background:var(--s1);border:1px solid rgba(227,151,3,0.2);border-radius:12px;padding:28px;width:100%;max-width:400px;margin:0 24px;max-height:90vh;overflow-y:auto;">
        <div id="cal-modal-date" style="font-size:0.75rem;color:var(--gold);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:4px;"></div>
        <div style="font-size:1.0625rem;font-weight:600;color:#fff;margin-bottom:16px;">Add Event</div>

        <!-- Quick booking -->
        <button id="cal-coaching-call-btn" style="width:100%;padding:11px 16px;margin-bottom:14px;border-radius:8px;border:1px solid rgba(227,151,3,0.5);background:linear-gradient(135deg,rgba(227,151,3,0.15) 0%,rgba(227,151,3,0.05) 100%);color:var(--gold);font-size:0.9375rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;letter-spacing:0.01em;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.28h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.89a16 16 0 0 0 6 6l1.27-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          Book Coaching Call with Carter
        </button>

        <div style="height:1px;background:rgba(255,255,255,0.06);margin-bottom:14px;"></div>

        <input id="cal-event-input" class="input" type="text" placeholder="Or type a custom event…" style="width:100%;margin-bottom:12px;" />
        <div style="margin-bottom:16px;">
          <div style="font-size:0.75rem;color:var(--text-muted);letter-spacing:0.05em;text-transform:uppercase;margin-bottom:8px;">Repeat</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;" id="cal-repeat-options">
            <button class="cal-repeat-btn" data-repeat="none"     style="padding:5px 12px;border-radius:20px;font-size:0.8125rem;border:1px solid rgba(227,151,3,0.4);background:rgba(227,151,3,0.15);color:var(--gold);cursor:pointer;">One-time</button>
            <button class="cal-repeat-btn" data-repeat="weekly"   style="padding:5px 12px;border-radius:20px;font-size:0.8125rem;border:1px solid rgba(255,255,255,0.1);background:transparent;color:var(--text-muted);cursor:pointer;">Weekly</button>
            <button class="cal-repeat-btn" data-repeat="biweekly" style="padding:5px 12px;border-radius:20px;font-size:0.8125rem;border:1px solid rgba(255,255,255,0.1);background:transparent;color:var(--text-muted);cursor:pointer;">Biweekly</button>
            <button class="cal-repeat-btn" data-repeat="monthly"  style="padding:5px 12px;border-radius:20px;font-size:0.8125rem;border:1px solid rgba(255,255,255,0.1);background:transparent;color:var(--text-muted);cursor:pointer;">Monthly</button>
          </div>
        </div>
        <div style="display:flex;gap:10px;">
          <button id="cal-modal-save" class="btn-gold" style="flex:1;">Save</button>
          <button id="cal-modal-cancel" class="btn-ghost" style="flex:1;">Cancel</button>
        </div>
        <div id="cal-modal-events" style="margin-top:18px;display:flex;flex-direction:column;gap:6px;"></div>
      </div>
    </div>
  </div>

</div>`;

    // ── Calendar (runs after DOM is injected) ───────────────────────────────────
    const shell = dashboardShell('dashboard', content);
    setTimeout(() => {
    const calKey = `rl_calendar_${user.id}`;
    function calLoad() { try { return JSON.parse(localStorage.getItem(calKey) || '{}'); } catch { return {}; } }
    function calSave(data) { localStorage.setItem(calKey, JSON.stringify(data)); }

    let calYear = new Date().getFullYear();
    let calMonth = new Date().getMonth();
    let calSelectedDate = null;
    let calSelectedRepeat = 'none';
    let calEvents = calLoad();
    if (!calEvents._recurring) calEvents._recurring = [];

    // drag state
    let dragSrcDate = null;
    let dragEvtIdx = null;

    const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const REPEAT_LABELS = { weekly: 'Weekly', biweekly: 'Biweekly', monthly: 'Monthly' };

    function getEventsForDate(dateStr) {
      const oneTime = calEvents[dateStr] || [];
      const recurring = (calEvents._recurring || []).filter(r => {
        const start = new Date(r.startDate + 'T00:00:00');
        const target = new Date(dateStr + 'T00:00:00');
        if (target < start) return false;
        const diffDays = Math.round((target - start) / 86400000);
        if (r.repeat === 'weekly')   return diffDays % 7 === 0;
        if (r.repeat === 'biweekly') return diffDays % 14 === 0;
        if (r.repeat === 'monthly')  return target.getDate() === new Date(r.startDate + 'T00:00:00').getDate();
        return false;
      }).map(r => ({ text: r.text, repeat: r.repeat, id: r.id }));
      return { oneTime, recurring };
    }

    function renderCalendar() {
      const label = document.getElementById('cal-month-label');
      const grid = document.getElementById('cal-grid');
      if (!label || !grid) return;

      label.textContent = `${MONTHS[calMonth]} ${calYear}`;
      const firstDay = new Date(calYear, calMonth, 1).getDay();
      const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
      const todayFull = today;

      let html = `<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:4px;">
        ${DAYS.map(d => `<div style="text-align:center;font-size:0.6875rem;color:var(--text-muted);letter-spacing:0.06em;text-transform:uppercase;padding:4px 0;">${d}</div>`).join('')}
      </div>
      <div id="cal-day-grid" style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;">`;

      for (let i = 0; i < firstDay; i++) html += `<div></div>`;

      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        const isToday = dateStr === todayFull;
        const { oneTime, recurring } = getEventsForDate(dateStr);
        const bg = isToday ? 'rgba(227,151,3,0.12)' : 'rgba(255,255,255,0.03)';
        html += `<div data-cal-date="${dateStr}" data-bg="${bg}" style="min-height:58px;padding:5px 6px;border-radius:6px;cursor:pointer;background:${bg};border:1px solid ${isToday?'rgba(227,151,3,0.4)':'rgba(255,255,255,0.06)'};position:relative;transition:background 0.1s;">
          <div style="font-size:0.8125rem;font-weight:${isToday?'700':'400'};color:${isToday?'var(--gold)':'var(--text-dim)'}; pointer-events:none;">${day}</div>`;

        // one-time events — draggable chips
        oneTime.forEach((text, idx) => {
          html += `<div draggable="true" data-drag-date="${dateStr}" data-drag-idx="${idx}" data-evt-chip="1"
            style="font-size:0.625rem;color:var(--gold);background:rgba(227,151,3,0.15);border-radius:3px;padding:2px 5px;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:grab;"
            title="${text}">${text}</div>`;
        });

        // recurring events — not draggable
        recurring.slice(0, Math.max(0, 3 - oneTime.length)).forEach(r => {
          html += `<div data-evt-chip="1" style="font-size:0.625rem;color:#a78bfa;background:rgba(167,139,250,0.12);border-radius:3px;padding:2px 5px;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="↻ ${r.text}">${r.text}</div>`;
        });

        const totalVisible = oneTime.length + Math.min(recurring.length, Math.max(0, 3 - oneTime.length));
        const totalAll = oneTime.length + recurring.length;
        if (totalAll > totalVisible) {
          html += `<div style="font-size:0.625rem;color:var(--text-muted);margin-top:1px;pointer-events:none;">+${totalAll - totalVisible} more</div>`;
        }

        html += `</div>`;
      }
      html += `</div></div>`;
      grid.innerHTML = html;

      // ── Wire day cells: click to open modal, drag-over to highlight ──
      grid.querySelectorAll('[data-cal-date]').forEach(cell => {
        const dateStr = cell.dataset.calDate;
        const origBg = cell.dataset.bg;

        cell.addEventListener('click', e => {
          if (e.target.dataset.dragDate) return; // chip click — handled by chip
          openCalModal(dateStr);
        });

        // drop target
        cell.addEventListener('dragover', e => {
          if (dragSrcDate === null) return;
          e.preventDefault();
          cell.style.background = 'rgba(227,151,3,0.18)';
          cell.style.borderColor = 'rgba(227,151,3,0.6)';
        });
        cell.addEventListener('dragleave', () => {
          cell.style.background = origBg;
          cell.style.borderColor = dateStr === today ? 'rgba(227,151,3,0.4)' : 'rgba(255,255,255,0.06)';
        });
        cell.addEventListener('drop', e => {
          e.preventDefault();
          cell.style.background = origBg;
          cell.style.borderColor = dateStr === today ? 'rgba(227,151,3,0.4)' : 'rgba(255,255,255,0.06)';
          if (dragSrcDate === null || dragEvtIdx === null || dragSrcDate === dateStr) return;
          const evts = calEvents[dragSrcDate] || [];
          const [moved] = evts.splice(dragEvtIdx, 1);
          if (evts.length === 0) delete calEvents[dragSrcDate]; else calEvents[dragSrcDate] = evts;
          if (!calEvents[dateStr]) calEvents[dateStr] = [];
          calEvents[dateStr].push(moved);
          calSave(calEvents);
          dragSrcDate = null; dragEvtIdx = null;
          renderCalendar();
        });
      });

      // ── Wire draggable chips ──
      grid.querySelectorAll('[data-drag-date]').forEach(chip => {
        chip.addEventListener('dragstart', e => {
          dragSrcDate = chip.dataset.dragDate;
          dragEvtIdx = parseInt(chip.dataset.dragIdx);
          e.stopPropagation();
          chip.style.opacity = '0.4';
        });
        chip.addEventListener('dragend', () => { chip.style.opacity = '1'; });
        chip.addEventListener('click', e => {
          e.stopPropagation();
          openCalModal(chip.dataset.dragDate);
        });
      });
    }

    function setRepeat(val) {
      calSelectedRepeat = val;
      document.querySelectorAll('.cal-repeat-btn').forEach(btn => {
        const active = btn.dataset.repeat === val;
        btn.style.background  = active ? 'rgba(227,151,3,0.15)' : 'transparent';
        btn.style.borderColor = active ? 'rgba(227,151,3,0.4)'  : 'rgba(255,255,255,0.1)';
        btn.style.color       = active ? 'var(--gold)'           : 'var(--text-muted)';
      });
    }

    function openCalModal(dateStr) {
      calSelectedDate = dateStr;
      const modal = document.getElementById('cal-modal');
      if (!modal) return;
      const [y, m, d] = dateStr.split('-');
      document.getElementById('cal-modal-date').textContent = `${MONTHS[parseInt(m)-1]} ${parseInt(d)}, ${y}`;
      document.getElementById('cal-event-input').value = '';
      setRepeat('none');
      renderModalEvents(dateStr);
      modal.style.display = 'flex';
      setTimeout(() => document.getElementById('cal-event-input')?.focus(), 50);
    }

    function renderModalEvents(dateStr) {
      const container = document.getElementById('cal-modal-events');
      if (!container) return;
      const { oneTime, recurring } = getEventsForDate(dateStr);
      if (oneTime.length === 0 && recurring.length === 0) { container.innerHTML = ''; return; }

      container.innerHTML = `<div style="height:1px;background:rgba(255,255,255,0.06);margin-bottom:10px;"></div>
        <div style="font-size:0.75rem;color:var(--text-muted);letter-spacing:0.04em;text-transform:uppercase;margin-bottom:8px;">Events on this day</div>`;

      oneTime.forEach((text, i) => {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 10px;background:rgba(255,255,255,0.04);border-radius:6px;margin-bottom:5px;';
        row.innerHTML = `<div style="font-size:0.875rem;color:var(--text-dim);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${text}</div>
          <div style="font-size:0.6875rem;color:var(--text-muted);flex-shrink:0;">drag to move</div>
          <button style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:1.125rem;padding:0 4px;line-height:1;flex-shrink:0;">×</button>`;
        row.querySelector('button').addEventListener('click', () => {
          calEvents[dateStr].splice(i, 1);
          if (calEvents[dateStr].length === 0) delete calEvents[dateStr];
          calSave(calEvents); renderCalendar(); renderModalEvents(dateStr);
        });
        container.appendChild(row);
      });

      recurring.forEach(r => {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 10px;background:rgba(167,139,250,0.06);border:1px solid rgba(167,139,250,0.15);border-radius:6px;margin-bottom:5px;';
        row.innerHTML = `<div style="flex:1;min-width:0;">
            <div style="font-size:0.875rem;color:var(--text-dim);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${r.text}</div>
            <div style="font-size:0.6875rem;color:#a78bfa;margin-top:2px;">↻ ${REPEAT_LABELS[r.repeat]} series</div>
          </div>
          <button style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:1.125rem;padding:0 4px;line-height:1;flex-shrink:0;">×</button>`;
        row.querySelector('button').addEventListener('click', () => {
          calEvents._recurring = calEvents._recurring.filter(x => x.id !== r.id);
          calSave(calEvents); renderCalendar(); renderModalEvents(dateStr);
        });
        container.appendChild(row);
      });
    }

    function addEvent(text, repeat) {
      if (!text || !calSelectedDate) return;
      if (repeat === 'none') {
        if (!calEvents[calSelectedDate]) calEvents[calSelectedDate] = [];
        calEvents[calSelectedDate].push(text);
      } else {
        const id = `rec_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
        calEvents._recurring.push({ id, text, startDate: calSelectedDate, repeat });
      }
      calSave(calEvents);
      renderCalendar();
      renderModalEvents(calSelectedDate);
    }

    function saveCalEvent() {
      const input = document.getElementById('cal-event-input');
      const text = input?.value?.trim();
      if (!text) return;
      addEvent(text, calSelectedRepeat);
      input.value = '';
      setRepeat('none');
    }

    // Coaching call quick-book
    document.getElementById('cal-coaching-call-btn')?.addEventListener('click', () => {
      addEvent('Coaching Call with Carter', calSelectedRepeat);
    });

    document.getElementById('cal-repeat-options')?.addEventListener('click', e => {
      const btn = e.target.closest('.cal-repeat-btn');
      if (btn) setRepeat(btn.dataset.repeat);
    });
    document.getElementById('cal-prev')?.addEventListener('click', () => {
      calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderCalendar();
    });
    document.getElementById('cal-next')?.addEventListener('click', () => {
      calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderCalendar();
    });
    document.getElementById('cal-modal-save')?.addEventListener('click', saveCalEvent);
    document.getElementById('cal-event-input')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') saveCalEvent();
    });
    document.getElementById('cal-modal-cancel')?.addEventListener('click', () => {
      document.getElementById('cal-modal').style.display = 'none';
    });
    document.getElementById('cal-modal')?.addEventListener('click', e => {
      if (e.target === document.getElementById('cal-modal')) document.getElementById('cal-modal').style.display = 'none';
    });

    renderCalendar();
    }, 50);

    return shell;
  });

  window.dashboardShell = dashboardShell;

  // ── Avatar upload — wired after every shell render ───────────────────────────
  window.initAvatarUpload = function() {
    const input = document.getElementById('avatar-file-input');
    const avatar = document.getElementById('sidebar-avatar');
    if (!input || !avatar) return;
    avatar.addEventListener('dblclick', () => input.click());
    input.addEventListener('change', e => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const dataUrl = ev.target.result;
        const userId = APP.STATE.currentUser?.id;
        if (!userId) return;
        DB.saveAvatar(userId, dataUrl);
        avatar.innerHTML = `<img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover;" />`;
      };
      reader.readAsDataURL(file);
    });
  };
})();
