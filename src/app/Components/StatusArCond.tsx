'use client';
import React, { useState, useEffect } from 'react';

export default function StatusArCondicionado() {
    const [usuario, setUsuario] = useState({ nome: "Carregando...", email: "..." });
    // Inicializamos o estado tentando ler do localStorage para não resetar ao fechar o popup
    const [status, setStatus] = useState([
        { id: 1, nome: 'Ar 01', ligado: false },
        { id: 2, nome: 'Ar 02', ligado: false },
        { id: 3, nome: 'Ar 03', ligado: false },
    ]);

    useEffect(() => {
        // 1. Carrega dados do usuário
        const dadosSalvos = localStorage.getItem('usuario_air_system');
        if (dadosSalvos) {
            try {
                const userJson = JSON.parse(dadosSalvos);
                setUsuario({
                    nome: userJson.nome || "Usuário Logado",
                    email: userJson.email || "email@nao-encontrado.com"
                });
            } catch (e) {
                setUsuario({ nome: "Erro", email: "erro.sessao@catolica.edu.br" });
            }
        }

        // 2. Carrega o estado dos Ares-Condicionados para não resetar o botão
        const estadoAresSalvo = localStorage.getItem('estado_ares_condicionado');
        if (estadoAresSalvo) {
            try {
                setStatus(JSON.parse(estadoAresSalvo));
            } catch (e) {
                console.error("Erro ao carregar estado dos ares", e);
            }
        }
    }, []);

    const salvarLog = async (arNome: string, acao: string) => {
        try {
            await fetch('/api/Historico', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario: { 
                        nome: usuario.nome, 
                        email: usuario.email 
                    },
                    laboratorio: "Laboratório 01",
                    arCondicionado: { 
                        nome: arNome, 
                        status: acao === 'ligou_ar' ? 'ligado' : 'desligado' 
                    },
                    acao: acao,
                    horario: new Date().toISOString()
                })
            });
        } catch (error) {
            console.error("Erro ao registrar no relatório:", error);
        }
    };

    const toggleStatus = (id: number) => {
        const novoStatus = status.map(ar => {
            if (ar.id === id) {
                const novoEstado = !ar.ligado;
                salvarLog(ar.nome, novoEstado ? 'ligou_ar' : 'desligou_ar');
                return { ...ar, ligado: novoEstado };
            }
            return ar;
        });

        // Atualiza o estado na tela
        setStatus(novoStatus);
        // Salva no localStorage para que, ao reabrir o popup, o botão continue ligado/desligado
        localStorage.setItem('estado_ares_condicionado', JSON.stringify(novoStatus));
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {status.map((ar) => (
                    <div key={ar.id} className="border-2 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-gray-800 text-lg">{ar.nome}</h4>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                ar.ligado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {ar.ligado ? '● LIGADO' : '○ DESLIGADO'}
                            </span>
                        </div>

                        <button
                            onClick={() => toggleStatus(ar.id)}
                            className={`w-full py-3 px-4 rounded-lg font-bold text-sm transition-all shadow-lg active:scale-95 ${
                                ar.ligado
                                    ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-100'
                                    : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-100'
                            }`}
                        >
                            {ar.ligado ? 'DESLIGAR AR' : 'LIGAR AR'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}