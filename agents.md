# AI Usage Log

This document registers how AI was used in developing the "ai-expense-tracker".

1. **Architecture & Setup**:
   The user requested a full-stack Flask + React application with PostgreSQL and OpenAI integration. AI created the complete robust baseline, including app factory patterns and file structures.

2. **OpenAI parsing mechanism**:
   We used `gpt-4o-mini` via chat completions to parse natural language text into structured JSON. A strictly defined JSON schema ensures robust extraction. Prompt engineering heavily controls output format, fallback values, and edge-cases (amount null or defaulting to today's date). A plain-python fallback parser intercepts failures.

3. **Validation of Code**:
   Validation logic was enforced both in the API routes using basic type checking and in the openAI service with a robust fallback.
