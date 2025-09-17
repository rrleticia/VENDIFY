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
    const { error } = Validators["LoginSchema"].validate(formData, {
      abortEarly: false, // Collect all errors
    });

    if (error) {
      setValid(false);
      const newErrors: Partial<Record<keyof ILoginHookJson, string>> = {};
      error.details.forEach((detail: any) => {
        const field = detail.path[0] as keyof ILoginHookJson; // Explicitly type the field as keyof ILoginJson
        newErrors[field] = detail.message; // Assign error message to corresponding field
      });
      setErrors(newErrors); // Set all form errors
      return false;
    } else {
      setValid(true);
      // If no errors, clear errors and handle form submission
      setErrors({});
      console.log("Form data is valid. Ready for submission:", formData);
      // Proceed with form submission logic, e.g., API call
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
