# TODO: Recheck pricing quarterly. Review pricing tables against official provider pages.
# Pricing rates are configured per 1,000,000 tokens as of the latest prompt creation.
PRICING_USD_PER_1M_TOKENS = {
    "openai": {
        "gpt-4o":      {"input": 2.50,  "output": 10.00},
        "gpt-4o-mini": {"input": 0.15,  "output": 0.60},
    },
    "anthropic": {
        "claude-sonnet-4-6":          {"input": 3.00,  "output": 15.00},
        "claude-haiku-4-5-20251001":  {"input": 0.80,  "output": 4.00},
    },
}

def calculate_cost(provider: str, model: str, input_tokens: int, output_tokens: int) -> float:
    """
    Returns cost in USD for a single generation call.
    Raises KeyError with a clear message if provider/model pricing is not configured --
    fail loudly rather than silently returning 0, since this feeds the dashboard's cost trends.
    """
    if provider not in PRICING_USD_PER_1M_TOKENS:
        raise KeyError(f"No pricing configured for provider='{provider}'. "
                        f"Add it to PRICING_USD_PER_1M_TOKENS before running cost-tracked tests.")
    
    if model not in PRICING_USD_PER_1M_TOKENS[provider]:
        raise KeyError(f"No pricing configured for model='{model}' under provider='{provider}'. "
                        f"Add it to PRICING_USD_PER_1M_TOKENS before running cost-tracked tests.")
        
    rates = PRICING_USD_PER_1M_TOKENS[provider][model]
    input_cost  = (input_tokens  / 1_000_000.0) * rates["input"]
    output_cost = (output_tokens / 1_000_000.0) * rates["output"]
    return round(input_cost + output_cost, 6)

def calculate_inr_estimate(usd_cost: float, usd_to_inr_rate: float = 84.0) -> float:
    """
    Rough INR conversion for founder-facing dashboard views.
    usd_to_inr_rate is a hardcoded estimate -- note that it is not live FX.
    """
    return round(usd_cost * usd_to_inr_rate, 4)
