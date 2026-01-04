// app/models/Ocupacao.ts
export interface Ocupacao {
    _id?: string;
    laboratorio: string;
    usuario: {
        nome: string;
        email: string;
    };
    arCondicionado: {
        id: string;
        nome: string;
        status: 'ligado' | 'desligado';
        temperatura?: number;
    };
    acao: 'entrada' | 'saida' | 'ligou_ar' | 'desligou_ar';
    horario: Date;
    createdAt?: Date;
    updatedAt?: Date;
}