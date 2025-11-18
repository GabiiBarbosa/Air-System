'use client';

interface FormContainerProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export default function FormContainer({ 
    title, 
    children, 
    className = "" 
}: FormContainerProps) {
    
    // ✅ CORES ATUALIZADAS - INPUTS COM FUNDO BRANCO
    const labelStyle = "block text-gray-900 text-sm font-bold mb-2";
    const inputStyle = "w-full px-3 py-2 border border-gray-300 rounded-3xl bg-white text-gray-700"; // ✅ bg-white
    const errorInputStyle = "w-full px-3 py-2 border border-red-500 rounded-3xl bg-white text-gray-700"; // ✅ bg-white
    const errorTextStyle = "text-red-500 text-sm mt-1";
    const buttonStyle = "w-full bg-[#4c0cac] hover:bg-[#3a0980] text-white font-bold py-3 px-4 rounded-3xl transition duration-300 ease-in-out disabled:opacity-50";
    const feedbackSuccessStyle = "text-sm text-center text-green-600";
    const feedbackErrorStyle = "text-sm text-center text-red-600";

    return (
        <div className={`bg-[#F3F4F6] p-8 rounded-3xl w-full max-w-md mx-auto ${className}`}>
            <h2 className="text-center font-bold text-2xl text-[#3730A3] mb-5">
                {title}
            </h2>
            
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}

// ✅ COMPONENTE INPUT ATUALIZADO
interface FormInputProps {
    type: string;
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
}

export function FormInput({
    type,
    id,
    label,
    value,
    onChange,
    placeholder,
    error,
    disabled = false,
    required = false
}: FormInputProps) {
    // ✅ FUNDO BRANCO PARA MELHOR CONTRASTE
    const inputStyle = `w-full px-3 py-2 border rounded-3xl bg-white text-gray-700 ${
        error ? 'border-red-500' : 'border-gray-300'
    }`;
    const labelStyle = "block text-gray-900 text-sm font-bold mb-2";
    const errorTextStyle = "text-red-500 text-sm mt-1";

    return (
        <div>
            <label htmlFor={id} className={labelStyle}>
                {label}
            </label>
            <input
                type={type}
                id={id}
                className={inputStyle}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
            />
            {error && <p className={errorTextStyle}>{error}</p>}
        </div>
    );
}

// ✅ COMPONENTE BUTTON QUE USA OS ESTILOS DO CONTAINER
interface FormButtonProps {
    type?: "button" | "submit" | "reset";
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
}

export function FormButton({
    type = "button",
    children,
    disabled = false,
    onClick
}: FormButtonProps) {
    const buttonStyle = "w-50 bg-[#3730A3] text-white font-bold py-2 px-4 mt-6 rounded-lg transition duration-300  mx-auto block";

    return (
        <button
            type={type}
            className={buttonStyle}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

// ✅ COMPONENTE FEEDBACK QUE USA OS ESTILOS DO CONTAINER
interface FormFeedbackProps {
    message: string;
    type: "success" | "error";
}


export function FormFeedback({ message, type }: FormFeedbackProps) {
    const feedbackStyle = type === "success" 
        ? "text-sm text-center text-green-600" 
        : "text-sm text-center text-red-600";

    return <p className={feedbackStyle}>{message}</p>;
}