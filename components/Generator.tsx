import React, { useState, useEffect } from 'react';
import { StructuralStep, GeneratedContent, Language, HookType, StructureType, EmotionType, PersonaProfile, ViralAsset } from '../types';
import { generateNewContent } from '../services/geminiService';
import { Wand2, Loader2, Save, RotateCcw, Check, Magnet, Layout, Thermometer, User, Target, ChevronDown, ChevronUp, Users, Download } from 'lucide-react';

interface GeneratorProps {
  initialStructure?: StructuralStep[];
  language: Language;
  onSaveAsset: (asset: ViralAsset) => void; // New Prop
}

const Generator: React.FC<GeneratorProps> = ({ initialStructure, language, onSaveAsset }) => {
  const [topic, setTopic] = useState('');
  
  // Persona State (Replaces simple audience string)
  const [persona, setPersona] = useState<PersonaProfile>({
    platform: 'Generic',
    stage: 'Newbie',
    identity: 'General',
    painPoints: [],
    desiredResult: 'Quick Win',
    emotionalState: 'Anxious',
    contentPreference: 'Logic',
  });

  const [isPersonaOpen, setIsPersonaOpen] = useState(true);

  // Viral Parameters
  const [hookType, setHookType] = useState<HookType>('Pain Point');
  const [structureType, setStructureType] = useState<StructureType>('Problem-Amplify-Solve');
  const [emotionType, setEmotionType] = useState<EmotionType>('Anxiety');

  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // --- Mappings & Options ---

  const personaOptions = {
    platforms: [
        { id: 'Xiaohongshu', zh: '小红书', en: 'RedNote' },
        { id: 'TikTok', zh: '抖音', en: 'TikTok' },
        { id: 'WeChat Channel', zh: '视频号', en: 'WeChat Video' },
        { id: 'Bilibili', zh: 'B站', en: 'Bilibili' },
        { id: 'Generic', zh: '通用/不确定', en: 'Generic' },
    ],
    stages: [
        { id: 'Newbie', zh: '新手/小白', en: 'Newbie' },
        { id: 'Growing', zh: '成长期', en: 'Growing' },
        { id: 'Bottleneck', zh: '卡瓶颈期', en: 'Bottleneck' },
        { id: 'Advanced', zh: '进阶期', en: 'Advanced' },
    ],
    identities: [
        { id: 'Employee', zh: '打工人', en: 'Employee' },
        { id: 'Freelancer', zh: '自由职业', en: 'Freelancer' },
        { id: 'Student', zh: '学生', en: 'Student' },
        { id: 'Parent', zh: '宝妈/家庭主理', en: 'Parent' },
        { id: 'Creator', zh: '创作者', en: 'Creator' },
        { id: 'Entrepreneur', zh: '创业者', en: 'Entrepreneur' },
        { id: 'General', zh: '泛人群', en: 'General' },
    ],
    painPoints: [
        { id: 'No Results', zh: '没结果', en: 'No Results' },
        { id: 'No Method', zh: '没方法', en: 'No Method' },
        { id: 'No Resources', zh: '没资源', en: 'No Resources' },
        { id: 'No Time', zh: '没时间', en: 'No Time' },
        { id: 'No Confidence', zh: '没信心', en: 'No Confidence' },
        { id: 'Anxiety', zh: '容易焦虑', en: 'Anxiety' },
    ],
    results: [
        { id: 'Quick Win', zh: '快速见效', en: 'Quick Win' },
        { id: 'Steady Growth', zh: '稳定提升', en: 'Steady Growth' },
        { id: 'Recognition', zh: '被认可/点赞', en: 'Recognition' },
        { id: 'Money', zh: '赚钱/变现', en: 'Make Money' },
        { id: 'Less Stress', zh: '减少焦虑', en: 'Less Stress' },
    ],
    emotionalStates: [
        { id: 'Anxious', zh: '焦虑型', en: 'Anxious', mapTo: 'Anxiety' as EmotionType },
        { id: 'Confused', zh: '迷茫型', en: 'Confused', mapTo: 'Curiosity' as EmotionType },
        { id: 'Angry', zh: '愤怒型', en: 'Angry', mapTo: 'Anger' as EmotionType },
        { id: 'Hopeful', zh: '期待型', en: 'Hopeful', mapTo: 'Hope' as EmotionType },
        { id: 'Rational', zh: '冷静理性型', en: 'Rational', mapTo: 'Achievement' as EmotionType },
    ],
    preferences: [
        { id: 'Direct', zh: '直接给结论', en: 'Direct Conclusion', mapTo: 'Result First' as HookType, mapStruct: 'Problem-Amplify-Solve' as StructureType },
        { id: 'Logic', zh: '讲清逻辑', en: 'Logic Breakdown', mapTo: 'Counter-Intuitive' as HookType, mapStruct: 'Phenomenon-Reverse-Reason-Method' as StructureType },
        { id: 'Story', zh: '故事/案例', en: 'Story/Case', mapTo: 'Identity Resonance' as HookType, mapStruct: 'Story-Conflict-Twist-Conclusion' as StructureType },
        { id: 'List', zh: '清单/方法论', en: 'Checklist/Method', mapTo: 'Pain Point' as HookType, mapStruct: 'Problem-Amplify-Solve' as StructureType },
        { id: 'Emotion', zh: '情绪共鸣', en: 'Emotional', mapTo: 'Strong Opinion' as HookType, mapStruct: 'Contrast-Slap-Solution' as StructureType },
    ],
  };

  // --- Auto-Mapping Logic ---
  useEffect(() => {
    // Map Preference -> Structure
    const pref = personaOptions.preferences.find(p => p.id === persona.contentPreference);
    if (pref && pref.mapStruct) {
        setStructureType(pref.mapStruct);
    }
    
    // Map Emotional State -> Primary Emotion
    const emoState = personaOptions.emotionalStates.find(e => e.id === persona.emotionalState);
    if (emoState && emoState.mapTo) {
        setEmotionType(emoState.mapTo);
    }
  }, [persona.contentPreference, persona.emotionalState]);


  const t = {
    configTitle: language === 'zh' ? '1. 基础信息' : '1. Basic Info',
    topicLabel: language === 'zh' ? '主题 / 产品' : 'Topic / Product',
    
    // Persona Section
    personaTitle: language === 'zh' ? '2. 目标人群画像 (AI 定向)' : '2. Target Persona Builder',
    personaSubtitle: language === 'zh' ? '精准画像 = 精准流量' : 'Precise Persona = Precise Traffic',
    
    // Modules
    modPlatform: language === 'zh' ? '发布平台' : 'Platform',
    modStage: language === 'zh' ? '用户阶段' : 'User Stage',
    modIdentity: language === 'zh' ? '身份类型' : 'Identity',
    modPain: language === 'zh' ? '核心痛点 (多选)' : 'Pain Points (Max 2)',
    modResult: language === 'zh' ? '渴望结果' : 'Desired Result',
    modEmoState: language === 'zh' ? '当前状态' : 'Emotional State',
    modPref: language === 'zh' ? '内容偏好' : 'Content Pref',

    // Summary Card
    summaryTitle: language === 'zh' ? '🎯 锁定人群' : '🎯 Persona Locked',
    summaryDesc: language === 'zh' ? '根据选择，AI已自动匹配最佳爆款模型' : 'AI has auto-matched the best viral model based on your selection.',
    
    // Engine Labels
    paramTitle: language === 'zh' ? '3. 爆款引擎配置' : '3. Viral Engine Config',
    hookLabel: language === 'zh' ? '开头钩子类型' : 'Hook Strategy',
    // Updated Labels as requested
    structureLabel: language === 'zh' ? '4. 内容结构模版' : '4. Structure Template',
    emotionLabel: language === 'zh' ? '5. 主导情绪' : '5. Primary Emotion',
    
    generateBtn: language === 'zh' ? '生成爆款内容' : 'Generate Content',
    generating: language === 'zh' ? 'AI正在组装五大模块...' : 'AI Assembling 5 Engines...',
    scriptTitle: language === 'zh' ? '生成的爆款脚本' : 'Generated Viral Script',
    reset: language === 'zh' ? '重置' : 'Reset',
    download: language === 'zh' ? '下载文案' : 'Download',
    savedToAssets: language === 'zh' ? '已自动保存至资产库' : 'Saved to Assets Library',
  };

  // Options with bilingual labels for Viral Params
  const hookOptions: { value: HookType; zh: string; en: string }[] = [
    { value: 'Pain Point', zh: '痛点直击型', en: 'Pain Point' },
    { value: 'Counter-Intuitive', zh: '反常识型', en: 'Counter-Intuitive' },
    { value: 'Result First', zh: '结果前置型', en: 'Result First' },
    { value: 'Identity Resonance', zh: '身份共鸣型', en: 'Identity Resonance' },
    { value: 'Risk Warning', zh: '风险预警型', en: 'Risk Warning' },
    { value: 'Strong Opinion', zh: '强情绪观点型', en: 'Strong Opinion' },
  ];

  const structureOptions: { value: StructureType; zh: string; en: string }[] = [
    { value: 'Problem-Amplify-Solve', zh: '问题 → 放大 → 解决', en: 'Problem-Amplify-Solve' },
    { value: 'Phenomenon-Reverse-Reason-Method', zh: '现象 → 反转 → 原因 → 方法', en: 'Phenomenon-Reverse-Reason-Method' },
    { value: 'Story-Conflict-Twist-Conclusion', zh: '故事 → 冲突 → 转折 → 结论', en: 'Story-Conflict-Twist-Conclusion' },
    { value: 'Contrast-Slap-Solution', zh: '对比 → 打脸 → 正解', en: 'Contrast-Slap-Solution' },
  ];

  const emotionOptions: { value: EmotionType; zh: string; en: string }[] = [
    { value: 'Anxiety', zh: '焦虑', en: 'Anxiety' },
    { value: 'Hope', zh: '希望', en: 'Hope' },
    { value: 'Anger', zh: '愤怒', en: 'Anger' },
    { value: 'Curiosity', zh: '好奇', en: 'Curiosity' },
    { value: 'Achievement', zh: '成就感', en: 'Achievement' },
  ];

  const togglePainPoint = (id: string) => {
      setPersona(prev => {
          const exists = prev.painPoints.includes(id);
          if (exists) return { ...prev, painPoints: prev.painPoints.filter(p => p !== id) };
          if (prev.painPoints.length >= 2) return prev; // Max 2
          return { ...prev, painPoints: [...prev.painPoints, id] };
      });
  };

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);

    const audienceString = `
      Platform: ${persona.platform}, 
      Identity: ${persona.identity}, 
      Stage: ${persona.stage}, 
      Pain Points: ${persona.painPoints.join(', ')}, 
      Desired Result: ${persona.desiredResult}, 
      Emotional State: ${persona.emotionalState}, 
      Content Preference: ${persona.contentPreference}
    `;

    try {
      const data = await generateNewContent({
        topic,
        audience: audienceString,
        hookType,
        structureType,
        emotionType
      }, language);
      setResult(data);

      // --- Auto Save to Assets ---
      const newAsset: ViralAsset = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        sourceType: 'GENERATION',
        title: topic,
        platform: persona.platform,
        viralDNA: {
          hook: hookType,
          emotion: emotionType,
          structure: structureType
        },
        content: data.script,
        tags: [persona.platform, persona.identity, 'Generated'],
        notes: `Audience: ${audienceString}`
      };
      onSaveAsset(newAsset);

    } catch (e) {
      alert("Failed to generate content.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const element = document.createElement("a");
    const file = new Blob([result.script], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `ViralAlchemy_${topic}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto p-4">
      {/* Input Column */}
      <div className="space-y-6 pb-20">
        
        {/* 1. Basic Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary-600" />
            {t.configTitle}
          </h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.topicLabel}</label>
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={language === 'zh' ? '例如：英语口语课程，减肥咖啡...' : 'E.g. English Course, Diet Coffee...'}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* 2. Persona Builder (The new powerhouse) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all">
            <div 
                className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center cursor-pointer hover:bg-slate-100"
                onClick={() => setIsPersonaOpen(!isPersonaOpen)}
            >
                <div>
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        {t.personaTitle}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">{t.personaSubtitle}</p>
                </div>
                {isPersonaOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>

            {isPersonaOpen && (
                <div className="p-6 space-y-6">
                    {/* Module 1: Platform */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.modPlatform}</label>
                        <div className="flex flex-wrap gap-2">
                            {personaOptions.platforms.map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => setPersona({...persona, platform: opt.id})}
                                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                                        persona.platform === opt.id ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                                >
                                    {language === 'zh' ? opt.zh : opt.en}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         {/* Module 2: Stage */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.modStage}</label>
                            <div className="flex flex-col gap-2">
                                {personaOptions.stages.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setPersona({...persona, stage: opt.id})}
                                        className={`text-xs px-3 py-2 rounded-lg border text-left transition-all ${
                                            persona.stage === opt.id ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                        }`}
                                    >
                                        {language === 'zh' ? opt.zh : opt.en}
                                    </button>
                                ))}
                            </div>
                        </div>

                         {/* Module 3: Identity */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.modIdentity}</label>
                            <div className="flex flex-col gap-2">
                                {personaOptions.identities.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setPersona({...persona, identity: opt.id})}
                                        className={`text-xs px-3 py-2 rounded-lg border text-left transition-all ${
                                            persona.identity === opt.id ? 'bg-purple-50 border-purple-500 text-purple-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                        }`}
                                    >
                                        {language === 'zh' ? opt.zh : opt.en}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Module 4: Pain Points (Multi) */}
                    <div>
                        <label className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 block">{t.modPain}</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {personaOptions.painPoints.map(opt => {
                                const isSelected = persona.painPoints.includes(opt.id);
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => togglePainPoint(opt.id)}
                                        className={`text-xs px-3 py-2 rounded-lg border text-center transition-all ${
                                            isSelected ? 'bg-red-50 border-red-500 text-red-700 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                        }`}
                                    >
                                        {language === 'zh' ? opt.zh : opt.en}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                     {/* Module 5, 6, 7 Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                        <div>
                            <label className="text-xs font-bold text-green-600 mb-2 block">{t.modResult}</label>
                             <select 
                                value={persona.desiredResult} 
                                onChange={(e) => setPersona({...persona, desiredResult: e.target.value})}
                                className="w-full text-xs p-2 rounded border border-slate-200 bg-white"
                             >
                                 {personaOptions.results.map(opt => <option key={opt.id} value={opt.id}>{language === 'zh' ? opt.zh : opt.en}</option>)}
                             </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-orange-600 mb-2 block">{t.modEmoState}</label>
                             <select 
                                value={persona.emotionalState} 
                                onChange={(e) => setPersona({...persona, emotionalState: e.target.value})}
                                className="w-full text-xs p-2 rounded border border-slate-200 bg-white"
                             >
                                 {personaOptions.emotionalStates.map(opt => <option key={opt.id} value={opt.id}>{language === 'zh' ? opt.zh : opt.en}</option>)}
                             </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-indigo-600 mb-2 block">{t.modPref}</label>
                             <select 
                                value={persona.contentPreference} 
                                onChange={(e) => setPersona({...persona, contentPreference: e.target.value})}
                                className="w-full text-xs p-2 rounded border border-slate-200 bg-white"
                             >
                                 {personaOptions.preferences.map(opt => <option key={opt.id} value={opt.id}>{language === 'zh' ? opt.zh : opt.en}</option>)}
                             </select>
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center gap-4 mt-2">
                        <div className="p-3 bg-white/10 rounded-full">
                            <Target className="w-6 h-6 text-primary-400" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm mb-1">{t.summaryTitle}</h4>
                            <div className="text-xs text-slate-300 flex flex-wrap gap-2">
                                <span className="bg-white/20 px-1.5 py-0.5 rounded">{language === 'zh' ? personaOptions.platforms.find(p => p.id === persona.platform)?.zh : persona.platform}</span>
                                <span className="bg-white/20 px-1.5 py-0.5 rounded">{language === 'zh' ? personaOptions.identities.find(p => p.id === persona.identity)?.zh : persona.identity}</span>
                                <span className="bg-white/20 px-1.5 py-0.5 rounded">{language === 'zh' ? personaOptions.stages.find(p => p.id === persona.stage)?.zh : persona.stage}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 italic">{t.summaryDesc}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* 3. Engine Config (Auto-Updated) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Layout className="w-5 h-5 text-primary-600" />
                {t.paramTitle}
            </h2>
            
            {/* Hook Selector */}
            <div>
               <label className="flex items-center gap-2 text-sm font-bold text-red-600 mb-2">
                 <Magnet className="w-4 h-4" /> {t.hookLabel}
               </label>
               <div className="grid grid-cols-2 gap-2">
                 {hookOptions.map(opt => (
                   <button
                     key={opt.value}
                     onClick={() => setHookType(opt.value)}
                     className={`text-xs p-3 rounded-lg border transition-all text-left flex flex-col gap-0.5 ${
                       hookType === opt.value ? 'bg-red-50 border-red-500 text-red-700 ring-1 ring-red-500' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                     }`}
                   >
                     <span className="font-bold text-sm">{language === 'zh' ? opt.zh : opt.en}</span>
                     <span className="text-[10px] opacity-75">{language === 'zh' ? opt.en : opt.zh}</span>
                   </button>
                 ))}
               </div>
            </div>

            {/* Structure Selector */}
            <div className="mt-8 border-t border-slate-100 pt-6">
               <label className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4">
                 <Layout className="w-5 h-5 text-primary-600" /> {t.structureLabel}
               </label>
               <div className="relative">
                   <select 
                     value={structureType}
                     onChange={(e) => setStructureType(e.target.value as StructureType)}
                     className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
                   >
                     {structureOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {language === 'zh' ? `${opt.zh} (${opt.en})` : `${opt.en} (${opt.zh})`}
                        </option>
                     ))}
                   </select>
                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                      <Layout className="h-4 w-4" />
                   </div>
               </div>
            </div>

            {/* Emotion Selector */}
             <div className="mt-8 border-t border-slate-100 pt-6">
               <label className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4">
                 <Thermometer className="w-5 h-5 text-orange-600" /> {t.emotionLabel}
               </label>
               <div className="flex flex-wrap gap-2">
                 {emotionOptions.map(opt => (
                   <button
                     key={opt.value}
                     onClick={() => setEmotionType(opt.value)}
                     className={`text-xs px-3 py-2 rounded-lg border transition-all flex flex-col items-center min-w-[80px] ${
                       emotionType === opt.value ? 'bg-orange-50 border-orange-500 text-orange-700 ring-1 ring-orange-500' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                     }`}
                   >
                     <span className="font-bold">{language === 'zh' ? opt.zh : opt.en}</span>
                     <span className="text-[9px] opacity-75 scale-90">{language === 'zh' ? opt.en : opt.zh}</span>
                   </button>
                 ))}
               </div>
            </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !topic}
          className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-primary-900/10 transition-all flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> {t.generating}
            </>
          ) : (
            <>
              {t.generateBtn} <Wand2 className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {/* Result Column */}
      <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-6 flex flex-col h-full min-h-[500px]">
        {result ? (
          <div className="flex-1 flex flex-col animate-in fade-in duration-500">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1">
                <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                    <h3 className="font-bold text-lg text-slate-800">{t.scriptTitle}</h3>
                    <div className="flex gap-2">
                         <button 
                            onClick={handleDownload}
                            className="text-slate-400 hover:text-primary-600 transition-colors flex items-center gap-1"
                            title="Download"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => navigator.clipboard.writeText(result.script)}
                            className="text-slate-400 hover:text-primary-600 transition-colors"
                            title="Copy to clipboard"
                        >
                            <Save className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-700 leading-relaxed">
                    {result.script}
                </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-xs text-green-600 font-medium px-2">
                <Check className="w-3 h-3" /> {t.savedToAssets}
            </div>
            
            <div className="mt-4 bg-primary-50 p-4 rounded-xl border border-primary-100">
                <h4 className="text-sm font-bold text-primary-800 mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4" /> Logic Explanation
                </h4>
                <p className="text-sm text-primary-700">
                    {result.explanation}
                </p>
            </div>

            <div className="mt-4 flex justify-end">
                 <button 
                    onClick={() => setResult(null)} 
                    className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                    <RotateCcw className="w-4 h-4" /> {t.reset}
                </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
             <Layout className="w-12 h-12 opacity-30 mb-2" />
             <p>Fill in parameters to generate</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Generator;