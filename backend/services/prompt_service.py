from apps.reviews.models import Review


def build_review_prompt(
    code_snippet: str,
    language: str,
    question: str = ''
) -> str:
    language_display = dict(Review.Language.choices).get(language, language)
    user_question = question.strip() if question.strip() else ''

    prompt = f"""You are an expert {language_display} code reviewer.

Code to review:
```{language}
{code_snippet}
```

{"User question: " + user_question if user_question else ""}

Respond ONLY with a valid JSON object — no explanation, no markdown, no extra text.
Use exactly this structure:

{{
    "issues": [
        {{
            "severity": "high|medium|low",
            "line": <line_number_or_null>,
            "title": "<short title>",
            "description": "<detailed explanation>"
        }}
    ],
    "suggestions": [
        {{
            "title": "<short title>",
            "description": "<detailed explanation>",
            "example": "<optional code example>"
        }}
    ],
    "quality_score": <integer 0-100>,
    "summary": "<2-3 sentence overall assessment of the code>",
    "question_answer": "{f'Directly answer this question about the code: {user_question}' if user_question else 'null'}"
}}

Rules:
- quality_score: 0-40 poor, 41-60 average, 61-80 good, 81-100 excellent
- If no issues found, return empty array for issues
- question_answer: if no question was asked set it to null, otherwise give a thorough direct answer
- severity: high = bugs/security, medium = performance/bad practices, low = style/naming
"""
    return prompt