"""Workflow orchestration pipeline architecture."""
from __future__ import annotations
from dataclasses import dataclass, field
from enum import Enum
from typing import Any


class StepStatus(str, Enum):
    PENDING   = 'pending'
    RUNNING   = 'running'
    COMPLETED = 'completed'
    FAILED    = 'failed'


@dataclass
class WorkflowStep:
    name: str
    handler: str
    params: dict[str, Any] = field(default_factory=dict)
    status: StepStatus = StepStatus.PENDING
    result: Any = None
    error: str | None = None


@dataclass
class Workflow:
    id: str
    steps: list[WorkflowStep] = field(default_factory=list)
    context: dict[str, Any] = field(default_factory=dict)

    def add_step(self, name: str, handler: str, **params) -> 'Workflow':
        self.steps.append(WorkflowStep(name=name, handler=handler, params=params))
        return self