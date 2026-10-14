"""Function calling declarations for Gemini tool execution."""
from google.generativeai.types import FunctionDeclaration, Tool

search_places_fn = FunctionDeclaration(
    name='search_places',
    description='Search for venues or places of interest near a location.',
    parameters={
        'type': 'object',
        'properties': {
            'query': {'type': 'string', 'description': 'What to search for, e.g. coffee shop'},
            'near':  {'type': 'string', 'description': 'Location context, e.g. Koramangala Bangalore'},
            'limit': {'type': 'integer', 'description': 'Max results to return (default 5)'},
        },
        'required': ['query', 'near'],
    },
)

execute_code_fn = FunctionDeclaration(
    name='execute_code',
    description='Execute a snippet of Python code and return stdout/stderr.',
    parameters={
        'type': 'object',
        'properties': {
            'code': {'type': 'string', 'description': 'Python source code to execute'},
        },
        'required': ['code'],
    },
)

GEEKCODE_TOOLS = Tool(function_declarations=[search_places_fn, execute_code_fn])