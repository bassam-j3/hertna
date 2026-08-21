const fs = require('fs');

let content = fs.readFileSync('frontend/src/contexts/AuthContext.tsx', 'utf8');

// Replace standard English comments with Arabic educational ones.
content = content.replace(
  'const AuthContext = createContext<AuthContextType>({} as AuthContextType);',
  '// إنشاء سياق المصادقة (AuthContext) لمشاركة بيانات المستخدم الحالي في كل أجزاء التطبيق بدون الحاجة لتمريرها كـ Props\nconst AuthContext = createContext<AuthContextType>({} as AuthContextType);'
);

content = content.replace(
  'const initAuth = async () => {',
  '// عند بداية تحميل التطبيق، نتحقق مما إذا كان هناك رمز دخول (Token) محفوظ لجلب بيانات المستخدم مباشرة\n    const initAuth = async () => {'
);

content = content.replace(
  'const handleUnauthorized = () => {',
  '// الاستماع لحدث انتهاء صلاحية الجلسة (401 Unauthorized) وتسجيل خروج المستخدم تلقائياً\n    const handleUnauthorized = () => {'
);

fs.writeFileSync('frontend/src/contexts/AuthContext.tsx', content);
console.log('AuthContext.tsx commented');
