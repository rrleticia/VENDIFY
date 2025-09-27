// Serviço para cálculo de frete simplificado baseado apenas no CEP
export type FreteOption = {
  codigo: string;
  nome: string;
  prazo: number; // dias úteis
  valor: number;
  erro?: string;
};

export type CalculoFreteParams = {
  cepDestino: string;
};

// CEP da loja (configurável)
const CEP_ORIGEM = "58400-000"; // Campina Grande - PB

// Códigos dos serviços dos Correios
const SERVICOS = {
  SEDEX: "40010",
  PAC: "41106",
  SEDEX_10: "40215",
};

// Cálculo simplificado baseado apenas no CEP
async function consultarCorreiosAPI(params: CalculoFreteParams): Promise<FreteOption[]> {
  // Simular delay da API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Calcular frete baseado na distância estimada do CEP
  const distanciaEstimada = calcularDistanciaEstimada(CEP_ORIGEM, params.cepDestino);
  
  // Simular diferentes opções de frete baseado apenas na distância
  const opcoes: FreteOption[] = [
    {
      codigo: SERVICOS.PAC,
      nome: "PAC",
      prazo: Math.min(12, Math.max(5, Math.round(distanciaEstimada / 150))),
      valor: Math.round((9.5 + distanciaEstimada * 0.025) * 100) / 100,
    },
    {
      codigo: SERVICOS.SEDEX,
      nome: "SEDEX", 
      prazo: Math.min(5, Math.max(1, Math.round(distanciaEstimada / 300))),
      valor: Math.round((18.9 + distanciaEstimada * 0.045) * 100) / 100,
    },
  ];

  // Se for região metropolitana ou próxima, adicionar SEDEX 10
  if (distanciaEstimada < 100) {
    opcoes.push({
      codigo: SERVICOS.SEDEX_10,
      nome: "SEDEX 10",
      prazo: 1,
      valor: Math.round((28.0 + distanciaEstimada * 0.1) * 100) / 100,
    });
  }

  return opcoes;
}

// Função auxiliar para estimar distância baseada no CEP
function calcularDistanciaEstimada(cepOrigem: string, cepDestino: string): number {
  const origem = cepOrigem.replace(/\D/g, '');
  const destino = cepDestino.replace(/\D/g, '');
  
  // Lógica simplificada baseada nos primeiros dígitos do CEP
  const prefixoOrigem = parseInt(origem.substring(0, 2));
  const prefixoDestino = parseInt(destino.substring(0, 2));
  
  // Diferença entre regiões (aproximação)
  const diferencaRegional = Math.abs(prefixoDestino - prefixoOrigem);
  
  // Estimar distância baseada na diferença de CEP
  if (diferencaRegional === 0) return 20; // Mesma cidade
  if (diferencaRegional <= 2) return 80; // Estado próximo
  if (diferencaRegional <= 5) return 200; // Região próxima
  if (diferencaRegional <= 10) return 500; // Região distante
  return 800; // Muito distante
}

// Validar CEP brasileiro
export function validarCEP(cep: string): boolean {
  const cepLimpo = cep.replace(/\D/g, '');
  return cepLimpo.length === 8 && /^\d{8}$/.test(cepLimpo);
}

// Formatar CEP
export function formatarCEP(cep: string): string {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length === 8) {
    return `${cepLimpo.substring(0, 5)}-${cepLimpo.substring(5)}`;
  }
  return cep;
}

// Buscar endereço por CEP (integração com ViaCEP)
export async function buscarEnderecoPorCEP(cep: string) {
  const cepLimpo = cep.replace(/\D/g, '');
  
  if (!validarCEP(cepLimpo)) {
    throw new Error('CEP inválido');
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      throw new Error('CEP não encontrado');
    }

    return {
      cep: formatarCEP(data.cep),
      logradouro: data.logradouro,
      bairro: data.bairro,
      localidade: data.localidade,
      uf: data.uf,
      complemento: data.complemento || '',
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    throw new Error('Erro ao consultar CEP');
  }
}

// Calcular frete principal (simplificado)
export async function calcularFrete(params: CalculoFreteParams): Promise<FreteOption[]> {
  if (!validarCEP(params.cepDestino)) {
    throw new Error('CEP de destino inválido');
  }

  try {
    const opcoes = await consultarCorreiosAPI(params);
    return opcoes.filter(opcao => !opcao.erro);
  } catch (error) {
    console.error('Erro ao calcular frete:', error);
    throw new Error('Erro ao consultar frete dos Correios');
  }
}