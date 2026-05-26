import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCampanha } from '../lib/useCampanha';

const CIRC = 263.9;
const W = 800, H = 220, PAD = 20;
const CAMP_START_MS = new Date(2026, 3, 12).getTime();
const CAMP_END_MS   = new Date(2026, 6, 15).getTime();
const MS_PER_WEEK   = 7 * 24 * 60 * 60 * 1000;

function parseDateMs(s: string): number | null {
  if (!s) return null;
  const p = s.split('/');
  if (p.length !== 3) return null;
  return new Date(Number(p[2]), Number(p[1]) - 1, Number(p[0])).getTime();
}

function buildChart(vals: number[]) {
  const STEP = (W - PAD * 2) / (vals.length - 1);
  const MX = Math.max(...vals, 1);
  const pts = vals.map((d, i) => [
    PAD + i * STEP,
    H - PAD - (d / MX) * (H - PAD * 2 - 20),
  ]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = line + ` L${pts[pts.length-1][0].toFixed(1)} ${H-PAD} L${pts[0][0].toFixed(1)} ${H-PAD} Z`;
  return { pts, line, area };
}

export default function Ranking() {
  const { data, loading } = useCampanha();
  const RANK = data
    ? [...data.atletas].sort((a, b) => b.sales - a.sales)
    : [];

  // Grupos de empate: cada posição do pódio reúne todos com mesmo nº de vendas
  const uniqueSales = [...new Set(RANK.map(a => a.sales))].sort((a, b) => b - a);
  const rankGroups = uniqueSales.slice(0, 3).map((sales, i) => ({
    place: i + 1,
    sales,
    athletes: RANK.filter(a => a.sales === sales),
  }));
  const maxSales    = RANK[0]?.sales ?? 0;
  const totalSales  = RANK.reduce((s, a) => s + a.sales, 0);
  const totalRevenue = totalSales * 30;
  const arrecadado  = data?.arrecadado ?? 0;
  const meta        = data?.meta ?? 40000;

  const clamp = (v: number) => Math.max(0, Math.min(100, v));
  const pctMeta    = clamp(meta > 0 ? Math.round((arrecadado / meta) * 100) : 0);
  const pctRifas   = clamp(Math.round((totalSales / 1000) * 100));
  const vendendo   = RANK.filter(a => a.sales > 0).length;
  const pctAtletas = clamp(RANK.length > 0 ? Math.round((vendendo / RANK.length) * 100) : 0);
  const totalDias  = Math.round((CAMP_END_MS - CAMP_START_MS) / 86400000);
  const elapsed    = Math.max(0, Math.min(totalDias, Math.round((Date.now() - CAMP_START_MS) / 86400000)));
  const pctDias    = clamp(Math.round((elapsed / totalDias) * 100));

  const donuts = [
    { pct: pctMeta,    stroke: '#ed6c15', label: 'Meta arrecadada',  sub: `R$ ${arrecadado.toLocaleString('pt-BR')} de R$ ${meta.toLocaleString('pt-BR')}` },
    { pct: pctRifas,   stroke: '#0f172a', label: 'Rifas vendidas',   sub: `${totalSales} de 1.000 números` },
    { pct: pctAtletas, stroke: '#ed6c15', label: 'Atletas vendendo', sub: `${vendendo} de ${RANK.length} atletas` },
    { pct: pctDias,    stroke: '#0f172a', label: 'Dias da campanha', sub: `${elapsed} de ${totalDias} dias decorridos` },
  ];

  const weeklyData = useMemo(() => {
    const weeks = new Array(8).fill(0);
    if (!data?.extrato) return weeks;
    for (const entry of data.extrato) {
      if (entry.tipo !== 'ENTRADA') continue;
      const ts = parseDateMs(entry.data);
      if (!ts) continue;
      const idx = Math.floor((ts - CAMP_START_MS) / MS_PER_WEEK);
      if (idx >= 0 && idx < 8) weeks[idx] += entry.valor;
    }
    return weeks;
  }, [data?.extrato]);

  const { pts: TL_PTS, line: TL_LINE, area: TL_AREA } = buildChart(weeklyData);

  return (
    <div>

      {/* ── Hero ──────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#0f172a]/10 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex gap-2 mb-6">
                <span className="inline-flex items-center gap-2 bg-brand-orange text-white px-3 py-1 text-[10px] font-black rounded uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Atualizado agora
                </span>
                <span className="inline-block bg-[#0f172a]/10 text-navy px-3 py-1 text-[10px] font-black rounded uppercase tracking-widest">
                  Sub-17 Masculino
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
                Ranking<br />
                <span className="text-brand-orange">de vendas.</span>
              </h1>
              <p className="text-navy/65 text-lg leading-relaxed max-w-lg">
                Cada rifa creditada vai pro placar. O atleta que somar mais vendas até{' '}
                <strong className="text-navy">15/07/2026</strong> leva um prêmio especial e o título de{' '}
                <strong className="text-navy">vendedor da Taça</strong>.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
              <div className="grid grid-cols-3 border border-[#0f172a]/10 rounded-xl overflow-hidden">
                {[
                  { big: String(totalSales),                   lbl: 'Rifas vendidas', orange: false },
                  { big: `R$ ${totalRevenue.toLocaleString('pt-BR')}`, lbl: 'Receita rifa',   orange: true  },
                  { big: String(RANK.filter(a => a.sales > 0).length), lbl: 'Vendedores',      orange: false },
                ].map((s, i) => (
                  <div key={i} className={`p-6 ${i < 2 ? 'border-r border-[#0f172a]/10' : ''}`}>
                    <div className={`text-3xl md:text-4xl font-black leading-none ${s.orange ? 'text-brand-orange' : 'text-navy'}`}>{s.big}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-navy/50 mt-2">{s.lbl}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* ── Pódio ─────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-4">Top 3</p>
            <h2 className="text-4xl md:text-6xl font-black text-navy uppercase tracking-tighter leading-tight mb-12">
              O pódio<br />da campanha.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr_1fr] gap-5 items-end">

            {RANK.length === 0 ? (
              <div className="col-span-3 py-16 text-center font-black text-navy/30 uppercase tracking-widest text-sm">Carregando pódio…</div>
            ) : [
              { place: '02', bg: '#1e2d45',  stroke: 'rgba(255,255,255,0.15)', minH: 320, delay: 0,   groupIdx: 1 },
              { place: '01', bg: '#ed6c15',  stroke: 'rgba(255,255,255,0.2)',  minH: 360, delay: 0.1, groupIdx: 0, crown: true },
              { place: '03', bg: '#0f172a',  stroke: 'rgba(255,255,255,0.12)', minH: 290, delay: 0.2, groupIdx: 2 },
            ].map(p => {
              const group = rankGroups[p.groupIdx];
              if (!group) return (
                <motion.div
                  key={p.place}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: p.delay }}
                  className="relative overflow-hidden rounded-2xl p-7 text-white flex flex-col items-center justify-center"
                  style={{ background: p.bg, minHeight: p.minH, opacity: 0.4 }}
                >
                  <div className="text-[92px] font-black leading-[0.85]" style={{ color: 'transparent', WebkitTextStroke: `2px ${p.stroke}` }}>{p.place}</div>
                  <div className="text-[13px] font-black uppercase tracking-widest opacity-50 mt-4">Sem vendas</div>
                </motion.div>
              );
              const primary = group.athletes[0];
              const tied = group.athletes.length > 1;
              return (
                <motion.div
                  key={p.place}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: p.delay }}
                  className="relative overflow-hidden rounded-2xl p-7 text-white flex flex-col"
                  style={{ background: p.bg, minHeight: p.minH }}
                >
                  {'crown' in p && <span className="absolute top-5 right-5 text-[38px]">👑</span>}
                  <span className="absolute bottom-[-20px] right-[-10px] text-[220px] font-black leading-none pointer-events-none select-none" style={{ color: 'rgba(255,255,255,.06)' }}>{primary.num}</span>
                  <div className="text-[92px] font-black leading-[0.85]" style={{ color: 'transparent', WebkitTextStroke: `2px ${p.stroke}` }}>{p.place}</div>

                  {tied ? (
                    /* Empate — várias fotos */
                    <div className="flex flex-wrap gap-3 mb-4">
                      {group.athletes.map(a => (
                        <div key={a.num} className="flex flex-col items-center gap-1">
                          {a.photo ? (
                            <img
                              src={a.photo} alt={a.short}
                              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                              className="w-14 h-14 rounded-full object-cover object-top border-2 border-white/30"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center font-black text-sm">{a.num}</div>
                          )}
                          <span className="text-[10px] font-black uppercase tracking-wide">{a.short}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Único */
                    primary.photo && (
                      <div className="mb-4">
                        <img
                          src={primary.photo} alt={primary.short}
                          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                          className="w-20 h-20 rounded-full object-cover object-top border-2 border-white/30"
                        />
                      </div>
                    )
                  )}

                  {!tied && (
                    <>
                      <div className="text-[34px] font-black uppercase leading-[0.95] mb-1.5">{primary.short}</div>
                      <div className="text-[11px] font-black uppercase tracking-widest opacity-70">#{primary.num} · {primary.pos}</div>
                    </>
                  )}
                  {tied && (
                    <div className="text-[11px] font-black uppercase tracking-widest opacity-70 mb-1">
                      {group.athletes.length} atletas empatados
                    </div>
                  )}

                  <div className="mt-6 text-[64px] font-black leading-none">
                    {group.sales}
                    <small className="block font-mono font-semibold text-[11px] tracking-widest opacity-70 mt-1 normal-case">rifas vendidas</small>
                  </div>
                </motion.div>
              );
            })}

          </div>
        </div>
      </section>

      {/* ── Placar completo ───────────────────────────────── */}
      <section className="py-20 px-4 md:px-8" style={{ background: 'rgba(15,23,42,0.03)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border border-[#0f172a]/10 rounded-2xl p-8">
            <div className="flex justify-between items-end flex-wrap gap-4 mb-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-3">Placar completo</p>
                <h3 className="text-2xl font-black text-navy uppercase tracking-tight">Todos os {RANK.length} vendedores</h3>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="inline-block bg-[#0f172a]/10 text-navy px-3 py-1 text-[10px] font-black rounded uppercase tracking-widest">Ordenado por vendas</span>
                <span className="inline-block bg-[#0f172a]/10 text-navy px-3 py-1 text-[10px] font-black rounded uppercase tracking-widest">Atualizado · há 2 min</span>
              </div>
            </div>

            {loading && (
              <div className="py-12 text-center font-black text-navy/30 uppercase tracking-widest text-sm">Carregando ranking…</div>
            )}
            <div className="flex flex-col">
              {RANK.map((r, i) => {
                const pct = maxSales > 0 ? Math.max((r.sales / maxSales) * 100, 2) : 2;
                return (
                  <div
                    key={i}
                    className={`grid items-center gap-4 py-3 ${i < RANK.length - 1 ? 'border-b border-dashed border-[#0f172a]/10' : ''}`}
                    style={{ gridTemplateColumns: '30px 44px 1fr 80px' }}
                  >
                    <div className="text-[18px] font-black text-navy/40 leading-none">{String(i + 1).padStart(2, '0')}</div>
                    <div>
                      {r.photo ? (
                        <img
                          src={r.photo}
                          alt={r.short}
                          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                          className="w-9 h-9 rounded-full object-cover object-top border border-[#0f172a]/10"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#0f172a]/10 flex items-center justify-center font-black text-navy/30 text-xs">{r.num}</div>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-black text-navy uppercase text-base md:text-lg tracking-tight leading-tight">{r.name}</span>
                      <span className="font-mono text-[10px] tracking-widest uppercase text-navy/50 mt-0.5">#{r.num} · {r.pos}</span>
                      <div className="h-2.5 bg-[#0f172a]/10 rounded-full overflow-hidden mt-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1], delay: i * 0.055 }}
                          className={`h-full rounded-full ${i === 0 ? 'bg-brand-orange' : 'bg-navy'}`}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[26px] font-black text-navy leading-none">{r.sales}</span>
                      <small className="block font-mono font-semibold text-[10px] tracking-widest uppercase text-navy/50">rifas</small>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Donuts ────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-4">Métricas da campanha</p>
            <h2 className="text-4xl md:text-6xl font-black text-navy uppercase tracking-tighter leading-tight mb-12">
              Como estamos<br />indo, em números.
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {donuts.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="border border-[#0f172a]/10 rounded-2xl p-7 text-center"
                style={{ background: 'rgba(15,23,42,0.03)' }}
              >
                <div className="relative w-40 h-40 mx-auto mb-5">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(15,23,42,0.1)" strokeWidth="12" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke={d.stroke} strokeWidth="12"
                      strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - d.pct / 100)} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[38px] font-black text-navy">{d.pct}%</div>
                </div>
                <h4 className="font-black text-navy uppercase text-lg tracking-tight mb-1">{d.label}</h4>
                <div className="font-mono text-[10px] tracking-widest uppercase text-navy/60">{d.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Evolução semanal ──────────────────────────────── */}
      <section className="py-20 px-4 md:px-8" style={{ background: 'rgba(15,23,42,0.03)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="bg-navy rounded-2xl p-8">
            <div className="flex justify-between items-end flex-wrap gap-4 mb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-3">Vendas no tempo</p>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Evolução semanal</h3>
              </div>
              <span className="inline-block bg-white/10 text-white px-3 py-1 text-[10px] font-black rounded uppercase tracking-widest">Últimas 8 semanas</span>
            </div>

            <svg viewBox="0 0 800 220" preserveAspectRatio="none" className="w-full" style={{ height: 220 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#ed6c15" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ed6c15" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g stroke="rgba(255,255,255,.08)" strokeWidth="1">
                <line x1="0" y1="40"  x2="800" y2="40"  />
                <line x1="0" y1="90"  x2="800" y2="90"  />
                <line x1="0" y1="140" x2="800" y2="140" />
                <line x1="0" y1="190" x2="800" y2="190" />
              </g>
              <path d={TL_AREA} fill="url(#areaGrad)" stroke="none" />
              <path d={TL_LINE} fill="none" stroke="#ed6c15" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <g>
                {TL_PTS.map((p, i) => (
                  <g key={i}>
                    <circle cx={p[0]} cy={p[1]} r="5" fill="#ed6c15" stroke="#0f172a" strokeWidth="2" />
                    <text
                      x={p[0]} y={Math.max(p[1] - 12, 14)}
                      textAnchor="middle" fill="rgba(255,255,255,.85)"
                      fontFamily="monospace" fontSize="11"
                    >{weeklyData[i] > 0 ? `R$${Math.round(weeklyData[i])}` : '0'}</text>
                  </g>
                ))}
              </g>
            </svg>

            <div className="flex gap-5 flex-wrap mt-4 font-mono text-[11px] tracking-widest uppercase text-white/70">
              <span>
                <span className="inline-block w-3 h-3 rounded-sm bg-brand-orange mr-2 align-middle" />
                Entradas semanais (R$)
              </span>
              <span className="opacity-50">Sem 1: 12/abr · Sem 8: 31/mai</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Prêmio ────────────────────────────────────────── */}
      <section className="py-24 px-4 md:px-8 bg-navy">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-4">Prêmio interno</p>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight mb-6">
                O atleta nº 1<br />leva um vale<br />tênis de<br />R$ 500,00.
              </h2>
              <p className="text-white/65 text-lg leading-relaxed mb-8">
                Quem vender mais rifas até <strong className="text-white">30/06/2026</strong> recebe um vale tênis no valor de R$ 500,00 + cordão da campanha + foto pra parede da quadra.
              </p>
              <Link
                to="/rifa#numeros"
                className="inline-flex items-center gap-3 px-8 py-4 bg-brand-orange text-white font-black uppercase tracking-widest text-sm rounded-xl hover:bg-white hover:text-brand-orange transition-colors"
              >
                Apoiar meu atleta <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
              <div
                className="relative flex items-center justify-center rounded-2xl text-white font-black text-center uppercase leading-none"
                style={{
                  aspectRatio: '4/3',
                  background: '#0d1e35',
                  backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,.06) 0 2px, transparent 2px 14px)',
                  fontSize: 72,
                }}
              >
                <div className="absolute top-6 left-6">
                  <span className="inline-flex items-center gap-2 bg-brand-orange text-white px-3 py-1 text-[10px] font-black rounded uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Prêmio interno
                  </span>
                </div>
                <div>
                  Vale Tênis<br />
                  <span className="text-brand-orange">R$ 500</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
