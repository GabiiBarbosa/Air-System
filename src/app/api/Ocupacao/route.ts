// src/app/api/Ocupacao/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/src/app/Config/Mongodb';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            laboratorio,
            usuario,
            arCondicionado,
            acao
        } = body;

        // Validação básica
        if (!laboratorio || !usuario || !arCondicionado || !acao) {
            return NextResponse.json(
                { message: 'Campos obrigatórios faltando' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();
        
        const registro = {
            laboratorio,
            usuario: {
                nome: usuario.nome,
                email: usuario.email
            },
            arCondicionado: {
                id: arCondicionado.id,
                nome: arCondicionado.nome,
                status: arCondicionado.status,
                temperatura: arCondicionado.temperatura || null
            },
            acao,
            horario: new Date(),
            createdAt: new Date()
        };

        const result = await db.collection('ocupacoes').insertOne(registro);

        return NextResponse.json({
            message: 'Registro salvo com sucesso',
            id: result.insertedId
        });

    } catch (error) {
        console.error('Erro ao registrar ocupação:', error);
        return NextResponse.json(
            { message: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}