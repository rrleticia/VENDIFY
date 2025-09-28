export type UserType = {
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  birth?: string; // yyyy-mm-dd
  avatar?: string;
  newsletter?: boolean;
  twoFA?: boolean;
  marketingPush?: boolean;
  marketingEmail?: boolean;
  marketingSMS?: boolean;
};
