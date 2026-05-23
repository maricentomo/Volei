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
const TTL = 5 * 60 * 1000; // 5 minutos

// Cache e deduplicação compartilhados entre todos os componentes
let cache: { data: CampanhaData; ts: number } | null = null;
let inflight: Promise<CampanhaData> | null = null;

function fetchCampanha(): Promise<CampanhaData> {
  if (cache && Date.now() - cache.ts < TTL) {
    return Promise.resolve(cache.data);
  }
  if (inflight) return inflight;

  inflight = fetch(DATA_URL)
    .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then((d: CampanhaData) => {
      cache = { data: d, ts: Date.now() };
      inflight = null;
      return d;
    })
    .catch((e: Error) => {
      inflight = null;
      throw e;
    });

  return inflight;
}

export function useCampanha() {
  const [data, setData] = useState<CampanhaData | null>(cache?.data ?? null);
  const [loading, setLoading] = useState(cache === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache && Date.now() - cache.ts < TTL) {
      setData(cache.data);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchCampanha()
      .then(d => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch((e: Error) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}
