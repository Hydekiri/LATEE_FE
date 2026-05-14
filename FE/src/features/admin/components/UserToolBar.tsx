"use client";

import { Plus, Search } from "lucide-react";

type Props = {
    search: string;
    setSearch: (v: string) => void;

    role: string;
    setRole: (v: string) => void;

    status: string;
    setStatus: (v: string) => void;

    date: string;
    setDate: (v: string) => void;

    onAddUser: () => void;
};

export default function UsersToolbar({
    search,
    setSearch,
    role,
    setRole,
    status,
    setStatus,
    date,
    setDate,
    onAddUser,
}: Props) {
    return (
        <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">

            {/* LEFT */}
            <div className="flex flex-1 flex-col gap-4 md:flex-row">

                {/* Search */}
                <div className="relative flex-1">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by email or name..."
                        className="
                            w-full rounded-2xl border border-gray-200
                            bg-white py-3 pl-11 pr-4
                            text-sm text-slate-700
                            outline-none transition-colors
                            placeholder:text-gray-300
                            focus:border-[#1BA7D9]
                            focus:ring-2 focus:ring-[#1BA7D9]/15
                        "
                    />
                </div>

                {/* Role */}
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="
                        rounded-2xl border border-gray-200
                        bg-white px-4 py-3
                        text-sm text-slate-700
                        outline-none transition-colors
                        focus:border-[#1BA7D9]
                        focus:ring-2 focus:ring-[#1BA7D9]/15
                    "
                >
                    <option value="">All Roles</option>
                    <option value="Learner">Learner</option>
                    <option value="Expert">Expert</option>
                    <option value="Admin">Admin</option>
                </select>

                {/* Status */}
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="
                        rounded-2xl border border-gray-200
                        bg-white px-4 py-3
                        text-sm text-slate-700
                        outline-none transition-colors
                        focus:border-[#1BA7D9]
                        focus:ring-2 focus:ring-[#1BA7D9]/15
                    "
                >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>

                {/* Date */}
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="
                        rounded-2xl border border-gray-200
                        bg-white px-4 py-3
                        text-sm text-slate-700
                        outline-none transition-colors
                        focus:border-[#1BA7D9]
                        focus:ring-2 focus:ring-[#1BA7D9]/15
                    "
                />
            </div>

            {/* RIGHT */}
            <button
                onClick={onAddUser}
                className="
                    flex items-center justify-center gap-2
                    rounded-2xl bg-[#235697]
                    px-5 py-3
                    text-xs font-bold uppercase tracking-wider text-white
                    shadow-sm transition-all
                    hover:bg-[#1f4f88]
                    hover:shadow-md
                    active:scale-[0.98]
                "
            >
                <Plus size={16} />
                Add User
            </button>
        </div>
    );
}