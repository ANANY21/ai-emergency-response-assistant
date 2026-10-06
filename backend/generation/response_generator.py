"""
Structured Emergency Response Generator.
Generates conservative, evidence-based guidance following NLP information extraction
and Machine Learning priority classification.
"""

from typing import Dict, Any, List

# Evidence-based first-aid knowledge base for categorized response generation
EMERGENCY_GUIDANCE_KB = {
    "Cut": {
        "immediate_guidance": [
            "Apply direct, steady pressure using a clean cloth or sterile gauze to control bleeding.",
            "Gently rinse the area under cool, clean running water to remove dirt; do not use harsh chemicals like hydrogen peroxide or alcohol directly on open tissues.",
            "Apply a clean sterile dressing or adhesive bandage once bleeding is controlled."
        ],
        "precautions": [
            "Do NOT apply a tight tourniquet for simple superficial or controlled bleeding.",
            "Do NOT remove deeply embedded objects; stabilize around them and seek professional care.",
            "Avoid dirty dressings that could introduce bacterial pathogens."
        ],
        "when_to_seek_help": [
            "Bleeding does not stop after 10 minutes of direct continuous pressure.",
            "Wound is deep, gaping, or exposes underlying adipose tissue, muscle, or tendon (may require sutures).",
            "Numbness, loss of sensation, or restricted movement distal to the cut.",
            "Tetanus vaccination is out of date (greater than 5 to 10 years).",
            "Signs of infection emerge (spreading erythema, warmth, purulent drainage, or fever)."
        ]
    },
    "Burn": {
        "immediate_guidance": [
            "Immediately cool the burn under gentle, cool running tap water for at least 10 to 20 minutes (do not use ice).",
            "Gently remove non-adherent jewelry, rings, or tight clothing around the burned area before swelling starts.",
            "Cover the burned area loosely with clean, non-stick sterile gauze or clean plastic wrap."
        ],
        "precautions": [
            "Do NOT use ice, iced water, butter, oils, or home remedies on burn wounds.",
            "Do NOT intentionally burst or pop any blisters; the skin blister provides a sterile natural barrier.",
            "Do NOT forcibly peel away fabric or clothing that is adhered to the burned flesh."
        ],
        "when_to_seek_help": [
            "Burn involves the face, hands, feet, groin, major joints, or encompasses a large body surface area.",
            "Skin appears leathery, charred, white, or is numb (suspected third-degree burn).",
            "Burn was caused by chemicals, high-voltage electricity, or accompanied by smoke inhalation.",
            "Patient is an infant, young child, or elderly individual."
        ]
    },
    "Bleeding": {
        "immediate_guidance": [
            "Exert immediate and firm direct pressure directly over the bleeding site using sterile gauze or a clean cloth.",
            "Maintain firm, uninterrupted compression; do not frequently lift the pad to check.",
            "If bleeding is on an extremity and no fracture is suspected, elevate the limb above heart level while maintaining firm pressure.",
            "If blood soaks through, add additional absorbent pads on top rather than removing the initial layer."
        ],
        "precautions": [
            "Do NOT remove soaked dressings; doing so disrupts fragile clot formation.",
            "Do NOT attempt to clean deep, actively hemorrhaging wounds before hemorrhage control.",
            "Do NOT delay emergency services if bleeding is pulsatile or uncontrolled."
        ],
        "when_to_seek_help": [
            "Blood is spurting, pulsating, or rapidly soaking through heavy dressings.",
            "Bleeding continues after 10-15 minutes of uninterrupted direct pressure.",
            "Person exhibits signs of hypovolemic shock (pale, clammy skin, confusion, rapid shallow breathing, dizziness).",
            "Call emergency services (e.g., 911/112) immediately for severe or arterial bleeding."
        ]
    },
    "Injury": {
        "immediate_guidance": [
            "Immobilize and support the injured area in the most comfortable position; minimize unnecessary movement.",
            "Apply a cold pack wrapped in a cloth for 15-20 minutes at a time to mitigate localized swelling.",
            "Gently elevate the injured limb if tolerated and if doing so does not cause increased pain.",
            "Keep the affected individual calm and resting in a safe environment."
        ],
        "precautions": [
            "Do NOT attempt to force, straighten, or manipulate a visibly deformed limb or joint.",
            "Do NOT allow the person to bear weight on a suspected fractured or severely injured leg or ankle.",
            "Do NOT apply ice directly to bare skin without a protective cloth barrier."
        ],
        "when_to_seek_help": [
            "Inability to bear weight or move the injured extremity.",
            "Significant swelling, rapid discoloration, or obvious anatomical deformity.",
            "Numbness, coldness, or tingling sensation distal to the injury site.",
            "Severe, unrelenting pain or any suspicion of head, spinal, or neck injury."
        ]
    },
    "Fracture": {
        "immediate_guidance": [
            "Keep the injured part completely still and supported in the position found.",
            "If an open fracture (bone through skin), cover the wound with a clean sterile dressing without exerting pressure on the bone.",
            "Apply wrapped ice packs around the area to reduce swelling while awaiting emergency assistance.",
            "Monitor circulation distal to the fracture (check if fingers/toes are warm and retain sensation)."
        ],
        "precautions": [
            "Do NOT attempt to realign, push back, or manipulate broken bones.",
            "Do NOT move the patient if a pelvic, hip, or spinal fracture is suspected unless immediate environmental danger is present.",
            "Do NOT give oral food or fluids in case emergency surgery is needed."
        ],
        "when_to_seek_help": [
            "Immediate professional emergency medical care is required for suspected fractures.",
            "Call emergency services immediately if the bone has pierced the skin, limb is cold or pale, or if there is severe deformity."
        ]
    },
    "Sprain": {
        "immediate_guidance": [
            "Rest: Discontinue physical activity and avoid stressing the joint.",
            "Ice: Apply cold packs wrapped in a towel for 15-20 minutes every 2-3 hours.",
            "Compress: Apply a snug, flexible elastic bandage to support the joint without compromising blood flow.",
            "Elevate: Support the joint above the level of the heart when resting to facilitate lymphatic drainage."
        ],
        "precautions": [
            "Do NOT wrap compression bandages too tightly (watch for numbness, tingling, or cool digits).",
            "Do NOT apply heat or hot water during the acute phase (first 48 hours).",
            "Do NOT force weight-bearing if it causes sharp pain."
        ],
        "when_to_seek_help": [
            "Complete inability to bear weight or walk four steps.",
            "Severe point tenderness over bony prominences (e.g., malleolus, navicular).",
            "Swelling does not diminish or joint feels unstable/giving way after 48 hours."
        ]
    },
    "Breathing": {
        "immediate_guidance": [
            "Call emergency medical services immediately (e.g., 911/112).",
            "Assist the person into an upright or high-Fowler position (sitting upright leaning slightly forward) to ease respiratory effort.",
            "Loosen constrictive clothing around the neck, chest, and waist.",
            "If the person has a prescribed rescue inhaler (for asthma) or epinephrine auto-injector (for anaphylaxis), assist them in administering it according to their medical instructions."
        ],
        "precautions": [
            "Do NOT force the person to lie flat, as this significantly impedes breathing mechanics.",
            "Do NOT administer oral liquids or food during acute respiratory distress.",
            "Do NOT leave the individual unattended."
        ],
        "when_to_seek_help": [
            "Call emergency services immediately for any severe respiratory compromise.",
            "Stridor, audible wheezing, blue discoloration of lips/fingers (cyanosis), or inability to speak in full sentences mandate urgent 911 dispatch."
        ]
    },
    "Unconsciousness": {
        "immediate_guidance": [
            "Call emergency services immediately (911/112).",
            "Check responsiveness (tap shoulders and shout 'Are you okay?').",
            "Verify breathing: If the person is NOT breathing or only gasping, immediately start CPR (push hard and fast in center of chest, 100-120 bpm) and retrieve an AED if available.",
            "If breathing normally and no spinal trauma is suspected, place in the recovery position (on their side) to maintain an open airway."
        ],
        "precautions": [
            "Do NOT move the patient if spinal, neck, or head injury is suspected unless in immediate environmental danger.",
            "Do NOT place anything in the person's mouth or attempt to administer oral liquids.",
            "Do NOT leave the unresponsive person unattended."
        ],
        "when_to_seek_help": [
            "Unconsciousness is an absolute medical emergency requiring immediate 911/EMS dispatch."
        ]
    },
    "Trauma": {
        "immediate_guidance": [
            "Call emergency services (911/112) immediately.",
            "Ensure the scene is safe before approaching the patient.",
            "Keep the patient stationary and manually stabilize the head and neck in alignment if cervical trauma is possible.",
            "Control any life-threatening external bleeding with direct, firm pressure.",
            "Keep the patient warm with a blanket or coat to prevent hypothermia."
        ],
        "precautions": [
            "Do NOT move the patient unless there is an imminent threat of explosion, fire, or collapse.",
            "Do NOT remove a motorcycle helmet unless airway is compromised and trained in cervical stabilization.",
            "Do NOT give oral liquids or medication."
        ],
        "when_to_seek_help": [
            "All severe high-energy blunt or penetrating trauma cases require immediate emergency medical dispatch and hospital trauma center evaluation."
        ]
    }
}

