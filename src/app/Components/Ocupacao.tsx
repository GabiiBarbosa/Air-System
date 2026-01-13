// src/app/Components/Ocupacao.tsx
'use client';

import { useEffect, useState } from 'react';

export interface RegistroOcupacao {
    _id: string;
    horario: string;
    usuario: {
        nome: string;
        email: string;
    };
    laboratorio: string;
    arCondicionado: {
        nome: string;
        id: string;
        status: 'ligado' | 'desligado';
        temperatura?: number;
    };
    acao: 'entrada' | 'saida' | 'ligou_ar' | 'desligou_ar' | 'alterou_temperatura';
}

interface OcupacaoRelatorioProps {
    filtros?: {
        dataInicio?: string;
        dataFim?: string;
        laboratorio?: string;
        usuario?: string;
    };
}

export default function OcupacaoRelatorio({ filtros }: OcupacaoRelatorioProps) {
    const [historico, setHistorico] = useState<RegistroOcupacao[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Estado para os valores que ESTÃO SENDO DIGITADOS (não disparam busca)
    const [searchTerm, setSearchTerm] = useState(filtros?.usuario || '');
    
    // Estado para os filtros QUE JÁ FORAM APLICADOS (esses disparam a busca)
    const [filtrosAtuais, setFiltrosAtuais] = useState({
        dataInicio: filtros?.dataInicio || '',
        dataFim: filtros?.dataFim || '',
        laboratorio: filtros?.laboratorio || 'todos',
        usuario: filtros?.usuario || '',
    });

    const buscarHistorico = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filtrosAtuais.dataInicio) params.append('dataInicio', filtrosAtuais.dataInicio);
            if (filtrosAtuais.dataFim) params.append('dataFim', filtrosAtuais.dataFim);
            if (filtrosAtuais.laboratorio !== 'todos') params.append('laboratorio', filtrosAtuais.laboratorio);
            if (filtrosAtuais.usuario) params.append('usuario', filtrosAtuais.usuario);

            const response = await fetch(`/api/Historico?${params.toString()}`);
            const data = await response.json();
            setHistorico(data);
        } catch (error) {
            console.error('Erro ao buscar histórico:', error);
        } finally {
            setLoading(false);
        }
    };

    // Dispara a busca sempre que os filtros oficiais mudarem
    useEffect(() => {
        buscarHistorico();
    }, [filtrosAtuais]);

    const handleAplicarFiltros = () => {
        setFiltrosAtuais(prev => ({
            ...prev,
            usuario: searchTerm // Aqui o valor digitado vira filtro oficial
        }));
    };

    const handleLimparFiltros = () => {
        setSearchTerm('');
        setFiltrosAtuais({
            dataInicio: '',
            dataFim: '',
            laboratorio: 'todos',
            usuario: '',
        });
    };

    const formatarData = (data: string) => {
        return new Date(data).toLocaleString('pt-BR');
    };

    const getStatusColor = (acao: string) => {
        switch (acao) {
            case 'entrada':
            case 'ligou_ar':
            case 'alterou_temperatura':
                return 'bg-green-100 text-green-800';
            case 'saida':
            case 'desligou_ar':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getAcaoTexto = (acao: string) => {
        switch (acao) {
            case 'entrada': return 'Entrou no laboratório';
            case 'saida': return 'Saiu do laboratório';
            case 'ligou_ar': return 'Ligou ar-condicionado';
            case 'desligou_ar': return 'Desligou ar-condicionado';
            case 'alterou_temperatura': return 'Alterou temperatura';
            default: return acao;
        }
    };

    const exportarParaCSV = () => {
        if (historico.length === 0) return;
        const csv = historico.map(r => ({
            Data: formatarData(r.horario),
            Usuário: r.usuario.nome,
            Email: r.usuario.email,
            Laboratório: r.laboratorio,
            'Ar-Condicionado': r.arCondicionado.nome,
            Ação: getAcaoTexto(r.acao),
            Status: r.arCondicionado.status,
            Temperatura: r.arCondicionado.temperatura || 'N/A'
        }));

        const csvContent = "data:text/csv;charset=utf-8,"
            + [Object.keys(csv[0]).join(",")]
                .concat(csv.map(r => Object.values(r).join(",")))
                .join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `historico_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            {/* Filtros */}
            <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                <h3 className="font-medium text-gray-800 mb-4">Filtrar Histórico</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                        <input
                            type="date"
                            value={filtrosAtuais.dataInicio}
                            onChange={(e) => setFiltrosAtuais({ ...filtrosAtuais, dataInicio: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
                        <input
                            type="date"
                            value={filtrosAtuais.dataFim}
                            onChange={(e) => setFiltrosAtuais({ ...filtrosAtuais, dataFim: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Laboratório</label>
                        <select
                            value={filtrosAtuais.laboratorio}
                            onChange={(e) => setFiltrosAtuais({ ...filtrosAtuais, laboratorio: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        >
                            <option value="todos">Todos</option>
                            <option value="lab1">LAB 1</option>
                            <option value="lab2">LAB 2</option>
                            <option value="lab3">LAB 3</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
                        <input
                            type="text"
                            placeholder="Buscar por nome..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAplicarFiltros()}
                            className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        />
                    </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={handleLimparFiltros}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                        Limpar Filtros
                    </button>
                    <button
                        onClick={handleAplicarFiltros}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#3730A3] rounded-md hover:bg-[#2d2880]"
                    >
                        Aplicar Filtros
                    </button>
                </div>
            </div>

            {/* Tabela de Histórico */}
            <div className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Histórico de Ocupação</h2>
                        <p className="text-sm text-gray-600">Registro completo de atividades</p>
                    </div>
                    {historico.length > 0 && (
                        <button
                            onClick={exportarParaCSV}
                            className="px-4 py-2 text-sm font-medium text-[#3730A3] bg-white border border-[#3730A3] rounded-md hover:bg-[#3730A3] hover:text-white transition"
                        >
                            Exportar CSV
                        </button>
                    )}
                </div>

                {/* Altura mínima para evitar que o popup "encolha" durante o loading */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase">Data/Hora</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase">Usuário</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase">Laboratório</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase">Ar</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase">Ação</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3730A3]"></div>
                                            <span className="text-gray-500 text-sm">Atualizando dados...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : historico.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-gray-500">
                                        Nenhum registro encontrado
                                    </td>
                                </tr>
                            ) : (
                                historico.map((registro) => (
                                    <tr key={registro._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatarData(registro.horario)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{registro.usuario.nome}</div>
                                            <div className="text-sm text-gray-500">{registro.usuario.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {registro.laboratorio}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {registro.arCondicionado.nome}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(registro.acao)}`}>
                                                {getAcaoTexto(registro.acao)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center">
                                                <div className={`h-2 w-2 rounded-full mr-2 ${registro.arCondicionado.status === 'ligado' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                <span>
                                                    {registro.arCondicionado.status === 'ligado' ? 'Ligado' : 'Desligado'}
                                                    {registro.arCondicionado.status === 'ligado' && registro.arCondicionado.temperatura ? ` (${registro.arCondicionado.temperatura}°C)` : ''}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && historico.length > 0 && (
                    <div className="px-6 py-4 border-t bg-gray-50">
                        <div className="text-sm text-gray-700">
                            Mostrando <span className="font-medium">{historico.length}</span> registros
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}