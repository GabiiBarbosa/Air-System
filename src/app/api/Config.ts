export const ESP_CONFIG = {
  BASE_URL: process.env.ESP_IP || "http://192.168.1.100",  // ← IP da sua ESP8266
  TIMEOUT: 3000,  // ← Tempo máximo para aguardar resposta
};

export interface RelayStatus {
  ok: boolean;     // ← Se a operação foi bem-sucedida
  relay: 'on' | 'off';  // ← Estado do relé: ligado ou desligado
  error?: string;  // ← Mensagem de erro (se houver)
}

export async function fetchFromESP(endpoint: string) {
  try {
    // ← Faz uma chamada GET para a ESP8266
    const response = await fetch(`${ESP_CONFIG.BASE_URL}${endpoint}`, {
      method: 'GET',
      signal: AbortSignal.timeout(ESP_CONFIG.TIMEOUT),  // ← Cancela se demorar mais de 3 segundos
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();  // ← Converte a resposta para JSON
  } catch (error) {
    console.error(`Erro na comunicação com ESP: ${error}`);
    throw new Error('Falha na comunicação com o dispositivo');
  }
}

/*Define o IP do dispositivo
Controla o tempo de espera
Padroniza como fazer requisições*/