import { useState } from "react";
import { Validators } from "@common/schemas";
import type { FormHookType } from "@common/types/FormHookType";

export interface IAddressHookJson {
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
}

export const useAddressForm = (): FormHookType => {
  const [valid, setValid] = useState<boolean>(true);

  const [formData, setFormData] = useState<IAddressHookJson>({
    id: "",
    label: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: false,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof IAddressHookJson, string>>
  >({
    id: "",
    label: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const verifyErrors = () => {
    const { error } = Validators["AddressSchema"].validate(formData, {
      abortEarly: false,
    });
    console.log(error);

    if (error) {
      const newErrors: Partial<Record<keyof IAddressHookJson, string>> = {};
      error.details.forEach((detail: any) => {
        const field = detail.path[0] as keyof IAddressHookJson;
        newErrors[field] = detail.message; 
      });
      setErrors(newErrors); 
      return false; 
    } else {
      setErrors({});
      console.log("Form data is valid. Ready for submission:", formData);
      return true;
    }
  };

  const resetForm = (data: any) => {
    setValid(true);

    if (data) {
      setFormData(data);
    } else {
      setFormData({
        id: "",
        label: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
        isDefault: false,
      });
    }
    setErrors({});
  };

  return {
    formData,
    errors,
    handleFormData: setFormData,
    handleInputChange,
    handleErrorChange: setErrors,
    verifyErrors,
    resetForm,
  };
};
