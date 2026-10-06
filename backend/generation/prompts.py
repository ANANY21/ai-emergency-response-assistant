"""
Prompt Engineering Module for Emergency Response.
Contains 5 specialized prompt templates adhering to:
- ROLE
- CONTEXT
- TASK
- CONSTRAINTS
- OUTPUT FORMAT
"""

from typing import Dict, Any

PROMPT_TEMPLATES: Dict[str, Dict[str, str]] = {
    "emergency_understanding": {
        "id": "emergency_understanding",
        "title": "Emergency Understanding",
        "description": "Deconstructs the raw narrative into structured clinical and situational parameters.",
        "role": "You are an emergency-response information assistant specialized in rapid triage interpretation and incident deconstruction.",
        "context": "Emergency description: {user_input}\nExtracted entities: {extracted_information}\nPredicted Priority: {priority}",
        "task": "Analyze the incident details, verify the nature of the acute event, identify affected anatomical structures, and highlight immediate hazards.",
        "constraints": "- Do NOT diagnose medical conditions or pathologies.\n- Do NOT invent clinical facts or extrapolate without evidence.\n- Use objective, conservative language.\n- Explicitly state any uncertainties if details are ambiguous.",
        "output_format": "Incident Classification:\nAffected Anatomical Zones:\nIdentified Primary Hazards:\nKey Ambiguities / Missing Details:"
    },
    "first_aid_guidance": {
        "id": "first_aid_guidance",
        "title": "First-Aid Guidance",
        "description": "Generates conservative, evidence-based initial actions prior to professional intervention.",
        "role": "You are an emergency-response information assistant providing established first-aid procedural guidance.",
        "context": "Emergency description: {user_input}\nEmergency Type: {emergency_type}\nIdentified Priority: {priority}\nIdentified Symptoms: {symptoms}",
        "task": "Provide structured, step-by-step immediate first-aid guidance and critical precautions for non-medical bystanders.",
        "constraints": "- Do NOT recommend prescription medications or invasive procedures.\n- Emphasize passive stabilization, direct pressure, cooling, or airway maintenance as appropriate.\n- Prioritize safety of the patient and bystander.\n- Emphasize that first aid does not replace EMS or emergency medical personnel.",
        "output_format": "Immediate Bystander Actions (Numbered Steps):\nCritical Precautions (What NOT to do):\nPositioning & Comfort Measures:"
    },
    "incident_prioritization": {
        "id": "incident_prioritization",
        "title": "Incident Prioritization",
        "description": "Synthesizes classifier outputs with NLP indicators to justify triage acuity.",
        "role": "You are an emergency-response information assistant explaining triage priority stratification.",
        "context": "Emergency description: {user_input}\nNLP Severity Signals: {severity_terms}\nTransformer Representation: Contextual embedding generated\nML Classifier Prediction: {priority}",
        "task": "Explain the triage prioritization level ({priority}) based on clinical distress markers, vital danger signs, and incident dynamics.",
        "constraints": "- Do NOT claim that this prioritization constitutes a definitive physician triage.\n- State that priorities are categorized based on statistical NLP and learned embedding patterns.\n- Clearly justify why the incident meets Low, Moderate, High, or Critical thresholds.",
        "output_format": "Priority Stratification:\nPrimary Acuity Drivers:\nRisk of Rapid Deterioration:\nRecommended Dispatch Urgency:"
    },
    "emergency_response_summary": {
        "id": "emergency_response_summary",
        "title": "Emergency Response Summary",
        "description": "Standard comprehensive structured emergency overview for dispatch and callers.",
        "role": "You are an emergency-response information assistant.",
        "context": "Emergency description: {user_input}\nExtracted information: {extracted_information}\nPredicted priority: {priority}\nEmergency Type: {emergency_type}",
        "task": "Generate a concise structured emergency-response summary to guide immediate stabilization and escalation.",
        "constraints": "- Do not diagnose.\n- Do not invent information.\n- Use cautious language.\n- Clearly indicate when professional medical assistance may be required.\n- Keep the response concise and understandable.",
        "output_format": "Emergency Type: {emergency_type}\nPriority: {priority}\nImmediate Guidance: [Actionable steps]\nPrecautions: [Hazard warnings]\nWhen to Seek Professional Help: [Escalation criteria]"
    },
    "hospital_assistance": {
        "id": "hospital_assistance",
        "title": "Hospital Assistance",
        "description": "Defines clinical handoff triggers, transport urgency, and emergency department escalation criteria.",
        "role": "You are an emergency-response information assistant facilitating emergency department and EMS handoff preparation.",
        "context": "Emergency description: {user_input}\nIdentified Incident Type: {emergency_type}\nAssigned Priority: {priority}\nPhysical Signs: {symptoms}",
        "task": "Formulate transport recommendations, emergency dispatch criteria, and critical observations to communicate to arriving paramedics.",
        "constraints": "- Do not suggest private vehicle transport when immediate EMS dispatch is mandated (e.g. cardiac arrest, severe trauma, respiratory arrest).\n- Advise callers on preparing medication lists, incident timing, and access points for first responders.",
        "output_format": "EMS Dispatch Recommendation (Immediate 911 vs Urgent Urgent Care vs Clinic):\nObservations to Relay to Paramedics:\nPreparation for First Responder Arrival:"
    }
}

def format_prompt(template_id: str, context_vars: Dict[str, Any]) -> Dict[str, Any]:
    """
    Formats a prompt template with runtime variables.
    """
    template = PROMPT_TEMPLATES.get(template_id, PROMPT_TEMPLATES["emergency_response_summary"])
    
    # Safe string format formatting
    formatted_context = template["context"]
    formatted_output_format = template["output_format"]
    
    for key, val in context_vars.items():
        placeholder = f"{{{key}}}"
        val_str = str(val) if val is not None else ""
        formatted_context = formatted_context.replace(placeholder, val_str)
        formatted_output_format = formatted_output_format.replace(placeholder, val_str)
        
    full_prompt_text = (
        f"ROLE:\n{template['role']}\n\n"
        f"CONTEXT:\n{formatted_context}\n\n"
        f"TASK:\n{template['task']}\n\n"
        f"CONSTRAINTS:\n{template['constraints']}\n\n"
        f"OUTPUT FORMAT:\n{formatted_output_format}"
    )
    
    return {
        "template_id": template["id"],
        "title": template["title"],
        "description": template["description"],
        "role": template["role"],
        "context": formatted_context,
        "task": template["task"],
        "constraints": template["constraints"],
        "output_format": formatted_output_format,
        "full_prompt_text": full_prompt_text
    }
