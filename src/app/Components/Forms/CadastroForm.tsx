'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { criarUser } from '../Firebase/FirebaseConfig';
// ✅ 1. Importa o FormFeedback
import FormContainer, { FormButton, FormInput, FormFeedback } from './Forms';


export default function CadastroForm() {
    const router = useRouter();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ nome: '', email: '', password: '' });

    // ✅ 2. Adiciona estados para a mensagem de feedback
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('error');

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        
        // Limpa o feedback anterior
        setFeedbackMessage('');
        
        // ✅ VALIDAÇÃO
        const newErrors = { nome: '', email: '', password: '' };
        if (!nome) newErrors.nome = 'Nome é obrigatório';
        if (!email) newErrors.email = 'Email é obrigatório';
        if (!password) newErrors.password = 'Senha é obrigatória';
        
        setErrors(newErrors);
        if (newErrors.nome || newErrors.email || newErrors.password) return;

        setIsLoading(true);

        try {
            await criarUser(email, password, nome);
            // Opcional: Feedback de sucesso
            // setFeedbackMessage('Cadastro realizado com sucesso! Redirecionando...');
            // setFeedbackType('success');
            router.push('/Controle');

        } catch (error) {
            // ✅ 3. Lógica para "traduzir" os erros de cadastro
            let customErrorMessage = 'Ocorreu um erro ao tentar cadastrar.';

            if (error && typeof error === 'object' && 'code' in error) {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        customErrorMessage = 'Este e-mail já está em uso. Tente outro.';
                        break;
                    case 'auth/weak-password':
                        customErrorMessage = 'Senha deve ter pelo menos 6 caracteres.';
                        break;
                    case 'auth/invalid-email':
                        customErrorMessage = 'O formato do e-mail é inválido.';
                        break;
                    default:
                        console.error("Erro de cadastro Firebase:", error.code);
                        customErrorMessage = 'Erro ao cadastrar. Tente novamente mais tarde.';
                }
            }
            
            setFeedbackMessage(customErrorMessage);
            setFeedbackType('error');

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FormContainer title="CADASTRO">
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Inputs do formulário */}
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

                {/* ✅ 4. Texto do botão corrigido */}
                <FormButton type="submit" disabled={isLoading}>
                    Cadastrar
                </FormButton>

                {/* ✅ 5. Renderiza o feedback aqui */}
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