# AI-Reader (Archived) — Project H.O.L.O.

[![Python](https://img.shields.io/badge/Python-3.12+-%233776AB?logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-%23009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![CI](https://github.com/TeWei02/AI-Reader/actions/workflows/ci.yml/badge.svg)](https://github.com/TeWei02/AI-Reader/actions/workflows/ci.yml)

> **Archived** — This repository has been merged into [ModernReader](https://github.com/TeWei02/ModernReader).
> All code now lives under the `holo/` subdirectory of ModernReader.
> Please visit [ModernReader](https://github.com/TeWei02/ModernReader) for the latest updates.

## Original Description

**AI-Reader / Project H.O.L.O.** — An AI framework that deconstructs text through deep semantic analysis, then reconstructs narrative through generative AI to engage the full spectrum of human perception (visual, auditory, and beyond).

故事的核心在於體驗，而非僅是文字。數百年來，我們透過視覺解碼符號來理解故事，但文字本身僅是通往故事世界的媒介。Project H.O.L.O. 的使命，就是打破這個限制。

## Features

- **Multi-Sensory Narrative** — Auditory, visual, and textual modality analysis
- **Semantic Ingestion** — Intelligent content parsing and structuring
- **Quantum Analysis** — Quantum-inspired semantic similarity computation
- **Social Reading** — Collaborative annotations and shared bookmarks
- **Cross-Platform** — Web frontend (Vite + Capacitor) + Python backend (FastAPI)

## Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | Python 3.12+, FastAPI |
| Frontend | Vite, Capacitor (iOS/Android) |
| Container | Docker, Docker Compose |
| TTS | ElevenLabs API |
| Database | SQLite / PostgreSQL |

## Project Structure

```
AI-Reader/
├── holo/                  # H.O.L.O. core engine
│   ├── ingestion/         # Content ingestion pipeline
│   ├── sensory/           # Multi-sensory modality modules
│   ├── auditory/          # Audio/TTS processing
│   ├── lang/              # Language processing
│   ├── quantum/           # Quantum semantic analysis
│   ├── database/          # Data persistence layer
│   └── auth/              # Authentication
├── web/
│   ├── backend/           # FastAPI backend
│   └── frontend/          # Vite + Capacitor frontend
├── app/mobile/            # Mobile app config
├── tests/                 # Test suite
├── docker/                # Docker configs
└── README.md
```

## Quick Start

```bash
# Backend
pip install -r web/backend/requirements.txt
python web/backend/main.py

# Frontend
cd web/frontend
npm install
npm run dev

# Docker
docker compose up
```

## License

MIT — Copyright (c) 2026 TeWei02 (kedewei)
