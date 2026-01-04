'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
// MUDANÇA 1: Importamos do novo serviço, não do Firebase
import { criarUser } from '@/src/app/Services/AuthService'; 
import FormContainer, { FormButton, FormInput, FormFeedback } from '../LayoutForms/Forms';

export default function CadastroForm() {
    const router = useRouter();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ nome: '', email: '', password: '' });
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('error');

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setFeedbackMessage('');
        
        const newErrors = { nome: '', email: '', password: '' };
        if (!nome) newErrors.nome = 'Nome é obrigatório';
        if (!email) newErrors.email = 'Email é obrigatório';
        if (!password) newErrors.password = 'Senha é obrigatória';
        
        setErrors(newErrors);
        if (newErrors.nome || newErrors.email || newErrors.password) return;

        setIsLoading(true);

        try {
            await criarUser(email, password, nome);
            setFeedbackMessage('Cadastro realizado! Redirecionando...');
            setFeedbackType('success');
            
            // Pequeno delay para o usuário ver a mensagem
            setTimeout(() => {
                router.push('/Controle');
            }, 1500);

        } catch (error: any) {
            // MUDANÇA 2: Tratamento de erro simplificado (a API manda a mensagem)
            console.error("Erro cadastro:", error);
            setFeedbackMessage(error.message || 'Ocorreu um erro ao tentar cadastrar.');
            setFeedbackType('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FormContainer title="CADASTRO">
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                    type="text"
                    id="nome"
                    label="Nome:"
                    placeholder="Digite seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    error={errors.nome}
                    disabled={isLoading}
                    required
                />
                <FormInput
                    type="email"
                    id="email"
                    label="E-mail:"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    disabled={isLoading}
                    required
                />
                <FormInput
                    type="password"
                    id="password"
                    label="Senha:"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    disabled={isLoading}
                    required
                />
                <FormButton type="submit" disabled={isLoading}>
                    {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                </FormButton>
                
                {feedbackMessage && (
                    <FormFeedback message={feedbackMessage} type={feedbackType} />
                )}

                <button type="button" onClick={() => router.push('Login')} className="w-full text-center text-sm text-blue-600 hover:underline">
                    Já tem uma conta? Faça login
                </button>
            </form>
        </FormContainer>
    );
}