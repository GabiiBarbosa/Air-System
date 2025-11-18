'use client';
import { useState, useEffect } from 'react';

interface RelayStatus {
  ok: boolean;           // ← Indica se a operação foi bem-sucedida
  relay: 'on' | 'off';   // ← Estado atual do relé (só pode ser 'on' ou 'off')
  error?: string;        // ← Mensagem de erro (opcional - só aparece se houver problema)
}

export function useRelayControl() {
  //Controlam o que aparece na tela
  const [status, setStatus] = useState<RelayStatus | null>(null);  // ← Estado do relé (null = ainda não carregou)
  const [loading, setLoading] = useState(false);                   // ← Se está carregando (mostra spinner)
  const [error, setError] = useState<string | null>(null);         // ← Mensagem de erro se houver problema

  //Estado ATUAL do relé da ESP8266
  const fetchStatus = async () => {
    setLoading(true);      // ← Ativa o loading (mostra que está buscando dados)
    setError(null);        // ← Limpa erros anteriores
    
    try {
      //Requisição - Chama API Next.js
      const response = await fetch('/api/relay?action=status');
      const data = await response.json();
      
      //Verifica eroo tanto na rede quanto da ESP
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Erro ao buscar status');
      }
      
      //Atualiza o estado com os dados recebidos
      setStatus(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro de comunicação';
      setError(errorMessage);
      // Define estado de fallback (desligado com erro)
      setStatus({ ok: false, relay: 'off', error: errorMessage });
    } finally {
      setLoading(false);   // ← Desativa o loading (independente do resultado)
    }
  };

  //Liga ou desliga o relé fisicamente
  const controlRelay = async (action: 'on' | 'off') => {
    setLoading(true);      // ← Ativa loading durante a operação
    setError(null);        // ← Limpa erros
    
    try {
      //chama API para ligar/desligar
      const response = await fetch(`/api/relay?action=${action}`);
      const data = await response.json();
      

      if (!response.ok || !data.ok) {
        throw new Error(data.error || `Erro ao ${action === 'on' ? 'ligar' : 'desligar'} relé`);
      }
      
      //Atualiza estado com nova confirmação
      setStatus(data);
      return { success: true, data };
    } catch (err) {
      // erros
      const errorMessage = err instanceof Error ? err.message : 'Erro de comunicação';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);   // ← Desativa loading
    }
  };

  useEffect(() => {
    fetchStatus(); // ← Busca status inicial
    
    //busca status a cada 5 segundos
    const interval = setInterval(fetchStatus, 5000);
    
    return () => clearInterval(interval);
  }, []); // ← Array vazio = roda apenas uma vez

  return {
    status,        //Estado completo do relé
    loading,       //Se está carregando (true/false)
    error,         //Mensagem de erro (null se não houver)
    fetchStatus,   //Função para buscar manualmente
    controlRelay,  //Função para ligar/desligar
    isOn: status?.relay === 'on',   //Conveniência: true se estiver ligado
    isOff: status?.relay === 'off', //Conveniência: true se estiver desligado
  };
}