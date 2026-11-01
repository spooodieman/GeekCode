"""MongoDB connection and mongoose lifecycle hooks (via Motor async driver)."""
import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/geekcode')
_client: AsyncIOMotorClient | None = None


def get_db():
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(MONGO_URI)
    return _client['geekcode']


async def close_db():
    global _client
    if _client:
        _client.close()
        _client = None