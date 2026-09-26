"""Asynchronous task queuing and execution dispatcher."""
import asyncio
from typing import Callable, Any
from collections import deque


class TaskDispatcher:
    def __init__(self, max_concurrent: int = 5):
        self._queue: deque = deque()
        self._semaphore = asyncio.Semaphore(max_concurrent)
        self._handlers: dict[str, Callable] = {}

    def register(self, name: str, handler: Callable):
        """Register a named async handler."""
        self._handlers[name] = handler

    async def dispatch(self, handler_name: str, **kwargs) -> Any:
        """Dispatch a task to its registered handler."""
        handler = self._handlers.get(handler_name)
        if not handler:
            raise ValueError(f'No handler registered for: {handler_name}')
        async with self._semaphore:
            return await handler(**kwargs)

    async def dispatch_batch(self, tasks: list[dict]) -> list[Any]:
        """Run multiple dispatch calls concurrently."""
        coros = [self.dispatch(t['handler'], **t.get('params', {})) for t in tasks]
        return await asyncio.gather(*coros, return_exceptions=True)