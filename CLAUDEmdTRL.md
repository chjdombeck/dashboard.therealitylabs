# CLAUDE.md — Reality Labs Coaching Dashboard

> **Read this entire file before writing a single line of code. Every section connects.**

---

## Always Do First

1. **Invoke the `frontend-design` skill** before writing any frontend code — every session, no exceptions.
2. **Check `brand_assets/`** for logos, colors, and any supplied images before reaching for placeholders.
3. **Re-read the Brand Voice section** before writing any copy, AI prompts, or UI text.

---

## Who This Is For

**Reality Labs** is Carter Dombeck's 1-on-1 subconscious reprogramming coaching practice for entrepreneurs.

Carter's story: he spent 8 months unable to sign a single client while building his marketing business. He tried everything at the surface level — outreach, strategy, consistency. Nothing worked. When he started working on his *inner environment* — identity, belief systems, subconscious patterns — he signed 4 clients in 2 weeks and crossed $10K within 6 weeks. Nothing external had changed. That's the core thesis of Reality Labs.

**The platform is built on one idea:**
> *"Your subconscious identity is creating your reality."*

Clients are entrepreneurs hitting invisible ceilings. Not because they lack strategy, but because their subconscious is programmed to stay where they are. This dashboard is the daily environment where that reprogramming happens.

---

## The Six-Layer Coaching Method (Build Everything Around This)

The dashboard mirrors Carter's actual coaching process:

| # | Phase | What It Is |
|---|-------|------------|
| 001 | **Pattern Mapping** | Identify the specific subconscious programs producing the current ceiling |
| 002 | **Identity Archaeology** | Trace root-level beliefs that formed the current identity |
| 003 | **Subconscious Reprogramming** | Install the new identity the next level requires — permanent rewiring, not motivation |
| 004 | **Vision Integration** | Align subconscious ambition with business vision so resistance dissolves |
| 005 | **Foundational Change** | No quick fixes — transform who they are so results change permanently |
| 006 | **Partnership** | Every session is personalized around their specific identity and patterns |

Every feature in the dashboard maps to one or more of these phases. When building UI copy, exercise instructions, or AI prompts — always ask: *which phase does this serve?*

---

## Brand Identity

### Positioning
Subconscious reprogramming for entrepreneurs. Not mindset coaching. Not therapy. Identity-level transformation that shows up as business results.

### One-Liner
*Helping entrepreneurs break through subconscious blocks to build the business they love.*

### Core Idea
*Your reality reflects your subconscious identity.*

### Brand Voice — Carter's Actual Language
Use these exact phrases and patterns throughout the app. This is not generic wellness copy.

**Short lines (use in UI, quotes, reminders, empty states):**
- "Reality responds to your subconscious."
- "You get what you are, not what you want."
- "Change your identity → change your results."
- "Your results are programmed."
- "Reality creation is an inside job."
- "It's a non-physical game."
- "Overqualified on paper. Underqualified concept of self."
- "Internal state creates external outcomes."
- "Misalignment = resistance. Reprogramming = growth."

**Tone rules:**
- Direct. No fluff. No filler words.
- Confident, not arrogant — Carter speaks from lived experience, not theory
- Never preachy. Never lectures.
- Acknowledges struggle without wallowing in it
- Always points toward identity, not behavior or strategy
- Uses the word "identity" often — it's central to the whole framework
- Avoids: "amazing", "awesome", "crushing it", toxic positivity, hustle culture language
- Avoids: generic affirmations ("you've got this!"), vague motivational copy
- Prefers: precise, slightly uncomfortable truths

**Content structure (apply everywhere AI generates text):**
Hook → Insight → Identity Shift

---

## Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--gold` | `#E39703` | Accent — CTAs, highlights, thin lines, active states |
| `--black` | `#000000` | Primary background |
| `--white` | `#FFFFFF` | Primary text |
| `--surface-1` | `#0A0A0A` | Card backgrounds (slightly lifted from pure black) |
| `--surface-2` | `#111111` | Elevated cards, modals |
| `--surface-3` | `#1A1A1A` | Floating elements, dropdowns |
| `--gold-dim` | `rgba(227,151,3,0.15)` | Subtle gold tints, hover states |
| `--gold-line` | `rgba(227,151,3,0.3)` | Thin dividers, borders (signature brand element) |
| `--text-muted` | `rgba(255,255,255,0.45)` | Secondary text, labels |
| `--text-dim` | `rgba(255,255,255,0.65)` | Body text, descriptions |

