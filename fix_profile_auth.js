const fs = require('fs');

let c = fs.readFileSync('frontend/src/components/ProfileView.tsx', 'utf8');

if (!c.includes('useAuth')) {
    c = c.replace("import { Rating } from '../types';", "import { Rating } from '../types';\nimport { useAuth } from '../contexts/AuthContext';");
}

c = c.replace('const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);', 'const { logout, setIsLoginModalOpen } = useAuth();\n  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);');

c = c.replace(/onClick=\{onOpenLogin\}/g, 'onClick={() => setIsLoginModalOpen(true)}');

c = c.replace(/localStorage\.removeItem\('token'\);/g, 'logout();\n                  setIsLoginModalOpen(true);');

fs.writeFileSync('frontend/src/components/ProfileView.tsx', c);
console.log('Fixed ProfileView.tsx');
