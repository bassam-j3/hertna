import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Post, CommunityInitiative } from '../types';
// CommunityInitiativesSection moved to MySwapsView (Exchanges page)
import { fetchItems, BackendPostResponse } from '../services/itemService';
// CreateInitiativeModal moved to MySwapsView (Exchanges page)
import { useAuth } from '../contexts/AuthContext';
import { CategoryFilter } from '../components/CategoryFilter';
import { FeedCard } from '../components/FeedCard';

interface HomeFeedProps {
  onSelectItem?: (post: Post) => void;
  onOpenAddModal?: () => void;
  onOpenMap?: () => void;
  onToggleJoinInitiative?: (id: string) => void;
  onOpenCreateInitiativeModal?: () => void;
  onSelectInitiative?: (init: CommunityInitiative) => void;
}

/**
 * المكون الرئيسي (HomeFeed)
 * 
 * هذا المكون هو واجهة المستخدم الرئيسية التي تعرض طلبات الجيران (إعارة، تبرع، حالات طارئة)
 * والمبادرات المجتمعية. يستخدم الـ Geolocation لحساب المسافات وتصفية الطلبات.
 */
export const HomeFeed: React.FC<HomeFeedProps> = ({
  onSelectItem = (post) => {},
  onOpenMap = () => {},
  onToggleJoinInitiative = (id) => {},
  onOpenCreateInitiativeModal = () => {},
  onSelectInitiative = (init) => {},
}) => {
  const { currentUser, selectedLocation } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);

  // initiatives state moved to MySwapsView
  const [selectedRadius, setSelectedRadius] = useState<number>(4);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  // isCreateInitiativeModalOpen state moved to MySwapsView

  /**
   * جلب البيانات من الخادم (Backend) بناءً على موقع المستخدم، نطاق البحث، والتصنيف المختار.
   * استخدام useCallback يمنع إعادة إنشاء الدالة مع كل تحديث للواجهة (Performance optimization).
   */
  const loadItems = useCallback(async () => {
    try {
      let userLat = 33.5138; // Default Damascus
      let userLon = 36.2765;

      if (navigator.geolocation && (window.location.hostname === 'localhost' || window.isSecureContext)) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          userLat = position.coords.latitude;
          userLon = position.coords.longitude;
        } catch (error) {
          // Silent fallback
        }
      }

      const data = await fetchItems(userLat, userLon, selectedRadius, selectedCategory);
      
      const mappedPosts: Post[] = data.map((item: BackendPostResponse) => ({
        id: item.id,
        type: item.category === 'احتياجات عاجلة' ? 'urgent' : (item.category === 'طلب مساعدة' ? 'gift' : 'loan'),
        title: item.title,
        description: item.description || '',
        category: item.category || 'أخرى',
        maxDays: undefined,
        image: item.image || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=300&q=80',
        ownerName: item.isAnonymous ? 'مستخدم مستور' : (item.user?.name || 'مستخدم'),
        ownerId: item.userId || item.user?.id || '',
        ownerAvatar: item.user?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        ownerRating: item.user?.trustPoints || 5.0,
        distanceKm: item.distanceKm || 0.5,
        distanceLabel: 'قريب منك',
        locationName: item.location || 'دمشق',
        status: 'available',
        dateAdded: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '',
        isAnonymous: item.isAnonymous || false
      }));
      setPosts(mappedPosts);
    } catch (err) {
      console.error("Failed to load items", err);
    }
  }, [selectedRadius, selectedCategory]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  useEffect(() => {
    const handleItemAdded = () => {
      loadItems();
    };
    window.addEventListener('ITEM_ADDED', handleItemAdded);
    return () => window.removeEventListener('ITEM_ADDED', handleItemAdded);
  }, [loadItems]);

  const categories = [
    'الكل',
    'مطلوب للإعارة',
    'مطلوب مساعدة',
    'احتياجات عاجلة',
    'أثاث',
    'مستلزمات أطفال',
    'أدوات منزلية',
    'ملابس',
    'أدوات كهربائية'
  ];

  // تصفية المنشورات محلياً لتجنب البطء، مع استخدام useMemo لتحسين الأداء
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const selectedCityName = selectedLocation?.split(' - ')[0] || 'دمشق';
      if (!post.locationName.includes(selectedCityName)) return false;
      
      if (post.distanceKm > selectedRadius) return false;
      if (selectedCategory === 'الكل') return true;
      if (selectedCategory === 'مطلوب للإعارة') return post.type === 'loan';
      if (selectedCategory === 'مطلوب مساعدة') return post.type === 'gift';
      if (selectedCategory === 'احتياجات عاجلة') return post.type === 'urgent';
      return post.category === selectedCategory;
    });
  }, [posts, selectedRadius, selectedCategory, selectedLocation]);

  const urgentCount = useMemo(() => posts.filter((p) => p.type === 'urgent').length, [posts]);

  return (
    <main className="flex-1 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-md flex flex-col gap-stack-lg rtl pb-24 md:pb-0 pt-20">
      
      {/* Urgent Hero from Stitch Design */}
      <section>
        <div className="bg-[#FFF3E0] border border-[#fc820c] rounded-xl p-4 flex items-start gap-4 shadow-sm relative overflow-hidden">
          <div className="bg-[#fc820c] w-1 h-full absolute top-0 right-0"></div>
          <div className="flex-shrink-0 bg-white rounded-full p-2 text-[#fc820c]">
            <span className="material-symbols-outlined">campaign</span>
          </div>
          <div>
            <h2 className="font-title-lg text-title-lg text-[#954a00] mb-1">دعم الأسر العائدة</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-3">ساهم في مساعدة العائلات العائدة إلى منازلها من خلال تقديم الأدوات المنزلية الأساسية أو التطوع بوقتك.</p>
            <button 
              onClick={() => setSelectedCategory('احتياجات عاجلة')}
              className="bg-[#fc820c] text-white font-label-md text-label-md px-4 py-2 rounded-full hover:bg-opacity-90 transition-opacity"
            >
              ساهم الآن
            </button>
          </div>
        </div>
      </section>

      {/* Categories & Radius from new component */}
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedRadius={selectedRadius}
        onSelectRadius={setSelectedRadius}
      />

      {/* Feed Grid */}
      <section id="feed-section" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {filteredPosts.length === 0 ? (
          <div className="col-span-full bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 text-center space-y-3 shadow-sm">
            <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
            <h3 className="font-title-lg text-on-surface">لا توجد أغراض في هذا النطاق</h3>
            <p className="text-on-surface-variant">جرّب توسيع نطاق البحث أو اختيار تصنيف آخر</p>
            <button
              onClick={() => {
                setSelectedRadius(4);
                setSelectedCategory('الكل');
              }}
              className="px-4 py-2 bg-surface-container text-primary font-label-md rounded-full hover:bg-surface-container-high"
            >
              عرض جميع الأغراض
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <FeedCard key={post.id} post={post} onClick={onSelectItem} />
          ))
        )}
      </section>

      {/* Community Initiatives moved to MySwapsView (Exchanges page) */}

    </main>
  );
};
