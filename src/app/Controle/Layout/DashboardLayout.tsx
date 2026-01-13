'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { handleLogout } from '@/src/app/Services/AuthService';
import React, { useState } from 'react';
import Popup from '@/src/app/Components/Popup'; 
import StatusArCondicionado from '@/src/app/Components/StatusArCond';
import OcupacaoRelatorio from '@/src/app/Components/Ocupacao';
// NOVO IMPORT
import ManutencaoGerenciamento from '@/src/app/Components/Manutencao';

// --- Ícones ---
const ComputerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const LabIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
);

const ReportIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

// --- Componentes Auxiliares ---

interface CardRelatorioProps {
    title: string;
    subtitle: string;
    description: string;
    iconPath: React.ReactNode;
    onClick: () => void;
}

const CardRelatorio = ({ title, subtitle, description, iconPath, onClick }: CardRelatorioProps) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
        <div>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-gray-800 text-lg mb-1">{title}</h3>
                    <p className="text-sm text-gray-600">{subtitle}</p>
                </div>
                <div className="text-[#3730A3] bg-indigo-50 p-2 rounded-lg">
                    {iconPath}
                </div>
            </div>
            <p className="text-gray-700 mb-4 text-sm">{description}</p>
        </div>
        <button 
            onClick={onClick}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-[#3730A3] rounded-md hover:bg-[#2d2880] transition-colors"
        >
            Visualizar Detalhes
        </button>
    </div>
);

const BarraItens = ({ children, isActive, onClick }: { children: React.ReactNode, isActive: boolean, onClick: () => void }) => (
    <div
        onClick={onClick}
        role="button"
        className={`flex items-center justify-center p-3 cursor-pointer w-full rounded-md transition-all duration-200
            ${isActive ? 'bg-white shadow-md text-[#3730A3]' : 'text-gray-400 hover:bg-gray-200'}`}
    >
        {children}
    </div>
);

export default function DashboardLayout({ children }: { children?: React.ReactNode }) {
    const router = useRouter();
    const [moduloAtivo, setModuloAtivo] = useState<string | null>(null);
    const [showLabPopup, setShowLabPopup] = useState(false);
    const [showOcupacaoPopup, setShowOcupacaoPopup] = useState(false);
    // ESTADO PARA MANUTENÇÃO
    const [showManutencaoPopup, setShowManutencaoPopup] = useState(false);

    const handleLogoutClick = async () => {
        try {
            await handleLogout();
            router.push('/');
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    const ModuloEmBranco = () => (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
            <h2 className="text-xl font-semibold mb-2">Bem-vindo ao Painel de Controle</h2>
            <p className="text-gray-600">Selecione um módulo na barra lateral para começar.</p>
        </div>
    );

    const ModuloDeControle = () => (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Módulo de Controle</h1>
                <p className="text-gray-600">Gerencie os laboratórios e equipamentos.</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg border-2 border-gray-300 max-w-xs">
                <p className="text-gray-600 text-sm font-medium mb-3">Selecione um laboratório:</p>
                <div
                    onClick={() => setShowLabPopup(true)}
                    className="flex items-center gap-3 p-3 cursor-pointer bg-white rounded-lg border border-gray-300 hover:border-[#3730A3] transition-all group"
                >
                    <div className="text-[#3730A3] group-hover:scale-110 transition-transform"><LabIcon /></div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-[#3730A3]">LAB 1</span>
                </div>
            </div>

            {showLabPopup && (
                <Popup onClose={() => setShowLabPopup(false)} title="Laboratório 1">
                    <StatusArCondicionado />
                </Popup>
            )}
        </>
    );

    const ModuloDeRelatorio = () => (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Módulo de Relatórios</h1>
                <p className="text-gray-600">Visualize relatórios e histórico de manutenção.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <CardRelatorio 
                    title="Relatório de Ocupação"
                    subtitle="Uso dos Laboratórios"
                    description="Registro completo de entradas, saídas e acionamento de equipamentos."
                    iconPath={<ReportIcon />}
                    onClick={() => setShowOcupacaoPopup(true)}
                />

                <CardRelatorio 
                    title="Gestão de Manutenção"
                    subtitle="Preventiva e Corretiva"
                    description="Visualize o histórico de manutenções e registre novos serviços realizados."
                    iconPath={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                    onClick={() => setShowManutencaoPopup(true)}
                />
            </div>

            {/* Popup Ocupação */}
            {showOcupacaoPopup && (
                <Popup onClose={() => setShowOcupacaoPopup(false)} title="Relatório de Ocupação">
                    <OcupacaoRelatorio />
                </Popup>
            )}

            {/* Popup Manutenção */}
            {showManutencaoPopup && (
                <Popup onClose={() => setShowManutencaoPopup(false)} title="Histórico de Manutenção">
                    <ManutencaoGerenciamento />
                </Popup>
            )}
        </>
    );

    return (
        <div className="min-h-screen bg-[#3730A3] p-4 md:p-6">
            <div className="flex flex-col min-h-[calc(100vh-3rem)] bg-[#F3F4F6] rounded-sm overflow-hidden shadow-xl">
                <header className="flex justify-between items-center h-20 border-b-2 border-gray-300 px-6 bg-white">
                    <Image src="/logo-catolica-da-paraiba.png" alt="Logo" width={200} height={50} className="h-10 w-auto object-contain" />
                    <button onClick={handleLogoutClick} className="text-sm font-semibold text-gray-500 hover:text-red-600 flex items-center gap-1">
                        SAIR <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    </button>
                </header>

                <div className="flex flex-1 overflow-hidden">
                    <aside className="w-20 bg-gray-50 border-r border-gray-200 p-2 space-y-4 flex flex-col items-center">
                        <BarraItens isActive={moduloAtivo === 'controle'} onClick={() => setModuloAtivo('controle')}>
                            <ComputerIcon />
                        </BarraItens>
                        <BarraItens isActive={moduloAtivo === 'relatorio'} onClick={() => setModuloAtivo('relatorio')}>
                            <ReportIcon />
                        </BarraItens>
                    </aside>
                    <main className="flex-1 bg-white p-6 overflow-y-auto">
                        {moduloAtivo === null && <ModuloEmBranco />}
                        {moduloAtivo === 'controle' && <ModuloDeControle />}
                        {moduloAtivo === 'relatorio' && <ModuloDeRelatorio />}
                    </main>
                </div>
            </div>
        </div>
    );
}