APP.register('login', () => `
<div style="min-height:100vh;background:#000;display:flex;align-items:center;justify-content:center;padding:24px;position:relative;overflow:hidden;">
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:600px;background:radial-gradient(circle,rgba(227,151,3,0.06) 0%,transparent 70%);pointer-events:none;"></div>
  <div class="fade-in" style="width:100%;max-width:420px;">
    <div style="text-align:center;margin-bottom:48px;">
      <img src="RealityLabsLogo.png" style="width:220px;mix-blend-mode:lighten;margin:0 auto 8px;display:block;" />
    </div>
    <div class="card" style="padding:36px;">
      <div style="margin-bottom:28px;text-align:center;">
        <div style="font-size:1.125rem;font-weight:600;color:#fff;margin-bottom:6px;">Sign In</div>
        <div style="font-size:0.8125rem;color:var(--text-muted);letter-spacing:0.04em;text-transform:uppercase;">The Reality Labs Coaching Dashboard</div>
      </div>
      <div id="login-error" style="display:none;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:6px;padding:10px 14px;font-size:0.875rem;color:#f87171;margin-bottom:20px;"></div>
      <form id="login-form" style="display:flex;flex-direction:column;gap:16px;">
        <div>
          <label class="label" style="display:block;margin-bottom:8px;">Username</label>
          <input class="input" type="text" id="login-email" placeholder="Enter your username" autocomplete="username" />
        </div>
        <div>
          <label class="label" style="display:block;margin-bottom:8px;">Password</label>
          <input class="input" type="password" id="login-password" placeholder="Enter your password" autocomplete="current-password" />
        </div>
        <button type="submit" class="btn-gold" style="width:100%;justify-content:center;margin-top:8px;" id="login-btn">
          Sign In
        </button>
      </form>
    </div>
    <div style="text-align:center;margin-top:24px;color:var(--text-muted);font-size:0.8125rem;">
      Your access is provided by your coach.
    </div>
    <div style="text-align:center;margin-top:40px;font-size:0.8125rem;color:rgba(227,151,3,0.5);font-style:italic;letter-spacing:0.02em;">
      "${APP.getDailyLine()}"
    </div>
  </div>
</div>
`);

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('app').addEventListener('submit', async e => {
    if (e.target.id !== 'login-form') return;
    e.preventDefault();
    const email = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value;
    const btn = document.getElementById('login-btn');
    const err = document.getElementById('login-error');
    if (!email || !password) return;

    btn.textContent = 'Signing in...';
    btn.disabled = true;
    err.style.display = 'none';

    try {
      const user = await APP.login(email, password);
      if (user.role === 'admin') APP.navigate('admin-dashboard');
      else if (!user.interview_completed) APP.navigate('interview');
      else APP.navigate('dashboard');
    } catch (error) {
      err.textContent = 'Invalid email or password. Please try again.';
      err.style.display = 'block';
      btn.textContent = 'Sign In';
      btn.disabled = false;
    }
  });
});
