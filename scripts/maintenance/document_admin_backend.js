const fs = require('fs');

let content = fs.readFileSync('backend/src/admin/admin.controller.ts', 'utf8');

// Replace standard English comments with Arabic educational ones.
content = content.replace(
  '// Simple guard check inline for demonstration, or we can use a custom guard.\n@Controller(\'admin\')\nexport class AdminController {',
  '/**\n * متحكم الإدارة (Admin Controller)\n * \n * هذا المتحكم محمي بالكامل ويُسمح فقط للجنة الحي (Committee) بالوصول لمساراته.\n * يوفر واجهات برمجية (APIs) لإدارة المستخدمين والتذاكر الفنية.\n */\n@Controller(\'admin\')\nexport class AdminController {'
);

content = content.replace(
  'private checkCommittee(req: any) {',
  '// التحقق من الصلاحيات (Role-Based Access Control): يتم رفض أي طلب لا يحمل رتبة "لجنة"\n  private checkCommittee(req: any) {'
);

fs.writeFileSync('backend/src/admin/admin.controller.ts', content);
console.log('admin.controller.ts commented');
