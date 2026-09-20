import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Map, { Marker, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Post } from '../types';
import { fetchItems, BackendPostResponse } from '../services/itemService';

interface SearchViewProps {
  onSelectItem?: (post: Post) => void;
  onOpenMap?: () => void;
}

/**
 * واجهة الخريطة التفاعلية والبحث الجغرافي (SearchView)
 * 
 * تتيح لأهالي الحي استكشاف الأدوات المعارة والاحتياجات العاجلة جغرافياً.
 * تتضمن مؤشرات تحميل، معالجة الحالات الفارغة (Empty State)،
 * وانتقالات سلسة لبطاقة المعاينة مع زر استجابة مباشر.
 */
const cities = [
  { name: 'دمشق', lat: 33.5138, lng: 36.2765 },
  { name: 'حمص', lat: 34.7324, lng: 36.7137 },
  { name: 'حماة', lat: 35.1318, lng: 36.7578 }
];

export const SearchView: React.FC<SearchViewProps> = ({ onSelectItem }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedItem, setSelectedItem] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('الكل');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { showError } = useToast();

  const categories = [
    'الكل',
    'مطلوب للإعارة',
    'مطلوب مساعدة',
    'احتياجات عاجلة',
    'أثاث',
    'مستلزمات أطفال',
    ' منزلية',
    'ملابس',
    ' كهربائية'
  ];

  const { selectedLocation, setSelectedLocation } = useAuth();
  const selectedCityName = selectedLocation?.split(' - ')[0] || 'دمشق';
  const selectedCity = cities.find(c => c.name === selectedCityName) || cities[0];

  const [userLocation, setUserLocation] = useState<[number, number]>([33.5138, 36.2765]);
  const mapRef = useRef<MapRef>(null);

  const loadData = useCallback(async (latitude: number, longitude: number) => {
    setIsLoading(true);
    try {
      const data = await fetchItems(latitude, longitude, 10, 'all');
      const mappedPosts: Post[] = data.map((item: BackendPostResponse, index: number) => ({
        id: item.id,
        type: item.category === 'احتياجات عاجلة' ? 'urgent' : (item.category === 'طلب مساعدة' ? 'gift' : 'loan'),
        title: item.title,
        description: item.description || '',
        category: item.category || 'أخرى',
        maxDays: undefined,
        image: item.image || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=300&q=80',
        ownerName: item.isAnonymous ? 'مستخدم مستور' : (item.user?.name || 'مستخدم'),
        ownerId: item.userId || 'mock-id',
        ownerAvatar: item.user?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        ownerRating: item.user?.trustPoints || 5.0,
        distanceKm: item.distanceKm || 0.5,
        distanceLabel: 'قريب منك',
        locationName: item.location || selectedCity.name,
        status: 'available',
        dateAdded: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '',
        isAnonymous: item.isAnonymous || false,
        lat: (item.lat || latitude + (Math.random() - 0.5) * 0.02) + (index * 0.00005),
        lng: (item.lng || longitude + (Math.random() - 0.5) * 0.02) + (index * 0.00005),
      }));
      setPosts(mappedPosts);
    } catch (err) {
      console.error('Failed to load items in search', err);
      showError('تعذر جلب طلبات الجيران في هذا الموقع، يرجى إعادة المحاولة');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCity.name, showError]);

  useEffect(() => {
    const lat = selectedCity.lat;
    const lon = selectedCity.lng;

    if (navigator.geolocation && (window.location.hostname === 'localhost' || window.isSecureContext)) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          mapRef.current?.flyTo({ center: [position.coords.longitude, position.coords.latitude], zoom: 14 });
          loadData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Geolocation fallback to city center", error);
          setUserLocation([lat, lon]);
          mapRef.current?.flyTo({ center: [lon, lat], zoom: 14 });
          loadData(lat, lon);
        },
        { timeout: 5000 }
      );
    } else {
      setUserLocation([lat, lon]);
      mapRef.current?.flyTo({ center: [lon, lat], zoom: 14 });
      loadData(lat, lon);
    }
  }, [selectedCity.name, selectedCity.lat, selectedCity.lng, loadData]);

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (selectedCity.name && !p.locationName.includes(selectedCity.name)) {
        return false;
      }
      const matchesSearch = p.title.includes(searchTerm) || p.description.includes(searchTerm);

      let matchesCat = false;
      if (activeCategory === 'الكل') matchesCat = true;
      else if (activeCategory === 'مطلوب للإعارة') matchesCat = p.type === 'loan';
      else if (activeCategory === 'مطلوب مساعدة') matchesCat = p.type === 'gift';
      else if (activeCategory === 'احتياجات عاجلة') matchesCat = p.type === 'urgent';
      else matchesCat = p.category === activeCategory;

      return matchesSearch && matchesCat;
    });
  }, [posts, searchTerm, activeCategory, selectedCity.name]);

  /**
   * تمثيل أيقونة الماركر حسب نوع الطلب والتصنيف
   */
  const renderCustomIcon = useCallback((post: Post) => {
    let bgColor = 'bg-[#0d631b]';
    let textColor = 'text-white';
    let iconName = 'handyman';
    let extraClasses = '';

    if (post.type === 'urgent') {
      bgColor = 'bg-[#fc820c]';
      textColor = 'text-white';
      iconName = 'water_drop';
      extraClasses = 'animate-bounce';
    } else if (post.category === 'طعام' || post.category === 'طلب مساعدة') {
      iconName = 'volunteer_activism';
      bgColor = 'bg-blue-600';
    }
    return (
      <div className="custom-map-pin map-pin cursor-pointer">
        <div className="relative">
          <div className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center shadow-lg border-2 border-white relative z-10 ${extraClasses}`}>
            <span className={`material-symbols-outlined ${textColor} text-[20px] transition-transform duration-200 hover:scale-125`}>{iconName}</span>
          </div>
          <div className={`w-3 h-3 ${bgColor} rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2 -z-10`}></div>
        </div>
      </div>
    );
  }, []);

  const handleMarkerClick = useCallback((post: Post) => {
    setSelectedItem(post);
    mapRef.current?.flyTo({ center: [post.lng!, post.lat!], zoom: 16 });
  }, []);

  const renderedMarkers = useMemo(() => {
    return filteredPosts.map((post, index) => (
      post.lat && post.lng ? (
        <Marker
          key={`map-pin-${post.id || 'fallback'}-${index}`}
          longitude={post.lng}
          latitude={post.lat}
          anchor="bottom"
          onClick={() => handleMarkerClick(post)}
        >
          {renderCustomIcon(post)}
        </Marker>
      ) : null
    ));
  }, [filteredPosts, handleMarkerClick, renderCustomIcon]);

  return (
    <div className="absolute inset-0 pt-[60px] pb-[80px] w-full h-full bg-[#f7fbf0] text-[#181d17] font-body-lg overflow-hidden rtl z-10">
      {/* Map Container */}
      <div className="relative w-full h-full z-0 bg-[#e4edd8]">
        <Map
          ref={mapRef}
          initialViewState={{
            longitude: 36.2765,
            latitude: 33.5138,
            zoom: 14
          }}
          mapStyle={{
            version: 8,
            sources: {
              osm: {
                type: 'raster',
                tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '&copy; OpenStreetMap Contributors',
                maxzoom: 19
              }
            },
            layers: [
              {
                id: 'osm',
                type: 'raster',
                source: 'osm'
              }
            ]
          }}
          style={{ width: '100%', height: '100%' }}
        >
          {/* User Location Pulse */}
          <Marker longitude={userLocation[1]} latitude={userLocation[0]} anchor="center">
            <div className="relative w-4 h-4">
              <div className="absolute inset-0 bg-blue-500 rounded-full border-2 border-white shadow-sm z-10"></div>
              <div className="absolute -inset-2 rounded-full bg-blue-500/40 animate-ping z-0"></div>
            </div>
          </Marker>

          {/* Post Pins */}
          {renderedMarkers}
        </Map>
      </div>

      {/* Floating Search & Filter Overlay */}
      <div className="absolute top-4 left-4 right-2 z-40 max-w-screen-md mx-auto pointer-events-none flex flex-col gap-3">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => navigate('/')}
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-full text-[#0d631b] dark:text-emerald-400 shadow-[0_4px_24px_0_rgba(0,0,0,0.08)] border border-[#bfcaba] dark:border-slate-700 hover:bg-[#e0e4da] dark:hover:bg-slate-800 transition-colors pointer-events-auto"
            aria-label="الرجوع للرئيسية"
          >
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>

          {/* City Selector */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full shadow-[0_4px_24px_0_rgba(0,0,0,0.08)] border border-[#bfcaba] dark:border-slate-700 px-3 py-2 pointer-events-auto flex items-center">
            <span className="material-symbols-outlined text-[#0d631b] dark:text-emerald-400 text-[18px] ml-1">location_on</span>
            <select
              className="bg-transparent border-none outline-none text-[#181d17] dark:text-slate-100 font-bold text-sm focus:ring-0 cursor-pointer"
              value={selectedCity.name}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
              }}
            >
              {cities.map(c => <option key={c.name} value={c.name} className="dark:bg-slate-900">{c.name}</option>)}
            </select>
          </div>

          {/* Search Bar */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex-1 rounded-full shadow-[0_4px_24px_0_rgba(0,0,0,0.08)] border border-[#bfcaba] dark:border-slate-700 p-2 flex items-center justify-between gap-3 pointer-events-auto transition-all focus-within:border-[#0d631b]">
            <div className="flex items-center flex-1 bg-[#ebefe5] dark:bg-slate-800 rounded-full px-4 py-2">
              <span className="material-symbols-outlined text-[#40493d] dark:text-slate-400 ml-2">search</span>
              <input
                className="bg-transparent border-none outline-none w-full text-[14px] font-medium placeholder:text-[#707a6c] dark:placeholder-slate-400 dark:text-slate-100 focus:ring-0 text-right"
                placeholder="ابحث عن احتياجات الجيران..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide pointer-events-auto px-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-bold text-sm transition-colors shadow-sm ${activeCategory === cat
                ? 'bg-[#0d631b] text-white border-transparent'
                : 'bg-white/90 dark:bg-slate-900/90 text-[#40493d] dark:text-slate-300 border border-[#bfcaba] dark:border-slate-700 hover:bg-[#ebefe5] dark:hover:bg-slate-800'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Map Loading Pill */}
      {isLoading && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-[#bfcaba] dark:border-slate-700 flex items-center gap-2 text-xs font-bold text-[#0d631b] dark:text-emerald-400 pointer-events-none animate-pulse">
          <span className="w-3.5 h-3.5 border-2 border-[#0d631b] dark:border-emerald-400 border-t-transparent rounded-full animate-spin"></span>
          <span>جاري تحميل طلبات الجيران في هذا النطاق...</span>
        </div>
      )}

      {/* Floating Categories & Item Card Bottom Area */}
      <div className="absolute bottom-[96px] left-0 right-0 z-30 pointer-events-none pb-2 flex flex-col gap-4">
        {/* Empty State Overlay */}
        {!isLoading && filteredPosts.length === 0 && (
          <div className="px-4 pointer-events-auto max-w-sm mx-auto w-full">
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-gray-200 dark:border-slate-700 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">travel_explore</span>
              </div>
              <h4 className="font-bold text-sm text-[#181d17] dark:text-white">لم يتم العثور على طلبات مطابقة</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                لا توجد طلبات أو إعارات مسجلة في هذا النطاق أو التصنيف حالياً.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('الكل');
                }}
                className="px-4 py-1.5 bg-[#0d631b] hover:bg-[#155e1f] text-white rounded-xl text-xs font-bold transition-colors"
              >
                عرض كافة طلبات المدينة
              </button>
            </div>
          </div>
        )}

        {/* Selected Item Card Preview */}
        {selectedItem && (
          <div className="px-4 pointer-events-auto max-w-md mx-auto w-full transition-all duration-300 transform translate-y-0">
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.18)] border border-white/60 dark:border-slate-700 flex flex-col gap-3">
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#e5eadf] dark:bg-slate-800 flex-shrink-0 flex items-center justify-center relative overflow-hidden shadow-inner">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform hover:scale-110 duration-500"
                    style={{ backgroundImage: `url(${selectedItem.image})` }}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center relative min-w-0">
                  <button
                    className="absolute left-0 top-0 text-[#707a6c] hover:text-[#ba1a1a] transition-colors p-1 bg-white/60 dark:bg-slate-800 rounded-full"
                    onClick={() => setSelectedItem(null)}
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                  <div className="flex justify-between items-start mb-1 pl-8">
                    <span className="bg-[#cbffc2] dark:bg-emerald-950/60 text-[#005312] dark:text-emerald-300 font-bold text-[11px] px-2.5 py-0.5 rounded-full shadow-2xs">
                      {selectedItem.type === 'loan' ? 'مطلوب للإعارة' : selectedItem.type === 'gift' ? 'مطلوب مساعدة' : 'طلب عاجل'}
                    </span>
                    <span className="font-semibold text-[11px] text-[#707a6c] dark:text-gray-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">near_me</span>
                      {selectedItem.distanceLabel || 'قريب منك'}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#181d17] dark:text-white line-clamp-1 pl-8 mt-0.5 leading-snug">
                    {selectedItem.title}
                  </h3>
                  <p className="font-medium text-xs text-[#40493d] dark:text-gray-300 mt-1 line-clamp-2 leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onSelectItem && onSelectItem(selectedItem)}
                className="w-full py-2.5 bg-[#0d631b] hover:bg-[#155e1f] text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span className="material-symbols-outlined text-base">visibility</span>
                <span>عرض تفاصيل الطلب والمساعدة 🤝</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
