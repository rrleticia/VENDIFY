export type UserType = {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthdate: string;
  avatar: AvatarType;
  address: AddressType[];
  userOrdersInfo: UserOrdersInfoType;
};

export type AvatarType = {
  imageUrl: string;
  imageAlt: string;
  lastUpdate: string;
};

export type AddressType = {
  id: string;
  label: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
};

export type UserOrdersInfoType = {
  ordersCount: number;
  points: number;
  cupons: number;
};
