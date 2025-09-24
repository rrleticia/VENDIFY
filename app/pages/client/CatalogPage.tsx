// CatalogPage.tsx
import {
  Box,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Typography,
  Divider,
  Grid,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "../../components/CatalogProductCard";
import { categories, products, badges } from "@common/mocks";
import { useSearchParams } from "react-router";
import { useCart } from "@common/contexts/"; // <<< integração
import type { ProductType } from "@common/types";
import { resolveCategoryParam, matchesQuery } from "@common/util/query.util";

type SortKey = "relevance" | "price_asc" | "price_desc";

interface IOrderFilterProps {
  showSort: boolean;
  sort: SortKey;
  setSort: (sort: SortKey) => void;
}

function OrderFilter({ showSort, sort, setSort }: IOrderFilterProps) {
  if (!showSort) return null;
  return (
    <ToggleButtonGroup
      value={sort}
      exclusive
      onChange={(_, v: SortKey | null) => v && setSort(v)}
      size="small"
    >
      <ToggleButton value="relevance">Relevância</ToggleButton>
      <ToggleButton value="price_asc">
        <ArrowUpwardIcon fontSize="small" sx={{ mr: 0.5 }} />
        Menor preço
      </ToggleButton>
      <ToggleButton value="price_desc">
        <ArrowDownwardIcon fontSize="small" sx={{ mr: 0.5 }} />
        Maior preço
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default function CatalogPage() {
  const [showSort, setShowSort] = useState<boolean>(false);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [active, setActive] = useState<string | null>(null);

  const [params, setParams] = useSearchParams();
  const q = (params.get("name") ?? "").trim();
  const cParam = params.get("categoryId");
  const isPromotion = params.get("promotion") === "true";

  // Barra de busca: visibilidade + valor local (sem form/submit)
  const [showSearch, setShowSearch] = useState<boolean>(!!q);
  const [searchInput, setSearchInput] = useState<string>(q);

  // Integração carrinho
  const { addToCart } = useCart();
  const handleAdd = (product: ProductType) => {
    void addToCart(product.id, 1); // no catálogo não há CEP/método ainda
  };

  // URL -> estado (categoria)
  useEffect(() => {
    const resolved = resolveCategoryParam(cParam);
    setActive((prev) => (prev === resolved ? prev : resolved));
  }, [cParam]);

  // Sincroniza o texto do input quando ?name muda via chips/botões
  useEffect(() => {
    setSearchInput(q);
    if (q && !showSearch) setShowSearch(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  // helpers: mexer na URL (sem submit)
  const setCategoryParam = (cat: string | null) => {
    const next = new URLSearchParams(params);
    if (!cat) next.delete("categoryId");
    else next.set("categoryId", cat);
    setParams(next, { replace: true });
  };

  const applySearchParam = (value: string) => {
    const next = new URLSearchParams(params);
    const trimmed = value.trim();
    if (trimmed) next.set("name", trimmed);
    else next.delete("name");
    setParams(next, { replace: true });
  };

  const clearOnlyQuery = () => {
    const next = new URLSearchParams(params);
    next.delete("name");
    setParams(next, { replace: true });
  };

  // 1) filtro por busca
  const filteredByQuery = useMemo(() => {
    return products.filter((product: ProductType) => {
      const match = matchesQuery(product, q, isPromotion);
      const promoId = badges.find((b) => b.slug === "promo")?.id;
      const promoMatch =
        !isPromotion ||
        (promoId ? (product.badgeIds ?? []).includes(promoId) : false);
      return match && promoMatch;
    });
  }, [q, isPromotion]);

  // 2) contadores por categoria baseados na busca
  const countsByCategory = useMemo(() => {
    const map = new Map<string, number>();
    console.log("filteredByQuery", filteredByQuery);
    for (const p of filteredByQuery) {
      console.log(p);
      map.set(
        (p as ProductType).categoryId,
        (map.get((p as ProductType).categoryId) ?? 0) + 1
      );
    }
    console.log(map);
    return map;
  }, [filteredByQuery]);

  // 3) aplica categoria + sort
  const filtered = useMemo(() => {
    let arr = filteredByQuery.filter(
      (p) => !active || (p as ProductType).categoryId === active
    ) as ProductType[];
    if (sort === "price_asc") arr = [...arr].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") arr = [...arr].sort((a, b) => b.price - a.price);
    return arr;
  }, [filteredByQuery, active, sort]);

  const totalUnderQuery = filteredByQuery.length;
  const showing = filtered.length;

  return (
    <Box>
      {/* Toolbar fixa */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          py: 1.5,
          mb: 2,
          bgcolor: (t) =>
            t.palette.mode === "light"
              ? "background.paper"
              : "background.default",
          backdropFilter: "saturate(1.2) blur(6px)",
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          useFlexGap
          flexWrap="wrap"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <FilterAltIcon fontSize="small" />
            <Typography variant="subtitle2">Categorias</Typography>
          </Stack>

          {/* badge da busca */}
          {q && (
            <Chip
              label={`Buscando por “${q}”`}
              onDelete={(e) => {
                e.preventDefault();
                setSearchInput("");
                clearOnlyQuery();
              }}
              deleteIcon={<CloseIcon />}
              variant="outlined"
              size="small"
              sx={{ mr: 0.5 }}
            />
          )}

          {/* TODOS */}
          <Chip
            component="button"
            type="button"
            label={`Todos (${totalUnderQuery})`}
            color={!active ? "primary" : "default"}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              setCategoryParam(null);
            }}
            variant={!active ? "filled" : "outlined"}
            clickable
            size="small"
          />

          {/* CATEGORIAS */}
          {categories.map((c) => {
            const selected = active === c.id;
            const count = countsByCategory.get(c.id) ?? 0;
            return (
              <Chip
                key={c.id}
                component="button"
                type="button"
                label={`${c.name} (${count})`}
                color={selected ? "primary" : "default"}
                variant={selected ? "filled" : "outlined"}
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  setCategoryParam(c.id);
                }}
                onDelete={
                  selected
                    ? (e) => {
                        e.preventDefault();
                        setCategoryParam(null);
                      }
                    : undefined
                }
                deleteIcon={selected ? <CloseIcon /> : undefined}
                clickable
                size="small"
                sx={{ mr: 0.5 }}
              />
            );
          })}

          <Chip
            component="button"
            type="button"
            label="Promoções"
            color={isPromotion ? "primary" : "error"}
            variant={isPromotion ? "filled" : "outlined"}
            onClick={(e) => {
              e.preventDefault();
              const next = new URLSearchParams(params);
              if (isPromotion) next.delete("promotion");
              else next.set("promotion", "true");
              setParams(next, { replace: true });
            }}
            onDelete={
              isPromotion
                ? (e) => {
                    e.preventDefault();
                    const next = new URLSearchParams(params);
                    next.delete("promotion");
                    setParams(next, { replace: true });
                  }
                : undefined
            }
            deleteIcon={isPromotion ? <CloseIcon /> : undefined}
            clickable
            size="small"
            sx={{ mr: 0.5 }}
          />

          <Box sx={{ flex: 1 }} />

          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
              {q ? (
                <>
                  Buscando por <b>“{q}”</b> ·{" "}
                </>
              ) : null}
              Exibindo <b>{showing}</b> {showing === 1 ? "item" : "itens"}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton
                type="button"
                aria-label={showSearch ? "Fechar busca" : "Abrir busca"}
                onClick={() => setShowSearch((v) => !v)}
              >
                <SearchIcon fontSize="small" />
              </IconButton>

              <IconButton type="button" onClick={() => setShowSort((v) => !v)}>
                <SortIcon fontSize="small" />
              </IconButton>
              <OrderFilter showSort={showSort} sort={sort} setSort={setSort} />
            </Stack>
          </Stack>

          {/* Barra de busca */}
          {showSearch && (
            <Box sx={{ fontSize: 10 }}>
              <Stack direction="row" spacing={1}>
                <TextField
                  fullWidth
                  size="small"
                  label="Buscar produtos"
                  placeholder="Digite nome, categoria ou marca…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applySearchParam(searchInput);
                    }
                  }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  type="button"
                  onClick={() => applySearchParam(searchInput)}
                >
                  Aplicar
                </Button>
                <Button
                  variant="text"
                  size="small"
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    clearOnlyQuery();
                  }}
                >
                  Limpar
                </Button>
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>

      {/* Grid v6 */}
      {filtered.length === 0 ? (
        <Box sx={{ py: 8, textAlign: "center", color: "text.secondary" }}>
          <Typography variant="h6" gutterBottom>
            Nada encontrado
          </Typography>
          <Typography variant="body2">
            Tente limpar os filtros ou ajustar a ordenação.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((product: ProductType) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <ProductCard
                product={product}
                // seu card já exibe tags abaixo por padrão; se tiver prop, mantenha
                onAddToCart={() => handleAdd(product)} // <<< integração
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
