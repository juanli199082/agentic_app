import React, { useState } from 'react';
import { User, Language } from '../types';
import { Check, Star, Zap, Shield, CreditCard, Loader2 } from 'lucide-react';

interface PaymentProps {
  user: User;
  onUpgrade: (plan: 'pro' | 'enterprise') => void;
  language: Language;
}

const Payment: React.FC<PaymentProps> = ({ user, onUpgrade, language }) => {
  const [processing, setProcessing] = useState<string | null>(null);

  const t = {
    title: language === 'zh' ? '选择您的计划' : 'Choose Your Plan',
    desc: language === 'zh' ? '解锁无限AI算力，释放创作潜能' : 'Unlock unlimited AI power and unleash your creativity.',
    free: language === 'zh' ? '免费版' : 'Free',
    pro: language === 'zh' ? '专业版' : 'Pro',
    ent: language === 'zh' ? '企业版' : 'Enterprise',
    month: language === 'zh' ? '/月' : '/mo',
    current: language === 'zh' ? '当前计划' : 'Current Plan',
    upgrade: language === 'zh' ? '升级' : 'Upgrade',
    processing: language === 'zh' ? '支付中...' : 'Processing...',
  };

  const handleSubscribe = async (plan: 'pro' | 'enterprise') => {
      setProcessing(plan);
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      onUpgrade(plan);
      setProcessing(null);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">{t.title}</h2>
        <p className="text-slate-500">{t.desc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Free Plan */}
        <PricingCard 
            title={t.free} 
            price="$0" 
            period={t.month}
            features={[
                language === 'zh' ? '每日 5 次拆解' : '5 Deconstructions/day',
                language === 'zh' ? '基础生成模型' : 'Basic Generation Model',
                language === 'zh' ? '标准速度' : 'Standard Speed',
            ]}
            isCurrent={user.plan === 'free'}
            actionLabel={t.current}
            onAction={() => {}}
            disabled={true}
        />

        {/* Pro Plan */}
        <PricingCard 
            title={t.pro} 
            price="$19" 
            period={t.month}
            features={[
                language === 'zh' ? '无限次拆解' : 'Unlimited Deconstructions',
                language === 'zh' ? '高级生成模型 (Pro)' : 'Advanced Models (Pro)',
                language === 'zh' ? '优先响应速度' : 'Priority Speed',
                language === 'zh' ? '大模型参数配置' : 'Custom LLM Config',
            ]}
            highlight={true}
            isCurrent={user.plan === 'pro'}
            actionLabel={user.plan === 'pro' ? t.current : t.upgrade}
            onAction={() => handleSubscribe('pro')}
            processing={processing === 'pro'}
            disabled={user.plan === 'pro' || user.plan === 'enterprise'}
        />

        {/* Enterprise Plan */}
        <PricingCard 
            title={t.ent} 
            price="$99" 
            period={t.month}
            features={[
                language === 'zh' ? '包含专业版所有功能' : 'All Pro Features',
                language === 'zh' ? 'API 接口访问' : 'API Access',
                language === 'zh' ? '专属客户经理' : 'Dedicated Support',
                language === 'zh' ? '团队协作功能' : 'Team Collaboration',
            ]}
            isCurrent={user.plan === 'enterprise'}
            actionLabel={user.plan === 'enterprise' ? t.current : t.upgrade}
            onAction={() => handleSubscribe('enterprise')}
            processing={processing === 'enterprise'}
            disabled={user.plan === 'enterprise'}
        />
      </div>
      
      {/* Mock Payment Form Modal would go here, simplified to direct action for this demo */}
      <div className="mt-12 bg-slate-50 p-6 rounded-xl border border-slate-200 text-center text-xs text-slate-400">
         <Shield className="w-4 h-4 inline-block mr-2 mb-0.5" />
         {language === 'zh' ? '支付安全由 Stripe 提供支持。这是一个演示页面，不会产生实际扣费。' : 'Payment secured by Stripe. This is a demo, no actual charge will be made.'}
      </div>
    </div>
  );
};

const PricingCard = ({ title, price, period, features, highlight, isCurrent, actionLabel, onAction, processing, disabled }: any) => (
    <div className={`relative p-8 rounded-2xl transition-all ${highlight ? 'bg-slate-900 text-white shadow-xl scale-105 z-10' : 'bg-white text-slate-800 border border-slate-200 shadow-sm'}`}>
        {highlight && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Most Popular
            </div>
        )}
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <div className="flex items-baseline mb-6">
            <span className="text-4xl font-extrabold tracking-tight">{price}</span>
            <span className={`text-sm ${highlight ? 'text-slate-400' : 'text-slate-500'}`}>{period}</span>
        </div>
        <ul className="space-y-4 mb-8">
            {features.map((f: string, i: number) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className={`w-5 h-5 ${highlight ? 'text-green-400' : 'text-green-600'}`} />
                    <span>{f}</span>
                </li>
            ))}
        </ul>
        <button
            onClick={onAction}
            disabled={disabled || processing}
            className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                isCurrent 
                ? 'bg-slate-200 text-slate-500 cursor-default' 
                : highlight 
                    ? 'bg-primary-500 hover:bg-primary-400 text-white shadow-lg shadow-primary-500/30' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
        >
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : (isCurrent ? <Check className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />)}
            {processing ? '...' : actionLabel}
        </button>
    </div>
);

export default Payment;