"""
Prediction Module for Emergency Response Pipeline.
Runs inference through DistilBERT -> Logistic Regression.
"""

from typing import Dict, Any
from backend.models.transformer_model import TransformerEmbeddingService
from backend.models.classifier import EmergencyClassifier

def predict_emergency_attributes(text: str) -> Dict[str, Any]:
    """
    Given text:
    1. Generates DistilBERT embedding.
    2. Uses trained Logistic Regression to predict priority and type.
    """
    transformer_service = TransformerEmbeddingService.get_instance()
    embedding_info = transformer_service.generate_embedding(text)
    embedding_vector = embedding_info["vector"]

    classifier = EmergencyClassifier()
    if not classifier.is_trained:
        from backend.ml.train import train_emergency_models
        train_emergency_models()

    priority_result = classifier.predict_priority(embedding_vector)
    type_result = classifier.predict_type(embedding_vector)

    return {
        "priority": priority_result["prediction"],
        "priority_confidence": priority_result["confidence"],
        "priority_probabilities": priority_result["probabilities"],
        "emergency_type": type_result["prediction"],
        "type_confidence": type_result["confidence"],
        "transformer_info": {
            "model": embedding_info["model"],
            "model_name": embedding_info["model_name"],
            "architecture": embedding_info["architecture"],
            "status": embedding_info["status"],
            "explanation": embedding_info["explanation"],
            "embedding_dim": embedding_info["embedding_dim"],
            "l2_norm": embedding_info["l2_norm"],
            "mean": embedding_info["mean"],
            "std": embedding_info["std"],
            "preview": embedding_info["sample_vector_preview"]
        }
    }
