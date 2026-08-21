const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/profile/EditProfileModal.tsx', 'utf8');
content = content.replace('handleSaveProfile: (e: React.FormEvent) => void;', 'handleSaveProfile: (e: React.FormEvent) => void;\n  startCamera: (facingMode: "user" | "environment") => void;\n  fileInputRef: React.RefObject<HTMLInputElement>;');
content = content.replace('handleSaveProfile\n}:', 'handleSaveProfile,\n  startCamera,\n  fileInputRef\n}:');
fs.writeFileSync('frontend/src/components/profile/EditProfileModal.tsx', content);

let profileContent = fs.readFileSync('frontend/src/components/ProfileView.tsx', 'utf8');
profileContent = profileContent.replace('handleSaveProfile={handleSaveProfile}', 'handleSaveProfile={handleSaveProfile}\n        startCamera={startCamera}\n        fileInputRef={fileInputRef}');
fs.writeFileSync('frontend/src/components/ProfileView.tsx', profileContent);
console.log('Fixed EditProfileModal props');
