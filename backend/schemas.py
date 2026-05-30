from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from datetime import datetime

class EntityBase(BaseModel):
    id: str
    type: str
    name: str
    logo: Optional[str] = None
    logo_color: Optional[str] = None
    description: Optional[str] = None
    momentum: float
    tags: List[str] = []
    trend_data: List[float] = []
    properties: Dict[str, Any] = {}

    class Config:
        from_attributes = True

class EdgeBase(BaseModel):
    id: int
    source_id: str
    target_id: str
    type: str
    weight: int

    class Config:
        from_attributes = True

class AnomalyBase(BaseModel):
    id: str
    anomaly_type: str
    entity_name: str
    entity_type: str
    metric_name: str
    actual_value: float
    expected_value: float
    deviation_percentage: float
    severity: str
    description: str
    detected_at: datetime
    status: str

    class Config:
        from_attributes = True

class TrendBase(BaseModel):
    id: str
    name: str
    direction: str
    velocity: str
    period: str
    description: str
    category: str
    trend_data: List[float] = []
    properties: Dict[str, Any] = {}

    class Config:
        from_attributes = True

class EvidenceBase(BaseModel):
    id: str
    source: str
    title: str
    snippet: str
    url: str
    published_at: datetime
    trust_score: float
    category: str

    class Config:
        from_attributes = True

class OpportunityBase(BaseModel):
    id: str
    title: str
    description: str
    category: str
    confidence_score: float
    impact_score: float
    detected_at: datetime
    time_horizon: str
    potential_value: str
    properties: Dict[str, Any] = {}

    class Config:
        from_attributes = True

class ReportBase(BaseModel):
    id: str
    title: str
    topic: str
    report_type: str
    depth: str
    status: str
    generated_at: datetime
    processing_time_ms: int
    executive_summary: str
    key_findings: List[str] = []
    content: str

    class Config:
        from_attributes = True

class GraphData(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
