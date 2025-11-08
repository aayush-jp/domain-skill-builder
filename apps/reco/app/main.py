from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict

from services.recommender import get_rule_based_recommendations

app = FastAPI()

# --- Pydantic Models for Request/Response Validation ---
class RecommendationRequest(BaseModel):
    user_id: str = Field(alias="userId")
    domain_slug: str = Field(alias="domainSlug")
    per_topic: Dict[str, float] = Field(alias="perTopic")

class RecommendationItem(BaseModel):
    type: str
    ref_id: str = Field(alias="refId")
    reason: str

class RecommendationResponse(BaseModel):
    items: List[RecommendationItem]


# --- API Endpoint ---
@app.post("/recommend", response_model=RecommendationResponse)
def recommend(request: RecommendationRequest):
    """
    Accepts user quiz results and returns personalized recommendations.
    """
    try:
        recommendations = get_rule_based_recommendations(
            domain_slug=request.domain_slug,
            per_topic_accuracy=request.per_topic
        )
        return {"items": recommendations}
    except Exception as e:
        # Basic error handling
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
  """
  Simple health check endpoint.
  """
  return {"status": "ok"}