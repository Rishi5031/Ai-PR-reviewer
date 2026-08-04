# pyrefly: ignore [missing-import]
from sqlalchemy.orm import DeclarativeBase
from typing import Any

class Base(DeclarativeBase):
    id: Any
    __name__: str
