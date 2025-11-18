import { NextRequest, NextResponse } from 'next/server';

//P da ESP8266 (vem do .env.local)
const ESP_IP = process.env.ESP_IP || "http://192.168.1.100";

//processa todas as requisições GET para /api/relay
export async function GET(request: NextRequest) {
    // 🔹 PEGA PARÂMETROS: action=status|on|off da URL
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'status';  // ← Padrão é 'status'
    
    try {
        //Faz requisição para o dispositivo físico
        const response = await fetch(`${ESP_IP}/relay/${action}`, {
            method: 'GET',
            signal: AbortSignal.timeout(3000),  // ← Timeout de 3 segundos
        });

        if (!response.ok) {
            throw new Error('Falha na comunicação com a ESP');
        }

        const data = await response.json();
        return NextResponse.json(data);
        
    } catch (error) {

        console.error('Erro na API:', error);
        return NextResponse.json(
            { 
                ok: false, 
                relay: "off",  // ← Estado de fallback: desligado
                error: 'Falha na comunicação com o dispositivo' 
            },
            { status: 500 }  // ← Código HTTP 500 = erro interno
        );
    }
}