import { useState } from "react";
import { Validators } from "@common/schemas";
import type { FormHookType } from "@common/types/FormHookType";

export interface IRegisterHookJson {
  name: string;
  email: string;
  phone: string;
  password: string;
  acceptUpdates: boolean;
}

export const useRegisterForm = (): FormHookType => {
  const [valid, setValid] = useState<boolean>(true);

  const [formData, setFormData] = useState<IRegisterHookJson>({
    name: "",
    email: "",
    phone: "",
    password: "",
    acceptUpdates: false,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof IRegisterHookJson, string>>
  >({
    name: "",
    email: "",
    password: "",
    phone: "",
    acceptUpdates: "",
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

  const handleCheckedInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name } = event.target;
    setFormData({
      ...formData,
      [name]: event.target.checked,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const verifyErrors = () => {
    const { error } = Validators["RegisterSchema"].validate(formData, {
      abortEarly: false,
    });

    if (error) {
      console.log(error);
      const newErrors: Partial<Record<keyof IRegisterHookJson, string>> = {};
      error.details.forEach((detail: any) => {
        const field = detail.path[0] as keyof IRegisterHookJson; 
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

  const resetForm = () => {
    setValid(true);
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      acceptUpdates: false,
    });
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
    handleCheckedInputChange,
  };
};
