"""
Information Extraction Module for Emergency Descriptions.
Extracts event, symptoms, body parts, injury-related terms, and severity indicators.
"""

import re
from typing import List, Dict, Any, Optional

# Body parts catalog
BODY_PARTS_MAP = {
    "head": ["head", "skull", "scalp", "face", "jaw", "chin", "ear", "earlobe", "eye", "mouth", "lip", "teeth", "nose"],
    "neck": ["neck", "throat"],
    "chest": ["chest", "rib", "ribs", "torso", "retrosternal"],
    "abdomen": ["abdomen", "stomach", "belly", "pelvic", "pelvis"],
    "back": ["back", "spine"],
    "arm": ["arm", "upper arm", "forearm", "bicep", "elbow", "wrist"],
    "hand": ["hand", "palm", "finger", "fingers", "thumb", "knuckle", "knuckles", "nail"],
    "leg": ["leg", "thigh", "knee", "shin", "calf", "ankle"],
    "foot": ["foot", "feet", "toe", "toes", "heel", "sole"],
}

# Symptom keywords and phrases
SYMPTOMS_PATTERNS = [
    (r"\b(?:severe\s+pain|excruciating\s+pain|intense\s+agony|sharp\s+pain|throbbing\s+pain|painful|pain)\b", "Severe pain" if "severe" else "Pain"),
    (r"\b(?:difficulty\s+breathing|shortness\s+of\s+breath|struggling\s+to\s+(?:breathe|inhale)|silent\s+chest|wheezing|stridor|choking|gasping|respiratory\s+arrest)\b", "Difficulty breathing"),
    (r"\b(?:bleeding\s+heavily|heavy\s+bleeding|profuse\s+bleeding|catastrophic\s+hemorrhage|arterial\s+bleed|spurting\s+blood|continuous\s+heavy\s+blood\s+flow)\b", "Heavy bleeding"),
    (r"\b(?:minimal\s+bleeding|slight\s+bleeding|minor\s+spotting|steady\s+bleeding|bleeding|blood)\b", "Bleeding"),
    (r"\b(?:swelling|swollen|puffy)\b", "Swelling"),
    (r"\b(?:unresponsive|unconscious|collapsed|loss\s+of\s+consciousness|blacked\s+out|fainted)\b", "Loss of consciousness"),
    (r"\b(?:blistering|blisters|blister|charring|blackened\s+skin|peeling\s+skin)\b", "Blistering / Skin damage"),
    (r"\b(?:redness|red\s+area|rash|warmth)\b", "Redness and localized inflammation"),
    (r"\b(?:deformity|bone\s+visible|compound\s+fracture|dislocated|crooked)\b", "Visible deformity / Bone involvement"),
    (r"\b(?:numbness|tingling|paralysis|facial\s+droop|loss\s+of\s+sensation)\b", "Neurological impairment / Numbness"),
    (r"\b(?:vomiting|nausea|dizziness|confusion|disorientation)\b", "Nausea / Dizziness / Confusion"),
    (r"\b(?:cyanosis|turning\s+blue|pale\s+blue|gray\s+pallor|cold\s+sweat)\b", "Cyanosis / Pallor"),
    (r"\b(?:limp|difficulty\s+bearing\s+weight|unable\s+to\s+(?:walk|stand|move))\b", "Inability to bear weight / Restricted mobility"),
]

# Event detection patterns
STOP_WORDS_TRAILING = {"and", "with", "having", "has", "in", "on", "at", "to", "after", "while", "from"}

def _clean_event_target(raw_target: str) -> str:
    words = raw_target.strip().split()
    cleaned = []
    for w in words:
        if w in STOP_WORDS_TRAILING:
            break
        cleaned.append(w)
    return " ".join(cleaned) if cleaned else raw_target

EVENT_PATTERNS = [
    (r"\b(?:fell|fallen|fall|tripped|tumbled)\s+(?:from|off)\s+(?:a|an|the)?\s*([a-z0-9\-]+(?:\s+[a-z0-9\-]+)?)\b", lambda m: f"Fall from {_clean_event_target(m.group(1))}"),
    (r"\b(?:fell|fallen|fall|tripped|slipped)\s+(?:down|on|over|in)\s+(?:a|an|the)?\s*([a-z0-9\-]+(?:\s+[a-z0-9\-]+)?)\b", lambda m: f"Fall on {_clean_event_target(m.group(1))}"),
    (r"\b(?:touched|contact\s+with|burned\s+by)\s+(?:a|an|the)?\s*([a-z0-9\-]+(?:\s+[a-z0-9\-]+)?)\b", lambda m: f"Contact burn from {_clean_event_target(m.group(1))}"),
    (r"\b(?:cut|laceration|scratched)\s+(?:by|from|with)\s+(?:a|an|the)?\s*([a-z0-9\-]+(?:\s+[a-z0-9\-]+)?)\b", lambda m: f"Cut from {_clean_event_target(m.group(1))}"),
    (r"\b(?:vehicle|car|motorcycle|truck|bike)\s+(?:crash|collision|accident|rolled)\b", lambda m: "Motor vehicle collision"),
    (r"\b(?:choking|airway\s+obstruction)\b", lambda m: "Airway obstruction / Choking"),
    (r"\b(?:cardiac\s+arrest|heart\s+attack|chest\s+pain)\b", lambda m: "Cardiac / Chest emergency"),
    (r"\b(?:asthma\s+attack|severe\s+asthma|respiratory\s+arrest)\b", lambda m: "Acute respiratory event"),
    (r"\b(?:anaphylactic\s+shock|allergic\s+reaction)\b", lambda m: "Severe allergic reaction"),
    (r"\b(?:dog\s+bite|animal\s+bite|bee\s+sting|insect\s+bite)\b", lambda m: "Animal bite / Sting incident"),
    (r"\b(?:chemical\s+splash|chemical\s+burn)\b", lambda m: "Chemical exposure incident"),
    (r"\b(?:electrical\s+shock|electrocution)\b", lambda m: "Electrical shock incident"),
    (r"\b(?:drowning|pulled\s+from\s+pool|water\s+incident)\b", lambda m: "Water submersion incident"),
    (r"\b(?:fell|fall|tripped|slipped)\b", lambda m: "Fall / Slip incident"),
    (r"\b(?:cut|scraped|scratched|paper\s+cut)\b", lambda m: "Superficial cut / Abrasion"),
    (r"\b(?:burned|scalded|scald)\b", lambda m: "Thermal burn incident"),
]

