import { useLoginForm } from "@common/hooks";
import { InputBox } from "@components/InputBox/InputBox";
import { InputBoxAdorned } from "@components/InputBox/InputBoxAdorned";
import {
  Typography,
  Stack,
  Button,
  Paper,
  Container,
  Box,
} from "@mui/material";
import { useState } from "react";
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

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (event: React.FormEvent) => {
    setLoading(true);
    event.preventDefault();
    if (verifyErrors()) {
      //   const result = await login(formData.email, formData.password);
      //   if (result) navigate("/home");
      navigate("/home");
    } else {
      if (handleErrorChange) {
        handleErrorChange({
          email: "The e-mail or password are incorrect.",
          password: "The e-mail or password are incorrect.",
        });
      }
    }
    setLoading(false);
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
