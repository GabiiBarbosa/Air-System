'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAuth } from '../../Firebase/FirebaseConfig';
import FormContainer, { FormButton, FormInput, FormFeedback } from './Forms';

export default function LoginForm() {
    const router = useRouter();
    // const [nome, setNome] = useState(''); // ❌ REMOVIDO
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // const [errors, setErrors] = useState({ nome: '', email: '', password: '' }); // ❌ REMOVIDO
    
    // ✅ Estado de erro simplificado
    const [errors, setErrors] = useState({ email: '', password: '' }); 
    
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('error');

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setFeedbackMessage('');

        // ✅ VALIDAÇÃO SIMPLIFICADA
        const newErrors = { email: '', password: '' };
        // if (!nome) newErrors.nome = 'Nome é obrigatório'; // ❌ REMOVIDO
        if (!email) newErrors.email = 'Email é obrigatório';
        if (!password) newErrors.password = 'Senha é obrigatória';
        
        setErrors(newErrors);
        if (newErrors.email || newErrors.password) return; // ✅ ATUALIZADO

        setIsLoading(true);

        try {
            await loginAuth(email, password);
            router.push('/Controle');

        } catch (error) {
            let customErrorMessage = 'Ocorreu um erro ao tentar fazer o login.';

            if (error && typeof error === 'object' && 'code' in error) {
                switch (error.code) {
                    case 'auth/invalid-credential':
                        customErrorMessage = 'E-mail ou senha inválidos. Verifique seus dados.';
                        break;
                    case 'auth/too-many-requests':
                        customErrorMessage = 'Muitas tentativas de login. Tente novamente mais tarde.';
                        break;
                    default:
                        customErrorMessage = 'Erro ao logar. Tente novamente mais tarde.';
                }
            }
            
            setFeedbackMessage(customErrorMessage);
            setFeedbackType('error');

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FormContainer title="LOGIN">
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* ❌ CAMPO NOME REMOVIDO DAQUI */}

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
                    Entrar
                </FormButton>

                {feedbackMessage && (
                    <FormFeedback message={feedbackMessage} type={feedbackType} />
                )}

                {/* ✅ link: deve levar para a página de CADASTRO */}
                <button 
                    type="button" 
                    onClick={() => router.push('/Cadastro')} // <-- Sugestão de rota
                    className="w-full text-center text-sm text-blue-600 hover:underline"
                >
                    Não tem uma conta? Faça seu cadastro
                </button>
            </form>
        </FormContainer>
    );
}