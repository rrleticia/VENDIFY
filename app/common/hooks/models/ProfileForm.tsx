import { useState } from "react";
import { Validators } from "@common/schemas";
import type { FormHookType } from "@common/types/FormHookType";

export interface IProfileHookJson {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthdate: string;
}

export const useProfileForm = (): FormHookType => {
  const [valid, setValid] = useState<boolean>(true);

  const [formData, setFormData] = useState<IProfileHookJson>({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    birthdate: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof IProfileHookJson, string>>
  >({ name: "", email: "", phone: "", cpf: "", birthdate: "" });

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
    const { error } = Validators["ProfileSchema"].validate(formData, {
      abortEarly: false,
    });
    console.log(error);

    if (error) {
      const newErrors: Partial<Record<keyof IProfileHookJson, string>> = {};
      error.details.forEach((detail: any) => {
        const field = detail.path[0] as keyof IProfileHookJson; 
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
        name: "",
        email: "",
        phone: "",
        cpf: "",
        birthdate: "",
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
