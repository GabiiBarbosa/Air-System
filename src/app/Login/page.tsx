import Image from 'next/image';
import LoginForm from '@/src/app/Components/LayoutForms/LoginForm';
import '@/src/app/globals.css';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#3730A3]"> 
      <header className="bg-[#F3F4F6] p-4 flex justify-center items-center shadow-md">
            <Image
              src="/logo-catolica-da-paraiba.png" 
              alt="Logo Faculdade Católica da Paraíba"
              width={250} 
              height={60} 
              priority
            />
          </header>

      <main className="flex flex-grow justify-center items-center p-8">
        <LoginForm/> 
      </main>
    </div>
  );
}