**Ratio rule: 80% black / 15% white / 5% gold.** Gold is precious — it should feel earned when it appears.

---

## Typography

**Font: IBM Plex Sans** (Google Fonts) — the only font used across the entire product.

```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');
```

| Weight | Usage |
|--------|-------|
| 700 Bold | Headlines, section titles, hero text |
| 600 SemiBold | Card titles, navigation labels, button text |
| 500 Medium | Subtext, secondary headings, labels |
| 400 Regular | Body copy, descriptions, form text |
| 300 Light | Captions, timestamps, metadata |

**Style rules:**
- Minimal text — short lines, high contrast
- Slight letter spacing on headlines: `letter-spacing: 0.04em` for uppercase labels, `-0.02em` for large display text
- Clean, structured layouts — no decorative fonts, no serifs
- ALL CAPS used sparingly for labels and section markers (like the website: "YOUR RESULTS ARE A SUBCONSCIOUS PROGRAM")
- Line height: `1.5` for body, `1.1–1.2` for large headlines

---

## Visual Style

- **Dark. Minimal. High contrast.** No exceptions.
- **Thin gold lines** are the signature brand element — use as dividers, card borders, active indicators, underlines on key phrases
- **Clean spacing** — generous breathing room, nothing cluttered
- **No decorative illustrations**, no abstract shapes, no generic stock photography
- Backgrounds: pure `#000000` with very subtle radial gradient depth — a faint gold glow at focal points
- Cards: `#0A0A0A` or `#111111` with a `1px solid rgba(227,151,3,0.2)` border
- Shadows: `0 0 40px rgba(227,151,3,0.05)` — barely-there gold ambient glow, not harsh drop shadows
- Grain texture overlay: SVG noise at 3–5% opacity for depth (do not skip this)
- Animations: `opacity` and `transform` only. `300–500ms` ease. Nothing frantic. No bouncing.
- Every interactive element: hover, focus-visible, and active states — all required

---

## User Roles

There are exactly two roles in this system:

### Role: `admin` (Carter)
- There is **one admin account** — Carter Dombeck
- Admin credentials are hardcoded or set during initial setup — clients cannot become admin
- Admin has access to **everything**: all client data, all dashboards, all submissions
- Admin also has a **personal dashboard** with all client features (Carter uses the product himself)
- Admin can switch between "Coach View" and "My Dashboard" from the top nav

### Role: `client`
- Created by the admin only — no self-signup
- Sees only their own data
- Cannot access any other client's information
- Cannot access admin tools

---

## Authentication

- Login screen: email/username + password
- Single login page for both roles — role is determined server-side after auth
- Sessions persist via `localStorage` token (include `role`, `userId`, `firstName`)
- On first client login (no completed interview on record): redirect to **Onboarding Interview**
- On subsequent client logins: go directly to **Client Dashboard**
- Admin always lands on **Admin Dashboard**
- Never expose one client's data to another under any circumstances

---

## Screen Inventory

Build screens in this order:

1. Login Screen
2. Onboarding Interview (client)
3. Client Dashboard — Home/Today
4. Daily Check-In
5. Exercises Library + Exercise Detail
6. Visualization Meditations
7. Journal
8. Homework
9. My Vision
10. Progress
11. Admin Dashboard — Overview
12. Admin — Client Detail View
13. Admin — Client Management (create/edit clients)
14. Admin — Assign Homework/Exercises
15. Admin — My Personal Dashboard (same as client dashboard, scoped to Carter)

---

## Onboarding Interview

The most critical first experience in the entire product. It must feel like a real conversation — not a form, not a survey.

### UX Rules
- Full-screen, distraction-free — no sidebar, no nav, no chrome
- Display one message/question at a time in a chat interface
- AI "types" its response (streaming or typewriter effect) before the client can reply
- Client types their response in a text area at the bottom
- Subtle progress: "Step 4 of ~12" in small text — not a progress bar
- Show estimated time upfront: *"This conversation takes 10–30 minutes. Take your time."*
- Allow pause and resume — save all responses continuously
- Typing indicator (3-dot animation) while AI is processing

