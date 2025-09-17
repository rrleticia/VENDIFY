import { useRegisterForm } from "@common/hooks/forms/RegisterForm";
import { InputBox } from "@components/InputBox/InputBox";
import { InputBoxAdorned } from "@components/InputBox/InputBoxAdorned";
import {
  Paper,
  Button,
  Typography,
  Stack,
  Box,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Collapse,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ruleLenOk, ruleNoSeqOk } from "@common/util";

interface IRuleItemProps {
  ok: boolean;
  text: string;
}

function RuleItem({ ok, text }: IRuleItemProps) {
  return (
    <ListItem sx={{ paddingY: 0, paddingX: 0 }}>
      <ListItemIcon sx={{ minWidth: 30 }}>
        {ok ? (
          <CheckCircleIcon sx={{ color: "success.main", fontSize: 17 }} />
        ) : (
          <CancelIcon sx={{ color: "text.disabled", fontSize: 17 }} />
        )}
      </ListItemIcon>
      <ListItemText
        slotProps={{
          primary: {
            variant: "body2",
            fontSize: 13,
            color: ok ? "success.main" : "text.secondary",
          },
        }}
        primary={text}
      />
    </ListItem>
  );
}

interface IRuleList {
  showRules: boolean;
  password: string;
}

function RuleList({ showRules, password }: IRuleList) {
  if (showRules) {
    return (
      <Collapse in={showRules} timeout={300} unmountOnExit>
        <List sx={{ padding: 0 }}>
          <RuleItem
            ok={ruleLenOk(password)}
            text="Deve ter pelo menos 8 caracteres."
          />
          <RuleItem
            ok={ruleNoSeqOk(password)}
            text='Não pode ter sequências, como "123", nem caracteres repetidos, como "aaa".'
          />
        </List>
      </Collapse>
    );
  }
}

export default function RegisterPage() {
  const navigate = useNavigate();

  const { formData, errors, handleInputChange, verifyErrors } =
    useRegisterForm();

  const [loading, setLoading] = useState(false);
  const [acceptUpdates, setAcceptUpdates] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    setLoading(true);
    event.preventDefault();
    // você pode enviar acceptUpdates junto do formData se quiser
    const payload = { ...formData, acceptUpdates };

    if (verifyErrors()) {
      // await ModelOperation(...)
      // navigate("/home");
    }
    navigate("/home");
    setLoading(false);
  };

  return (
    <Container sx={{ display: "flex", flexDirection: "column" }}>
      {/* Fundo colorido que não interfere no conteúdo */}
      <Box
        sx={{
          position: "absolute",
          top: 76,
          left: 0,
          width: "100%",
          height: 360, // altura da faixa colorida
          bgcolor: "primary.light",
          zIndex: -1, // garante que fique atrás do conteúdo
        }}
      />

      <Typography
        variant="h4"
        fontWeight={600}
        sx={{
          marginBottom: 3,
          maxWidth: 420,
          mx: "auto",
          textAlign: "center",
        }}
      >
        {"Crie sua conta e compre com frete grátis!"}
      </Typography>
      <Paper
        variant="outlined"
        sx={{ paddingX: 3, paddingY: 5, maxWidth: 420, mx: "auto" }}
      >
        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            <InputBox
              name="name"
              label="Nome"
              required
              disabled={loading}
              value={formData.name}
              error={Boolean(errors.name)}
              helperText={errors.name || ""}
              handleChange={handleInputChange}
            />

            <InputBox
              name="email"
              label="E-mail"
              required
              disabled={loading}
              value={formData.email}
              error={Boolean(errors.email)}
              helperText={errors.email || ""}
              handleChange={handleInputChange}
            />

            <InputBox
              name="phone"
              label="Número"
              required
              disabled={loading}
              value={formData.phone}
              error={Boolean(errors.phone)}
              helperText={errors.phone || "DDD + número."}
              handleChange={handleInputChange}
            />

            <InputBoxAdorned
              name="password"
              label="Senha"
              required
              disabled={loading}
              value={formData.password}
              error={Boolean(errors.password)}
              helperText={errors.password || ""}
              handleChange={handleInputChange}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />

            <RuleList
              showRules={passwordFocused}
              password={formData.password}
            ></RuleList>

            {/* Checkbox de atualizações via SMS/WhatsApp */}
            <FormControlLabel
              sx={{ alignItems: "flex-start", paddingY: 0 }}
              control={
                <Checkbox
                  size="small"
                  checked={acceptUpdates}
                  onChange={(e) => setAcceptUpdates(e.target.checked)}
                  disabled={loading}
                />
              }
              label={
                <Typography
                  variant="body2"
                  fontWeight={400}
                  sx={{ color: "#BCBCBC", paddingTop: 0.5 }}
                >
                  Aceito que entrem em contato comigo por SMS e WhatsApp.
                </Typography>
              }
            />

            <Typography
              variant="body2"
              fontWeight={400}
              sx={{ paddingBottom: 2, color: "#BCBCBC" }}
            >
              Ao "Continuar", aceito os{" "}
              <Box
                component="span"
                sx={{ color: "primary.main", fontWeight: 500 }}
              >
                Termos e condições
              </Box>{" "}
              e autorizo o uso dos meus dados de acordo com a{" "}
              <Box
                component="span"
                sx={{ color: "primary.main", fontWeight: 500 }}
              >
                Declaração de privacidade
              </Box>
              {"."}
            </Typography>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
            >
              Cadastrar
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
