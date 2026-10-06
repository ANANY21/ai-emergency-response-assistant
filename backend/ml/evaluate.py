"""
Evaluation Module for Machine Learning Models.
Calculates actual classification metrics (Accuracy, Precision, Recall, F1 Score, Confusion Matrix)
without fabricating any values.
"""

from typing import Dict, Any, List
import numpy as np
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

def calculate_evaluation_metrics(
    y_true: List[str],
    y_pred: List[str],
    labels: List[str],
    train_size: int,
    test_size: int
) -> Dict[str, Any]:
    """
    Computes rigorous evaluation metrics on the holdout test set.
    """
    acc = float(accuracy_score(y_true, y_pred))
    
    # Weighted metrics for imbalanced classes
    prec_weighted = float(precision_score(y_true, y_pred, labels=labels, average="weighted", zero_division=0))
    rec_weighted = float(recall_score(y_true, y_pred, labels=labels, average="weighted", zero_division=0))
    f1_weighted = float(f1_score(y_true, y_pred, labels=labels, average="weighted", zero_division=0))
    
    # Macro metrics
    prec_macro = float(precision_score(y_true, y_pred, labels=labels, average="macro", zero_division=0))
    rec_macro = float(recall_score(y_true, y_pred, labels=labels, average="macro", zero_division=0))
    f1_macro = float(f1_score(y_true, y_pred, labels=labels, average="macro", zero_division=0))
    
    # Confusion matrix
    cm = confusion_matrix(y_true, y_pred, labels=labels)
    cm_list = cm.tolist()
    
    # Per-class report breakdown
    report_dict = classification_report(
        y_true,
        y_pred,
        labels=labels,
        output_dict=True,
        zero_division=0
    )
    
    per_class_metrics = {}
    for label in labels:
        if label in report_dict:
            per_class_metrics[label] = {
                "precision": round(float(report_dict[label]["precision"]), 4),
                "recall": round(float(report_dict[label]["recall"]), 4),
                "f1_score": round(float(report_dict[label]["f1-score"]), 4),
                "support": int(report_dict[label]["support"])
            }

    return {
        "evaluation_type": "Real Holdout Test Evaluation (Prototype Dataset)",
        "train_samples": int(train_size),
        "test_samples": int(test_size),
        "total_samples": int(train_size + test_size),
        "accuracy": round(acc, 4),
        "precision": round(prec_weighted, 4),
        "recall": round(rec_weighted, 4),
        "f1_score": round(f1_weighted, 4),
        "macro_precision": round(prec_macro, 4),
        "macro_recall": round(rec_macro, 4),
        "macro_f1": round(f1_macro, 4),
        "labels": labels,
        "confusion_matrix": cm_list,
        "per_class_metrics": per_class_metrics,
        "note": "Metrics are calculated directly on an unseen 25% holdout test split of the demonstration dataset. No metrics are fabricated."
    }