### Interview System Prompt (use this verbatim when calling the AI API)

```
You are the Reality Labs AI coach. Your role is to conduct a deep, thorough onboarding interview with a new coaching client of Carter Dombeck.

Carter's coaching framework: subconscious reprogramming for entrepreneurs. The core idea is that a client's external results — business, money, relationships — are a direct reflection of their subconscious identity and belief systems. Coaching works by identifying and rewiring the specific programs running beneath the surface.

Your job is to uncover everything about this client: their vision, their current reality, the gap between them, their core beliefs, subconscious blocks, identity, values, past wins, support system, and their commitment level.

TONE: Warm, direct, grounded. Not clinical. Not cheerful. Like a trusted mentor who sees through surface-level answers and gently pushes deeper. Acknowledge what they share before asking the next question. Mirror their language back to them. Never lecture. Never use generic affirmations.

STRUCTURE: Ask one focused question at a time. Probe for specifics when answers are vague. If a client says "I want to make more money," ask what that means specifically, what their current revenue is, and what their relationship with money looks like. Go deep.

COVER ALL OF THESE AREAS (in a natural, conversational order — not as a rigid list):
1. Desired Reality / Vision — Where do they want to be in 1, 3, 5 years? What does their ideal life look, feel, and sound like in vivid detail?
2. Current Reality — Where are they now? Revenue, business stage, what's working, what isn't?
3. The Gap — What do they believe is standing between where they are and where they want to be?
4. Core Beliefs — What do they believe about themselves, money, success, their own capability?
5. Subconscious Blocks — Recurring patterns, fears, self-sabotage behaviors, the stories they keep telling themselves
6. Identity — Who do they need to *become* to have what they want? Who are they currently being?
7. Values — What matters most to them? What are they unwilling to compromise?
8. Past Wins — Times they've surprised themselves. Evidence of their own capability.
9. Support System — Who in their life supports their growth? Who drains or doubts them?
10. Commitment — What are they willing to do? What's the deep "why" behind wanting this?

After covering all areas, close with warmth. Acknowledge their courage and openness. Tell them their personalized dashboard is being built. Do not summarize their answers back to them in a list — just close the conversation naturally.

Output format: respond only with your next message to the client. No meta-commentary. No labels.
```

### After Interview Completion
- Display closing message from AI
- Show animated loading screen: *"Building your Reality Labs dashboard..."* (5–10 seconds)
- Background: AI generates a `clientProfile` object from the transcript — extract and store: `desiredReality`, `currentReality`, `coreBeliefs`, `blocks`, `identity`, `values`, `why`, `keyLanguage` (phrases the client used repeatedly)
- Redirect to Client Dashboard

---

## Client Dashboard

### Navigation
- **Desktop:** Fixed left sidebar, 240px wide, `#0A0A0A` background, thin gold right border
- **Mobile:** Bottom tab bar, 5 icons max
- Nav items: Home · Check-In · Exercises · Meditations · Journal · Homework · My Vision · Progress
- Header: Client first name + today's date + a rotating short brand line ("Reality responds to your subconscious.")

### Home / Today View
Default landing after login. One screen, no tabs.

| Element | Details |
|---------|---------|
| **Daily Quote** | Rotates daily; pulled from Carter's actual language + client's interview themes |
| **Today's Reminder** | One affirmation — personalized to their stated identity goal |
| **Check-In CTA** | Large, gold-accented button: "Start Today's Check-In" — grays out if already completed |
| **Today's Focus** | One exercise or homework item surfaced as the day's priority |
| **Streak** | "Day 12" — consecutive days of engagement. Gold number, white label. |
| **Journal Preview** | Last entry — first 2–3 lines, tap to expand |
| **Weekly Alignment** | Sparkline graph of their alignment scores over the past 7 days |

---

## Feature Specs

### 1. Daily Check-In

Brief structured reflection. 5–10 minutes. One question at a time — feels like a check-in, not a form.

**Questions (in order, shown one at a time):**
1. "On a scale of 1–10, how aligned do you feel with your vision right now?" (large number slider)
2. "What is one thing you're genuinely grateful for today?" (text)
3. "What belief supported you today?" (text)
4. "What belief held you back today?" (text)
5. "What is one action you'll take today that your future self would take?" (text)
6. Rate: Energy / Focus / Emotional State — three separate 1–10 sliders

