"use client";
import { useState } from "react";
import { updateUser } from "@/src/services/user-service";
import { User } from "@/src/features/admin/types/user";

const getUpdateUserErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }

    return "Unknown update error";
};

export default function EditUserModal({ user, onClose, onUpdated }: {
    user: User;
    onClose: () => void;
    onUpdated: () => void;
}) {
    const [form, setForm] = useState({ ...user });
    const [loading, setLoading] = useState(false);

    const maxBirthday = new Date(
        new Date().setFullYear(new Date().getFullYear() - 10)
    )
        .toISOString()
        .split("T")[0];

    const minBirthday = new Date(
        new Date().setFullYear(new Date().getFullYear() - 150)
    )
        .toISOString()
        .split("T")[0];

    async function handleUpdate() {
        try {
            setLoading(true);
            await updateUser(user.userId, form);
            alert("Updated successfully!");
            onUpdated();
            onClose();
        } catch (err: unknown) {
            alert("Update error: " + getUpdateUserErrorMessage(err));
        } finally {
            setLoading(false);
        }
        console.log("Update user with data:", form);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
            <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
                <div className="mb-2 border-b border-gray-50 pb-0">
                    <h2 className="mt-1 text-lg font-bold text-[#235697]">Edit User</h2>
                    <p className="mt-1 text-sm text-gray-400">Update user details and keep the account record in sync.</p>
                </div>

                <div className="grid grid-cols-1 gap-1 md:grid-cols-2">

                    {/* Name */}
                    <label className="block">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Name
                        </span>

                        <input
                            type="text"
                            value={form.name ?? ""}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-gray-300 focus:border-[#1BA7D9] focus:ring-2 focus:ring-[#1BA7D9]/15"
                        />
                    </label>

                    {/* Phone */}
                    <label className="block">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Phone
                        </span>

                        <input
                            type="text"
                            value={form.phone ?? ""}
                            onChange={(e) =>
                                setForm({ ...form, phone: e.target.value })
                            }
                            className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-gray-300 focus:border-[#1BA7D9] focus:ring-2 focus:ring-[#1BA7D9]/15"
                        />
                    </label>

                    {/* Email */}
                    <label className="block md:col-span-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Email
                        </span>

                        <input
                            type="email"
                            disabled
                            value={form.email ?? ""}
                            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-500 outline-none disabled:cursor-not-allowed disabled:text-slate-400"
                        />
                    </label>

                    {/* Birthday */}
                    <label className="block">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Birthday
                        </span>

                        <input
                            type="date"
                            required
                            min={minBirthday}
                            max={maxBirthday}
                            value={String(form.birthday).split("T")[0]}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    birthday: e.target.value,
                                })
                            }
                            className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#1BA7D9] focus:ring-2 focus:ring-[#1BA7D9]/15"
                        />
                    </label>

                    {/* Role */}
                    <label className="block">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Role
                        </span>

                        <div className="relative mt-2">
                            <select
                                value={form.role}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        role: e.target.value as User["role"],
                                    })
                                }
                                className="
                                        w-full
                                        appearance-none
                                        rounded-2xl
                                        border border-gray-200
                                        bg-white
                                        px-4 py-3 pr-10
                                        text-sm text-slate-700
                                        outline-none
                                        transition-colors
                                        focus:border-[#1BA7D9]
                                        focus:ring-2
                                        focus:ring-[#1BA7D9]/15
                                    ">
                                <option value="Learner">Learner</option>
                                <option value="Expert">Expert</option>
                                <option value="Admin">Admin</option>
                            </select>

                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                <svg
                                    className="h-4 w-4 text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    </label>

                    {/* Status */}
                    <label className="block">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Status
                        </span>

                        <div className="relative mt-2">
                            <select
                                value={form.status}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        status: e.target.value as User["status"],
                                    })
                                }
                                className="
                                    w-full
                                    appearance-none
                                    rounded-2xl
                                    border border-gray-200
                                    bg-white
                                    px-4 py-3 pr-10
                                    text-sm text-slate-700
                                    outline-none
                                    transition-colors
                                    focus:border-[#1BA7D9]
                                    focus:ring-2
                                    focus:ring-[#1BA7D9]/15
                                ">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>

                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                <svg
                                    className="h-4 w-4 text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    </label>

                    {/* Gender */}
                    <label className="block">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Gender
                        </span>

                        <div className="relative mt-2">
                            <select
                                value={form.gender ?? ""}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        gender: e.target.value,
                                    })
                                }
                                className="
                                    w-full
                                    appearance-none
                                    rounded-2xl
                                    border border-gray-200
                                    bg-white
                                    px-4 py-3 pr-10
                                    text-sm text-slate-700
                                    outline-none
                                    transition-colors
                                    focus:border-[#1BA7D9]
                                    focus:ring-2
                                    focus:ring-[#1BA7D9]/15
                                "
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>

                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                <svg
                                    className="h-4 w-4 text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    </label>

                    {/* Address */}
                    <label className="block md:col-span-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Address
                        </span>

                        <textarea
                            rows={1}
                            value={form.address ?? ""}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    address: e.target.value,
                                })
                            }
                            placeholder="Enter address"
                            className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-gray-300 focus:border-[#1BA7D9] focus:ring-2 focus:ring-[#1BA7D9]/15"
                        />
                    </label>

                    {/* Password */}
                    <label className="block md:col-span-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Password
                        </span>

                        <input
                            type="password"
                            placeholder="Leave blank to keep current password"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    password: e.target.value,
                                })
                            }
                            className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-gray-300 focus:border-[#1BA7D9] focus:ring-2 focus:ring-[#1BA7D9]/15"
                        />
                    </label>

                    {/* Created At */}
                    <label className="block">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Created At
                        </span>

                        <input
                            disabled
                            value={new Date(form.createdAt).toLocaleDateString()}
                            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-500 outline-none"
                        />
                    </label>

                    {/* Updated At */}
                    <label className="block">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Updated At
                        </span>

                        <input
                            disabled
                            value={new Date(form.updatedAt).toLocaleDateString()}
                            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-500 outline-none"
                        />
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 sm:justify-end pt-5">
                    <button onClick={onClose} className="flex-1 rounded-2xl border border-gray-200 px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 transition-colors hover:bg-gray-50 sm:flex-none">
                        Cancel
                    </button>

                    <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="flex flex-1 items-center justify-center rounded-2xl bg-[#235697] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#1f4f88] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                    >
                        {loading ? "Updating..." : "OK"}
                    </button>
                </div>
            </div>
        </div>
    );
}