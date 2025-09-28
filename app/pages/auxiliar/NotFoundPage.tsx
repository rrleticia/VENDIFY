import { Box, Button, Typography, Container } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
    >
      <Box
        textAlign="center"
        width="100%"
        py={6}
        px={2}
        sx={{
          backgroundColor: "default.paper",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Página não encontrada
        </Typography>
        <Typography variant="body1" gutterBottom color="text.secondary">
          A página que você está tentando acessar não existe ou foi movida.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          size="large"
          sx={{ mt: 3 }}
        >
          Voltar ao início
        </Button>
      </Box>
    </Container>
  );
}
