from sqlalchemy import Column, String, Float, Integer, JSON, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base

class Entity(Base):
    __tablename__ = "entities"

    id = Column(String, primary_key=True, index=True)
    type = Column(String, index=True) # company, startup, technology, country, event
    name = Column(String, index=True)
    logo = Column(String, nullable=True)
    logo_color = Column(String, nullable=True)
    description = Column(String, nullable=True)
    momentum = Column(Float, default=0.5)
    tags = Column(JSON, default=[])
    trend_data = Column(JSON, default=[])
    properties = Column(JSON, default={}) # all type-specific fields

class Signal(Base):
    __tablename__ = "signals"

    id = Column(String, primary_key=True, index=True)
    type = Column(String, index=True) # news, social, company
    source = Column(String)
    title = Column(String, nullable=True)
    content = Column(String, nullable=True)
    url = Column(String, nullable=True)
    trust_score = Column(Float, default=0.5)
    timestamp = Column(DateTime, default=func.now())
    raw_data = Column(JSON, default={})

class Edge(Base):
    __tablename__ = "edges"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    source_id = Column(String, ForeignKey("entities.id"), index=True)
    target_id = Column(String, ForeignKey("entities.id"), index=True)
    type = Column(String, index=True) # USES, FUNDS, COMPETES, etc
    weight = Column(Integer, default=1)

class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    category = Column(String)
    confidence_score = Column(Float)
    impact_score = Column(Float)
    detected_at = Column(DateTime, default=func.now())
    time_horizon = Column(String)
    potential_value = Column(String)
    properties = Column(JSON, default={})
    evidence_refs = Column(JSON, default=[])

class Anomaly(Base):
    __tablename__ = "anomalies"

    id = Column(String, primary_key=True, index=True)
    anomaly_type = Column(String)
    entity_name = Column(String)
    entity_type = Column(String)
    metric_name = Column(String)
    actual_value = Column(Float)
    expected_value = Column(Float)
    deviation_percentage = Column(Float)
    severity = Column(String)
    description = Column(String)
    detected_at = Column(DateTime, default=func.now())
    status = Column(String)

class Trend(Base):
    __tablename__ = "trends"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    direction = Column(String)
    velocity = Column(String)
    period = Column(String)
    description = Column(String)
    category = Column(String)
    trend_data = Column(JSON, default=[])
    properties = Column(JSON, default={})

class Evidence(Base):
    __tablename__ = "evidence"
    
    id = Column(String, primary_key=True, index=True)
    source = Column(String)
    title = Column(String)
    snippet = Column(String)
    url = Column(String)
    published_at = Column(DateTime, default=func.now())
    trust_score = Column(Float)
    category = Column(String)

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    topic = Column(String)
    report_type = Column(String)
    depth = Column(String)
    status = Column(String)
    generated_at = Column(DateTime, default=func.now())
    processing_time_ms = Column(Integer)
    executive_summary = Column(String)
    key_findings = Column(JSON, default=[])
    content = Column(String)

