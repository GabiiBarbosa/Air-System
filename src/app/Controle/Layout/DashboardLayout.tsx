// app/Controle/Layout/DashboardLayout.tsx

'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 
import { handleLogout } from '@/src/app/Firebase/FirebaseConfig'; 
import React, { useState } from 'react';
import Popup from '@/src/app/Components/Poput';
import StatusArCondicionado from '@/src/app/Components/StatuslArCond';

// --- Ícones ---
const ComputerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1v-3.25H9.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 12V6a2 2 0 00-2-2H8a2 2 0 00-2 2v6m11.5 0a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
);

// --- Ícone do LAB 1
const LabIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
);

// --- Componente da Sidebar ---
interface BarraItensProps {
    children: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}

const BarraItens = ({ children, isActive, onClick }: BarraItensProps) => (
    <div 
        onClick={onClick}
        role="button"
        className={`flex items-center justify-center p-3 cursor-pointer w-full transition-colors duration-200
            ${isActive 
                ? 'bg-white rounded-md shadow-md text-[#3730A3]'
                : 'text-gray-400 hover:bg-gray-200'
            }`
        }
    >
        {children}
    </div>
);

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const router = useRouter();
    const [moduloAtivo, setModuloAtivo] = useState<string | null>('controle');
    const [showLabPopup, setShowLabPopup] = useState(false);

    const handleLogoutClick = async () => {
        try {
            await handleLogout();
            router.push('/');
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
            alert("Erro ao sair.");
        }
    };

    // --- Componentes dos Módulos ---
    const ModuloEmBranco = () => (
        <div className="flex items-center justify-center h-full text-gray-500">
            <p>Selecione um módulo na barra lateral para começar.</p>
        </div>
    );

    const ModuloDeControle = () => (
        <>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Módulo de Controle</h1>
            <div className="p-6 bg-gray-100 rounded-lg border-2 border-gray-300">
                <div className="flex flex-col space-y-3 max-w-xs">
                    <p className="text-gray-600 text-sm font-medium">Selecione um laboratório:</p>
                    
                    <div 
                        onClick={() => setShowLabPopup(true)}
                        className="flex items-center gap-3 p-3 cursor-pointer bg-white rounded-lg border border-gray-300 hover:border-[#3730A3] hover:shadow-sm transition-all duration-200"
                        role="button"
                        title="Laboratório 1"
                    >
                        <div className="text-[#3730A3]">
                            <LabIcon />
                        </div>
                        <span className="text-sm font-medium text-gray-700">LAB 1</span>
                    </div>
                </div>
            </div>

            {/* Popup do LAB 1 */}
            {showLabPopup && (
                <Popup 
                    onClose={() => setShowLabPopup(false)}
                    title="Laboratório 1"
                >
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Informações do Laboratório 1</h3>
                        <StatusArCondicionado />

                        <div className="flex justify-end space-x-3 mt-6">
                            <button 
                                onClick={() => setShowLabPopup(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Fechar
                            </button>
                            <button 
                                onClick={() => {
                                    alert('Ação do Laboratório 1 executada!');
                                    setShowLabPopup(false);
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-[#3730A3] rounded-md hover:bg-[#2a247c] transition-colors"
                            >
                                Executar Ação
                            </button>
                        </div>
                    </div>
                </Popup>
            )}
        </>
    );
    return (
        <div className="min-h-screen bg-[#3730A3] p-6"> 
            <div className="flex flex-col min-h-[calc(100vh-3rem)] bg-[#F3F4F6] rounded-sm"> 
                
                <header className="flex justify-between items-center h-20 border-b-2 border-gray-300 px-6 bg-white">
                    <div className="flex items-center space-x-3">
                        <Image
                            src="/logo-catolica-da-paraiba.png" 
                            alt="Faculdade Católica da Paraíba"
                            width={200} 
                            height={50}
                            className="h-12 w-auto object-contain" 
                        />
                    </div>
                    <button 
                        onClick={handleLogoutClick}
                        className="text-sm font-semibold text-gray-500 hover:text-red-600 transition duration-150 tracking-wider"
                    >
                        LOGOUT
                    </button>
                </header>

                <div className="flex flex-1">
                    
                    <aside className="w-20 bg-gray-100 p-2 space-y-4 flex flex-col items-center">
                        <BarraItens 
                            isActive={moduloAtivo === 'controle'} 
                            onClick={() => setModuloAtivo('controle')} 
                        > 
                            <ComputerIcon />
                        </BarraItens>
                    </aside>
        
                    <main className="flex-1 bg-white p-6">
                        {moduloAtivo === null && <ModuloEmBranco />}
                        {moduloAtivo === 'controle' && <ModuloDeControle />}
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}