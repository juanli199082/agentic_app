import React, { useState } from 'react';
import { ViralAnalysis, StructuralStep, Language, LogicAnalysis, ViralAsset, HookType, StructureType, EmotionType } from '../types';
import { 
  ArrowRight, Zap, Target, Lightbulb, Copy, 
  Thermometer, Award, Share2, Magnet, Layout, Star,
  Microscope, BrainCircuit, Key, Fingerprint, ChevronDown, ChevronUp, Save
} from 'lucide-react';

interface AnalysisResultProps {
  analysis: ViralAnalysis | null;
  onUseTemplate: (structure: StructuralStep[]) => void;
  isLoading: boolean;
  language: Language;
  onSaveAsset: (asset: ViralAsset) => void; // New Prop
}

// Sub-component for Logic Card (Judgment -> Evidence -> Effect)
const LogicCard: React.FC<{ title: string; logic: LogicAnalysis; icon: React.ReactNode; colorClass: string; labels: any }> = ({ title, logic, icon, colorClass, labels }) => (
  <div className={`bg-white rounded-xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all`}>
    <div className={`absolute top-0 right-0 p-4 opacity-10 ${colorClass}`}>
       {icon}
    </div>
    <h4 className={`font-bold text-sm mb-4 flex items-center gap-2 uppercase tracking-wide ${colorClass.replace('bg-', 'text-').replace('/10', '')}`}>
      {icon} {title}
    </h4>
    
    <div className="space-y-4 relative z-10">
      <div>
        <div className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">{labels.judgment}</div>
        <div className="font-bold text-slate-800 text-lg leading-tight">{logic.judgment}</div>
      </div>
      
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
        <div className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">{labels.evidence}</div>
        <p className="text-sm text-slate-600 italic">"{logic.evidence}"</p>
        <p className="text-xs text-slate-500 mt-1 border-t border-slate-200 pt-1">{logic.reason}</p>
      </div>

      <div>
        <div className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">{labels.effect}</div>
         <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${colorClass.replace('text-', 'bg-').replace('opacity-10', 'bg-opacity-20')} ${colorClass.replace('bg-', 'text-').replace('opacity-10', '')}`}>
            {logic.effect}
         </span>
      </div>
    </div>
  </div>
);

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, onUseTemplate, isLoading, language, onSaveAsset }) => {
  const [showJson, setShowJson] = useState(false);
  const [saved, setSaved] = useState(false);

  const t = {
    loading: language === 'zh' ? '正在进行深度拆解...' : 'Running Deep Deconstruction...',
    loadingDesc: language === 'zh' ? 'AI正在分析作者意图、逻辑链条和情绪曲线' : 'AI is analyzing author intent, logic chains, and emotional curves',
    noAnalysis: language === 'zh' ? '暂无分析结果' : 'No analysis yet.',
    instruction: language === 'zh' ? '请在左侧输入内容，AI将为您拆解爆款的底层逻辑。' : 'Paste content to deconstruct its Viral Logic.',
    
    // Section Headers
    mod1: language === 'zh' ? '模块 1: 爆款结论速览' : 'Module 1: Quick Conclusion',
    mod2: language === 'zh' ? '模块 2: 拆解逻辑与思考' : 'Module 2: Logic & Thinking',
    mod3: language === 'zh' ? '模块 3: 关键信息提取' : 'Module 3: Key Info Extraction',
    mod4: language === 'zh' ? '模块 4: 标准化结构模型' : 'Module 4: Standardized Model',

    // Labels
    viralType: language === 'zh' ? '爆款类型' : 'Viral Type',
    coreFunction: language === 'zh' ? '核心作用' : 'Core Function',
    scenario: language === 'zh' ? '适合场景' : 'Best Scenario',
    
    viewpoint: language === 'zh' ? '核心观点' : 'Core Viewpoint',
    painPoints: language === 'zh' ? '核心痛点' : 'Pain Points',
    triggers: language === 'zh' ? '情绪触发词' : 'Trigger Words',
    cta: language === 'zh' ? '行动引导' : 'Call to Action',

    useModel: language === 'zh' ? '一键复刻此模型' : 'Replicate This Model',
    saveAsset: language === 'zh' ? '保存至资产库' : 'Save to Assets',
    saved: language === 'zh' ? '已保存' : 'Saved',
    
    // Card Labels
    hookLogic: language === 'zh' ? '开头钩子逻辑' : 'Hook Logic',
    emotionLogic: language === 'zh' ? '情绪驱动逻辑' : 'Emotion Logic',
    judgment: language === 'zh' ? '判断' : 'Judgment',
    evidence: language === 'zh' ? '证据 & 原因' : 'Evidence & Reason',
    effect: language === 'zh' ? '作用' : 'Effect',
    
    jsonShow: language === 'zh' ? '显示标准化系统 JSON' : 'Show Standardized System JSON',
    jsonHide: language === 'zh' ? '隐藏系统 JSON' : 'Hide System JSON',
  };

  const handleSave = () => {
    if (!analysis) return;
    
    const asset: ViralAsset = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      sourceType: 'ANALYSIS',
      title: analysis.title || 'Untitled Analysis',
      platform: 'Analyzed Content',
      viralDNA: {
        hook: analysis.hookEngine.type as string,
        emotion: analysis.emotionEngine.primary as string,
        structure: analysis.structureEngine.type as string
      },
      content: JSON.stringify(analysis, null, 2), // Store full JSON for analysis
      tags: analysis.tags || [],
      notes: `Viral Type: ${analysis.viralType}`
    };

    onSaveAsset(asset);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center animate-pulse">
        <div className="w-20 h-20 bg-primary-100 rounded-full mb-6 flex items-center justify-center">
             <Microscope className="w-10 h-10 text-primary-500 animate-spin-slow" />
        </div>
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <p className="mt-6 text-slate-800 font-bold text-lg">{t.loading}</p>
        <p className="text-slate-500 text-sm mt-2">{t.loadingDesc}</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
        <BrainCircuit className="w-16 h-16 mb-4 opacity-50 text-slate-400" />
        <p className="font-medium text-lg text-slate-600">{t.noAnalysis}</p>
        <p className="text-sm mt-2">{t.instruction}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Module 1: Quick Conclusion (Banner) */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10">
            <Award className="w-32 h-32 text-white" />
        </div>
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold bg-primary-500/20 text-primary-200 px-2 py-1 rounded uppercase tracking-wider border border-primary-500/30">
                    {t.mod1}
                </span>
                <div className="flex gap-2">
                    <button 
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${saved ? 'bg-green-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
                    >
                        {saved ? <Star className="w-4 h-4 fill-white" /> : <Save className="w-4 h-4" />} {saved ? t.saved : t.saveAsset}
                    </button>
                    <button 
                        onClick={() => onUseTemplate(analysis.structureEngine.steps)}
                        className="flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg"
                    >
                        <Zap className="w-4 h-4 fill-slate-900" /> {t.useModel}
                    </button>
                </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-6 pr-8">{analysis.title}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                    <div className="text-xs text-slate-400 mb-1">{t.viralType}</div>
                    <div className="font-bold text-sm md:text-base text-primary-200">{analysis.viralType}</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                    <div className="text-xs text-slate-400 mb-1">{t.coreFunction}</div>
                    <div className="font-bold text-sm md:text-base">{analysis.coreFunction}</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                    <div className="text-xs text-slate-400 mb-1">{t.scenario}</div>
                    <div className="font-bold text-sm md:text-base">{analysis.suitableScenarios}</div>
                </div>
            </div>
        </div>
      </div>

      {/* Module 2: Deep Logic & Thinking (Cards) */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary-600" />
            {t.mod2}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LogicCard 
                title={t.hookLogic} 
                logic={analysis.hookLogic} 
                icon={<Magnet className="w-5 h-5" />} 
                colorClass="text-red-600 bg-red-600/10"
                labels={{judgment: t.judgment, evidence: t.evidence, effect: t.effect}}
            />
            <LogicCard 
                title={t.emotionLogic} 
                logic={analysis.emotionLogic} 
                icon={<Thermometer className="w-5 h-5" />} 
                colorClass="text-orange-600 bg-orange-600/10"
                labels={{judgment: t.judgment, evidence: t.evidence, effect: t.effect}}
            />
        </div>
      </div>

      {/* Module 3: Key Info Extraction (List) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
         <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Key className="w-5 h-5 text-yellow-600" />
            {t.mod3}
         </h3>
         
         <div className="space-y-6">
             <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                     <Target className="w-4 h-4 text-slate-500" />
                 </div>
                 <div>
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t.viewpoint}</div>
                     <p className="text-slate-800 font-medium leading-relaxed">{analysis.keyInfo.coreViewpoint}</p>
                 </div>
             </div>

             <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                     <Thermometer className="w-4 h-4 text-red-500" />
                 </div>
                 <div>
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t.painPoints} & {t.triggers}</div>
                     <div className="flex flex-wrap gap-2">
                         {analysis.keyInfo.painPoints.map((p, i) => (
                             <span key={i} className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">{p}</span>
                         ))}
                         {analysis.keyInfo.triggerWords.map((w, i) => (
                             <span key={i} className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-100">"{w}"</span>
                         ))}
                     </div>
                 </div>
             </div>

             <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                     <Share2 className="w-4 h-4 text-blue-500" />
                 </div>
                 <div>
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t.cta}</div>
                     <p className="text-slate-600 text-sm">{analysis.keyInfo.cta}</p>
                 </div>
             </div>
         </div>
      </div>

      {/* Module 4: Standardized Structure (Visual) */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex justify-between items-center">
             <h3 className="text-sm font-bold text-slate-600 flex items-center gap-2">
                <Layout className="w-4 h-4" />
                {t.mod4}
            </h3>
            <div className="flex gap-2">
                <span className="text-xs px-2 py-1 bg-white rounded text-slate-500 border border-slate-200">
                    Hook Score: {analysis.hookEngine.score}/5
                </span>
                <span className="text-xs px-2 py-1 bg-white rounded text-slate-500 border border-slate-200">
                    Struct Complete: {analysis.structureEngine.completeness}%
                </span>
            </div>
        </div>
        
        <div className="p-6">
            <div className="space-y-4">
                {analysis.structureEngine.steps.map((step, index) => (
                    <div key={index} className="flex group">
                    <div className="flex flex-col items-center mr-4">
                        <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-300 text-slate-500 font-bold text-xs flex items-center justify-center shrink-0 group-hover:border-primary-500 group-hover:text-primary-600 transition-colors shadow-sm">
                            {index + 1}
                        </div>
                        {index !== analysis.structureEngine.steps.length - 1 && (
                            <div className="w-0.5 bg-slate-200 h-full my-1"></div>
                        )}
                    </div>
                    <div className="pb-6 flex-1">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm group-hover:border-primary-200 transition-all">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-slate-800 text-sm">{step.name}</h4>
                                <span className="text-[10px] font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded uppercase">{step.purpose}</span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                        </div>
                    </div>
                    </div>
                ))}
            </div>
            
            {/* JSON Toggle for advanced users */}
            <div className="mt-6 border-t border-slate-200 pt-4">
                <button 
                    onClick={() => setShowJson(!showJson)}
                    className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600 transition-colors w-full justify-center"
                >
                    {showJson ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {showJson ? t.jsonHide : t.jsonShow}
                </button>
                {showJson && (
                    <pre className="mt-4 bg-slate-900 text-slate-50 p-4 rounded-lg text-xs overflow-x-auto font-mono leading-relaxed">
                        {JSON.stringify(analysis, null, 2)}
                    </pre>
                )}
            </div>
        </div>
      </div>

    </div>
  );
};

export default AnalysisResult;