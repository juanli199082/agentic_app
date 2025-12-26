import React, { useState, useRef, useEffect } from 'react';
import { ViralAsset, Language, MediaMetadata } from '../types';
import { Search, Trash2, Edit3, Download, Copy, FileText, Calendar, Tag, ChevronRight, X, Layout, Magnet, Thermometer, Database, Image as ImageIcon, Video, Sparkles, Loader2, PlayCircle, CheckCircle, Share, Smartphone, QrCode } from 'lucide-react';
import { generateMediaPrompts } from '../services/geminiService';

interface AssetsLibraryProps {
  assets: ViralAsset[];
  language: Language;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<ViralAsset>) => void; // Updated signature
  onSaveAsset?: (asset: ViralAsset) => void; 
}

const AssetsLibrary: React.FC<AssetsLibraryProps> = ({ assets, language, onDelete, onUpdate, onSaveAsset }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'ANALYSIS' | 'GENERATION'>('ALL');
  const [selectedAsset, setSelectedAsset] = useState<ViralAsset | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  
  // Media Generation State
  const [generatingMedia, setGeneratingMedia] = useState<'poster' | 'video' | null>(null);
  const [generatedMedia, setGeneratedMedia] = useState<MediaMetadata | null>(null);
  
  // Sharing State
  const [isSharing, setIsSharing] = useState(false);
  const [shareStep, setShareStep] = useState<'qr' | 'authorizing' | 'success'>('qr');
  
  // Canvas Ref for real image generation
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const t = {
    title: language === 'zh' ? '爆款资产库' : 'Viral Assets Library',
    searchPlaceholder: language === 'zh' ? '搜索标题、标签...' : 'Search title, tags...',
    filterAll: language === 'zh' ? '全部' : 'All',
    filterAnalysis: language === 'zh' ? '拆解报告' : 'Analysis',
    filterGeneration: language === 'zh' ? '生成脚本' : 'Scripts',
    noAssets: language === 'zh' ? '暂无资产' : 'No assets found',
    noAssetsDesc: language === 'zh' ? '去拆解或生成一些内容吧！' : 'Go deconstruct or generate some content!',
    
    // Detail View
    back: language === 'zh' ? '返回列表' : 'Back to list',
    edit: language === 'zh' ? '编辑内容' : 'Edit Content',
    save: language === 'zh' ? '保存修改' : 'Save Changes',
    cancel: language === 'zh' ? '取消' : 'Cancel',
    delete: language === 'zh' ? '删除' : 'Delete',
    download: language === 'zh' ? '导出文本' : 'Export Text',
    
    // Report Labels
    dnaTitle: language === 'zh' ? '爆款 DNA' : 'Viral DNA',
    contentTitle: language === 'zh' ? '资产内容' : 'Asset Content',
    hook: language === 'zh' ? '钩子' : 'Hook',
    structure: language === 'zh' ? '结构' : 'Structure',
    emotion: language === 'zh' ? '情绪' : 'Emotion',

    // Media Gen
    mediaTitle: language === 'zh' ? '创意工坊 (AI多媒体)' : 'Creative Studio (AI Media)',
    genPoster: language === 'zh' ? '一键出海报' : 'Generate Poster',
    genVideo: language === 'zh' ? '一键出视频' : 'Generate Video',
    platformAdapt: language === 'zh' ? '已自动适配平台规范：' : 'Auto-adapted to platform: ',
    viewResult: language === 'zh' ? '查看生成结果' : 'View Result',
    downloadMedia: language === 'zh' ? '下载文件' : 'Download File',
    generating: language === 'zh' ? 'AI 正在提炼Prompt并渲染...' : 'AI Extracting Prompt & Rendering...',
    promptLabel: language === 'zh' ? 'AI 绘画提示词 (Prompt)' : 'AI Generation Prompt',
    
    // Sharing
    share: language === 'zh' ? '一键分享平台' : 'One-click Publish',
    scanTitle: language === 'zh' ? '扫码授权登录' : 'Scan to Authorize',
    scanDesc: (p: string) => language === 'zh' ? `请使用 ${p} App 扫码` : `Please scan with ${p} App`,
    authorizing: language === 'zh' ? '正在授权...' : 'Authorizing...',
    shareSuccess: language === 'zh' ? '发布成功！' : 'Published Successfully!',
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'ALL' || asset.sourceType === filterType;
    return matchesSearch && matchesType;
  }).sort((a, b) => b.createdAt - a.createdAt);

  const handleDownloadText = (asset: ViralAsset) => {
    const element = document.createElement("a");
    const file = new Blob([asset.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${asset.title}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const startEdit = () => {
      setEditContent(selectedAsset!.content);
      setIsEditing(true);
  };

  const saveEdit = () => {
      if (selectedAsset) {
          onUpdate(selectedAsset.id, { content: editContent });
          setSelectedAsset({ ...selectedAsset, content: editContent });
          setIsEditing(false);
      }
  };

  // --- 1. Real Image Generation (Canvas Mock) & Prompt Extraction ---
  
  const generateCanvasImage = (title: string, platform: string, style: string, isVertical: boolean): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Set Dimensions (HD)
    canvas.width = isVertical ? 1080 : 1920;
    canvas.height = isVertical ? 1920 : 1080;

    // Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1e1b4b'); // Dark Blue
    gradient.addColorStop(1, '#4c1d95'); // Purple
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative Elements (Simulate AI Art)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.arc(canvas.width, 0, canvas.width * 0.6, 0, Math.PI * 2);
    ctx.fill();

    // Text Content
    ctx.textAlign = 'center';
    
    // Platform Badge
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px sans-serif';
    ctx.fillText(platform.toUpperCase(), canvas.width / 2, 200);

    // Title
    ctx.font = 'bold 120px sans-serif';
    const words = title.split(' ');
    let line = '';
    let y = canvas.height / 2 - (words.length * 30);
    
    // Simple Text Wrapping
    for(let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > canvas.width - 200 && n > 0) {
        ctx.fillText(line, canvas.width / 2, y);
        line = words[n] + ' ';
        y += 140;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, canvas.width / 2, y);

    // Style Tag
    ctx.font = 'italic 50px sans-serif';
    ctx.fillStyle = '#fbbf24'; // Amber
    ctx.fillText(`Style: ${style}`, canvas.width / 2, canvas.height - 200);

    return canvas.toDataURL('image/png');
  };

  const handleGenerateMedia = async (type: 'poster' | 'video') => {
      if (!selectedAsset) return;
      setGeneratingMedia(type);
      setGeneratedMedia(null);
      
      const specs = getPlatformSpecs(selectedAsset.platform);
      const isVertical = specs.ratio === '9:16';

      // 1. Get Prompts from AI
      const prompts = await generateMediaPrompts(selectedAsset.content, selectedAsset.platform, language);
      
      // 2. Generate Canvas Image (Real Blob for download)
      const dataUrl = generateCanvasImage(selectedAsset.title, selectedAsset.platform, prompts.visualStyle, isVertical);
      
      const newMedia: MediaMetadata = {
          type: type,
          status: 'generated',
          prompt: type === 'poster' ? prompts.posterPrompt : prompts.videoPrompt,
          url: dataUrl, // We store the data URL directly for this demo
          resolution: isVertical ? '1080x1920' : '1920x1080',
          aspectRatio: specs.ratio,
          generatedAt: Date.now()
      };

      // Simulate network delay for effect
      setTimeout(() => {
          setGeneratedMedia(newMedia);
          setGeneratingMedia(null);
          
          // CRITICAL: Save media to asset immediately for archiving
          const updatedAsset = { ...selectedAsset, media: newMedia };
          setSelectedAsset(updatedAsset); 
          onUpdate(selectedAsset.id, { media: newMedia }); 
      }, 2000);
  };

  const handleDownloadFile = () => {
      if (!generatedMedia || !selectedAsset) return;
      
      const link = document.createElement('a');
      link.href = generatedMedia.url;
      link.download = `${selectedAsset.title.replace(/\s+/g, '_')}_${generatedMedia.type}.${generatedMedia.type === 'poster' ? 'png' : 'mp4'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  // --- Sharing Flow ---
  const handleShareClick = () => {
      setIsSharing(true);
      setShareStep('qr');
      
      // Simulate User Scan flow
      setTimeout(() => setShareStep('authorizing'), 3000);
      setTimeout(() => setShareStep('success'), 5500);
      setTimeout(() => {
          setIsSharing(false);
          setShareStep('qr');
      }, 7500);
  };

  const getPlatformSpecs = (platform: string) => {
      const p = platform.toLowerCase();
      const isVertical = p.includes('tiktok') || p.includes('douyin') || p.includes('xiaohongshu') || p.includes('shorts') || p.includes('reel') || p.includes('rednote') || p.includes('channel');
      
      return {
          ratio: isVertical ? '9:16' : '16:9',
          ratioClass: isVertical ? 'aspect-[9/16] max-w-[240px]' : 'aspect-video max-w-[320px]',
          icon: isVertical ? <Smartphone className="w-4 h-4" /> : <Layout className="w-4 h-4" />,
          label: isVertical ? 'Vertical (9:16)' : 'Horizontal (16:9)'
      };
  };

  // --- List View (unchanged logic mostly) ---
  if (!selectedAsset) {
    return (
      <div className="h-full flex flex-col p-6 animate-in fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Database className="w-6 h-6 text-primary-600" />
                    {t.title}
                </h2>
                <p className="text-slate-500 text-sm mt-1">{filteredAssets.length} assets stored</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder={t.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none w-full sm:w-64"
                    />
                </div>
                {/* Filter */}
                <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                    {(['ALL', 'ANALYSIS', 'GENERATION'] as const).map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                                filterType === type ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
                            }`}
                        >
                            {type === 'ALL' ? t.filterAll : (type === 'ANALYSIS' ? t.filterAnalysis : t.filterGeneration)}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {filteredAssets.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <FileText className="w-16 h-16 mb-4 opacity-20" />
                <p>{t.noAssets}</p>
                <p className="text-sm mt-1">{t.noAssetsDesc}</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-20">
                {filteredAssets.map(asset => (
                    <div 
                        key={asset.id} 
                        onClick={() => { setSelectedAsset(asset); setGeneratedMedia(asset.media || null); }}
                        className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-300 transition-all cursor-pointer group flex flex-col h-[220px]"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                                asset.sourceType === 'ANALYSIS' 
                                ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                                : 'bg-purple-50 text-purple-600 border border-purple-100'
                            }`}>
                                {asset.sourceType === 'ANALYSIS' ? t.filterAnalysis : t.filterGeneration}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(asset.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        
                        <h3 className="font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                            {asset.title}
                        </h3>

                        <div className="flex-1">
                            <div className="flex gap-2 mb-3">
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 line-clamp-1">{asset.viralDNA.hook}</span>
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 line-clamp-1">{asset.viralDNA.emotion}</span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-3 font-mono bg-slate-50 p-2 rounded border border-slate-100">
                                {asset.content}
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                            {asset.tags.slice(0, 2).map((tag, i) => (
                                <span key={i} className="flex items-center gap-1 text-[10px] text-slate-400">
                                    <Tag className="w-3 h-3" /> {tag}
                                </span>
                            ))}
                            {asset.media && (
                                <span className="ml-auto text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold border border-green-200">
                                    {asset.media.type === 'poster' ? 'POSTER' : 'VIDEO'}
                                </span>
                            )}
                            {!asset.media && <ChevronRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-primary-500" />}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    );
  }

  // --- Detail View ---
  const specs = getPlatformSpecs(selectedAsset.platform);

  return (
    <div className="h-full flex flex-col p-6 animate-in slide-in-from-right-4 relative">
        
        {/* Share Modal (QR Code) */}
        {isSharing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center relative">
                    <button 
                        onClick={() => setIsSharing(false)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {shareStep === 'qr' && (
                        <>
                            <h3 className="text-xl font-bold mb-2">{t.scanTitle}</h3>
                            <p className="text-sm text-slate-500 mb-6">{t.scanDesc(selectedAsset.platform)}</p>
                            <div className="bg-white p-4 border-2 border-slate-900 rounded-xl inline-block mb-6 relative group">
                                <QrCode className="w-48 h-48 text-slate-900" />
                                <div className="absolute inset-0 flex items-center justify-center bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-xs font-bold text-slate-800">Simulating Scan...</span>
                                </div>
                            </div>
                            <div className="flex justify-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-slate-800 animate-bounce" style={{animationDelay: '0ms'}}></div>
                                <div className="w-2 h-2 rounded-full bg-slate-800 animate-bounce" style={{animationDelay: '150ms'}}></div>
                                <div className="w-2 h-2 rounded-full bg-slate-800 animate-bounce" style={{animationDelay: '300ms'}}></div>
                            </div>
                        </>
                    )}

                    {shareStep === 'authorizing' && (
                        <div className="py-12">
                            <Loader2 className="w-16 h-16 text-primary-500 animate-spin mx-auto mb-6" />
                            <h3 className="text-lg font-bold text-slate-700">{t.authorizing}</h3>
                        </div>
                    )}

                    {shareStep === 'success' && (
                        <div className="py-12">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">{t.shareSuccess}</h3>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
            <button 
                onClick={() => { setSelectedAsset(null); setIsEditing(false); setGeneratedMedia(null); }}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors"
            >
                <X className="w-5 h-5" /> {t.back}
            </button>
            <div className="flex gap-2">
                 <button onClick={() => handleDownloadText(selectedAsset)} className="p-2 text-slate-500 hover:text-primary-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all" title={t.download}>
                    <FileText className="w-5 h-5" />
                 </button>
                 <button onClick={() => {onDelete(selectedAsset.id); setSelectedAsset(null);}} className="p-2 text-slate-500 hover:text-red-600 bg-white border border-slate-200 rounded-lg hover:bg-red-50 transition-all" title={t.delete}>
                    <Trash2 className="w-5 h-5" />
                 </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-8 pb-20">
                {/* Meta Header */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${
                            selectedAsset.sourceType === 'ANALYSIS' 
                            ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                            : 'bg-purple-50 text-purple-600 border border-purple-100'
                        }`}>
                            {selectedAsset.sourceType === 'ANALYSIS' ? t.filterAnalysis : t.filterGeneration}
                        </span>
                        <span className="text-slate-400 text-sm">{new Date(selectedAsset.createdAt).toLocaleString()}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-6">{selectedAsset.title}</h1>
                    
                    {/* Viral DNA Dashboard */}
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Database className="w-4 h-4" /> {t.dnaTitle}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center gap-3">
                                <div className="p-2 bg-red-50 rounded text-red-500"><Magnet className="w-5 h-5" /></div>
                                <div>
                                    <div className="text-xs text-slate-400 font-bold uppercase">{t.hook}</div>
                                    <div className="font-bold text-slate-800">{selectedAsset.viralDNA.hook}</div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center gap-3">
                                <div className="p-2 bg-orange-50 rounded text-orange-500"><Thermometer className="w-5 h-5" /></div>
                                <div>
                                    <div className="text-xs text-slate-400 font-bold uppercase">{t.emotion}</div>
                                    <div className="font-bold text-slate-800">{selectedAsset.viralDNA.emotion}</div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded text-blue-500"><Layout className="w-5 h-5" /></div>
                                <div>
                                    <div className="text-xs text-slate-400 font-bold uppercase">{t.structure}</div>
                                    <div className="font-bold text-slate-800">{selectedAsset.viralDNA.structure}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="font-bold text-slate-700">{t.contentTitle}</h3>
                        <div className="flex gap-2">
                             {isEditing ? (
                                <>
                                    <button onClick={() => setIsEditing(false)} className="text-xs px-3 py-1.5 rounded text-slate-600 hover:bg-slate-200 transition-colors">{t.cancel}</button>
                                    <button onClick={saveEdit} className="text-xs px-3 py-1.5 rounded bg-primary-600 text-white hover:bg-primary-700 transition-colors font-bold">{t.save}</button>
                                </>
                             ) : (
                                <button onClick={startEdit} className="text-xs px-3 py-1.5 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1">
                                    <Edit3 className="w-3 h-3" /> {t.edit}
                                </button>
                             )}
                        </div>
                    </div>
                    <div className="p-6">
                        {isEditing ? (
                            <textarea 
                                className="w-full h-[400px] p-4 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono text-sm leading-relaxed"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                            />
                        ) : (
                            <div className="prose prose-slate max-w-none font-mono text-sm whitespace-pre-wrap leading-relaxed">
                                {selectedAsset.content}
                            </div>
                        )}
                    </div>
                </div>

                {/* Multimedia Conversion Section */}
                {selectedAsset.sourceType === 'GENERATION' && (
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-lg border border-slate-700">
                        <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4">
                             <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                             <h3 className="font-bold text-lg">{t.mediaTitle}</h3>
                        </div>

                        {!generatedMedia ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                                    <span className="text-lg">{specs.icon}</span> 
                                    {t.platformAdapt} 
                                    <span className="font-bold text-white bg-slate-700 px-2 py-0.5 rounded">{selectedAsset.platform} ({specs.label})</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => handleGenerateMedia('poster')}
                                        disabled={!!generatingMedia}
                                        className="relative group bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-primary-500 p-6 rounded-xl transition-all text-left overflow-hidden"
                                    >
                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="p-3 bg-purple-500/20 rounded-lg w-fit mb-4">
                                                <ImageIcon className="w-6 h-6 text-purple-400" />
                                            </div>
                                            <h4 className="font-bold text-lg mb-1">{t.genPoster}</h4>
                                            <p className="text-xs text-slate-400">High-converting visual summary.</p>
                                        </div>
                                        {generatingMedia === 'poster' && (
                                            <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center">
                                                <Loader2 className="w-6 h-6 animate-spin text-white" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </button>

                                    <button 
                                        onClick={() => handleGenerateMedia('video')}
                                        disabled={!!generatingMedia}
                                        className="relative group bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-primary-500 p-6 rounded-xl transition-all text-left overflow-hidden"
                                    >
                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="p-3 bg-blue-500/20 rounded-lg w-fit mb-4">
                                                <Video className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <h4 className="font-bold text-lg mb-1">{t.genVideo}</h4>
                                            <p className="text-xs text-slate-400">AI-edited video with subtitles.</p>
                                        </div>
                                        {generatingMedia === 'video' && (
                                            <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center">
                                                <Loader2 className="w-6 h-6 animate-spin text-white" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </button>
                                </div>
                                {generatingMedia && <div className="text-center text-xs text-slate-400 mt-2 italic animate-pulse">{t.generating}</div>}
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                        <span className="font-bold">{generatedMedia.type === 'poster' ? t.genPoster : t.genVideo} {language === 'zh' ? '完成' : 'Ready'}</span>
                                    </div>
                                    <button onClick={() => { setGeneratedMedia(null); setIsSharing(false); }} className="text-xs text-slate-400 hover:text-white underline">
                                        {language === 'zh' ? '重新生成' : 'Generate New'}
                                    </button>
                                </div>
                                
                                <div className="flex flex-col md:flex-row gap-6 bg-slate-950/50 p-6 rounded-xl border border-slate-700">
                                     {/* 1. Result Preview */}
                                     <div className={`shrink-0 ${specs.ratioClass} bg-slate-800 rounded-lg border border-slate-600 flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl`}>
                                         {generatedMedia.type === 'poster' ? (
                                             <img src={generatedMedia.url} alt="Generated Poster" className="w-full h-full object-cover" />
                                         ) : (
                                            <>
                                             <img src={generatedMedia.url} alt="Video Thumbnail" className="w-full h-full object-cover opacity-50" />
                                             <PlayCircle className="absolute w-12 h-12 text-white opacity-80" />
                                            </>
                                         )}
                                     </div>

                                     {/* 2 & 3. Actions & Details */}
                                     <div className="flex-1 flex flex-col justify-start">
                                         <h4 className="font-bold text-lg mb-2">{selectedAsset.title}.{generatedMedia.type === 'poster' ? 'png' : 'mp4'}</h4>
                                         <div className="text-xs text-slate-400 space-y-1 mb-4 border-b border-slate-700 pb-4">
                                             <p>• Resolution: {generatedMedia.resolution}</p>
                                             <p>• Aspect Ratio: {generatedMedia.aspectRatio}</p>
                                             <p>• Size: {generatedMedia.type === 'poster' ? '2.4 MB' : '145 MB'}</p>
                                         </div>
                                         
                                         {/* Prompt Display */}
                                         <div className="bg-black/30 p-3 rounded-lg border border-slate-700 mb-4">
                                             <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 flex justify-between">
                                                 {t.promptLabel}
                                                 <Copy className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => navigator.clipboard.writeText(generatedMedia.prompt)} />
                                             </div>
                                             <p className="text-xs text-slate-300 font-mono line-clamp-3">{generatedMedia.prompt}</p>
                                         </div>

                                         <div className="mt-auto space-y-3">
                                            <button 
                                                onClick={handleDownloadFile}
                                                className="bg-primary-600 hover:bg-primary-500 text-white w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-900/50"
                                            >
                                                <Download className="w-4 h-4" /> {t.downloadMedia}
                                            </button>
                                            
                                            <button 
                                                onClick={handleShareClick}
                                                className="w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all border-2 border-slate-600 hover:border-green-500 hover:text-green-400 hover:bg-green-500/10 text-slate-300"
                                            >
                                                <Share className="w-4 h-4" /> {t.share}
                                            </button>
                                         </div>
                                     </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default AssetsLibrary;