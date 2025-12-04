'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle } from 'lucide-react';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    required?: boolean;
}

export default function ImageUpload({ value, onChange, label = 'الصورة', required = false }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [preview, setPreview] = useState(value || '');
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync preview with value prop changes
    useEffect(() => {
        setPreview(value || '');
    }, [value]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError('');
        setUploading(true);
        setUploadProgress(0);
        setUploadSuccess(false);

        try {
            // Create preview immediately
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Compress image
            const { compressImage } = await import('@/lib/image-compression');
            const compressedFile = await compressImage(file);

            // Upload using XHR for real progress tracking
            const formData = new FormData();
            formData.append('file', compressedFile);

            const xhr = new XMLHttpRequest();

            const promise = new Promise<{ url: string }>((resolve, reject) => {
                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        const percentComplete = Math.round((event.loaded / event.total) * 100);
                        setUploadProgress(percentComplete);
                    }
                });

                xhr.addEventListener('load', () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            resolve(response);
                        } catch (e) {
                            reject(new Error('Invalid response from server'));
                        }
                    } else {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            reject(new Error(response.error || 'Upload failed'));
                        } catch (e) {
                            reject(new Error('Upload failed'));
                        }
                    }
                });

                xhr.addEventListener('error', () => {
                    reject(new Error('Network error'));
                });

                xhr.open('POST', '/api/admin/upload');
                xhr.send(formData);
            });

            const data = await promise;

            // Complete progress
            setUploadProgress(100);
            setUploadSuccess(true);

            onChange(data.url);
            setPreview(data.url);

            // Remove success indicator after 2 seconds
            setTimeout(() => {
                setUploadSuccess(false);
            }, 2000);
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'فشل في رفع الصورة');
            setPreview('');
            setUploadProgress(0);
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemove = () => {
        setPreview('');
        setUploadProgress(0);
        setUploadSuccess(false);
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 mr-1">*</span>}
            </label>

            {preview ? (
                <div className="relative group">
                    <div
                        className={`relative rounded-lg border-2 overflow-hidden transition-all duration-300 ${uploadSuccess
                            ? 'border-green-500 shadow-lg shadow-green-500/50'
                            : 'border-gray-200'
                            }`}
                    >
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                        />

                        {/* Upload Progress Overlay */}
                        {uploading && (
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                                <div className="w-3/4 bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-[#8F6B43] to-[#53131C] h-full transition-all duration-300 ease-out"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <p className="text-white text-sm font-medium">{uploadProgress}%</p>
                            </div>
                        )}

                        {/* Success Indicator */}
                        {uploadSuccess && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-2 animate-bounce">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleRemove}
                        disabled={uploading}
                        className="absolute top-2 left-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${uploading
                        ? 'border-gray-300 cursor-not-allowed'
                        : 'border-gray-300 cursor-pointer hover:border-[#8F6B43]'
                        }`}
                >
                    <div className="flex flex-col items-center gap-2">
                        {uploading ? (
                            <>
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8F6B43]"></div>
                                <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
                                    <div
                                        className="bg-gradient-to-r from-[#8F6B43] to-[#53131C] h-full rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{uploadProgress}%</p>
                            </>
                        ) : (
                            <>
                                <ImageIcon className="w-12 h-12 text-gray-400" />
                                <p className="text-sm text-gray-600">اضغط لاختيار صورة</p>
                                <p className="text-xs text-gray-500">JPEG, PNG, WebP (حتى 5MB)</p>
                            </>
                        )}
                    </div>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
            />

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
