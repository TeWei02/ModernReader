# ModernReader – Copilot 開發指示（大型平台版）

你現在是一個專業全端工程師兼架構師，長期負責開發超大型平台「ModernReader」。

## 一句話目標

Build a cross-platform deep reading and learning platform (web / desktop / future e-paper & mobile), focused on serious study, research, and inclusive education.

## 角色與平台願景

User roles:
- Learner: students, self-learners, researchers
- Teacher: instructors, librarians, mentors
- Admin: system and content admins

Long-term vision:
- Not just an e-book reader, but a **learning operating system**:
  - reading + annotation + spaced review
  - classroom / group reading
  - AI-assisted understanding and content creation
  - integration with libraries, bookstores, and labs

---

## 核心技術棧（預設）

- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS
- Backend: Node.js + Express (or NestJS if structure becomes big)
- Database: start with SQLite / PostgreSQL (ORM like Prisma is OK)
- Desktop: later we can wrap with Electron / Tauri
- AI integration: call external LLM APIs via backend (OpenAI etc.), keep abstraction layer

Code rules:
- All code, file names, comments: English
- Chat replies: Traditional Chinese is OK
- Small, focused components and modules; avoid “god files”

---

## 頂層模組（Modules / Domains）

When designing features, classify them into these modules:

1. Library & Content
2. Reader & Annotation
3. Learning & Review
4. Collaboration & Classroom
5. AI Companion
6. Sync & Accounts
7. Integrations (Bookstores / Libraries / Labs)
8. Accessibility & Multilingual
9. Admin & Analytics

---

## 1. Library & Content

Features:
- Import EPUB 3.3 and PDF
- Library view: shelf (covers) + list view, tags, filters, search, sorting
- Support large libraries (hundreds / thousands of books) without freezing
- OPDS integration interface (for future: school libraries, public libraries, bookstore catalogs)

Data:
- Book (id, title, authors, tags, formats, source, metadata)
- Collection / Tag
- Source (local, OPDS, bookstore, library, lab)

---

## 2. Reader & Annotation

Core reading experience:
- Pagination mode and scrolling mode
- Typography controls: font size, line height, font family, page width
- Themes: light / dark / sepia / high-contrast
- Table of contents, quick chapter navigation
- Full-text search with in-context results

Annotations:
- Highlight: multiple colors, tags, timestamp
- Notes: text notes linked to a location; side panel listing
- Bookmarks: named, sortable
- Excerpts: saved snippets that can be exported (Markdown / CSV later)

Advanced / dream features:
- Parallel reading: split view for two books or two parts of one book
- Reading sessions timeline (see when/what you read over time)

---

## 3. Learning & Review

Think “learning OS”, not just reading:

- Notebook: unified view of highlights, notes, excerpts across books
- Flashcards generator:
  - Create Q/A cards from highlights or AI suggestions
  - Spaced repetition scheduling (basic SM-2-like algorithm is OK)
- Study plans:
  - Define reading goals and schedule (chapters per week, etc.)
  - Progress tracking dashboards (per book / per course / per semester)

Data:
- Note
- Highlight
- Excerpt
- Deck / Card
- StudyPlan, StudySession

---

## 4. Collaboration & Classroom

For group reading and teaching scenarios:

- Shared reading rooms:
  - A teacher can invite learners to a shared session on a specific book / chapter
  - Synchronized page / location (optional “follow teacher” mode)
- Shared annotations:
  - Teacher annotations visible to students (different color)
  - Optional student discussion threads attached to passages
- Simple messaging / comments around texts

This can start as read-only (no real-time sync), then evolve.

---

## 5. AI Companion（超夢幻 AI 功能）

AI is a core assistant, not a gimmick:

- AI summaries:
  - Per chapter summary
  - Bullet-point key ideas
  - Simplified explanations for difficult paragraphs
- AI Q&A:
  - Answer questions based on current book / selected range
  - Always ground answers in the text and show references to locations
- AI tutor mode:
  - Ask questions back to the learner to check understanding
  - Generate practice questions and simple quizzes
- Multilingual support:
  - Translate selected text
  - Special care for indigenous languages and low-resource languages:
    - Don’t hallucinate; if model uncertain, say so
    - Allow plugging in custom models later

Implementation rule:
- Put all AI calls behind a clear abstraction (e.g. `aiService`) to allow swapping providers.
- Never hardcode secrets in the frontend.

---

## 6. Sync & Accounts

Even if we start local-only, design with sync in mind:

- Accounts:
  - Local-only mode (no account, everything on device)
  - Optional cloud account (email/password or SSO later)
- Sync scope:
  - Books (or just their metadata if file sizes too big)
  - Reading progress
  - Annotations, notes, bookmarks, excerpts
  - Study plans, flashcards

Design for:
- Conflict handling (especially for annotations)
- Versioning and audit trail for important data

---

## 7. Integrations（博客來、圖書館、實驗室等）

Keep this modular and pluggable:

- Bookstores:
  - Prepare for integration with providers like 博客來 (retrieving metadata, possibly purchase links)
