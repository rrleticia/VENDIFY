import { useMemo } from "react";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Button,
  Paper,
  Chip,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Rating,
  TextField,
  Divider,
} from "@mui/material";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PixRoundedIcon from "@mui/icons-material/PixRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import DiscountRoundedIcon from "@mui/icons-material/DiscountRounded";
import { Link as RouterLink } from "react-router";

// ---------------- Mock ----------------
type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  rating: number;
  badge?: "Novo" | "Promo" | "Mais vendido";
};

const PRODUCTS: Product[] = [
  {
    id: 101,
    name: "Fone Bluetooth XY-300",
    image:
      "https://images.unsplash.com/photo-1518449955429-6f0de8b9aa16?q=80&w=1400&auto=format&fit=crop",
    price: 149.9,
    rating: 4.5,
    badge: "Promo",
  },
  {
    id: 102,
    name: "Teclado Mecânico Aurora",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1400&auto=format&fit=crop",
    price: 299.0,
    rating: 4.8,
    badge: "Mais vendido",
  },
  {
    id: 103,
    name: "Mouse Gamer Helios",
    image:
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1400&auto=format&fit=crop",
    price: 189.5,
    rating: 4.2,
    badge: "Novo",
  },
  {
    id: 104,
    name: "Mochila Urbana Pro",
    image:
      "https://images.unsplash.com/photo-1544937950-fa07a98d237f?q=80&w=1400&auto=format&fit=crop",
    price: 219.9,
    rating: 4.6,
  },
];

const CATEGORIES = [
  { slug: "acessorios", label: "Acessórios" },
  { slug: "teclados", label: "Teclados" },
  { slug: "mouses", label: "Mouses" },
  { slug: "mochilas", label: "Mochilas" },
  { slug: "escritorio", label: "Escritório" },
];

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ---------------- Small Components ----------------
function StatBadge({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        display: "flex",
        gap: 1.5,
        alignItems: "center",
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          bgcolor: "action.hover",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography fontWeight={700}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
    </Paper>
  );
}

function ProductCard({ p }: { p: Product }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ position: "relative" }}>
        {p.badge && (
          <Chip
            size="small"
            color={
              p.badge === "Promo"
                ? "error"
                : p.badge === "Novo"
                  ? "primary"
                  : "success"
            }
            label={p.badge}
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              zIndex: 1,
              borderRadius: 1.5,
            }}
          />
        )}
        <CardMedia
          component="img"
          src={p.image}
          alt={p.name}
          sx={{ height: 210, objectFit: "cover" }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography noWrap fontWeight={700}>
          {p.name}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
          <Rating name="read-only" value={p.rating} readOnly size="small" />
          <Typography variant="caption" color="text.secondary">
            {p.rating.toFixed(1)}
          </Typography>
        </Stack>
        <Typography sx={{ mt: 1.5 }} variant="h6">
          {formatBRL(p.price)}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          component={RouterLink}
          to={`/product/${p.id}`}
          endIcon={<ArrowForwardRoundedIcon />}
        >
          Ver produto
        </Button>
      </CardActions>
    </Card>
  );
}

