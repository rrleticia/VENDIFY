import { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  Stack,
  Typography,
  Alert,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Box,
} from '@mui/material';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import { useFrete } from '@common/hooks';

type FreteCalculatorProps = {
  temProdutosFisicos?: boolean;
  onFreteSelect?: (opcao: { valor: number; prazo: number; nome: string }) => void;
  cepInicial?: string;
  onEnderecoChange?: (endereco: any) => void;
};

export default function FreteCalculator({
  temProdutosFisicos,
  onFreteSelect,
  cepInicial = '',
  onEnderecoChange,
}: FreteCalculatorProps) {
  const [cep, setCep] = useState(cepInicial);
  const [freteSelecionado, setFreteSelecionado] = useState<string>('');
  const [endereco, setEndereco] = useState<any>(null);
  
  const { 
    opcoesFrete, 
    loading, 
    error, 
    cepValido,
    calcularFrete, 
    buscarEndereco,
    formatarCEP,
    validarCEP 
  } = useFrete();

  // Auto-calcular quando CEP válido é inserido
  useEffect(() => {
    if (validarCEP(cep) && temProdutosFisicos) {
      void calcularFrete(cep, temProdutosFisicos);
    }
  }, [cep, temProdutosFisicos, calcularFrete, validarCEP]);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.replace(/\D/g, '');
    if (valor.length <= 8) {
      setCep(formatarCEP(valor));
    }
  };

  const handleBuscarEndereco = async () => {
    if (!validarCEP(cep)) return;

    try {
      const endereco = await buscarEndereco(cep);
      setEndereco(endereco);
      onEnderecoChange?.(endereco);
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
    }
  };

  const handleFreteSelect = (valor: string) => {
    setFreteSelecionado(valor);
    const opcao = opcoesFrete.find(op => op.codigo === valor);
    if (opcao && onFreteSelect) {
      onFreteSelect({
        valor: opcao.valor,
        prazo: opcao.prazo,
        nome: opcao.nome,
      });
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
      <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
        <LocalShippingRoundedIcon color="primary" />
        <Typography variant="subtitle1" fontWeight={800}>
          Calcular Frete
        </Typography>
      </Stack>

      <Stack gap={2}>
        {/* Campo CEP */}
        <Stack direction="row" gap={1}>
          <TextField
            label="CEP de entrega"
            placeholder="00000-000"
            value={cep}
            onChange={handleCepChange}
            size="small"
            sx={{ flex: 1 }}
            helperText={error || (!cepValido && cep ? 'CEP inválido' : '')}
            error={!!error || (!cepValido && !!cep)}
          />
          <Button
            variant="outlined"
            onClick={handleBuscarEndereco}
            disabled={!validarCEP(cep) || loading}
            startIcon={<LocationOnRoundedIcon />}
          >
            Buscar
          </Button>
        </Stack>

        {/* Endereço encontrado */}
        {endereco && (
          <Alert severity="success" variant="outlined">
            <Typography variant="body2">
              <strong>{endereco.localidade}/{endereco.uf}</strong><br />
              {endereco.logradouro} - {endereco.bairro}
            </Typography>
          </Alert>
        )}

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 2 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              Calculando frete...
            </Typography>
          </Box>
        )}

        {/* Opções de frete */}
        {opcoesFrete.length > 0 && !loading && (
          <>
            <Divider />
            <Typography variant="subtitle2" fontWeight={700}>
              Opções de entrega:
            </Typography>
            <RadioGroup
              value={freteSelecionado}
              onChange={(e) => handleFreteSelect(e.target.value)}
            >
              {opcoesFrete.map((opcao) => (
                <FormControlLabel
                  key={opcao.codigo}
                  value={opcao.codigo}
                  control={<Radio />}
                  label={
                    <Stack direction="row" justifyContent="space-between" sx={{ width: '100%', pr: 2 }}>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {opcao.nome}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {opcao.prazo === 0 
                            ? 'Imediato' 
                            : `${opcao.prazo} dia${opcao.prazo > 1 ? 's' : ''} úteis`
                          }
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={700}>
                        {opcao.valor === 0 
                          ? 'Grátis' 
                          : opcao.valor.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            })
                        }
                      </Typography>
                    </Stack>
                  }
                  sx={{ 
                    m: 0, 
                    p: 1,
                    borderRadius: 2,
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                />
              ))}
            </RadioGroup>
          </>
        )}

        {/* Erro */}
        {error && (
          <Alert severity="error" variant="outlined">
            {error}
          </Alert>
        )}
      </Stack>
    </Paper>
  );
}