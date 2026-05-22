import { useState, useEffect } from 'react';

export interface Atleta {
  num: string;
  name: string;
  short: string;
  pos: string;
  photo: string | null;
  sales: number;
}

export interface ReceitaCanal {
  label: string;
  sub: string;
  valor: number;
}

export interface OrcamentoItem {
  label: string;
  sub: string;
  valor: number;
}

export interface ExtratoItem {
  data: string;
  desc: string;
  cat: string;
  tipo: 'ENTRADA' | 'SAÍDA';
  valor: number;
}

export interface CampanhaData {
  meta: number;
  arrecadado: number;
  gasto: number;
  atletas: Atleta[];
  receitas: ReceitaCanal[];
  orcamento: OrcamentoItem[];
  extrato: ExtratoItem[];
}

const DATA_URL = (import.meta.env.VITE_CAMPANHA_URL as string | undefined) ?? '/data/campanha.json';

export function useCampanha() {
  const [data, setData] = useState<CampanhaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(DATA_URL)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((d: CampanhaData) => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch((e: Error) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}
