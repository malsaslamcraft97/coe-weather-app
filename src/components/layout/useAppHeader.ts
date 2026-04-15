import checkmarkIcon from "../../../starter-files/assets/images/icon-checkmark.svg";
import dropdownIcon from "../../../starter-files/assets/images/icon-dropdown.svg";
import unitsIcon from "../../../starter-files/assets/images/icon-units.svg";
import logo from "../../../starter-files/assets/images/logo.svg";

type UseAppHeaderArgs = {
  unitSystem: "metric" | "imperial";
};

export function useAppHeader({ unitSystem }: UseAppHeaderArgs) {
  const unitOptions = [
    {
      label: "Metric",
      value: "metric" as const,
      isSelected: unitSystem === "metric",
    },
    {
      label: "Imperial",
      value: "imperial" as const,
      isSelected: unitSystem === "imperial",
    },
  ];

  return {
    logo,
    unitsIcon,
    dropdownIcon,
    checkmarkIcon,
    unitOptions,
  };
}