DEFAULT_FALLBACK_GUIDANCE = {
    "immediate_guidance": [
        "Ensure personal safety and verify that the environment is secure from ongoing hazards.",
        "Keep the affected individual calm, seated, or resting comfortably.",
        "Monitor vital signs, conscious status, and breathing continuously.",
        "Gather relevant context (medication history, exact time of event, observed symptoms) for medical responders."
    ],
    "precautions": [
        "Do NOT administer unprescribed medications or food if condition is deteriorating.",
        "Do NOT move the patient if severe trauma, spinal impact, or bone deformity is suspected.",
        "Do NOT delay contacting emergency services if red-flag symptoms are observed."
    ],
    "when_to_seek_help": [
        "Any sudden deterioration in conscious level, breathing, or severe uncontrolled pain.",
        "Persistent or worsening symptoms despite basic supportive measures.",
        "When in doubt, contact local emergency dispatch (911/112) or professional emergency triage lines."
    ]
}


def generate_structured_response(
    user_input: str,
    emergency_type: str,
    priority: str,
    extracted_info: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Synthesizes NLP extraction and ML priority prediction into a conservative,
    structured emergency response summary.
    """
    # Lookup guidance based on emergency type
    kb_entry = EMERGENCY_GUIDANCE_KB.get(emergency_type, DEFAULT_FALLBACK_GUIDANCE)
    
    immediate_guidance = list(kb_entry["immediate_guidance"])
    precautions = list(kb_entry["precautions"])
    when_to_seek_help = list(kb_entry["when_to_seek_help"])
    
    # Check for ambiguity in user input
    words = user_input.strip().split()
    is_ambiguous = len(words) < 5 or extracted_info.get("event") == "Unspecified incident"
    ambiguity_note = None
    if is_ambiguous:
        ambiguity_note = "Note: The provided incident description contains limited detail. Guidance is conservative and generic. If situation is evolving, seek professional medical assessment."

    # Highlight urgency based on priority
    priority_level = priority.upper()
    urgency_statement = ""
    if priority_level == "CRITICAL":
        urgency_statement = "CRITICAL ACUITY: Immediate life-safety threat suspected. Call emergency services (911/112) immediately without delay."
    elif priority_level == "HIGH":
        urgency_statement = "HIGH ACUITY: Significant injury or risk of rapid deterioration. Urgent professional medical intervention or emergency transport recommended."
    elif priority_level == "MODERATE":
        urgency_statement = "MODERATE ACUITY: Meaningful distress or injury. Timely urgent care or medical evaluation advised if symptoms do not stabilize."
    else:
        urgency_statement = "LOW ACUITY: Superficial or mild manifestation. Standard first-aid and self-monitoring appropriate unless warning signs appear."

    detected_summary = {
        "event": extracted_info.get("event", "Unspecified"),
        "body_part": extracted_info.get("body_part", "Not specified"),
        "symptoms": extracted_info.get("symptoms", []),
        "key_terms": extracted_info.get("relevant_terms", [])
    }

    return {
        "emergency_type": emergency_type,
        "priority": priority,
        "urgency_statement": urgency_statement,
        "ambiguity_note": ambiguity_note,
        "detected_information": detected_summary,
        "immediate_guidance": immediate_guidance,
        "precautions": precautions,
        "when_to_seek_help": when_to_seek_help,
        "medical_disclaimer": "This tool is an emergency-response information assistant based on NLP and statistical Machine Learning. It does NOT provide medical diagnosis or replace emergency medical personnel."
    }
