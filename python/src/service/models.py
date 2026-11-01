"""Mongoose-equivalent document schemas using Pydantic + Motor."""
from pydantic import BaseModel, Field
from datetime import datetime, timezone
from typing import Optional
import uuid


def _now(): return datetime.now(timezone.utc)
def _uid(): return str(uuid.uuid4())


class Booking(BaseModel):
    id:          str      = Field(default_factory=_uid)
    user_id:     str
    venue_name:  str
    date:        datetime
    status:      str      = 'pending'   # pending | confirmed | cancelled
    created_at:  datetime = Field(default_factory=_now)


class Quote(BaseModel):
    id:          str      = Field(default_factory=_uid)
    booking_id:  str
    amount:      float
    currency:    str      = 'INR'
    valid_until: datetime
    created_at:  datetime = Field(default_factory=_now)


class Payment(BaseModel):
    id:          str      = Field(default_factory=_uid)
    booking_id:  str
    quote_id:    str
    amount:      float
    status:      str      = 'pending'   # pending | success | failed
    gateway_ref: Optional[str] = None
    paid_at:     Optional[datetime] = None
    created_at:  datetime = Field(default_factory=_now)