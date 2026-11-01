"""Create MongoDB indexes and relationships for vendor collections."""
from .database import get_db


async def ensure_indexes():
    db = get_db()

    # Users
    await db['users'].create_index('email', unique=True)
    await db['users'].create_index('username')

    # Bookings
    await db['bookings'].create_index('user_id')
    await db['bookings'].create_index([('status', 1), ('created_at', -1)])

    # Payments
    await db['payments'].create_index('booking_id')
    await db['payments'].create_index('gateway_ref', sparse=True)

    # Conversations
    await db['conversations'].create_index('user_id')
    await db['conversations'].create_index('updated_at')

    # Tasks
    await db['tasks'].create_index([('user_id', 1), ('status', 1)])

    print('[db] indexes ensured')