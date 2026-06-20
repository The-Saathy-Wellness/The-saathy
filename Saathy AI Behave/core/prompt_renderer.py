import re

def render_prompt(template: str, variables: dict) -> str:
    """
    Replaces {{variable_name}} placeholders in a prompt template.
    Used for injecting test-time context like {{user_language}} or {{support_style}}
    into a saved prompt_text without storing separate prompt copies per language.
    """
    def replacer(match):
        key = match.group(1).strip()
        if key not in variables:
            raise ValueError(f"Template variable '{{{{{key}}}}}' has no value provided in variables dict.")
        return str(variables[key])
    return re.sub(r"\{\{(.*?)\}\}", replacer, template)
