import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCampanha, type ExtratoItem } from '../lib/useCampanha';

type Filtro = 'TODOS' | 'ENTRADAS' | 'SAÍDAS';

const BAR_COLORS = ['bg-brand-orange', 'bg-navy', 'bg-brand-orange/50', 'bg-navy/50', 'bg-brand-orange/25'];

const CAT_COLOR: Record<string, string> = {
  'RIFA':        'bg-brand-orange/10 text-brand-orange',
  'RIFA AVULSA': 'bg-brand-orange/15 text-brand-orange',
  'CANTINA':     'bg-brand-orange/20 text-brand-orange',
  'DOAÇÃO':      'bg-[#0f172a]/10 text-navy',
  'INSCRIÇÃO':   'bg-[#0f172a]/10 text-navy',
  'TRANSPORTE':  'bg-[#0f172a]/15 text-navy',
  'ALIMENTAÇÃO': 'bg-[#0f172a]/10 text-navy',
};

function BarRow({ label, sub, valor, pct, max }: {
  label: string; sub: string; valor: number; pct?: number; max?: number;
}) {
  const width = pct !== undefined ? pct : (max ? Math.round((valor / max) * 100) : 0);
  const isFirst = pct !== undefined ? false : false; // determined by parent
  return (
    <div className="flex flex-col gap-1.5 py-4 border-b border-[#0f172a]/10 last:border-0">
      <div className="flex justify-between items-center">
        <div>
          <span className="font-black text-navy text-sm uppercase">{label}</span>
          <span className="text-[#0f172a]/40 text-[10px] font-bold uppercase tracking-widest block">{sub}</span>
        </div>
        <span className="font-black text-navy text-sm">R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
      </div>
      <div className="h-1.5 bg-[#0f172a]/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${width}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full bg-brand-orange"
        />
      </div>
    </div>
  );
}

function ExtratoRow({ e, i }: { e: ExtratoItem; i: number }) {
  return (
    <motion.div
      key={`${e.data}-${e.desc}`}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ delay: i * 0.04, duration: 0.3 }}
      className="grid grid-cols-12 items-center px-6 py-4 border-b border-[#0f172a]/10 last:border-0 hover:bg-[#0f172a]/[0.02] transition-colors"
    >
      <div className="col-span-2 text-[11px] font-bold text-[#0f172a]/40">{e.data}</div>
      <div className="col-span-5">
        <p className="font-bold text-navy text-sm">{e.desc}</p>
      </div>
      <div className="col-span-2">
        <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${CAT_COLOR[e.cat] ?? 'bg-[#0f172a]/10 text-navy'}`}>
          {e.cat}
        </span>
      </div>
      <div className="col-span-1">
        <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${
          e.tipo === 'ENTRADA' ? 'bg-brand-orange/10 text-brand-orange' : 'bg-[#0f172a]/10 text-navy'
        }`}>
          {e.tipo}
        </span>
      </div>
      <div className={`col-span-2 text-right font-black text-sm ${e.tipo === 'ENTRADA' ? 'text-brand-orange' : 'text-navy'}`}>
        {e.tipo === 'ENTRADA' ? '+' : '-'} R$ {e.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </div>
    </motion.div>
  );
}

