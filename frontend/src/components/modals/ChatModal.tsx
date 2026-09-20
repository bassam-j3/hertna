import React, { useState } from 'react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactName: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, contactName }) => {
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    {
      sender: contactName,
      text: `أهلاً بك يا أخي! يسعدني التعاون والتواصل معك في حي الروضة.`,
      time: '10:30 ص'
    },
    {
      sender: 'me',
      text: 'السلام عليكم ورحمة الله، حياك الله أخي.',
      time: '10:32 ص'
    }
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = { sender: 'me', text: input.trim(), time: 'الآن' };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    // Auto reply simulation
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: contactName,
          text: 'تم الاستلام أخي، نتفق على موعد الاستلام والتسليم إن شاء الله.',
          time: 'الآن'
        }
      ]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center rtl" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col overflow-hidden transition-colors bg-white text-[#181d17]"
      >
        {/* Header */}
        <header className="px-4 py-3 bg-[#0d631b] text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-sm border border-white/40">
              {contactName.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-sm">{contactName}</h3>
              <span className="text-[10px] text-emerald-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                متصل الآن بالحي
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/10 p-1.5 rounded-full">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </header>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f7fbf0]">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                m.sender === 'me' ? 'items-start' : 'items-end'
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-2xs ${
                  m.sender === 'me'
                    ? 'bg-[#0d631b] text-white rounded-br-none'
                    : 'bg-white text-[#181d17] border border-[#bfcaba] rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-[#707a6c] mt-1 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#bfcaba]/40 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب رسالتك للجار..."
            className="flex-1 px-4 py-2 bg-[#f1f5eb] border border-[#bfcaba] rounded-xl text-xs sm:text-sm outline-none focus:border-[#0d631b]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#0d631b] text-white font-bold rounded-xl hover:bg-[#2e7d32] transition-colors"
          >
            <span className="material-symbols-outlined text-lg">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
