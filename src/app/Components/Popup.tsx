'use client';
import React, { useEffect } from 'react';

interface PopupProps {
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

export default function Popup({ onClose, children, title }: PopupProps) {
    // Bloqueia o scroll do fundo ao abrir o popup
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="bg-white p-6 rounded-lg shadow-2xl w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    {title && <h2 className="text-2xl font-bold text-gray-800">{title}</h2>}
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="py-2">{children}</div>
            </div>
        </div>
    );
}