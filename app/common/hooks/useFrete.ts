import { useState, useCallback } from 'react';
import { CorreiosService } from '@services/api';
import type { FreteOption } from '@services/api/CorreiosService';

export type UseFreteState = {
  opcoesFrete: FreteOption[];
  loading: boolean;
  error: string | null;
  cepValido: boolean;
};

export function useFrete() {
  const [state, setState] = useState<UseFreteState>({
    opcoesFrete: [],
    loading: false,
    error: null,
    cepValido: false,
  });

  const calcularFrete = useCallback(async (
    cep: string,
    temProdutosFisicos: boolean = true
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      if (!temProdutosFisicos) {
        setState({
          opcoesFrete: [{
            codigo: 'DIGITAL',
            nome: 'Digital - Download Imediato',
            prazo: 0,
            valor: 0,
          }],
          loading: false,
          error: null,
          cepValido: true,
        });
        return;
      }

      if (!CorreiosService.validarCEP(cep)) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'CEP inválido',
          cepValido: false,
        }));
        return;
      }

      const opcoes = await CorreiosService.calcularFrete({
        cepDestino: cep,
      });

      setState({
        opcoesFrete: opcoes,
        loading: false,
        error: null,
        cepValido: true,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao calcular frete',
        cepValido: false,
      }));
    }
  }, []);

  const buscarEndereco = useCallback(async (cep: string) => {
    try {
      const endereco = await CorreiosService.buscarEnderecoPorCEP(cep);
      return endereco;
    } catch (error) {
      throw error;
    }
  }, []);

  const limparFrete = useCallback(() => {
    setState({
      opcoesFrete: [],
      loading: false,
      error: null,
      cepValido: false,
    });
  }, []);

  return {
    ...state,
    calcularFrete,
    buscarEndereco,
    limparFrete,
    formatarCEP: CorreiosService.formatarCEP,
    validarCEP: CorreiosService.validarCEP,
  };
}