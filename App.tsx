import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import AnalysisResult from './components/AnalysisResult';
import Generator from './components/Generator';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Payment from './components/Payment';
import Settings from './components/Settings';
import AssetsLibrary from './components/AssetsLibrary'; // Import new component

import { AppMode, BilingualViralAnalysis, StructuralStep, Language, User, ViewState, ModelSettings, ViralAsset } from './types';
import { analyzeViralContent } from './services/geminiService';
import { Sparkles, Globe, Link as LinkIcon, FileText, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  // --- Global App State ---
  const [viewState, setViewState] = useState<ViewState>('LANDING');
  const [user, setUser] = useState<User | null>(null);
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.DECONSTRUCT);
  const [language, setLanguage] = useState<Language>('zh');
  
  // --- Feature State: Assets (History) ---
  const [assets, setAssets] = useState<ViralAsset[]>(() => {
    // Load assets from local storage on initialization
    const saved = localStorage.getItem('viralAlchemy_assets');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist assets whenever they change
  useEffect(() => {
    localStorage.setItem('viralAlchemy_assets', JSON.stringify(assets));
  }, [assets]);

  const handleSaveAsset = (newAsset: ViralAsset) => {
    setAssets(prev => [newAsset, ...prev]);
  };

  const handleDeleteAsset = (id: string) => {
      setAssets(prev => prev.filter(a => a.id !== id));
  };

  // Support generic updates (content, media, notes, etc.)
  const handleUpdateAsset = (id: string, updates: Partial<ViralAsset>) => {
      setAssets(prev => prev.map(a => a.id === id ? { ...a, ...updates, updatedAt: Date.now() } : a));
  };
  
  // --- Feature State: Deconstruct ---
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState<BilingualViralAnalysis | null>(null);

  // --- Feature State: Generate ---
  const [transferredStructure, setTransferredStructure] = useState<StructuralStep[] | undefined>(undefined);

  // --- Feature State: Settings ---
  const [modelSettings, setModelSettings] = useState<ModelSettings>({
    modelName: 'gemini-2.5-flash',
    temperature: 1,
    topK: 64,
    topP: 0.95
  });

  // --- Handlers ---

  const handleLogin = (u: User) => {
      setUser(u);
      setViewState('APP');
  };

  const handleLogout = () => {
      setUser(null);
      setViewState('LANDING');
      setAnalysisResult(null);
      setInputText('');
  };

  const handleUpgrade = (plan: 'pro' | 'enterprise') => {
      if (user) {
          setUser({ ...user, plan, isPro: true, credits: 9999 });
      }
      setCurrentMode(AppMode.DECONSTRUCT); // Go back to main app after upgrade
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    // Credit Check
    if (user && user.credits <= 0) {
        alert("Not enough credits! Please upgrade.");
        setCurrentMode(AppMode.PAYMENT);
        return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setStatusMessage(language === 'zh' ? '正在提取内容...' : 'Extracting content...');
    
    const isUrl = inputText.match(/^(http|https):\/\//) || inputText.includes('www.');
    if (!isUrl) {
        setStatusMessage(language === 'zh' ? '正在分析逻辑...' : 'Analyzing logic...');
    }

    try {
      const result = await analyzeViralContent(inputText, language, modelSettings);
      setAnalysisResult(result);
      // Deduct credit
      if (user && !user.isPro) {
          setUser({ ...user, credits: user.credits - 1 });
      }
    } catch (error) {
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
      setStatusMessage('');
    }
  };

  const handleUseTemplate = (structure: StructuralStep[]) => {
    setTransferredStructure(structure);
    setCurrentMode(AppMode.GENERATE);
  };

  // Translations
  const t = {
    titleDeconstruct: language === 'zh' ? '爆款文案分析' : 'Viral Analysis',
    titleGenerate: language === 'zh' ? '爆款文案生成' : 'Viral Generator',
    titleAssets: language === 'zh' ? '爆款资产库' : 'Viral Assets Library', // Updated Title
    titleSettings: language === 'zh' ? '配置管理' : 'Configuration',
    titlePayment: language === 'zh' ? '订阅升级' : 'Subscription',
    inputLabel: language === 'zh' ? '输入爆款链接或文本' : 'Input Viral Link or Text',
    inputPlaceholder: language === 'zh' 
        ? '在此处粘贴链接 (公众号/抖音/B站/Youtube) 或直接粘贴文案...' 
        : 'Paste link here (YouTube/TikTok/Blog) or paste text directly...',
    analyzeBtn: language === 'zh' ? '智能分析' : 'Start Analysis',
    platforms: language === 'zh' ? '支持平台: 微信公众号, 抖音, B站, 小红书, Youtube等' : 'Supports: WeChat, TikTok, YouTube, Blogs, etc.',
  };

  // --- View Rendering ---

  if (viewState === 'LANDING') {
      return (
        <LandingPage 
            onLogin={() => setViewState('AUTH')} 
            onRegister={() => setViewState('AUTH')} 
            language={language}
            setLanguage={setLanguage}
        />
      );
  }

  if (viewState === 'AUTH') {
      return (
          <Auth 
            onComplete={handleLogin} 
            language={language} 
          />
      );
  }

  // APP View
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar 
        currentMode={currentMode} 
        setMode={setCurrentMode} 
        language={language} 
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="ml-20 md:ml-64 flex-1 h-screen overflow-hidden flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
            <h1 className="text-xl font-bold text-slate-800">
                {currentMode === AppMode.DECONSTRUCT && t.titleDeconstruct}
                {currentMode === AppMode.GENERATE && t.titleGenerate}
                {currentMode === AppMode.ASSETS && t.titleAssets}
                {currentMode === AppMode.SETTINGS && t.titleSettings}
                {currentMode === AppMode.PAYMENT && t.titlePayment}
            </h1>
            <div className="flex items-center gap-4">
               <button 
                 onClick={() => setLanguage(prev => prev === 'zh' ? 'en' : 'zh')}
                 className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium transition-colors"
               >
                 <Globe className="w-4 h-4" />
                 {language === 'zh' ? '中文 / English' : 'English / 中文'}
               </button>
               {/* User Edit Trigger */}
               <button 
                onClick={() => alert("Profile edit feature coming soon!")}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-400 to-purple-500 border-2 border-white shadow-sm"
               ></button>
            </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
            
            {/* 1. Deconstruct View */}
            {currentMode === AppMode.DECONSTRUCT && (
                <div className="h-full grid grid-cols-1 lg:grid-cols-2 animate-in fade-in">
                    {/* Left: Input */}
                    <div className="p-6 border-r border-slate-200 h-full flex flex-col bg-white overflow-y-auto">
                        <div className="mb-6 flex-1 flex flex-col">
                            <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                <LinkIcon className="w-4 h-4 text-primary-600" />
                                {t.inputLabel}
                            </label>
                            <div className="relative flex-1">
                                <textarea
                                    className="w-full h-full min-h-[300px] p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none transition-all text-sm leading-relaxed"
                                    placeholder={t.inputPlaceholder}
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                ></textarea>
                                <div className="absolute bottom-4 right-4 text-xs text-slate-400 bg-white/80 px-2 py-1 rounded backdrop-blur-sm">
                                    {t.platforms}
                                </div>
                            </div>
                        </div>
                        <div className="mt-auto">
                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || !inputText}
                                className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-slate-900/10 transition-all flex items-center justify-center gap-2"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>{statusMessage}</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" /> {t.analyzeBtn}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    {/* Right: Output */}
                    <div className="h-full bg-slate-50 overflow-y-auto p-6">
                        <AnalysisResult 
                            analysis={analysisResult ? analysisResult[language] : null} 
                            isLoading={isAnalyzing} 
                            onUseTemplate={handleUseTemplate}
                            language={language}
                            onSaveAsset={handleSaveAsset} // Pass handler
                        />
                    </div>
                </div>
            )}

            {/* 2. Generator View */}
            {currentMode === AppMode.GENERATE && (
                <div className="h-full animate-in slide-in-from-right-4">
                    <Generator 
                        initialStructure={transferredStructure} 
                        language={language} 
                        onSaveAsset={handleSaveAsset} // Pass handler
                    />
                </div>
            )}

            {/* 3. Assets Library View */}
            {currentMode === AppMode.ASSETS && (
                 <AssetsLibrary 
                    assets={assets} 
                    language={language} 
                    onDelete={handleDeleteAsset}
                    onUpdate={handleUpdateAsset}
                 />
            )}

            {/* 4. Settings View */}
            {currentMode === AppMode.SETTINGS && user && (
                <div className="h-full overflow-y-auto animate-in fade-in">
                    <Settings 
                        settings={modelSettings} 
                        onSave={setModelSettings} 
                        language={language} 
                        user={user} 
                    />
                </div>
            )}

            {/* 5. Payment View */}
            {currentMode === AppMode.PAYMENT && user && (
                <div className="h-full overflow-y-auto animate-in fade-in">
                    <Payment 
                        user={user} 
                        onUpgrade={handleUpgrade} 
                        language={language} 
                    />
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;