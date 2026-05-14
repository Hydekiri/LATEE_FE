import UsersTable from "@/src/features/admin/components/UsersTable";
import { useState } from "react";

export default function MainAnalytics() {
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("");
    const [date, setDate] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);
    const refreshUsers = () => {
        setRefreshKey(prev => prev + 1);
    };
    const [currentPage, setCurrentPage] = useState(1);
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <UsersTable
                search={search}
                role={role}
                status={status}
                date={date}
                refreshKey={refreshKey}
                onRefresh={refreshUsers}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />

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