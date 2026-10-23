# 📖 ModernReader

**Language:** [![中文](https://img.shields.io/badge/中文-简体-0ea5e9?style=flat-square&logo=readme&logoColor=white)](README.md) [![English](https://img.shields.io/badge/English-English-f59e0b?style=flat-square&logo=readme&logoColor=white)](README.en.md)

> **Read with Rhythm. Feel the Words.**
> Turn long-form reading into a multi-sensory, rhythm-driven experience — comprehension, pacing, and emotion, aligned.

[![Demo](https://img.shields.io/badge/Live%20Demo-Online-38BDF8?style=flat-square)](https://tewei02.github.io/ModernReader/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://github.com/TeWei02/ModernReader/blob/main/Dockerfile)
[![PWA](https://img.shields.io/badge/PWA-Yes-5A0FC8?style=flat-square&logo=pwa&logoColor=white)](https://github.com/TeWei02/ModernReader)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://github.com/TeWei02/ModernReader)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)](https://github.com/TeWei02/ModernReader)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://github.com/TeWei02/ModernReader/blob/main/LICENSE)
[![Hackathon Finalist](https://img.shields.io/badge/2026%20Cross-Strait%20Entrepreneurship%20Competition-Finalist-22c55e?style=flat-square)](https://github.com/TeWei02/ModernReader)

---

## Why ModernReader?

Reading long text is exhausting. Your eyes fatigue, your mind wanders, and plain TTS sounds like a robot reading a manual.

**ModernReader** is a multi-sensory AI reading system built on the **CRA model (Comprehension-Rhythm-Affect)** — it synchronizes what you *see*, what you *hear*, and what you *feel* into a breathing, rhythm-aware reading flow. Built for deep readers, students, and anyone with attention or visual fatigue who deserves a calmer way to read.

🏆 Finalist — 2026 Cross-Strait (Straits) Entrepreneurship Competition

---

## ✨ Features

| Feature | What it does |
|---|---|
| 📥 Multi-format ingestion | Import **Markdown / EPUB / TXT**, parsed by a dedicated TypeScript core |
| 🎙️ Rhythm-driven voice guide | **ElevenLabs TTS** integration + local **gTTS/ffmpeg** ambient podcast generation |
| 💗 Emotion-aware reading | Emotion tagging & analysis over **joy / sadness / anger / fear / surprise / disgust** (EN & ZH), plus a **CoreML LSTM** pipeline accelerated by Apple Neural Engine (`EmotionLSTM.mlpackage`) |
| 🧠 AI summary & generation | FastAPI endpoints `/analyze_image` & `/generate_content` — **Google Vision OCR + GPT-4**, with graceful degradation fallback |
| 🎛️ Multi-sensory orchestration | **5 Agents** (Orchestrator / Reader / Emotion / Device / Memory) + **7 Connectors**, mapping emotions to TTS / haptics / ambient cues |
| 📱 Everywhere | **PWA** web app + desktop demo + **Capacitor** mobile shell |
| 🐳 Ship it | **Docker** + CI/CD workflow out of the box |

---

## 🏗 Architecture — The CRA Model

**C**omprehension · **R**hythm · **A**ffect — three layers working together:

```
┌─────────────────────────────────────────────────────────┐
│                    ModernReader Core                    │
├──────────────┬─────────────┬──────────────────────────┤
│ Comprehension│    Rhythm    │         Affect            │
│  parsing /   │  pacing &    │  emotion analysis &       │
│  structure   │  TTS timing  │  multi-sensory mapping    │
└──────────────┴──────────────┴─────────────────────────┘
        ▲                ▲                 ▲
        └── Orchestrator ─┴─ 5 Agents ──┴── 7 Connectors ─┘
                 emotion → TTS / haptics / ambient
```

- **Comprehension** — content parsing, structure extraction, AI-assisted summarization
- **Rhythm** — reading pacing control, rhythm-aware TTS, ambient audio mixing
- **Affect** — keyword & LSTM-based emotion detection, mapped to sensory output

Full design: [`ARCHITECTURE.md`](https://github.com/TeWei02/ModernReader/blob/main/ARCHITECTURE.md) · [`docs/PRODUCT_VISION.md`](https://github.com/TeWei02/ModernReader/blob/main/docs/PRODUCT_VISION.md)

---

## 🚀 Quick Start

```bash
# Docker (recommended)
docker compose up --build

# Local development — see QUICK_START.md for full setup
```

📖 Step-by-step: [`QUICK_START.md`](https://github.com/TeWei02/ModernReader/blob/main/QUICK_START.md)

---

## 🧰 Tech Stack

Python · TypeScript · FastAPI · SQLite · CoreML · GPT-4 · Google Vision · ElevenLabs · gTTS · ffmpeg · PWA · Capacitor · Docker · GitHub Actions

| Layer | Tech |
|---|---|
| Backend | Python · FastAPI · SQLite |
| Frontend | TypeScript · PWA · Capacitor (mobile) |
| AI/NLP | CoreML LSTM · GPT-4 · Google Vision OCR · affective computing |
| Speech | ElevenLabs · gTTS · ffmpeg |
| Ops | Docker · docker-compose · GitHub Actions |

---

## 🗺 Roadmap

- [x] Multi-format ingestion & rhythm TTS
- [x] Emotion tagging + CoreML emotion pipeline
- [x] AI summary / content generation with fallback
- [ ] Attention-focused UI modes (visual rhythm interface)
- [ ] Deeper multi-sensory output (haptics / ambient devices)
- [ ] Learning-assist AI companion

*See [`CHANGELOG.md`](https://github.com/TeWei02/ModernReader/blob/main/CHANGELOG.md) for release history.*

---

## 🤝 Contributing

Star it ⭐, open an issue 💬, or send a PR 🚀 — see [`CONTRIBUTING.md`](https://github.com/TeWei02/ModernReader/blob/main/CONTRIBUTING.md).

**Docs:** [`ARCHITECTURE.md`](https://github.com/TeWei02/ModernReader/blob/main/ARCHITECTURE.md) · [`IMPLEMENTATION.md`](https://github.com/TeWei02/ModernReader/blob/main/IMPLEMENTATION.md) · [`QUICK_START.md`](https://github.com/TeWei02/ModernReader/blob/main/QUICK_START.md) · [`docs/`](https://github.com/TeWei02/ModernReader/tree/main/docs)

---

## 📄 License

MIT © Te-Wei Ko (柯德瑋)
