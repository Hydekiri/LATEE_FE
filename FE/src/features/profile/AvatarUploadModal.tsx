"use client";

import React, { useCallback, useRef, useState } from "react";
import { Loader2, Upload, X, ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { uploadAvatar } from "@/src/services/user-service";

interface AvatarUploadModalProps {
    userId: string;
    currentAvatarUrl?: string;
    onSuccess: (newAvatarUrl: string) => void;
    onClose: () => void;
}

export default function AvatarUploadModal({
    userId,
    currentAvatarUrl,
    onSuccess,
    onClose,
}: AvatarUploadModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const MAX_SIZE_MB = 5;

    const handleFile = (selected: File) => {
        setError(null);
        setSuccess(false);

        if (!selected.type.startsWith("image/")) {
            setError("Only image files are accepted.");
            return;
        }
        if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
            setError(`File must be smaller than ${MAX_SIZE_MB} MB.`);
            return;
        }

        setFile(selected);
        const url = URL.createObjectURL(selected);
        setPreview(url);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) handleFile(selected);
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        const dropped = e.dataTransfer.files?.[0];
        if (dropped) handleFile(dropped);
    }, []);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => setDragging(false);

    const handleSave = async () => {
        if (!file) return;
        try {
            setLoading(true);
            setError(null);
            const newUrl = await uploadAvatar(userId, file);
            setSuccess(true);
            setTimeout(() => {
                onSuccess(newUrl);
                onClose();
            }, 800);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Upload failed. Please try again.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (preview) URL.revokeObjectURL(preview);
        onClose();
    };

    const handleClear = () => {
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        setFile(null);
        setError(null);
        setSuccess(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) handleCancel(); }}
        >
            {/* Modal */}
            <div className="relative w-full max-w-md mx-4 rounded-3xl border border-neutral-200 bg-white shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
                    <div>
                        <h2 className="text-base font-semibold text-neutral-900">Update Avatar</h2>
                        <p className="mt-0.5 text-xs text-neutral-500">JPG, PNG, GIF or WebP · Max {MAX_SIZE_MB} MB</p>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6 space-y-5">
                    {/* Preview / Drop zone */}
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => !preview && fileInputRef.current?.click()}
                        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 transition-all overflow-hidden
                            ${preview ? "border-neutral-200 cursor-default" : "border-dashed cursor-pointer"}
                            ${dragging ? "border-black bg-neutral-50 scale-[1.01]" : preview ? "bg-neutral-50" : "border-neutral-300 bg-neutral-50 hover:border-neutral-400 hover:bg-white"}
                        `}
                        style={{ minHeight: 220 }}
                    >
                        {preview ? (
                            <>
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="h-[220px] w-full object-cover"
                                />
                                {/* Clear button */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleClear(); }}
                                    className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                                {/* Success overlay */}
                                {success && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                        <CheckCircle2 className="h-12 w-12 text-white drop-shadow" />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm">
                                    <ImageIcon className="h-6 w-6 text-neutral-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-700">
                                        Drop image here or{" "}
                                        <span className="text-black underline underline-offset-2">browse</span>
                                    </p>
                                    <p className="mt-1 text-xs text-neutral-400">Drag & drop supported</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Current avatar hint */}
                    {!preview && currentAvatarUrl && (
                        <div className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3">
                            <img
                                src={currentAvatarUrl}
                                alt="Current"
                                className="h-9 w-9 rounded-full object-cover ring-2 ring-neutral-200"
                            />
                            <span className="text-xs text-neutral-500">Current avatar — will be replaced on save</span>
                        </div>
                    )}

                    {/* File info */}
                    {file && !error && !success && (
                        <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5">
                            <Upload className="h-4 w-4 shrink-0 text-neutral-400" />
                            <span className="min-w-0 truncate text-xs text-neutral-600">{file.name}</span>
                            <span className="ml-auto shrink-0 text-xs text-neutral-400">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {error}
                        </div>
                    )}
                </div>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    id="avatar-file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleInputChange}
                />

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-neutral-100 bg-white px-6 py-4">
                    <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="h-10 rounded-xl border border-neutral-200 px-5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!file || loading || success}
                        className="flex h-10 min-w-[110px] items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : success ? (
                            <>
                                <CheckCircle2 className="h-4 w-4" />
                                Saved
                            </>
                        ) : (
                            "Save"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}