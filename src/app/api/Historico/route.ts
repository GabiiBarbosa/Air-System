import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/src/app/Config/Mongodb';

// --- SALVAR NOVO REGISTRO (POST) ---
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const client = await clientPromise;
        const db = client.db("air-system"); // Garanta que o nome do banco está correto

        // Convertemos a string de data para um objeto Date real do JS antes de salvar
        const registroParaSalvar = {
            ...body,
            horario: new Date(body.horario || new Date())
        };

        const result = await db.collection('ocupacoes').insertOne(registroParaSalvar);
        return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
    } catch (error) {
        console.error('Erro ao salvar no histórico:', error);
        return NextResponse.json({ message: 'Erro ao salvar dados' }, { status: 500 });
    }
}

// --- BUSCAR HISTÓRICO (GET) ---
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const dataInicio = searchParams.get('dataInicio');
        const dataFim = searchParams.get('dataFim');
        const laboratorio = searchParams.get('laboratorio');
        const usuario = searchParams.get('usuario');

        const client = await clientPromise;
        const db = client.db("air-system");

        const filtros: any = {};

        // Filtro de Data
        if (dataInicio || dataFim) {
            filtros.horario = {};
            if (dataInicio) filtros.horario.$gte = new Date(dataInicio);
            if (dataFim) {
                const dataFimObj = new Date(dataFim);
                dataFimObj.setHours(23, 59, 59, 999);
                filtros.horario.$lte = dataFimObj;
            }
        }

        // Filtro de Laboratório
        if (laboratorio && laboratorio !== 'todos') {
            filtros.laboratorio = laboratorio;
        }

        // Filtro de Usuário (Busca parcial/case-insensitive)
        if (usuario) {
            filtros['usuario.nome'] = { $regex: usuario, $options: 'i' };
        }

        const historico = await db
            .collection('ocupacoes')
            .find(filtros)
            .sort({ horario: -1 })
            .limit(100)
            .toArray();

        return NextResponse.json(historico);

    } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
    }
}