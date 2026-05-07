import React from "react";

const DATA = [
    { name: "Esthera Jackson", email: "esthera@simmmple.com", role: "Manager", org: "Organization", status: "Online", date: "14/06/21" },
    { name: "Alexa Liras", email: "alexa@simmmple.com", role: "Programmer", org: "Developer", status: "Offline", date: "14/06/21" },
    { name: "Laurent Michael", email: "laurent@simmmple.com", role: "Executive", org: "Projects", status: "Online", date: "14/06/21" },
    { name: "Freduardo Hill", email: "freduardo@simmmple.com", role: "Manager", org: "Organization", status: "Online", date: "14/06/21" },
];

export default function LearnerTable() {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="text-[10px] uppercase text-gray-400 font-extrabold tracking-widest border-b border-gray-50 text-left">
                        <th className="pb-4">Email của người dùng</th>
                        <th className="pb-4 text-center">Vai trò</th>
                        <th className="pb-4 text-center">Trạng thái</th>
                        <th className="pb-4 text-center">Ngày cấp phát</th>
                        <th className="pb-4"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {DATA.slice(0, 3).map((user, i) => (
                        <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="py-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg shrink-0 ${i % 2 === 0 ? 'bg-[#4FD1C5]' : 'bg-slate-200'}`} />
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-slate-700 truncate">{user.name}</p>
                                        <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 text-center">
                                <p className="text-xs font-bold text-slate-600">{user.role}</p>
                                <p className="text-[10px] text-gray-400 font-medium">{user.org}</p>
                            </td>
                            <td className="py-4 text-center">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                                    user.status === 'Online' ? 'bg-[#48BB78] text-white' : 'bg-slate-200 text-slate-500'
                                }`}>
                                    {user.status}
                                </span>
                            </td>
                            <td className="py-4 text-center text-[10px] font-bold text-slate-500">{user.date}</td>
                            <td className="py-4 text-right">
                                <button className="text-[10px] font-bold text-gray-400 hover:text-[#1BA7D9] transition-colors">Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}