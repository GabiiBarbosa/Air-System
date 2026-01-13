import { NextResponse } from 'next/server';
import clientPromise from '@/src/app/Config/Mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { nome, email, password } = await request.json();

    if (!email || !password || !nome) {
      return NextResponse.json({ message: 'Dados incompletos' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("air-system"); // Nome do seu banco

    // 1. Verifica se já existe
    const userExists = await db.collection("users").findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: 'Email já cadastrado' }, { status: 409 });
    }

    // 2. Criptografa a senha (NUNCA salve senha pura)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Salva no banco
    const newUser = await db.collection("users").insertOne({
      nome,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json({ 
      success: true, 
      user: { id: newUser.insertedId, nome, email } 
    }, { status: 201 });

  } catch (error) {
    console.error("ERRO DETALHADO DA API:", error); // Isso vai aparecer no terminal do VS Code
    return NextResponse.json({ 
      message: 'Erro no servidor', 
      debug: error instanceof Error ? error.message : "Erro desconhecido" 
    }, { status: 500 });
  }
}