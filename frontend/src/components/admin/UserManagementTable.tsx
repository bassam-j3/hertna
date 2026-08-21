export default function UserManagementTable({
  users,
  warnUser,
  blockUser,
  activateUser,
  promoteUser,
}: {
  users: { id: string, name: string, phone: string, status: string, warnings: number, userType?: string }[];
  warnUser: (id: string) => void;
  blockUser: (id: string) => void;
  activateUser: (id: string) => void;
  promoteUser: (id: string) => void;
}) {
  return (
    <div className="bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-[#bfcaba] dark:border-[#333] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-[#f1f5eb] dark:bg-[#1a1a1a] border-b border-[#bfcaba] dark:border-[#333]">
            <tr>
              <th className="p-4 font-bold text-[#181d17] dark:text-white">الاسم</th>
              <th className="p-4 font-bold text-[#181d17] dark:text-white">رقم الهاتف</th>
              <th className="p-4 font-bold text-[#181d17] dark:text-white">الحالة</th>
              <th className="p-4 font-bold text-[#181d17] dark:text-white">الإنذارات</th>
              <th className="p-4 font-bold text-[#181d17] dark:text-white text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 dark:border-[#222] last:border-0 hover:bg-gray-50 dark:hover:bg-[#1a1a1a]/50">
                <td className="p-4 text-[#40493d] dark:text-gray-200 font-medium">{user.name}</td>
                <td className="p-4 text-[#40493d] dark:text-gray-200" dir="ltr">{user.phone || '-'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.status === 'blocked' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-[#0d631b] dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                    {user.status === 'blocked' ? 'محظور' : 'نشط'}
                  </span>
                </td>
                <td className="p-4 font-bold text-amber-600 dark:text-amber-500">{user.warnings}</td>
                <td className="p-4 flex gap-2 justify-center">
                  <button onClick={() => warnUser(user.id)} className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg text-xs font-bold hover:bg-amber-200 dark:hover:bg-amber-900/50">⚠️ إنذار</button>
                  {user.status === 'active' ? (
                    <button onClick={() => blockUser(user.id)} className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-xs font-bold hover:bg-red-200 dark:hover:bg-red-900/50">🚫 حظر</button>
                  ) : (
                    <button onClick={() => activateUser(user.id)} className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-[#0d631b] dark:text-emerald-400 rounded-lg text-xs font-bold hover:bg-emerald-200 dark:hover:bg-emerald-900/50">✅ تفعيل</button>
                  )}
                  {user.userType !== 'committee' && (
                    <button onClick={() => promoteUser(user.id)} className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-xs font-bold hover:bg-purple-200 dark:hover:bg-purple-900/50">👑 ترقية لمدير</button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400">لا يوجد مستخدمين</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
