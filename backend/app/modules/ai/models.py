import uuid
from datetime import datetime, timezone
# pyrefly: ignore [missing-import]
from sqlalchemy import String, Integer, DateTime, ForeignKey, JSON
# pyrefly: ignore [missing-import]
from sqlalchemy.dialects.postgresql import UUID, JSONB
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base

class AIReview(Base):
    __tablename__ = "ai_reviews"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    repository_name: Mapped[str] = mapped_column(String, nullable=False, index=True)
    owner: Mapped[str] = mapped_column(String, nullable=False, index=True)
    pull_request_number: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    
    review_status: Mapped[str] = mapped_column(String, nullable=False, default="pending")
    overall_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    summary: Mapped[str | None] = mapped_column(String, nullable=True)
    
    # Store the actual full JSON from Gemini for caching/history
    review_json: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    
    is_deleted: Mapped[bool] = mapped_column(default=False, nullable=False, server_default='false')
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", backref="ai_reviews")
