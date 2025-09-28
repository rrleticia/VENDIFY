import {
  getProductById,
  getRelatedProducts,
  calcFreightForOptions,
} from "@app/services/api/ProductService";
import {
  type ShippingMethodId,
  type FreightQuote,
  type ShippingOption,
  type ProductType,
} from "@common/types";

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
  product: ProductType | null;
  related: ProductType[];
  shipping: ShippingMethodId;
  cep: string;
  freteLoading: boolean;
  fretes: Partial<FreightMap>;
  error?: string;
}

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_PRODUCT"; payload: ProductType | null }
  | { type: "SET_RELATED"; payload: ProductType[] }
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
    loading: true,
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
      dispatch({
        type: "SET_PRODUCT",
        payload: product as unknown as ProductType,
      });

      const initialShipping =
        (product as any)?.shippingOptions?.[0]?.id ??
        ("pickup" as ShippingMethodId);
      dispatch({ type: "SET_SHIPPING", payload: initialShipping });

      const related = await getRelatedProducts(
        (product as any)?.category,
        (product as any)?.id
      );
      dispatch({
        type: "SET_RELATED",
        payload: related as unknown as ProductType[],
      });
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
    if (!state.product) return;
    dispatch({ type: "SET_FRETE_LOADING", payload: true });
    try {
      const options = (
        state.product.shippingOptions?.length
          ? state.product.shippingOptions
          : DEFAULT_OPTIONS
      ) as ShippingOption[];
      const quotes = await calcFreightForOptions(options, state.cep);
      dispatch({ type: "SET_FRETES", payload: quotes as any });
    } finally {
      dispatch({ type: "SET_FRETE_LOADING", payload: false });
    }
  }, [state.product, state.cep]);

  const total = useMemo(() => {
    const base = state.product?.price ?? 0;
    const extra = state.fretes[state.shipping]?.price ?? 0;
    return base + extra;
  }, [state.product, state.fretes, state.shipping]);

  const value: IProductDetailsContextProps = useMemo(
    () => ({
      state,
      loadById,
      updateCep,
      selectShipping,
      calcFreight,
      total,
    }),
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
