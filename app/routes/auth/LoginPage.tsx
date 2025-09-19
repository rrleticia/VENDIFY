import { useAuthContext } from "@common/contexts/AuthContext";
import { useLoginForm } from "@common/hooks";
import { InputBox } from "@components/InputBox/InputBox";
import { InputBoxAdorned } from "@components/InputBox/InputBoxAdorned";
import { Typography, Stack, Button, Paper } from "@mui/material";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";

export default function LoginPage() {
  const navigate = useNavigate();

  const {
    formData,
    errors,
    handleInputChange,
    handleErrorChange,
    verifyErrors,
  } = useLoginForm();

  const { login } = useAuthContext();

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    // Verifica erros de preenchimento antes de fazer login
    if (verifyErrors()) {
      try {
        await login(formData.email, formData.password);
        navigate("/home");
      } catch (err) {
        // Exibe erro no formulário (por ex., email e senha errados)
        if (handleErrorChange) {
          handleErrorChange({
            email: "O e-mail ou a senha estão incorretos.",
            password: "O e-mail ou a senha estão incorretos.",
          });
        }
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        padding: 3,
        maxWidth: 420,
        marginX: "auto",
      }}
    >
      <Typography variant="h6" mb={2}>
        Entrar
      </Typography>
      <form onSubmit={onSubmit}>
        <Stack spacing={2}>
          <InputBox
            name={"email"}
            label={"E-mail"}
            required={true}
            disabled={loading}
            value={formData.email}
            error={Boolean(errors.email)}
            helperText={errors.email || ""}
            handleChange={handleInputChange}
          ></InputBox>
          <InputBoxAdorned
            name={"password"}
            label={"Senha"}
            required={true}
            disabled={loading}
            value={formData.password}
            error={Boolean(errors.password)}
            helperText={errors.password || ""}
            handleChange={handleInputChange}
          ></InputBoxAdorned>
          <Button type="submit" variant="contained">
            Entrar
          </Button>
        </Stack>
      </form>
      <Typography mt={2} variant="body2">
        Novo por aqui? <Link to="/register">Criar conta</Link>
      </Typography>
    </Paper>
  );
}