# Injury keywords
INJURY_TERMS = [
    "cut", "scrape", "scratch", "laceration", "wound", "gash", "puncture",
    "burn", "scald", "fracture", "break", "broken", "deformity", "dislocation",
    "sprain", "strain", "twist", "bruise", "trauma", "concussion", "hemorrhage",
    "abrasion", "sting", "bite", "crush", "fall", "injury"
]

# Severity indicators
SEVERITY_TERMS = [
    "superficial", "minor", "small", "slight", "shallow", "mild", "minimal",
    "moderate", "steady", "noticeable", "uncomfortable",
    "severe", "heavy", "profuse", "excruciating", "deep", "intense", "sharp",
    "critical", "unresponsive", "unconscious", "catastrophic", "arterial", "cyanotic", "collapsed"
]

def extract_body_parts(text: str) -> List[str]:
    """Identifies mentioned anatomical locations."""
    detected = []
    text_lower = text.lower()
    for category, terms in BODY_PARTS_MAP.items():
        for term in terms:
            if re.search(r'\b' + re.escape(term) + r'\b', text_lower):
                capitalized = term.capitalize()
                if capitalized not in detected:
                    detected.append(capitalized)
    return detected

def extract_symptoms(text: str) -> List[str]:
    """Identifies reported symptoms and physiological signs."""
    symptoms = []
    text_lower = text.lower()
    
    # Specific targeted checks for severe pain vs general pain
    if re.search(r'\bsevere\s+pain\b', text_lower):
        symptoms.append("Severe pain")
    elif re.search(r'\bpain(?:ful)?\b', text_lower):
        symptoms.append("Pain")
        
    for pattern, symptom_name in SYMPTOMS_PATTERNS:
        if pattern.startswith(r"\b(?:severe\s+pain"):
            continue # Already handled above
        if re.search(pattern, text_lower):
            if symptom_name not in symptoms:
                symptoms.append(symptom_name)
    return symptoms

def extract_event(text: str) -> str:
    """Extracts the primary precipitating incident or mechanism of injury."""
    text_lower = text.lower()
    for pattern, handler in EVENT_PATTERNS:
        m = re.search(pattern, text_lower)
        if m:
            event_name = handler(m)
            return event_name.strip()
    return "Unspecified incident"

def extract_injury_terms(text: str) -> List[str]:
    """Extracts explicit injury terms found in the text."""
    found = []
    text_lower = text.lower()
    for term in INJURY_TERMS:
        if re.search(r'\b' + re.escape(term) + r'\b', text_lower):
            found.append(term.capitalize())
    return found

def extract_severity_terms(text: str) -> List[str]:
    """Extracts severity qualifier terms found in the text."""
    found = []
    text_lower = text.lower()
    for term in SEVERITY_TERMS:
        if re.search(r'\b' + re.escape(term) + r'\b', text_lower):
            found.append(term.capitalize())
    return found

def extract_emergency_information(text: str) -> Dict[str, Any]:
    """
    Main extraction pipeline.
    Produces structured entity dictionary for the emergency description.
    """
    body_parts = extract_body_parts(text)
    symptoms = extract_symptoms(text)
    event = extract_event(text)
    injury_terms = extract_injury_terms(text)
    severity_terms = extract_severity_terms(text)
    
    # Synthesize relevant terms list matching example requirements:
    # Example: ["Fall", "Injury", "Severe pain", "Swelling"]
    relevant_terms = []
    text_lower = text.lower()
    
    if re.search(r'\b(?:fell|fall)\b', text_lower) and "Fall" not in relevant_terms:
        relevant_terms.append("Fall")
    if (re.search(r'\b(?:injury|injured|hurt|harm|accident)\b', text_lower) or any(t.lower() in text_lower for t in ["pain", "swelling", "wound", "cut", "fracture", "burn"])) and "Injury" not in relevant_terms:
        relevant_terms.append("Injury")
        
    for s in symptoms:
        if s not in relevant_terms:
            relevant_terms.append(s)
            
    for t in injury_terms:
        if t not in relevant_terms:
            relevant_terms.append(t)
            
    for t in severity_terms:
        if t not in relevant_terms and not any(t.lower() in r.lower() for r in relevant_terms):
            relevant_terms.append(t)
            
    # Primary body part string
    primary_body_part = body_parts[0] if body_parts else "Not specified"
    
    return {
        "event": event,
        "body_part": primary_body_part,
        "all_body_parts": body_parts,
        "symptoms": symptoms,
        "injury_terms": injury_terms,
        "severity_terms": severity_terms,
        "relevant_terms": relevant_terms
    }
