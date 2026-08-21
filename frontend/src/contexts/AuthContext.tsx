import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService, UserProfile, getToken } from '../services/authService';

interface AuthContextType {
  currentUser: UserProfile | null;
  isLoading: boolean;
  login: (user: UserProfile) => void;
  logout: () => void;
  setIsLoginModalOpen: (isOpen: boolean) => void;
  isLoginModalOpen: boolean;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
}

// إنشاء سياق المصادقة (AuthContext) لمشاركة بيانات المستخدم الحالي في كل أجزاء التطبيق بدون الحاجة لتمريرها كـ Props
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('دمشق - حي الروضة');

  useEffect(() => {
    // عند بداية تحميل التطبيق، نتحقق مما إذا كان هناك رمز دخول (Token) محفوظ لجلب بيانات المستخدم مباشرة
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const profile = await AuthService.getProfile();
          setCurrentUser({ ...profile, isLoggedIn: true });
        } catch (error) {
          console.error('Failed to restore session', error);
          AuthService.logout();
        }
      }
      setIsLoading(false);
    };
    initAuth();

    // الاستماع لحدث انتهاء صلاحية الجلسة (401 Unauthorized) وتسجيل خروج المستخدم تلقائياً
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth-unauthorized', handleUnauthorized);
    
    return () => {
      window.removeEventListener('auth-unauthorized', handleUnauthorized);
    };
  }, []);

  const login = (user: UserProfile) => {
    setCurrentUser(user);
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, logout, isLoginModalOpen, setIsLoginModalOpen, selectedLocation, setSelectedLocation }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
