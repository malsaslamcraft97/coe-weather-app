import React, { createContext, useContext, useState, useMemo } from "react";

type TabsContextType = {
  value: string;
  setValue: (v: string) => void;
};

const TabsContext = createContext<TabsContextType | null>(null);

type TabsProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  children: React.ReactNode;
};

export const Tabs = ({
  value,
  defaultValue,
  onChange,
  children,
}: TabsProps) => {
  const [internal, setInternal] = useState(defaultValue || "");

  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const setValue = (v: string) => {
    if (!isControlled) setInternal(v);
    onChange?.(v);
  };

  const ctx = useMemo(() => ({ value: current, setValue }), [current]);

  return <TabsContext.Provider value={ctx}>{children}</TabsContext.Provider>;
};

Tabs.List = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-2">{children}</div>
);

Tabs.Trigger = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => {
  const ctx = useContext(TabsContext)!;
  const active = ctx.value === value;

  return (
    <button
      onClick={() => ctx.setValue(value)}
      className={active ? "font-bold underline" : ""}
    >
      {children}
    </button>
  );
};

Tabs.Content = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => {
  const ctx = useContext(TabsContext)!;
  return ctx.value === value ? <div>{children}</div> : null;
};
