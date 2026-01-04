import { NextResponse } from "next/server";

const ESP_IP = "http://192.168.0.50"; // coloque o IP da sua ESP8266

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const action = searchParams.get("action");

        if (!action) {
            return NextResponse.json(
                { ok: false, error: "Ação inválida" },
                { status: 400 }
            );
        }

        // rota real que será chamada na ESP
        let espRoute = "";

        if (action === "status") espRoute = "/status";
        if (action === "on") espRoute = "/on";
        if (action === "off") espRoute = "/off";

        if (!espRoute) {
            return NextResponse.json(
                { ok: false, error: "Ação desconhecida" },
                { status: 400 }
            );
        }

        // chamada real à ESP8266
        const espResp = await fetch(`${ESP_IP}${espRoute}`);
        const data = await espResp.json();

        return NextResponse.json({ ok: true, ...data });

    } catch (err) {
        return NextResponse.json(
            { ok: false, error: "Falha ao comunicar com a ESP" },
            { status: 500 }
        );
    }
}
