// AppSearch.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Button,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Form, type SubmitFunction } from "react-router";

interface IAppSearchProps {
  search: string; // valor inicial (vem do loader: ?name=...)
  onSearch: SubmitFunction; // useSubmit() da página
  debounceMs?: number; // opcional (padrão 350ms)
  autoFocus?: boolean; // opcional (padrão true)
}

export default function AppSearch({
  search,
  onSearch,
  debounceMs = 350,
  autoFocus = true,
}: IAppSearchProps) {
  const [value, setValue] = useState(search ?? "");
  const formRef = useRef<HTMLFormElement | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextDebounceRef = useRef(false);

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const debouncedSubmit = useCallback(
    (target: HTMLFormElement | FormData) => {
      clearTimer();
      timerRef.current = setTimeout(() => {
        onSearch(target, { replace: true });
      }, debounceMs);
    },
    [onSearch, debounceMs]
  );

  // Reflete mudanças externas (ex.: voltar no histórico)
  useEffect(() => {
    setValue(search ?? "");
  }, [search]);

  // Dispara submit com debounce ao digitar
  useEffect(() => {
    if (!formRef.current) return;

    if (skipNextDebounceRef.current) {
      // Se acabamos de limpar e submetemos imediatamente, ignorar este ciclo.
      skipNextDebounceRef.current = false;
      return;
    }

    // Se valor vazio, remover "name" da query antes de submeter.
    const target =
      value.trim() !== ""
        ? formRef.current
        : (() => {
            const fd = new FormData(formRef.current!);
            fd.delete("name");
            return fd;
          })();

    debouncedSubmit(target);
  }, [value, debouncedSubmit]);

  const handleClear = () => {
    setValue("");
    if (!formRef.current) return;

    // Submete imediatamente SEM o parâmetro ?name
    clearTimer();
    const fd = new FormData(formRef.current);
    fd.delete("name");
    skipNextDebounceRef.current = true;
    onSearch(fd, { replace: true });
  };

  const handleSubmitClick = () => {
    if (!formRef.current) return;
    // Clique em "Buscar": se vazio, removemos 'name' da URL;
    // senão, submetemos o form normalmente.
    if (value.trim() === "") {
      const fd = new FormData(formRef.current);
      fd.delete("name");
      onSearch(fd, { replace: true });
    } else {
      onSearch(formRef.current, { replace: true });
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        alignItems: "center",
      }}
    >
      <Form
        method="get"
        replace
        ref={formRef}
        onSubmit={(e) => {
          // Garantir remoção do ?name quando vazio ao pressionar Enter.
          if (value.trim() === "" && formRef.current) {
            e.preventDefault();
            const fd = new FormData(formRef.current);
            fd.delete("name");
            onSearch(fd, { replace: true });
          }
        }}
      >
        <Stack direction="row" gap={1}>
          <TextField
            fullWidth
            name="name" // ESSENCIAL para ?name=...
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus={autoFocus}
            placeholder="Buscar por produto, categoria, marca..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: value ? (
                  <InputAdornment position="end">
                    <Tooltip title="Limpar">
                      <IconButton
                        aria-label="limpar busca"
                        onClick={handleClear}
                        edge="end"
                        type="button" // evita submit acidental
                      >
                        <CloseRoundedIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ) : null,
              },
            }}
          />

          <Button
            variant="contained"
            type="button"
            size="small"
            onClick={handleSubmitClick}
            aria-label="buscar"
          >
            Buscar
          </Button>
        </Stack>
      </Form>
    </Box>
  );
}
