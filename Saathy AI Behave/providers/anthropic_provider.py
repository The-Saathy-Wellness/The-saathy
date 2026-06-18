import time
from anthropic import Anthropic
from .base import BaseProvider, GenerationResult

class AnthropicProvider(BaseProvider):
    def __init__(self, api_key: str):
        self.client = Anthropic(api_key=api_key)

    def list_models(self) -> list[str]:
        return ["claude-sonnet-4-6", "claude-haiku-4-5-20251001"]

    def generate(self, system_prompt: str, user_message: str, model: str = "claude-sonnet-4-6",
                 max_tokens: int = 500, temperature: float = 0.7) -> GenerationResult:
        start = time.time()
        resp = self.client.messages.create(
            model=model,
            system=system_prompt,
            messages=[{"role": "user", "content": user_message}],
            max_tokens=max_tokens,
            temperature=temperature,
        )
        latency_ms = int((time.time() - start) * 1000)
        return GenerationResult(
            response_text=resp.content[0].text,
            input_tokens=resp.usage.input_tokens,
            output_tokens=resp.usage.output_tokens,
            latency_ms=latency_ms,
            raw_response=resp.model_dump(),
        )
