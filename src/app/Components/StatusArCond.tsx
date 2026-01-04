'use client';
import React from 'react';
import { useRelayControl } from '@/src/app/Dispositivo/Control';

export default function EstadoArCondicionado() {
    const { isOn, loading, error, turnOn, turnOff } = useRelayControl();

    // Load
    if (loading) {
        return (
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className="text-gray-600 text-sm">Buscando estado do ar condicionado...</span>
                </div>
            </div>
        );
    }

    // Erro
    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-md border border-red-200">
                <h4 className="font-medium text-red-700 mb-2">Estado do Ar Condicionado:</h4>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-red-700 font-medium">Erro de Conexão</span>
                </div>
                <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
        );
    }

    // Sucesso — exibe estado + botões
    return (
        <div className="space-y-4">

            {/* BLOCO DO ESTADO */}
            <div className={`p-4 rounded-md border ${
                isOn 
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
            }`}>
                <h4 className="font-medium text-gray-700 mb-2">Estado do Ar Condicionado:</h4>

                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                        isOn ? 'bg-green-500' : 'bg-gray-400'
                    }`} />

                    <span className={`font-medium ${
                        isOn ? 'text-green-700' : 'text-gray-600'
                    }`}>
                        {isOn ? 'Ligado' : 'Desligado'}
                    </span>
                </div>

                <p className="text-gray-500 text-xs mt-2">
                    Estado atualizado em tempo real do relé físico
                </p>
            </div>

            {/* BOTÕES DE AÇÃO */}
            <div className="flex justify-end space-x-3">

                {/* DESLIGAR */}
                <button
                    onClick={async () => await turnOff()}
                    disabled={!isOn}
                    className={`
                        px-4 py-2 text-sm font-medium rounded-md transition-colors
                        ${isOn 
                            ? "bg-red-600 text-white hover:bg-red-700" 
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }
                    `}
                >
                    Desligar Ar
                </button>

                {/* LIGAR */}
                <button
                    onClick={async () => await turnOn()}
                    disabled={isOn}
                    className={`
                        px-4 py-2 text-sm font-medium rounded-md transition-colors
                        ${!isOn 
                            ? "bg-green-600 text-white hover:bg-green-700" 
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }
                    `}
                >
                    Ligar Ar
                </button>

            </div>
        </div>
    );
}
