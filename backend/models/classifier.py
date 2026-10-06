"""
Emergency Classifier Model Definition.
Wraps scikit-learn Logistic Regression trained on DistilBERT contextual embeddings.
Predicts both triage priority and emergency incident category.
"""

import os
import joblib
import numpy as np
from typing import Dict, Any, List, Optional
from sklearn.linear_model import LogisticRegression

SAVED_MODELS_DIR = os.path.join(os.path.dirname(__file__), "saved_models")
os.makedirs(SAVED_MODELS_DIR, exist_ok=True)

PRIORITY_MODEL_PATH = os.path.join(SAVED_MODELS_DIR, "priority_classifier.joblib")
TYPE_MODEL_PATH = os.path.join(SAVED_MODELS_DIR, "type_classifier.joblib")
METRICS_PATH = os.path.join(SAVED_MODELS_DIR, "metrics.joblib")

class EmergencyClassifier:
    def __init__(self):
        self.priority_model: Optional[LogisticRegression] = None
        self.type_model: Optional[LogisticRegression] = None
        self.priority_classes: List[str] = ["Low", "Moderate", "High", "Critical"]
        self.type_classes: List[str] = []
        self.is_trained = False
        self.evaluation_metrics: Dict[str, Any] = {}
        self.load_if_exists()

    def load_if_exists(self) -> bool:
        """Loads saved model checkpoints and evaluation metrics if present."""
        if os.path.exists(PRIORITY_MODEL_PATH) and os.path.exists(TYPE_MODEL_PATH):
            try:
                self.priority_model = joblib.load(PRIORITY_MODEL_PATH)
                self.type_model = joblib.load(TYPE_MODEL_PATH)
                if hasattr(self.priority_model, "classes_"):
                    self.priority_classes = list(self.priority_model.classes_)
                if hasattr(self.type_model, "classes_"):
                    self.type_classes = list(self.type_model.classes_)
                if os.path.exists(METRICS_PATH):
                    self.evaluation_metrics = joblib.load(METRICS_PATH)
                self.is_trained = True
                print("Pre-trained classifiers loaded successfully from disk.")
                return True
            except Exception as e:
                print(f"Failed to load saved model: {e}")
                self.is_trained = False
        return False

    def save(self, metrics: Optional[Dict[str, Any]] = None):
        """Persists trained models and metrics to disk."""
        if self.priority_model is not None:
            joblib.dump(self.priority_model, PRIORITY_MODEL_PATH)
        if self.type_model is not None:
            joblib.dump(self.type_model, TYPE_MODEL_PATH)
        if metrics is not None:
            self.evaluation_metrics = metrics
            joblib.dump(metrics, METRICS_PATH)
        self.is_trained = True
        print(f"Models successfully saved to {SAVED_MODELS_DIR}")

    def predict_priority(self, embedding: np.ndarray) -> Dict[str, Any]:
        """
        Predicts emergency priority from DistilBERT embedding.
        Returns predicted label and class probabilities.
        """
        if self.priority_model is None or not self.is_trained:
            raise RuntimeError("Priority classifier is not trained or loaded yet.")

        # Ensure 2D shape [1, 768]
        if embedding.ndim == 1:
            embedding = embedding.reshape(1, -1)

        pred_class = self.priority_model.predict(embedding)[0]
        probs = self.priority_model.predict_proba(embedding)[0]
        classes = list(self.priority_model.classes_)

        class_probabilities = {
            cls_name: round(float(prob), 4)
            for cls_name, prob in zip(classes, probs)
        }
        confidence = float(np.max(probs))

        return {
            "prediction": str(pred_class),
            "confidence": round(confidence, 4),
            "probabilities": class_probabilities,
            "classes": classes
        }

    def predict_type(self, embedding: np.ndarray) -> Dict[str, Any]:
        """Predicts emergency type from DistilBERT embedding."""
        if self.type_model is None or not self.is_trained:
            raise RuntimeError("Type classifier is not trained or loaded yet.")

        if embedding.ndim == 1:
            embedding = embedding.reshape(1, -1)

        pred_class = self.type_model.predict(embedding)[0]
        probs = self.type_model.predict_proba(embedding)[0]
        classes = list(self.type_model.classes_)

        return {
            "prediction": str(pred_class),
            "confidence": round(float(np.max(probs)), 4),
            "classes": classes
        }
