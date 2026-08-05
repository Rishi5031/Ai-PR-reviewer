import os

SUPPORTED_EXTENSIONS = {
    ".py", ".ts", ".tsx", ".js", ".jsx",
    ".java", ".go", ".cs", ".cpp", ".c",
    ".json", ".yml", ".yaml"
}

IGNORED_FILES = {
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml"
}

IGNORED_DIRECTORIES = {
    "dist",
    "build",
    "node_modules"
}

def is_file_supported(filename: str) -> bool:
    """
    Check if a file should be included in the AI review based on rules.
    """
    # 1. Check ignored file names
    base_name = os.path.basename(filename)
    if base_name in IGNORED_FILES:
        return False
        
    # 2. Check ignored directories
    parts = filename.replace("\\", "/").split("/")
    for part in parts:
        if part in IGNORED_DIRECTORIES:
            return False
            
    # 3. Check extension
    _, ext = os.path.splitext(filename)
    if ext.lower() not in SUPPORTED_EXTENSIONS:
        return False
        
    return True

def clean_markdown_json(text: str) -> str:
    """
    Clean markdown formatting from Gemini response (e.g. ```json ... ```).
    """
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
        
    if text.endswith("```"):
        text = text[:-3]
        
    return text.strip()
