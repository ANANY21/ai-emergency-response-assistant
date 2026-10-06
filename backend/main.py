"""
AI Emergency Response Assistant - FastAPI Backend Service.
Integrates NLP Preprocessing, Entity Extraction, DistilBERT Deep Learning Contextual Representations,
Machine Learning Priority & Type Classification, and Structured Guidance Generation.
"""

import os
import sys
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Ensure root path is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.nlp.preprocessing import preprocess_emergency_text
from backend.nlp.extraction import extract_emergency_information
from backend.models.transformer_model import TransformerEmbeddingService
from backend.models.classifier import EmergencyClassifier
from backend.ml.train import train_emergency_models
from backend.ml.predict import predict_emergency_attributes
from backend.generation.prompts import PROMPT_TEMPLATES, format_prompt
from backend.generation.response_generator import generate_structured_response

app = FastAPI(
    title="AI Emergency Response Assistant API",
    description="NLP, Transformers (DistilBERT), and Machine Learning emergency triage information service.",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class AnalyzeRequest(BaseModel):
    text: str = Field(..., description="Natural language description of the emergency incident")

class PromptFormatRequest(BaseModel):
    template_id: str
    user_input: Optional[str] = ""
    emergency_type: Optional[str] = ""
    priority: Optional[str] = ""
    extracted_information: Optional[Dict[str, Any]] = None

# Demonstration Scenarios matching specification
DEMONSTRATION_SCENARIOS = [
    {
        "id": "minor_cut",
        "title": "Minor Cut",
        "category": "Cut",
        "expected_priority": "Low",
        "description": "A person has a small superficial cut on their finger.",
        "icon": "Scissors"
    },
    {
        "id": "burn",
        "title": "Burn",
        "category": "Burn",
        "expected_priority": "Moderate",
        "description": "A person accidentally touched a hot pan and has a painful red area on their hand.",
        "icon": "Flame"
    },
    {
        "id": "heavy_bleeding",
        "title": "Heavy Bleeding",
        "category": "Bleeding",
        "expected_priority": "High",
        "description": "A person has a deep wound on their arm and is bleeding heavily.",
        "icon": "Droplet"
    },
    {
        "id": "injury",
        "title": "Injury",
        "category": "Injury",
        "expected_priority": "High",
        "description": "A person fell from a bike and has severe pain and swelling in their arm.",
        "icon": "Activity"
    },
    {
        "id": "breathing_emergency",
        "title": "Breathing Emergency",
        "category": "Breathing",
        "expected_priority": "Critical",
        "description": "A person is experiencing severe difficulty breathing.",
        "icon": "Wind"
    }
]

@app.on_event("startup")
def startup_event():
    """Initializes models and ensures training artifacts exist."""
    print("Initializing AI Emergency Response Assistant services...")
    try:
        classifier = EmergencyClassifier()
        if not classifier.is_trained:
            print("First run: Training classifier on dataset with DistilBERT embeddings...")
            train_emergency_models(force_retrain=False)
        else:
            print("Classifiers verified and ready.")
        # Pre-warm transformer
        _ = TransformerEmbeddingService.get_instance()
    except Exception as e:
        print(f"Warning during startup initialization: {e}")

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AI Emergency Response Assistant",
        "version": "1.0.0"
    }

@app.get("/examples")
def get_examples():
    """Returns the 5 required demonstration scenarios."""
    return {
        "count": len(DEMONSTRATION_SCENARIOS),
        "examples": DEMONSTRATION_SCENARIOS
    }

@app.get("/model-info")
def get_model_info():
    """Returns model transparency and architectural configuration."""
    return {
        "system_name": "AI Emergency Response Assistant",
        "disclaimer": "Emergency-response information assistant only. Not a medical diagnostic device.",
        "components": {
            "nlp_module": {
                "name": "Emergency NLP Preprocessor & Information Extractor",
                "methods": [
                    "Text Normalization (lowercase, noise removal, whitespace harmonization)",
                    "Tokenization & Alphanumeric Boundary Segmentation",
                    "Entity Extraction (Precipitating Events, Symptoms, Anatomical Structures)",
                    "Injury & Severity Qualifier Lexical Filtering"
                ]
            },
            "transformer_module": {
                "name": "DistilBERT (distilbert-base-uncased)",
                "provider": "Hugging Face Transformers / PyTorch",
                "type": "Transformer / Deep Learning",
                "representation": "Contextual CLS token embedding (768-dimensional vector)",
                "pretrained": True,
                "fine_tuned_from_scratch": False,
                "status": "Active & In-Memory"
            },
            "machine_learning_module": {
                "name": "Logistic Regression Classifier",
                "library": "scikit-learn",
                "inputs": "768-dimensional DistilBERT contextual embeddings",
                "targets": [
                    "Priority Acuity (Low, Moderate, High, Critical)",
                    "Emergency Incident Category (Cut, Burn, Bleeding, Fracture, Sprain, Trauma, Breathing, Unconsciousness)"
                ],
                "solver": "lbfgs (balanced class weighting)"
            },
            "response_generation": {
                "name": "Clinical First-Aid & Escalation Knowledge Engine",
                "prompt_engineering": "5 Structured Templates adhering to ROLE, CONTEXT, TASK, CONSTRAINTS, OUTPUT FORMAT"
            }
        }
    }

