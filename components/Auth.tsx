import React, { useState } from 'react';
import { User, Language } from '../types';
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2, Check } from 'lucide-react';

interface AuthProps {
  onComplete: (user: User) => void;
  language: Language;
  initialMode?: 'login' | 'register';
  currentUser?: User | null; // If present, it's edit mode
}

const Auth: React.FC<AuthProps> = ({ onComplete, language, initialMode = 'login', currentUser }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'update'>(currentUser ? 'update' : initialMode);
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(currentUser?.name || '');
  const [isLoading, setIsLoading] = useState(false);

  const t = {
    loginTitle: language === 'zh' ? '欢迎回来' : 'Welcome Back',
    regTitle: language === 'zh' ? '创建账号' : 'Create Account',
    updateTitle: language === 'zh' ? '修改个人信息' : 'Update Profile',
    email: language === 'zh' ? '邮箱地址' : 'Email Address',
    pass: language === 'zh' ? '密码' : 'Password',
    name: language === 'zh' ? '用户名' : 'Username',
    submitLogin: language === 'zh' ? '登录' : 'Login',
    submitReg: language === 'zh' ? '注册' : 'Sign Up',
    submitUpdate: language === 'zh' ? '保存修改' : 'Save Changes',
    switchReg: language === 'zh' ? '还没有账号？去注册' : "Don't have an account? Sign Up",
    switchLogin: language === 'zh' ? '已有账号？去登录' : "Already have an account? Login",
    verifying: language === 'zh' ? '验证中...' : 'Verifying...',
    success: language === 'zh' ? '成功！' : 'Success!',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser: User = currentUser ? { ...currentUser, name, email } : {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      name: name || email.split('@')[0],
      email,
      isPro: false,
      credits: 10, // New users get 10 free credits
      plan: 'free'
    };

    setIsLoading(false);
    onComplete(mockUser);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                {mode === 'login' && t.loginTitle}
                {mode === 'register' && t.regTitle}
                {mode === 'update' && t.updateTitle}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {(mode === 'register' || mode === 'update') && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t.name}</label>
                        <div className="relative">
                            <input 
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                required
                            />
                            <UserIcon className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t.email}</label>
                    <div className="relative">
                        <input 
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            required
                        />
                        <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                    </div>
                </div>

                {mode !== 'update' && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t.pass}</label>
                        <div className="relative">
                            <input 
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                required
                            />
                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                        </div>
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2 mt-6"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === 'update' ? <Check className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />)}
                    {isLoading ? t.verifying : (mode === 'login' ? t.submitLogin : (mode === 'register' ? t.submitReg : t.submitUpdate))}
                </button>
            </form>

            {mode !== 'update' && (
                <div className="mt-6 text-center">
                    <button 
                        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                        className="text-sm text-slate-500 hover:text-primary-600 font-medium"
                    >
                        {mode === 'login' ? t.switchReg : t.switchLogin}
                    </button>
                </div>
            )}
          </div>
       </div>
    </div>
  );
};

export default Auth;