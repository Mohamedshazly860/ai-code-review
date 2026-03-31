from apps.reviews.models import Review


def build_review_prompt(
    code_snippet: str,
    language: str,
    question: str = ''
) -> str:
    """
    Builds the prompt sent to the LLM.

    Why a dedicated function for this?
    Prompts are business logic. They'll evolve — you'll tweak wording,
    add examples, adjust the JSON schema. Keeping them here means
    you change one place and the whole system benefits.

    The prompt instructs the LLM to return strict JSON.
    This is critical — unstructured text can't be stored in our model fields.
    """

    # Get the human-readable language name (e.g., "Python" not "python")
    language_display = dict(Review.Language.choices).get(language, language)

    # Use the user's question or fall back to the default
    user_question = question.strip() if question.strip() else "Review this code"

    prompt = f"""You are an expert {language_display} code reviewer.
Your task is to analyze the following code and provide structured feedback.

User's request: {user_question}

Code to review:
```{language}
{code_snippet}
```

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
    "summary": "<2-3 sentence overall assessment>"
}}

Severity definitions:
- high: bugs, security vulnerabilities, or logic errors
- medium: code smells, performance issues, or poor practices
- low: style issues, naming conventions, minor improvements

If there are no issues, return an empty array for issues.
Quality score guide: 0-40 poor, 41-60 average, 61-80 good, 81-100 excellent.
"""
    return prompt