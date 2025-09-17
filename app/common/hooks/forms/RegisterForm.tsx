import { useState } from "react";
import { Validators } from "@common/schemas";
import type { FormHookType } from "@common/types/FormHookType";

export interface IRegisterHookJson {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export const useRegisterForm = (): FormHookType => {
  const [valid, setValid] = useState<boolean>(true);

  const [formData, setFormData] = useState<IRegisterHookJson>({
    name: "",
    email: "",
    phone: "+55",
    password: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof IRegisterHookJson, string>>
  >({ name: "", email: "", password: "" });

  // Handle input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear the error for the field being updated
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // Validate form data and set errors if any
  const verifyErrors = () => {
    const { error } = Validators["RegisterSchema"].validate(formData, {
      abortEarly: false, // Collect all errors
    });
    console.log(error);

    if (error) {
      const newErrors: Partial<Record<keyof IRegisterHookJson, string>> = {};
      error.details.forEach((detail: any) => {
        const field = detail.path[0] as keyof IRegisterHookJson; // Explicitly type the field as keyof IOwnerJson
        newErrors[field] = detail.message; // Assign error message to corresponding field
      });
      setErrors(newErrors); // Set all form errors
      return false; // Return false if there are validation errors
    } else {
      // No errors, clear the errors
      setErrors({});
      console.log("Form data is valid. Ready for submission:", formData);
      return true; // Return true if there are no validation errors
    }
  };

  const resetForm = () => {
    setValid(true);
    setFormData({
      name: "",
      email: "",
      phone: "+55",
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
