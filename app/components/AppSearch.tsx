import { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
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

const CATALOG_PATH = "/catalog";

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
        // Importante: garantir action="/catalog" quando for FormData
        onSearch(target, { replace: true, action: CATALOG_PATH });
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

    // Submete imediatamente SEM o parâmetro ?name e indo para /catalog
    clearTimer();
    const fd = new FormData(formRef.current);
    fd.delete("name");
    skipNextDebounceRef.current = true;
    onSearch(fd, { replace: true, action: CATALOG_PATH });
  };

  const handleSubmitClick = () => {
    if (!formRef.current) return;

    if (value.trim() === "") {
      const fd = new FormData(formRef.current);
      fd.delete("name");
      onSearch(fd, { replace: true, action: CATALOG_PATH });
    } else {
      // Mesmo com form, podemos reforçar a action
      onSearch(formRef.current, { replace: true, action: CATALOG_PATH });
    }
  };

  return (
    <Box sx={{ flex: 1, alignItems: "center" }}>
      <Form
        method="get"
        replace
        action={CATALOG_PATH} // <- SEMPRE envia para /catalog
        ref={formRef}
        onSubmit={(e) => {
          // Enter com vazio: remove ?name e continua em /catalog
          if (value.trim() === "" && formRef.current) {
            e.preventDefault();
            const fd = new FormData(formRef.current);
            fd.delete("name");
            onSearch(fd, { replace: true, action: CATALOG_PATH });
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
