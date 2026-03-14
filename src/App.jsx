import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'qrcode';
import DarkVeil from './components/DarkVeil';
import DecryptedText from './components/DecryptedText';
import GlassSurface from './components/GlassSurface';
import './App.css';

const QR_STYLES = [
  { id: 1, key: 'classic', darkColor: '#ffffff', lightColor: '#0a0e27', margin: 2 },
  { id: 2, key: 'neonBlue', darkColor: '#00d4ff', lightColor: '#0a0e27', margin: 2 },
  { id: 3, key: 'purpleGlow', darkColor: '#a855f7', lightColor: '#0f0520', margin: 2 },
  { id: 4, key: 'emerald', darkColor: '#10b981', lightColor: '#021a0f', margin: 2 },
  { id: 5, key: 'sunset', darkColor: '#f97316', lightColor: '#1a0800', margin: 2 },
  { id: 6, key: 'rose', darkColor: '#fb7185', lightColor: '#1a0510', margin: 2 },
  { id: 7, key: 'gold', darkColor: '#fbbf24', lightColor: '#1a1500', margin: 2 },
  { id: 8, key: 'cyberGreen', darkColor: '#22d3ee', lightColor: '#001a1a', margin: 2 },
  { id: 9, key: 'lavender', darkColor: '#c084fc', lightColor: '#0d0018', margin: 2 },
  { id: 10, key: 'minimalWhite', darkColor: '#e2e8f0', lightColor: '#0f172a', margin: 3 },
];

const STYLE_NAMES = {
  en: {
    classic: 'Classic', neonBlue: 'Neon Blue', purpleGlow: 'Purple Glow',
    emerald: 'Emerald', sunset: 'Sunset', rose: 'Rose', gold: 'Gold',
    cyberGreen: 'Cyber Green', lavender: 'Lavender', minimalWhite: 'Minimal White',
  },
  uz: {
    classic: 'Klassik', neonBlue: 'Neon Ko\'k', purpleGlow: 'Binafsha',
    emerald: 'Zumrad', sunset: 'Quyosh', rose: 'Atirgul', gold: 'Oltin',
    cyberGreen: 'Kiber Yashil', lavender: 'Lavanda', minimalWhite: 'Oq Minimal',
  },
  ru: {
    classic: 'Классика', neonBlue: 'Неон', purpleGlow: 'Фиолет',
    emerald: 'Изумруд', sunset: 'Закат', rose: 'Роза', gold: 'Золото',
    cyberGreen: 'Кибер', lavender: 'Лаванда', minimalWhite: 'Белый',
  },
};

const LANGS = {
  en: {
    title: 'QR Generator',
    placeholder: 'https://',
    generate: 'Generate',
    generating: 'Generating...',
    processing: 'Processing',
    completed: 'Process completed',
    download: 'Download QR Code',
    createAnother: 'Create Another',
    author: 'Isabek Sultonbekov',
    themes: 'Theme',
    langName: 'English',
    invalidUrl: 'Please enter a valid URL',
    uploadFile: 'Upload File',
    supportedFiles: 'PDF, Word, Excel, Images, etc.',
    fileUploaded: 'File uploaded',
    removeFile: 'Remove',
    uploading: 'Uploading file...',
    uploadError: 'Upload failed. Please check your connection and try again.',
    fileSuccess: 'File uploaded! Click Generate.',
    dragDrop: 'Drag & drop file here or click',
    tabUrl: 'URL',
    tabFile: 'File',
    dragOrClick: 'Drag & drop or click to select',
  },
  uz: {
    title: 'QR Generator',
    placeholder: 'https://',
    generate: 'Yaratish',
    generating: 'Yaratilmoqda...',
    processing: 'Jarayon',
    completed: 'Jarayon yakunlandi',
    download: 'QR Kodni Yuklab Olish',
    createAnother: 'Yana Yaratish',
    author: 'Isabek Sultonbekov',
    themes: 'Mavzu',
    langName: 'O\'zbekcha',
    invalidUrl: 'To\'g\'ri URL kiriting',
    uploadFile: 'Fayl Yuklash',
    supportedFiles: 'PDF, Word, Excel, Rasmlar va boshqalar',
    fileUploaded: 'Fayl yuklandi',
    removeFile: 'O\'chirish',
    uploading: 'Fayl yuklanmoqda...',
    uploadError: 'Yuklash xatosi. Internetni tekshiring va qayta urinib ko\'ring.',
    fileSuccess: 'Fayl yuklandi! Generate bosing.',
    dragDrop: 'Faylni shu yerga tashlang yoki bosing',
    tabUrl: 'URL',
    tabFile: 'Fayl',
    dragOrClick: 'Tashlang yoki bosing',
  },
  ru: {
    title: 'QR Генератор',
    placeholder: 'https://',
    generate: 'Создать',
    generating: 'Создание...',
    processing: 'Обработка',
    completed: 'Процесс завершён',
    download: 'Скачать QR Код',
    createAnother: 'Создать Ещё',
    author: 'Исабек Султонбеков',
    themes: 'Тема',
    langName: 'Русский',
    invalidUrl: 'Введите правильный URL',
    uploadFile: 'Загрузить файл',
    supportedFiles: 'PDF, Word, Excel, Изображения и др.',
    fileUploaded: 'Файл загружен',
    removeFile: 'Удалить',
    uploading: 'Загрузка файла...',
    uploadError: 'Ошибка загрузки. Проверьте соединение и попробуйте снова.',
    fileSuccess: 'Файл загружен! Нажмите Создать.',
    dragDrop: 'Перетащите файл сюда или нажмите',
    tabUrl: 'URL',
    tabFile: 'Файл',
    dragOrClick: 'Перетащите или нажмите',
  },
};

