import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DemonstrationScenarios from './components/DemonstrationScenarios';
import EmergencyInput from './components/EmergencyInput';
import EmergencyAnalysis from './components/EmergencyAnalysis';
import NLPAnalysis from './components/NLPAnalysis';
import TransformerAnalysis from './components/TransformerAnalysis';
import MLAnalysis from './components/MLAnalysis';
import GeneratedResponse from './components/GeneratedResponse';
import PromptEngineering from './components/PromptEngineering';
import ProcessingPipeline from './components/ProcessingPipeline';
import ModelTransparency from './components/ModelTransparency';
import { AlertCircle, ShieldAlert, Cpu, HeartPulse } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function App() {
  const [inputText, setInputText] = useState(
    'A person fell from a bike and has severe pain and swelling in the arm.'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [globalMetrics, setGlobalMetrics] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isTransparencyOpen, setIsTransparencyOpen] = useState(false);

  // Load initial model info and metrics
  useEffect(() => {
    fetch(`${API_BASE_URL}/model-info`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setModelInfo(data);
      })
      .catch((err) => console.log('Backend starting up...', err));

    fetch(`${API_BASE_URL}/metrics`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setGlobalMetrics(data);
      })
      .catch((err) => console.log('Metrics endpoint initializing...', err));
  }, []);

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setErrorMessage('Please enter an emergency description.');
      return;
    }
    if (inputText.trim().length < 5) {
      setErrorMessage('Please enter a more descriptive emergency incident (at least 5 characters).');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server responded with error status ${response.status}`);
      }

      const result = await response.json();
      setAnalysisData(result);
      if (result.model_information?.evaluation_metrics) {
        setGlobalMetrics(result.model_information.evaluation_metrics);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      setErrorMessage(err.message || 'Failed to connect to the backend analysis service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectScenario = (scenarioText) => {
    setInputText(scenarioText);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {/* Top Header */}
      <Header onOpenTransparency={() => setIsTransparencyOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intro Hero Badge & Title */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold mb-3">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Intelligent Emergency Response & Triage Information System</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            AI EMERGENCY RESPONSE ASSISTANT
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Analyze emergency descriptions using <strong className="text-teal-300 font-semibold">NLP</strong>,{' '}
            <strong className="text-cyan-300 font-semibold">Transformers (DistilBERT)</strong>,{' '}
            <strong className="text-blue-300 font-semibold">Deep Learning</strong>, and{' '}
            <strong className="text-indigo-300 font-semibold">Machine Learning</strong>.
          </p>
        </div>

        {/* Demonstration Scenarios (Try Example section) */}
        <DemonstrationScenarios
          onSelectScenario={handleSelectScenario}
          activeText={inputText}
        />

        {/* Main Input Component */}
        <EmergencyInput
          text={inputText}
          onChange={setInputText}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          error={errorMessage}
          onClear={() => setInputText('')}
        />

        {/* Output Sections (Displayed after analysis) */}
        {analysisData && (
          <div className="space-y-2 animate-fadeIn">
            {/* Section 1: Emergency Analysis */}
            <EmergencyAnalysis data={analysisData} />

            {/* Section 2: NLP Analysis */}
            <NLPAnalysis data={analysisData} />

            {/* Section 3: Transformer Analysis */}
            <TransformerAnalysis data={analysisData} />

            {/* Section 4: Machine Learning Analysis */}
            <MLAnalysis data={analysisData} globalMetrics={globalMetrics} />

            {/* Section 5: Generated Response */}
            <GeneratedResponse data={analysisData} />

            {/* Section 6: Prompt Engineering */}
            <PromptEngineering
              promptData={analysisData.prompt_engineering}
              currentInput={inputText}
              currentPriority={analysisData.priority}
              currentType={analysisData.emergency_type}
            />
          </div>
        )}

        {/* Section 7: Processing Pipeline (Numbered modular cards) */}
        <ProcessingPipeline
          isAnalyzing={isLoading}
          hasResults={Boolean(analysisData)}
        />
      </main>

      {/* Model Transparency Modal */}
      <ModelTransparency
        isOpen={isTransparencyOpen}
        onClose={() => setIsTransparencyOpen(false)}
        modelInfo={modelInfo}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="m-0">
            AI Emergency Response Assistant &copy; 2026. Designed for informational emergency guidance only.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Pretrained DistilBERT</span>
            <span>•</span>
            <span>Logistic Regression</span>
            <span>•</span>
            <button
              onClick={() => setIsTransparencyOpen(true)}
              className="text-teal-400 hover:underline cursor-pointer"
            >
              Model Disclosures
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
