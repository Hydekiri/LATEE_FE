"use client";
import { useEffect, useState } from "react";
import { User } from "@/src/features/admin/types/user";
import EditUserModal from "./EditUserModal";
import { fetchUsers } from "@/src/services/user-service";
import { useRouter } from "next/navigation";
import Image from "next/image";

export const avatarURL = {
    admin: "https://res.cloudinary.com/dwmfmgr4g/image/upload/v1778441062/475px-HCMUT_official_logo_hbw0wv.png",
    expert: "https://res.cloudinary.com/dwmfmgr4g/image/upload/v1778441192/Logo_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_Y_D%C6%B0%E1%BB%A3c_Th%C3%A0nh_ph%E1%BB%91_H%E1%BB%93_Ch%C3%AD_Minh_hrzz38.svg",
    learner: "https://res.cloudinary.com/dwmfmgr4g/image/upload/v1778441441/download_vjfk19.png"
}

export default function UsersTable({
    search,
    role,
    status,
    date,
    refreshKey,
    onRefresh,
    currentPage,
    setCurrentPage
}: {
    search: string;
    role: string;
    status: string;
    date: string,
    refreshKey: number;
    onRefresh: () => void,
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}) {
    const router = useRouter();
    const [users, setUsers] = useState<Array<User> | null>(null);
    const [selected, setSelected] = useState<User | null>(null);

    const USERS_PER_PAGE = 5;

    useEffect(() => {
        fetchUsers().then(async (userList) => {
            if (userList && Array.isArray(userList)) {
                console.log("Fetched users:", userList);
                /// use map and filter to append the users to the state
                setUsers(userList);
            }
        }).catch(err => {
            alert("Error fetching users: " + (err instanceof Error ? err.message : "Unknown error"));
        });
    }, [refreshKey]);

    const filteredUsers = users?.filter((u) => {

        const matchSearch =
            !search ||
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase());

        const matchRole =
            !role || u.role === role;

        const matchStatus =
            !status || u.status === status;

        const matchDate =
            !date ||
            new Date(u.createdAt).toISOString().split("T")[0] === date;

        return (
            matchSearch &&
            matchRole &&
            matchStatus &&
            matchDate
        );
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredUsers?.length, setCurrentPage]);

    const totalPages = Math.ceil(
        (filteredUsers?.length || 0) / USERS_PER_PAGE
    );

    const startIndex = (currentPage - 1) * USERS_PER_PAGE;

    const paginatedUsers = filteredUsers?.slice(
        startIndex,
        startIndex + USERS_PER_PAGE
    );

    // <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
    return (

        <div className="w-full lg:col-span-8">
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-[#235697]">Users</h2>
                    <button
                        onClick={() => { router.push("/admin/users") }}
                        className="text-xs font-bold text-[#1BA7D9] uppercase tracking-wider">View Details</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-[10px] uppercase text-gray-400 border-b border-gray-50">
                            <tr className="text-left text-sm text-gray-600">
                                <th className="p-4 text-left">Email</th>
                                <th className="p-4 text-left">Name</th>
                                <th className="p-4 text-center">Role</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-center">Release Date</th>
                                <th className="p-4 text-right text-transparent">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-50">
                            {paginatedUsers?.map((u) => (
                                <tr key={u.userId} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg" >
                                                <Image src={avatarURL[(u.role === "Admin" ? "admin" : u.role === "Expert" ? "expert" : "learner")] || avatarURL.learner} alt="avatar" width={32} height={32} unoptimized /> </div>
                                            <div>
                                                <p className="font-bold text-slate-700">{u.name}</p>
                                                <p className="text-[10px] text-gray-400 italic">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 font-medium text-slate-600">{u.name}</td>
                                    <td className="py-4 text-center">
                                        <span className="py-4 font-medium text-slate-600">{u.role}</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-white text-sm ${u.status === "active" ? "bg-green-500" : "bg-gray-400"}`}>
                                            {u.status === "active" ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="py-4 text-gray-500 text-slate-600 font-medium text-center">{new Date(u.createdAt).toLocaleDateString()}</td>
                                    {/* <td className="p-4 text-center">
                                        <button
                                            onClick={() => setSelected(u)}
                                            className="text-gray-300 font-bold text-[10px]"
                                        >
                                            Edit
                                        </button>
                                    </td> */}
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-2">
                                            {/* Edit */}
                                            <button
                                                onClick={() => setSelected(u)}
                                                className="
                                                    rounded-xl
                                                    border border-[#1BA7D9]/20
                                                    bg-[#1BA7D9]/10
                                                    px-3 py-1.5
                                                    text-[11px]
                                                    font-semibold
                                                    text-[#1BA7D9]
                                                    transition-all
                                                    hover:bg-[#1BA7D9]
                                                    hover:text-white
                                                "
                                            >
                                                Edit
                                            </button>

                                            {/* Delete */}
                                            <button
                                                onClick={() => {
                                                    // handle delete here
                                                    console.log("Delete user:", u.userId);
                                                }}
                                                className="
                                                    flex items-center justify-center
                                                    rounded-xl
                                                    border border-red-200
                                                    bg-red-50
                                                    p-2
                                                    text-red-500
                                                    transition-all
                                                    hover:bg-red-500
                                                    hover:text-white
                                                "
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    className="h-4 w-4"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M9 3.75A2.25 2.25 0 0111.25 1.5h1.5A2.25 2.25 0 0115 3.75V4.5h3.75a.75.75 0 010 1.5h-.69l-.628 12.041A2.25 2.25 0 0115.188 20.25H8.812a2.25 2.25 0 01-2.244-2.209L5.94 6H5.25a.75.75 0 010-1.5H9v-.75zM10.5 4.5h3v-.75a.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75v.75zm.75 4.5a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0V9zm3 0a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0V9z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 mt-6">

                    <button
                        disabled={currentPage === 1}
                        onClick={() =>
                            setCurrentPage((prev) => prev - 1)
                        }
                        className="
                            px-3 py-1.5
                            rounded-xl
                            border border-gray-200
                            text-sm
                            text-slate-600
                            transition-all
                            hover:bg-slate-50
                            disabled:opacity-40
                            disabled:cursor-not-allowed
                        "
                    >
                        Prev
                    </button>

                    {Array.from(
                        { length: totalPages },
                        (_, i) => i + 1
                    ).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`
                                px-3 py-1.5
                                rounded-xl
                                text-sm
                                transition-all
                                ${currentPage === page
                                    ? "bg-[#235697] text-white"
                                    : "border border-gray-200 text-slate-600 hover:bg-slate-50"}
                            `}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        disabled={
                            currentPage === totalPages ||
                            totalPages === 0
                        }
                        onClick={() =>
                            setCurrentPage((prev) => prev + 1)
                        }
                        className="
                            px-3 py-1.5
                            rounded-xl
                            border border-gray-200
                            text-sm
                            text-slate-600
                            transition-all
                            hover:bg-slate-50
                            disabled:opacity-40
                            disabled:cursor-not-allowed
                        "
                    >
                        Next
                    </button>

                </div>

                {/* Popup */}
                {selected && (console.log("Selected user:", selected), true) && (
                    <EditUserModal
                        user={selected}
                        onClose={() => setSelected(null)}
                        onUpdated={onRefresh}
                    />
                )}
            </div>
        </div>
    );
}
