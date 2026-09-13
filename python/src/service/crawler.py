"""Web crawler utility for venue and place discovery."""
import requests
from bs4 import BeautifulSoup
from typing import Optional


def crawl_venue(url: str, timeout: int = 10) -> Optional[dict]:
    """Fetch and parse venue metadata from a given URL."""
    try:
        resp = requests.get(url, timeout=timeout, headers={'User-Agent': 'GeekcodeCrawler/1.0'})
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, 'html.parser')
        return {
            'title': soup.find('title').get_text(strip=True) if soup.find('title') else '',
            'description': _meta(soup, 'description'),
            'og_image': _meta(soup, 'og:image', prop=True),
            'url': url,
        }
    except Exception as exc:
        print(f'[crawler] error fetching {url}: {exc}')
        return None


def _meta(soup: BeautifulSoup, name: str, prop: bool = False) -> str:
    tag = soup.find('meta', attrs={'property' if prop else 'name': name})
    return tag['content'] if tag and tag.get('content') else ''