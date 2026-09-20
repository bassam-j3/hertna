import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { SAMPLE_LOCATIONS } from '../data/constants';
import EditProfileModal from '../components/profile/EditProfileModal';
import SupportTicketModal from '../components/profile/SupportTicketModal';
import apiClient from '../services/apiClient';

import { Rating } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface ProfileViewProps {
  currentLocation: string;
  onUpdateLocation?: (newLoc: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  userProfile?: { name: string; city: string; neighborhood: string; avatar: string; isLoggedIn: boolean };
  onOpenLogin?: () => void;
  ratings?: Rating[];
}

// Recharts mock datasets for user activity dashboard
const monthlyData = [
  { month: 'مارس', items: 2, helps: 1 },
  { month: 'أبريل', items: 3, helps: 2 },
  { month: 'مايو', items: 4, helps: 3 },
  { month: 'يونيو', items: 5, helps: 4 },
  { month: 'يوليو', items: 7, helps: 5 },
  { month: 'أغسطس', items: 6, helps: 5 },
];

const categoryData = [
  { name: ' منزلية', count: 6, color: '#0d631b' },
  { name: 'أجهزة كهربائية', count: 4, color: '#2563eb' },
  { name: 'مستلزمات طبية', count: 3, color: '#0284c7' },
  { name: 'أثاث ومفروشات', count: 2, color: '#d97706' },
];

const ratingBreakdown = [
  { stars: '5 نجوم', count: 18 },
  { stars: '4 نجوم', count: 2 },
  { stars: '3 نجوم', count: 0 },
  { stars: 'نجمتان', count: 0 },
  { stars: 'نجمة واحدة', count: 0 },
];

const AVATAR_PRESETS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCZBLT_yaLwOuRch_thTaTQzGZb37gtyzu-K0GYjqeo4eteM2h2jJ3o6A7aS1eBd50leLwAMCtsoFEKL0YIudXslyY-YAKXQMnoYXe8HpqW-GPtYJtmrTQ34h39gyur_VMoc3vax_btqfZWX0yyNdq4A61neyrSKJerdHZZNEZOzOlUk0LP8F75JSaWe0ZlJqQctHu2k6j32qhB5_2tMQB-RPlAu1iSZEnjRMmZKR4ixvv99ywKDxDt',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentLocation,
  onUpdateLocation,
  isDarkMode,
  onToggleDarkMode,
  userProfile,
  onOpenLogin,
  ratings = [],
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'monthly' | 'categories' | 'ratings'>('monthly');
  const navigate = useNavigate();

  // Compute dynamic average rating
  const userAvgNum = ratings.length > 0
    ? ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length
    : 4.9;
  const userAvgStr = userAvgNum.toFixed(1);

  const { currentUser, login, logout, setIsLoginModalOpen } = useAuth();

  // Editable Profile State
  const [profile, setProfile] = useState({
    name: currentUser?.name || 'ياسين جمال',
    bio: 'جار متعاون في حي الروضة - يسعدني إعارة الأدوات المنزلية والطبية لمساعدة أهالي الحي والأسر العائدة.',
    phone: currentUser?.phone || '+963 944 123 456',
    job: 'مهندس تقني / متطوع محلي',
    email: 'yassin.jamal@example.com',
    avatar: currentUser?.avatar || AVATAR_PRESETS[0],
    city: currentUser?.city || 'دمشق',
    neighborhood: currentUser?.neighborhood || 'حي الروضة'
  });

  // Sync profile state with currentUser when it changes (Fixes stale session data)
  useEffect(() => {
    if (currentUser) {
      setProfile(prev => ({
        ...prev,
        name: currentUser.name,
        phone: currentUser.phone,
        avatar: currentUser.avatar || prev.avatar,
        city: currentUser.city,
        neighborhood: currentUser.neighborhood,
      }));
    } else {
      setProfile({
        name: 'ياسين جمال',
        bio: 'جار متعاون في حي الروضة - يسعدني إعارة الأدوات المنزلية والطبية لمساعدة أهالي الحي والأسر العائدة.',
        phone: '+963 944 123 456',
        job: 'مهندس تقني / متطوع محلي',
        email: 'yassin.jamal@example.com',
        avatar: AVATAR_PRESETS[0],
        city: 'دمشق',
        neighborhood: 'حي الروضة'
      });
    }
  }, [currentUser]);

  // Modal Open States
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({ type: 'استفسار عام', message: '' });
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isEtiquetteModalOpen, setIsEtiquetteModalOpen] = useState(false);
  const [hasPledgedEtiquette, setHasPledgedEtiquette] = useState(true);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  // Camera & Image Upload State & Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Start Camera Stream
  const startCamera = async (facing: 'user' | 'environment' = 'user') => {
    setCameraError(null);
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 640 }, height: { ideal: 640 } },
      });
      setCameraStream(stream);
      setCameraFacingMode(facing);
      setIsCameraModalOpen(true);
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('تعذر الوصول إلى الكاميرا. يرجى التأكد من السماح للمتصفح باستخدام الكاميرا، أو رفع صورة من الجهاز.');
      setIsCameraModalOpen(true);
    }
  };

  useEffect(() => {
    if (isCameraModalOpen && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [isCameraModalOpen, cameraStream]);

  // Stop Camera Stream
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraModalOpen(false);
  };

  // Capture Photo from Live Stream
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const size = Math.min(video.videoWidth || 400, video.videoHeight || 400);
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const startX = (video.videoWidth - size) / 2;
        const startY = (video.videoHeight - size) / 2;
        ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setEditForm((prev) => ({ ...prev, avatar: dataUrl }));
        setProfile((prev) => ({ ...prev, avatar: dataUrl }));
        stopCamera();
        showToast('تم التقاط الصورة الشخصية وتحديث ملفك بنجاح! 📸');
      }
    }
  };

  // Handle Image File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('يرجى اختيار ملف صورة صالح (JPG, PNG, WEBP)');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          setEditForm((prev) => ({ ...prev, avatar: dataUrl }));
          setProfile((prev) => ({ ...prev, avatar: dataUrl }));
          showToast('تم رفع الصورة الشخصية وتحديث حسابك بنجاح! 📁');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Form Temp States
  const [editForm, setEditForm] = useState({ ...profile });
  const [selectedLocation, setSelectedLocation] = useState(currentLocation);
  const [customLocationInput, setCustomLocationInput] = useState('');
  const [searchRadius, setSearchRadius] = useState(4);
  const [showLocationOnMap, setShowLocationOnMap] = useState(true);

  // Privacy Settings Temp State
  const [privacySettings, setPrivacySettings] = useState({
    showPhoneToNeighbors: true,
    exactLocationVisible: false,
    enable2FA: false,
    currentPassword: '',
    newPassword: '',
  });

  // Support Form Temp State
  const [supportMessage, setSupportMessage] = useState('');
  const [supportCategory, setSupportCategory] = useState('استفسار عام');

  // Toast Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Calculating summary totals
  const totalItemsShared = categoryData.reduce((acc, curr) => acc + curr.count, 0);
  const totalHelps = monthlyData.reduce((acc, curr) => acc + curr.helps, 0);

  // Profile Save Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { UsersService } = await import('../services/apiClient');
      const updatedData = await UsersService.updateProfile(editForm);
      setProfile({ ...editForm, ...updatedData });
      if (currentUser) {
        login({ ...currentUser, ...editForm, ...updatedData, isLoggedIn: true });
      }
      setIsEditProfileOpen(false);
      showToast('تم تحديث معلوماتك الشخصية بنجاح! ✨');
    } catch (err) {
      console.error('Failed to update profile:', err);
      showToast('تعذر تحديث المعلومات. يرجى المحاولة لاحقاً.');
    }
  };

  // Location Save Handler
  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const finalLoc = customLocationInput.trim() || selectedLocation;
    if (onUpdateLocation) {
      onUpdateLocation(finalLoc);
    }
    setIsLocationModalOpen(false);
    showToast(`تم تحديث موقعك إلى "${finalLoc}" ونطاق البحث إلى ${searchRadius} كم 📍`);
  };

  // Privacy Save Handler
  const handleSavePrivacy = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSecurityModalOpen(false);
    showToast('تم حفظ إعدادات الأمان والخصوصية بنجاح 🛡️');
  };

  // Support Message Handler
  const handleSendSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    try {
      await apiClient.post('/tickets', { type: supportCategory, message: supportMessage });
      setIsSupportModalOpen(false);
      setSupportMessage('');
      showToast('تم إرسال رسالتك إلى فريق دعم الحي، سنتواصل معك قريبًا! 📨');
    } catch (err) {
      console.error('Failed to send support ticket:', err);
      showToast('حدث خطأ أثناء الإرسال. حاول مرة أخرى.');
    }
  };

  if (isLoggedOut) {
    return (
      <main className="pt-24 pb-28 px-4 md:px-8 max-w-screen-xl mx-auto text-center space-y-8 rtl">
        <div className="bg-white dark:bg-[#121212] rounded-2xl p-8 border border-[#bfcaba] shadow-md space-y-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full mx-auto flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">logout</span>
          </div>
          <h2 className="font-bold text-xl text-[#181d17] dark:text-white">تم تسجيل الخروج بنجاح</h2>
          <p className="text-xs text-[#707a6c] dark:text-gray-400">
            شكراً لمساهمتك في تكافل الحي. يمكنك تسجيل الدخول مجدداً في أي وقت.
          </p>
          <button
            onClick={() => {
              setIsLoggedOut(false);
              showToast('أهلاً بعودتك يا ياسين! 👋');
            }}
            className="w-full py-3 bg-[#0d631b] hover:bg-[#1a4a20] text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-98"
          >
            تسجيل الدخول مجدداً كـ {profile.name}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 pb-28 px-4 md:px-8 max-w-screen-xl mx-auto space-y-8 rtl relative dark:text-white">
      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#0d631b] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-emerald-400 font-bold text-xs animate-in fade-in slide-in-from-top duration-300">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Profile Header Card */}
      <section className="bg-white dark:bg-[#121212] rounded-2xl p-6 border border-[#bfcaba] dark:border-[#333] shadow-xs text-center relative overflow-hidden dark:text-white">
        <div className="absolute top-0 right-0 left-0 h-24 bg-gradient-to-r from-[#0d631b] to-[#2e7d32] flex items-center justify-between px-3 z-20">
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="bg-black/20 dark:bg-[#121212]/40 hover:bg-black/30 dark:hover:bg-[#121212]/60 text-white backdrop-blur-md px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all border border-white/30"
          >
            <span className="material-symbols-outlined text-base">login</span>
            <span>تسجيل الدخول / تبديل الحساب 🔑</span>
          </button>

          <button
            onClick={() => {
              setEditForm({ ...profile });
              setIsEditProfileOpen(true);
            }}
            className="bg-black/20 dark:bg-[#121212]/40 hover:bg-black/30 dark:hover:bg-[#121212]/60 text-white backdrop-blur-md px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all border border-white/30"
          >
            <span className="material-symbols-outlined text-base">edit</span>
            <span>تعديل الملف</span>
          </button>
        </div>

        {/* Add padding-top to the content below so it isn't hidden by the 24px/6rem absolute header */}
        <div className="pt-20 relative z-10 flex flex-col items-center">
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white dark:bg-[#121212] mb-2 relative">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Quick Photo Upload & Camera Buttons */}
            <div className="flex items-center gap-1.5 mb-3">
              <button
                type="button"
                onClick={() => startCamera('user')}
                className="bg-[#0d631b] hover:bg-[#16501f] text-white px-2.5 py-1 rounded-xl text-[11px] font-bold shadow-2xs flex items-center gap-1 transition-transform active:scale-95"
                title="التقاط صورة سريعة بالكاميرا"
              >
                <span className="material-symbols-outlined text-sm">photo_camera</span>
                <span>الكاميرا</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#2e7d32]/10 hover:bg-[#2e7d32]/20 text-[#0d631b] px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors"
                title="تحميل صورة من جهازك"
              >
                <span className="material-symbols-outlined text-sm">upload</span>
                <span>رفع صورة</span>
              </button>
            </div>
          </div>

          <h2 className="font-bold text-xl text-[#181d17] dark:text-white">{profile.name}</h2>


          <p className="text-xs text-[#40493d] dark:text-gray-200 mt-2 w-full text-center font-medium leading-relaxed bg-[#f8faf7] px-3 py-1.5 rounded-xl border border-[#bfcaba]/40">
            {profile.bio}
          </p>

          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            <button
              onClick={() => setIsVerificationModalOpen(true)}
              className="bg-[#FFF3E0] text-[#964900] px-3 py-1 rounded-full text-xs font-bold border border-[#fc820c]/30 flex items-center gap-1 hover:bg-[#ffe8cc] transition-colors"
            >
              <span className="material-symbols-outlined text-xs fill text-[#fc820c]">star</span>
              جار موثوق {userAvgStr} / 5.0 ({ratings.length} تقييمات)
            </button>
            <button
              onClick={() => setIsVerificationModalOpen(true)}
              className="bg-[#2e7d32]/10 text-[#0d631b] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-[#2e7d32]/20 transition-colors"
            >
              <span className="material-symbols-outlined text-xs">verified</span>
              هوية موثّقة
            </button>
            <button
              onClick={() => setIsEtiquetteModalOpen(true)}
              className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-emerald-200 transition-colors shadow-2xs"
            >
              <span className="material-symbols-outlined text-xs text-emerald-700">volunteer_activism</span>
              ملتزم بآداب حارتنا 📜
            </button>
          </div>
        </div>
      </section>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-white dark:bg-[#121212] p-2.5 sm:p-3.5 rounded-xl border border-[#bfcaba] text-center space-y-0.5 sm:space-y-1 shadow-2xs">
          <div className="text-lg sm:text-xl font-bold text-[#0d631b]">{totalItemsShared}</div>
          <div className="text-[11px] sm:text-xs font-semibold text-[#707a6c] dark:text-gray-400">قطع مشاركة</div>
        </div>
        <div className="bg-white dark:bg-[#121212] p-2.5 sm:p-3.5 rounded-xl border border-[#bfcaba] text-center space-y-0.5 sm:space-y-1 shadow-2xs">
          <div className="text-lg sm:text-xl font-bold text-[#fc820c]">{totalHelps}</div>
          <div className="text-[11px] sm:text-xs font-semibold text-[#707a6c] dark:text-gray-400">مرات المساعدة</div>
        </div>
        <div className="bg-white dark:bg-[#121212] p-2.5 sm:p-3.5 rounded-xl border border-[#bfcaba] text-center space-y-0.5 sm:space-y-1 shadow-2xs">
          <div className="text-lg sm:text-xl font-bold text-sky-700">{userAvgStr} / 5.0</div>
          <div className="text-[11px] sm:text-xs font-semibold text-[#707a6c] dark:text-gray-400">تقييم الجيران</div>
        </div>
      </div>

      {/* User Dashboard / Recharts Visualizations */}
      <section className="bg-white dark:bg-[#121212] rounded-2xl p-5 border border-[#bfcaba] shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#bfcaba]/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0d631b]/10 text-[#0d631b] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-lg">analytics</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#181d17] dark:text-white">لوحة إحصائيات الجار 📊</h3>
              <p className="text-[11px] text-[#707a6c] dark:text-gray-400">تتبع مساهماتك وأثرك الإيجابي في الحي</p>
            </div>
          </div>

          {/* Chart Selector Tabs */}
          <div className="flex bg-[#f1f5eb] p-1 rounded-xl text-xs font-bold gap-1 border border-[#bfcaba]/30">
            <button
              onClick={() => setActiveChartTab('monthly')}
              className={`px-2.5 py-1 rounded-lg transition-all ${activeChartTab === 'monthly'
                ? 'bg-[#0d631b] text-white shadow-2xs'
                : 'text-[#40493d] dark:text-gray-200 hover:bg-white dark:bg-[#121212]/50'
                }`}
            >
              النشاط الشهري
            </button>
            <button
              onClick={() => setActiveChartTab('categories')}
              className={`px-2.5 py-1 rounded-lg transition-all ${activeChartTab === 'categories'
                ? 'bg-[#0d631b] text-white shadow-2xs'
                : 'text-[#40493d] dark:text-gray-200 hover:bg-white dark:bg-[#121212]/50'
                }`}
            >
              التصنيفات
            </button>
            <button
              onClick={() => setActiveChartTab('ratings')}
              className={`px-2.5 py-1 rounded-lg transition-all ${activeChartTab === 'ratings'
                ? 'bg-[#0d631b] text-white shadow-2xs'
                : 'text-[#40493d] dark:text-gray-200 hover:bg-white dark:bg-[#121212]/50'
                }`}
            >
              التقييمات
            </button>
          </div>
        </div>

        {/* Tab 1: Monthly Activity Area Chart */}
        {activeChartTab === 'monthly' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#707a6c] dark:text-gray-400 px-1">
              <div className="flex items-center gap-3 font-semibold">
                <span className="flex items-center gap-1 text-[#0d631b]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0d631b] inline-block"></span>
                  قطع تمت إعارتها
                </span>
                <span className="flex items-center gap-1 text-[#fc820c]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#fc820c] inline-block"></span>
                  أسر تمت مساعدتها
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#0d631b]">آخر 6 أشهر</span>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorItems" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d631b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0d631b" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorHelps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fc820c" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#fc820c" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12px',
                      fontFamily: 'inherit',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="items"
                    name="قطع مشاركة"
                    stroke="#0d631b"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorItems)"
                  />
                  <Area
                    type="monotone"
                    dataKey="helps"
                    name="مرات المساعدة"
                    stroke="#fc820c"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorHelps)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 2: Category Breakdown Pie Chart */}
        {activeChartTab === 'categories' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 py-2">
            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value} قطع`, 'العدد']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-xs text-[#181d17] dark:text-white mb-2">توزيع القطع حسب التصنيف:</h4>
              {categoryData.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-[#f8faf7] p-2 rounded-xl border border-[#bfcaba]/40">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-md shrink-0"
                      style={{ backgroundColor: cat.color }}
                    ></span>
                    <span className="font-bold text-[#181d17] dark:text-white">{cat.name}</span>
                  </div>
                  <span className="font-bold text-[#0d631b]">{cat.count} قطع</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Ratings Bar Chart */}
        {activeChartTab === 'ratings' && (
          <div className="space-y-3 py-1">
            <div className="flex items-center justify-between bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 text-xl">thumb_up</span>
                <span className="font-bold text-amber-950">98% انطباع ممتاز من الجيران</span>
              </div>
              <span className="bg-amber-600 text-white font-bold px-2 py-0.5 rounded-md text-[10px]">
                20 تقييماً
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={ratingBreakdown}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="stars"
                    type="category"
                    tick={{ fontSize: 11, fill: '#40493d', fontWeight: 'bold' }}
                    axisLine={false}
                    tickLine={false}
                    width={70}
                  />
                  <Tooltip
                    formatter={(val: number) => [`${val} تقييمات`, 'العدد']}
                    contentStyle={{ borderRadius: '10px', fontSize: '11px' }}
                  />
                  <Bar dataKey="count" fill="#fc820c" radius={[0, 8, 8, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Impact Footer Badge */}
        <div className="bg-[#0d631b]/5 p-3 rounded-xl border border-[#0d631b]/20 flex items-center justify-between text-xs text-[#0d631b]">
          <div className="flex items-center gap-2 font-bold">
            <span className="material-symbols-outlined text-lg">volunteer_activism</span>
            <span>وفرت على أهالي الحي ما يقارب 350,000 ل.س بفضل إعاراتك للمعدات!</span>
          </div>
          <span className="material-symbols-outlined text-base">workspace_premium</span>
        </div>
      </section>

      {/* Educational Section: Neighborhood Exchange Etiquette (آداب التبادل في حارتنا) */}
      <section className="bg-[#f4f7f2] dark:bg-slate-900 rounded-3xl p-5 border-2 border-[#0d631b]/20 dark:border-emerald-800 shadow-sm space-y-4 relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#0d631b]/5 rounded-full blur-2xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#0d631b]/10 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0d631b] text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <span className="material-symbols-outlined text-2xl">handshake</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-[#181d17] dark:text-white">
                  آداب التبادل في حارتنا 🤝
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#0d631b] dark:text-emerald-300 text-[10px] font-bold border border-emerald-300">
                  دليل تعزيز التكافل
                </span>
              </div>
              <p className="text-xs text-[#707a6c] dark:text-gray-400 font-medium mt-0.5">
                رسوم ودلائل توضيحية لترسيخ قيم الجيرة الحسنة والمحافظة على ممتلكات الأهل والجيران
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEtiquetteModalOpen(true)}
            className="bg-[#0d631b] hover:bg-[#16501f] text-white px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
          >
            <span>التفاصيل والميثاق</span>
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </button>
        </div>

        {/* Illustrative Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Rule 1 */}
          <div className="bg-white dark:bg-[#121212] dark:bg-slate-800/90 p-3.5 rounded-2xl border border-emerald-200/80 dark:border-slate-700 space-y-2 shadow-2xs hover:border-emerald-500 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center justify-center shrink-0 font-bold border border-teal-300/50">
                <span className="material-symbols-outlined text-xl">clean_hands</span>
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[#181d17] dark:text-white">
                  1. نظافة وجاهزية الغرض 🧼
                </h4>
                <span className="text-[10px] text-teal-700 dark:text-teal-400 font-bold">العناية بالممتلكات</span>
              </div>
            </div>
            <p className="text-xs text-[#40493d] dark:text-gray-200 leading-relaxed font-medium pr-1">
              إعادة وتسليم السلعة أو الأداة بنظافة ممتازة وحالة معقمة وجاهزة للاستخدام المباشر، كما تحب أن تستلمها أنت.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="bg-white dark:bg-[#121212] dark:bg-slate-800/90 p-3.5 rounded-2xl border border-emerald-200/80 dark:border-slate-700 space-y-2 shadow-2xs hover:border-emerald-500 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 font-bold border border-amber-300/50">
                <span className="material-symbols-outlined text-xl">schedule</span>
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[#181d17] dark:text-white">
                  2. احترام الأوقات والمواعيد ⏰
                </h4>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">مراعاة راحة الجيران</span>
              </div>
            </div>
            <p className="text-xs text-[#40493d] dark:text-gray-200 leading-relaxed font-medium pr-1">
              الالتزام الدقيق بمدة الإعارة المتفق عليها، وتجنب طرق الباب أو الاتصال في أوقات الراحة القيلولة أو الساعات المتأخرة.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="bg-white dark:bg-[#121212] dark:bg-slate-800/90 p-3.5 rounded-2xl border border-emerald-200/80 dark:border-slate-700 space-y-2 shadow-2xs hover:border-emerald-500 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 flex items-center justify-center shrink-0 font-bold border border-purple-300/50">
                <span className="material-symbols-outlined text-xl">shield_person</span>
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[#181d17] dark:text-white">
                  3. حفظ الخصوصية والكرامة 🛡️
                </h4>
                <span className="text-[10px] text-purple-700 dark:text-purple-400 font-bold">الأمان الاجتماعي</span>
              </div>
            </div>
            <p className="text-xs text-[#40493d] dark:text-gray-200 leading-relaxed font-medium pr-1">
              احترام خصوصية الأسر المتعففة والعائدة، وعدم التصوير أو كشف الأسماء عند تقديم المساعدات العاجلة بحسب ميثاق الحي.
            </p>
          </div>

          {/* Rule 4 */}
          <div className="bg-white dark:bg-[#121212] dark:bg-slate-800/90 p-3.5 rounded-2xl border border-emerald-200/80 dark:border-slate-700 space-y-2 shadow-2xs hover:border-emerald-500 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 flex items-center justify-center shrink-0 font-bold border border-rose-300/50">
                <span className="material-symbols-outlined text-xl">volunteer_activism</span>
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[#181d17] dark:text-white">
                  4. الكلمة الطيبة والشكر 💌
                </h4>
                <span className="text-[10px] text-rose-700 dark:text-rose-400 font-bold">بث روح الامتنان</span>
              </div>
            </div>
            <p className="text-xs text-[#40493d] dark:text-gray-200 leading-relaxed font-medium pr-1">
              إرسال رسالة شكر دافئة عقب كل عملية تبادل أو استلام لتشجيع مبادرات الجار، والمساهمة في بناء بيئة جيرة إيجابية.
            </p>
          </div>
        </div>

        {/* Footer Pledge Status Banner */}
        <div className="bg-emerald-100/90 dark:bg-emerald-950/70 p-3 rounded-2xl border border-emerald-300 dark:border-emerald-800 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-[#0d631b] dark:text-emerald-300 font-bold">
            <span className="material-symbols-outlined text-xl">workspace_premium</span>
            <span>أنت ملتزم بميثاق وآداب التبادل في حي الروضة 🏅</span>
          </div>
          <button
            onClick={() => setIsEtiquetteModalOpen(true)}
            className="text-[11px] text-[#0d631b] dark:text-emerald-300 font-extrabold underline hover:text-[#185e23]"
          >
            عرض الوثيقة الكاملة
          </button>
        </div>
      </section>

      {/* Guide Banner for Returning Families */}
      <button
        onClick={() => setIsGuideModalOpen(true)}
        className="w-full text-right bg-[#ebefe5] hover:bg-[#e1e7da] rounded-2xl p-4 border border-[#bfcaba]/60 flex items-center justify-between gap-3 transition-colors group shadow-2xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0d631b] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-xl">menu_book</span>
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#181d17] dark:text-white">دليل التكافل للأسر العائدة</h4>
            <p className="text-xs text-[#40493d] dark:text-gray-200">كيف تساهم وتطلب الدعم بكل كرامة ويسر</p>
          </div>
        </div>
        <span className="material-symbols-outlined text-[#0d631b] group-hover:-translate-x-1 transition-transform">
          chevron_left
        </span>
      </button>

      {/* Account Settings Options */}
      <div className="bg-white dark:bg-[#121212] rounded-2xl border border-[#bfcaba] divide-y divide-[#bfcaba]/40 overflow-hidden shadow-2xs">

        {/* Edit Personal Info Button */}
        <button
          onClick={() => {
            setEditForm({ ...profile });
            setIsEditProfileOpen(true);
          }}
          className="w-full px-4 py-3.5 text-right flex items-center justify-between hover:bg-[#f1f5eb] transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#707a6c] dark:text-gray-400">person_outline</span>
            <div>
              <span className="font-bold text-sm text-[#181d17] dark:text-white">تعديل المعلومات الشخصية</span>
              <span className="block text-[11px] text-[#707a6c] dark:text-gray-400">الاسم، الصورة، النبذة، ورقم التواصل</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#707a6c] dark:text-gray-400">chevron_left</span>
        </button>


        {/* Etiquette & Neighbor Rules Button */}
        <button
          onClick={() => setIsEtiquetteModalOpen(true)}
          className="w-full px-4 py-3.5 text-right flex items-center justify-between hover:bg-[#f1f5eb] transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#0d631b]">handshake</span>
            <div>
              <span className="font-bold text-sm text-[#181d17] dark:text-white">آداب التبادل في حارتنا 🤝</span>
              <span className="block text-[11px] text-[#707a6c] dark:text-gray-400">الدليل المصور لآداب الجيرة والعناية بالأغراض</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#707a6c] dark:text-gray-400">chevron_left</span>
        </button>

        {/* Security & Privacy Button */}
        <button
          onClick={() => setIsSecurityModalOpen(true)}
          className="w-full px-4 py-3.5 text-right flex items-center justify-between hover:bg-[#f1f5eb] transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#707a6c] dark:text-gray-400">shield</span>
            <div>
              <span className="font-bold text-sm text-[#181d17] dark:text-white">الأمان والخصوصية</span>
              <span className="block text-[11px] text-[#707a6c] dark:text-gray-400">إظهار الرقم، الخريطة، كلمة المرور</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#707a6c] dark:text-gray-400">chevron_left</span>
        </button>

        {/* FAQ & Support Button */}
        <button
          onClick={() => setIsSupportModalOpen(true)}
          className="w-full px-4 py-3.5 text-right flex items-center justify-between hover:bg-[#f1f5eb] transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#707a6c] dark:text-gray-400">help_outline</span>
            <div>
              <span className="font-bold text-sm text-[#181d17] dark:text-white">الأسئلة الشائعة والدعم الفني</span>
              <span className="block text-[11px] text-[#707a6c] dark:text-gray-400">إرشادات التكافل ومراسلة المشرفين</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#707a6c] dark:text-gray-400">chevron_left</span>
        </button>


        {/* Support Ticket Button */}
        <button
          onClick={() => setIsTicketModalOpen(true)}
          className="w-full px-4 py-3.5 text-right flex items-center justify-between hover:bg-[#f1f5eb] dark:hover:bg-[#1a1a1a] transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#0d631b]">mail</span>
            <div>
              <span className="font-bold text-sm text-[#181d17] dark:text-white">تواصل مع اللجنة 📨</span>
              <span className="block text-[11px] text-[#707a6c] dark:text-gray-400">تقديم شكوى، بلاغ، أو اقتراح للجنة الحي</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#707a6c] dark:text-gray-400">chevron_left</span>
        </button>

        {/* Admin Panel Button */}
        {(currentUser?.userType === 'committee' || currentUser?.userType === 'admin') && (
          <button
            onClick={() => navigate('/admin')}
            className="w-full px-4 py-3.5 text-right flex items-center justify-between hover:bg-[#f1f5eb] dark:hover:bg-[#1a1a1a] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#fc820c]">admin_panel_settings</span>
              <div>
                <span className="font-bold text-sm text-[#181d17] dark:text-white">لوحة تحكم اللجنة (السرية)</span>
                <span className="block text-[11px] text-[#707a6c] dark:text-gray-400">إدارة الجيران والتذاكر المرفوعة</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#707a6c] dark:text-gray-400">chevron_left</span>
          </button>
        )}

        {/* Logout Button */}
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full px-4 py-3.5 text-right flex items-center justify-between hover:bg-red-50 text-red-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-red-600">logout</span>
            <span className="font-bold text-sm">تسجيل الخروج</span>
          </div>
          <span className="material-symbols-outlined text-red-600">chevron_left</span>
        </button>
      </div>

      <EditProfileModal
        isEditProfileOpen={isEditProfileOpen}
        setIsEditProfileOpen={setIsEditProfileOpen}
        editForm={editForm}
        setEditForm={setEditForm}
        handleSaveProfile={handleSaveProfile}
        startCamera={startCamera}
        fileInputRef={fileInputRef}
      />
      {/* ================= MODAL 2: LOCATION & RADIUS MODAL ================= */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center rtl" onClick={() => setIsLocationModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-[#121212] relative flex flex-col overflow-hidden text-[#181d17] dark:text-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#bfcaba] space-y-4">
            <div className="flex items-center justify-between border-b border-[#bfcaba]/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0d631b] text-2xl">my_location</span>
                <h3 className="font-bold text-lg text-[#181d17] dark:text-white">تحديد موقع السكن ونطاق الحي</h3>
              </div>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveLocation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#40493d] dark:text-gray-200 mb-1">اختر الحي السكني الحالي:</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full h-11 px-3 text-sm bg-white dark:bg-[#121212] border border-gray-300 rounded-xl outline-none font-bold text-[#181d17] dark:text-white"
                >
                  {SAMPLE_LOCATIONS.map((loc, idx) => (
                    <option key={idx} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#40493d] dark:text-gray-200 mb-1">أو أكتب اسم حي مخصص:</label>
                <input
                  type="text"
                  placeholder="مثال: دمشق - حي الميدان"
                  value={customLocationInput}
                  onChange={(e) => setCustomLocationInput(e.target.value)}
                  className="w-full h-10 px-3 text-sm bg-white dark:bg-[#121212] border border-gray-300 rounded-xl outline-none focus:border-[#0d631b]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold text-[#40493d] dark:text-gray-200 mb-1">
                  <span>نطاق البحث حولك:</span>
                  <span className="text-[#0d631b]">{searchRadius} كم</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(Number(e.target.value))}
                  className="w-full accent-[#0d631b]"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                  <span>1 كم (الحي المباشر)</span>
                  <span>5 كم</span>
                  <span>10 كم (المدينة)</span>
                </div>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex items-center justify-between">
                <span className="text-xs font-bold text-[#0d631b]">إظهار موقعي على خريطة الحي</span>
                <input
                  type="checkbox"
                  checked={showLocationOnMap}
                  onChange={(e) => setShowLocationOnMap(e.target.checked)}
                  className="w-4 h-4 accent-[#0d631b]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0d631b] hover:bg-[#185e23] text-white font-bold text-sm rounded-xl transition-all shadow-xs"
                >
                  حفظ الموقع والنطاق
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: SECURITY & PRIVACY MODAL ================= */}
      {isSecurityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center rtl" onClick={() => setIsSecurityModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-[#121212] relative flex flex-col overflow-hidden text-[#181d17] dark:text-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#bfcaba] space-y-4">
            <div className="flex items-center justify-between border-b border-[#bfcaba]/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0d631b] text-2xl">shield</span>
                <h3 className="font-bold text-lg text-[#181d17] dark:text-white">الأمان والخصوصية</h3>
              </div>
              <button
                onClick={() => setIsSecurityModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSavePrivacy} className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-[#181d17] dark:text-white">خيارات الخصوصية بالحي:</h4>

                <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 cursor-pointer">
                  <span className="text-xs font-bold text-[#40493d] dark:text-gray-200">
                    إظهار رقم الهاتف للجيران عند الموافقة على طلب الإعارة
                  </span>
                  <input
                    type="checkbox"
                    checked={privacySettings.showPhoneToNeighbors}
                    onChange={(e) =>
                      setPrivacySettings({ ...privacySettings, showPhoneToNeighbors: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#0d631b]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 cursor-pointer">
                  <span className="text-xs font-bold text-[#40493d] dark:text-gray-200">
                    تأكيد موقع السكن بدقة الجغرافية بدلاً من اسم الحي فقط
                  </span>
                  <input
                    type="checkbox"
                    checked={privacySettings.exactLocationVisible}
                    onChange={(e) =>
                      setPrivacySettings({ ...privacySettings, exactLocationVisible: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#0d631b]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 cursor-pointer">
                  <span className="text-xs font-bold text-[#40493d] dark:text-gray-200">
                    تفعيل التحقق بخطوتين عند تسجيل الدخول (2FA)
                  </span>
                  <input
                    type="checkbox"
                    checked={privacySettings.enable2FA}
                    onChange={(e) =>
                      setPrivacySettings({ ...privacySettings, enable2FA: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#0d631b]"
                  />
                </label>
              </div>

              <div className="border-t border-gray-200 pt-3 space-y-2">
                <h4 className="font-bold text-xs text-[#181d17] dark:text-white">تغيير كلمة المرور:</h4>
                <input
                  type="password"
                  placeholder="كلمة المرور الحالية"
                  value={privacySettings.currentPassword}
                  onChange={(e) =>
                    setPrivacySettings({ ...privacySettings, currentPassword: e.target.value })
                  }
                  className="w-full h-9 px-3 text-xs bg-white dark:bg-[#121212] border border-gray-300 rounded-xl outline-none"
                />
                <input
                  type="password"
                  placeholder="كلمة المرور الجديدة"
                  value={privacySettings.newPassword}
                  onChange={(e) =>
                    setPrivacySettings({ ...privacySettings, newPassword: e.target.value })
                  }
                  className="w-full h-9 px-3 text-xs bg-white dark:bg-[#121212] border border-gray-300 rounded-xl outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0d631b] hover:bg-[#185e23] text-white font-bold text-sm rounded-xl transition-all shadow-xs"
              >
                حفظ إعدادات الخصوصية
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: FAQ & TECHNICAL SUPPORT ================= */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center rtl" onClick={() => setIsSupportModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-[#121212] relative flex flex-col overflow-hidden text-[#181d17] dark:text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#bfcaba] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#bfcaba]/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0d631b] text-2xl">help_outline</span>
                <h3 className="font-bold text-lg text-[#181d17] dark:text-white">الأسئلة الشائعة والدعم الفني</h3>
              </div>
              <button
                onClick={() => setIsSupportModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Accordion FAQs */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-[#181d17] dark:text-white">الأسئلة الأكثر تكراراً:</h4>

              <details className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl p-3 border border-gray-200 text-xs">
                <summary className="font-bold text-[#0d631b] cursor-pointer">
                  كيف أقوم بإعارة غرض للجيران بأمان؟
                </summary>
                <p className="mt-2 text-[#40493d] dark:text-gray-200 leading-relaxed">
                  يمكنك نشر القطعة وتحديد مدة الإعارة (مثلاً 3 أيام). عند تقديم جار لطلب الإعارة، تتفقان عبر المحادثة المباشرة على موعد الاستلام، وعند الإرجاع تضغط على "تم الاستلام".
                </p>
              </details>

              <details className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl p-3 border border-gray-200 text-xs">
                <summary className="font-bold text-[#0d631b] cursor-pointer">
                  هل استخدام منصة تكافل الحي مجاني؟
                </summary>
                <p className="mt-2 text-[#40493d] dark:text-gray-200 leading-relaxed">
                  نعم، المنصة مجانية تماماً وغير ربحية مخصصة لخدمة أهالي الحي، وتفعيل قيم التكافل الاجتماعي والتضامن المحلي.
                </p>
              </details>

              <details className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl p-3 border border-gray-200 text-xs">
                <summary className="font-bold text-[#0d631b] cursor-pointer">
                  كيف تعمل تنبيهات التوفر عند البحث؟
                </summary>
                <p className="mt-2 text-[#40493d] dark:text-gray-200 leading-relaxed">
                  عند البحث عن سلعة غير متوفرة حالياً، يمكنك ضغط "طلب إشعار". فور قيام أي جار بإضافة تلك السلعة، سيتلقى هاتفك إشعاراً حياً فورياً.
                </p>
              </details>
            </div>

            {/* Support Message Form */}
            <form onSubmit={handleSendSupport} className="border-t border-gray-200 pt-3 space-y-3">
              <h4 className="font-bold text-xs text-[#181d17] dark:text-white">مراسلة فريق الدعم والمشرفين:</h4>

              <select
                value={supportCategory}
                onChange={(e) => setSupportCategory(e.target.value)}
                className="w-full h-9 px-3 text-xs bg-white dark:bg-[#121212] border border-gray-300 rounded-xl outline-none font-bold"
              >
                <option value="استفسار عام">استفسار عام</option>
                <option value="بلاغ عن غرض أو جار">بلاغ عن غرض أو جار</option>
                <option value="اقتراح تطويري">اقتراح تطويري للمنصة</option>
                <option value="مشكلة تقنية">مشكلة تقنية</option>
              </select>

              <textarea
                rows={3}
                required
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                placeholder="أكتب استفسارك أو اقتراحك هنا..."
                className="w-full p-3 text-xs bg-white dark:bg-[#121212] border border-gray-300 rounded-xl outline-none resize-none focus:border-[#0d631b]"
              />

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0d631b] hover:bg-[#185e23] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">send</span>
                <span>إرسال الرسالة إلى المشرفين</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: NEIGHBORHOOD ETIQUETTE MODAL ================= */}
      {isEtiquetteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center rtl" onClick={() => setIsEtiquetteModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-[#121212] dark:bg-slate-900 relative flex flex-col overflow-hidden text-[#181d17] dark:text-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-emerald-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#0d631b] text-white flex items-center justify-center font-bold shadow-md shrink-0">
                  <span className="material-symbols-outlined text-2xl">handshake</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg">ميثاق وآداب التبادل في حارتنا 🤝</h3>
                  <p className="text-xs text-[#707a6c] dark:text-gray-400 font-medium">وثيقة التعاون لترسيخ قيم الجيرة الطيبة والتكافل المحالي</p>
                </div>
              </div>
              <button
                onClick={() => setIsEtiquetteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-slate-200 p-1"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Introduction Banner */}
            <div className="bg-emerald-50 dark:bg-emerald-950/60 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
              <span className="material-symbols-outlined text-2xl text-[#0d631b] dark:text-emerald-400 shrink-0 mt-0.5">
                verified_user
              </span>
              <p className="text-xs text-[#0d631b] dark:text-emerald-300 font-medium leading-relaxed">
                يهدف ميثاق آداب التبادل في حي الروضة إلى جعل إعارة ومشاركة السلع تجربة يسيرة، آمنة ومفعمة بالاحترام المتبادل والمودة بين جميع الجيران والأسر العائدة.
              </p>
            </div>

            {/* Detailed 5 Etiquette Rules */}
            <div className="space-y-3 pt-1">
              {/* Rule 1 */}
              <div className="bg-[#f8faf7] dark:bg-slate-800 p-3.5 rounded-2xl border border-[#bfcaba]/60 dark:border-slate-700 space-y-1.5">
                <h4 className="font-bold text-xs sm:text-sm text-[#0d631b] dark:text-emerald-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">clean_hands</span>
                  <span>1. النظافة والعناية التامة بالأغراض 🧼</span>
                </h4>
                <p className="text-xs text-[#40493d] dark:text-gray-200 leading-relaxed font-medium">
                  احرص على غسل أو تعقيم الأداة والمعدة قبل تسليمها وإعادتها. يفضل تغليف القطع الإلكترونية أو المستلزمات الطبية بالحافظات المناسبة لحمايتها من الأتربة.
                </p>
              </div>

              {/* Rule 2 */}
              <div className="bg-[#f8faf7] dark:bg-slate-800 p-3.5 rounded-2xl border border-[#bfcaba]/60 dark:border-slate-700 space-y-1.5">
                <h4 className="font-bold text-xs sm:text-sm text-amber-800 dark:text-amber-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">schedule</span>
                  <span>2. الالتزام بالمواعيد والأوقات اللبقة ⏰</span>
                </h4>
                <p className="text-xs text-[#40493d] dark:text-gray-200 leading-relaxed font-medium">
                  حدد وقت الاستلام والإعادة بدقة عبر محادثة المنصة. تجنب طرق باب الجار في ساعات القيلولة (1:00 م - 4:00 م) أو بعد الساعة 9:00 مساءً حرصاً على راحتهم.
                </p>
              </div>

              {/* Rule 3 */}
              <div className="bg-[#f8faf7] dark:bg-slate-800 p-3.5 rounded-2xl border border-[#bfcaba]/60 dark:border-slate-700 space-y-1.5">
                <h4 className="font-bold text-xs sm:text-sm text-purple-800 dark:text-purple-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">shield_person</span>
                  <span>3. حفظ كرامة وسرية الأسر المستفيدة 🛡️</span>
                </h4>
                <p className="text-xs text-[#40493d] dark:text-gray-200 leading-relaxed font-medium">
                  يُمنع منعاً باتاً تصوير أو كشف هويات الأسر المتعففة أو نشر تفاصيل مساعداتهم. يتيح التطبيق خيار "جار مجهول" لمن يرغب في الحفاظ على السرية الكاملة.
                </p>
              </div>

              {/* Rule 4 */}
              <div className="bg-[#f8faf7] dark:bg-slate-800 p-3.5 rounded-2xl border border-[#bfcaba]/60 dark:border-slate-700 space-y-1.5">
                <h4 className="font-bold text-xs sm:text-sm text-rose-800 dark:text-rose-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">volunteer_activism</span>
                  <span>4. نشر رسائل الشكر والكلمة الطيبة 💌</span>
                </h4>
                <p className="text-xs text-[#40493d] dark:text-gray-200 leading-relaxed font-medium">
                  عند ضغط "تم الاستلام"، قم بإرسال رسالة شكر تلقائية ودية لصاحب السلعة. التقدير البسيط يبث الطمأنينة ويشجع المالكين على الاستمرار في تقديم الإعارات.
                </p>
              </div>

              {/* Rule 5 */}
              <div className="bg-[#f8faf7] dark:bg-slate-800 p-3.5 rounded-2xl border border-[#bfcaba]/60 dark:border-slate-700 space-y-1.5">
                <h4 className="font-bold text-xs sm:text-sm text-teal-800 dark:text-teal-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">handshake</span>
                  <span>5. الأمانة والمسؤولية عند حدوث الأعطال 🔧</span>
                </h4>
                <p className="text-xs text-[#40493d] dark:text-gray-200 leading-relaxed font-medium">
                  في حال حدث خلل غير مقصود أثناء استخدام الأداة المستعارة، سارع إلى إبلاغ الجار بشفافية واعرض صيانة أو استبدال القطعة بنفس التسامح والجيرة الطيبة.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  setHasPledgedEtiquette(true);
                  setIsEtiquetteModalOpen(false);
                  showToast('شكراً لالتزامك بميثاق وآداب التبادل في حارتنا! 🏅🌟');
                }}
                className="flex-1 py-3 bg-[#0d631b] hover:bg-[#16501f] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">workspace_premium</span>
                <span>تأكيد الالتزام بآداب حارتنا 🤝</span>
              </button>
              <button
                onClick={() => setIsEtiquetteModalOpen(false)}
                className="py-3 px-4 bg-gray-100 dark:bg-[#222222] hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-xl"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 5: SOLIDARITY GUIDE MODAL ================= */}
      {isGuideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center rtl" onClick={() => setIsGuideModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-[#121212] relative flex flex-col overflow-hidden text-[#181d17] dark:text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#bfcaba] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#bfcaba]/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0d631b] text-2xl">menu_book</span>
                <h3 className="font-bold text-lg text-[#181d17] dark:text-white">دليل التكافل للأسر العائدة</h3>
              </div>
              <button
                onClick={() => setIsGuideModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#40493d] dark:text-gray-200 leading-relaxed">
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-2">
                <h4 className="font-bold text-sm text-[#0d631b] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-lg">volunteer_activism</span>
                  <span>1. طلب الاستعارة والمساعدة بكل كرامة</span>
                </h4>
                <p>
                  منصة تكافل الحي صُممت لتعزيز الجيرة الصالحة. طلبك لمعدة أو أداة منزلية هو مشاركة مجتمعية واعية تمنع الهدر المالي وتزيد التلاحم الاجتماعي بين سكان حي الروضة الأحبة.
                </p>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2">
                <h4 className="font-bold text-sm text-amber-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-lg">handshake</span>
                  <span>2. آداب الاستعارة والحفاظ على الأغراض</span>
                </h4>
                <p>
                  • أعد السلعة في الموعد المحدد بنفس حالتها النظيفة.<br />
                  • في حال حدوث أي خلل غير مقصود، أخبر الجار بكل شفافية ومودة.<br />
                  • اترك تقييماً طيباً لجاراتك بعد الانتهاء لدعم شارات الموثوقية.
                </p>
              </div>

              <div className="bg-sky-50 p-4 rounded-xl border border-sky-200 space-y-2">
                <h4 className="font-bold text-sm text-sky-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-lg">military_tech</span>
                  <span>3. شارات "جار موثوق" ونقاط التكافل</span>
                </h4>
                <p>
                  كلما شاركت ك أو أعدت مستلزمات الجيران بأمانة، ترتفع شارة الموثوقية وتفتح لك إمكانية طلب مستلزمات عائلية أكبر مباشرة من مبادرات الحي.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsGuideModalOpen(false)}
              className="w-full py-2.5 bg-[#0d631b] text-white font-bold text-xs rounded-xl"
            >
              فهمت، شكراً لكم!
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL 6: VERIFICATION DETAILS MODAL ================= */}
      {isVerificationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center rtl" onClick={() => setIsVerificationModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-[#121212] relative flex flex-col overflow-hidden text-[#181d17] dark:text-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#bfcaba] space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0d631b] mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>

            <h3 className="font-bold text-lg text-[#181d17] dark:text-white">تفاصيل هوية "جار موثوق"</h3>
            <p className="text-xs text-[#707a6c] dark:text-gray-400">
              تم التدقيق والتوثيق بواسطة لجنة أهالي حي الروضة
            </p>

            <div className="bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-200 space-y-2 text-right text-xs">
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500 dark:text-gray-400">حالة الهوية:</span>
                <span className="font-bold text-[#0d631b]">موثّقة برقم مدني ✅</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500 dark:text-gray-400">تاريخ التوثيق:</span>
                <span className="font-bold text-[#181d17] dark:text-white">15 يناير 2026</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500 dark:text-gray-400">معدل تقييم المعاملات:</span>
                <span className="font-bold text-[#fc820c]">4.9 من 5 (20 تقييماً)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500 dark:text-gray-400">تأخير في الإرجاع:</span>
                <span className="font-bold text-[#0d631b]">0 مرات (سجل نظيف)</span>
              </div>
            </div>

            <button
              onClick={() => setIsVerificationModalOpen(false)}
              className="w-full py-2.5 bg-[#0d631b] text-white font-bold text-xs rounded-xl"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL 7: LOGOUT CONFIRMATION MODAL ================= */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center rtl" onClick={() => setIsLogoutModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-[#121212] relative flex flex-col overflow-hidden text-[#181d17] dark:text-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#bfcaba] space-y-4 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">logout</span>
            </div>

            <h3 className="font-bold text-base text-[#181d17] dark:text-white">تسجيل الخروج</h3>
            <p className="text-xs text-[#707a6c] dark:text-gray-400">
              هل أنت تأكد من رغبتك في تسجيل الخروج من حساب الجار {profile.name}؟
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  setIsLoggedOut(true);
                  logout();
                  setIsLoginModalOpen(true);
                  window.location.href = '/';
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
              >
                تأكيد الخروج
              </button>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-2.5 bg-gray-100 dark:bg-[#222222] hover:bg-gray-200 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input for uploading profile pictures */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Hidden canvas element for snapping frame from camera */}
      <canvas ref={canvasRef} className="hidden" />


      <SupportTicketModal
        isTicketModalOpen={isTicketModalOpen}
        setIsTicketModalOpen={setIsTicketModalOpen}
        ticketForm={ticketForm}
        setTicketForm={setTicketForm}
      />
      {/* ================= CAMERA CAPTURE MODAL ================= */}
      {isCameraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center rtl" onClick={stopCamera}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-[#121212] relative flex flex-col overflow-hidden text-[#181d17] dark:text-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-[#bfcaba] space-y-4">
            <div className="flex items-center justify-between border-b border-[#bfcaba]/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0d631b] text-2xl">photo_camera</span>
                <div>
                  <h3 className="font-bold text-base text-[#181d17] dark:text-white">التقاط صورة شخصية بالكاميرا</h3>
                  <p className="text-[11px] text-[#707a6c] dark:text-gray-400">ابتسم للجار! الصورة الحقيقية تعزز المودة والأمان</p>
                </div>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {cameraError ? (
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-3 text-center">
                <span className="material-symbols-outlined text-amber-600 text-3xl">videocam_off</span>
                <p className="text-xs text-amber-900 font-medium leading-relaxed">{cameraError}</p>
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    fileInputRef.current?.click();
                  }}
                  className="w-full py-2.5 bg-[#0d631b] text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  رفع صورة من الجهاز بدلاً من ذلك 📁
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Live Camera Viewfinder */}
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-square max-h-72 mx-auto shadow-inner border-2 border-[#0d631b] flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover transform -scale-x-100"
                  />

                  {/* Face Framing Overlay Circle */}
                  <div className="absolute inset-0 border-2 border-dashed border-white/60 rounded-full m-8 pointer-events-none flex items-center justify-center">
                    <span className="text-white/60 text-[10px] font-bold bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
                      ضع وجهك هنا 😊
                    </span>
                  </div>
                </div>

                {/* Camera Actions */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={takePhoto}
                    className="flex-1 py-3 bg-[#0d631b] hover:bg-[#16501f] text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-98 transition-transform"
                  >
                    <span className="material-symbols-outlined text-lg">camera</span>
                    <span>التقاط الصورة 📸</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => startCamera(cameraFacingMode === 'user' ? 'environment' : 'user')}
                    className="p-3 bg-gray-100 dark:bg-[#222222] hover:bg-gray-200 text-gray-700 dark:text-gray-200 font-bold rounded-xl flex items-center justify-center"
                    title="تبديل الكاميرا"
                  >
                    <span className="material-symbols-outlined text-xl">cameraswitch</span>
                  </button>

                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-3 bg-gray-100 dark:bg-[#222222] hover:bg-gray-200 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-xl"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
