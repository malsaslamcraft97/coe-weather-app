import { useState } from "react";
import { useAppContext } from "../../../context/AppProvider";
import { useAuthWizard } from "../../../hooks/useAuthWizard";

export function useLogin() {
  const { actions } = useAppContext();
  const { step, data, setField, next, prev } = useAuthWizard();
  const [error, setError] = useState("");

  const validateEmail = () => {
    if (!data.email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(data.email)) {
      return "Please enter a valid email";
    }
    return "";
  };

  const validatePassword = () => {
    if (!data.password) return "Password is required";
    if (data.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const handleNext = () => {
    const err = validateEmail();
    if (err) return setError(err);

    setError("");
    next();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const err = validatePassword();
    if (err) return setError(err);

    setError("");
    await actions.login();
  };

  return {
    step,
    data,
    error,
    setField,
    handleNext,
    handleSubmit,
    prev,
  };
}
