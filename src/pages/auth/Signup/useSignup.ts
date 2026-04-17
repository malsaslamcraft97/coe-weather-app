import { useState } from "react";
import { useAuthWizard } from "../../../hooks/useAuthWizard";
import { useAppContext } from "../../../context/AppProvider";

export function useSignup() {
  const { actions } = useAppContext();
  const { step, data, setField, next, prev, reset } = useAuthWizard();
  const [error, setError] = useState("");

  const validate = () => {
    if (step === 0 && !data.name) return "Name is required";

    if (step === 1) {
      if (!data.email) return "Email is required";
      if (!/\S+@\S+\.\S+/.test(data.email)) return "Invalid email";
    }

    if (step === 2) {
      if (!data.password) return "Password required";
      if (data.password.length < 6) return "Min 6 characters";
      if (data.password !== data.confirmPassword)
        return "Passwords do not match";
    }

    return "";
  };

  const handleNext = () => {
    const err = validate();
    if (err) return setError(err);
    setError("");
    next();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);

    setError("");
    await actions.login();
    reset();
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
