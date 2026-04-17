import { useReducer } from "react";

type Step = number;

type State = {
  step: Step;
  data: {
    email: string;
    password: string;
    name?: string;
    confirmPassword?: string;
  };
};

type Action =
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "SET_FIELD"; field: string; value: string }
  | { type: "RESET" };

const initialState: State = {
  step: 0,
  data: {
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  },
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "NEXT":
      return { ...state, step: state.step + 1 };
    case "PREV":
      return { ...state, step: state.step - 1 };
    case "SET_FIELD":
      return {
        ...state,
        data: { ...state.data, [action.field]: action.value },
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function useAuthWizard() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    step: state.step,
    data: state.data,

    next: () => dispatch({ type: "NEXT" }),
    prev: () => dispatch({ type: "PREV" }),

    setField: (field: string, value: string) =>
      dispatch({ type: "SET_FIELD", field, value }),

    reset: () => dispatch({ type: "RESET" }),
  };
}
