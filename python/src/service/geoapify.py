"""Geoapify API client for geocoding and location lookup."""
import os
import requests

GEOAPIFY_KEY = os.getenv('GEOAPIFY_API_KEY', '')
BASE_URL = 'https://api.geoapify.com/v1'


def geocode(address: str) -> dict | None:
    """Convert a human-readable address to lat/lon."""
    if not GEOAPIFY_KEY:
        raise EnvironmentError('GEOAPIFY_API_KEY is not set')
    resp = requests.get(
        f'{BASE_URL}/geocode/search',
        params={'text': address, 'apiKey': GEOAPIFY_KEY},
        timeout=8,
    )
    resp.raise_for_status()
    features = resp.json().get('features', [])
    if not features:
        return None
    props = features[0]['properties']
    return {'lat': props['lat'], 'lon': props['lon'], 'formatted': props.get('formatted', '')}


def place_details(place_id: str) -> dict:
    resp = requests.get(
        f'{BASE_URL}/place-details',
        params={'id': place_id, 'apiKey': GEOAPIFY_KEY},
        timeout=8,
    )
    resp.raise_for_status()
    return resp.json()