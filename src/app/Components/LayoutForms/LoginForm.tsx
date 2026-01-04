'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
// MUDANÇA 1: Importamos do novo serviço
import { loginAuth } from '@/src/app/Services/AuthService';
import FormContainer, { FormButton, FormInput, FormFeedback } from './Forms';

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' }); 
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('error');

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setFeedbackMessage('');

        const newErrors = { email: '', password: '' };
        if (!email) newErrors.email = 'Email é obrigatório';
        if (!password) newErrors.password = 'Senha é obrigatória';
        
        setErrors(newErrors);
        if (newErrors.email || newErrors.password) return;

        setIsLoading(true);

        try {
            await loginAuth(email, password);
            router.push('/Controle');
        } catch (error: any) {
             // MUDANÇA 2: Usamos a mensagem que vem da nossa API
            setFeedbackMessage(error.message || 'Erro ao logar. Verifique seus dados.');
            setFeedbackType('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FormContainer title="LOGIN">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    {isLoading ? 'Entrando...' : 'Entrar'}
                </FormButton>

                {feedbackMessage && (
                    <FormFeedback message={feedbackMessage} type={feedbackType} />
                )}

                <button 
                    type="button" 
                    onClick={() => router.push('/Cadastro')}
                    className="w-full text-center text-sm text-blue-600 hover:underline"
                >
                    Não tem uma conta? Faça seu cadastro
                </button>
            </form>
        </FormContainer>
    );
}