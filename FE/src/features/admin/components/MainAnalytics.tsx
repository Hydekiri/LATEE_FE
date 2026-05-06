import { MoreHorizontal } from "lucide-react";

export default function MainAnalytics() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-[#235697]">Người dùng</h2>
                    <button className="text-xs font-bold text-[#1BA7D9] uppercase tracking-wider">Xem chi tiết</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-[10px] uppercase text-gray-400 border-b border-gray-50">
                            <tr>
                                <th className="pb-4 font-bold">Email người dùng</th>
                                <th className="pb-4 font-bold">Vai trò</th>
                                <th className="pb-4 font-bold">Trạng thái</th>
                                <th className="pb-4 font-bold">Ngày cấp</th>
                                <th className="pb-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[1, 2, 3, 4].map((i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-100" />
                                            <div>
                                                <p className="font-bold text-slate-700">Esthera Jackson</p>
                                                <p className="text-[10px] text-gray-400 italic">esthera@simmmple.com</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 font-medium text-slate-600">Manager</td>
                                    <td className="py-4">
                                        <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-bold">Online</span>
                                    </td>
                                    <td className="py-4 text-gray-500 text-[11px]">14/06/26</td>
                                    <td className="py-4 text-right"><button className="text-gray-300 font-bold text-[10px]">Edit</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="lg:col-span-4 bg-white rounded-3xl p-5 shadow-sm flex flex-col justify-between">
                <div className="h-40 w-full bg-linear-to-r from-[#235697] to-[#1BA7D9] rounded-2xl mb-4" />
                <div>
                    <h3 className="font-bold text-slate-800">Người dùng đang hoạt động</h3>
                    <p className="text-xs text-green-500 font-bold">(+23) <span className="text-gray-400 font-normal italic text-[11px]">than last week</span></p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="border-t pt-2">
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Users</p>
                        <p className="font-bold text-slate-700">32,984</p>
                    </div>
                    <div className="border-t pt-2">
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Clicks</p>
                        <p className="font-bold text-slate-700">2.42m</p>
                    </div>
                </div>
            </div>
        </div>
    );
}