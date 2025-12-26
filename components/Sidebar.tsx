import React from 'react';
import { LayoutDashboard, Wand2, Database, Flame, Settings, CreditCard, LogOut } from 'lucide-react';
import { AppMode, Language, User } from '../types';

interface SidebarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  language: Language;
  user: User | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentMode, setMode, language, user, onLogout }) => {
  const t = {
    deconstruct: language === 'zh' ? '爆款分析' : 'Viral Analysis',
    generate: language === 'zh' ? '爆款生成' : 'Viral Generator',
    assets: language === 'zh' ? '爆款资产库' : 'Viral Assets',
    settings: language === 'zh' ? '大模型配置' : 'LLM Settings',
    payment: language === 'zh' ? '订阅计划' : 'Subscription',
    credits: language === 'zh' ? '剩余点数' : 'Credits Remaining',
    logout: language === 'zh' ? '退出登录' : 'Logout',
  };

  const menuItems = [
    { id: AppMode.DECONSTRUCT, label: t.deconstruct, icon: LayoutDashboard },
    { id: AppMode.GENERATE, label: t.generate, icon: Wand2 },
    { id: AppMode.ASSETS, label: t.assets, icon: Database }, // Changed Icon and Label
    { id: AppMode.SETTINGS, label: t.settings, icon: Settings },
    { id: AppMode.PAYMENT, label: t.payment, icon: CreditCard },
  ];

  return (
    <div className="w-20 md:w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300 shadow-2xl">
      <div className="p-6 flex items-center justify-center md:justify-start gap-3 border-b border-slate-700 bg-slate-950">
        <div className="bg-primary-500 p-2 rounded-lg shrink-0">
          <Flame className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold hidden md:block tracking-tight">
          {language === 'zh' ? '爆款姬' : 'ViralAlchemy'}
        </span>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setMode(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 min-w-[20px] ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
              <span className="hidden md:block font-medium truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <div className="bg-slate-800/50 rounded-lg p-3 hidden md:block border border-slate-700">
           <div className="flex justify-between items-center mb-2">
             <span className="text-xs font-bold text-slate-300">{user?.name || 'Guest'}</span>
             <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${user?.isPro ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-600 text-slate-300'}`}>
                {user?.plan || 'Free'}
             </span>
           </div>
          <p className="text-xs text-slate-400 mb-1">{t.credits}</p>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div 
                className="bg-primary-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((user?.credits || 0), 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-right text-slate-400 mt-1">{user?.credits}/100</p>
        </div>
        
        <button 
            onClick={onLogout}
            className="mt-4 w-full flex items-center justify-center md:justify-start gap-3 px-4 py-2 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
        >
             <LogOut className="w-5 h-5" />
             <span className="hidden md:block text-sm font-medium">{t.logout}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;