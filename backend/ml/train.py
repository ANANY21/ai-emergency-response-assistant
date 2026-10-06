"""
Training Pipeline for Emergency Classifier.
1. Loads dataset.
2. Cleans text.
3. Generates DistilBERT embeddings.
4. Splits into train and test sets (stratified).
5. Trains Logistic Regression.
6. Calculates real holdout evaluation metrics.
7. Saves models and metrics.
"""

import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

from backend.nlp.preprocessing import clean_and_normalize_text
from backend.models.transformer_model import TransformerEmbeddingService
from backend.models.classifier import EmergencyClassifier
from backend.ml.evaluate import calculate_evaluation_metrics

DATASET_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "emergency_dataset.csv")

def train_emergency_models(force_retrain: bool = False):
    """
    Executes end-to-end training and evaluation pipeline.
    """
    classifier = EmergencyClassifier()
    if not force_retrain and classifier.is_trained and classifier.evaluation_metrics:
        print("Classifier already trained and saved. Using existing models.")
        return classifier.evaluation_metrics

    print(f"Loading emergency dataset from: {DATASET_PATH}")
    df = pd.read_csv(DATASET_PATH)
    
    # 1. Clean data
    df["cleaned_text"] = df["description"].apply(clean_and_normalize_text)
    
    # 2. Generate DistilBERT embeddings
    print("Generating contextual embeddings using DistilBERT...")
    transformer_service = TransformerEmbeddingService.get_instance()
    texts = df["cleaned_text"].tolist()
    embeddings = transformer_service.generate_batch_embeddings(texts)
    
    y_priority = np.array(df["priority"].tolist(), dtype=str)
    y_type = np.array(df["emergency_type"].tolist(), dtype=str)
    
    priority_classes = ["Low", "Moderate", "High", "Critical"]
    
    # 3. Train/test split (stratified by priority)
    X_train, X_test, y_train_pri, y_test_pri = train_test_split(
        embeddings,
        y_priority,
        test_size=0.25,
        random_state=42,
        stratify=y_priority
    )
    
    # 4. Train Priority Logistic Regression classifier
    print(f"Training Logistic Regression priority classifier on {len(X_train)} samples...")
    pri_clf = LogisticRegression(
        max_iter=1000,
        C=1.0,
        class_weight="balanced",
        random_state=42
    )
    pri_clf.fit(X_train, y_train_pri)
    
    # 5. Evaluate on unseen test split
    print(f"Evaluating classifier on {len(X_test)} holdout test samples...")
    y_pred_pri = pri_clf.predict(X_test)
    metrics = calculate_evaluation_metrics(
        y_true=y_test_pri.tolist(),
        y_pred=y_pred_pri.tolist(),
        labels=priority_classes,
        train_size=len(X_train),
        test_size=len(X_test)
    )
    
    # 6. Fit final priority model on full dataset for maximum deployment accuracy
    final_pri_clf = LogisticRegression(
        max_iter=1000,
        C=1.0,
        class_weight="balanced",
        random_state=42
    )
    final_pri_clf.fit(embeddings, y_priority)
    
    # 7. Train Emergency Type classifier
    print("Training Emergency Type classifier...")
    type_clf = LogisticRegression(
        max_iter=1000,
        C=1.0,
        random_state=42
    )
    type_clf.fit(embeddings, y_type)
    
    # 8. Persist
    classifier.priority_model = final_pri_clf
    classifier.type_model = type_clf
    classifier.save(metrics=metrics)
    
    print("Training complete! Real test metrics:")
    print(f"Accuracy:  {metrics['accuracy']}")
    print(f"Precision: {metrics['precision']}")
    print(f"Recall:    {metrics['recall']}")
    print(f"F1-Score:  {metrics['f1_score']}")
    
    return metrics

if __name__ == "__main__":
    train_emergency_models(force_retrain=True)
