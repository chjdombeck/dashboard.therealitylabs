// ─── Unified Feed (Client View) ───────────────────────────────────────────────
(function() {

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

  function typeConfig(type) {
    const map = {
      exercise_complete:       { icon: '💪', label: 'Completed an exercise',  color: '#a78bfa' },
      checkin_streak:          { icon: '🔥', label: 'Streak milestone',        color: 'var(--gold)' },
      coach_post:              { icon: '📣', label: 'Coaching update',         color: 'var(--gold)' },
      coach_assigned_exercise: { icon: '📋', label: 'Assigned an exercise',    color: '#60a5fa' },
      coach_feedback:          { icon: '✏️', label: 'Gave feedback',           color: '#4ade80' },
    };
    return map[type] || { icon: '⭐', label: type, color: '#fff' };
  }

  function renderCard(item, currentUserId, reactionsMap) {
    const cfg = typeConfig(item.type);
    const p = item.profiles || {};
    const isCoach = p.role === 'admin' || ['coach_post','coach_assigned_exercise','coach_feedback'].includes(item.type);
    const displayName = isCoach ? 'Carter · Coach' : (p.first_name ? `${p.first_name} ${p.last_name||''}`.trim() : 'Client');
    const isOwnActivity = item.user_id === currentUserId;

    const av = DB.getAvatar(item.user_id);
    const ini = isCoach ? 'CD' : `${p.first_name?.[0]||''}${p.last_name?.[0]||''}`.toUpperCase() || '?';
    const borderColor = isCoach ? 'rgba(227,151,3,0.5)' : 'rgba(227,151,3,0.25)';

    const rx = reactionsMap[item.id] || {};
    const hasReaction = rx.liked || rx.comment;

    return `
<div class="card" style="padding:20px;margin-bottom:14px;">
  <div style="display:flex;align-items:flex-start;gap:14px;">
    <div style="width:42px;height:42px;border-radius:50%;overflow:hidden;border:2px solid ${borderColor};background:rgba(227,151,3,0.1);display:flex;align-items:center;justify-content:center;font-size:0.875rem;font-weight:700;color:var(--gold);flex-shrink:0;">
      ${av ? `<img src="${av}" style="width:100%;height:100%;object-fit:cover;"/>` : ini}
    </div>
    <div style="flex:1;min-width:0;">
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;margin-bottom:3px;flex-wrap:wrap;">
        <span style="font-size:0.9375rem;font-weight:600;color:#fff;">${displayName}</span>
        <span style="font-size:0.75rem;color:var(--text-muted);white-space:nowrap;">${formatPostDate(item.created_at)}</span>
      </div>
      <div style="font-size:0.8125rem;color:${cfg.color};margin-bottom:10px;">${cfg.icon} ${cfg.label}</div>
      <div style="font-size:0.9375rem;color:var(--text-dim);line-height:1.6;">${item.title}</div>
      ${isOwnActivity && hasReaction ? `
      <div style="margin-top:14px;padding:12px 14px;background:rgba(227,151,3,0.07);border:1px solid rgba(227,151,3,0.2);border-radius:8px;">
        <div style="font-size:0.75rem;color:var(--gold);font-weight:600;margin-bottom:${rx.comment?'8px':'0'};">Carter reacted ${rx.liked?'👍':''}</div>
        ${rx.comment ? `<div style="font-size:0.875rem;color:var(--text-dim);line-height:1.5;font-style:italic;">"${rx.comment}"</div>` : ''}
      </div>` : ''}
    </div>
  </div>
</div>`;
  }

  APP.register('client-feed', async () => {
    APP.showLoading();
    const user = APP.STATE.currentUser;

    let items = [];
    try { items = await DB.getUnifiedFeed(80); } catch(e) {}

    let reactionsMap = {};
    try {
      const myIds = items.filter(a => a.user_id === user.id).map(a => a.id);
      if (myIds.length) reactionsMap = await DB.getReactions(myIds);
    } catch(e) {}

    // Mark seen
    localStorage.setItem(`rl_feed_seen_${user.id}`, new Date().toISOString());

    const content = `
<div style="max-width:660px;margin:0 auto;padding:32px 24px;">
  <div class="fade-in" style="margin-bottom:32px;">
    <div class="label" style="margin-bottom:8px;">Team</div>
    <div style="font-size:1.875rem;font-weight:700;letter-spacing:-0.02em;">Feed</div>
    <div style="font-size:0.9375rem;color:var(--text-muted);margin-top:6px;">Everything happening across your coaching program.</div>
  </div>
  ${items.length === 0
    ? `<div class="card" style="padding:40px;text-align:center;">
         <div style="font-size:2rem;margin-bottom:12px;">👋</div>
         <div style="font-size:0.9375rem;color:var(--text-muted);">The feed is empty. Complete exercises and check-ins to start building your story.</div>
       </div>`
    : items.map(a => renderCard(a, user.id, reactionsMap)).join('')}
</div>`;

    return window.dashboardShell('client-feed', content);
  });
})();
