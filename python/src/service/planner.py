"""Agent task planner and step-by-step orchestrator."""
from .orchestrator import Workflow, WorkflowStep, StepStatus
import uuid


class TaskPlanner:
    def __init__(self):
        self._workflows: dict[str, Workflow] = {}

    def create_plan(self, goal: str, steps: list[dict]) -> Workflow:
        wf = Workflow(id=str(uuid.uuid4()), context={'goal': goal})
        for s in steps:
            wf.add_step(name=s['name'], handler=s['handler'], **s.get('params', {}))
        self._workflows[wf.id] = wf
        return wf

    def get_plan(self, workflow_id: str) -> Workflow | None:
        return self._workflows.get(workflow_id)

    def mark_step(self, workflow_id: str, step_name: str, status: StepStatus, result=None, error=None):
        wf = self._workflows.get(workflow_id)
        if not wf:
            raise KeyError(f'Workflow {workflow_id} not found')
        for step in wf.steps:
            if step.name == step_name:
                step.status = status
                step.result = result
                step.error = error
                return
        raise KeyError(f'Step {step_name} not found in workflow {workflow_id}')