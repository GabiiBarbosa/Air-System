// services/authService.ts

// Função para falar com nossa API de cadastro
export async function criarUser(email: string, password: string, nome: string) {
    const response = await fetch('/api/auth/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nome }),
    });

    const data = await response.json();

    if (!response.ok) {
        // Lança erro para cair no catch do formulário
        throw new Error(data.message || 'Erro ao cadastrar');
    }

    return data.user;
}

// Função para falar com nossa API de login
// services/authService.ts

export async function loginAuth(email: string, password: string) {
    // 1. Verifique se o caminho é /api/login ou /api/auth/login
    const response = await fetch('/api/auth/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    // Se der 404 aqui, o Next.js não encontrou o arquivo route.ts na pasta especificada
    if (response.status === 404) {
        throw new Error("Rota de login não encontrada no servidor (404)");
    }

    const data = await response.json();

    if (response.ok && data.success) {
        // Garantimos que os dados estão sendo salvos
        const usuarioParaSalvar = {
            nome: data.user?.nome || "Usuário",
            email: data.user?.email || email
        };
        localStorage.setItem('usuario_air_system', JSON.stringify(usuarioParaSalvar));
        return data;
    }

    throw new Error(data.message || 'Erro ao realizar login');
}

export const handleLogout = async () => {
    if (typeof window !== 'undefined') {
        // PADRONIZAÇÃO: Removendo a mesma chave
        localStorage.removeItem('usuario_air_system');
    }
};