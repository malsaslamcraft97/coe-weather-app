import { useEffect, useState } from "react";

export const DataFetcher = ({ fetcher, children }: any) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetcher().then(setData);
  }, [fetcher]);

  return children({ data });
};
