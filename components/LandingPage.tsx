import React, { useEffect, useState } from 'react';
import { 
  Flame, CheckCircle, Zap, Globe, ArrowRight, Star, 
  BarChart3, BrainCircuit, PenTool, Layers, PlayCircle, 
  MessageSquare, TrendingUp, ShieldCheck, CreditCard,
  Layout, Magnet, Thermometer
} from 'lucide-react';
import { Language } from '../types';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onRegister, language, setLanguage }) => {
  // Animation Sequencing State
  const [line1Complete, setLine1Complete] = useState(false);
  const [loopCycle, setLoopCycle] = useState(0);

  // Reset animation when language changes
  useEffect(() => {
    setLine1Complete(false);
    setLoopCycle(0);
  }, [language]);

  // Intersection Observer for Scroll Animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleLine1Complete = () => {
    setLine1Complete(true);
  };

  const handleLine2Complete = () => {
    // Wait 3 seconds, then reset to start the loop again
    setTimeout(() => {
      setLine1Complete(false);
      setLoopCycle(prev => prev + 1);
    }, 3000);
  };

  const t = {
    // Nav
    login: language === 'zh' ? '登录' : 'Login',
    signup: language === 'zh' ? '免费注册' : 'Get Started',
    navFeat: language === 'zh' ? '功能特性' : 'Features',
    navCase: language === 'zh' ? '成功案例' : 'Use Cases',
    navPrice: language === 'zh' ? '订阅价格' : 'Pricing',
    
    // Hero
    badge: language === 'zh' ? 'AI 驱动的爆款内容引擎' : 'AI-Powered Viral Content Engine',
    heroTitle: language === 'zh' ? '破解爆款流量密码' : 'Crack the Viral Code',
    heroTitleHighlight: language === 'zh' ? '一键复刻成功' : 'Replicate Success Instantly',
    heroDesc: language === 'zh' 
      ? '不仅仅是分析。ViralAlchemy 利用大模型深度拆解全网爆款的底层逻辑、情绪曲线与脚本结构，助你批量生产高质量爆款内容。' 
      : 'More than just analytics. ViralAlchemy uses LLMs to deconstruct the underlying logic, emotional curves, and script structures of viral hits, helping you mass-produce high-quality content.',
    ctaPrimary: language === 'zh' ? '立即开始拆解' : 'Start Deconstructing',
    ctaSecondary: language === 'zh' ? '查看演示视频' : 'Watch Demo',
    trusted: language === 'zh' ? '深受 10,000+ 创作者与MCN机构信赖' : 'Trusted by 10,000+ Creators & Agencies',

    // Features
    featTitle: language === 'zh' ? '全流程爆款打造方案' : 'End-to-End Viral Solution',
    feat1Title: language === 'zh' ? '深度逻辑拆解' : 'Deep Logic Deconstruction',
    feat1Desc: language === 'zh' ? '告别无效模仿。AI 识别视频/文案中的“反常识钩子”、“情绪转折点”和“完播设计”，将模糊的网感转化为可视化的数据。' : 'Stop blind imitation. AI identifies "Counter-intuitive Hooks", "Emotional Twists", and "Retention Triggers", turning vague intuition into visualized data.',
    feat2Title: language === 'zh' ? 'AI 爆款复刻生成' : 'AI Viral Replication',
    feat2Desc: language === 'zh' ? '基于拆解的优秀模型，结合你的赛道和人设，自动生成 1:1 结构复刻的原创脚本，保持爆款基因。' : 'Based on proven models, combined with your niche and persona, automatically generate original scripts that replicate the viral structure 1:1.',
    feat3Title: language === 'zh' ? '多维度情绪分析' : 'Multi-Dimensional Emotion Analysis',
    feat3Desc: language === 'zh' ? '精准捕捉用户痛点（焦虑、好奇、愤怒）。分析内容如何调动情绪价值，让用户忍不住点赞转发。' : 'Accurately capture user pain points (Anxiety, Curiosity, Anger). Analyze how content leverages emotional value to drive likes and shares.',

    // Use Cases
    caseTitle: language === 'zh' ? '成功案例库' : 'Success Stories',
    caseSub: language === 'zh' ? '他们都在用 ViralAlchemy 打造爆款' : 'See how they create hits with ViralAlchemy',
    
    // Pricing
    priceTitle: language === 'zh' ? '灵活的订阅方案' : 'Flexible Pricing',
    priceSub: language === 'zh' ? '从小微创作者到企业级团队，总有一款适合你' : 'From indie creators to enterprise teams.',
    planFree: language === 'zh' ? '免费版' : 'Free',
    planPro: language === 'zh' ? '专业版' : 'Pro',
    planEnt: language === 'zh' ? '企业版' : 'Enterprise',
    mo: language === 'zh' ? '/月' : '/mo',
    
    // Steps
    stepTitle: language === 'zh' ? '仅需三步，复刻爆款' : 'Go Viral in 3 Steps',
    step1: language === 'zh' ? '输入链接' : 'Input Link',
    step1Desc: language === 'zh' ? '粘贴抖音/B站/小红书链接' : 'Paste TikTok/YouTube/Blog link',
    step2: language === 'zh' ? 'AI 拆解' : 'AI Analysis',
    step2Desc: language === 'zh' ? '提取逻辑、结构与钩子' : 'Extract logic, structure & hooks',
    step3: language === 'zh' ? '生成脚本' : 'Generate',
    step3Desc: language === 'zh' ? '一键生成你的原创爆款' : 'Create your original hit script',

    // CTA
    readyTitle: language === 'zh' ? '准备好制造下一个爆款了吗？' : 'Ready to Create Your Next Hit?',
    readyDesc: language === 'zh' ? '加入数万名创作者的行列，用 AI 赋能内容创作。' : 'Join thousands of creators supercharging their content with AI.',
    footerCopy: language === 'zh' ? '© 2024 ViralAlchemy. 保留所有权利。' : '© 2024 ViralAlchemy. All rights reserved.',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-primary-500 selection:text-white overflow-x-hidden">
      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
        }
        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }
        .text-gradient {
          background: linear-gradient(to right, #a78bfa, #c4b5fd, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
          animation: gradient 5s linear infinite;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-slate-900/50 rounded-full blur-[100px]"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="bg-gradient-to-tr from-primary-600 to-purple-500 p-2 rounded-lg shadow-lg shadow-primary-500/20">
              <Flame className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">ViralAlchemy</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
             <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-white hover:scale-105 transition-all">{t.navFeat}</a>
             <a href="#cases" onClick={(e) => scrollToSection(e, 'cases')} className="hover:text-white hover:scale-105 transition-all">{t.navCase}</a>
             <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="hover:text-white hover:scale-105 transition-all">{t.navPrice}</a>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-xs font-medium uppercase tracking-wide"
            >
              <Globe className="w-3 h-3" /> {language === 'zh' ? 'EN' : '中'}
            </button>
            <div className="h-4 w-[1px] bg-slate-700"></div>
            <button onClick={onLogin} className="text-sm font-semibold hover:text-primary-400 transition-colors">
               {t.login}
            </button>
            <button onClick={onRegister} className="bg-white text-slate-950 px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-200 transition-colors shadow-lg hover:shadow-xl hover:scale-105 transform duration-200">
               {t.signup}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10 min-h-[90vh] justify-center">
        <div className="reveal inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-primary-300 text-xs font-bold mb-8">
           <Zap className="w-3 h-3 fill-primary-300" /> {t.badge}
        </div>
        
        <h1 className="reveal text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight tracking-tight" style={{transitionDelay: '100ms'}}>
           <span className="block text-slate-100 min-h-[1.2em]">
             <Typewriter 
               key={`line1-${loopCycle}`}
               text={t.heroTitle} 
               startDelay={200}
               onComplete={handleLine1Complete}
               cursorColor="border-slate-100"
             />
           </span>
           <span className="block min-h-[1.2em]">
             {line1Complete && (
               <Typewriter 
                 key={`line2-${loopCycle}`}
                 text={t.heroTitleHighlight} 
                 className="text-gradient" 
                 cursorColor="border-primary-400"
                 onComplete={handleLine2Complete}
               />
             )}
           </span>
        </h1>
        
        <p className="reveal text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed" style={{transitionDelay: '200ms'}}>
           {t.heroDesc}
        </p>
        
        <div className="reveal flex flex-col sm:flex-row items-center justify-center gap-4 w-full" style={{transitionDelay: '300ms'}}>
           <button onClick={onRegister} className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-full font-bold text-lg shadow-lg shadow-primary-900/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2 group">
              <Flame className="w-5 h-5 fill-white group-hover:animate-pulse" /> {t.ctaPrimary}
           </button>
           <button onClick={onLogin} className="w-full sm:w-auto px-8 py-4 bg-slate-900/50 hover:bg-slate-800 text-white rounded-full font-bold text-lg border border-slate-700 backdrop-blur-sm transition-all flex items-center justify-center gap-2 hover:bg-slate-800">
              <PlayCircle className="w-5 h-5" /> {t.ctaSecondary}
           </button>
        </div>

        {/* Social Proof */}
        <div className="reveal mt-16 pt-8 border-t border-slate-800/50 w-full max-w-4xl" style={{transitionDelay: '400ms'}}>
            <p className="text-slate-500 text-sm font-medium mb-6 uppercase tracking-widest">{t.trusted}</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2 text-xl font-bold text-slate-300 hover:text-white transition-colors cursor-default"><div className="w-6 h-6 bg-slate-300 rounded-full"></div>CreatorLab</div>
                <div className="flex items-center gap-2 text-xl font-bold text-slate-300 hover:text-white transition-colors cursor-default"><div className="w-6 h-6 bg-slate-300 rounded-full"></div>MCN Pro</div>
                <div className="flex items-center gap-2 text-xl font-bold text-slate-300 hover:text-white transition-colors cursor-default"><div className="w-6 h-6 bg-slate-300 rounded-full"></div>ViralX</div>
                <div className="flex items-center gap-2 text-xl font-bold text-slate-300 hover:text-white transition-colors cursor-default"><div className="w-6 h-6 bg-slate-300 rounded-full"></div>ContentAI</div>
            </div>
        </div>
      </section>

      {/* UI Mockup Section (Visual Anchor) */}
      <section className="relative -mt-10 mb-20 z-20 px-4 reveal">
         <div className="max-w-6xl mx-auto rounded-xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden transform perspective-1000 rotate-x-12 hover:rotate-0 transition-all duration-1000 group">
             {/* Browser Header */}
             <div className="h-8 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                 <div className="ml-4 w-64 h-4 bg-slate-700/50 rounded-full flex items-center px-2">
                      <div className="w-2 h-2 bg-slate-500 rounded-full mr-2"></div>
                      <div className="w-32 h-1 bg-slate-600 rounded"></div>
                 </div>
             </div>
             
             {/* App Interface Mockup */}
             <div className="p-0 grid grid-cols-1 md:grid-cols-12 bg-slate-900/95 h-[600px] md:h-[500px] relative font-sans text-left">
                 
                 {/* Left Sidebar (Navigation + Input) */}
                 <div className="hidden md:flex col-span-3 border-r border-slate-800 bg-slate-950/50 p-4 flex-col gap-4">
                     {/* Logo Placeholder */}
                     <div className="flex items-center gap-2 mb-4 opacity-70">
                         <div className="w-6 h-6 bg-primary-600 rounded-lg"></div>
                         <div className="w-20 h-3 bg-slate-700 rounded"></div>
                     </div>
                     {/* Nav Items */}
                     <div className="space-y-2">
                         <div className="h-8 bg-slate-800/80 rounded w-full flex items-center px-3 border border-slate-700">
                              <div className="w-20 h-2 bg-slate-500 rounded"></div>
                         </div>
                         <div className="h-8 w-full flex items-center px-3 opacity-50">
                              <div className="w-16 h-2 bg-slate-600 rounded"></div>
                         </div>
                         <div className="h-8 w-full flex items-center px-3 opacity-50">
                              <div className="w-24 h-2 bg-slate-600 rounded"></div>
                         </div>
                     </div>

                     {/* Simulated Input Area */}
                     <div className="mt-4 p-3 rounded-lg border border-slate-700/50 bg-slate-900/50">
                         <div className="text-[10px] text-slate-500 mb-2 uppercase font-bold">Input URL</div>
                         <div className="text-[10px] text-slate-400 truncate font-mono bg-slate-950 p-2 rounded border border-slate-800 mb-2">
                             tiktok.com/@barista...
                         </div>
                         <div className="h-8 bg-primary-600 rounded flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-primary-900/50">
                             DECONSTRUCT
                         </div>
                     </div>
                 </div>

                 {/* Main Content Area */}
                 <div className="col-span-12 md:col-span-9 p-8 flex flex-col gap-6 relative overflow-hidden">
                     
                     {/* Result Header */}
                     <div className="flex justify-between items-end border-b border-slate-800 pb-4 z-10 relative">
                         <div>
                             <div className="flex gap-2 mb-2">
                                 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">HOOK: COUNTER-INTUITIVE</span>
                                 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">EMOTION: ANXIETY</span>
                             </div>
                             <h3 className="text-xl font-bold text-slate-100">"Stop Drinking Coffee Like This!"</h3>
                         </div>
                         <div className="flex gap-2">
                              <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 hidden sm:block"></div>
                              <div className="w-24 h-8 rounded bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-xs font-bold text-primary-300">Generate</div>
                         </div>
                     </div>

                     {/* Analysis Modules Grid */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 z-10 relative">
                         {/* Logic Breakdown Card */}
                         <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 relative group hover:bg-slate-800/60 transition-colors">
                             <div className="flex items-center gap-2 mb-3 text-slate-400">
                                  <BrainCircuit className="w-4 h-4" />
                                  <span className="text-xs font-bold uppercase">Underlying Logic</span>
                             </div>
                             <div className="space-y-3">
                                 <div className="p-2 bg-slate-900/50 rounded border-l-2 border-red-500">
                                     <div className="text-[10px] text-slate-500 mb-1">JUDGMENT</div>
                                     <div className="text-sm text-slate-300">Challenges habit to trigger insecurity.</div>
                                 </div>
                                 <div className="p-2 bg-slate-900/50 rounded border-l-2 border-blue-500">
                                     <div className="text-[10px] text-slate-500 mb-1">EVIDENCE</div>
                                     <div className="text-sm text-slate-300 italic">"90% of you are burning your beans..."</div>
                                 </div>
                             </div>
                         </div>

                         {/* Data/Success Card (The green one from the image) */}
                         <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 flex flex-col justify-between">
                              <div className="flex items-center gap-2 mb-3 text-slate-400">
                                  <BarChart3 className="w-4 h-4" />
                                  <span className="text-xs font-bold uppercase">Performance Prediction</span>
                             </div>
                             <div className="space-y-2">
                                 <div className="flex justify-between text-xs text-slate-400">
                                     <span>Retention Rate</span>
                                     <span className="text-white font-bold">High</span>
                                 </div>
                                 <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                     <div className="bg-green-500 w-[85%] h-full"></div>
                                 </div>
                             </div>
                             
                             {/* The specific box from the user image */}
                             <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex flex-col gap-1">
                                  <div className="flex items-center gap-2">
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                      <span className="text-xs text-green-400 font-bold">Logic Validated</span>
                                  </div>
                                  <div className="h-1 w-full bg-green-500/20 rounded mt-1"></div>
                                  <div className="h-1 w-2/3 bg-green-500/20 rounded"></div>
                             </div>
                         </div>
                     </div>
                     
                     {/* Bottom Timeline */}
                     <div className="mt-auto border-t border-slate-800 pt-4 opacity-50 z-10 relative hidden sm:block">
                         <div className="flex gap-1 items-end h-16">
                             {[40, 60, 80, 50, 90, 100, 70, 60, 40, 50, 75, 60, 40].map((h, i) => (
                                  <div key={i} style={{height: `${h}%`}} className="flex-1 bg-slate-700 rounded-t-sm hover:bg-primary-500 transition-colors"></div>
                             ))}
                         </div>
                     </div>

                     {/* Overlay Gradient */}
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none"></div>
                 </div>
             </div>
         </div>
      </section>

      {/* Feature Deep Dive */}
      <section id="features" className="py-24 relative overflow-hidden scroll-mt-20">
         <div className="max-w-7xl mx-auto px-6">
             <div className="text-center mb-20 reveal">
                 <h2 className="text-3xl md:text-5xl font-bold mb-6">{t.featTitle}</h2>
                 <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-blue-500 mx-auto rounded-full"></div>
             </div>

             {/* Feature 1: Deconstruction */}
             <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24 mb-32 reveal">
                 <div className="md:w-1/2 order-2 md:order-1 relative">
                     <div className="absolute inset-0 bg-primary-600/10 blur-[60px] rounded-full"></div>
                     <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl hover:border-primary-500/30 transition-colors duration-500">
                         {/* Mockup for Logic Analysis */}
                         <div className="flex items-center justify-between mb-6">
                             <div className="flex gap-2">
                                 <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                 <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                             </div>
                             <div className="px-2 py-1 bg-primary-500/20 text-primary-300 text-[10px] rounded border border-primary-500/30 uppercase font-bold">Analysis Mode</div>
                         </div>
                         <div className="space-y-4">
                             <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-red-500 hover:bg-slate-800 transition-colors">
                                 <div className="flex items-center gap-2 mb-1">
                                     <Magnet className="w-4 h-4 text-red-500" />
                                     <span className="text-xs font-bold text-slate-300">Hook Logic</span>
                                 </div>
                                 <p className="text-sm text-slate-400">"Counter-intuitive statement creates cognitive gap..."</p>
                             </div>
                             <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-orange-500 hover:bg-slate-800 transition-colors">
                                 <div className="flex items-center gap-2 mb-1">
                                     <Thermometer className="w-4 h-4 text-orange-500" />
                                     <span className="text-xs font-bold text-slate-300">Emotion Curve</span>
                                 </div>
                                 <div className="h-8 flex items-end gap-1 mt-2">
                                     <div className="w-1/5 h-[30%] bg-slate-700 rounded-t"></div>
                                     <div className="w-1/5 h-[60%] bg-slate-700 rounded-t"></div>
                                     <div className="w-1/5 h-[100%] bg-orange-500 rounded-t shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                                     <div className="w-1/5 h-[80%] bg-slate-700 rounded-t"></div>
                                     <div className="w-1/5 h-[40%] bg-slate-700 rounded-t"></div>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
                 <div className="md:w-1/2 order-1 md:order-2">
                     <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-900/50 text-primary-400 mb-6 border border-primary-500/30">
                         <BrainCircuit className="w-6 h-6" />
                     </div>
                     <h3 className="text-3xl font-bold mb-4">{t.feat1Title}</h3>
                     <p className="text-lg text-slate-400 leading-relaxed mb-6">{t.feat1Desc}</p>
                     <ul className="space-y-3">
                         {['Visualized Logic Chain', 'Emotion Curve Mapping', 'Core Value Extraction'].map((item, i) => (
                             <li key={i} className="flex items-center gap-3 text-slate-300">
                                 <CheckCircle className="w-5 h-5 text-green-500" /> {item}
                             </li>
                         ))}
                     </ul>
                 </div>
             </div>

             {/* Feature 2: Generation */}
             <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24 reveal">
                 <div className="md:w-1/2">
                     <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-900/50 text-purple-400 mb-6 border border-purple-500/30">
                         <PenTool className="w-6 h-6" />
                     </div>
                     <h3 className="text-3xl font-bold mb-4">{t.feat2Title}</h3>
                     <p className="text-lg text-slate-400 leading-relaxed mb-6">{t.feat2Desc}</p>
                     <button className="text-purple-400 font-bold flex items-center gap-2 hover:gap-3 transition-all" onClick={onLogin}>
                         Explore Generator <ArrowRight className="w-4 h-4" />
                     </button>
                 </div>
                 <div className="md:w-1/2 relative">
                     <div className="absolute inset-0 bg-purple-600/10 blur-[60px] rounded-full"></div>
                     <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl hover:border-purple-500/30 transition-colors duration-500">
                         {/* Mockup for Generator */}
                         <div className="grid grid-cols-2 gap-4 mb-4">
                             <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                                 <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Target Persona</div>
                                 <div className="flex gap-2">
                                     <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                     <div className="h-2 w-16 bg-slate-600 rounded"></div>
                                 </div>
                             </div>
                             <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                                 <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Viral Model</div>
                                 <div className="flex gap-2">
                                     <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                                     <div className="h-2 w-16 bg-slate-600 rounded"></div>
                                 </div>
                             </div>
                         </div>
                         <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 font-mono text-xs text-slate-400 leading-relaxed relative">
                             <div className="absolute top-2 right-2 px-2 py-0.5 bg-green-900/30 text-green-400 rounded text-[10px] border border-green-500/20">Generated</div>
                             <span className="text-purple-400">[Hook]</span> You've been drinking coffee WRONG your whole life.<br/><br/>
                             <span className="text-blue-400">[Story]</span> Yesterday, I met a barista champion...<br/><br/>
                             <span className="text-slate-600">... (AI writing) ...</span>
                             <div className="absolute bottom-4 right-4 animate-bounce">
                                 <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
         </div>
      </section>

      {/* How It Works Steps */}
      <section className="py-20 bg-slate-900 border-y border-slate-800/50 reveal">
        <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-center text-3xl font-bold mb-16">{t.stepTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StepCard number="01" title={t.step1} desc={t.step1Desc} icon={<MessageSquare className="w-6 h-6" />} />
                <StepCard number="02" title={t.step2} desc={t.step2Desc} icon={<Layers className="w-6 h-6" />} highlight />
                <StepCard number="03" title={t.step3} desc={t.step3Desc} icon={<Star className="w-6 h-6" />} />
            </div>
        </div>
      </section>

      {/* Case Studies */}
      <section id="cases" className="py-24 max-w-7xl mx-auto px-6 scroll-mt-20">
        <div className="text-center mb-16 reveal">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.caseTitle}</h2>
            <p className="text-slate-400">{t.caseSub}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CaseCard 
                image="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&auto=format&fit=crop&q=60"
                title="Tech Reviewer"
                stat="1.2M Views"
                desc="Deconstructed a viral gadget review, replicated the 'Problem-Agitation' structure for a new headphone launch."
                tag="YouTube"
            />
             <CaseCard 
                image="https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=500&auto=format&fit=crop&q=60"
                title="Fashion Vlog"
                stat="350% Engagement"
                desc="Used the 'Identity Resonance' hook to connect with Gen Z audience. Engagement skyrocketed."
                tag="TikTok"
            />
             <CaseCard 
                image="https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?w=500&auto=format&fit=crop&q=60"
                title="Edu-Creator"
                stat="50k Followers in 1 Mo"
                desc="Analyzed top competitors and generated a consistent content calendar using the 'Cognitive Upgrade' model."
                tag="Instagram"
            />
        </div>
      </section>

      {/* Pricing Section (New) */}
      <section id="pricing" className="py-24 bg-slate-900 border-t border-slate-800 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16 reveal">
               <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.priceTitle}</h2>
               <p className="text-slate-400">{t.priceSub}</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal">
               {/* Free */}
               <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl flex flex-col hover:border-slate-700 transition-all">
                   <h3 className="text-lg font-bold text-slate-300 mb-4">{t.planFree}</h3>
                   <div className="text-4xl font-bold mb-6 text-white">$0<span className="text-base font-normal text-slate-500">{t.mo}</span></div>
                   <ul className="space-y-4 mb-8 flex-1">
                       <li className="flex gap-3 text-sm text-slate-400"><CheckCircle className="w-5 h-5 text-slate-600" /> 5 Analysis / day</li>
                       <li className="flex gap-3 text-sm text-slate-400"><CheckCircle className="w-5 h-5 text-slate-600" /> Basic Models</li>
                   </ul>
                   <button onClick={onRegister} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all">
                       {language === 'zh' ? '免费开始' : 'Start Free'}
                   </button>
               </div>

               {/* Pro */}
               <div className="bg-slate-900 border border-primary-500/50 p-8 rounded-2xl flex flex-col relative transform scale-105 shadow-2xl shadow-primary-900/20 z-10">
                   <div className="absolute top-0 right-0 bg-primary-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl uppercase tracking-wider">Popular</div>
                   <h3 className="text-lg font-bold text-primary-300 mb-4">{t.planPro}</h3>
                   <div className="text-4xl font-bold mb-6 text-white">$19<span className="text-base font-normal text-slate-500">{t.mo}</span></div>
                   <ul className="space-y-4 mb-8 flex-1">
                       <li className="flex gap-3 text-sm text-slate-300"><CheckCircle className="w-5 h-5 text-primary-500" /> Unlimited Analysis</li>
                       <li className="flex gap-3 text-sm text-slate-300"><CheckCircle className="w-5 h-5 text-primary-500" /> Pro AI Models (Gemini Pro)</li>
                       <li className="flex gap-3 text-sm text-slate-300"><CheckCircle className="w-5 h-5 text-primary-500" /> Priority Support</li>
                   </ul>
                   <button onClick={onRegister} className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20">
                       {language === 'zh' ? '立即订阅' : 'Subscribe Now'}
                   </button>
               </div>

               {/* Enterprise */}
               <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl flex flex-col hover:border-slate-700 transition-all">
                   <h3 className="text-lg font-bold text-slate-300 mb-4">{t.planEnt}</h3>
                   <div className="text-4xl font-bold mb-6 text-white">$99<span className="text-base font-normal text-slate-500">{t.mo}</span></div>
                   <ul className="space-y-4 mb-8 flex-1">
                       <li className="flex gap-3 text-sm text-slate-400"><CheckCircle className="w-5 h-5 text-slate-600" /> Everything in Pro</li>
                       <li className="flex gap-3 text-sm text-slate-400"><CheckCircle className="w-5 h-5 text-slate-600" /> API Access</li>
                       <li className="flex gap-3 text-sm text-slate-400"><CheckCircle className="w-5 h-5 text-slate-600" /> Team Features</li>
                   </ul>
                   <button onClick={onRegister} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all">
                       {language === 'zh' ? '联系我们' : 'Contact Sales'}
                   </button>
               </div>
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 reveal">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-primary-900 to-slate-900 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden border border-primary-500/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">{t.readyTitle}</h2>
            <p className="text-xl text-primary-200 mb-10 max-w-2xl mx-auto relative z-10">{t.readyDesc}</p>
            
            <button onClick={onRegister} className="px-10 py-5 bg-white text-primary-900 rounded-full font-bold text-xl shadow-2xl hover:bg-slate-100 transition-all transform hover:scale-105 relative z-10 flex items-center gap-2 mx-auto">
                <Zap className="w-6 h-6 fill-primary-900" /> {t.signup}
            </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="bg-slate-800 p-1.5 rounded">
                   <Flame className="w-4 h-4 text-white" />
                 </div>
                 <span className="font-bold text-slate-300">ViralAlchemy</span>
              </div>
              <div className="text-slate-500 text-sm">
                  {t.footerCopy}
              </div>
              <div className="flex gap-6 text-slate-400">
                  <a href="#" className="hover:text-white transition-colors"><Globe className="w-5 h-5" /></a>
                  <a href="#" className="hover:text-white transition-colors"><ShieldCheck className="w-5 h-5" /></a>
              </div>
          </div>
      </footer>
    </div>
  );
};

