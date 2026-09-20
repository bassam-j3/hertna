const fs = require('fs');

let content = fs.readFileSync('backend/src/auth/auth.service.ts', 'utf8');

// Replace standard English comments with Arabic educational ones.
content = content.replace(
  'export class AuthService {',
  '/**\n * خدمة المصادقة (Auth Service)\n * \n * تدير عمليات التسجيل، تسجيل الدخول، إنشاء رموز التوثيق (JWT Tokens)\n * وتشفير كلمات المرور (Hashing).\n */\nexport class AuthService {'
);

content = content.replace(
  'const email = `${dto.phone}@haretna.com`; // Option 1: dummy email based on phone',
  'const email = `${dto.phone}@haretna.com`; // استخدام رقم الهاتف كمعرف أساسي لإنشاء إيميل وهمي للتعامل مع متطلبات النظام'
);

content = content.replace(
  'const isMatch = await bcrypt.compare(dto.password, user.passwordHash);',
  '// التحقق من مطابقة كلمة المرور المدخلة مع الكلمة المشفرة في قاعدة البيانات\n    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);'
);

fs.writeFileSync('backend/src/auth/auth.service.ts', content);
console.log('auth.service.ts commented');
