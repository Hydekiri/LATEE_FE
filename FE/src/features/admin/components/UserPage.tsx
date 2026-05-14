'use client';

import Sidebar from "@/src/features/admin/components/Sidebar";
import Topbar from "@/src/features/admin/components/Topbar";
import { useState } from "react";
import UsersTable from "@/src/features/admin/components/UsersTable";
import UsersToolbar from "@/src/features/admin/components/UserToolBar";
import CreateUserModal from "@/src/features/admin/components/CreateUserModal";

export default function UsersPage({ adminId, adminName, adminAvatarURL }: { adminId: string, adminName: string, adminAvatarURL: string }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("");
    const [date, setDate] = useState("");
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const refreshUsers = () => {
        setRefreshKey(prev => prev + 1);
    };
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <div className="flex min-h-screen bg-[#235697] bg-linear-to-l from-[#235697] to-[#1BA7D9]">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} adminId={adminId} username={adminName} userImgURL={adminAvatarURL} />
                <main className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 flex justify-center">
                    <div className="w-full max-w-7xl">
                        {/* Search bar here */}
                        <UsersToolbar
                            search={search}
                            setSearch={setSearch}
                            role={role}
                            setRole={setRole}
                            status={status}
                            setStatus={setStatus}
                            date={date}
                            setDate={setDate}
                            onAddUser={() => setOpenCreateModal(true)}
                        />

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

                        {openCreateModal && (
                            <CreateUserModal
                                onClose={() => setOpenCreateModal(false)}
                                onCreated={() => {
                                    refreshUsers();
                                    setOpenCreateModal(false);
                                }}
                            />
                        )}
                    </div>
                </main>
            </div>

        </div>
    );
}