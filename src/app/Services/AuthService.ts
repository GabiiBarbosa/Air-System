// services/authService.ts

// Função para falar com nossa API de cadastro
export async function criarUser(email: string, password: string, nome: string) {
    const response = await fetch('/api/auth/Cadastro', {
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
export async function loginAuth(email: string, password: string) {
    const response = await fetch('/api/auth/Login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Erro ao logar');
    }

    // Opcional: Salvar no localStorage para persistir login simples
    if (typeof window !== 'undefined') {
        localStorage.setItem('user_air_system', JSON.stringify(data.user));
    }

    return data.user;
}

export const handleLogout = async () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('user_air_system');
    }
    // Redirecionamento deve ser feito no componente
};