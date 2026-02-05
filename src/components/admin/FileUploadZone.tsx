import React, { useCallback, useState } from 'react';
import { Upload, Loader } from 'lucide-react';

interface FileUploadZoneProps {
    onFilesUploaded: (urls: string[]) => void;
    accept: string;
    maxFiles: number;
    uploadEndpoint: string;
    label: string;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
    onFilesUploaded,
    accept,
    maxFiles,
    uploadEndpoint,
    label
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const uploadFile = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(uploadEndpoint, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.url;
    };

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files).slice(0, maxFiles);
        setUploading(true);

        try {
            const uploadPromises = fileArray.map(async (file) => {
                setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
                const url = await uploadFile(file);
                setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
                return url;
            });

            const urls = await Promise.all(uploadPromises);
            onFilesUploaded(urls);
            setUploadProgress({});
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error uploading files. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${isDragging
                    ? 'border-ocean-500 bg-ocean-50'
                    : 'border-gray-300 hover:border-ocean-400'
                    } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
                <input
                    type="file"
                    accept={accept}
                    multiple={maxFiles > 1}
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                />

                <div className="flex flex-col items-center gap-3">
                    {uploading ? (
                        <>
                            <Loader className="animate-spin text-ocean-600" size={40} />
                            <p className="text-sm text-gray-600">Uploading...</p>
                        </>
                    ) : (
                        <>
                            <Upload className="text-gray-400" size={40} />
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    Drag and drop files here, or click to select
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Max {maxFiles} file{maxFiles > 1 ? 's' : ''}
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {Object.keys(uploadProgress).length > 0 && (
                    <div className="mt-4 space-y-2">
                        {Object.entries(uploadProgress).map(([filename, progress]) => (
                            <div key={filename} className="text-left">
                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span className="truncate max-w-[200px]">{filename}</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className="bg-ocean-600 h-1.5 rounded-full transition-all"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUploadZone;
