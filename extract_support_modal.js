const fs = require('fs');
const path = require('path');

const profilePath = path.join(__dirname, 'frontend/src/components/ProfileView.tsx');
let content = fs.readFileSync(profilePath, 'utf8');

const startMarker = '{/* ================= MODAL: SUPPORT TICKET ================= */}';
const endMarker = '{/* ================= CAMERA CAPTURE MODAL ================= */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const modalContent = content.substring(startIndex, endIndex);

  // create SupportTicketModal.tsx
  const componentContent = `import React from 'react';
import apiClient from '../../services/apiClient';

interface SupportTicketModalProps {
  isTicketModalOpen: boolean;
  setIsTicketModalOpen: (open: boolean) => void;
  ticketForm: { type: string; message: string };
  setTicketForm: React.Dispatch<React.SetStateAction<{ type: string; message: string }>>;
}

export default function SupportTicketModal({
  isTicketModalOpen,
  setIsTicketModalOpen,
  ticketForm,
  setTicketForm
}: SupportTicketModalProps) {
  if (!isTicketModalOpen) return null;

  return (
    <>
      ${modalContent.replace(/\{isTicketModalOpen && \(\s*/, '').replace(/\)\}\s*$/, '')}
    </>
  );
}
`;

  const outPath = path.join(__dirname, 'frontend/src/components/profile/SupportTicketModal.tsx');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, componentContent, 'utf8');

  // Replace in ProfileView.tsx
  content = content.replace(modalContent, `<SupportTicketModal \n        isTicketModalOpen={isTicketModalOpen}\n        setIsTicketModalOpen={setIsTicketModalOpen}\n        ticketForm={ticketForm}\n        setTicketForm={setTicketForm}\n      />\n      `);
  
  // Add import to top
  content = content.replace('import apiClient', `import SupportTicketModal from './profile/SupportTicketModal';\nimport apiClient`);

  fs.writeFileSync(profilePath, content, 'utf8');
  console.log('Extracted SupportTicketModal successfully');
}
