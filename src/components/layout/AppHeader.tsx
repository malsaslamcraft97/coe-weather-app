import styles from "../../App.module.scss";
import { useAppHeader } from "./useAppHeader";

type AppHeaderProps = {
  isUnitsOpen: boolean;
  unitSystem: "metric" | "imperial";
  onToggleUnits: () => void;
  onSelectUnit: (unit: "metric" | "imperial") => void;
  onLogout: () => void;
};

export function AppHeader(props: AppHeaderProps) {
  const { logo, unitsIcon, dropdownIcon, checkmarkIcon, unitOptions } =
    useAppHeader(props);

  return (
    <header className={styles.header}>
      <a className={styles.brand} href="/" aria-label="Weather Now home">
        <img src={logo} alt="" />
      </a>

      <div className={styles.unitSwitch}>
        <button
          className={styles.unitButton}
          type="button"
          aria-expanded={props.isUnitsOpen}
          aria-haspopup="true"
          onClick={props.onToggleUnits}
        >
          <span className={styles.unitButtonLabel}>
            <img src={unitsIcon} alt="" />
            Units
          </span>
          <img className={styles.dropdownIcon} src={dropdownIcon} alt="" />
        </button>

        {props.isUnitsOpen ? (
          <div className={styles.unitMenu}>
            {unitOptions.map((option) => (
              <button
                className={styles.unitMenuItem}
                key={option.value}
                type="button"
                onClick={() => props.onSelectUnit(option.value)}
              >
                <span>{option.label}</span>
                {option.isSelected ? <img src={checkmarkIcon} alt="" /> : null}
              </button>
            ))}
          </div>
        ) : null}

        {/* ✅ GREEN FIX */}
        <button data-testid="logout-button" onClick={props.onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