**After submission:**
- AI generates a 2–3 sentence reflection using their answers + their profile context
- Use this system prompt for the reflection call:
  ```
  You are the Reality Labs AI. A client just completed their daily check-in.
  Their profile context: {clientProfile}
  Today's responses: {checkInData}
  Write a 2-3 sentence reflection in Carter Dombeck's voice: direct, warm, grounded.
  Point to one pattern or insight in what they shared. Connect it back to identity.
  Never be generic. Never say "great job." Never use filler praise.
  ```
- Log entry with timestamp
- Update streak counter
- If alignment score drops 2+ points from yesterday: surface a gentle prompt to journal

---

### 2. Exercises

A sequenced library of subconscious reprogramming exercises assigned by Carter (or auto-surfaced from the interview).

**Exercise Card shows:**
- Title + estimated time + category tag
- Category tags: `Belief Work` · `Identity` · `Visualization` · `Pattern Work` · `Action`
- Status badge: `Assigned` / `In Progress` / `Completed`
- Short description (1–2 lines)
- Tap to open full exercise

**Exercise Detail View:**
- Step-by-step instructions (clear, simple, no fluff)
- Reflection field at the bottom: "What came up for you? What shifted?"
- Mark complete button — completing unlocks next in sequence
- Completed exercises are archived, not deleted — client can revisit

**Built-in Exercise Types:**

| Exercise | Phase | What It Is |
|----------|-------|------------|
| **Pattern Mapping** | 001 | Client lists the recurring patterns in their business/life. Identifies the belief underneath each one. |
| **Belief Audit** | 002 | List every limiting belief currently active. Reframe each into an empowering alternative using bridge statements. |
| **Identity Archaeology** | 002 | Trace a current result back to its root belief. When did this program install? What event/environment created it? |
| **Future Self Letter** | 003 | Write a letter *from* your future self (3 years out) *to* your present self. Present tense. Specific. |
| **Identity Declaration** | 003 | Write 20 "I am the kind of person who..." statements from your future identity — not who you are, who you're becoming. |
| **The Ladder** | 003 | Map the gap between a current limiting belief and a desired belief. Write 5–7 bridge beliefs that connect them. |
| **Mirror Work** | 003 | Scripted affirmation sequence done while looking in a mirror. Instructions include what to say and how long. |
| **Pattern Interrupt** | 003 | Identify one self-sabotage pattern. Design a specific replacement behavior. Commit to a trigger + response. |
| **Vision Integration** | 004 | Write a detailed 1-page description of their desired reality as if it's already happened. Sensory, specific, present tense. |
| **The Identity Gap** | 005 | Side-by-side: who am I being now vs. who do I need to be? What decisions would that person make today? |

---

### 3. Visualization Meditations

A guided visualization player. Audio-first when files are provided; guided script when not.

