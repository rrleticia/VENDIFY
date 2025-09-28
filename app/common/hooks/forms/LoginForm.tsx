import { useState } from "react";
import { Validators } from "@common/schemas";
import type { FormHookType } from "@common/types/FormHookType";

export interface ILoginHookJson {
  email: string;
  password: string;
}

export const useLoginForm = (): FormHookType => {
  const [valid, setValid] = useState<boolean>(true);

  const [formData, setFormData] = useState<ILoginHookJson>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ILoginHookJson, string>>
  >({
    email: "",
    password: "",
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
    const { error } = Validators["LoginSchema"].validate(formData, {
      abortEarly: false, 
    });

    if (error) {
      setValid(false);
      const newErrors: Partial<Record<keyof ILoginHookJson, string>> = {};
      error.details.forEach((detail: any) => {
        const field = detail.path[0] as keyof ILoginHookJson;
        newErrors[field] = detail.message; 
      });
      setErrors(newErrors); 
      return false;
    } else {
      setValid(true);
      setErrors({});
      console.log("Form data is valid. Ready for submission:", formData);
      return true;
    }
  };

  const resetForm = () => {
    setValid(true);
    setFormData({
      email: "",
      password: "",
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
  };
};
