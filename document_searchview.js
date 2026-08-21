const fs = require('fs');

let content = fs.readFileSync('frontend/src/components/SearchView.tsx', 'utf8');

// Replace standard English comments with Arabic educational ones.
content = content.replace(
  '/**\n * SearchView Component\n * \n * A full-screen map view for discovering community needs and items.\n * Integrates MapLibre GL for rendering and provides location-based\n * category filtering on a dynamic geographical map.\n * \n * @param {SearchViewProps} props - Component properties for handling interactions.\n */',
  '/**\n * مكون خريطة البحث (SearchView)\n * \n * يعرض خريطة تفاعلية (MapLibre GL) لتسهيل استكشاف الطلبات والمبادرات جغرافياً.\n * يتضمن فلاتر (Filters) للبحث حسب الفئة أو تغيير المدينة (دمشق، حمص، حماة).\n */'
);

content = content.replace(
  '// State for map viewport',
  '// حالة التحكم بموقع التكبير وتوجيه الخريطة (Longitude, Latitude, Zoom)'
);

content = content.replace(
  '// Memoized post filtering to optimize performance during map interactions',
  '// تصفية الطلبات (Memoized) لمنع إعادة حسابها مع كل تحريك للخريطة (لتحسين الأداء)'
);

content = content.replace(
  '// Add click handler to markers for selecting posts',
  '// دالة للتعامل مع النقر على الدبابيس (Markers) لفتح تفاصيل الطلب'
);

fs.writeFileSync('frontend/src/components/SearchView.tsx', content);
console.log('SearchView.tsx commented');
