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
import SearchIcon from "@mui/icons-material/Search"; // <- corrigido
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Form, useSearchParams, useSubmit } from "react-router";

const CATALOG_PATH = "/catalog";

export default function AppSearch({
  debounceMs = 350,
  autoFocus = true,
}: {
  debounceMs?: number;
  autoFocus?: boolean;
}) {
  const [params] = useSearchParams();
  const initialName = params.get("name")?.toLowerCase() ?? "";

  const submit = useSubmit();
  const [value, setValue] = useState(initialName);
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
        submit(target, { replace: true, action: CATALOG_PATH });
      }, debounceMs);
    },
    [submit, debounceMs]
  );

  // cleanup do debounce ao desmontar
  useEffect(() => () => clearTimer(), []);

  // reflete mudanças externas na URL (ex.: back/forward)
  useEffect(() => {
    setValue(initialName);
  }, [initialName]);

  useEffect(() => {
    if (!formRef.current) return;
    if (skipNextDebounceRef.current) {
      skipNextDebounceRef.current = false;
      return;
    }
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
    clearTimer();
    const fd = new FormData(formRef.current);
    fd.delete("name");
    skipNextDebounceRef.current = true;
    submit(fd, { replace: true, action: CATALOG_PATH });
  };

  const handleSubmitClick = () => {
    if (!formRef.current) return;
    if (value.trim() === "") {
      const fd = new FormData(formRef.current);
      fd.delete("name");
      submit(fd, { replace: true, action: CATALOG_PATH });
    } else {
      submit(formRef.current, { replace: true, action: CATALOG_PATH });
    }
  };

  return (
    <Box sx={{ flex: 1, alignItems: "center" }}>
      <Form
        method="get"
        replace
        action={CATALOG_PATH}
        ref={formRef}
        onSubmit={(e) => {
          if (value.trim() === "" && formRef.current) {
            e.preventDefault();
            const fd = new FormData(formRef.current);
            fd.delete("name");
            submit(fd, { replace: true, action: CATALOG_PATH });
          }
        }}
      >
        <Stack direction="row" gap={1}>
          <TextField
            fullWidth
            name="name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus={autoFocus}
            placeholder="Buscar por produto, categoria, marca..."
            InputProps={{
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
                      type="button"
                    >
                      <CloseRoundedIcon />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ) : null,
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
