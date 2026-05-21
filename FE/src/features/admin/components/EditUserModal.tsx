"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Camera } from "lucide-react";

import { getUserById, updateUser } from "@/src/services/user-service";
import { User } from "@/src/features/admin/types/user";
import { avatarURL } from "@/src/features/admin/components/UsersTable";
import { ExpertProfile } from "@/src/features/admin/types/user";

const getUpdateUserErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }

    return "Unknown update error";
};

const emptyProfile: ExpertProfile = {
    eid: "",
    ssn: "",
    bio_quote: "",
    education_detail: "",
    title_position: "",
    expertise_skill: "",
    social_link: "",
};

const inputClass =
    "mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-800 outline-none transition-all placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100";

const textareaClass =
    "mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 outline-none transition-all placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100";

const labelClass = "text-sm font-medium text-neutral-700";

export default function EditUserModal({
    user,
    onClose,
    onUpdated,
}: {
    user: User;
    onClose: () => void;
    onUpdated: () => void;
}) {
    const [form, setForm] = useState<User | null>(null);
    const [originalForm, setOriginalForm] = useState<User | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            try {
                setLoadingUser(true);

                const data = await getUserById(user.userId);
                console.log("[INFO] SELECT USER:", data);
                const normalizedUser: User = {
                    ...data,
                    profile: data.profile ? {
                        eid: data.profile.id,
                        ssn: data.profile.ssn,
                        bio_quote: data.profile.bioQoute,
                        education_detail: data.profile.educationDetail,
                        title_position: data.profile.titlePosition,
                        expertise_skill: data.profile.expertiseSkill,
                        social_link: data.profile.socialLink,
                    } : emptyProfile
                };

                setForm(normalizedUser);
                setOriginalForm(normalizedUser);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingUser(false);
            }
        }

        fetchUser();
    }, [user.userId]);

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

    const avatarFallback = useMemo(() => {
        if (!form) return avatarURL.learner;

        switch (form.role) {
            case "Learner":
                return avatarURL.learner;

            case "Expert":
                return avatarURL.expert;

            case "Admin":
                return avatarURL.admin;

            default:
                return avatarURL.learner;
        }
    }, [form]);

    const isChanged = useMemo(() => {
        return JSON.stringify(form) !== JSON.stringify(originalForm);
    }, [form, originalForm]);

    async function handleUpdate() {
        if (!form) return;
        if (!form.gender) {
            alert("Gender cant be empty");
            return;
        }

        try {
            setLoading(true);

            await updateUser(user.userId, form);

            alert("Updated successfully!");

            onUpdated();
            onClose();
        } catch (err: unknown) {
            alert(
                "Update error: " +
                getUpdateUserErrorMessage(err)
            );
        } finally {
            setLoading(false);
        }
    }

    const setProfileField = (
        key: keyof ExpertProfile,
        value: string
    ) => {
        setForm((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                profile: {
                    ...(prev.profile ?? emptyProfile),
                    [key]: value,
                },
            };
        });
    };

    if (loadingUser || !form) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-xl">
                    <Loader2 className="h-5 w-5 animate-spin text-neutral-700" />

                    <span className="text-sm font-medium text-neutral-700">
                        Loading user...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
            <div className="flex min-h-screen items-center justify-center p-4 md:p-6">
                <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl">

                    {/* HEADER */}
                    <div className="border-b border-neutral-200 px-6 py-6 md:px-8">

                        <div className="flex flex-col gap-5 md:flex-row md:items-center">

                            {/* AVATAR */}
                            <div className="relative w-fit">
                                <img
                                    src={
                                        form.avatar_url ||
                                        avatarFallback
                                    }
                                    alt={form.name}
                                    width={88}
                                    height={88}
                                    className="h-[88px] w-[88px] rounded-full object-cover ring-4 ring-neutral-100"
                                />

                                <label
                                    htmlFor="avatar-upload"
                                    className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white bg-black text-white shadow-md transition hover:scale-105"
                                >
                                    <Camera className="h-4 w-4" />
                                </label>

                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>

                            {/* USER INFO */}
                            <div className="min-w-0 flex-1">

                                <div className="flex flex-wrap items-center gap-3">
                                    <h2 className="truncate text-2xl font-semibold text-neutral-900">
                                        {form.name}
                                    </h2>

                                    <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600">
                                        {form.role}
                                    </span>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${form.status === "active"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-neutral-100 text-neutral-600"
                                            }`}
                                    >
                                        {form.status.slice(0, 1).toUpperCase() + form.status.slice(1)}
                                    </span>
                                </div>

                                <p className="mt-2 text-sm text-neutral-500">
                                    {form.email}
                                </p>

                                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                                    <span>
                                        Created{" "}
                                        {new Date(
                                            form.createdAt
                                        ).toLocaleDateString()}
                                    </span>

                                    <span>•</span>

                                    <span>
                                        Updated{" "}
                                        {new Date(
                                            form.updatedAt
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8">

                        <div className="space-y-6">

                            {/* PERSONAL INFO */}
                            <section className="rounded-2xl border border-neutral-200 bg-white p-6">

                                <div className="mb-6">
                                    <h3 className="text-base font-semibold text-neutral-900">
                                        Personal Information
                                    </h3>

                                    <p className="mt-1 text-sm text-neutral-500">
                                        Manage personal details and contact information.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                    {/* NAME */}
                                    <label>
                                        <span className={labelClass}>
                                            Name
                                        </span>

                                        <input
                                            type="text"
                                            value={form.name ?? ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    name: e.target.value,
                                                })
                                            }
                                            className={inputClass}
                                        />
                                    </label>

                                    {/* PHONE */}
                                    <label>
                                        <span className={labelClass}>
                                            Phone
                                        </span>

                                        <input
                                            type="text"
                                            value={form.phone ?? ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    phone: e.target.value,
                                                })
                                            }
                                            className={inputClass}
                                        />
                                    </label>

                                    {/* EMAIL */}
                                    <label className="md:col-span-2">
                                        <span className={labelClass}>
                                            Email
                                        </span>

                                        <input
                                            disabled
                                            value={form.email ?? ""}
                                            className={`${inputClass} cursor-not-allowed bg-neutral-100 text-neutral-500`}
                                        />
                                    </label>

                                    {/* BIRTHDAY */}
                                    <label>
                                        <span className={labelClass}>
                                            Birthday
                                        </span>

                                        <input
                                            type="date"
                                            min={minBirthday}
                                            max={maxBirthday}
                                            value={String(
                                                form.birthday
                                            ).split("T")[0]}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    birthday:
                                                        e.target.value,
                                                })
                                            }
                                            className={inputClass}
                                        />
                                    </label>

                                    {/* GENDER */}
                                    <label>
                                        <span className={labelClass}>
                                            Gender
                                        </span>

                                        <select
                                            value={form.gender ?? ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    gender: e.target.value as User["gender"],
                                                })
                                            }
                                            className={inputClass}
                                        >
                                            <option value="">
                                                Select gender
                                            </option>

                                            <option value="Male">
                                                Male
                                            </option>

                                            <option value="Female">
                                                Female
                                            </option>
                                        </select>
                                    </label>

                                    {/* ADDRESS */}
                                    <label className="md:col-span-2">
                                        <span className={labelClass}>
                                            Address
                                        </span>

                                        <textarea
                                            rows={3}
                                            value={form.address ?? ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    address:
                                                        e.target.value,
                                                })
                                            }
                                            placeholder="Enter address"
                                            className={textareaClass}
                                        />
                                    </label>
                                </div>
                            </section>

                            {/* ACCOUNT INFO */}
                            <section className="rounded-2xl border border-neutral-200 bg-white p-6">

                                <div className="mb-6">
                                    <h3 className="text-base font-semibold text-neutral-900">
                                        Account Settings
                                    </h3>

                                    <p className="mt-1 text-sm text-neutral-500">
                                        Manage role, status and security settings.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                    {/* ROLE */}
                                    <label>
                                        <span className={labelClass}>
                                            Role
                                        </span>

                                        <select
                                            disabled
                                            value={form.role}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    role: e.target
                                                        .value as User["role"],
                                                })
                                            }
                                            className={`${inputClass} cursor-not-allowed bg-neutral-100 text-neutral-500`}
                                        >
                                            <option value="Learner">
                                                Learner
                                            </option>

                                            <option value="Expert">
                                                Expert
                                            </option>

                                            <option value="Admin">
                                                Admin
                                            </option>
                                        </select>
                                    </label>

                                    {/* STATUS */}
                                    <label>
                                        <span className={labelClass}>
                                            Status
                                        </span>

                                        <select
                                            value={form.status}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    status: e.target
                                                        .value as User["status"],
                                                })
                                            }
                                            className={inputClass}
                                        >
                                            <option value="active">
                                                Active
                                            </option>

                                            <option value="inactive">
                                                Inactive
                                            </option>
                                        </select>
                                    </label>

                                    {/* PASSWORD */}
                                    <label className="md:col-span-2">
                                        <span className={labelClass}>
                                            Password
                                        </span>

                                        <input
                                            type="password"
                                            placeholder="Leave blank to keep current password"
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    password:
                                                        e.target.value,
                                                })
                                            }
                                            className={inputClass}
                                        />
                                    </label>
                                </div>
                            </section>

                            {/* EXPERT PROFILE */}
                            {form.role === "Expert" && (
                                <section className="rounded-2xl border border-neutral-200 bg-white p-6">

                                    <div className="mb-6">
                                        <h3 className="text-base font-semibold text-neutral-900">
                                            Expert Profile
                                        </h3>

                                        <p className="mt-1 text-sm text-neutral-500">
                                            Additional professional information for experts.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                        {/* TITLE */}
                                        <label>
                                            <span className={labelClass}>
                                                Title / Position
                                            </span>

                                            <input
                                                value={
                                                    form.profile?.title_position ?? ""
                                                }
                                                onChange={(e) =>
                                                    setProfileField(
                                                        "title_position",
                                                        e.target.value
                                                    )
                                                }
                                                className={inputClass}
                                            />
                                        </label>

                                        {/* SKILL */}
                                        <label>
                                            <span className={labelClass}>
                                                Expertise / Skill
                                            </span>

                                            <input
                                                value={
                                                    form.profile?.expertise_skill ?? ""
                                                }
                                                onChange={(e) =>
                                                    setProfileField(
                                                        "expertise_skill",
                                                        e.target.value
                                                    )
                                                }
                                                className={inputClass}
                                            />
                                        </label>

                                        {/* EDUCATION */}
                                        <label className="md:col-span-2">
                                            <span className={labelClass}>
                                                Education
                                            </span>

                                            <input
                                                value={
                                                    form.profile
                                                        ?.education_detail ?? ""
                                                }
                                                onChange={(e) =>
                                                    setProfileField(
                                                        "education_detail",
                                                        e.target.value
                                                    )
                                                }
                                                className={inputClass}
                                            />
                                        </label>

                                        {/* BIO */}
                                        <label className="md:col-span-2">
                                            <span className={labelClass}>
                                                Bio
                                            </span>

                                            <textarea
                                                rows={4}
                                                value={
                                                    form.profile
                                                        ?.bio_quote ?? ""
                                                }
                                                onChange={(e) =>
                                                    setProfileField(
                                                        "bio_quote",
                                                        e.target.value
                                                    )
                                                }
                                                className={textareaClass}
                                            />
                                        </label>

                                        {/* SOCIAL */}
                                        <label className="md:col-span-2">
                                            <span className={labelClass}>
                                                Social Link
                                            </span>

                                            <input
                                                value={
                                                    form.profile
                                                        ?.social_link ?? ""
                                                }
                                                onChange={(e) =>
                                                    setProfileField(
                                                        "social_link",
                                                        e.target.value
                                                    )
                                                }
                                                className={inputClass}
                                            />
                                        </label>
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-neutral-200 bg-white px-6 py-5 md:px-8">

                        <button
                            onClick={onClose}
                            className="h-11 rounded-xl border border-neutral-200 px-5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleUpdate}
                            disabled={loading || !isChanged}
                            className="flex h-11 min-w-[140px] items-center justify-center rounded-xl bg-[#1BA7D9] px-5 text-sm font-medium text-white transition hover:bg-[#1585b0] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}