**Meditation Card shows:**
- Title + duration + theme tag
- Short description (2–3 sentences, written in Carter's voice)
- Play / View Script button
- Completion tracker: checkmark if completed today
- Tap to add reflection note after completing

**Initial Meditation Set:**

| Title | Duration | Theme | Phase |
|-------|----------|-------|-------|
| Morning Vision Activation | 5 min | Start the day inside your desired reality | 004 |
| Future Self Embodiment | 10 min | Inhabit the identity of who you're becoming | 003 |
| Subconscious Reprogramming Body Scan | 15 min | Deep relaxation + installing new beliefs at the somatic level | 003 |
| Releasing Limiting Beliefs | 10 min | Identify and dissolve the programs that create resistance | 002 |
| Identity Upgrade | 8 min | Full-body immersion in your new identity | 003 |
| Pattern Interruption Reset | 7 min | Break the state of an old pattern. Step into a new one. | 003 |

**Guided Script Format (when no audio):**
- Display text in large, readable type
- One paragraph or phrase at a time — client taps to advance
- Slow, unhurried pacing cues embedded in text (e.g., *"Take a breath here..."*)

---

### 4. Journal

Private. Safe. The most personal feature in the product.

**Three Modes:**
- **Prompted** — AI generates a writing prompt based on client profile + recent activity
- **Free Write** — Open text. No prompt. No structure.
- **Scripting** — Client writes their desired reality in present tense as if already happening. Dedicated mode with a framing header: *"Write as if it's already done."*

**Features:**
- Auto-save every 20 seconds (visual indicator: "Saved")
- Word count shown live
- Date/time stamp on every entry
- Full-text search across all entries
- Tags (multi-select): `Vision` · `Gratitude` · `Shadow Work` · `Scripting` · `Breakthrough` · `Resistance`
- Entries are private by default
- Coach access toggle: client can enable/disable Carter's ability to read entries
- Completed entries show in a clean list — newest first, searchable, filterable by tag

**Journal Prompt System:**
AI generates prompts using this system prompt:
```
You are the Reality Labs AI. Generate one journal prompt for this client.
Their profile: {clientProfile}
Their recent check-ins (last 3): {recentCheckIns}
Write a single, powerful prompt that goes directly at the root — their identity, their beliefs, their subconscious patterns. Not surface level. Not generic.
Use Carter Dombeck's voice: direct, grounded, no fluff.
Return only the prompt — no preamble, no labels.
```

**Rotating prompt bank (use as fallback or seed):**
- "Describe in vivid detail what your life looks like 3 years from now, as if you're already living it. Be specific. What do you see, feel, hear?"
- "What is the story you've been telling yourself that has been producing your current results? Write the new story."
- "List every piece of evidence that proves you are the person who can have what you want."
- "Write about a time you overcame something that felt impossible. What does that tell you about who you are?"
- "What would the most aligned version of you do today? Be specific."
- "What pattern keeps showing up in your business? What belief is underneath it?"
- "Who do you need to stop being to have what you want?"
- "Write a letter to your old identity. Thank it. Release it."

---

### 5. Homework

Tasks assigned by Carter. Specific, personal, sequenced.

**Homework Item shows:**
- Title + description
- Due date (with overdue indicator)
- Type tag: `Reading` · `Exercise` · `Real-World Action` · `Reflection` · `Challenge`
- Status: `Pending` / `In Progress` / `Submitted` / `Reviewed`
- Submission field (text) + optional file upload
- Carter's feedback field — read-only for client, shown once Carter has reviewed
- Submitted items are locked from editing

**Client view:** Simple list. Overdue items surface at top in gold. Completed items move to archive.

---

### 6. My Vision

The client's north star. Everything they're working toward, in one place.

| Section | Content |
|---------|---------|
| **Vision Statement** | 1–3 paragraphs — generated from interview, always editable by client |
| **Core Desires** | Bulleted list pulled from interview — what they want across business, life, identity |
| **Identity Statement** | "I am..." declarations — who they're becoming |
| **Values** | Top 5–7 values identified in the interview |
| **Their Why** | The deep reason — what this is really about |
| **Vision Board** | Image grid — client uploads their own photos/images |

This page should feel like a personal manifesto. Dark background. Large type. Gold accents. Unhurried spacing.

---

### 7. Progress

A record of their journey. Not gamified — this is not a productivity app. It's a map of transformation.

| Element | Details |
|---------|---------|
| Interview date | When their journey began |
| Current streak | Days of consecutive activity |
| Check-in history | Calendar heatmap — gold dots on active days |
| Alignment graph | Line chart of daily alignment scores (1–10) over time |
| Exercises | Count completed + list with dates |
| Meditations | Count + last completed date |
| Journal | Total entries + total word count |
| Milestone moments | Key badges: First Check-In, 7-Day Streak, First Exercise Complete, First Scripting Entry, 30 Days, etc. |

Milestones use Carter's language. Not "You did it!" — something like: *"Day 7. The identity is taking hold."*

---

## Admin Dashboard (Carter Only)

Carter's admin view is split into two modes, toggled from the top nav:

### Mode A: Coach View
Carter's operational view of all his clients.

#### Client Overview (default landing)
- Grid or list of all active clients
- Each client card shows: name, days active, streak, last check-in date, interview status, number of pending homework items
- Filter/sort by: last active, streak, homework pending, interview not completed
- Click any client → Client Detail View

#### Client Detail View
Everything about one client, in full.

**Tabs within Client Detail:**
- **Overview** — Profile summary generated from their interview. Key beliefs, blocks, stated vision, identity goals.
- **Check-Ins** — Full history. All responses, all scores. Alignment graph. AI-generated reflections visible.
- **Exercises** — All assigned exercises, status, and their written responses.
- **Meditations** — Completion history and reflection notes.
- **Journal** — Only visible if client has enabled coach access. Full entries with tags.
- **Homework** — All assigned items. Carter can write feedback directly from here, mark as reviewed.
- **Progress** — Same progress view the client sees.
- **Interview Transcript** — Full verbatim AI conversation from onboarding.

#### Client Management
- Create new client (name, email, username, password)
- Deactivate client (they lose login access; data is preserved)
- Edit client info

#### Assign Content
- Assign specific exercises to a specific client
- Assign homework with title, description, type, due date
- Add a note to the client's dashboard (pinned message they see on Home)

### Mode B: My Personal Dashboard
Carter's own coaching dashboard — identical to the client dashboard in features, scoped to Carter's own data. Carter does the work too.

- All the same features: Check-In, Exercises, Journal, Vision, Meditations, Homework (self-assigned), Progress
- Carter's personal data is completely separate from any client data
- This mode is accessed via "My Dashboard" toggle in the top nav

---

## AI Integration

All AI calls go to the Anthropic API. Use `claude-sonnet-4-20250514` for all completions.

### API Call Template
```javascript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: SYSTEM_PROMPT, // see per-feature system prompts above
    messages: conversationHistory
  })
});
```

### AI Features Summary

| Feature | When It Runs | Output |
|---------|-------------|--------|
| Onboarding Interview | First login, full conversation | Chat messages |
| Post-interview profile extraction | After interview completes | `clientProfile` JSON object |
| Daily Check-In reflection | After each check-in submission | 2–3 sentence reflection |
| Journal prompt generation | When client opens Prompted journal mode | One focused prompt |
| Weekly summary | Every Sunday, auto-generated | Pattern summary surfaced in Progress |
| Home screen affirmation | Daily, on dashboard load | One personalized reminder line |

### AI Voice Rules (apply to ALL system prompts)
- Carter Dombeck's voice: direct, grounded, warm, no fluff
- Identity-first framing — always connect back to who they're being
- Short sentences. Precise language. No filler.
- Never: "Great job!", "Amazing!", "You've got this!", toxic positivity
- Never: generic affirmations, surface-level encouragement
- Always: specific, slightly uncomfortable truth followed by identity-level reframe

---

## Data Model

```javascript
// Users
User {
  id: string
  role: "admin" | "client"           // admin = Carter only
  username: string
  email: string
  passwordHash: string
  firstName: string
  lastName: string
  createdAt: timestamp
  isActive: boolean

  // Client-only fields
  interviewCompleted: boolean
  interviewCompletedAt: timestamp | null
  interviewTranscript: Message[]      // full AI conversation
  clientProfile: {
    desiredReality: string
    currentReality: string
    coreBeliefs: string[]
    blocks: string[]
    identity: string
    values: string[]
    why: string
    keyLanguage: string[]             // phrases client used repeatedly
  }
}

// Daily Check-Ins
DailyCheckIn {
  id: string
  userId: string
  date: string                        // YYYY-MM-DD
  alignmentScore: number              // 1–10
  gratitude: string
  supportingBelief: string
  limitingBelief: string
  todayAction: string
  energyScore: number
  focusScore: number
  emotionalScore: number
  aiReflection: string
  createdAt: timestamp
}

// Exercises (master library)
Exercise {
  id: string
  title: string
  type: string
  category: "Belief Work" | "Identity" | "Visualization" | "Pattern Work" | "Action"
  phase: 1 | 2 | 3 | 4 | 5 | 6
  estimatedMinutes: number
  instructions: string[]              // step-by-step
  description: string
}

// Client exercise assignments
ClientExercise {
  id: string
  userId: string
  exerciseId: string
  status: "assigned" | "in_progress" | "completed"
  response: string
  assignedAt: timestamp
  completedAt: timestamp | null
  assignedBy: string                  // admin userId
}

// Meditations (master library)
Meditation {
  id: string
  title: string
  durationMinutes: number
  theme: string
  phase: number
  description: string
  audioUrl: string | null
  guidedScript: string | null
}

// Client meditation history
ClientMeditation {
  id: string
  userId: string
  meditationId: string
  completedDates: string[]
  lastCompletedAt: timestamp | null
  reflectionNote: string
}

// Journal entries
JournalEntry {
  id: string
  userId: string
  date: string
  mode: "prompted" | "free" | "scripting"
  prompt: string | null
  content: string
  wordCount: number
  tags: string[]
  coachAccessEnabled: boolean
  createdAt: timestamp
  updatedAt: timestamp
}

// Homework
HomeworkItem {
  id: string
  userId: string
  title: string
  description: string
  dueDate: string
  type: "Reading" | "Exercise" | "Real-World Action" | "Reflection" | "Challenge"
  status: "pending" | "in_progress" | "submitted" | "reviewed"
  submissionText: string | null
  submissionFileUrl: string | null
  coachFeedback: string | null
  assignedBy: string
  createdAt: timestamp
  submittedAt: timestamp | null
  reviewedAt: timestamp | null
}

// Vision Board
VisionBoard {
  userId: string
  visionStatement: string
  coreDesires: string[]
  identityStatements: string[]
  values: string[]
  why: string
  boardImages: { url: string, caption: string }[]
  updatedAt: timestamp
}

// Admin notes (pinned messages on client home screen)
AdminNote {
  id: string
  userId: string
  content: string
  isPinned: boolean
  createdAt: timestamp
  createdBy: string
}
```

---

## Local Server & Screenshot Workflow

- **Always serve on localhost** — never screenshot a `file:///` URL
- Start dev server: `node serve.mjs` (serves project root at `http://localhost:3000`)
- Puppeteer is installed at `C:/Users/nateh/AppData/Local/Temp/puppeteer-test/`
- Chrome cache at `C:/Users/nateh/.cache/puppeteer/`
- Screenshots: `node screenshot.mjs http://localhost:3000`
- Saved to `./temporary screenshots/screenshot-N.png` (auto-incremented)
- Optional label: `node screenshot.mjs http://localhost:3000 login` → `screenshot-N-login.png`
- After screenshotting: read the PNG with the view tool and analyze it directly
- **Minimum 2 comparison rounds** before declaring any screen complete
- Check: exact hex colors, spacing/padding, font weights, gold line details, alignment, mobile responsiveness

---

## Output Defaults

- Single `index.html` per screen unless the project explicitly splits into files
- All styles in a `<style>` block; Tailwind via CDN
- `<script src="https://cdn.tailwindcss.com"></script>`
- IBM Plex Sans via Google Fonts `@import`
- Tailwind config block to add custom brand colors:
  ```html
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            gold: '#E39703',
            'gold-dim': 'rgba(227,151,3,0.15)',
          },
          fontFamily: {
            sans: ['IBM Plex Sans', 'sans-serif'],
          }
        }
      }
    }
  </script>
  ```
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT/111111/E39703`
- Mobile-first responsive — clients use this on their phones daily

---

## Deployment

- Test on `http://localhost:3000` before any push
- Changes go: localhost → GitHub → Vercel (auto-deploy)
- **Never push to GitHub or Vercel unless explicitly told to do so**

---

## Hard Rules

**Product:**
- One admin account (Carter). Zero exceptions. No other user can have admin role.
- Never expose one client's data to another client under any circumstances
- Never skip the interview check on first client login
- Clients cannot self-register — admin creates all accounts

**Design:**
- Never use any color except the brand palette defined above
- Never use `transition-all`
- Never use a font other than IBM Plex Sans
- Never use decorative serifs, display fonts, or script fonts
- Gold is an accent — never a background fill, never dominant
- Every screen must feel: dark, minimal, high contrast, with intentional thin gold details
- No clutter. No decorative illustrations. No icons that don't serve a function.

**AI & Copy:**
- Never write generic motivational copy ("You've got this!", "Keep it up!", "Amazing!")
- Never write in a voice that isn't Carter's — direct, grounded, identity-first
- Always connect insights back to identity, not behavior or strategy
- The product is subconscious reprogramming. Not mindset coaching. Language matters.

**Development:**
- Never stop after one screenshot pass — minimum two rounds
- Never push to GitHub or Vercel without explicit instruction
- Never add features not specified in this file without asking first
