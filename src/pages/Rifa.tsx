import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCampanha } from '../lib/useCampanha';

function AnimatedNumber({ end }: { end: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * end));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, end]);
  return <span ref={ref}>{value.toLocaleString('pt-BR')}</span>;
}

const TOTAL = 1000;

const SOLD = new Set<number>();

function fmt(n: number) {
  return String(n).padStart(3, '0');
}

export default function Rifa() {
  const { data } = useCampanha();
  const ATHLETES = data?.atletas ?? [];
  const arrecadado = data?.arrecadado ?? 0;
  const meta = data?.meta ?? 40000;
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#numeros') {
      const t = setTimeout(() => {
        document.getElementById('numeros')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
      return () => clearTimeout(t);
    }
  }, [location.hash]);

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'free' | 'sel'>('all');
  const [form, setForm] = useState({ name: '', phone: '', email: '', cpf: '', athlete: '' });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{ qr_code: string; qr_code_base64: string; total: number; payment_id: string } | null>(null);
  const [pixError, setPixError] = useState('');

  const toggle = (i: number) => {
    if (SOLD.has(i)) return;
    setSelected(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const quickAdd = (n: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      let added = 0, safety = 0;
      while (added < n && safety < 5000) {
        safety++;
        const k = Math.floor(Math.random() * TOTAL);
        if (!SOLD.has(k) && !next.has(k)) { next.add(k); added++; }
      }
      return next;
    });
  };

  const visible = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < TOTAL; i++) {
      const id = fmt(i);
      if (search && !id.includes(search)) continue;
      if (filter === 'free' && SOLD.has(i)) continue;
      if (filter === 'sel' && !selected.has(i)) continue;
      out.push(i);
    }
    return out;
  }, [search, filter, selected]);

  const qty = selected.size;
  const total = qty * 0.05;

  const finalize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected.size) { alert('Escolha pelo menos 1 número.'); return; }
    setLoading(true);
    setPixError('');
    const athlete = ATHLETES.find(a => a.num === form.athlete);
    try {
      const res = await fetch('https://bot-n8n.k474gt.easypanel.host/webhook/rifa-criar-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total,
          numero: [...selected].sort((a, b) => a - b).join(','),
          nome: form.name,
          email: form.email,
          whatsapp: form.phone,
          cpf: form.cpf.replace(/\D/g, ''),
          atleta_id: form.athlete,
          atleta_nome: athlete?.short ?? '',
        }),
      });
      const json = await res.json();
      if (!res.ok || json.erro) throw new Error(json.mensagem || 'Erro ao gerar Pix');
      setPixData(json);
      setShowModal(true);
    } catch (err: unknown) {
      setPixError(err instanceof Error ? err.message : 'Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      {/* ── Hero ──────────────────────────────────────────── */}
      <header className="bg-navy text-white py-16 px-4 md:px-8 overflow-hidden relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-16 items-center">

            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex gap-2 mb-6">
                <span className="inline-flex items-center gap-2 bg-brand-orange text-white px-3 py-1 text-[10px] font-black rounded uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Rifa oficial
                </span>
                <span className="inline-block bg-white text-navy px-3 py-1 text-[10px] font-black rounded uppercase tracking-widest">
                  Taça Paraná 2026
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
                Ajude o time<br />e concorra a<br />
                <span className="text-brand-orange">um iPhone 16.</span>
              </h1>
              <p className="text-white/85 text-lg leading-relaxed max-w-lg mb-10">
                Escolha quantos números quiser, indique seu atleta favorito e concorra ao prêmio. Cada R$ 0,05 leva o time mais perto da Taça Paraná.
              </p>

              {/* Progress bar — igual à Home */}
              <div>
                <div className="flex items-center gap-1.5 bg-brand-orange/20 border border-brand-orange/30 text-brand-orange px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" /> Ao vivo
                </div>
                <div className="text-brand-orange font-black leading-none tracking-tighter mb-2" style={{ fontSize: 'clamp(48px,6vw,80px)' }}>
                  <small className="text-[0.32em] align-top opacity-90">R$</small>
                  <AnimatedNumber end={arrecadado} />
                </div>
                <div className="text-white/70 font-mono text-[11px] uppercase tracking-[0.2em] mb-4">
                  Arrecadado · meta R$ {meta.toLocaleString('pt-BR')}
                </div>
                <div className="flex justify-between items-baseline font-mono text-[11px] uppercase tracking-[0.2em] text-white/70 mb-2">
                  <span>Progresso</span>
                  <span>{meta > 0 ? Math.round((arrecadado / meta) * 100) : 0}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${meta > 0 ? (arrecadado / meta) * 100 : 0}%` }}
                    transition={{ duration: 1.8, ease: 'easeOut', delay: 0.5 }}
                    className="h-full bg-brand-orange rounded-full"
                  />
                </div>
                <div className="flex justify-between items-baseline font-black text-white uppercase tracking-tight">
                  <span className="text-2xl">R$ {arrecadado.toLocaleString('pt-BR')}</span>
                  <span className="text-base text-white/65">/ R$ {meta.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </motion.div>

            {/* Prize card */}
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
              <div className="relative rounded-2xl border border-white/10 p-7 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                {/* PRÊMIO ribbon */}
                <div className="absolute top-5 right-[-34px] bg-brand-orange text-white font-black text-[11px] tracking-widest px-10 py-1.5 rotate-[35deg]">
                  PRÊMIO
                </div>

                {/* iPhone illustration */}
                <div style={{ width: 200, height: 380, background: '#16161c', borderRadius: 38, border: '4px solid #2a2a30', position: 'relative', margin: '18px auto 22px', boxShadow: '0 30px 60px -20px rgba(0,0,0,.6)' }}>
                  {/* Dynamic island */}
                  <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', width: 92, height: 26, background: '#000', borderRadius: 999 }} />
                  {/* Screen */}
                  <div style={{ position: 'absolute', inset: 8, borderRadius: 30, background: '#0e1a3a', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', bottom: 30, left: 0, right: 0, textAlign: 'center', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 18, color: 'rgba(255,255,255,.7)' }}>iPhone 16</div>
                  </div>
                  {/* Camera module */}
                  <div style={{ position: 'absolute', top: 90, left: 22, width: 64, height: 72, background: 'rgba(0,0,0,.4)', borderRadius: 22, boxShadow: '8px 10px 0 0 rgba(255,255,255,.04), inset 0 0 0 1px rgba(255,255,255,.08)' }}>
                    <div style={{ position: 'absolute', top: 8, left: 8, width: 22, height: 22, borderRadius: '50%', background: '#222', boxShadow: 'inset 0 0 0 2px #1a1a1f' }} />
                    <div style={{ position: 'absolute', bottom: 8, right: 8, width: 22, height: 22, borderRadius: '50%', background: '#222', boxShadow: 'inset 0 0 0 2px #1a1a1f' }} />
                  </div>
                </div>

                <h3 className="text-white text-2xl font-black text-center leading-tight">iPhone 16<br /><span className="text-brand-orange">128 GB</span></h3>
                <div className="text-center font-mono text-[11px] tracking-widest uppercase text-brand-orange mt-2">Sorteio Loteria Federal · 19/07/2026</div>
              </div>
            </motion.div>

          </div>
        </div>
      </header>

      {/* ── Price strip ───────────────────────────────────── */}
      <div className="bg-brand-orange border-t-2 border-b-2 border-navy py-5 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-6">
          {[
            { k: 'Valor por número', v: 'R$ 0,05'            },
            { k: 'Prêmio',           v: 'iPhone 16 · 128GB' },
            { k: 'Data do sorteio',  v: '19/07/2026'        },
            { k: 'Pagamento',        v: 'Pix · Cartão'      },
          ].map((c, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="font-mono text-[11px] tracking-widest uppercase text-white/80">{c.k}</span>
              <span className="font-black uppercase text-[28px] leading-none text-white">{c.v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Escolha os números ────────────────────────────── */}
      <section id="numeros" className="py-20 px-4 md:px-8" style={{ background: 'rgba(15,23,42,0.03)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end flex-wrap gap-6 mb-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-3">Pegue seus números</p>
              <h2 className="text-4xl md:text-5xl font-black text-navy uppercase tracking-tighter leading-tight">Escolha<br />e finalize.</h2>
            </div>
            <p className="text-navy/60 text-sm max-w-xs leading-relaxed">
              Os números riscados já foram vendidos. Selecione os disponíveis (laranja após o clique) e complete o cadastro ao lado.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 items-start">

            {/* Number grid */}
            <div>
              {/* Toolbar */}
              <div className="flex gap-3 flex-wrap items-center mb-4">
                <input
                  type="search"
                  placeholder="Buscar um número específico…"
                  value={search}
                  onChange={e => setSearch(e.target.value.trim())}
                  className="flex-1 min-w-[200px] px-4 py-3 rounded-full border border-[#0f172a]/15 bg-white font-mono text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-[#ed6c15]/20"
                />
                <div className="inline-flex bg-white border border-[#0f172a]/15 rounded-full p-1 gap-1">
                  {(['all', 'free', 'sel'] as const).map((f, i) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-full font-black uppercase text-[13px] tracking-wide transition-colors ${filter === f ? 'bg-navy text-white' : 'text-navy/60 hover:text-navy'}`}
                    >
                      {['Todos', 'Disponíveis', 'Selecionados'][i]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex gap-5 flex-wrap mb-4 font-mono text-[11px] tracking-widest uppercase text-navy/70">
                <span><span className="inline-block w-3.5 h-3.5 rounded bg-white border border-[#0f172a]/20 mr-2 align-middle" />Disponível</span>
                <span><span className="inline-block w-3.5 h-3.5 rounded bg-brand-orange mr-2 align-middle" />Selecionado</span>
                <span><span className="inline-block w-3.5 h-3.5 rounded mr-2 align-middle" style={{ background: 'rgba(15,23,42,0.08)' }} />Vendido</span>
              </div>

              {/* Grid */}
              <div
                className="rifa-grid rounded-xl border border-[#0f172a]/10 p-2 overflow-y-auto grid grid-cols-[repeat(10,1fr)] md:grid-cols-[repeat(20,1fr)] max-h-[520px] md:max-h-[620px]"
                style={{ gap: 4, background: 'rgba(15,23,42,0.03)' }}
              >
                {visible.map(i => {
                  const sold = SOLD.has(i);
                  const sel = selected.has(i);
                  return (
                    <div
                      key={i}
                      onClick={() => toggle(i)}
                      className="font-mono font-semibold text-[13px] md:text-[11px] flex items-center justify-center rounded transition-all"
                      style={{
                        aspectRatio: '1',
                        cursor: sold ? 'not-allowed' : 'pointer',
                        background: sel ? '#ed6c15' : sold ? 'rgba(15,23,42,0.08)' : '#ffffff',
                        color: sel ? '#ffffff' : sold ? 'rgba(15,23,42,0.3)' : '#0f172a',
                        textDecoration: sold ? 'line-through' : 'none',
                        border: sel ? '1px solid #ed6c15' : '1px solid transparent',
                        transform: sel ? 'scale(1.05)' : 'scale(1)',
                      }}
                    >
                      {fmt(i)}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order panel */}
            <aside className="bg-white border border-[#0f172a]/10 rounded-2xl p-7 shadow-sm" style={{ position: 'sticky', top: 100 }}>
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-black text-navy uppercase text-2xl tracking-tight">Seu pedido</h3>
                <span className="inline-flex items-center gap-2 bg-brand-orange text-white px-3 py-1 text-[10px] font-black rounded uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> 0,05 p/ teste
                </span>
              </div>

              {/* Selected pills */}
              <div className="mb-3">
                <label className="block font-mono text-[10px] tracking-widest uppercase text-navy/60 mb-2">Números selecionados</label>
                <div className="flex flex-wrap gap-1.5 min-h-7 mb-3">
                  {selected.size === 0
                    ? <span className="font-mono text-[11px] tracking-widest uppercase text-navy/40 self-center">Nenhum número escolhido</span>
                    : [...selected].sort((a, b) => a - b).map(i => (
                      <span key={i} className="inline-flex items-center gap-1.5 bg-brand-orange text-white font-mono font-semibold text-[12px] px-2.5 py-1 rounded-full">
                        {fmt(i)}
                        <button onClick={() => toggle(i)} className="text-white/80 hover:text-white leading-none text-sm">×</button>
                      </span>
                    ))
                  }
                </div>

                {/* Quick add */}
                <div className="flex gap-2 flex-wrap mb-4">
                  {[1, 5, 10, 20].map(n => (
                    <button key={n} onClick={() => quickAdd(n)} className="bg-white border border-[#0f172a]/15 rounded-full px-4 py-2 font-black uppercase text-[13px] tracking-wide hover:border-brand-orange hover:text-brand-orange transition-colors">
                      +{n}
                    </button>
                  ))}
                  <button onClick={() => setSelected(new Set())} className="bg-white border border-[#0f172a]/15 rounded-full px-4 py-2 font-black uppercase text-[13px] tracking-wide hover:border-brand-orange hover:text-brand-orange transition-colors">
                    Limpar
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white border border-dashed border-[#0f172a]/20 rounded-xl p-4 mb-5">
                <div className="flex justify-between mb-1.5">
                  <span className="font-mono text-[11px] tracking-widest uppercase text-navy/60">Quantidade</span>
                  <span className="font-black text-navy text-lg uppercase">{qty}</span>
                </div>
                <div className="flex justify-between mb-1.5">
                  <span className="font-mono text-[11px] tracking-widest uppercase text-navy/60">Subtotal</span>
                  <span className="font-black text-navy text-lg uppercase">R$ {total.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between border-t border-[#0f172a]/10 pt-2.5 mt-2.5">
                  <span className="font-mono text-[11px] tracking-widest uppercase text-navy/60">Total</span>
                  <span className="font-black text-brand-orange text-3xl leading-none">R$ {total.toLocaleString('pt-BR')}</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={finalize} className="flex flex-col gap-4">
                {[
                  { id: 'name',  label: 'Seu nome completo',        type: 'text',  placeholder: 'Ana Silva'          },
                  { id: 'phone', label: 'WhatsApp',                  type: 'tel',   placeholder: '(19) 9 9999-9999'   },
                  { id: 'email', label: 'E-mail',                    type: 'email', placeholder: 'ana@email.com'       },
                  { id: 'cpf',   label: 'CPF',                       type: 'text',  placeholder: '000.000.000-00'      },
                ].map(f => (
                  <div key={f.id}>
                    <label className="block font-mono text-[10px] tracking-widest uppercase text-navy/60 mb-1.5">{f.label}</label>
                    <input
                      type={f.type} required placeholder={f.placeholder}
                      value={(form as any)[f.id]}
                      onChange={e => setForm(prev => ({ ...prev, [f.id]: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-[#0f172a]/15 bg-white text-navy text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-[#ed6c15]/20 transition-colors"
                    />
                  </div>
                ))}

                <div>
                  <label className="block font-mono text-[10px] tracking-widest uppercase text-navy/60 mb-1.5">★ Indique seu atleta favorito</label>
                  <select
                    required value={form.athlete}
                    onChange={e => setForm(prev => ({ ...prev, athlete: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-[#0f172a]/15 bg-white text-navy text-sm outline-none focus:border-brand-orange transition-colors appearance-none"
                  >
                    <option value="">Selecione um atleta…</option>
                    {ATHLETES.map(a => (
                      <option key={a.num} value={a.num}>#{a.num} · {a.short} — {a.pos}</option>
                    ))}
                  </select>
                  <p className="text-[12px] text-navy/50 mt-1.5">O atleta com mais rifas vendidas ganha um prêmio especial.</p>
                </div>

                {pixError && (
                  <p className="text-red-500 text-sm text-center font-semibold">{pixError}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-brand-orange text-white font-black uppercase tracking-widest text-sm rounded-xl hover:bg-navy transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Gerando Pix…' : <> Finalizar compra <ArrowRight size={18} /> </>}
                </button>
                <p className="text-[12px] text-navy/40 text-center">O QR Code Pix aparece aqui na tela na hora.</p>
              </form>
            </aside>

          </div>
        </div>
      </section>

      {/* ── Como funciona ─────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-4">Como funciona</p>
            <h2 className="text-4xl md:text-6xl font-black text-navy uppercase tracking-tighter leading-tight">4 passos.<br />Sem mistério.</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {[
              { n: '01', title: 'Escolha seus números',  body: 'Clique nos números que quiser, ou use o sorteador automático.' },
              { n: '02', title: 'Indique o atleta',      body: 'Aponte qual atleta deve receber o crédito. Ele entra no ranking de vendedores.' },
              { n: '03', title: 'Pague pelo Pix',        body: 'Você recebe o QR Code e a chave. Confirmação na hora.' },
              { n: '04', title: 'Aguarde o sorteio',     body: 'Resultado pela Loteria Federal de 19/07. Cruze os dedos pelo iPhone.' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="border border-[#0f172a]/10 rounded-2xl p-7"
                style={{ background: 'rgba(15,23,42,0.03)' }}
              >
                <div className="text-[64px] font-black text-brand-orange leading-none">{s.n}</div>
                <h4 className="font-black text-navy uppercase text-xl tracking-tight mt-3 mb-2">{s.title}</h4>
                <p className="text-navy/60 text-sm leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 bg-navy">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-4">Dúvidas frequentes</p>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight mb-10">
              A gente<br />já te explica.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                q: 'Como acontece o sorteio?',
                a: 'O número premiado é definido pelos cinco prêmios da Loteria Federal do dia 19/07/2026. Lemos o resultado em transmissão ao vivo no Instagram da equipe.',
              },
              {
                q: 'Posso comprar mais de um número?',
                a: 'Pode! Selecione quantos quiser na grade ou use os botões +5 / +10 / +20 para sortear números livres pra você.',
              },
              {
                q: 'Como funciona a competição entre atletas?',
                a: 'Cada rifa é creditada ao atleta que você indicar no checkout. Quem somar mais vendas ao fim da campanha ganha um prêmio especial.',
              },
              {
                q: 'E se eu não conseguir pagar?',
                a: 'Sem problemas: a reserva expira em 30 minutos se o Pix não for confirmado, e os números voltam pra grade. Sem multa, sem cobrança.',
              },
            ].map((item, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-7 open:bg-white/10 transition-colors"
              >
                <summary className="cursor-pointer font-black text-white uppercase text-xl tracking-tight list-none">
                  {item.q}
                </summary>
                <p className="mt-4 text-white/70 text-sm leading-relaxed">{item.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modal Pix ─────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && pixData && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-5"
            style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="inline-flex items-center gap-2 bg-brand-orange text-white px-3 py-1 text-[10px] font-black rounded uppercase tracking-widest mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Pix gerado · pague agora
              </div>
              <p className="font-mono text-[11px] tracking-widest uppercase text-navy/50 mb-2">
                Total a pagar
              </p>
              <p className="text-4xl font-black text-navy mb-5">
                R$ {pixData.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              {pixData.qr_code_base64 && (
                <img
                  src={`data:image/png;base64,${pixData.qr_code_base64}`}
                  alt="QR Code Pix"
                  className="w-48 h-48 mx-auto mb-5 rounded-xl border border-[#0f172a]/10"
                />
              )}
              <p className="font-mono text-[10px] tracking-widest uppercase text-navy/50 mb-2">Ou copie o código</p>
              <div className="flex gap-2 mb-6">
                <input
                  readOnly value={pixData.qr_code}
                  className="flex-1 px-3 py-2 rounded-xl border border-[#0f172a]/15 font-mono text-[11px] text-navy bg-[#0f172a]/03 truncate outline-none"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(pixData.qr_code)}
                  className="px-4 py-2 bg-brand-orange text-white font-black text-xs rounded-xl hover:bg-navy transition-colors whitespace-nowrap"
                >
                  Copiar
                </button>
              </div>
              <p className="text-[11px] text-navy/50 mb-5">
                Atleta indicado: <strong className="text-navy">{ATHLETES.find(a => a.num === form.athlete)?.short ?? '—'}</strong>
              </p>
              <button
                onClick={() => { setShowModal(false); setPixData(null); setSelected(new Set()); }}
                className="w-full px-8 py-3 bg-navy text-white font-black uppercase tracking-widest text-sm rounded-xl hover:bg-brand-orange transition-colors"
              >
                Fechar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
