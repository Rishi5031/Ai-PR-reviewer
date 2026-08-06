import os
import base64
# pyrefly: ignore [missing-import]
from cryptography.fernet import Fernet
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

# Try to get the key from the environment
_ENCRYPTION_KEY_STR = settings.ENCRYPTION_KEY

print("KEY:", repr(_ENCRYPTION_KEY_STR))
print("LENGTH:", len(_ENCRYPTION_KEY_STR))

if not _ENCRYPTION_KEY_STR:
    logger.warning("ENCRYPTION_KEY environment variable is missing. Using a fallback key for development. DO NOT USE IN PRODUCTION.")
    # Fallback key must be 32 url-safe base64-encoded bytes
    # Fernet.generate_key() generates one, here's a hardcoded one for dev fallback
    _ENCRYPTION_KEY_STR = b'4K6F-rF0Yt0z1nK0T7Z6C4A6F-rF0Yt0z1nK0T7Z6C4='.decode('utf-8')

# Ensure the key is exactly 32 url-safe base64 bytes for Fernet
try:
    _fernet = Fernet(_ENCRYPTION_KEY_STR.encode("utf-8"))
except Exception as e:
    raise RuntimeError(
        f"Invalid ENCRYPTION_KEY: {e}"
    )

def encrypt_token(token: str) -> str:
    """Encrypts a raw string token."""
    if not token:
        return ""
    encrypted_bytes = _fernet.encrypt(token.encode('utf-8'))
    return encrypted_bytes.decode('utf-8')

def decrypt_token(encrypted_token: str) -> str:
    """Decrypts an encrypted string token."""
    if not encrypted_token:
        return ""
    decrypted_bytes = _fernet.decrypt(encrypted_token.encode('utf-8'))
    return decrypted_bytes.decode('utf-8')