// Typewriter Component
const Typewriter = ({ 
  text, 
  className = "", 
  cursorColor = "border-white",
  startDelay = 0,
  onComplete 
}: { 
  text: string; 
  className?: string;
  cursorColor?: string;
  startDelay?: number;
  onComplete?: () => void;
}) => {
  const [displayedText, setDisplayedText] = React.useState('');
  const [isStarted, setIsStarted] = React.useState(false);
  const [isComplete, setIsComplete] = React.useState(false);

  React.useEffect(() => {
    // Reset state when text changes
    setDisplayedText('');
    setIsStarted(false);
    setIsComplete(false);

    const timer = setTimeout(() => {
      setIsStarted(true);
    }, startDelay);

    return () => clearTimeout(timer);
  }, [text, startDelay]);

  React.useEffect(() => {
    if (!isStarted || isComplete) return;

    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, 50); // Speed
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  }, [displayedText, isStarted, isComplete, text, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && (
        <span className={`inline-block h-[0.8em] align-middle ml-1 border-r-2 animate-pulse ${cursorColor}`}></span>
      )}
    </span>
  );
};

// Sub-components

const StepCard = ({ number, title, desc, icon, highlight }: any) => (
    <div className={`reveal p-8 rounded-2xl border transition-all duration-300 ${highlight ? 'bg-slate-800 border-primary-500/30 shadow-lg shadow-primary-900/20' : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800'}`}>
        <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-lg ${highlight ? 'bg-primary-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {icon}
            </div>
            <span className="text-4xl font-black text-slate-800 select-none">{number}</span>
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-slate-400">{desc}</p>
    </div>
);

const CaseCard = ({ image, title, stat, desc, tag }: any) => (
    <div className="reveal group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 hover:border-slate-700 transition-all">
        <div className="h-48 overflow-hidden relative">
            <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold uppercase text-white border border-white/10">
                {tag}
            </div>
        </div>
        <div className="p-6">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-white">{title}</h3>
                <div className="flex items-center gap-1 text-green-400 text-sm font-bold">
                    <BarChart3 className="w-4 h-4" /> {stat}
                </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">{desc}</p>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-0 h-full bg-primary-500 transition-all duration-1000 group-hover:w-full"></div>
            </div>
        </div>
    </div>
);

export default LandingPage;