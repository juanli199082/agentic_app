import React from 'react';
import { ModelSettings, Language, User } from '../types';
import { Save, RefreshCw, Cpu, Thermometer, Zap, AlertCircle } from 'lucide-react';

interface SettingsProps {
  settings: ModelSettings;
  onSave: (settings: ModelSettings) => void;
  language: Language;
  user: User;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave, language, user }) => {
  const [localSettings, setLocalSettings] = React.useState<ModelSettings>(settings);
  const [hasChanges, setHasChanges] = React.useState(false);

  const t = {
    title: language === 'zh' ? '大模型配置' : 'LLM Configuration',
    subtitle: language === 'zh' ? '自定义AI生成参数与模型版本' : 'Customize AI generation parameters and model versions.',
    model: language === 'zh' ? '模型版本' : 'Model Version',
    temp: language === 'zh' ? '温度 (创意度)' : 'Temperature (Creativity)',
    topk: language === 'zh' ? 'Top K (采样)' : 'Top K (Sampling)',
    save: language === 'zh' ? '保存配置' : 'Save Configuration',
    saved: language === 'zh' ? '已保存' : 'Saved',
    proOnly: language === 'zh' ? '专业版功能' : 'Pro Feature',
    upgrade: language === 'zh' ? '升级以解锁' : 'Upgrade to Unlock',
  };

  const handleChange = (key: keyof ModelSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(localSettings);
    setHasChanges(false);
  };

  const canEdit = user.isPro || user.plan === 'enterprise';

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8">
         <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-6 h-6 text-primary-600" /> {t.title}
            </h2>
            <p className="text-slate-500 mt-1">{t.subtitle}</p>
         </div>
         {hasChanges && (
             <button 
                onClick={handleSave}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all animate-in fade-in"
             >
                 <Save className="w-4 h-4" /> {t.save}
             </button>
         )}
      </div>

      <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-8 relative ${!canEdit ? 'opacity-70 pointer-events-none select-none' : ''}`}>
        
        {/* Pro Lock Overlay */}
        {!canEdit && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/50 backdrop-blur-[2px] rounded-xl">
                 <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-2xl text-center max-w-sm pointer-events-auto">
                     <Zap className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
                     <h3 className="text-xl font-bold mb-2">{t.proOnly}</h3>
                     <p className="text-slate-300 mb-6 text-sm">Advanced model configuration is available for Pro and Enterprise users.</p>
                     <button className="bg-primary-600 px-6 py-2 rounded-lg font-bold w-full">
                         {t.upgrade}
                     </button>
                 </div>
            </div>
        )}

        {/* Model Selection */}
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4" /> {t.model}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {['gemini-2.5-flash', 'gemini-3-pro-preview', 'gemini-2.0-flash-exp'].map(m => (
                     <button
                        key={m}
                        onClick={() => handleChange('modelName', m)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                            localSettings.modelName === m 
                            ? 'bg-primary-50 border-primary-500 ring-1 ring-primary-500' 
                            : 'bg-slate-50 border-slate-200 hover:bg-white'
                        }`}
                     >
                        <div className="font-bold text-slate-800">{m}</div>
                        <div className="text-xs text-slate-500 mt-1">Google Gemini</div>
                     </button>
                 ))}
            </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center justify-between">
                    <span className="flex items-center gap-2"><Thermometer className="w-4 h-4" /> {t.temp}</span>
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs">{localSettings.temperature}</span>
                </label>
                <input 
                    type="range" min="0" max="2" step="0.1" 
                    value={localSettings.temperature}
                    onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>Precise (0.0)</span>
                    <span>Creative (2.0)</span>
                </div>
             </div>

             <div>
                <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center justify-between">
                    <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4" /> {t.topk}</span>
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs">{localSettings.topK}</span>
                </label>
                <input 
                    type="range" min="1" max="100" step="1" 
                    value={localSettings.topK}
                    onChange={(e) => handleChange('topK', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
             </div>
        </div>
      </div>
      
      <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
           <AlertCircle className="w-5 h-5 shrink-0" />
           <p>
               {language === 'zh' 
               ? '调整大模型参数会直接影响生成内容的风格。建议保留默认设置（Temp: 1, TopK: 64）以获得最佳稳定性。' 
               : 'Adjusting LLM parameters directly affects the style of generated content. We recommend keeping default settings (Temp: 1, TopK: 64) for best stability.'}
           </p>
      </div>
    </div>
  );
};

export default Settings;