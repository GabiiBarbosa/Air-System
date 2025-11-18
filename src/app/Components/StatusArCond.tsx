'use client';
import React from 'react';
import { useRelayControl } from '@/src/app/api/Control';

export default function EstadoArCondicionado() {
    //estado do relé
    const { isOn, loading, error } = useRelayControl();

    //mostra indicador de carregamento
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

    //mensagem de erro
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

    return (
        <div className={`p-4 rounded-md border ${
            isOn 
                ? 'bg-green-50 border-green-200'  // ← VERDE se ligado
                : 'bg-gray-50 border-gray-200'    // ← CINZA se desligado
        }`}>
            <h4 className="font-medium text-gray-700 mb-2">Estado do Ar Condicionado:</h4>
            <div className="flex items-center gap-2">

                <div className={`w-3 h-3 rounded-full ${
                    isOn ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                

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
    );
}