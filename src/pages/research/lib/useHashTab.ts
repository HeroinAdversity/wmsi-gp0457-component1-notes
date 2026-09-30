import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function resolveTab<T extends string>(hash: string, ids: readonly T[], fallback: T): T {
  const h = hash.replace(/^#/, '').toLowerCase();
  return (ids as readonly string[]).includes(h) ? (h as T) : fallback;
}

export function useHashTab<T extends string>(ids: readonly T[], fallback: T): [T, (t: T) => void] {
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState<T>(() => resolveTab(location.hash, ids, fallback));
  useEffect(() => { setTab(resolveTab(location.hash, ids, fallback)); }, [location.hash, ids, fallback]);
  const change = (t: T) => { setTab(t); navigate({ hash: t }, { replace: true }); };
  return [tab, change];
}
