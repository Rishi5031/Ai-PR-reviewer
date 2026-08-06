import uuid
from datetime import datetime, timezone
# pyrefly: ignore [missing-import]
from sqlalchemy import String, Integer, DateTime
# pyrefly: ignore [missing-import]
from sqlalchemy.dialects.postgresql import UUID, JSONB
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base
 
class RepositorySettings(Base):
    __tablename__ = "repository_settings"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    repository_id: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    
    ai_model: Mapped[str] = mapped_column(String, nullable=False, default="gemini-2.5-flash")
    review_strictness: Mapped[str] = mapped_column(String, nullable=False, default="medium")
    
    # Store ignore file patterns as JSON array
    ignore_files: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    
    coverage_threshold: Mapped[int] = mapped_column(Integer, nullable=False, default=80)
    max_tokens: Mapped[int] = mapped_column(Integer, nullable=False, default=5000)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
