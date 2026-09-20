const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/components/ProfileView.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add state variables
const stateBlockToReplace = `const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);`;
const newStateBlock = `const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);\n  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);\n  const [ticketForm, setTicketForm] = useState({ type: 'استفسار عام', message: '' });`;

content = content.replace(stateBlockToReplace, newStateBlock);

// 2. Add button before Logout Button
const logoutButtonMarker = `{/* Logout Button */}`;
const supportTicketButton = `
        {/* Support Ticket Button */}
        <button
          onClick={() => setIsTicketModalOpen(true)}
          className="w-full px-4 py-3.5 text-right flex items-center justify-between hover:bg-[#f1f5eb] dark:hover:bg-[#1a1a1a] transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#0d631b]">mail</span>
            <div>
              <span className="font-bold text-sm text-[#181d17] dark:text-white">تواصل مع اللجنة 📨</span>
              <span className="block text-[11px] text-[#707a6c] dark:text-gray-400">تقديم شكوى، بلاغ، أو اقتراح للجنة الحي</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#707a6c] dark:text-gray-400">chevron_left</span>
        </button>

`;
content = content.replace(logoutButtonMarker, supportTicketButton + logoutButtonMarker);

// 3. Add Modal
const ticketModal = `
      {/* ================= MODAL: SUPPORT TICKET ================= */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center rtl" onClick={() => setIsTicketModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-[#121212] relative flex flex-col overflow-hidden text-[#181d17] dark:text-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#bfcaba] space-y-4">
            <div className="flex items-center justify-between border-b border-[#bfcaba]/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0d631b] text-2xl">mail</span>
                <h3 className="font-bold text-lg text-[#181d17] dark:text-white">تواصل مع اللجنة</h3>
              </div>
              <button
                onClick={() => setIsTicketModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await apiClient.post('/tickets', ticketForm);
                alert('تم إرسال تذكرتك بنجاح!');
                setIsTicketModalOpen(false);
                setTicketForm({ type: 'استفسار عام', message: '' });
              } catch (error) {
                console.error(error);
                alert('حدث خطأ أثناء الإرسال');
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#40493d] dark:text-gray-200 mb-1">نوع التذكرة:</label>
                <select
                  value={ticketForm.type}
                  onChange={(e) => setTicketForm({ ...ticketForm, type: e.target.value })}
                  className="w-full h-11 px-3 text-sm bg-white dark:bg-[#121212] border border-gray-300 rounded-xl outline-none font-bold text-[#181d17] dark:text-white"
                >
                  <option value="استفسار عام">استفسار عام</option>
                  <option value="بلاغ عن غرض أو جار">بلاغ عن غرض أو جار</option>
                  <option value="اقتراح تطويري للمنصة">اقتراح تطويري للمنصة</option>
                  <option value="مشكلة تقنية">مشكلة تقنية</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#40493d] dark:text-gray-200 mb-1">نص الرسالة:</label>
                <textarea
                  required
                  rows={4}
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                  placeholder="اكتب رسالتك للجنة هنا بوضوح..."
                  className="w-full p-3 text-sm bg-white dark:bg-[#121212] border border-gray-300 rounded-xl outline-none resize-none font-medium text-[#181d17] dark:text-white"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#0d631b] hover:bg-[#0a4d15] text-white font-bold text-sm rounded-xl transition-colors"
                >
                  إرسال التذكرة
                </button>
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="px-4 py-3 bg-gray-100 dark:bg-[#222222] hover:bg-gray-200 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-xl"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
`;

const mod5Marker = `{/* ================= CAMERA CAPTURE MODAL ================= */}`;
content = content.replace(mod5Marker, ticketModal + '\n      ' + mod5Marker);

fs.writeFileSync(filePath, content, 'utf8');
console.log('ProfileView.tsx updated with Tickets modal');
