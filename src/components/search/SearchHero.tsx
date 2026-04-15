import type { FormEvent } from "react";
import styles from "../../App.module.scss";
import { useSearchHero } from "./useSearchHero";

type SearchHeroProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function SearchHero({
  query,
  onQueryChange,
  onSubmit,
}: SearchHeroProps) {
  const { title, placeholder, searchIcon } = useSearchHero();

  return (
    <section className={styles.hero}>
      <h1 className={styles.heroTitle}>{title}</h1>

      <form className={styles.searchForm} onSubmit={onSubmit}>
        <label className={styles.searchField}>
          <img src={searchIcon} alt="" />
          <span className={styles.srOnly}>Search location</span>
          <input
            type="search"
            name="location"
            placeholder={placeholder}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </label>
        <button className={styles.searchButton} type="submit">
          Search
        </button>
      </form>
    </section>
  );
}
