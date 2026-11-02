"""Root agent loop with autonomous decision-making."""
from __future__ import annotations
import uuid
from .gemini_service import get_client, generate_with_retry
from .gemini_tools import GEEKCODE_TOOLS
from .prompts import build_system_prompt
from .guardrails import sanitize_input, check_output
from .models import Conversation, Message


class GeekCodeAgent:
    """Autonomous agent that plans and executes multi-step tasks."""

    def __init__(self, persona: str = 'explorer', language: str = 'en'):
        self.persona   = persona
        self.language  = language
        self.model     = get_client()
        self.system    = build_system_prompt(persona, language)
        self.session_id = str(uuid.uuid4())

    def run(self, user_input: str, conversation: Conversation) -> str:
        """Single-turn agent step: sanitize â†’ decide â†’ act â†’ respond."""
        clean = sanitize_input(user_input)
        conversation.messages.append(Message(role='user', content=clean))

        history = '\n'.join(f'{m.role.upper()}: {m.content}' for m in conversation.messages[-10:])
        full_prompt = f'{self.system}\n\n{history}\nMODEL:'

        raw = generate_with_retry(self.model, full_prompt)
        reply = check_output(raw)
        conversation.messages.append(Message(role='model', content=reply))
        return reply