const fs = require('fs');

let content = fs.readFileSync('frontend/src/components/ItemDetailModal.tsx', 'utf8');

// Replace standard English comments with Arabic educational ones.
content = content.replace(
  'const handleChatClick = () => {',
  '// دالة لفتح الدردشة. تتطلب التوقيع على "ميثاق الخصوصية" أولاً إذا كان الطلب طارئاً أو به هوية محمية\n  const handleChatClick = () => {'
);

content = content.replace(
  'const handleAcceptPledge = () => {',
  '// دالة الموافقة على ميثاق الخصوصية (Privacy Pledge) وإتمام طلب المصافحة (Handshake)\n  const handleAcceptPledge = () => {'
);

content = content.replace(
  'const handleSubmit = (e: React.FormEvent) => {',
  '// معالجة الإرسال عند تلبية الطلب (طلب استعارة أو تقديم مساعدة)\n  const handleSubmit = (e: React.FormEvent) => {'
);

content = content.replace(
  '{currentUser?.id !== post.ownerId && (',
  '{/* لا نعرض زر "تلبية الطلب" إذا كان المستخدم الحالي هو نفسه صاحب الطلب */}\n            {currentUser?.id !== post.ownerId && ('
);

fs.writeFileSync('frontend/src/components/ItemDetailModal.tsx', content);
console.log('ItemDetailModal.tsx commented');
