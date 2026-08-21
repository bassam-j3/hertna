const fs = require('fs');
const path = require('path');

const profilePath = path.join(__dirname, 'frontend/src/components/ProfileView.tsx');
let content = fs.readFileSync(profilePath, 'utf8');

const startMarker = '{/* Profile Header Card */}';
const endMarker = '{/* Neighbor Stats Dashboard */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const modalContent = content.substring(startIndex, endIndex);

  // create ProfileHeader.tsx
  const componentContent = `import React from 'react';
import { Rating } from '../../types';

interface ProfileHeaderProps {
  profile: any;
  ratings: Rating[];
  onOpenLogin?: () => void;
  setEditForm: (form: any) => void;
  setIsEditProfileOpen: (open: boolean) => void;
}

export default function ProfileHeader({
  profile,
  ratings,
  onOpenLogin,
  setEditForm,
  setIsEditProfileOpen
}: ProfileHeaderProps) {
  return (
    <>
      ${modalContent}
    </>
  );
}
`;

  const outPath = path.join(__dirname, 'frontend/src/components/profile/ProfileHeader.tsx');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, componentContent, 'utf8');

  // Replace in ProfileView.tsx
  content = content.replace(modalContent, `<ProfileHeader \n        profile={profile}\n        ratings={ratings || []}\n        onOpenLogin={onOpenLogin}\n        setEditForm={setEditForm}\n        setIsEditProfileOpen={setIsEditProfileOpen}\n      />\n      `);
  
  // Add import to top
  content = content.replace('import EditProfileModal', `import ProfileHeader from './profile/ProfileHeader';\nimport EditProfileModal`);

  fs.writeFileSync(profilePath, content, 'utf8');
  console.log('Extracted ProfileHeader successfully');
}
