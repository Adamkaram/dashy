"use client";

import {
    useState,
    useRef,
    useCallback,
    useEffect,
    type DragEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type UploadStatus = "idle" | "dragging" | "uploading";

interface FileUploadProps {
    /** Called when files are successfully selected (after validation) */
    onFilesSelect?: (files: File[]) => void;
    /** Called when an error occurs */
    onError?: (message: string) => void;
    /** Accepted file types (e.g., ["image/png", "image/jpeg"]) */
    acceptedFileTypes?: string[];
    /** Max file size in bytes */
    maxFileSize?: number;
    /** Preview URLs for already-uploaded images */
    previewUrls?: string[];
    /** Called when a preview image is removed */
    onRemovePreview?: (index: number) => void;
    /** Upload simulation delay in ms (0 to disable) */
    uploadDelay?: number;
    /** Additional class name */
    className?: string;
}

const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_STEP_SIZE = 5;

const formatBytes = (bytes: number, decimals = 2): string => {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

// Uploading State Spinner (Gold rings)
const UploadingSpinner = ({ progress }: { progress: number }) => (
    <div className="relative w-10 h-10">
        <svg
            viewBox="0 0 240 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
        >
            <defs>
                <mask id="progress-mask">
                    <rect width="240" height="240" fill="black" />
                    <circle
                        r="120"
                        cx="120"
                        cy="120"
                        fill="white"
                        strokeDasharray={`${(progress / 100) * 754}, 754`}
                        transform="rotate(-90 120 120)"
                    />
                </mask>
            </defs>

            <style>
                {`
                    @keyframes rotate-cw {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes rotate-ccw {
                        from { transform: rotate(360deg); }
                        to { transform: rotate(0deg); }
                    }
                    .g-spin circle {
                        transform-origin: 120px 120px;
                    }
                    .g-spin circle:nth-child(odd) { animation: rotate-cw 6s linear infinite; }
                    .g-spin circle:nth-child(even) { animation: rotate-ccw 6s linear infinite; }
                `}
            </style>

            <g
                className="g-spin"
                strokeWidth="8"
                strokeDasharray="18% 40%"
                mask="url(#progress-mask)"
            >
                <circle r="110" cx="120" cy="120" stroke="#FF6500" opacity="0.9" />
                <circle r="100" cx="120" cy="120" stroke="#FF6500" opacity="0.7" />
                <circle r="90" cx="120" cy="120" stroke="#FF6500" opacity="0.5" />
                <circle r="80" cx="120" cy="120" stroke="#FF6500" opacity="0.3" />
            </g>
        </svg>
    </div>
);

export default function FileUpload({
    onFilesSelect,
    onError,
    acceptedFileTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"],
    maxFileSize = DEFAULT_MAX_FILE_SIZE,
    previewUrls = [],
    onRemovePreview,
    uploadDelay = 1500,
    className,
}: FileUploadProps) {
    const [status, setStatus] = useState<UploadStatus>("idle");
    const [progress, setProgress] = useState(0);
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
        };
    }, []);

    const validateFiles = useCallback(
        (files: FileList | File[]): File[] => {
            const fileArray = Array.from(files);
            const validFiles: File[] = [];

            for (const file of fileArray) {
                if (file.size > maxFileSize) {
                    onError?.(`${file.name} exceeds ${formatBytes(maxFileSize)}`);
                    continue;
                }
                if (acceptedFileTypes.length && !acceptedFileTypes.some(t => file.type.match(t))) {
                    onError?.(`${file.name} is not an accepted file type`);
                    continue;
                }
                validFiles.push(file);
            }
            return validFiles;
        },
        [maxFileSize, acceptedFileTypes, onError]
    );

    const simulateUpload = useCallback(
        (files: File[]) => {
            let currentProgress = 0;
            setStatus("uploading");
            setProgress(0);
            setPendingFiles(files);

            if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);

            uploadIntervalRef.current = setInterval(() => {
                currentProgress += UPLOAD_STEP_SIZE;
                if (currentProgress >= 100) {
                    clearInterval(uploadIntervalRef.current!);
                    setProgress(100);
                    setTimeout(() => {
                        setStatus("idle");
                        setProgress(0);
                        setPendingFiles([]);
                        onFilesSelect?.(files);
                    }, 200);
                } else {
                    setProgress(currentProgress);
                }
            }, uploadDelay / (100 / UPLOAD_STEP_SIZE));
        },
        [uploadDelay, onFilesSelect]
    );

    const handleFiles = useCallback(
        (files: FileList | File[] | null) => {
            if (!files || status === "uploading") return;
            const valid = validateFiles(files);
            if (valid.length > 0) {
                if (uploadDelay > 0) {
                    simulateUpload(valid);
                } else {
                    onFilesSelect?.(valid);
                }
            }
        },
        [validateFiles, onFilesSelect, uploadDelay, simulateUpload, status]
    );

    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (status !== "uploading") setStatus("dragging");
    }, [status]);

    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (status === "dragging") setStatus("idle");
    }, [status]);

    const handleDrop = useCallback(
        (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setStatus("idle");
            handleFiles(e.dataTransfer.files);
        },
        [handleFiles]
    );

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            handleFiles(e.target.files);
            if (e.target) e.target.value = "";
        },
        [handleFiles]
    );

    const triggerInput = useCallback(() => {
        if (status === "uploading") return;
        fileInputRef.current?.click();
    }, [status]);

    const cancelUpload = useCallback(() => {
        if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
        setStatus("idle");
        setProgress(0);
        setPendingFiles([]);
    }, []);

    const hasImages = previewUrls.length > 0;

    return (
        <div className={cn("w-full", className)}>
            {/* Upload Box - Contains both upload area and previews */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "relative rounded-xl overflow-hidden border-2 border-dashed transition-all duration-200 p-3",
                    "bg-gray-50",
                    status === "uploading"
                        ? "border-[#FF6500]"
                        : status === "dragging"
                            ? "border-[#FF6500] bg-[#FF6500]/5"
                            : "border-gray-300 hover:border-[#FF6500]/60"
                )}
            >
                {/* Grid of Previews + Add Button (when images exist) */}
                {hasImages ? (
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                        <AnimatePresence mode="popLayout">
                            {previewUrls.map((url, index) => (
                                <motion.div
                                    key={url}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group"
                                >
                                    <img
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {onRemovePreview && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onRemovePreview(index);
                                            }}
                                            className="absolute top-1 right-1 p-0.5 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white shadow-sm"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                    {index === 0 && (
                                        <span className="absolute bottom-0.5 left-0.5 px-1 py-0.5 text-[8px] font-medium bg-[#FF6500] text-white rounded">
                                            Main
                                        </span>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Add More Button (inside the grid) */}
                        {status === "uploading" ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="aspect-square rounded-lg border-2 border-dashed border-[#FF6500] bg-[#FF6500]/5 flex flex-col items-center justify-center"
                            >
                                <UploadingSpinner progress={progress} />
                                <span className="mt-1 text-[10px] font-medium text-[#FF6500]">
                                    {Math.round(progress)}%
                                </span>
                            </motion.div>
                        ) : (
                            <button
                                type="button"
                                onClick={triggerInput}
                                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-[#FF6500] bg-white hover:bg-[#FF6500]/5 flex flex-col items-center justify-center transition-colors cursor-pointer"
                            >
                                <Plus className="w-5 h-5 text-gray-400" />
                                <span className="mt-1 text-[10px] text-gray-400">Add</span>
                            </button>
                        )}
                    </div>
                ) : (
                    // Empty State (no images yet)
                    <AnimatePresence mode="wait">
                        {status === "uploading" ? (
                            <motion.div
                                key="uploading"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex flex-col items-center justify-center py-6 px-4 text-center"
                            >
                                <UploadingSpinner progress={progress} />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">
                                    Uploading {pendingFiles.length} file{pendingFiles.length > 1 ? "s" : ""}...
                                </h3>
                                <div className="mt-1 flex items-center gap-2 text-xs">
                                    <span className="text-gray-500 truncate max-w-[120px]">
                                        {pendingFiles[0]?.name}
                                    </span>
                                    <span className="font-medium text-[#FF6500]">
                                        {Math.round(progress)}%
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={cancelUpload}
                                    className="mt-3 px-3 py-1 rounded-md bg-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                onClick={triggerInput}
                                className="flex flex-col items-center justify-center py-6 px-4 text-center cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#FF6500]/10 flex items-center justify-center">
                                    <UploadCloud className="w-5 h-5 text-[#FF6500]" />
                                </div>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">
                                    Drop images here
                                </h3>
                                <p className="mt-0.5 text-xs text-gray-500">
                                    or <span className="text-[#FF6500] font-medium">click to browse</span>
                                </p>
                                <p className="mt-1 text-[10px] text-gray-400">
                                    {acceptedFileTypes.map(t => t.split("/")[1]).join(", ").toUpperCase()} • Max {formatBytes(maxFileSize)}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="sr-only"
                    onChange={handleInputChange}
                    accept={acceptedFileTypes.join(",")}
                />
            </div>
        </div>
    );
}

FileUpload.displayName = "FileUpload";
