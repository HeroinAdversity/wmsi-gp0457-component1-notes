import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

/** The tab a page is showing, published by its tab bar so notes know where they belong. */
export interface ActiveTab { id: string; label: string }

const Ctx = createContext<{ tab: ActiveTab | null; setTab: (t: ActiveTab | null) => void }>({ tab: null, setTab: () => {} });

export function ActiveTabProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<ActiveTab | null>(null);
  return <Ctx.Provider value={{ tab, setTab }}>{children}</Ctx.Provider>;
}

export function useActiveTab(): ActiveTab | null {
  return useContext(Ctx).tab;
}

/** Called by a tab bar: publishes the active tab while mounted. */
export function usePublishTab(id: string, label: string) {
  const { setTab } = useContext(Ctx);
  useEffect(() => { setTab({ id, label }); }, [id, label, setTab]);
  useEffect(() => () => setTab(null), [setTab]);
}