// ---------------- Page ----------------
export default function HomePage() {
  const featured = useMemo(() => PRODUCTS.slice(0, 4), []);

  return (
    <Box>
      {/* HERO */}
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 360, md: 460 },
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
          borderRadius: { xs: 0, md: 4 },
          mx: { md: 2 },
          mt: { md: 2 },
        }}
      >
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1600&auto=format&fit=crop"
          alt="Hero"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.6)",
          }}
        />
        <Container sx={{ position: "relative", zIndex: 1 }}>
          <Grid
            container
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Grid sx={{ xs: 12, md: 7 }}>
              <Stack gap={2}>
                <Chip
                  icon={<DiscountRoundedIcon />}
                  label="Semana de Ofertas • até 30% OFF"
                  color="default"
                  sx={{
                    width: "fit-content",
                    bgcolor: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(4px)",
                    color: "common.white",
                    borderRadius: 2,
                  }}
                />
                <Typography
                  variant="h3"
                  color="common.white"
                  fontWeight={800}
                  lineHeight={1.1}
                >
                  Tudo para seu setup e dia a dia
                </Typography>
                <Typography color="grey.200" sx={{ maxWidth: 640 }}>
                  Produtos selecionados com frete local, PIX e retirada em loja.
                  Poucos itens, escolhas certeiras.
                </Typography>
                <Stack direction="row" gap={1.5} sx={{ mt: 1 }}>
                  <Button
                    variant="contained"
                    size="large"
                    component={RouterLink}
                    to="/catalog"
                  >
                    Ver catálogo
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    component={RouterLink}
                    to="/promocoes"
                  >
                    Promoções
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* BARRA DESTAQUES (PIX, Frete, Retirada, Cartão) */}
      <Container sx={{ mt: 3 }}>
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
            <StatBadge
              icon={<PixRoundedIcon />}
              title="Pague no PIX"
              subtitle="Aprovação em segundos"
            />
          </Grid>
          <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
            <StatBadge
              icon={<LocalShippingRoundedIcon />}
              title="Frete Local"
              subtitle="Entregas rápidas na cidade"
            />
          </Grid>
          <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
            <StatBadge
              icon={<StorefrontRoundedIcon />}
              title="Retire na Loja"
              subtitle="Retirada sem custo"
            />
          </Grid>
          <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
            <StatBadge
              icon={<CreditCardRoundedIcon />}
              title="Cartões"
              subtitle="Visa, Master, Elo e mais"
            />
          </Grid>
        </Grid>
      </Container>

      {/* CATEGORIAS */}
      <Container sx={{ mt: 5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h5" fontWeight={800}>
            Navegue por categorias
          </Typography>
          <Button
            component={RouterLink}
            to="/catalog"
            endIcon={<ArrowForwardRoundedIcon />}
          >
            Ver tudo
          </Button>
        </Stack>
        <Stack direction="row" gap={1} flexWrap="wrap">
          {CATEGORIES.map((c) => (
            <Chip
              key={c.slug}
              label={c.label}
              component={RouterLink}
              to={`/category/${c.slug}`}
              clickable
              sx={{
                py: 1,
                px: 1,
                borderRadius: 2,
                fontWeight: 600,
              }}
              variant="outlined"
            />
          ))}
        </Stack>
      </Container>

      {/* PRODUTOS EM DESTAQUE */}
      <Container sx={{ mt: 5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h5" fontWeight={800}>
            Destaques de hoje
          </Typography>
          <Button
            component={RouterLink}
            to="/promocoes"
            endIcon={<ArrowForwardRoundedIcon />}
          >
            Ver promoções
          </Button>
        </Stack>

        <Grid container spacing={2}>
          {featured.map((p) => (
            <Grid key={p.id} sx={{ xs: 12, sm: 6, md: 3 }}>
              <ProductCard p={p} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* BANNER PROMOCIONAL */}
      <Container sx={{ mt: 6 }}>
        <Paper
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(16,185,129,0.1))",
            border: "1px solid",
            borderColor: "divider",
          }}
          variant="outlined"
        >
          <Grid container sx={{ alignItems: "center" }}>
            <Grid sx={{ xs: 12, md: 8 }}>
              <Typography variant="h5" fontWeight={800}>
                Cupom “VEM10” — 10% OFF
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mt: 0.5, maxWidth: 640 }}
              >
                Use no carrinho para garantir o desconto. Válido para itens
                selecionados.
              </Typography>
              <Grid>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="flex-start"
                  gap={2}
                  sx={{ mt: { xs: 2, md: 0 }, pt: 2 }}
                >
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to="/catalog"
                  >
                    Usar agora
                  </Button>
                  <Button
                    variant="outlined"
                    component={RouterLink}
                    to="/regras-de-cupom"
                  >
                    Regras
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* COMO FUNCIONA */}
      <Container sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>
          Como funciona
        </Typography>
        <Grid container spacing={2}>
          <Grid sx={{ xs: 12, md: 4 }}>
            <Paper
              variant="outlined"
              sx={{ p: 3, borderRadius: 3, height: "100%" }}
            >
              <Typography variant="h6" fontWeight={700}>
                1. Escolha
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                Selecione poucos itens, mas certeiros. Nós destacamos o
                essencial.
              </Typography>
            </Paper>
          </Grid>
          <Grid sx={{ xs: 12, md: 4 }}>
            <Paper
              variant="outlined"
              sx={{ p: 3, borderRadius: 3, height: "100%" }}
            >
              <Typography variant="h6" fontWeight={700}>
                2. Pague
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                PIX para aprovação imediata ou cartões em até 12x (sujeito a
                condições).
              </Typography>
            </Paper>
          </Grid>
          <Grid sx={{ xs: 12, md: 4 }}>
            <Paper
              variant="outlined"
              sx={{ p: 3, borderRadius: 3, height: "100%" }}
            >
              <Typography variant="h6" fontWeight={700}>
                3. Receba
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                Frete local rápido, retirada em loja ou envio por
                transportadora.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* DEPOIMENTOS / PROVA SOCIAL */}
      <Container sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>
          Quem comprou, aprovou
        </Typography>
        <Grid container spacing={2}>
          {[
            {
              name: "Letícia",
              text: "Entrega super rápida e os produtos são exatamente como no site.",
            },
            {
              name: "Ronaldd",
              text: "Paguei no PIX e retirei na loja no mesmo dia. Muito prático!",
            },
            {
              name: "Hanani",
              text: "Poucos itens, mas bem escolhidos. Gostei da curadoria!",
            },
          ].map((d, i) => (
            <Grid key={i} sx={{ xs: 12, md: 4 }}>
              <Paper
                variant="outlined"
                sx={{ p: 3, borderRadius: 3, height: "100%" }}
              >
                <Rating value={5} readOnly size="small" />
                <Typography sx={{ mt: 1 }}>{d.text}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1.5 }}
                >
                  — {d.name}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* NEWSLETTER */}
      <Container sx={{ mt: 6, mb: 8 }}>
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" fontWeight={800}>
            Receba novidades e descontos
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Assine e ganhe ofertas exclusivas (mock).
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} gap={1.5}>
            <TextField fullWidth placeholder="Seu e-mail" />
            <Button variant="contained" size="large">
              Assinar
            </Button>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" color="text.secondary">
            Ao assinar, você concorda em receber e-mails ocasionais. Você pode
            cancelar quando quiser.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
