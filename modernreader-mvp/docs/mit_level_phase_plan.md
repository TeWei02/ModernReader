# MIT-Level Phase Plan (Post-MVP)

This document defines the next milestones after MVP demo completion.

## Phase 1: Reliable Data Infrastructure (2-4 weeks)

Goals:
- Stabilize signal ingestion for audio + environment nodes.
- Build reproducible dataset export pipeline from `history.db`.
- Define labeling protocol for state quality checks.

Deliverables:
- `backend/research/export_dataset.py` used for periodic dataset snapshots.
- `datasets/signals_dataset.csv` generated and versioned.
- Data quality report: missing values, class balance, node uptime.

## Phase 2: Baseline ML Upgrade (4-6 weeks)

Goals:
- Replace pure rule-based inference with a benchmark model while keeping API unchanged.
- Compare rule engine vs ML model on same validation split.

Deliverables:
- Training script with deterministic seed and metrics logging.
- Validation metrics (accuracy/F1/confusion matrix).
- Rollback-safe inference switch (`RULES` vs `ML_BASELINE`).

## Phase 3: Multimodal Fusion and Research Rigor (6-10 weeks)

Goals:
- Add time-window features and sequence-level modeling.
- Introduce experiment tracking and scenario-level evaluation.

Deliverables:
- Feature extraction pipeline for rolling windows.
- Experiment registry (run_id, params, metrics).
- Scenario-level robustness tests (quiet/rush/anomaly).

## Phase 4: Tangible Interface Expansion (6-12 weeks)

Goals:
- Expand output semantics beyond single node.
- Introduce output orchestration (priority, decay, conflict handling).

Deliverables:
- Multi-output mapping profiles.
- Node health monitor and fail-safe mode.
- Hardware integration notes for larger output arrays.

## Phase 5: Advanced Platform Direction (long-term)

Goals:
- AR/VR front-end plugin layer.
- Agent + memory layer for proactive exploration workflows.
- Speculative modules isolated as simulation-only.

Deliverables:
- Interface contracts for AR/VR adapters.
- Agent action logging and reversible execution framework.
- Safety documentation for simulated speculative modules.

## Immediate Next 3 Tasks

1. Collect 3 clean demo runs using `backend/run_demo.py` and archive logs.
2. Export first dataset snapshot with `backend/research/export_dataset.py`.
3. Start baseline ML branch while preserving current API contract.
