"""Telegram and multichannel notification handlers."""
import os
import requests

TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN', '')
TELEGRAM_API       = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}'


def send_telegram(chat_id: str, text: str) -> bool:
    """Send a message via Telegram Bot API."""
    if not TELEGRAM_BOT_TOKEN:
        print('[notifications] TELEGRAM_BOT_TOKEN not set â€“ skipping')
        return False
    resp = requests.post(
        f'{TELEGRAM_API}/sendMessage',
        json={'chat_id': chat_id, 'text': text, 'parse_mode': 'Markdown'},
        timeout=5,
    )
    return resp.ok


class NotificationRouter:
    """Route alerts to the appropriate channel based on user preferences."""

    def __init__(self):
        self._channels: dict[str, callable] = {
            'telegram': send_telegram,
        }

    def notify(self, channel: str, recipient: str, message: str) -> bool:
        handler = self._channels.get(channel)
        if not handler:
            print(f'[notifications] unknown channel: {channel}')
            return False
        return handler(recipient, message)