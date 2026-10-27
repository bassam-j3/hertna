import React, { useState } from 'react';
import { CITIES_DATA } from '../../data/constants';
import { AuthService } from '../../services/authService';

export interface UserProfile {
  name: string;
  phone: string;
  city: string;
  neighborhood: string;
  userType: 'resident' | 'returning' | 'donor' | 'committee';
  avatar: string;
  isLoggedIn: boolean;
}

interface ApiErrorResponse {
  response?: {
    status?: number;
    data?: {
      message?: string | string[];
    } | string;
  };
  message?: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
  isDarkMode?: boolean;
}



export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  isDarkMode = false,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCity, setSelectedCity] = useState('دمشق');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('دمشق - حي الروضة');
  const [userType, setUserType] = useState<'resident' | 'returning' | 'donor' | 'committee'>('resident');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentCityLocations =
    CITIES_DATA.find((c) => c.cityName === selectedCity)?.locations || [];

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      setErrorMsg('يرجى كتابة رقم الجوال وكلمة المرور');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    try {
      const res = await AuthService.login({ phone, password });
      onLoginSuccess({ ...res.user, isLoggedIn: true });
    } catch (err: unknown) {
      const error = err as ApiErrorResponse;
      let finalMsg = 'بيانات الدخول غير صحيحة';
      const data = error.response?.data;

      if (data) {
        if (typeof data === 'object' && typeof data.message === 'string') {
          finalMsg = data.message;
        } else if (typeof data === 'object' && Array.isArray(data.message)) {
          finalMsg = data.message[0];
        } else if (typeof data === 'string') {
          finalMsg = data;
        } else if (typeof data === 'object' && data.message && typeof data.message === 'object') {
          finalMsg = 'بيانات غير صالحة'; // Fallback if message itself is a nested object
        }
      } else if (error.message) {
        finalMsg = error.message;
      }

      setErrorMsg(finalMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !password) {
      setErrorMsg('يرجى تعبئة كافة الحقول المطلوبة (بما فيها كلمة المرور)');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    try {
      const res = await AuthService.register({
        name: fullName,
        phone,
        password,
        city: selectedCity,
        neighborhood: selectedNeighborhood,
        userType,
      });
      onLoginSuccess({ ...res.user, isLoggedIn: true });
    } catch (err: unknown) {
      const error = err as ApiErrorResponse;
      let finalMsg = 'حدث خطأ أثناء التسجيل';
      const data = error.response?.data;

      if (error.response?.status === 409) {
        finalMsg = 'رقم الهاتف مسجل مسبقاً، يرجى تسجيل الدخول أو استخدام رقم آخر.';
      } else if (data) {
        if (typeof data === 'object' && typeof data.message === 'string') {
          finalMsg = data.message;
        } else if (typeof data === 'object' && Array.isArray(data.message)) {
          finalMsg = data.message[0];
        } else if (typeof data === 'string') {
          finalMsg = data;
        } else if (typeof data === 'object' && data.message && typeof data.message === 'object') {
          finalMsg = 'بيانات غير صالحة'; // Fallback if message itself is a nested object
        }
      } else if (error.message) {
        finalMsg = error.message;
      }

      setErrorMsg(finalMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 rtl">


      {/* 2. صندوق النافذة - تمت إضافة shrink-0 لمنع الانكماش نهائياً */}
      <main
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full sm:w-[450px] shrink-0 flex flex-col overflow-hidden bg-[#0e1711] text-white rounded-t-3xl sm:rounded-3xl shadow-2xl"
        style={{ maxHeight: '90vh' }}
      >
        {/* Header */}
        <header className="px-5 py-4 bg-gradient-to-r from-[#0d631b] to-emerald-800 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30">
              <img src="/haretna_logo.png" alt="حارتنا" className="w-8 h-8 rounded-lg object-contain" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">صفحة تسجيل الدخول والربط 🔑</h3>
              <p className="text-xs text-emerald-100 font-medium">منصة حارتنا للتكافل - دمشق • حمص • حماة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </header>

        {/* Logged in Current User Banner if active */}
        {currentUser.isLoggedIn && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border-b border-emerald-200 dark:border-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#0d631b]"
              />
              <div>
                <div className="font-bold text-xs text-[#0d631b] dark:text-emerald-300 flex items-center gap-1">
                  <span>مسجّل حالياً: {currentUser.name}</span>
                  <span className="px-1.5 py-0.2 bg-emerald-200 text-emerald-900 rounded text-[10px]">
                    {currentUser.city}
                  </span>
                </div>
                <span className="text-[11px] text-[#707a6c] dark:text-slate-400">
                  {currentUser.neighborhood}
                </span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 text-xs font-bold rounded-xl hover:bg-red-200 transition-colors"
            >
              تسجيل الخروج
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-[#ebefe5] dark:border-[#19261c] bg-[#f7fbf0] dark:bg-[#0e1711] p-1.5 gap-1">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 ${activeTab === 'login'
              ? 'bg-[#0d631b] text-white shadow-xs'
              : 'text-[#40493d] dark:text-[#f1f5f9]/70 hover:bg-[#ebefe5] dark:hover:bg-[#19261c]'
              }`}
          >
            <span className="material-symbols-outlined text-base">key</span>
            <span>تسجيل برقم الجوال</span>
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 ${activeTab === 'register'
              ? 'bg-[#0d631b] text-white shadow-xs'
              : 'text-[#40493d] dark:text-[#f1f5f9]/70 hover:bg-[#ebefe5] dark:hover:bg-[#19261c]'
              }`}
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>حساب جار جديد 🇸🇾</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 flex-1 overflow-y-auto bg-[#0e1711] text-white">
          {errorMsg && (
            <div className="p-2.5 bg-red-100 text-red-800 rounded-xl text-xs font-bold border border-red-300 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: Custom Phone/Password Login */}
          {activeTab === 'login' && (
            <form onSubmit={handleCustomLogin} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-white">
                  رقم الجوال السوري:
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="0933123456"
                  className="w-full h-11 px-3 bg-[#19261c] border border-[#0d631b]/30 rounded-xl text-xs font-medium outline-none focus:border-[#0d631b] text-white placeholder-gray-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-white">
                  كلمة المرور:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-3 bg-[#19261c] border border-[#0d631b]/30 rounded-xl text-xs font-medium outline-none focus:border-[#0d631b] text-white placeholder-gray-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-white">
                    المدينة:
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => {
                      setSelectedCity(e.target.value);
                      const firstLoc =
                        CITIES_DATA.find((c) => c.cityName === e.target.value)?.locations[0] || '';
                      setSelectedNeighborhood(firstLoc);
                    }}
                    className="w-full h-10 px-2 bg-[#19261c] border border-[#0d631b]/30 rounded-xl text-xs font-bold outline-none text-white"
                  >
                    <option value="دمشق">دمشق</option>
                    <option value="حمص">حمص</option>
                    <option value="حماة">حماة</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-white">
                    الحي:
                  </label>
                  <select
                    value={selectedNeighborhood}
                    onChange={(e) => setSelectedNeighborhood(e.target.value)}
                    className="w-full h-10 px-2 bg-[#19261c] border border-[#0d631b]/30 rounded-xl text-xs font-medium outline-none text-white"
                  >
                    {currentCityLocations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0d631b] hover:bg-[#16501f] text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span className="material-symbols-outlined text-lg">login</span>
                <span>تسجيل الدخول إلى حساب حارتنا 🔑</span>
              </button>
            </form>
          )}

          {/* TAB 3: Register New Neighbor */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-white">
                  اسم الجار / اللقب بالحي:
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثلاً: أبو محمود الحمصي"
                  className="w-full h-11 px-3 bg-[#19261c] border border-[#0d631b]/30 rounded-xl text-xs font-medium outline-none focus:border-[#0d631b] text-white placeholder-gray-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-white">
                  رقم الجوال لتأكيد التواصل:
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="09XXXXXXXX"
                  className="w-full h-11 px-3 bg-[#19261c] border border-[#0d631b]/30 rounded-xl text-xs font-medium outline-none focus:border-[#0d631b] text-white placeholder-gray-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-white">
                  كلمة المرور:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-3 bg-[#19261c] border border-[#0d631b]/30 rounded-xl text-xs font-medium outline-none focus:border-[#0d631b] text-white placeholder-gray-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-white">
                    المدينة السورية:
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => {
                      setSelectedCity(e.target.value);
                      const firstLoc =
                        CITIES_DATA.find((c) => c.cityName === e.target.value)?.locations[0] || '';
                      setSelectedNeighborhood(firstLoc);
                    }}
                    className="w-full h-10 px-2 bg-[#19261c] border border-[#0d631b]/30 rounded-xl text-xs font-bold outline-none text-white"
                  >
                    <option value="دمشق">دمشق</option>
                    <option value="حمص">حمص</option>
                    <option value="حماة">حماة</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-white">
                    الحي التابع له:
                  </label>
                  <select
                    value={selectedNeighborhood}
                    onChange={(e) => setSelectedNeighborhood(e.target.value)}
                    className="w-full h-10 px-2 bg-[#19261c] border border-[#0d631b]/30 rounded-xl text-xs font-medium outline-none text-white"
                  >
                    {currentCityLocations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-white">
                  صفة الحساب في الحي:
                </label>
                <select
                  value={userType}
                  onChange={(e) =>
                    setUserType(e.target.value as 'resident' | 'returning' | 'donor' | 'committee')
                  }
                  className="w-full h-10 px-2 bg-[#19261c] border border-[#0d631b]/30 rounded-xl text-xs font-medium outline-none text-white"
                >
                  <option value="resident">أهالي الحي الأصليين 🏡</option>
                  <option value="returning">أسرة عائدة حديثاً 🌸</option>
                  <option value="donor">متبرع ومقرض مجتمعي 🤝</option>
                  <option value="committee">لجنة الحي التكافلية 🏅</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0d631b] hover:bg-[#16501f] text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span className="material-symbols-outlined text-lg">person_add</span>
                <span>إنشاء حساب انضمام لحارتنا ✨</span>
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};