const fs = require('fs');

let c = fs.readFileSync('frontend/src/components/AdminDashboardView.tsx', 'utf8');

if (!c.includes('useAuth')) {
    c = c.replace("import { useAdminData } from '../hooks/useAdminData';", "import { useAdminData } from '../hooks/useAdminData';\nimport { useAuth } from '../contexts/AuthContext';");
}

c = c.replace("const currentUser = JSON.parse(localStorage.getItem('user') || 'null');", "const { currentUser, isLoading } = useAuth();");

c = c.replace("useEffect(() => {\n    if (!currentUser || currentUser.userType !== 'committee') {", "useEffect(() => {\n    if (isLoading) return;\n    if (!currentUser || currentUser.userType !== 'committee') {");

c = c.replace("if (loading) return", "if (loading || isLoading) return");

fs.writeFileSync('frontend/src/components/AdminDashboardView.tsx', c);
console.log('Fixed AdminDashboardView.tsx');
