import pytest
from core.cost_calculator import calculate_cost, calculate_inr_estimate, PRICING_USD_PER_1M_TOKENS

def test_calculate_cost_openai_gpt_4o():
    # OpenAI gpt-4o pricing: Input 2.50 / 1M, Output 10.00 / 1M
    # Testing 2M inputs, 1M outputs
    # Expected: (2 * 2.50) + (1 * 10.00) = 5.00 + 10.00 = 15.00
    cost = calculate_cost("openai", "gpt-4o", 2_000_000, 1_000_000)
    assert cost == 15.00

def test_calculate_cost_openai_gpt_4o_mini():
    # OpenAI gpt-4o-mini pricing: Input 0.15 / 1M, Output 0.60 / 1M
    # Testing 1M inputs, 2M outputs
    # Expected: (1 * 0.15) + (2 * 0.60) = 0.15 + 1.20 = 1.35
    cost = calculate_cost("openai", "gpt-4o-mini", 1_000_000, 2_000_000)
    assert cost == 1.35

def test_calculate_cost_anthropic_sonnet():
    # Anthropic claude-sonnet-4-6 pricing: Input 3.00 / 1M, Output 15.00 / 1M
    # Testing 500,000 inputs, 500,000 outputs
    # Expected: (0.5 * 3.00) + (0.5 * 15.00) = 1.50 + 7.50 = 9.00
    cost = calculate_cost("anthropic", "claude-sonnet-4-6", 500_000, 500_000)
    assert cost == 9.00

def test_calculate_cost_unsupported_provider():
    # Verify KeyError on unsupported provider
    with pytest.raises(KeyError) as exc_info:
        calculate_cost("unsupported_provider", "gpt-4o", 100, 100)
    assert "No pricing configured for provider='unsupported_provider'" in str(exc_info.value)

def test_calculate_cost_unsupported_model():
    # Verify KeyError on unsupported model
    with pytest.raises(KeyError) as exc_info:
        calculate_cost("openai", "claude-sonnet-4-6", 100, 100)
    assert "No pricing configured for model='claude-sonnet-4-6' under provider='openai'" in str(exc_info.value)

def test_calculate_inr_estimate():
    # Verify USD to INR mapping
    # Expected: 10.0 * 84.0 = 840.0
    val = calculate_inr_estimate(10.0, usd_to_inr_rate=84.0)
    assert val == 840.0

    # Default FX rate testing
    val_default = calculate_inr_estimate(1.0)
    assert val_default == 84.0
