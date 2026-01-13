import { NextResponse } from 'next/server';
import clientPromise from '@/src/app/Config/Mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("air-system");
        const logs = await db.collection("manutencao").find({}).sort({ data: -1 }).toArray();
        return NextResponse.json(logs);
    } catch (e) {
        return NextResponse.json({ error: 'Erro ao buscar' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const client = await clientPromise;
        const db = client.db("air-system");
        const result = await db.collection("manutencao").insertOne(body);
        return NextResponse.json(result, { status: 201 });
    } catch (e) {
        return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 });
    }
}