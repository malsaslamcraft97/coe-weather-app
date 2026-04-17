import React, { createContext, useContext, useState } from "react";

type TabsContextType = {
  value: string;
  setValue: (v: string) => void;
};

const TabsContext = createContext<TabsContextType | null>(null);

export const Tabs = ({ defaultValue, children }: any) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      {children}
    </TabsContext.Provider>
  );
};

Tabs.List = ({ children }: any) => <div>{children}</div>;

Tabs.Trigger = ({ value, children }: any) => {
  const ctx = useContext(TabsContext)!;

  return <button onClick={() => ctx.setValue(value)}>{children}</button>;
};

Tabs.Content = ({ value, children }: any) => {
  const ctx = useContext(TabsContext)!;
  return ctx.value === value ? children : null;
};
