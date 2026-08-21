import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Post, CommunityInitiative } from '../types';
import { CommunityInitiativesSection } from './CommunityInitiativesSection';
import { fetchItems } from '../services/itemService';
import { CreateInitiativeModal } from './CreateInitiativeModal';
import { useAuth } from '../contexts/AuthContext';

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

  const [initiatives, setInitiatives] = useState<CommunityInitiative[]>([]);
  const [selectedRadius, setSelectedRadius] = useState<number>(4);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  const [isCreateInitiativeModalOpen, setIsCreateInitiativeModalOpen] = useState(false);

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
      
      const mappedPosts = data.map((item: any) => ({
        id: item.id as string,
        type: item.category === 'احتياجات عاجلة' ? 'urgent' : (item.category === 'طلب مساعدة' ? 'gift' : 'loan'),
        title: item.title as string,
        description: (item.description as string) || '',
        category: (item.category as string) || 'أخرى',
        maxDays: null,
        image: (item.image as string) || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=300&q=80',
        ownerName: item.isAnonymous ? 'مستخدم مستور' : ((item.user as Record<string, string>)?.name || 'مستخدم'),
        ownerId: item.userId as string,
        ownerAvatar: (item.user as Record<string, string>)?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        ownerRating: (item.user as Record<string, number>)?.trustPoints || 5.0,
        distanceKm: (item.distanceKm as number) || 0.5,
        distanceLabel: 'قريب منك',
        locationName: (item.location as string) || 'دمشق',
        status: 'available',
        dateAdded: new Date(item.createdAt as string).toLocaleDateString(),
        isAnonymous: (item.isAnonymous as boolean) || false
      }));
      setPosts(mappedPosts);
    } catch (err) {
      console.error("Failed to load items", err);
    }
  }, [selectedRadius, selectedCategory]);

  /**
   * Fetches community initiatives and maps them to the expected interface.
   * Memoized to stabilize dependency arrays in useEffects.
   */
  const loadInitiatives = useCallback(async () => {
    try {
      const { InitiativesService } = await import('../services/apiClient');
      const data = await InitiativesService.getAll();
      const mappedInit = data.map((i: Record<string, any>) => ({
        id: i.id,
        title: i.title,
        description: i.description,
        organizerName: i.organizer?.name || 'مستخدم',
        organizerAvatar: i.organizer?.avatar || '',
        category: i.category,
        categoryLabel: i.categoryLabel,
        date: i.date,
        time: i.time,
        location: i.location,
        participantsCount: i.participants?.length || 0,
        maxParticipants: i.maxParticipants,
        status: i.status === 'UPCOMING' ? 'upcoming' : i.status === 'ACTIVE' ? 'active' : 'completed',
        image: i.image,
        isUserJoined: i.participants?.some((p: Record<string, any>) => p.userId === currentUser?.id),
        joinedUserNames: i.participants?.map((p: Record<string, any>) => p.user?.name) || [],
      }));
      setInitiatives(mappedInit);
    } catch (e) {
      console.error("Failed to load initiatives", e);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    loadItems();
    loadInitiatives();
  }, [loadItems, loadInitiatives]);

  useEffect(() => {
    const handleItemAdded = () => {
      loadItems();
    };
    window.addEventListener('ITEM_ADDED', handleItemAdded);
    return () => window.removeEventListener('ITEM_ADDED', handleItemAdded);
  }, [loadItems]);

  const handleCreateInitiative = async (newInit: any) => {
    try {
      const { InitiativesService } = await import('../services/apiClient');
      await InitiativesService.create({
        title: newInit.title,
        description: newInit.description,
        category: newInit.category.toUpperCase(),
        categoryLabel: newInit.categoryLabel,
        date: newInit.date,
        time: newInit.time,
        location: newInit.location,
        maxParticipants: newInit.maxParticipants,
        image: newInit.image,
        tags: newInit.tags
      });
      setIsCreateInitiativeModalOpen(false);
      loadInitiatives();
    } catch (e) {
      console.error("Failed to create initiative", e);
    }
  };

  const handleToggleJoinInitiative = async (id: string) => {
    try {
      const { InitiativesService } = await import('../services/apiClient');
      await InitiativesService.join(id);
      loadInitiatives();
    } catch (e) {
      console.error("Failed to toggle join", e);
    }
  };

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
    <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 md:px-8 pt-20 pb-28 space-y-8 rtl">
      {/* Interactive Map Quick Launcher Banner */}
      <section
        onClick={onOpenMap}
        className="bg-gradient-to-r from-[#0d631b] to-[#1e5828] text-white rounded-2xl p-4 md:p-6 shadow-md flex items-center justify-between cursor-pointer hover:shadow-lg transition-all transform active:scale-[0.99] border border-emerald-700/50 relative overflow-hidden group"
      >
        <div className="absolute -left-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-2xl">map</span>
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base">خريطة الحي التفاعلية 🗺️</h3>
            <p className="text-xs text-emerald-100">استعرض الأغراض والمساعدات المتاحة حول موقعك جغرافياً</p>
          </div>
        </div>
        <div className="bg-white text-[#0d631b] px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 flex items-center gap-1 shadow-2xs group-hover:bg-emerald-50">
          <span>افتح الخريطة</span>
          <span className="material-symbols-outlined text-sm">arrow_back</span>
        </div>
      </section>

      {/* Radius Control */}
      <section className="flex flex-col gap-2">
        <span className="font-bold text-sm text-[#40493d] px-1">نطاق البحث:</span>
        <div className="flex bg-[#f1f5eb] p-1 rounded-xl border border-[#bfcaba]/60 shadow-xs">
          {[1, 2, 4].map((rad) => (
            <button
              key={rad}
              onClick={() => setSelectedRadius(rad)}
              className={`flex-1 py-1.5 text-center font-bold text-sm rounded-lg transition-all ${
                selectedRadius === rad
                  ? 'bg-[#0d631b] text-white shadow-sm scale-[1.02]'
                  : 'text-[#40493d] hover:bg-[#e0e4da]'
              }`}
            >
              {rad} كم
            </button>
          ))}
        </div>
      </section>

      {/* Hero Banner (Urgent Support) */}
      <section className="relative overflow-hidden rounded-2xl border border-[#fc820c]/30 bg-[#FFF3E0] p-4 sm:p-6 shadow-[0_4px_16px_0_rgba(252,130,12,0.1)]">
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#fc820c]/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#fc820c]/20 text-[#964900] font-bold text-[11px] flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">volunteer_activism</span>
                تكافل وتراحم الحي 🇸🇾
              </span>
            </div>
            <h2 className="font-bold text-lg sm:text-xl text-[#964900]">
              دعم الأسر العائدة في الحي
            </h2>
            <p className="text-xs sm:text-sm text-[#40493d] font-medium leading-relaxed">
              {urgentCount} احتياجات عاجلة بانتظار المساعدة في نطاق {selectedRadius} كم
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('احتياجات عاجلة');
              document.getElementById('feed-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#fc820c] text-white hover:bg-[#964900] transition-colors rounded-full font-bold text-xs sm:text-sm shadow-sm flex justify-center items-center gap-2 shrink-0 active:scale-95 duration-150"
          >
            <span>تقديم مساعدة</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* Community Solidarity Projects Section */}
      <CommunityInitiativesSection
        initiatives={initiatives}
        onToggleJoinInitiative={handleToggleJoinInitiative}
        onOpenCreateModal={() => setIsCreateInitiativeModalOpen(true)}
        onSelectInitiative={onSelectInitiative}
      />

      {/* Filter Chips */}
      <section className="flex overflow-x-auto hide-scrollbar gap-2 py-1 -mx-5 px-5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-semibold text-xs transition-all ${
              selectedCategory === cat
                ? 'bg-[#2e7d32] text-white border border-[#0d631b] shadow-sm'
                : 'bg-white text-[#181d17] border border-[#bfcaba] hover:bg-[#e0e4da]'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Create Initiative Modal */}
      <CreateInitiativeModal 
        isOpen={isCreateInitiativeModalOpen}
        onClose={() => setIsCreateInitiativeModalOpen(false)}
        onCreateInitiative={handleCreateInitiative}
      />

      {/* Feed Cards */}
      <section id="feed-section" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredPosts.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-8 border border-[#bfcaba] text-center space-y-3">
            <span className="material-symbols-outlined text-4xl text-[#707a6c]">search_off</span>
            <h3 className="font-bold text-base text-[#181d17]">لا توجد أغراض في هذا النطاق</h3>
            <p className="text-sm text-[#40493d]">جرّب توسيع نطاق البحث أو اختيار تصنيف آخر</p>
            <button
              onClick={() => {
                setSelectedRadius(4);
                setSelectedCategory('الكل');
              }}
              className="px-4 py-2 bg-[#e0e4da] text-[#0d631b] font-bold text-xs rounded-lg hover:bg-[#ebefe5]"
            >
              عرض جميع الأغراض
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => {
            if (post.type === 'loan') {
              return (
                <article
                  key={post.id}
                  onClick={() => onSelectItem(post)}
                  className="bg-white rounded-2xl p-4 border border-[#bfcaba]/80 shadow-[0_4px_12px_0_rgba(0,0,0,0.04)] flex flex-col gap-3 relative overflow-hidden group hover:shadow-[0_8px_24px_0_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer"
                >
                  <div className="absolute top-0 right-0 w-1.5 h-full bg-[#2e7d32]"></div>
                  
                  <div className="flex justify-between items-start pl-2">
                    <div className="flex gap-2 items-center mb-1 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#2e7d32]/15 text-[#0d631b] font-bold text-xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">handshake</span>
                        مطلوب إعارة ({post.maxDays ? `${post.maxDays} أيام` : 'مؤقتة'})
                      </span>
                      <span className="text-[#40493d] font-medium text-xs flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {post.distanceLabel}
                      </span>
                    </div>
                    <button className="text-[#707a6c] hover:text-[#0d631b] p-1 rounded-full">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </div>

                  <h3 className="font-bold text-lg text-[#181d17] pr-2 leading-snug">
                    {post.title}
                  </h3>

                  <div className="flex items-center gap-3 pr-2 mt-0.5">
                    <div className="w-9 h-9 rounded-full bg-[#e5eadf] flex items-center justify-center text-[#181d17] overflow-hidden border border-[#bfcaba]">
                      <img
                        src={post.ownerAvatar}
                        alt={post.ownerName}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-[#181d17]">{post.ownerName}</span>
                      <span className="font-semibold text-xs text-[#40493d] flex items-center gap-0.5">
                        <span
                          className="material-symbols-outlined text-[12px] text-[#fc820c]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        {post.ownerRating}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 pr-2">
                    {post.ownerId === currentUser?.id ? (
                      <div className="w-full py-2.5 bg-[#f1f5eb] text-[#707a6c] rounded-xl font-bold text-sm flex justify-center items-center gap-2 border border-[#bfcaba]">
                        <span>طلبي الخاص</span>
                        <span className="material-symbols-outlined text-[18px]">person</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          onSelectItem(post);
                        }}
                        className="w-full py-2.5 bg-white text-[#0d631b] border border-[#0d631b] hover:bg-[#2e7d32] hover:text-white rounded-xl font-bold text-sm transition-colors flex justify-center items-center gap-2 active:scale-95 duration-150 shadow-2xs"
                      >
                        <span>أنا أمتلك هذا - سأعيره</span>
                        <span className="material-symbols-outlined text-[18px]">handshake</span>
                      </button>
                    )}
                  </div>
                </article>
              );
            }

            if (post.type === 'gift') {
              return (
                <article
                  key={post.id}
                  onClick={() => onSelectItem(post)}
                  className="bg-white rounded-2xl p-4 border border-[#bfcaba]/80 shadow-[0_4px_12px_0_rgba(0,0,0,0.04)] flex flex-col gap-3 relative overflow-hidden group hover:shadow-[0_8px_24px_0_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer"
                >
                  <div className="absolute top-0 right-0 w-1.5 h-full bg-[#0284c7]"></div>
                  
                  <div className="flex justify-between items-start pl-2">
                    <div className="flex gap-2 items-center mb-1 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#e0f2fe] text-[#0369a1] font-bold text-xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">redeem</span>
                        مطلوب مساعدة
                      </span>
                      <span className="text-[#40493d] font-medium text-xs flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {post.distanceLabel}
                      </span>
                    </div>
                    <button className="text-[#707a6c] hover:text-[#0369a1] p-1 rounded-full">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </div>

                  <h3 className="font-bold text-lg text-[#181d17] pr-2 leading-snug">
                    {post.title}
                  </h3>

                  <div className="flex items-center gap-3 pr-2 mt-0.5">
                    <div className="w-9 h-9 rounded-full bg-[#e5eadf] flex items-center justify-center text-[#181d17] overflow-hidden border border-[#bfcaba]">
                      <img
                        src={post.ownerAvatar}
                        alt={post.ownerName}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="font-bold text-sm text-[#181d17]">{post.ownerName}</span>
                  </div>

                  <div className="mt-2 pr-2">
                    {post.ownerId === currentUser?.id ? (
                      <div className="w-full py-2.5 bg-[#f1f5eb] text-[#707a6c] rounded-xl font-bold text-sm flex justify-center items-center gap-2 border border-[#bfcaba]">
                        <span>طلبي الخاص</span>
                        <span className="material-symbols-outlined text-[18px]">person</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          onSelectItem(post);
                        }}
                        className="w-full py-2.5 bg-white text-[#0369a1] border border-[#0369a1] hover:bg-[#e0f2fe] rounded-xl font-bold text-sm transition-colors flex justify-center items-center gap-2 active:scale-95 duration-150 shadow-2xs"
                      >
                        <span>أنا أمتلك هذا - سأتبرع به</span>
                        <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                      </button>
                    )}
                  </div>
                </article>
              );
            }

            // Urgent / Anonymous Type
            const isAnon = post.isAnonymous;
            const displayOwner = isAnon ? 'أسرة متعففة (هوية مستورة 🛡️)' : post.ownerName;

            return (
              <article
                key={post.id}
                onClick={() => onSelectItem(post)}
                className="bg-[#fff9f2] dark:bg-amber-950/20 rounded-2xl p-4 border border-[#fc820c]/40 shadow-[0_4px_12px_0_rgba(252,130,12,0.06)] flex flex-col gap-3 relative overflow-hidden group hover:shadow-[0_8px_24px_0_rgba(252,130,12,0.12)] transition-all duration-300 cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-1.5 h-full bg-[#fc820c]"></div>

                <div className="flex justify-between items-start pl-2">
                  <div className="flex gap-2 items-center mb-1 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#fc820c]/20 text-[#964900] dark:text-amber-300 font-bold text-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">priority_high</span>
                      طلب احتياج عاجل
                    </span>

                    {isAnon && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1 border border-emerald-300">
                        <span className="material-symbols-outlined text-[14px]">shield_person</span>
                        هوية مستورة 🛡️
                      </span>
                    )}

                    <span className="text-[#40493d] dark:text-slate-400 font-medium text-xs flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {post.distanceLabel}
                    </span>
                  </div>
                  <button className="text-[#707a6c] hover:text-[#fc820c] p-1 rounded-full">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>

                <h3 className="font-bold text-lg text-[#181d17] dark:text-slate-100 pr-2 leading-snug">
                  {post.title}
                </h3>

                <p className="text-sm text-[#40493d] dark:text-slate-300 pr-2 line-clamp-2 leading-relaxed font-medium">
                  {post.description}
                </p>

                {/* Owner Info & Privacy Banner */}
                <div className="flex items-center gap-2.5 bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-xl border border-[#fc820c]/20">
                  {isAnon ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      <span className="material-symbols-outlined text-base">shield_person</span>
                    </div>
                  ) : (
                    <img
                      src={post.ownerAvatar}
                      alt={post.ownerName}
                      className="w-8 h-8 rounded-full object-cover shrink-0 border border-emerald-600"
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-[#181d17] dark:text-slate-100">{displayOwner}</span>
                    <span className="text-[10px] text-[#0d631b] dark:text-emerald-400 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[11px]">gavel</span>
                      يتطلب تعهد المتبرع بحفظ الخصوصية 🔒
                    </span>
                  </div>
                </div>

                <div className="mt-1 pr-2">
                  {post.ownerId === currentUser?.id ? (
                    <div className="w-full py-2.5 bg-[#f1f5eb] text-[#707a6c] rounded-xl font-bold text-sm flex justify-center items-center gap-2 border border-[#fc820c]/40">
                      <span>طلبي الخاص</span>
                      <span className="material-symbols-outlined text-[18px]">person</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onSelectItem(post);
                      }}
                      className="w-full py-2.5 bg-white text-[#fc820c] border border-[#fc820c] hover:bg-[#fff3e0] rounded-xl font-bold text-sm transition-colors flex justify-center items-center gap-2 active:scale-95 duration-150 shadow-2xs"
                    >
                      <span>تقديم مساعدة بتعهد سرّي 🤝</span>
                      <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })
        )}
      </section>
    </main>
  );
};
