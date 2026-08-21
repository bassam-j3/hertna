const fs = require('fs');

let content = fs.readFileSync('frontend/src/components/AdminDashboardView.tsx', 'utf8');

// Replace standard English comments with Arabic educational ones.
content = content.replace(
  'export default function AdminDashboardView() {',
  '/**\n * لوحة تحكم اللجنة (السرية)\n * \n * هذا المكون مخصص لأعضاء لجنة الحي فقط (Role-Based Access Control).\n * يسمح لهم بإدارة المستخدمين (حظر/إنذار) ومعالجة التذاكر الفنية.\n */\nexport default function AdminDashboardView() {'
);

content = content.replace(
  'const { currentUser, isLoading } = useAuth();',
  'const { currentUser, isLoading } = useAuth(); // سحب معلومات المستخدم الحالي من الكونتكست للتحقق من صلاحياته'
);

content = content.replace(
  'useEffect(() => {\n    if (isLoading) return;\n    if (!currentUser || currentUser.userType !== \'committee\') {\n      navigate(\'/\');\n      return;\n    }\n    fetchData();\n  }, [navigate, fetchData]);',
  '// حماية المسار (Route Guard): إذا لم يكن المستخدم "لجنة"، قم بتوجيهه للصفحة الرئيسية فوراً\n  useEffect(() => {\n    if (isLoading) return;\n    if (!currentUser || currentUser.userType !== \'committee\') {\n      navigate(\'/\');\n      return;\n    }\n    fetchData();\n  }, [navigate, fetchData]);'
);

fs.writeFileSync('frontend/src/components/AdminDashboardView.tsx', content);
console.log('AdminDashboardView.tsx commented');
