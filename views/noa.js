// ─── NoaAI Page ───────────────────────────────────────────────────────────────
(function() {
  APP.register('noa', () => {
    const content = `
<div style="max-width:860px;margin:0 auto;padding:40px 24px;">

  <!-- Header -->
  <div class="fade-in" style="margin-bottom:48px;">
    <div class="label" style="margin-bottom:8px;">Your AI Guide</div>
    <div style="font-size:1.875rem;font-weight:700;letter-spacing:-0.02em;">Meet NoaAI.</div>
  </div>

  <!-- Hero card -->
  <div class="fade-in-delay-1" style="margin-bottom:24px;position:relative;overflow:hidden;border-radius:12px;border:1px solid rgba(227,151,3,0.2);background:linear-gradient(135deg,#0A0A0A 0%,rgba(227,151,3,0.05) 100%);">

    <!-- Background glow -->
    <div style="position:absolute;top:-80px;right:-80px;width:400px;height:400px;background:radial-gradient(circle,rgba(227,151,3,0.07) 0%,transparent 65%);pointer-events:none;"></div>

    <div style="display:flex;align-items:center;gap:36px;padding:40px;flex-wrap:wrap;">
      <!-- Photo -->
      <div style="flex-shrink:0;">
        <div style="width:160px;height:160px;border-radius:50%;overflow:hidden;border:2px solid var(--gold-line);box-shadow:0 0 40px rgba(227,151,3,0.15);">
          <img src="NoaAIandLogo.png" style="width:100%;height:100%;object-fit:cover;object-position:center 10%;" />
        </div>
        <div style="text-align:center;margin-top:14px;">
          <div style="font-size:1.125rem;font-weight:700;color:#fff;">NoaAI</div>
          <div style="font-size:0.8125rem;color:var(--gold);margin-top:2px;">AI Assistant</div>
          <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">The Reality Labs</div>
        </div>
      </div>

      <!-- Intro text -->
      <div style="flex:1;min-width:260px;">
        <div style="font-size:1.5rem;font-weight:700;color:#fff;line-height:1.3;margin-bottom:16px;letter-spacing:-0.01em;">
          "I'm here to make sure you<br/>get the most out of this."
        </div>
        <div class="gold-line" style="width:60px;margin-bottom:20px;"></div>
        <p style="font-size:0.9375rem;color:var(--text-dim);line-height:1.75;margin-bottom:14px;">
          I was built specifically for The Reality Labs, to work alongside Carter and support every client who comes through this program.
        </p>
        <p style="font-size:0.9375rem;color:var(--text-dim);line-height:1.75;">
          Think of me as the constant in your coaching experience. Carter does the deep work with you. I make sure the space between sessions is just as powerful.
        </p>
      </div>
    </div>
  </div>

  <!-- What NoaAI does -->
  <div class="fade-in-delay-2" style="margin-bottom:24px;">
    <div class="label" style="margin-bottom:16px;">What I Do</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px;">
      ${[
        {
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
          title: 'Opening Interview',
          desc: 'I conduct your onboarding interview, asking the real questions so Carter understands exactly who you are and what you\'re working through before your first session.',
        },
        {
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
          title: 'Daily Check-Ins',
          desc: 'After every check-in, I write you a personalized reflection, not a generic response, but something specific to what you shared that day and where you\'re at in your journey.',
        },
        {
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
          title: 'Journal Prompts',
          desc: 'When you open prompted journal mode, I generate a question aimed directly at your subconscious blocks and identity, not a generic writing prompt.',
        },
        {
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>',
          title: 'Dashboard Intelligence',
          desc: 'Everything in your dashboard, your exercises, your vision, your reminders, is shaped by what I learned about you in your interview. Nothing here is generic.',
        },
        {
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
          title: 'Progress Tracking',
          desc: 'I track your alignment scores, streaks, and patterns over time, so Carter can see exactly where momentum is building and where the real work still needs to happen.',
        },
        {
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
          title: 'Carter\'s Right Hand',
          desc: 'Carter built The Reality Labs around a very specific framework. I was trained on that framework, so everything I do reflects his voice, his method, and his standards.',
        },
      ].map(item => `
      <div class="card" style="padding:22px;">
        <div style="width:38px;height:38px;border-radius:8px;background:var(--gold-dim);border:1px solid var(--gold-line);display:flex;align-items:center;justify-content:center;color:var(--gold);margin-bottom:14px;">
          ${item.icon}
        </div>
        <div style="font-size:0.9375rem;font-weight:600;color:#fff;margin-bottom:8px;">${item.title}</div>
        <div style="font-size:0.875rem;color:var(--text-muted);line-height:1.6;">${item.desc}</div>
      </div>`).join('')}
    </div>
  </div>

  <!-- Philosophy -->
  <div class="fade-in-delay-3" style="margin-bottom:24px;">
    <div class="card" style="padding:32px;border-color:rgba(227,151,3,0.2);background:linear-gradient(135deg,var(--s1) 0%,rgba(227,151,3,0.03) 100%);">
      <div class="label" style="margin-bottom:14px;">How I Work</div>
      <div style="font-size:1.0625rem;color:var(--text-dim);line-height:1.8;margin-bottom:16px;">
        I don't do generic. I don't do toxic positivity. I don't tell you you're doing great when what you need is a harder question.
      </div>
      <div style="font-size:1.0625rem;color:var(--text-dim);line-height:1.8;margin-bottom:16px;">
        Carter's framework is built on one idea: your external reality is a reflection of your subconscious identity. Every question I ask, every reflection I write, every prompt I generate, it's pointed at that. Not your behavior. Not your strategy. Your identity.
      </div>
      <div style="font-size:1.0625rem;color:var(--text-dim);line-height:1.8;">
        I'm direct because vague doesn't move the needle. I'm warm because this work takes real courage. And I'm consistent, because transformation happens in the daily practice, not just the big sessions.
      </div>
      <div style="margin-top:24px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.06);">
        <div style="font-size:0.9375rem;color:var(--gold);font-style:italic;">"Your reality responds to your subconscious. My job is to help you understand what yours is saying."</div>
        <div style="font-size:0.8125rem;color:var(--text-muted);margin-top:6px;">NoaAI</div>
      </div>
    </div>
  </div>

  <!-- Built by -->
  <div style="padding:20px 24px;background:var(--s1);border:1px solid rgba(255,255,255,0.06);border-radius:8px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
    <img src="TRLLogomain.png" style="width:32px;height:32px;opacity:0.8;flex-shrink:0;" />
    <div style="font-size:0.875rem;color:var(--text-muted);line-height:1.6;">
      NoaAI is powered by Claude AI and built exclusively for The Reality Labs Coaching platform. She operates under Carter Dombeck's framework and is not a general-purpose AI tool.
    </div>
  </div>

</div>`;

    return window.dashboardShell('noa', content);
  });
})();
