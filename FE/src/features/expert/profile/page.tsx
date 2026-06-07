"use client";

import { useEffect, useMemo, useState } from "react";
import { Camera, Loader2 } from "lucide-react";

import {
    getUserById,
    updateUser,
} from "@/src/services/user-service";

import {
    ExpertProfile,
    User,
} from "@/src/features/admin/types/user";

import { avatarURL } from "@/src/features/admin/components/UsersTable";
import AvatarUploadModal from "@/src/features/profile/AvatarUploadModal";
import { getCookie } from "@/src/utils/cookies";

const emptyProfile: ExpertProfile = {
    id: "",
    ssn: "",
    bioQoute: "",
    educationDetail: "",
    titlePosition: "",
    expertiseSkill: "",
    socialLink: "",
};

const inputClass =
    "mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-800 outline-none transition-all placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100";

const textareaClass =
    "mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 outline-none transition-all placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100";

const labelClass =
    "text-sm font-medium text-neutral-700";

export default function ExpertProfileFeature() {
    const [form, setForm] = useState<User | null>(null);
    const [originalForm, setOriginalForm] = useState<User | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            try {
                setLoadingUser(true);

                const adminId = getCookie("userId") || "";

                const data = await getUserById(adminId);
                console.log("Fetched expert data:", data);
                const normalizedUser: User = {
                    ...data,
                    profile: data.profile || emptyProfile,

                };

                console.log("Normalized EXPERT data:", normalizedUser);

                setForm(normalizedUser);
                setOriginalForm(normalizedUser);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingUser(false);
            }
        }

        fetchUser();
    }, []);

    const maxBirthday = new Date(
        new Date().setFullYear(
            new Date().getFullYear() - 10
        )
    )
        .toISOString()
        .split("T")[0];

    const minBirthday = new Date(
        new Date().setFullYear(
            new Date().getFullYear() - 150
        )
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
        return (
            JSON.stringify(form) !==
            JSON.stringify(originalForm)
        );
    }, [form, originalForm]);

    async function handleUpdate() {
        if (!form) return;

        try {
            setLoading(true);
            await updateUser(form.userId, form);
            alert("Profile updated successfully.");
            setOriginalForm(form);
        } catch (error) {
            console.error(error);

            alert("Failed to update profile.");
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
                    ...(prev.profile ??
                        emptyProfile),
                    [key]: value,
                },
            };
        });
    };

    if (loadingUser || !form) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f6f8fb]">
                <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-5 py-4 shadow-sm">
                    <Loader2 className="h-5 w-5 animate-spin text-neutral-700" />

                    <span className="text-sm font-medium text-neutral-700">
                        Loading profile...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#f6f8fb]">
            {/* MAIN */}
            <div className="flex min-w-0 flex-1 flex-col h-screen overflow-hidden">
                {/* CONTENT */}
                <main className="flex-1 overflow-y-auto no-scrollbar">
                    <div className="bg-linear-to-r from-[#1ba7d9] to-[#235697] py-6">
                        <div className="mx-auto w-full max-w-6xl">

                            {/* PAGE HEADER */}
                            {/* <div className="mb-8">

                            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
                                My Profile
                            </h1>

                            <p className="mt-2 text-sm text-neutral-500">
                                Manage your personal information and account settings.
                            </p>
                        </div> */}

                            {/* PROFILE CARD */}
                            <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">

                                {/* HEADER */}
                                <div className="border-b border-neutral-200 px-6 py-6 md:px-8">

                                    <div className="flex flex-col gap-5 md:flex-row md:items-center">

                                        {/* AVATAR */}
                                        <div className="relative w-fit">

                                            <img
                                                src={
                                                    form.avatarUrl || avatarFallback
                                                }
                                                alt={form.name}
                                                className="h-[96px] w-[96px] rounded-full object-cover ring-4 ring-neutral-100"
                                            />

                                            <label
                                                onClick={() => setShowAvatarModal(true)}
                                                className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white bg-black text-white shadow-md transition hover:scale-105"
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

                                        {/* INFO */}
                                        <div className="min-w-0 flex-1">

                                            <div className="flex flex-wrap items-center gap-3">

                                                <h2 className="truncate text-2xl font-semibold text-neutral-900">
                                                    {form.name}
                                                </h2>

                                                <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600">
                                                    {form.role}
                                                </span>

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${form.status ===
                                                        "active"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-neutral-100 text-neutral-600"
                                                        }`}
                                                >
                                                    {
                                                        form.status
                                                    }
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm text-neutral-500">
                                                {
                                                    form.email
                                                }
                                            </p>

                                            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                                                <span>
                                                    Created{" "}
                                                    {new Date(
                                                        form.createdAt
                                                    ).toLocaleDateString()}
                                                </span>

                                                <span>
                                                    •
                                                </span>

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

                                {/* BODY */}
                                <div className="space-y-6 px-6 py-6 md:px-8">

                                    {/* PERSONAL */}
                                    <section className="rounded-2xl border border-neutral-200 p-6">

                                        <div className="mb-6">
                                            <h3 className="text-base font-semibold text-neutral-900">
                                                Personal Information
                                            </h3>

                                            <p className="mt-1 text-sm text-neutral-500">
                                                Manage your personal details and contact information.
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
                                                    value={form.name || ""}
                                                    onChange={(e) => setForm({ ...form, name: e.target.value, })}
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
                                                    value={form.phone || ""}
                                                    onChange={(e) => setForm({ ...form, phone: e.target.value, })
                                                    }
                                                    className={
                                                        inputClass
                                                    }
                                                />
                                            </label>

                                            {/* EMAIL */}
                                            <label className="md:col-span-2">
                                                <span className={labelClass}>
                                                    Email
                                                </span>

                                                <input
                                                    disabled
                                                    value={
                                                        form.email ||
                                                        ""
                                                    }
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
                                                    min={
                                                        minBirthday
                                                    }
                                                    max={
                                                        maxBirthday
                                                    }
                                                    value={String(
                                                        form.birthday
                                                    ).split(
                                                        "T"
                                                    )[0]}
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        setForm(
                                                            {
                                                                ...form,
                                                                birthday:
                                                                    e
                                                                        .target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                    className={
                                                        inputClass
                                                    }
                                                />
                                            </label>

                                            {/* GENDER */}
                                            <label>
                                                <span className={labelClass}>
                                                    Gender
                                                </span>

                                                <select
                                                    value={form.gender || ""}
                                                    onChange={(e) =>
                                                        setForm({
                                                            ...form,
                                                            gender: (e.target.value || undefined) as "Male" | "Female" | undefined,
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
                                                    value={
                                                        form.address ||
                                                        ""
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        setForm(
                                                            {
                                                                ...form,
                                                                address:
                                                                    e
                                                                        .target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                    className={
                                                        textareaClass
                                                    }
                                                />
                                            </label>
                                        </div>
                                    </section>

                                    {/* EXPERT PROFILE */}
                                    {form.role ===
                                        "Expert" && (
                                            <section className="rounded-2xl border border-neutral-200 p-6">

                                                <div className="mb-6">
                                                    <h3 className="text-base font-semibold text-neutral-900">
                                                        Expert Profile
                                                    </h3>

                                                    <p className="mt-1 text-sm text-neutral-500">
                                                        Professional information and expertise.
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                                    <label>
                                                        <span className={labelClass}>
                                                            Title / Position
                                                        </span>

                                                        <input
                                                            value={
                                                                form
                                                                    .profile
                                                                    ?.titlePosition ||
                                                                ""
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                setProfileField(
                                                                    "titlePosition",
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            className={
                                                                inputClass
                                                            }
                                                        />
                                                    </label>

                                                    <label>
                                                        <span className={labelClass}>
                                                            Expertise / Skill
                                                        </span>

                                                        <input
                                                            value={
                                                                form
                                                                    .profile
                                                                    ?.expertiseSkill ||
                                                                ""
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                setProfileField(
                                                                    "expertiseSkill",
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            className={
                                                                inputClass
                                                            }
                                                        />
                                                    </label>

                                                    <label className="md:col-span-2">
                                                        <span className={labelClass}>
                                                            Education
                                                        </span>

                                                        <input
                                                            value={
                                                                form
                                                                    .profile
                                                                    ?.educationDetail ||
                                                                ""
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                setProfileField(
                                                                    "educationDetail",
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            className={
                                                                inputClass
                                                            }
                                                        />
                                                    </label>

                                                    <label className="md:col-span-2">
                                                        <span className={labelClass}>
                                                            Bio
                                                        </span>

                                                        <textarea
                                                            rows={4}
                                                            value={form.profile?.bioQoute ?? ""}
                                                            onChange={(e) => setProfileField("bioQoute", e.target.value)}
                                                            className={textareaClass}
                                                        />
                                                    </label>

                                                    <label className="md:col-span-2">
                                                        <span className={labelClass}>
                                                            Social Link
                                                        </span>

                                                        <input
                                                            value={
                                                                form
                                                                    .profile
                                                                    ?.socialLink ||
                                                                ""
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                setProfileField(
                                                                    "socialLink",
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            className={
                                                                inputClass
                                                            }
                                                        />
                                                    </label>
                                                </div>
                                            </section>
                                        )}
                                </div>

                                {/* FOOTER */}
                                <div className="flex items-center justify-end gap-3 border-t border-neutral-200 bg-white px-6 py-5 md:px-8">

                                    <button
                                        disabled={
                                            loading ||
                                            !isChanged
                                        }
                                        onClick={
                                            handleUpdate
                                        }
                                        className="flex h-11 min-w-[150px] items-center justify-center rounded-xl bg-black px-5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
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
                        {showAvatarModal && (
                            <AvatarUploadModal
                                userId={form.userId}
                                currentAvatarUrl={form.avatarUrl}
                                onSuccess={(newUrl) => setForm((prev) => prev ? { ...prev, avatarUrl: newUrl } : prev)}
                                onClose={() => setShowAvatarModal(false)}
                            />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}