@app.get("/metrics")
def get_metrics():
    """Returns actual evaluation metrics computed on the holdout test split."""
    classifier = EmergencyClassifier()
    if not classifier.is_trained or not classifier.evaluation_metrics:
        # Train and obtain metrics
        metrics = train_emergency_models(force_retrain=False)
        return metrics
    return classifier.evaluation_metrics

@app.get("/prompts")
def get_prompts():
    """Returns the available prompt templates."""
    return {
        "templates": list(PROMPT_TEMPLATES.values())
    }

@app.post("/prompts/format")
def format_prompt_endpoint(req: PromptFormatRequest):
    """Formats a specific prompt template with provided runtime values."""
    context_vars = {
        "user_input": req.user_input or "Emergency description not provided",
        "emergency_type": req.emergency_type or "Unspecified",
        "priority": req.priority or "Unassigned",
        "extracted_information": req.extracted_information or {},
        "symptoms": req.extracted_information.get("symptoms", []) if req.extracted_information else [],
        "severity_terms": req.extracted_information.get("severity_terms", []) if req.extracted_information else []
    }
    return format_prompt(req.template_id, context_vars)

@app.post("/analyze")
def analyze_emergency(req: AnalyzeRequest):
    """
    Main Emergency Analysis Pipeline:
    1. Input Validation
    2. NLP Preprocessing (cleaning, normalization, tokenization)
    3. Information Extraction (Event, Symptoms, Body Part, Relevant terms)
    4. Transformer / Deep Learning (DistilBERT CLS Contextual Embedding)
    5. Machine Learning Classification (Priority & Type prediction)
    6. Structured Emergency Response Generation
    7. Formatted Prompt Engineering output
    """
    raw_text = req.text.strip() if req.text else ""
    
    # 1. Validation & Error Handling
    if not raw_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Emergency description cannot be empty. Please describe the incident."
        )
    if len(raw_text) < 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The description is too short to extract emergency details. Please provide more context."
        )

    # 2. NLP Preprocessing
    nlp_prep = preprocess_emergency_text(raw_text)
    processed_text = nlp_prep["processed_text"]

    # 3. Information Extraction
    extracted_info = extract_emergency_information(processed_text)

    # 4 & 5. Deep Learning & Machine Learning Pipeline
    try:
        prediction_result = predict_emergency_attributes(processed_text)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error during Transformer or ML processing: {str(e)}"
        )

    priority = prediction_result["priority"]
    emergency_type = prediction_result["emergency_type"]
    transformer_info = prediction_result["transformer_info"]

    # 6. Structured Emergency Response Generation
    structured_response = generate_structured_response(
        user_input=raw_text,
        emergency_type=emergency_type,
        priority=priority,
        extracted_info=extracted_info
    )

    # 7. Prompt Engineering Generation for all 5 use cases
    context_vars = {
        "user_input": raw_text,
        "emergency_type": emergency_type,
        "priority": priority,
        "extracted_information": extracted_info,
        "symptoms": extracted_info.get("symptoms", []),
        "severity_terms": extracted_info.get("severity_terms", [])
    }
    prompts_by_use_case = {
        tid: format_prompt(tid, context_vars)
        for tid in PROMPT_TEMPLATES.keys()
    }

    # Fetch latest evaluation metrics for display
    classifier = EmergencyClassifier()
    model_metrics = classifier.evaluation_metrics if classifier.evaluation_metrics else {}

    return {
        "raw_text": raw_text,
        "processed_text": processed_text,
        "tokens": nlp_prep["tokens"],
        "token_count": nlp_prep["token_count"],
        "extracted_information": extracted_info,
        "emergency_type": emergency_type,
        "priority": priority,
        "priority_confidence": prediction_result["priority_confidence"],
        "priority_probabilities": prediction_result["priority_probabilities"],
        "transformer_status": transformer_info["status"],
        "transformer_info": transformer_info,
        "generated_response": structured_response,
        "model_information": {
            "transformer_model": "DistilBERT (distilbert-base-uncased)",
            "transformer_architecture": "Transformer / Deep Learning",
            "classifier_model": "Logistic Regression",
            "feature_representation": "768-dimensional contextual pooled embedding",
            "evaluation_metrics": model_metrics
        },
        "prompt_engineering": {
            "active_template": "emergency_response_summary",
            "templates": prompts_by_use_case
        }
    }