export default function Arrecadacao() {
  const { data, loading } = useCampanha();
  const [filtro, setFiltro] = useState<Filtro>('TODOS');

  const meta       = data?.meta ?? 30000;
  const arrecadado = data?.arrecadado ?? 0;
  const gasto      = data?.gasto ?? 0;
  const saldo      = arrecadado - gasto;
  const falta      = meta - arrecadado;
  const progressoPct = (arrecadado / meta) * 100;

  const receitas  = data?.receitas  ?? [];
  const orcamento = data?.orcamento ?? [];
  const extrato   = data?.extrato   ?? [];

  const totalOrcamento = orcamento.reduce((s, o) => s + o.valor, 0);
  const totalReceitas  = receitas.reduce((s, r) => s + r.valor, 0);

  const extratoFiltrado = extrato.filter(e => {
    if (filtro === 'ENTRADAS') return e.tipo === 'ENTRADA';
    if (filtro === 'SAÍDAS')   return e.tipo === 'SAÍDA';
    return true;
  });

  return (
    <div style={{ background: 'rgba(15,23,42,0.02)' }} className="pb-20">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="bg-white border-b border-[#0f172a]/10 pt-16 pb-0 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-orange text-brand-orange text-[10px] font-black uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
                Atualizado em tempo real
              </div>
              <div className="px-3 py-1.5 rounded-full bg-navy text-white text-[10px] font-black uppercase tracking-widest">
                Campanha Taça Paraná 2026
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-navy uppercase tracking-tighter leading-none mb-4">
              Tudo aberto.<br />
              <span className="text-brand-orange">Cada centavo.</span>
            </h1>
            <p className="text-[#0f172a]/60 max-w-2xl text-lg leading-relaxed pb-10">
              Cada Pix recebido, cada rifa vendida e cada nota fiscal de passagem, hotel ou alimentação aparece aqui.
              Auditado pela diretoria voluntária.
            </p>
          </motion.div>

          {/* Progress bar */}
          <div className="border-t border-[#0f172a]/10 pt-4 pb-0">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#0f172a]/40 mb-2">
              <span>R$ {arrecadado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} arrecadados</span>
              <span className="text-brand-orange">{progressoPct.toFixed(0)}% · Meta R$ {meta.toLocaleString('pt-BR')}</span>
            </div>
            <div className="h-1.5 bg-[#0f172a]/10 w-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressoPct, 100)}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="h-full bg-brand-orange"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 Stat Cards ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Arrecadado', sub: `${receitas.filter(r=>r.valor>0).length} fontes ativas`,  valor: arrecadado, color: 'bg-brand-orange text-white', valColor: 'text-white'         },
            { label: 'Já Gasto',         sub: 'Despesas confirmadas',                                   valor: gasto,      color: 'bg-white border border-[#0f172a]/10', valColor: 'text-navy'  },
            { label: 'Saldo em Caixa',   sub: 'Arrecadado − Gasto',                                     valor: saldo,      color: 'bg-navy text-white', valColor: 'text-brand-orange'           },
            { label: 'Falta Arrecadar',  sub: `Da meta de R$ ${meta.toLocaleString('pt-BR')}`,          valor: falta,      color: 'bg-white border border-[#0f172a]/10', valColor: 'text-navy'  },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl p-6 shadow-sm ${s.color}`}
            >
              <p className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-70">{s.label}</p>
              <p className={`text-3xl font-black ${s.valColor}`}>
                {s.valor < 0 ? '-' : ''}R$ {Math.abs(s.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-2 opacity-60">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Receita + Orçamento ──────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Receita por canal */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-white rounded-2xl border border-[#0f172a]/10 p-8 shadow-sm"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-1">De onde vem</p>
                <h2 className="text-2xl font-black text-navy uppercase">Receita por Canal</h2>
              </div>
              <div className="bg-navy text-white text-xs font-black px-3 py-1.5 rounded-full">
                R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* Stacked bar */}
            {totalReceitas > 0 && (
              <div className="h-3 rounded-full overflow-hidden flex mb-6">
                {receitas.filter(r => r.valor > 0).map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(r.valor / totalReceitas) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                    className={BAR_COLORS[i % BAR_COLORS.length] + ' h-full'}
                  />
                ))}
              </div>
            )}

            {loading ? (
              <div className="py-8 text-center text-[#0f172a]/30 font-black uppercase tracking-widest text-sm">Carregando…</div>
            ) : (
              <div>
                {receitas.map((r, i) => (
                  <BarRow key={i} label={r.label} sub={r.sub} valor={r.valor}
                    pct={totalReceitas > 0 ? Math.round((r.valor / totalReceitas) * 100) : 0} />
                ))}
              </div>
            )}
          </motion.div>

          {/* Orçamento previsto */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-[#0f172a]/10 p-8 shadow-sm"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-1">Pra onde vai</p>
                <h2 className="text-2xl font-black text-navy uppercase">Orçamento Previsto</h2>
              </div>
              <div className="bg-navy text-white text-xs font-black px-3 py-1.5 rounded-full">
                R$ {totalOrcamento.toLocaleString('pt-BR')} · Meta
              </div>
            </div>

            {/* Stacked bar */}
            <div className="h-3 rounded-full overflow-hidden flex mb-6">
              {orcamento.map((o, i) => (
                <motion.div
                  key={i}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(o.valor / totalOrcamento) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                  className={BAR_COLORS[i % BAR_COLORS.length] + ' h-full'}
                />
              ))}
            </div>

            <div>
              {orcamento.map((o, i) => (
                <BarRow key={i} label={o.label} sub={o.sub} valor={o.valor} max={totalOrcamento} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Extrato ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-10">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end mb-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-2">Extrato</p>
              <h2 className="text-4xl md:text-6xl font-black text-navy uppercase tracking-tighter leading-none">
                Toda<br />movimentação.
              </h2>
            </div>
            <p className="text-[#0f172a]/60 leading-relaxed">
              Cada linha corresponde a um Pix, uma venda ou uma despesa real.
              Em caso de dúvida, peça o comprovante por e-mail.
            </p>
          </div>

          {/* Filter */}
          <div className="flex gap-3 mb-6">
            {(['TODOS', 'ENTRADAS', 'SAÍDAS'] as Filtro[]).map(f => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  filtro === f
                    ? 'bg-navy text-white'
                    : 'bg-white border border-[#0f172a]/15 text-navy hover:border-navy'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-[#0f172a]/10 overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 bg-navy text-white text-[10px] font-black uppercase tracking-widest px-6 py-4">
              <div className="col-span-2">Data</div>
              <div className="col-span-5">Descrição</div>
              <div className="col-span-2">Categoria</div>
              <div className="col-span-1">Tipo</div>
              <div className="col-span-2 text-right">Valor</div>
            </div>

            {loading && (
              <div className="py-12 text-center text-[#0f172a]/30 font-black uppercase tracking-widest text-sm">Carregando extrato…</div>
            )}

            <AnimatePresence mode="popLayout">
              {extratoFiltrado.map((e, i) => (
                <ExtratoRow key={`${e.data}-${e.desc}`} e={e} i={i} />
              ))}
            </AnimatePresence>

            {!loading && extratoFiltrado.length === 0 && (
              <div className="py-16 text-center text-[#0f172a]/40 text-sm font-bold">
                Nenhuma movimentação encontrada.
              </div>
            )}
          </div>
        </motion.div>
      </section>

    </div>
  );
}
