import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { HomeFeed } from './views/HomeFeed';
import { MySwapsView } from './views/MySwapsView';
import { ProfileView } from './views/ProfileView';
import { SearchView } from './views/SearchView';
import { AddItemModal } from './components/modals/AddItemModal';
import { insertItem } from './services/itemService';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { LoginModal, UserProfile } from './components/modals/LoginModal';
import { ItemDetailModal } from './components/modals/ItemDetailModal';
import AdminDashboardView from './views/AdminDashboardView';
import { createExchangeRequest } from './services/exchangeService';
import { Post } from './types';

// المكون الداخلي للتطبيق للوصول لخطافات React Router و AuthContext
function AppContent() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // حالة فتح/إغلاق نافذة إضافة طلب جديد
  const [selectedPost, setSelectedPost] = useState<Post | null>(null); // حالة حفظ الطلب المختار لعرض تفاصيله
  const { currentUser, isLoginModalOpen, setIsLoginModalOpen, login, logout, isLoading } = useAuth(); // جلب بيانات تسجيل الدخول من الكونتكست
  const navigate = useNavigate(); // أداة التوجيه بين الصفحات
  const location = useLocation(); // المسار الحالي لإخفاء الشريط العلوي في الخريطة

  // دالة لإرسال الطلب الجديد للباك إند
  const handleAddItem = async (data: Partial<Post>) => {
    if (!data.title || !data.category) return;
    await insertItem({
      title: data.title,
      category: data.category,
      type: 'REQUEST',
      description: data.description,
      urgent: data.urgent || false,
      distanceKm: data.distanceKm,
      location: data.locationName,
      image: data.image,
      isAnonymous: data.isAnonymous,
    });
    setIsAddModalOpen(false);
  };

  // أثناء تحميل حالة الدخول
  if (isLoading) return <div className="min-h-screen w-full flex items-center justify-center bg-background text-on-background">جاري التحميل...</div>;

  // دالة تُنفذ عند إرسال المستخدم لطلب مبادلة أو تبرع لجار آخر
  const handleRequestSubmitted = async (postTitle: string, message: string, requesterName?: string) => {
    if (!selectedPost) return;
    try {
      // إنشاء طلب مبادلة جديد (Handshake Request)
      await createExchangeRequest(
        selectedPost.id,
        selectedPost.title,
        new Date().toISOString(),
        new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // ينتهي بعد 3 أيام
      );

      setSelectedPost(null);
      alert('تم تقديم الطلب بنجاح');
      window.dispatchEvent(new Event('ITEM_ADDED')); // تحديث الواجهة تلقائياً
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء تقديم الطلب');
    }
  };

  return (
    <>
      <Routes>
        <Route element={<AppLayout onAddClick={() => setIsAddModalOpen(true)} />}>
          <Route path="/" element={<HomeFeed onSelectItem={setSelectedPost} onOpenMap={() => navigate('/search')} />} />
          <Route path="/search" element={<SearchView onSelectItem={setSelectedPost} onOpenMap={() => navigate('/search')} />} />
          <Route path="/swaps" element={<MySwapsView />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/admin" element={<AdminDashboardView />} />
        </Route>
      </Routes>

      <AddItemModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      {/* نافذة تسجيل الدخول تظهر تلقائياً إذا لم يكن هناك مستخدم مسجل */}
      <LoginModal 
        isOpen={isLoginModalOpen || !currentUser} 
        onClose={() => setIsLoginModalOpen(false)} 
        currentUser={currentUser || { name: '', phone: '', city: '', neighborhood: '', userType: 'resident', avatar: '', isLoggedIn: false }}
        onLoginSuccess={login}
        onLogout={logout}
      />

      {/* نافذة تفاصيل الطلب التي تفتح عند النقر على أي بطاقة (Card) */}
      {selectedPost && (
        <ItemDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onRequestSubmitted={handleRequestSubmitted}
          onOpenChat={() => { setSelectedPost(null); alert('تم فتح الدردشة'); }}
        />
      )}
    </>
  );
}

// المكون الرئيسي للتطبيق
export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}
