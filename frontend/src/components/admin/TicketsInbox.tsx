export default function TicketsInbox({
  tickets,
  resolveTicket,
}: {
  tickets: { id: string, type: string, message: string, status: string, user: { name: string } }[];
  resolveTicket: (id: string) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {tickets.map(ticket => (
        <div key={ticket.id} className="bg-white dark:bg-[#121212] p-5 rounded-2xl shadow-sm border border-[#bfcaba] dark:border-[#333] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="inline-block px-2.5 py-1 bg-gray-100 dark:bg-[#222] text-gray-700 dark:text-gray-300 text-xs font-bold rounded-lg mb-2">
                  {ticket.type}
                </span>
                <h3 className="font-bold text-sm text-[#181d17] dark:text-white">من: {ticket.user?.name || 'مستخدم'}</h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${ticket.status === 'open' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-[#0d631b] dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                {ticket.status === 'open' ? 'مفتوحة' : 'محلولة'}
              </span>
            </div>
            <p className="text-sm text-[#40493d] dark:text-gray-200 bg-[#f8faf7] dark:bg-[#1a1a1a] p-3 rounded-xl border border-gray-100 dark:border-[#222]">
              {ticket.message}
            </p>
          </div>
          {ticket.status === 'open' && (
            <button
              onClick={() => resolveTicket(ticket.id)}
              className="mt-4 w-full py-2 bg-emerald-50 dark:bg-emerald-900/20 text-[#0d631b] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-xl font-bold text-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
            >
              ✅ تحديد كمحلولة
            </button>
          )}
        </div>
      ))}
      {tickets.length === 0 && (
        <div className="col-span-2 text-center p-8 bg-white dark:bg-[#121212] rounded-2xl border border-dashed border-gray-300 dark:border-[#444] text-gray-500 dark:text-gray-400">
          لا توجد تذاكر دعم حالياً
        </div>
      )}
    </div>
  );
}
