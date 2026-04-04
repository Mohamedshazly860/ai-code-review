# backend/services/ai_service.py

import json
import logging
import time

import httpx
from django.conf import settings

from .prompt_service import build_review_prompt

logger = logging.getLogger(__name__)

REQUEST_TIMEOUT = 60


class AIServiceError(Exception):
    pass


class AIService:
    def __init__(self):
        self.api_key = settings.AI_API_KEY
        self.base_url = settings.AI_BASE_URL
        self.model = settings.AI_MODEL
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
        }

    def generate_review(self, code_snippet: str, language: str, question: str = '') -> dict:
        prompt = build_review_prompt(code_snippet, language, question)

        payload = {
            'model': self.model,
            'messages': [
                {
                    'role': 'system',
                    'content': (
                        'You are an expert code reviewer. '
                        'Always respond with valid JSON only. '
                        'Never include markdown, explanations, or text outside the JSON object.'
                    )
                },
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            'temperature': 0.3,
            'max_tokens': 2000,
        }

        logger.info(f"Sending review request [{self.model}]")
        max_retries = 3

        for attempt in range(max_retries):
            try:
                response = httpx.post(
                    f'{self.base_url}/chat/completions',
                    headers=self.headers,
                    json=payload,
                    timeout=REQUEST_TIMEOUT,
                )
                response.raise_for_status()
                break  # Success — exit retry loop

            except httpx.HTTPStatusError as e:
                if e.response.status_code == 429 and attempt < max_retries - 1:
                    wait = 2 ** attempt
                    logger.warning(f"Rate limited, retrying in {wait}s (attempt {attempt + 1})")
                    time.sleep(wait)
                    continue
                elif e.response.status_code == 429:
                    raise AIServiceError("AI service is busy. Please try again in a moment.")
                logger.error(f"HTTP error: {e.response.status_code} - {e.response.text}")
                raise AIServiceError(f"AI service returned an error: {e.response.status_code}")

            except httpx.TimeoutException:
                raise AIServiceError("The AI service timed out. Please try again.")

            except httpx.RequestError as e:
                raise AIServiceError(f"Could not connect to AI service: {str(e)}")
        else:
            raise AIServiceError("AI service is busy after multiple retries. Please try again.")

        raw_content = response.json()['choices'][0]['message']['content']
        logger.info("Response received, parsing...")
        return self._parse_response(raw_content)

    def _parse_response(self, raw_content: str) -> dict:
        content = raw_content.strip()
        if content.startswith('```'):
            lines = content.split('\n')
            content = '\n'.join(lines[1:-1])

        try:
            parsed = json.loads(content)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse response as JSON: {str(e)}")
            logger.error(f"Raw content: {raw_content[:500]}")
            raise AIServiceError("AI returned an unexpected response format.")

        return {
            'issues': parsed.get('issues', []),
            'suggestions': parsed.get('suggestions', []),
            'quality_score': self._safe_score(parsed.get('quality_score')),
            'summary': parsed.get('summary', ''),
            'raw_response': raw_content,
        }

    def _safe_score(self, score) -> int | None:
        try:
            score = int(score)
            return max(0, min(100, score))
        except (TypeError, ValueError):
            return None


ai_service = AIService()