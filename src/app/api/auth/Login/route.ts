import { NextResponse } from 'next/server';
import clientPromise from '@/src/app/Config/Mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const client = await clientPromise;
    const db = client.db("air-system");

    // 1. Busca usuário pelo email
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
    }

    // 2. Compara a senha digitada com a criptografada no banco
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
    }

    // 3. Retorna sucesso (Aqui você pode adicionar lógica de JWT/Cookies futuramente)
    return NextResponse.json({
      success: true,
      user: { id: user._id, nome: user.nome, email: user.email }
    });

  } catch (error) {
    return NextResponse.json({ message: 'Erro no servidor' }, { status: 500 });
  }
}