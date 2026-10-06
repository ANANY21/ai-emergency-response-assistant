"""
NLP Preprocessing Module for Emergency Descriptions.
Performs text normalization, noise reduction, whitespace cleanup, and tokenization.
"""

import re
from typing import List, Dict, Any

def clean_and_normalize_text(raw_text: str) -> str:
    """
    Cleans and normalizes emergency text:
    1. Converts to lowercase.
    2. Removes noise while preserving essential punctuation for phrase boundaries.
    3. Normalizes whitespace.
    """
    if not raw_text or not isinstance(raw_text, str):
        return ""
    
    # Convert to lowercase
    text = raw_text.lower()
    
    # Replace non-standard characters with spaces
    text = re.sub(r'[\r\n\t]+', ' ', text)
    
    # Remove unwanted symbols but keep basic sentence punctuation and hyphens
    text = re.sub(r'[^a-z0-9\s\.,!\?\'\-]', ' ', text)
    
    # Normalize multiple punctuation marks
    text = re.sub(r'[\.]{2,}', '.', text)
    text = re.sub(r'[!]{2,}', '!', text)
    text = re.sub(r'[\?]{2,}', '?', text)
    
    # Normalize multiple whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def tokenize_text(normalized_text: str) -> List[str]:
    """
    Tokenizes normalized text into alphanumeric word tokens.
    """
    if not normalized_text:
        return []
    # Tokenize words, keeping alphanumeric tokens
    tokens = re.findall(r'\b[a-z0-9]+(?:-[a-z0-9]+)?\b', normalized_text)
    return tokens


def preprocess_emergency_text(raw_text: str) -> Dict[str, Any]:
    """
    Executes full preprocessing pipeline.
    Returns dictionary with raw text, normalized text, and tokens.
    """
    cleaned = clean_and_normalize_text(raw_text)
    tokens = tokenize_text(cleaned)
    return {
        "raw_text": raw_text,
        "processed_text": cleaned,
        "tokens": tokens,
        "token_count": len(tokens)
    }
