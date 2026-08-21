const fs = require('fs');

let content = fs.readFileSync('frontend/src/components/HomeFeed.tsx', 'utf8');

// Replace standard English comments with Arabic educational ones.
content = content.replace(
  '/**\n * HomeFeed Component\n * \n * Core dashboard view displaying local community posts (loans, gifts, urgent needs)\n * and community initiatives. It uses geolocation to sort items by proximity and\n * allows users to filter by category and radius.\n * \n * @param {HomeFeedProps} props - Component properties for handling interactions.\n */',
  '/**\n * المكون الرئيسي (HomeFeed)\n * \n * هذا المكون هو واجهة المستخدم الرئيسية التي تعرض طلبات الجيران (إعارة، تبرع، حالات طارئة)\n * والمبادرات المجتمعية. يستخدم الـ Geolocation لحساب المسافات وتصفية الطلبات.\n */'
);

content = content.replace(
  '/**\n   * Fetches posts from the backend based on user location, radius, and category.\n   * Memoized to prevent unnecessary re-creations across renders.\n   */',
  '/**\n   * جلب البيانات من الخادم (Backend) بناءً على موقع المستخدم، نطاق البحث، والتصنيف المختار.\n   * استخدام useCallback يمنع إعادة إنشاء الدالة مع كل تحديث للواجهة (Performance optimization).\n   */'
);

content = content.replace(
  '// Filter posts by selected radius and category (Memoized to avoid layout thrashing)',
  '// تصفية المنشورات محلياً لتجنب البطء، مع استخدام useMemo لتحسين الأداء'
);

content = content.replace(
  '// Handlers for specific post interaction types',
  '// دوال للتعامل مع النقرات على الأنواع المختلفة من الطلبات (إعارة، عاجل، تبرع)'
);

fs.writeFileSync('frontend/src/components/HomeFeed.tsx', content);
console.log('HomeFeed.tsx commented');
