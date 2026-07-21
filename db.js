// ─── Database Layer, all Supabase operations ────────────────────────────────
// Replaces all localStorage calls. Every function is async.

// In-memory cache so the synchronous getAvatar() can serve avatar_url values
// that were already fetched as part of a profile row (see getProfile/getAllClients).
const AVATAR_CACHE = {};

const DB = {

  // ─── Auth ──────────────────────────────────────────────────────────────────

  // Convert a username to the internal system email Supabase uses
  usernameToEmail(username) {
    return `client+${username.toLowerCase().trim()}@therealitylabs.com`;
  },

  async login(username, password) {
    // ── Demo accounts for local testing (bypasses Supabase) ──
    const DEMO_USERS = [
      { id: 'demo-client-1', role: 'client', username: 'john', password: 'john2024', first_name: 'John', last_name: 'Smith', is_active: true, interview_completed: true, interview_completed_at: '2024-01-01' },
    ];
    const demo = DEMO_USERS.find(u => u.username === username.toLowerCase() && u.password === password);
    if (demo) {
      const { password: _, ...safeUser } = demo;
      localStorage.setItem('rl_demo_session', JSON.stringify(safeUser));
      DB.seedDemoData(safeUser);
      // Always ensure John's data exists for admin view
      DB.seedDemoData({ id: 'demo-client-1', role: 'client', first_name: 'John', last_name: 'Smith' });
      return safeUser;
    }
    // ── Live Supabase auth ──
    const email = DB.usernameToEmail(username);
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const profile = await DB.getProfile(data.user.id);
    return { ...data.user, ...profile };
  },

  async logout() {
    localStorage.removeItem('rl_demo_session');
    await sb.auth.signOut();
  },

  async getSession() {
    // Check for demo session first
    try {
      const demo = JSON.parse(localStorage.getItem('rl_demo_session') || 'null');
      if (demo) return demo;
    } catch {}
    // Live Supabase session
    const { data } = await sb.auth.getSession();
    if (!data.session) return null;
    const profile = await DB.getProfile(data.session.user.id);
    if (!profile) return null;
    return { ...data.session.user, ...profile };
  },

  // ─── Demo mode helpers ─────────────────────────────────────────────────────
  isDemoUser(userId) { return userId?.startsWith('demo-'); },
  demoGet(key) { try { return JSON.parse(localStorage.getItem(`rl_demo_${key}`) || '[]'); } catch { return []; } },
  demoSet(key, val) { localStorage.setItem(`rl_demo_${key}`, JSON.stringify(val)); },

  seedDemoData(user) {
    if (user.role !== 'client') return;
    const uid = user.id;

    // Only seed once
    if (localStorage.getItem(`rl_demo_seeded_${uid}`)) return;

    // Client profile
    localStorage.setItem(`rl_demo_profile_${uid}`, JSON.stringify({
      user_id: uid,
      desired_reality: 'Running a 6-figure coaching business with complete time freedom, working with clients I love, from anywhere in the world.',
      current_reality: 'Generating inconsistent revenue, struggling to sign clients consistently, feeling stuck despite doing all the right things externally.',
      core_beliefs: ['I have to work hard for everything', 'Success takes longer for me than others'],
      blocks: ['Self-doubt before sales calls', 'Imposter syndrome', 'Procrastination on visibility'],
      identity: 'An entrepreneur who operates from aligned identity rather than fear or strategy alone.',
      values: ['Freedom', 'Impact', 'Authenticity', 'Growth', 'Abundance'],
      why: 'To prove to myself that my results are not fixed, and to build the life I know is possible.',
      key_language: ['freedom', 'aligned', 'identity', 'reality', 'blocks'],
    }));

    // Vision board
    localStorage.setItem(`rl_demo_vision_${uid}`, JSON.stringify({
      user_id: uid,
      vision_statement: 'I am living and working from complete freedom. My business generates consistent $20K months. I work with clients who are all-in, I set my own schedule, and I wake up every day knowing exactly who I am and what I\'m building.',
      core_desires: ['Financial freedom, $20K/month minimum', 'Location independence', 'Deep, meaningful client relationships', 'A brand that reflects who I truly am'],
      identity_statements: ['I am the kind of person who signs clients from a place of confidence.', 'I am the kind of person who shows up consistently.', 'I am the kind of person who leads from identity, not fear.', 'I am the kind of person who builds what they envision.'],
      values: ['Freedom', 'Impact', 'Authenticity', 'Growth', 'Abundance'],
      why: 'Because I know what\'s possible, and settling for less is no longer an option.',
      board_images: [],
    }));

    // Exercises
    const today = new Date();
    localStorage.setItem(`rl_demo_exercises_${uid}`, JSON.stringify([
      { id: 'dce-1', user_id: uid, exercise_id: 'ex-1', status: 'assigned', response: '', assigned_at: new Date(today - 2*86400000).toISOString(), completed_at: null, assigned_by: 'demo-admin-1' },
      { id: 'dce-2', user_id: uid, exercise_id: 'ex-2', status: 'assigned', response: '', assigned_at: new Date(today - 1*86400000).toISOString(), completed_at: null, assigned_by: 'demo-admin-1' },
      { id: 'dce-3', user_id: uid, exercise_id: 'ex-4', status: 'completed', response: 'Writing this letter cracked something open. My future self is calm, certain, and unapologetic about what they want. That calmness, I need to bring that into today.', assigned_at: new Date(today - 5*86400000).toISOString(), completed_at: new Date(today - 3*86400000).toISOString(), assigned_by: 'demo-admin-1' },
    ]));

    // Check-ins (last 5 days)
    const checkins = [];
    const scores = [6, 7, 6, 8, 7];
    for (let i = 4; i >= 0; i--) {
      const d = new Date(today); d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      checkins.push({ id: `dci-${i}`, user_id: uid, date: ds, alignment_score: scores[4-i], gratitude: 'My clarity and my commitment to this process.', supporting_belief: 'I am becoming who I need to be.', limiting_belief: 'I\'m not moving fast enough.', today_action: 'Send outreach to 3 ideal clients.', energy_score: 7, focus_score: 6, emotional_score: 8, ai_reflection: 'The belief that you\'re not moving fast enough is a timing story, and timing stories are identity stories. Your future self didn\'t get there faster. They just stopped measuring themselves against someone else\'s clock.', created_at: d.toISOString() });
    }
    DB.demoSet(`checkins_${uid}`, checkins);

    // Journal entries
    DB.demoSet(`journal_${uid}`, [
      { id: 'dj-1', user_id: uid, date: new Date(today - 86400000).toISOString().split('T')[0], mode: 'scripting', prompt: null, content: 'It\'s two years from now. I just got off a call with my 8th client this month. My calendar is full, not because I chased anyone, but because my identity radiates what I stand for. I work from my home office in the morning and spend my afternoons doing whatever I want. Money is not a source of stress. It flows in consistently because I show up as the version of me who creates results.', word_count: 82, tags: ['Scripting', 'Vision'], coach_access_enabled: false, created_at: new Date(today - 86400000).toISOString(), updated_at: new Date(today - 86400000).toISOString() },
      { id: 'dj-2', user_id: uid, date: new Date(today - 3*86400000).toISOString().split('T')[0], mode: 'prompted', prompt: 'What pattern keeps showing up in your business? What belief is underneath it?', content: 'The pattern is avoidance right before I need to be visible. I delay posting, delay reaching out, delay showing up fully. The belief underneath it is: "If I fully show up and it still doesn\'t work, I\'ll have no excuses left." Avoidance is protection. The identity that produces this behavior is someone who is afraid of finding out who they really are when there\'s nothing left to hide behind.', word_count: 78, tags: ['Shadow Work', 'Breakthrough'], coach_access_enabled: true, created_at: new Date(today - 3*86400000).toISOString(), updated_at: new Date(today - 3*86400000).toISOString() },
    ]);

    // Homework
    DB.demoSet(`homework_${uid}`, [
      { id: 'dhw-1', user_id: uid, title: 'Write Your Identity Declaration', description: 'Write 20 "I am the kind of person who..." statements from your future identity. Read them aloud every morning for 7 days. Report back on what shifts.', due_date: new Date(today.getTime() + 5*86400000).toISOString().split('T')[0], type: 'Exercise', status: 'pending', submission_text: null, coach_feedback: null, assigned_by: 'demo-admin-1', created_at: new Date(today - 86400000).toISOString(), submitted_at: null, reviewed_at: null },
      { id: 'dhw-2', user_id: uid, title: 'Read: The Gap vs. The Gain', description: 'Read the first 3 chapters and write a 1-paragraph reflection on how the concept applies to where you are right now in your business.', due_date: new Date(today.getTime() + 3*86400000).toISOString().split('T')[0], type: 'Reading', status: 'in_progress', submission_text: 'I\'m halfway through chapter 2. The idea that we measure ourselves against an ideal rather than our progress is exactly what I\'ve been doing. More to come.', coach_feedback: null, assigned_by: 'demo-admin-1', created_at: new Date(today - 2*86400000).toISOString(), submitted_at: null, reviewed_at: null },
    ]);

    localStorage.setItem(`rl_demo_seeded_${uid}`, '1');
  },

  // ─── Profiles ──────────────────────────────────────────────────────────────

  async getProfile(userId) {
    // Demo user lookup
    const DEMO_PROFILES = {
      'demo-admin-1': { id: 'demo-admin-1', role: 'admin', username: 'carter', first_name: 'Carter', last_name: 'Dombeck', is_active: true, interview_completed: true, interview_completed_at: '2024-01-01', created_at: '2024-01-01' },
      'demo-client-1': { id: 'demo-client-1', role: 'client', username: 'john', first_name: 'John', last_name: 'Smith', is_active: true, interview_completed: true, interview_completed_at: '2024-01-01', created_at: '2024-01-01' },
    };
    if (DEMO_PROFILES[userId]) return DEMO_PROFILES[userId];
    const { data, error } = await sb
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) return null;
    if (data) AVATAR_CACHE[data.id] = data.avatar_url || null;
    return data;
  },

  async getAllClients() {
    // Always include demo clients
    const demoClients = [
      { id: 'demo-client-1', role: 'client', username: 'john', first_name: 'John', last_name: 'Smith', is_active: true, interview_completed: true, interview_completed_at: '2024-01-01', created_at: '2024-01-01' },
    ];
    const { data, error } = await sb
      .from('profiles')
      .select('*')
      .eq('role', 'client')
      .order('created_at', { ascending: false });
    const liveClients = (!error && data) ? data : [];
    liveClients.forEach(c => { AVATAR_CACHE[c.id] = c.avatar_url || null; });
    // Merge, live clients take precedence, demo fills the rest
    const liveIds = liveClients.map(c => c.id);
    const merged = [...liveClients, ...demoClients.filter(d => !liveIds.includes(d.id))];
    return merged;
  },

  async createClient({ firstName, lastName, username, password }) {
    // Generate a hidden system email from username, clients never see or use this
    const email = DB.usernameToEmail(username);
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName, role: 'client', username }
      }
    });
    if (error) throw error;
    // Store username in profile
    if (data.user) {
      await sb.from('profiles').update({ username }).eq('id', data.user.id);
    }
    return data.user;
  },

  async updateProfile(userId, updates) {
    const { error } = await sb
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    if (error) throw error;
  },

  async deactivateClient(userId) {
    return DB.updateProfile(userId, { is_active: false });
  },

  async activateClient(userId) {
    return DB.updateProfile(userId, { is_active: true });
  },

  // ─── Client Profile (from interview) ──────────────────────────────────────

  async getClientProfile(userId) {
    if (DB.isDemoUser(userId)) { try { return JSON.parse(localStorage.getItem(`rl_demo_profile_${userId}`) || 'null'); } catch { return null; } }
    const { data } = await sb.from('client_profiles').select('*').eq('user_id', userId).maybeSingle();
    return data;
  },

  async saveClientProfile(userId, profile) {
    if (DB.isDemoUser(userId)) {
      localStorage.setItem(`rl_demo_profile_${userId}`, JSON.stringify({ user_id: userId, ...profile, updated_at: new Date().toISOString() }));
      return;
    }
    const { error } = await sb
      .from('client_profiles')
      .upsert({ user_id: userId, ...profile, updated_at: new Date().toISOString() });
    if (error) throw error;
  },

  // ─── Interview Transcript ──────────────────────────────────────────────────

  async saveTranscript(userId, messages) {
    if (DB.isDemoUser(userId)) {
      localStorage.setItem(`rl_demo_transcript_${userId}`, JSON.stringify(messages));
      return;
    }
    const { error } = await sb
      .from('interview_transcripts')
      .upsert({ user_id: userId, messages, updated_at: new Date().toISOString() });
    if (error) throw error;
  },

  async getTranscript(userId) {
    if (DB.isDemoUser(userId)) {
      try { return JSON.parse(localStorage.getItem(`rl_demo_transcript_${userId}`) || '[]'); } catch { return []; }
    }
    const { data } = await sb
      .from('interview_transcripts')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    return data?.messages || [];
  },

  async markInterviewComplete(userId) {
    if (DB.isDemoUser(userId)) {
      try {
        const user = JSON.parse(localStorage.getItem(`rl_demo_user_${userId}`) || 'null');
        if (user) { user.interview_completed = true; localStorage.setItem(`rl_demo_user_${userId}`, JSON.stringify(user)); }
        // Also patch the current session state
        if (APP.STATE.currentUser?.id === userId) APP.STATE.currentUser.interview_completed = true;
      } catch {}
      return;
    }
    const { error } = await sb
      .from('profiles')
      .update({ interview_completed: true, interview_completed_at: new Date().toISOString() })
      .eq('id', userId);
    if (error) throw error;
  },

  // ─── Check-Ins ─────────────────────────────────────────────────────────────

  async getCheckIns(userId) {
    if (DB.isDemoUser(userId)) return DB.demoGet(`checkins_${userId}`);
    const { data } = await sb.from('check_ins').select('*').eq('user_id', userId).order('date', { ascending: false });
    return data || [];
  },

  async saveCheckIn(checkIn) {
    if (DB.isDemoUser(checkIn.userId)) {
      const all = DB.demoGet(`checkins_${checkIn.userId}`);
      const entry = { id: `ci-${Date.now()}`, user_id: checkIn.userId, date: checkIn.date, alignment_score: checkIn.alignmentScore, gratitude: checkIn.gratitude, supporting_belief: checkIn.supportingBelief, limiting_belief: checkIn.limitingBelief, today_action: checkIn.todayAction, energy_score: checkIn.energyScore, focus_score: checkIn.focusScore, emotional_score: checkIn.emotionalScore, ai_reflection: null, created_at: new Date().toISOString() };
      all.unshift(entry);
      DB.demoSet(`checkins_${checkIn.userId}`, all);
      return entry;
    }
    const { data, error } = await sb
      .from('check_ins')
      .upsert({
        user_id: checkIn.userId,
        date: checkIn.date,
        alignment_score: checkIn.alignmentScore,
        gratitude: checkIn.gratitude,
        supporting_belief: checkIn.supportingBelief,
        limiting_belief: checkIn.limitingBelief,
        today_action: checkIn.todayAction,
        energy_score: checkIn.energyScore,
        focus_score: checkIn.focusScore,
        emotional_score: checkIn.emotionalScore,
        ai_reflection: checkIn.aiReflection || null,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateCheckInReflection(userId, date, reflection) {
    if (DB.isDemoUser(userId)) {
      const all = DB.demoGet(`checkins_${userId}`);
      const ci = all.find(c => c.date === date);
      if (ci) { ci.ai_reflection = reflection; DB.demoSet(`checkins_${userId}`, all); }
      return;
    }
    const { error } = await sb
      .from('check_ins')
      .update({ ai_reflection: reflection })
      .eq('user_id', userId)
      .eq('date', date);
    if (error) throw error;
  },

  // ─── Exercises ─────────────────────────────────────────────────────────────

  async getClientExercises(userId) {
    if (DB.isDemoUser(userId)) return DB.demoGet(`exercises_${userId}`);
    const { data } = await sb
      .from('client_exercises')
      .select('*')
      .eq('user_id', userId)
      .order('assigned_at', { ascending: true });
    return data || [];
  },

  async assignExercise(userId, exerciseId, assignedBy) {
    if (DB.isDemoUser(userId)) {
      const all = DB.demoGet(`exercises_${userId}`);
      if (all.find(e => e.exercise_id === exerciseId)) return;
      all.push({ id: `dce-${Date.now()}`, user_id: userId, exercise_id: exerciseId, status: 'assigned', response: '', assigned_at: new Date().toISOString(), completed_at: null, assigned_by: assignedBy });
      DB.demoSet(`exercises_${userId}`, all); return;
    }
    // Don't duplicate
    const { data: existing } = await sb
      .from('client_exercises')
      .select('id')
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId)
      .maybeSingle();
    if (existing) return;

    const { error } = await sb
      .from('client_exercises')
      .insert({ user_id: userId, exercise_id: exerciseId, assigned_by: assignedBy });
    if (error) throw error;
  },

  async updateExercise(id, updates) {
    // Check demo stores
    for (const key of Object.keys(localStorage).filter(k => k.startsWith('rl_demo_exercises_'))) {
      const all = JSON.parse(localStorage.getItem(key) || '[]');
      const item = all.find(e => e.id === id);
      if (item) {
        if (updates.status) item.status = updates.status;
        if (updates.response !== undefined) item.response = updates.response;
        if (updates.completedAt) item.completed_at = updates.completedAt;
        localStorage.setItem(key, JSON.stringify(all));
        return;
      }
    }
    const mapped = {};
    if (updates.status !== undefined) mapped.status = updates.status;
    if (updates.response !== undefined) mapped.response = updates.response;
    if (updates.completedAt !== undefined) mapped.completed_at = updates.completedAt;
    const { error } = await sb.from('client_exercises').update(mapped).eq('id', id);
    if (error) throw error;
  },

  // ─── Meditations ───────────────────────────────────────────────────────────

  async getClientMeditations(userId) {
    if (DB.isDemoUser(userId)) return DB.demoGet(`meditations_${userId}`);
    const { data } = await sb.from('client_meditations').select('*').eq('user_id', userId);
    return data || [];
  },

  async saveMeditation(userId, meditationId, completedDates, reflectionNote, lastCompletedAt) {
    if (DB.isDemoUser(userId)) {
      const all = DB.demoGet(`meditations_${userId}`);
      const idx = all.findIndex(m => m.meditation_id === meditationId);
      const entry = { user_id: userId, meditation_id: meditationId, completed_dates: completedDates, reflection_note: reflectionNote||'', last_completed_at: lastCompletedAt };
      if (idx >= 0) all[idx] = entry; else all.push(entry);
      DB.demoSet(`meditations_${userId}`, all); return;
    }
    const { error } = await sb
      .from('client_meditations')
      .upsert({
        user_id: userId,
        meditation_id: meditationId,
        completed_dates: completedDates,
        reflection_note: reflectionNote || '',
        last_completed_at: lastCompletedAt,
      });
    if (error) throw error;
  },

  // ─── Journal ───────────────────────────────────────────────────────────────

  async getJournalEntries(userId) {
    if (DB.isDemoUser(userId)) return DB.demoGet(`journal_${userId}`);
    const { data } = await sb.from('journal_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    return data || [];
  },

  async saveJournalEntry(entry) {
    if (DB.isDemoUser(entry.userId)) {
      const all = DB.demoGet(`journal_${entry.userId}`);
      const e = { id: `dj-${Date.now()}`, user_id: entry.userId, date: entry.date, mode: entry.mode, prompt: entry.prompt||null, content: entry.content, word_count: entry.wordCount, tags: entry.tags||[], coach_access_enabled: entry.coachAccessEnabled||false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      all.unshift(e); DB.demoSet(`journal_${entry.userId}`, all); return e;
    }
    const { data, error } = await sb
      .from('journal_entries')
      .insert({
        user_id: entry.userId,
        date: entry.date,
        mode: entry.mode,
        prompt: entry.prompt || null,
        content: entry.content,
        word_count: entry.wordCount,
        tags: entry.tags || [],
        coach_access_enabled: entry.coachAccessEnabled || false,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getCoachJournalEntries(userId) {
    if (DB.isDemoUser(userId)) return DB.demoGet(`journal_${userId}`).filter(e => e.coach_access_enabled);
    const { data } = await sb
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('coach_access_enabled', true)
      .order('created_at', { ascending: false });
    return data || [];
  },

  // ─── Homework ──────────────────────────────────────────────────────────────

  async getHomework(userId) {
    if (DB.isDemoUser(userId)) return DB.demoGet(`homework_${userId}`);
    const { data } = await sb.from('homework').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    return data || [];
  },

  async assignHomework(hw) {
    if (DB.isDemoUser(hw.userId)) {
      const all = DB.demoGet(`homework_${hw.userId}`);
      const entry = { id: `dhw-${Date.now()}`, user_id: hw.userId, title: hw.title, description: hw.description, due_date: hw.dueDate||null, type: hw.type||'Exercise', status: 'pending', submission_text: null, coach_feedback: null, assigned_by: hw.assignedBy, created_at: new Date().toISOString(), submitted_at: null, reviewed_at: null };
      all.push(entry); DB.demoSet(`homework_${hw.userId}`, all); return entry;
    }
    const { data, error } = await sb
      .from('homework')
      .insert({
        user_id: hw.userId,
        title: hw.title,
        description: hw.description,
        due_date: hw.dueDate || null,
        type: hw.type,
        assigned_by: hw.assignedBy,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateHomework(id, updates) {
    // Check all demo homework stores
    for (const key of Object.keys(localStorage).filter(k => k.startsWith('rl_demo_homework_'))) {
      const all = JSON.parse(localStorage.getItem(key) || '[]');
      const item = all.find(h => h.id === id);
      if (item) {
        if (updates.status) item.status = updates.status;
        if (updates.submissionText !== undefined) item.submission_text = updates.submissionText;
        if (updates.coachFeedback !== undefined) item.coach_feedback = updates.coachFeedback;
        if (updates.submittedAt) item.submitted_at = updates.submittedAt;
        if (updates.reviewedAt) item.reviewed_at = updates.reviewedAt;
        localStorage.setItem(key, JSON.stringify(all));
        return;
      }
    }
    const mapped = {};
    if (updates.status !== undefined) mapped.status = updates.status;
    if (updates.submissionText !== undefined) mapped.submission_text = updates.submissionText;
    if (updates.coachFeedback !== undefined) mapped.coach_feedback = updates.coachFeedback;
    if (updates.submittedAt !== undefined) mapped.submitted_at = updates.submittedAt;
    if (updates.reviewedAt !== undefined) mapped.reviewed_at = updates.reviewedAt;
    const { error } = await sb.from('homework').update(mapped).eq('id', id);
    if (error) throw error;
  },

  // ─── Vision Board ──────────────────────────────────────────────────────────

  async getVisionBoard(userId) {
    if (DB.isDemoUser(userId)) { try { return JSON.parse(localStorage.getItem(`rl_demo_vision_${userId}`) || 'null'); } catch { return null; } }
    const { data } = await sb.from('vision_boards').select('*').eq('user_id', userId).maybeSingle();
    return data;
  },

  async saveVisionBoard(userId, board) {
    if (DB.isDemoUser(userId)) { localStorage.setItem(`rl_demo_vision_${userId}`, JSON.stringify({ user_id: userId, vision_statement: board.visionStatement||'', core_desires: board.coreDesires||[], identity_statements: board.identityStatements||[], values: board.values||[], why: board.why||'', board_images: board.boardImages||[], vision_interview_done: board.vision_interview_done||false })); return; }
    const { error } = await sb
      .from('vision_boards')
      .upsert({
        user_id: userId,
        vision_statement: board.visionStatement || '',
        core_desires: board.coreDesires || [],
        identity_statements: board.identityStatements || [],
        values: board.values || [],
        why: board.why || '',
        board_images: board.boardImages || [],
        vision_interview_done: board.vision_interview_done || false,
        updated_at: new Date().toISOString(),
      });
    if (error) throw error;
  },

  // ─── Avatar (real accounts: profiles.avatar_url, cached in memory for
  // synchronous reads; demo accounts: localStorage only) ─────────────────────
  getAvatar(userId) {
    if (!userId) return null;
    if (DB.isDemoUser(userId)) {
      try { return localStorage.getItem(`rl_avatar_${userId}`) || null; } catch { return null; }
    }
    if (Object.prototype.hasOwnProperty.call(AVATAR_CACHE, userId)) return AVATAR_CACHE[userId];
    try { return localStorage.getItem(`rl_avatar_${userId}`) || null; } catch { return null; }
  },
  saveAvatar(userId, dataUrl) {
    if (DB.isDemoUser(userId)) {
      try { localStorage.setItem(`rl_avatar_${userId}`, dataUrl); } catch {}
      return;
    }
    AVATAR_CACHE[userId] = dataUrl;
    try { localStorage.setItem(`rl_avatar_${userId}`, dataUrl); } catch {}
    sb.from('profiles').update({ avatar_url: dataUrl }).eq('id', userId).then(({ error }) => { if (error) console.error('saveAvatar failed', error); });
  },
  removeAvatar(userId) {
    if (DB.isDemoUser(userId)) {
      try { localStorage.removeItem(`rl_avatar_${userId}`); } catch {}
      return;
    }
    AVATAR_CACHE[userId] = null;
    try { localStorage.removeItem(`rl_avatar_${userId}`); } catch {}
    sb.from('profiles').update({ avatar_url: null }).eq('id', userId).then(({ error }) => { if (error) console.error('removeAvatar failed', error); });
  },

  // ─── Activity Feed ─────────────────────────────────────────────────────────

  async createActivity(userId, type, title, metadata = {}) {
    if (DB.isDemoUser(userId) || (typeof userId === 'string' && userId.startsWith('demo-'))) {
      const key = `rl_demo_activity_${userId}`;
      const feed = DB.demoGet(key) || [];
      feed.unshift({ id: `act-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, user_id: userId, type, title, metadata, created_at: new Date().toISOString() });
      DB.demoSet(key, feed.slice(0, 100));
      return;
    }
    await sb.from('activity_feed').insert({ user_id: userId, type, title, metadata });
  },

  async getActivityFeed(limitCount = 50) {
    return DB.getUnifiedFeed(limitCount);
  },

  async getUnifiedFeed(limitCount = 100) {
    const isDemoSession = DB.isDemoUser(APP.STATE.currentUser?.id) ||
      (APP.STATE.currentUser?.id && String(APP.STATE.currentUser.id).startsWith('demo-'));

    if (isDemoSession) {
      const allClients = DB.demoGet('rl_demo_clients') || [];
      let all = [];

      // All client activities
      allClients.forEach(c => {
        const feed = DB.demoGet(`rl_demo_activity_${c.id}`) || [];
        feed.forEach(a => { all.push({ ...a, profiles: { first_name: c.first_name, last_name: c.last_name, role: 'client' } }); });
      });
      const dc1 = DB.demoGet('rl_demo_activity_demo-client-1') || [];
      dc1.forEach(a => {
        if (!all.find(x => x.id === a.id))
          all.push({ ...a, profiles: { first_name: 'Demo', last_name: 'Client', role: 'client' } });
      });

      // All coach activities
      const adminIds = new Set(['demo-admin-1']);
      if (APP.STATE.currentUser?.role === 'admin') adminIds.add(APP.STATE.currentUser.id);
      adminIds.forEach(id => {
        const feed = DB.demoGet(`rl_demo_activity_${id}`) || [];
        feed.forEach(a => {
          if (!all.find(x => x.id === a.id))
            all.push({ ...a, profiles: { first_name: 'Carter', last_name: '', role: 'admin' } });
        });
      });

      return all.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, limitCount);
    }

    const { data } = await sb
      .from('activity_feed')
      .select('*, profiles(first_name, last_name, role)')
      .order('created_at', { ascending: false })
      .limit(limitCount);
    return data || [];
  },

  async getClientActivityFeed(userId) {
    if (DB.isDemoUser(userId)) return DB.demoGet(`rl_demo_activity_${userId}`) || [];
    const { data } = await sb
      .from('activity_feed')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    return data || [];
  },

  // Returns coach activities (posts, assignments, feedback) visible to a specific client
  async getCoachFeedForClient(clientId) {
    if (DB.isDemoUser(clientId)) {
      // In demo, look in both demo-admin-1 and any logged-in admin's store
      const adminId = APP.STATE.currentUser?.role === 'admin' ? APP.STATE.currentUser.id : 'demo-admin-1';
      const coachFeed = [
        ...(DB.demoGet(`rl_demo_activity_demo-admin-1`) || []),
        ...(adminId !== 'demo-admin-1' ? (DB.demoGet(`rl_demo_activity_${adminId}`) || []) : []),
      ];
      return coachFeed.filter(a =>
        a.type === 'coach_post' ||
        (a.metadata && a.metadata.target_client_id === clientId)
      ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    const { data } = await sb.from('activity_feed')
      .select('*')
      .in('type', ['coach_post', 'coach_assigned_exercise', 'coach_feedback'])
      .order('created_at', { ascending: false })
      .limit(50);
    // Filter: coach_post is visible to all, others only if target_client_id matches
    return (data || []).filter(a =>
      a.type === 'coach_post' ||
      (a.metadata && a.metadata.target_client_id === clientId)
    );
  },

  // ─── Coach Reactions ───────────────────────────────────────────────────────

  async saveReaction(activityId, coachId, liked, comment) {
    const key = `rl_demo_reaction_${activityId}`;
    if (typeof activityId === 'string' && activityId.startsWith('act-')) {
      // demo
      DB.demoSet(key, { activity_id: activityId, coach_id: coachId, liked, comment, updated_at: new Date().toISOString() });
      return;
    }
    const { error } = await sb.from('coach_reactions').upsert({
      activity_id: activityId,
      coach_id: coachId,
      liked,
      comment: comment || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'activity_id,coach_id' });
    if (error) throw error;
  },

  async getReactions(activityIds) {
    if (!activityIds.length) return {};
    // Check demo first
    const result = {};
    const realIds = [];
    activityIds.forEach(id => {
      if (typeof id === 'string' && id.startsWith('act-')) {
        const r = DB.demoGet(`rl_demo_reaction_${id}`);
        if (r) result[id] = r;
      } else {
        realIds.push(id);
      }
    });
    if (realIds.length) {
      const { data } = await sb.from('coach_reactions').select('*').in('activity_id', realIds);
      (data || []).forEach(r => { result[r.activity_id] = r; });
    }
    return result;
  },

  // ─── Admin Notes ───────────────────────────────────────────────────────────

  async getNotes(userId) {
    const { data } = await sb
      .from('admin_notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return data || [];
  },

  async saveNote(userId, content, createdBy) {
    const { error } = await sb
      .from('admin_notes')
      .insert({ user_id: userId, content, created_by: createdBy, is_pinned: true });
    if (error) throw error;
  },

};

window.DB = DB;
