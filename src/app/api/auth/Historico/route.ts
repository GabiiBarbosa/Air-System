// src/app/api/Historico/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/src/app/Config/Mongodb';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const dataInicio = searchParams.get('dataInicio');
        const dataFim = searchParams.get('dataFim');
        const laboratorio = searchParams.get('laboratorio');
        const usuario = searchParams.get('usuario');

        const client = await clientPromise;
        const db = client.db();

        // Construir filtros
        const filtros: any = {};

        if (dataInicio || dataFim) {
            filtros.horario = {};
            if (dataInicio) {
                filtros.horario.$gte = new Date(dataInicio);
            }
            if (dataFim) {
                const dataFimObj = new Date(dataFim);
                dataFimObj.setHours(23, 59, 59, 999);
                filtros.horario.$lte = dataFimObj;
            }
        }

        if (laboratorio && laboratorio !== 'todos') {
            filtros.laboratorio = laboratorio;
        }

        if (usuario) {
            filtros['usuario.nome'] = { $regex: usuario, $options: 'i' };
        }

        // Buscar histórico
        const historico = await db
            .collection('ocupacoes')
            .find(filtros)
            .sort({ horario: -1 })
            .limit(100)
            .toArray();

        return NextResponse.json(historico);

    } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        return NextResponse.json(
            { message: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}