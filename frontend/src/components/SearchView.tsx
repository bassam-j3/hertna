import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Map, { Marker, NavigationControl, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Post } from '../types';
import { fetchItems } from '../services/itemService';

interface SearchViewProps {
  onSelectItem?: (post: Post) => void;
  onOpenMap?: () => void;
}

/**
 * SearchView Component
 * 
 * Interactive map interface allowing users to explore local items and campaigns 
 * visually via MapLibre GL. Supports clustering, item detail previews, and 
 * category filtering on a dynamic geographical map.
 * 
 * @param {SearchViewProps} props - Event handlers for selecting items or navigating.
 */
const cities = [
  { name: 'دمشق', lat: 33.5138, lng: 36.2765 },
  { name: 'حمص', lat: 34.7324, lng: 36.7137 },
  { name: 'حماة', lat: 35.1318, lng: 36.7578 }
];

export const SearchView: React.FC<SearchViewProps> = ({ onSelectItem = (post) => { }, onOpenMap }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedItem, setSelectedItem] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('الكل');

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
    try {
      const data = await fetchItems(latitude, longitude, 10, 'all');
      const mappedPosts = data.map((item: any, index: number) => ({
        id: item.id,
        type: item.category === 'احتياجات عاجلة' ? 'urgent' : (item.category === 'طلب مساعدة' ? 'gift' : 'loan'),
        title: item.title,
        description: item.description || '',
        category: item.category || 'أخرى',
        maxDays: null,
        image: item.image || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=300&q=80',
        ownerName: item.isAnonymous ? 'مستخدم مستور' : (item.user?.name || 'مستخدم'),
        ownerId: item.userId || 'mock-id',
        ownerAvatar: item.user?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        ownerRating: item.user?.trustPoints || 5.0,
        distanceKm: item.distanceKm || 0.5,
        distanceLabel: 'قريب منك',
        locationName: item.location || selectedCity.name,
        status: 'available',
        dateAdded: new Date(item.createdAt).toLocaleDateString(),
        isAnonymous: item.isAnonymous || false,
        lat: (item.lat || latitude + (Math.random() - 0.5) * 0.02) + (index * 0.00005),
        lng: (item.lng || longitude + (Math.random() - 0.5) * 0.02) + (index * 0.00005),
      }));
      setPosts(mappedPosts);
    } catch (err) {
      console.error(err);
    }
  }, [selectedCity.name]);

  useEffect(() => {
    let lat = selectedCity.lat;
    let lon = selectedCity.lng;

    if (navigator.geolocation && (window.location.hostname === 'localhost' || window.isSecureContext)) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // If we got real location, and we want to use it... 
          // For now, we respect the selected city dropdown, so we only fallback if it's the initial load.
          // Let's just use the selected city center as the user location for demonstration.
          setUserLocation([lat, lon]);
          mapRef.current?.flyTo({ center: [lon, lat], zoom: 14 });
          loadData(lat, lon);
        },
        (error) => {
          console.warn("Geolocation failed, using fallback", error);
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
  }, [posts, searchTerm, activeCategory]);

  /**
   * Renders a custom styled marker pin based on the post category/type.
   * Memoized to prevent heavy re-renders inside the Map loop.
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
    } else if (post.category === 'طعام') {
      iconName = 'restaurant';
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
          onClick={(e) => {
            try {
              handleMarkerClick(post);
            } catch (error) {
              console.error('Error handling marker click:', error);
            }
          }}
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
      {/* Floating Search & Filter Overlay */}
      <div className="absolute top-4 left-4 right-2 z-40 max-w-screen-md mx-auto pointer-events-none flex flex-col gap-3">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => navigate('/')}
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-full text-[#0d631b] dark:text-emerald-400 shadow-[0_4px_24px_0_rgba(0,0,0,0.08)] border border-[#bfcaba] dark:border-slate-700 hover:bg-[#e0e4da] dark:hover:bg-slate-800 transition-colors pointer-events-auto"
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
              {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
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

      {/* Floating Categories & Item Card Bottom Area */}
      <div className="absolute bottom-[96px] left-0 right-0 z-30 pointer-events-none pb-2 flex flex-col gap-4">

        {/* Selected Item Card Preview */}
        {selectedItem && (
          <div className="px-4 pointer-events-auto max-w mx-auto w-full">
            <div
              onClick={() => onSelectItem && onSelectItem(selectedItem)}
              className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] border border-white/40 flex gap-4 items-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#e5eadf] flex-shrink-0 flex items-center justify-center relative overflow-hidden shadow-inner">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform hover:scale-110 duration-500"
                  style={{ backgroundImage: `url(${selectedItem.image})` }}
                />
              </div>
              <div className="flex-1 flex flex-col justify-center relative h-full">
                <button
                  className="absolute left-0 top-0 text-[#707a6c] hover:text-[#ba1a1a] transition-colors p-1 bg-white/50 rounded-full hover:bg-white"
                  onClick={(e) => { e.stopPropagation(); setSelectedItem(null); }}
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
                <div className="flex justify-between items-start mb-1 pl-8">
                  <span className="bg-[#cbffc2] text-[#005312] font-medium text-[12px] px-2.5 py-0.5 rounded-full shadow-sm">
                    {selectedItem.type === 'loan' ? 'مطلوب للإعارة' : selectedItem.type === 'gift' ? 'مطلوب مساعدة' : 'طلب عاجل'}
                  </span>
                  <span className="font-medium text-[12px] text-[#707a6c] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">near_me</span>
                    {selectedItem.distanceLabel || '200 م'}
                  </span>
                </div>
                <h3 className="font-bold text-[16px] sm:text-[18px] text-[#181d17] line-clamp-1 pl-8 leading-tight mt-1">{selectedItem.title}</h3>
                <p className="font-normal text-[13px] sm:text-[14px] text-[#40493d] mt-1 line-clamp-2 pl-6 leading-snug">{selectedItem.description}</p>
              </div>
            </div>
          </div>
        )}


      </div>

    </div>
  );
};



