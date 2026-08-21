const fs = require('fs');
const path = require('path');

const profilePath = path.join(__dirname, 'frontend/src/components/ProfileView.tsx');
let content = fs.readFileSync(profilePath, 'utf8');

const startMarker = '{/* ================= MODAL 1: EDIT PROFILE MODAL ================= */}';
const endMarker = '{/* ================= MODAL 2: LOCATION & RADIUS MODAL ================= */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const modalContent = content.substring(startIndex, endIndex);

  // create EditProfileModal.tsx
  const componentContent = `import React from 'react';
import { SAMPLE_LOCATIONS } from '../../data/constants';

// Assuming AVATAR_PRESETS is needed, we define it here or import it
const AVATAR_PRESETS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCZBLT_yaLwOuRch_thTaTQzGZb37gtyzu-K0GYjqeo4eteM2h2jJ3o6A7aS1eBd50leLwAMCtsoFEKL0YIudXslyY-YAKXQMnoYXe8HpqW-GPtYJtmrTQ34h39gyur_VMoc3vax_btqfZWX0yyNdq4A61neyrSKJerdHZZNEZOzOlUk0LP8F75JSaWe0ZlJqQctHu2k6j32qhB5_2tMQB-RPlAu1iSZEnjRMmZKR4ixvv99ywKDxDt',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
];

interface EditProfileModalProps {
  isEditProfileOpen: boolean;
  setIsEditProfileOpen: (open: boolean) => void;
  editForm: any;
  setEditForm: React.Dispatch<React.SetStateAction<any>>;
  handleSaveProfile: (e: React.FormEvent) => void;
}

export default function EditProfileModal({
  isEditProfileOpen,
  setIsEditProfileOpen,
  editForm,
  setEditForm,
  handleSaveProfile
}: EditProfileModalProps) {
  if (!isEditProfileOpen) return null;

  return (
    <>
      ${modalContent.replace(/\{isEditProfileOpen && \(\s*/, '').replace(/\)\}\s*$/, '')}
    </>
  );
}
`;

  const outPath = path.join(__dirname, 'frontend/src/components/profile/EditProfileModal.tsx');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, componentContent, 'utf8');

  // Replace in ProfileView.tsx
  content = content.replace(modalContent, `<EditProfileModal \n        isEditProfileOpen={isEditProfileOpen}\n        setIsEditProfileOpen={setIsEditProfileOpen}\n        editForm={editForm}\n        setEditForm={setEditForm}\n        handleSaveProfile={handleSaveProfile}\n      />\n      `);
  
  // Add import to top
  content = content.replace('import SupportTicketModal', `import EditProfileModal from './profile/EditProfileModal';\nimport SupportTicketModal`);

  fs.writeFileSync(profilePath, content, 'utf8');
  console.log('Extracted EditProfileModal successfully');
}
