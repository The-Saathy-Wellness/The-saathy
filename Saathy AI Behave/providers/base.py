from abc import ABC, abstractmethod
from dataclasses import dataclass

@dataclass
class GenerationResult:
    response_text: str
    input_tokens: int
    output_tokens: int
    latency_ms: int
    raw_response: dict

class BaseProvider(ABC):
    @abstractmethod
    def generate(self, system_prompt: str, user_message: str, model: str,
                 max_tokens: int = 500, temperature: float = 0.7) -> GenerationResult:
        """
        Executes a completion run using the provider SDK.
        The system prompt and user message are combined differently by each provider.
        """
        pass

    @abstractmethod
    def list_models(self) -> list[str]:
        """Returns the list of supported model identifiers for this provider."""
        pass