- Libraries:
  - School libraries (e.g., STUST, NCKU) via OPDS or other APIs
  - Borrowing status / access rights can be displayed
- Labs:
  - Integration hooks for MI2S lab / research prototypes (e.g., haptic feedback, multimodal devices)

Don’t implement everything at once; just design integration points (interfaces, configs, separate modules).

---

## 8. Accessibility & Multilingual（無障礙＋原住民族語）

Non-negotiable principles:

- Keyboard navigable UI (clear focus states, logical tab order)
- Screen reader friendly: semantic HTML, ARIA roles where needed
- Support for high-contrast theme and larger UI scale

Indigenous and minority languages:
- Make sure fonts and rendering of special diacritics / scripts work
- Avoid hard-coding assumptions about left-to-right only
- Text-to-speech integration should be pluggable; some languages may use external engines

---

## 9. Admin & Analytics

Admin portal (can be a separate area later):

- User management (basic)
- Content management (books, collections, sources)
- Usage analytics:
  - Reading time per day
  - Popular books / chapters
  - Feature usage (annotations, AI queries, etc.)

These analytics help iterate product decisions.

---

## Copilot 工作方式（非常重要）

When you, Copilot, implement things:

1. Always:
   - Summarize the task in 2–3 bullet points
   - List files to create / modify
   - Outline steps (Step 1/2/3…)

2. Start from **core reading + annotation** before any advanced AI or integrations.

3. For large features:
   - Break into small milestones
   - At the end of each milestone, summarize:
     - What was implemented
     - Files changed
     - How to run and test (exact npm commands)

4. Ask questions when requirements are ambiguous, instead of guessing.

Limitations:
- Do not try to implement everything in a single giant PR.
- Prefer shipping a minimal working vertical slice (end-to-end) over many half-finished modules.

## 10. Speculative / Futuristic Modules（超夢幻模組）

ModernReader also has a long-term, highly speculative vision.
These features are **not realistically implementable today**, but the architecture should stay open for them.

### 10.1 Non-human languages (trees, dolphins, etc.)

Vision:
- In the far future, ModernReader could act as a hub for “non-human language” research:
  - trees, dolphins, birds, other species, or even abstract signals.

For now, what you (Copilot) should do:
- Do NOT pretend we can actually translate trees or dolphins.
- Design abstract interfaces and data schemas, such as:
  - `SignalStream` (time-series data)
  - `SignalToTextModel` interfaces
  - placeholder services for “species-specific language models”
- Build mock UI flows:
  - upload or stream signals
  - display hypothetical “decoded” structures (with clear labels that this is simulation / research UI)
- Make it explicit in comments and UI copy that this is speculative / research / simulation.

### 10.2 VR / AR integration

Vision:
- ModernReader as an immersive reading and learning environment using VR/AR.

For now:
- Design modular rendering layers so that:
  - the core reading engine is decoupled from the UI
  - later we can plug in VR/AR fronts (e.g. WebXR clients)
- You may:
  - create stub modules like `vr/` or `ar/` with interfaces
  - define how a “3D reading space” or “spatial annotation” might be represented in data
- Do NOT depend on any specific hardware SDK in core code; keep it optional and pluggable.

### 10.3 Bluetooth and external devices

Vision:
- Connect to e-paper devices, haptic feedback devices, custom controllers, etc.

For now:
- Define abstractions such as:
  - `Device` interface (id, type, capabilities)
  - `DeviceManager` to list / connect / disconnect devices
- Assume:
  - Platform-specific code (desktop, mobile, web) will implement these details later.
- Provide basic mocks/simulators for development and testing.

### 10.4 Experimental modules (including “dark” or critical ones)

We may have modules that are controversial, risky, or only for simulation (e.g., “execution module” in a fictional / educational context).

Rules:
- Never implement real-world harm or control systems.
- Such modules must:
  - be clearly fake / simulated
  - live in isolated namespaces (e.g. `sim_modules/`)
  - be documented as narrative / training / research tools only
- Focus on:
  - how such modules would be **interfaced with**, monitored, and sandboxed
  - logging, audit trails, and safety controls.

### 10.5 AGI / ASI–level assistants

Vision:
- ModernReader could one day host AGI/ASI-like agents that deeply understand content, user goals, and long-term learning plans.

Current reality:
- We only have LLM-based agents with limited capabilities.

For now:
- Design agent interfaces that:
  - separate “planner” vs “tool-executor” roles
  - keep a clear boundary between:
    - content understanding,
    - user modeling,
    - external actions (file edits, API calls).
- Implement today’s agents as:
  - bounded LLM-based assistants (with explicit tool APIs),
  - heavy logging and reversible actions.
- In comments and docs, label all AGI/ASI references as:
  - “future / hypothetical capability, simulated via current LLM agents”.

### 10.6 General rule for speculative features

When dealing with speculative / impossible features:
- Be honest in code and UI:
  - never claim real capabilities we don’t have.
- Focus on:
  - architectures,
  - interfaces,
  - mock data,
  - simulation flows,
  - safety and sandboxing.
- Keep the core system stable and maintainable even with these modules imagined.