export type FormHookType = {
  formData: any;
  errors: any;
  handleFormData: (value: any) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleErrorChange?: (form: any) => void;
  verifyErrors: () => boolean;
  resetForm: (data?: any) => void;
};
