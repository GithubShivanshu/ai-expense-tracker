import os
import json
import logging
from datetime import datetime
from openai import OpenAI

logger = logging.getLogger(__name__)

# System instructions to guarantee highly formatted JSON
SYSTEM_PROMPT = """
You are a highly capable AI specialized in parsing free-form text into expense records.
You MUST extract the following information from the user's text and return it as a JSON object strictly matching this schema:
{
  "title": "<string> (Brief description of the expense)",
  "amount": <number> (The parsed numerical value. If none found, return null),
  "category": "<string> (Categorize logically. e.g., 'Food', 'Transport', 'Entertainment', 'Housing', 'Utilities', 'Misc')",
  "date": "<string in YYYY-MM-DD format> (If date is unspecified, assume today's date)"
}

Rules:
1. ONLY output raw, valid JSON. Do not return markdown blocks, markdown ticks, or conversational text.
2. If the user mentions "today" or implied dates, set it to the provided Today's Date.
3. If no amount is given, set "amount" to null.
4. If no explicit category is found, infer one logically or default to "Misc".
"""

def parse_expense_text(text: str) -> dict:
    today_str = datetime.now().date().isoformat()
    api_key = os.getenv("OPENAI_API_KEY")

    # If no API key, skip OpenAI and use fallback immediately
    if not api_key or api_key == "sk-REPLACE_ME":
        logger.warning("OPENAI_API_KEY not configured. Using fallback parser.")
        return attempt_fallback_parse(text, today_str)

    client = OpenAI(api_key=api_key)
    prompt = f"Today's date is {today_str}.\n\nParse this expense:\n\"{text}\""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT.strip()},
                {"role": "user", "content": prompt}
            ],
            temperature=0.0
        )

        reply = response.choices[0].message.content.strip()

        # Remove markdown wrappers if present
        if reply.startswith("```json"):
            reply = reply[7:]
        if reply.startswith("```"):
            reply = reply[3:]
        if reply.endswith("```"):
            reply = reply[:-3]

        reply = reply.strip()
        data = json.loads(reply)

        return {
            "title": data.get("title", "Unknown"),
            "amount": data.get("amount"),
            "category": data.get("category", "Misc"),
            "date": data.get("date", today_str)
        }

    except Exception as e:
        logger.error(f"OpenAI service failed: {e}")
        return attempt_fallback_parse(text, today_str)

def attempt_fallback_parse(text: str, default_date: str) -> dict:
    """Fallback if OpenAI call fails"""
    words = text.split()
    amount = None
    for w in words:
        w_cleaned = "".join(c for c in w if c.isdigit() or c == '.')
        try:
            val = float(w_cleaned)
            if val > 0:
                amount = val
                break
        except ValueError:
            continue

    return {
        "title": text[:50],  # just take the start of the text
        "amount": amount,
        "category": "Misc",
        "date": default_date
    }
