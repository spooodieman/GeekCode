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

class OrchestratorEngine:
    """Drive a Workflow through its steps, managing state transitions."""

    def __init__(self, dispatcher):
        self.dispatcher = dispatcher

    async def run(self, workflow: Workflow) -> Workflow:
        for step in workflow.steps:
            step.status = StepStatus.RUNNING
            try:
                step.result = await self.dispatcher.dispatch(step.handler, **step.params)
                step.status = StepStatus.COMPLETED
            except Exception as exc:
                step.status = StepStatus.FAILED
                step.error = str(exc)
                break   # halt on first failure
        return workflow