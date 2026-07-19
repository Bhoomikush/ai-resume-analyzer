import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { formatSize } from '../lib/utils'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const [file, setFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selected = acceptedFiles[0] || null;
        setFile(selected);
        onFileSelect?.(selected);
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024;

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: maxFileSize,
    });

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFile(null);
        onFileSelect?.(null);
    };

    return (
        <div className="w-full">
            <div {...getRootProps()} className="focus:outline-none">
                <input {...getInputProps()} />
                {file ? (
                    <div className="uploader-selected-file transition-all duration-200 hover:bg-slate-100/70" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100 flex-shrink-0">
                                <img src="/images/pdf.png" alt="pdf" className="w-6 h-6 object-contain" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                                <p className="text-xs font-medium text-slate-400">{formatSize(file.size)}</p>
                            </div>
                        </div>
                        <button className="p-2 cursor-pointer hover:bg-slate-200/50 rounded-lg transition-colors duration-150" onClick={removeFile}>
                            <img src="/icons/cross.svg" alt="remove" className="w-4 h-4 opacity-60 hover:opacity-100" />
                        </button>
                    </div>
                ) : (
                    <div className="uplader-drag-area group">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                            <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">
                                <span className="font-semibold text-indigo-600 group-hover:text-indigo-700">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-slate-400 mt-1">PDF format (up to {formatSize(maxFileSize)})</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}


export default FileUploader