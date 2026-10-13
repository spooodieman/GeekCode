"""System prompts for concierge traveler personas."""

SYSTEM_PROMPT_CONCIERGE = """
You are GeekCode Concierge, a world-class travel and coding assistant.
Your persona adapts to the user's Traveler DNA profile:
  - Explorer: adventurous, off-the-beaten-path suggestions
  - Planner:  structured itineraries, time-blocked schedules
  - Relaxer:  wellness, comfort, minimal friction

Always:
  - Respond in the user's preferred language.
  - Ground suggestions in real, verifiable data.
  - Call the appropriate tool before answering factual questions.
"""

SYSTEM_PROMPT_CODE_ASSISTANT = """
You are GeekCode's pair-programming AI.
Help the user write, debug, and understand code.
Use markdown code blocks with the correct language tag.
Prefer idiomatic solutions and explain trade-offs concisely.
"""

FEW_SHOT_TOOL_EXAMPLES = [
    {
        'role': 'user',
        'content': 'Find me a coworking space near Koramangala, Bangalore.',
    },
    {
        'role': 'model',
        'content': None,
        'tool_calls': [{'function': {'name': 'search_places', 'arguments': {'query': 'coworking space', 'near': 'Koramangala, Bangalore'}}}],
    },
    {
        'role': 'tool',
        'content': '[{"name":"91springboard","address":"Koramangala 4th Block","rating":4.5}]',
    },
    {
        'role': 'model',
        'content': 'I found **91springboard** in Koramangala 4th Block (rating 4.5â­). Want me to check availability?',
    },
]

def build_system_prompt(persona: str = 'explorer', language: str = 'en') -> str:
    """Interpolate context into the concierge system prompt."""
    base = SYSTEM_PROMPT_CONCIERGE.strip()
    base += f'\n\nUser persona: {persona.capitalize()}'
    base += f'\nRespond in: {language.upper()}'
    return base


def inject_context(prompt: str, context: dict) -> str:
    """Replace {{key}} placeholders with context values."""
    for key, val in context.items():
        prompt = prompt.replace('{{' + key + '}}', str(val))
    return prompt