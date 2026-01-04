// src/app/Services/OcupacaoService.ts
export async function registrarOcupacao(data: {
    laboratorio: string;
    usuario: {
        nome: string;
        email: string;
    };
    arCondicionado: {
        id: string;
        nome: string;
        status: 'ligado' | 'desligado';
        temperatura?: number;
    };
    acao: 'entrada' | 'saida' | 'ligou_ar' | 'desligou_ar';
}) {
    try {
        const response = await fetch('/api/Ocupacao', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Erro ao registrar ocupação');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro no serviço de ocupação:', error);
        throw error;
    }
}

// Função para obter usuário do localStorage
export function getUsuarioLogado() {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user_air_system');
        return user ? JSON.parse(user) : null;
    }
    return null;
}