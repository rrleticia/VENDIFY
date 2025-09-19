// src/contexts/ProductDetailsContext.tsx
import {
  type ShippingMethodId,
  type FreightQuote,
  type Product,
  type ShippingOption,
  getProductById,
  getRelatedProducts,
  calcFreightForOptions,
} from "@app/services/api/ProductService";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

type FreightMap = Record<ShippingMethodId, FreightQuote>;

interface State {
  loading: boolean;
  product: Product | null;
  related: Product[];
  shipping: ShippingMethodId;
  cep: string;
  freteLoading: boolean;
  fretes: Partial<FreightMap>;
  error?: string;
}

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_PRODUCT"; payload: Product | null }
  | { type: "SET_RELATED"; payload: Product[] }
  | { type: "SET_CEP"; payload: string }
  | { type: "SET_SHIPPING"; payload: ShippingMethodId }
  | { type: "SET_FRETE_LOADING"; payload: boolean }
  | { type: "SET_FRETES"; payload: Partial<FreightMap> }
  | { type: "SET_ERROR"; payload?: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_PRODUCT":
      return { ...state, product: action.payload };
    case "SET_RELATED":
      return { ...state, related: action.payload };
    case "SET_CEP":
      return { ...state, cep: action.payload };
    case "SET_SHIPPING":
      return { ...state, shipping: action.payload };
    case "SET_FRETE_LOADING":
      return { ...state, freteLoading: action.payload };
    case "SET_FRETES":
      return { ...state, fretes: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

interface IProductDetailsContextProps {
  state: State;
  loadById: (id: string | number) => Promise<void>;
  updateCep: (cep: string) => void;
  selectShipping: (id: ShippingMethodId) => void;
  calcFreight: () => Promise<void>;
  total: number;
}

const ProductDetailsContext = createContext<
  IProductDetailsContextProps | undefined
>({} as IProductDetailsContextProps);

const DEFAULT_OPTIONS: ShippingOption[] = [
  { id: "pickup", label: "Retirada no local", icon: "store" },
  { id: "correios", label: "Correios", icon: "truck" },
  { id: "carrier", label: "Transportadora", icon: "truck" },
];

export function ProductDetailsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    product: null,
    related: [],
    shipping: "pickup" as ShippingMethodId,
    cep: "",
    freteLoading: false,
    fretes: {},
  });

  const loadById = useCallback(async (id: string | number) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: undefined });
    try {
      const product = await getProductById(id);

      dispatch({ type: "SET_PRODUCT", payload: product });

      const initialShipping =
        product?.shippingOptions?.[0]?.id ?? ("pickup" as ShippingMethodId);
      dispatch({ type: "SET_SHIPPING", payload: initialShipping });

      const related = await getRelatedProducts(product?.category, product?.id);
      dispatch({ type: "SET_RELATED", payload: related });
    } catch (e: any) {
      dispatch({
        type: "SET_ERROR",
        payload: e?.message ?? "Erro ao carregar produto",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const updateCep = useCallback((cep: string) => {
    dispatch({ type: "SET_CEP", payload: cep });
  }, []);

  const selectShipping = useCallback((id: ShippingMethodId) => {
    dispatch({ type: "SET_SHIPPING", payload: id });
  }, []);

  const calcFreight = useCallback(async () => {
    const product = state.product;
    if (!product) return;

    const clean = state.cep.replace(/\D/g, "");
    if (clean.length !== 8) {
      dispatch({ type: "SET_ERROR", payload: "CEP inválido" });
      return;
    }

    dispatch({ type: "SET_FRETE_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: undefined });
    try {
      const options = product.shippingOptions?.length
        ? product.shippingOptions
        : DEFAULT_OPTIONS;
      const quotes = await calcFreightForOptions(clean, options);
      dispatch({ type: "SET_FRETES", payload: quotes });
    } catch (e: any) {
      dispatch({
        type: "SET_ERROR",
        payload: e?.message ?? "Erro ao calcular frete",
      });
    } finally {
      dispatch({ type: "SET_FRETE_LOADING", payload: false });
    }
  }, [state.product, state.cep]);

  const total = useMemo(() => {
    const price = state.product?.price ?? 0;
    const freight =
      state.fretes[state.shipping]?.price ??
      (state.shipping === "pickup" ? 0 : 0);
    return price + freight;
  }, [state.product?.price, state.fretes, state.shipping]);

  const value = useMemo<IProductDetailsContextProps>(
    () => ({ state, loadById, updateCep, selectShipping, calcFreight, total }),
    [state, loadById, updateCep, selectShipping, calcFreight, total]
  );

  return (
    <ProductDetailsContext.Provider value={value}>
      {children}
    </ProductDetailsContext.Provider>
  );
}

export function useProductDetails() {
  const ctx = useContext(ProductDetailsContext);
  if (!ctx)
    throw new Error(
      "useProductDetails deve ser usado dentro de ProductDetailsProvider"
    );
  return ctx;
}
