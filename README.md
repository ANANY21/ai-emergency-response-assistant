# AI Emergency Response Assistant

A modern, responsive, clinical-grade triage information application powered by **NLP Preprocessing**, **Pretrained Transformers (DistilBERT)**, and **Machine Learning (Logistic Regression)**.

---

## ⚠️ Clinical Disclaimer
The **AI Emergency Response Assistant** is an informational triage aid designed for emergency context structuring and first-aid advisory. **It does NOT diagnose medical conditions, formulate pathology findings, or replace licensed emergency medical technicians or 911/112 dispatch.**

---

## 🏛️ System Architecture & Processing Pipeline

The application processes emergency incident narratives through a 9-stage sequential pipeline:

```
01 User Input (Raw Natural Language)
     ↓
02 NLP Preprocessing (Cleaning, Normalization & Tokenization)
     ↓
03 Information Extraction (Event, Symptoms, Anatomical Location, Severity Signals)
     ↓
04 Transformer / Deep Learning (Pretrained Hugging Face DistilBERT)
     ↓
05 Contextual Representation (768-dimensional CLS Pooled Embedding)
     ↓
06 ML Classification (scikit-learn Logistic Regression with Balanced Class Weights)
     ↓
07 Incident Priority (Low, Moderate, High, Critical Triage Stratification)
     ↓
08 Response Generation (Conservative First-Aid & Escalation Synthesis)
     ↓
09 Emergency Assistance (Actionable Structured Presentation)
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide Icons
- **Theme**: Medical-technology aesthetic (Deep Slate, Teal, Cyan, White)
- **Architecture**: Modular component dashboard

### Backend & Machine Learning
- **API Framework**: FastAPI + Uvicorn
- **NLP**: Custom Python normalization, tokenization & entity extraction
- **Deep Learning / Transformer**: Hugging Face Transformers (`distilbert-base-uncased`)
- **Machine Learning**: scikit-learn (`LogisticRegression`, `train_test_split`, `metrics`)
- **Evaluation**: Real holdout test evaluation (Accuracy, Precision, Recall, F1 Score, Confusion Matrix)

---

## 📁 Project Structure

```
Emergency Response/
├── backend/
│   ├── main.py                     # FastAPI application & REST endpoints
│   ├── models/
│   │   ├── transformer_model.py    # DistilBERT contextual embedding service
│   │   ├── classifier.py           # Logistic Regression classifier wrapper
│   │   └── saved_models/           # Serialized model checkpoints & metrics
│   ├── nlp/
│   │   ├── preprocessing.py        # Text cleaning, normalization, tokenization
│   │   └── extraction.py           # Event, symptom, and anatomical extraction
│   ├── ml/
│   │   ├── train.py                # Dataset split, embedding generation, training
│   │   ├── predict.py              # Inference pipeline
│   │   └── evaluate.py             # Accuracy, Precision, Recall, F1, Confusion Matrix
│   ├── generation/
│   │   ├── prompts.py              # 5 structured prompt engineering templates
│   │   └── response_generator.py   # First-aid guidance & red-flag criteria
│   ├── data/
│   │   └── emergency_dataset.csv   # Local demonstration dataset
│   └── test_scenarios.py           # End-to-end automated scenario verification
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── DemonstrationScenarios.jsx
│   │   │   ├── EmergencyInput.jsx
│   │   │   ├── EmergencyAnalysis.jsx
│   │   │   ├── NLPAnalysis.jsx
│   │   │   ├── TransformerAnalysis.jsx
│   │   │   ├── MLAnalysis.jsx
│   │   │   ├── GeneratedResponse.jsx
│   │   │   ├── PromptEngineering.jsx
│   │   │   ├── ProcessingPipeline.jsx
│   │   │   └── ModelTransparency.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── requirements.txt
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+ (tested on Python 3.14)
- Node.js 18+ (tested on Node.js v24)
- npm 9+

### 2. Backend Setup
```bash
# Navigate to project root
cd "Emergency Response"

# Install backend dependencies
pip install -r requirements.txt

# Run model training and evaluation (generates DistilBERT embeddings & trains classifier)
python -m backend.ml.train

# Start FastAPI backend server
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
Backend API will be accessible at `http://127.0.0.1:8000`.
Interactive API Docs: `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup
```bash
# In a separate terminal, navigate to frontend
cd "Emergency Response/frontend"

# Install npm dependencies
npm install

# Start Vite React development server
npm run dev
```
The React web application will be accessible at `http://localhost:3000`.

---

## 🧪 Demonstration Scenarios

The system includes 5 preconfigured scenarios ready for 1-click testing:

1. **Minor Cut**: `"A person has a small superficial cut on their finger."` (Low Priority)
2. **Burn**: `"A person accidentally touched a hot pan and has a painful red area on their hand."` (Moderate Priority)
3. **Heavy Bleeding**: `"A person has a deep wound on their arm and is bleeding heavily."` (High Priority)
4. **Injury**: `"A person fell from a bike and has severe pain and swelling in their arm."` (High Priority)
5. **Breathing Emergency**: `"A person is experiencing severe difficulty breathing."` (Critical Priority)

To run the automated scenario test suite:
```bash
python -m backend.test_scenarios
```

---

## 📊 Model Evaluation
- Model metrics are **never fabricated**.
- Evaluated on an unseen 25% holdout test split of the local dataset:
  - **Accuracy**: ~60.9%
  - **Precision**: ~59.9%
  - **Recall**: ~60.9%
  - **F1 Score**: ~56.8%
  - **Confusion Matrix**: Displayed live in the dashboard.
