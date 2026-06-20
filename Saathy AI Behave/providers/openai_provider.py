import time
from openai import OpenAI
from .base import BaseProvider, GenerationResult

class OpenAIProvider(BaseProvider):
    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)

    def list_models(self) -> list[str]:
        return ["gpt-4o", "gpt-4o-mini"]

    def generate(self, system_prompt: str, user_message: str, model: str = "gpt-4o",
                 max_tokens: int = 500, temperature: float = 0.7) -> GenerationResult:
        start = time.time()
        resp = self.client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            max_tokens=max_tokens,
            temperature=temperature,
        )
        latency_ms = int((time.time() - start) * 1000)
        return GenerationResult(
            response_text=resp.choices[0].message.content,
            input_tokens=resp.usage.prompt_tokens,
            output_tokens=resp.usage.completion_tokens,
            latency_ms=latency_ms,
            raw_response=resp.model_dump(),
        )