function App() {
  const [url, setUrl] = useState('');
  const [lang, setLang] = useState('en');
  const [selectedStyle, setSelectedStyle] = useState(QR_STYLES[0]);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [inputMode, setInputMode] = useState('url');
  const [isDragging, setIsDragging] = useState(false);
  const progressIntervalRef = useRef(null);
  const langDropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const t = LANGS[lang];

  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  const uploadFileToServer = async (file) => {
    setUrlError('');
    setIsUploading(true);
    setUploadedFile(file);

    // Try 0x0.st first
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://0x0.st', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const url = await response.text();
        if (url && url.startsWith('https://')) {
          setUrl(url.trim());
          setIsUploading(false);
          return;
        }
      }
    } catch (err) {
      console.log('0x0.st failed, trying uguu.se:', err);
    }

    // Try uguu.se as fallback
    try {
      const formData = new FormData();
      formData.append('files[]', file);

      const response = await fetch('https://uguu.se/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success && data.files?.[0]?.url) {
        setUrl(data.files[0].url);
        setIsUploading(false);
        return;
      }
    } catch (err) {
      console.log('uguu.se failed, trying litterbox:', err);
    }

    // Try litterbox (catbox) as last fallback
    try {
      const formData = new FormData();
      formData.append('reqtype', 'fileupload');
      formData.append('time', '72h');
      formData.append('fileToUpload', file);

      const response = await fetch('https://litterbox.catbox.moe/resources/internals/api.php', {
        method: 'POST',
        body: formData,
      });

      const url = await response.text();
      if (url && url.startsWith('https://')) {
        setUrl(url.trim());
        setIsUploading(false);
        return;
      }
    } catch (err) {
      console.error('All upload services failed:', err);
    }

    // All services failed
    setUrlError(t.uploadError);
    setUploadedFile(null);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFileToServer(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer?.files?.[0];
    if (file) {
      await uploadFileToServer(file);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setUrl('');
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const generateQR = useCallback(async () => {
    if (!url.trim() && !uploadedFile) return;

    if (!uploadedFile && !isValidUrl(url)) {
      setUrlError(t.invalidUrl);
      return;
    }

    setUrlError('');

    const qrContent = url;

    setIsGenerating(true);
    setProgress(0);
    setShowComplete(false);
    setQrDataUrl(null);

    let currentProgress = 0;
    progressIntervalRef.current = setInterval(() => {
      currentProgress += Math.random() * 15 + 5;
      if (currentProgress > 90) currentProgress = 90;
      setProgress(Math.floor(currentProgress));
    }, 120);

    try {
      await new Promise(r => setTimeout(r, 800));

      const dataUrl = await QRCode.toDataURL(qrContent, {
        width: 512,
        margin: selectedStyle.margin,
        color: {
          dark: selectedStyle.darkColor,
          light: selectedStyle.lightColor,
        },
        errorCorrectionLevel: uploadedFile ? 'L' : 'H',
      });

      clearInterval(progressIntervalRef.current);
      setProgress(100);
      setQrDataUrl(dataUrl);

      await new Promise(r => setTimeout(r, 400));

      setIsGenerating(false);
      setShowComplete(true);
    } catch (err) {
      clearInterval(progressIntervalRef.current);
      setIsGenerating(false);
      setProgress(0);
      if (uploadedFile) {
        setUrlError(t.fileTooLarge);
      }
      console.error(err);
    }
  }, [url, selectedStyle, uploadedFile, t]);

  const downloadQR = useCallback(() => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `qr-${selectedStyle.key}.png`;
    link.href = qrDataUrl;
    link.click();
  }, [qrDataUrl, selectedStyle]);

  const resetForm = () => {
    setUrl('');
    setQrDataUrl(null);
    setShowComplete(false);
    setProgress(0);
    setUrlError('');
    setUploadedFile(null);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  // Regenerate QR code when theme changes after generation
  useEffect(() => {
    const regenerateQRWithNewTheme = async () => {
      if (!qrDataUrl || !url) return;

      try {
        const dataUrl = await QRCode.toDataURL(url, {
          width: 512,
          margin: selectedStyle.margin,
          color: {
            dark: selectedStyle.darkColor,
            light: selectedStyle.lightColor,
          },
          errorCorrectionLevel: uploadedFile ? 'L' : 'H',
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error('Theme change error:', err);
      }
    };

    regenerateQRWithNewTheme();
  }, [selectedStyle, qrDataUrl, url, uploadedFile]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full overflow-hidden">
      {/* DarkVeil Background */}
      <div className="fixed inset-0 z-0">
        <DarkVeil
          hueShift={24}
          noiseIntensity={0}
          scanlineIntensity={0}
          speed={2.1}
          scanlineFrequency={0}
          warpAmount={0}
        />
        <div className="absolute inset-0 bg-[#0a0e27]/60" />
      </div>


      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center min-h-screen min-h-[100dvh] px-4 pt-8 pb-6 sm:pt-12 sm:pb-8 md:pt-16 md:pb-12">
        
        <div className="flex-1 flex flex-col items-center justify-center w-full gap-8 sm:gap-10">
        
          {/* Language Switcher - Globe Style with Dropdown */}
          <motion.div
            ref={langDropdownRef}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative mb-4 sm:mb-6 z-[100]"
          >
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="group flex items-center gap-3 px-6 py-3 bg-white/[0.06] border-2 border-cyan-400/25 rounded-full hover:bg-white/[0.1] hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(56,189,248,0.15)] transition-all duration-300"
          >
            {/* Globe Icon */}
            <svg className="w-6 h-6 text-cyan-300/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            
            {/* Language Name */}
            <span className="text-sm font-medium text-white/90 tracking-wide min-w-[80px] text-left">
              {t.langName}
            </span>
            
            {/* Dropdown Arrow */}
            <motion.svg 
              className="w-4 h-4 text-cyan-300/60 group-hover:text-cyan-300/90 transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={{ rotate: showLangDropdown ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showLangDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full mt-2 left-0 right-0 bg-[#0a0e27]/95 backdrop-blur-xl border-2 border-cyan-400/30 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(56,189,248,0.2)] z-[110]"
              >
                {Object.keys(LANGS).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                      setShowLangDropdown(false);
                    }}
                    className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 ${
                      lang === l
                        ? 'bg-cyan-400/20 text-cyan-100 border-l-4 border-cyan-400'
                        : 'text-white/70 hover:bg-white/[0.08] hover:text-white/90 border-l-4 border-transparent'
                    }`}
                  >
                    <svg className="w-5 h-5 text-cyan-300/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium tracking-wide">
                      {LANGS[l].langName}
                    </span>
                    {lang === l && (
                      <svg className="w-4 h-4 ml-auto text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="w-full max-w-2xl relative"
          >
            {/* Glass Card - No Rotating Border */}
            <div className="relative bg-[#0a0e27]/40 rounded-2xl border-[3px] border-cyan-400/25 shadow-[0_0_40px_rgba(56,189,248,0.15)]">
              <GlassSurface
                width="100%"
                height="auto"
                borderRadius={16}
                brightness={8}
                opacity={0.2}
                blur={18}
                displace={0.4}
                backgroundOpacity={0.05}
                saturation={1.2}
                distortionScale={-180}
                redOffset={0}
                greenOffset={10}
                blueOffset={20}
                className="glass-main-card"
                style={{ border: 'none', boxShadow: '0 0 80px rgba(56, 189, 248, 0.06), inset 0 0 60px rgba(56, 189, 248, 0.02)' }}
              >
            <div className="flex flex-col items-center px-6 py-6 sm:px-10 sm:py-8 md:px-12 md:py-10 gap-5 sm:gap-6">

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extralight tracking-[0.25em] sm:tracking-[0.3em] uppercase text-white/90 text-center">
                {t.title}
              </h1>

              {/* Divider */}
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

              {/* Tab Switcher: URL | File */}
              <div className="w-full max-w-sm">
                <div className="flex rounded-lg overflow-hidden border-2 border-cyan-400/20 mb-4">
                  <button
                    onClick={() => { setInputMode('url'); clearFile(); setUrlError(''); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[11px] uppercase tracking-wider font-medium transition-all duration-300 ${
                      inputMode === 'url'
                        ? 'bg-cyan-400/20 text-cyan-100 border-r border-cyan-400/20'
                        : 'bg-white/[0.03] text-white/40 hover:text-white/60 hover:bg-white/[0.06] border-r border-cyan-400/20'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {t.tabUrl}
                  </button>
                  <button
                    onClick={() => { setInputMode('file'); setUrl(''); setUrlError(''); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[11px] uppercase tracking-wider font-medium transition-all duration-300 ${
                      inputMode === 'file'
                        ? 'bg-cyan-400/20 text-cyan-100'
                        : 'bg-white/[0.03] text-white/40 hover:text-white/60 hover:bg-white/[0.06]'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {t.tabFile}
                  </button>
                </div>

                {/* URL Input */}
                {inputMode === 'url' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => {
                        setUrl(e.target.value);
                        setUrlError('');
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && generateQR()}
                      placeholder={t.placeholder}
                      className={`w-full bg-white/[0.06] border-2 rounded-lg px-3 py-2 text-white text-[11px] tracking-wide placeholder:text-white/30 focus:outline-none transition-all duration-300 font-normal ${
                        urlError 
                          ? 'border-red-400/50 focus:border-red-400/70' 
                          : 'border-cyan-400/20 focus:border-cyan-400/50 focus:bg-white/[0.08] focus:shadow-[0_0_15px_rgba(56,189,248,0.1)]'
                      }`}
                    />
                    {urlError && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-[10px] mt-1.5 ml-1"
                      >
                        {urlError}
                      </motion.p>
                    )}
                  </motion.div>
                )}

                {/* File Upload */}
                {inputMode === 'file' && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.svg"
                      className="hidden"
                    />
                    {uploadedFile ? (
                      <div className={`w-full flex items-center gap-2 px-3 py-2.5 border-2 rounded-lg ${isUploading ? 'bg-yellow-400/10 border-yellow-400/30' : 'bg-cyan-400/10 border-cyan-400/30'}`}>
                        {isUploading ? (
                          <svg className="w-4 h-4 text-yellow-300/80 shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-green-400/80 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        <span className={`text-[11px] truncate flex-1 ${isUploading ? 'text-yellow-100/90' : 'text-cyan-100/90'}`}>
                          {isUploading ? t.uploading : uploadedFile.name}
                        </span>
                        <button
                          onClick={clearFile}
                          className="text-[9px] text-red-400/70 hover:text-red-400 transition-colors uppercase tracking-wider shrink-0 px-2 py-1 rounded border border-red-400/30 hover:border-red-400/60"
                        >
                          {t.removeFile}
                        </button>
                      </div>
                    ) : (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full flex flex-col items-center justify-center gap-2 px-3 py-5 border-2 border-dashed rounded-lg transition-all duration-300 cursor-pointer ${
                          isDragging
                            ? 'bg-cyan-400/20 border-cyan-400/60 scale-[1.02]'
                            : 'bg-white/[0.03] border-white/15 hover:bg-white/[0.06] hover:border-cyan-400/30'
                        }`}
                      >
                        <svg className={`w-6 h-6 transition-colors ${isDragging ? 'text-cyan-300/90' : 'text-cyan-300/40 group-hover:text-cyan-300/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className={`text-[11px] transition-colors ${isDragging ? 'text-cyan-100/90' : 'text-white/40 hover:text-white/70'}`}>
                          {isDragging ? 'Drop file here' : t.dragOrClick}
                        </span>
                        <span className="text-[8px] text-white/20">{t.supportedFiles}</span>
                      </div>
                    )}
                    {urlError && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-[10px] mt-1.5 ml-1"
                      >
                        {urlError}
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Style Selector - Only Color Dots */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                {QR_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style)}
                    className={`group relative p-1 transition-all duration-300 rounded-full ${
                      selectedStyle.id === style.id
                        ? 'scale-125 ring-2 ring-offset-2 ring-offset-transparent'
                        : 'hover:scale-110'
                    }`}
                    style={selectedStyle.id === style.id ? { ringColor: style.darkColor + '80' } : {}}
                    title={STYLE_NAMES[lang][style.key]}
                  >
                    <div
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white/20 transition-all duration-300"
                      style={{ 
                        backgroundColor: style.darkColor, 
                        boxShadow: selectedStyle.id === style.id ? `0 0 15px ${style.darkColor}70, 0 0 30px ${style.darkColor}30` : `0 2px 8px ${style.darkColor}40`,
                        borderColor: selectedStyle.id === style.id ? style.darkColor : 'rgba(255,255,255,0.2)'
                      }}
                    />
                  </button>
                ))}
              </div>

              {/* Generate Button */}
              <button
                onClick={generateQR}
                disabled={!url.trim() || isGenerating || isUploading}
                className="w-full sm:w-auto px-10 sm:px-16 py-3 sm:py-3.5 border-2 border-cyan-400/30 text-[11px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase text-cyan-100/80 font-medium hover:text-white hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:shadow-[0_0_20px_rgba(56,189,248,0.1)] transition-all duration-500 disabled:opacity-20 disabled:cursor-not-allowed rounded-md"
              >
                {isGenerating ? t.generating : t.generate}
              </button>

              {/* Progress Bar */}
              <AnimatePresence>
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="w-full"
                  >
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-cyan-300/30">
                        {t.processing}
                      </span>
                      <motion.span
                        key={progress}
                        initial={{ opacity: 0.5, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-xl sm:text-2xl font-extralight text-cyan-200/80 tabular-nums"
                      >
                        {progress}
                        <span className="text-xs sm:text-sm text-cyan-300/30 ml-0.5">%</span>
                      </motion.span>
                    </div>
                    <div className="h-[1px] bg-white/[0.06] w-full overflow-hidden rounded-full">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-400/40 to-cyan-300/60"
                        initial={{ width: '0%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* QR Code Preview */}
              <AnimatePresence>
                {qrDataUrl && !isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="p-4 sm:p-5 border-2 border-cyan-400/15 bg-white/[0.03] rounded-xl shadow-[0_0_30px_rgba(56,189,248,0.08)]">
                      <img
                        src={qrDataUrl}
                        alt="QR Code"
                        className="w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded-lg"
                      />
                    </div>
                    <p className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-cyan-300/30 text-center font-medium">
                      {STYLE_NAMES[lang][selectedStyle.key]}
                    </p>
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        onClick={downloadQR}
                        className="group relative px-8 sm:px-10 py-3 sm:py-3.5 border-2 border-cyan-400/40 bg-cyan-400/5 text-[11px] sm:text-xs tracking-[0.25em] uppercase text-cyan-100 font-semibold hover:text-white hover:border-cyan-400/60 hover:bg-cyan-400/15 hover:shadow-[0_0_25px_rgba(56,189,248,0.2)] transition-all duration-500 rounded-lg overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          {t.download}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      </motion.button>
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        onClick={resetForm}
                        className="group relative px-8 sm:px-10 py-3 sm:py-3.5 border-2 border-white/20 bg-white/[0.03] text-[11px] sm:text-xs tracking-[0.25em] uppercase text-white/70 font-semibold hover:text-white hover:border-white/40 hover:bg-white/[0.08] transition-all duration-500 rounded-lg overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                          </svg>
                          {t.createAnother}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Decrypted Text - Process Complete */}
              <AnimatePresence>
                {showComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-lg sm:text-xl md:text-2xl font-extralight tracking-[0.15em] sm:tracking-[0.2em] uppercase text-cyan-300"
                  >
                    <DecryptedText
                      text={t.completed}
                      speed={60}
                      maxIterations={10}
                      characters="ABCD1234!?"
                      animateOn="view"
                      revealDirection="start"
                      sequential
                      useOriginalCharsOnly={false}
                      parentClassName="decrypted-parent"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Author with GitHub Link */}
              <div className="pt-1 sm:pt-2">
                <a 
                  href="https://github.com/IsabekSultonbekov" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-[8px] sm:text-[9px] tracking-[0.3em] uppercase text-white/20 hover:text-cyan-300/40 font-extralight transition-all duration-300"
                >
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>{t.author}</span>
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

            </div>
          </GlassSurface>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default App;
