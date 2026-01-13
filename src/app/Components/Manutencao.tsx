'use client';
import { useEffect, useState } from 'react';

interface RegistroManutencao {
    _id?: string;
    data: string;
    laboratorio: string;
    tecnico: string;
    descricao: string;
    tipo: 'preventiva' | 'corretiva';
}

export default function ManutencaoGerenciamento() {
    const [manutencoes, setManutencoes] = useState<RegistroManutencao[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // Estados do Formulário
    const [formData, setFormData] = useState({
        laboratorio: 'lab1',
        tecnico: '',
        descricao: '',
        tipo: 'preventiva'
    });

    const buscarManutencoes = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/Manutencao');
            const data = await res.json();
            setManutencoes(data);
        } catch (error) {
            console.error("Erro ao buscar:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { buscarManutencoes(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/Manutencao', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, data: new Date().toISOString() })
            });

            if (res.ok) {
                setShowForm(false);
                setFormData({ laboratorio: 'lab1', tecnico: '', descricao: '', tipo: 'preventiva' });
                buscarManutencoes(); // Recarrega a lista
            }
        } catch (error) {
            alert("Erro ao salvar manutenção");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Histórico de Manutenções</h2>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-[#3730A3] text-white rounded-md text-sm hover:bg-[#2d2880] transition"
                >
                    {showForm ? 'Cancelar' : '+ Nova Manutenção'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border border-gray-300 space-y-4 fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Técnico Responsável</label>
                            <input 
                                required
                                className="w-full p-2 border rounded-md text-gray-900" 
                                value={formData.tecnico}
                                onChange={e => setFormData({...formData, tecnico: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tipo</label>
                            <select 
                                className="w-full p-2 border rounded-md text-gray-900"
                                value={formData.tipo}
                                onChange={e => setFormData({...formData, tipo: e.target.value as any})}
                            >
                                <option value="preventiva">Preventiva</option>
                                <option value="corretiva">Corretiva</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descrição do Serviço</label>
                        <textarea 
                            required
                            className="w-full p-2 border rounded-md text-gray-900" 
                            rows={3}
                            value={formData.descricao}
                            onChange={e => setFormData({...formData, descricao: e.target.value})}
                        />
                    </div>
                    <button type="submit" className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        Salvar Registro
                    </button>
                </form>
            )}

            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Data</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Técnico</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tipo</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Descrição</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={4} className="p-4 text-center">Carregando...</td></tr>
                        ) : manutencoes.length === 0 ? (
                            <tr><td colSpan={4} className="p-4 text-center text-gray-500">Nenhum registro.</td></tr>
                        ) : (
                            manutencoes.map((m) => (
                                <tr key={m._id} className="text-sm">
                                    <td className="px-4 py-3 whitespace-nowrap text-gray-900">{new Date(m.data).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900">{m.tecnico}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${m.tipo === 'preventiva' ? 'bg-blue-100 text-blue-900' : 'bg-orange-100 text-orange-800'}`}>
                                            {m.tipo.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-900">{m.descricao}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}