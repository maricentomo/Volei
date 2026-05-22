import { ArrowRight, Copy, Check, Handshake } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { useInView } from 'motion/react';
import { useCampanha } from '../lib/useCampanha';

function AnimatedNumber({ end, decimals = 0 }: { end: number; decimals?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, end, decimals]);
  return <span ref={ref}>{decimals > 0 ? value.toFixed(decimals) : value.toLocaleString('pt-BR')}</span>;
}


const MARQUEE_ITEMS = Array(8).fill('A sua ajuda realiza um sonho');

export default function Home() {
  const { data } = useCampanha();
  const meta     = data?.meta ?? 40000;
  const atual    = data?.arrecadado ?? 0;
  const progresso = (atual / meta) * 100;

  const [copied, setCopied] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(100);
  const pixKey = '12.345.678/0001-90';

  const handleCopy = () => {
    navigator.clipboard?.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-12 md:pt-20 md:pb-16 bg-white px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 items-end">

            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center gap-1.5 bg-brand-orange text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Campanha Oficial 2026
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-navy text-white text-[10px] font-black uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
                  Ativa
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-navy leading-[1.0] uppercase tracking-tighter italic mb-6">
                Um sonho<br />chamado<br />
                <span className="text-brand-orange">Taça Paraná.</span>
              </h1>

              <p className="text-[#0f172a]/70 text-lg mb-4 max-w-xl leading-relaxed">
                O Time de Vôlei Masculino Sub-17 Louveira sonha em disputar a Taça Paraná. Um campeonato que reúne milhares de atletas, equipes tradicionais e jovens talentos de diferentes estados e países, proporcionando não apenas jogos de alto nível, mas experiências que acompanham esses atletas para o resto da vida.
              </p>
              <p className="text-[#0f172a]/70 text-base mb-8 max-w-xl leading-relaxed">
                <span className="font-bold text-navy">E precisamos da sua ajuda para fazer isso possível.</span>
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/atletas" className="btn-primary flex items-center gap-2">
                  Conhecer o projeto <ArrowRight size={16} />
                </Link>
                <Link to="/rifa" className="px-6 py-3 rounded-lg font-bold uppercase tracking-wider border-2 border-[#0f172a]/30 text-navy hover:bg-navy hover:text-white transition-colors flex items-center gap-2">
                  Como ajudar <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>

            {/* Right — dark card */}
            <motion.aside
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-navy rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[460px] shadow-2xl"
            >
              {/* Rotating sticker */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute top-4 right-4 w-20 h-20"
              >
                <img src="/contribua.png" alt="Contribua" className="w-full h-full object-contain" />
              </motion.div>

              <div>
                <div className="flex items-center gap-1.5 bg-brand-orange/20 border border-brand-orange/30 text-brand-orange px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
                  Ao vivo
                </div>
                <div className="text-brand-orange font-black leading-none tracking-tighter mb-2" style={{ fontSize: 'clamp(64px,8vw,108px)' }}>
                  <small className="text-[0.32em] align-top opacity-90">R$</small>
                  <AnimatedNumber end={atual} />
                </div>
                <div className="text-white/70 font-mono text-[11px] uppercase tracking-[0.2em]">
                  Arrecadado · meta R$ {meta.toLocaleString('pt-BR')}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline font-mono text-[11px] uppercase tracking-[0.2em] text-white/70 mb-2.5">
                  <span>Progresso</span>
                  <span>{progresso.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progresso}%` }}
                    transition={{ duration: 1.8, ease: 'easeOut' as const, delay: 0.5 }}
                    className="h-full bg-brand-orange rounded-full"
                  />
                </div>
                <div className="flex justify-between items-baseline font-black text-white uppercase tracking-tight">
                  <span className="text-2xl">R$ {atual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  <span className="text-base text-white/65">/ R$ {meta.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex gap-3 mt-6">
                  <Link to="/rifa" className="flex-1 text-center bg-brand-orange text-white px-5 py-3 rounded-lg font-black uppercase tracking-wider text-sm hover:bg-white hover:text-brand-orange transition-colors">
                    Comprar rifa →
                  </Link>
                  <a href="#doar" className="flex-1 text-center border border-white/30 text-white px-5 py-3 rounded-lg font-black uppercase tracking-wider text-sm hover:bg-white/10 transition-colors">
                    Doar Pix
                  </a>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────────────── */}
      <div className="bg-brand-orange text-navy py-9 overflow-hidden" aria-hidden="true">
        <div className="marquee-track font-black uppercase tracking-[0.04em]" style={{ fontSize: 22, lineHeight: 1 }}>
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="inline-flex items-center">
              {item}
              <span className="mx-14 opacity-40">●</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── RIFA SPOTLIGHT ───────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-navy rounded-3xl overflow-hidden p-10 md:p-14">

            {/* Top: text + iPhone */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-14">

              {/* Left — title + button */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-brand-orange mb-8">
                  A grande rifa da campanha
                </div>
                <h2 className="text-6xl md:text-7xl font-black uppercase leading-[0.95] tracking-tighter text-white mb-2">
                  Concorra <br /> a um
                </h2>
                <h2 className="text-6xl md:text-7xl font-black uppercase leading-[0.95] tracking-tighter text-brand-orange mb-10">
                  iPhone 16
                </h2>
                <Link
                  to="/rifa"
                  className="inline-flex items-center gap-3 bg-brand-orange text-white px-8 py-4 rounded-lg font-black uppercase tracking-widest text-sm hover:bg-white hover:text-brand-orange transition-colors"
                >
                  Acessar a rifa <ArrowRight size={18} />
                </Link>
              </motion.div>

              {/* Right — iPhone + BOLABOLA girando */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative flex items-center justify-center min-h-[380px]"
              >
                <motion.img
                  src="/bolabola.png"
                  alt=""
                  animate={{ rotate: 360 }}
                  transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-[380px] h-[380px] pointer-events-none select-none"
                  style={{ mixBlendMode: 'screen', opacity: 0.55 }}
                />
                <img
                  src="/iphone.png"
                  alt="iPhone 16 — prêmio da rifa"
                  className="relative z-10 w-full max-w-[270px] drop-shadow-2xl"
                />
              </motion.div>
            </div>

            {/* 3 step cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  n: '01',
                  label: 'Passo 01',
                  title: 'Compra seu número',
                  desc: 'São 1.000 números a R$ 30 cada. Você escolhe quantos quiser e já está concorrendo ao iPhone 16.',
                },
                {
                  n: '02',
                  label: 'Passo 02',
                  title: 'Escolhe o seu atleta',
                  desc: 'Na finalização, indique para qual dos 22 atletas o crédito da venda vai. Cada compra impulsiona um nome específico no ranking interno.',
                },
                {
                  n: '03',
                  label: 'Passo 03',
                  title: 'Torce duas vezes',
                  desc: 'Pelo seu atleta no ranking de vendas e pelo seu número no sorteio. Quem mais vender leva prêmio; quem comprar pode levar o iPhone.',
                },
              ].map((step, i) => (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-7"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-7 h-7 rounded-full bg-brand-orange flex items-center justify-center text-[10px] font-black text-white shrink-0">
                      {step.n}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-orange">{step.label}</span>
                  </div>
                  <div className="font-black uppercase text-white tracking-tight text-lg leading-tight mb-3">{step.title}</div>
                  <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── POR QUE ESSA CATEGORIA IMPORTA ──────────────────────────────── */}
      <section className="bg-navy overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-end">

            {/* Left — title + list */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="py-20 pl-8 md:pl-16 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]"
            >
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange mb-5">Sobre o projeto</div>
              <h2 className="text-5xl md:text-6xl font-black uppercase leading-[1.0] tracking-tighter text-white mb-12">
                Por que essa<br />categoria importa.
              </h2>

              {/* Vertical list */}
              <div className="flex flex-col">
                {[
                  {
                    title: 'Disciplina que sai da quadra',
                    desc: 'O Sub-17 é a fase em que o esporte molda o caráter. Comprometimento, respeito e superação aprendidos aqui duram a vida toda — dentro e fora do jogo.',
                  },
                  {
                    title: 'Janela curta pra crescer',
                    desc: 'Entre 15 e 17 anos, o corpo e a mente absorvem o treinamento de alto nível de forma única. Perder essa janela significa perder anos de formação que não voltam.',
                  },
                  {
                    title: 'A Taça Paraná é a porta',
                    desc: 'Participar desse torneio coloca os atletas no radar de clubes, federações e olheiros. É a chance real de transformar talento em carreira.',
                  },
                ].map((item, i, arr) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 }}
                    className="flex gap-5"
                  >
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-4 h-4 rounded-full bg-brand-orange mt-1 shrink-0" />
                      {i < arr.length - 1 && (
                        <div className="w-px flex-1 bg-white/15 my-2" />
                      )}
                    </div>
                    <div className={i < arr.length - 1 ? 'pb-10' : ''}>
                      <div className="font-black uppercase text-white tracking-tight text-lg leading-tight mb-2">{item.title}</div>
                      <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right — atleta image flush to right edge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-end justify-end"
            >
              <img
                src="/atleta.png"
                alt="Atletas Base Vôlei Louveira"
                className="w-full max-w-lg object-contain object-bottom"
              />
            </motion.div>

          </div>
      </section>

      
      {/* ── PIX ──────────────────────────────────────────────────────────── */}
      <section id="doar" className="py-20 px-4 md:px-8 bg-white border-t-2 border-[#0f172a]/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-1.5 bg-brand-orange text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest w-fit mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Doação direta
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl md:text-5xl font-black uppercase leading-[1.0] tracking-tighter text-navy mb-4">
                Você também pode<br />ajudar com uma<br />doação via Pix
              </h2>
              <p className="text-[#0f172a]/70 leading-relaxed mb-8">
                Escolha um valor e transfira direto. Toda doação é registrada publicamente na nossa página de Transparência.
              </p>

              <div className="flex flex-wrap gap-3 mb-7">
                {[30, 60, 100, 250, 500].map(v => (
                  <button
                    key={v}
                    onClick={() => setSelectedAmount(v)}
                    className={`px-5 py-2.5 rounded-full font-black uppercase tracking-wide text-base border-2 transition-all ${
                      selectedAmount === v
                        ? 'bg-brand-orange text-white border-brand-orange'
                        : 'bg-white border-[#0f172a]/20 text-navy hover:border-brand-orange hover:text-brand-orange'
                    }`}
                  >
                    R$ {v}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 bg-white border-2 border-dashed border-[#0f172a]/20 rounded-xl p-4 mb-4">
                <div className="flex-1">
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#0f172a]/50 mb-1">Chave Pix (CNPJ)</div>
                  <strong className="font-mono text-base text-navy">{pixKey}</strong>
                </div>
                <button onClick={handleCopy} className="flex items-center gap-2 bg-navy text-white px-4 py-2.5 rounded-lg font-black uppercase tracking-wide text-xs hover:bg-brand-orange transition-colors flex-shrink-0">
                  {copied ? <><Check size={14} /> Copiado!</> : <><Copy size={14} /> Copiar</>}
                </button>
              </div>
              <p className="text-sm text-[#0f172a]/70">
                Beneficiário: <strong className="text-navy">Base Vôlei Louveira — Associação Esportiva</strong> · Banco Sicredi.<br />
                Toda movimentação é publicada na nossa{' '}
                <Link to="/arrecadacao" className="text-brand-orange font-bold hover:underline">página de Transparência</Link>.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#0f172a]/5 border border-[#0f172a]/10 rounded-2xl p-8"
            >
              <div className="bg-white p-6 rounded-xl border border-[#0f172a]/10 mb-6">
                <div
                  className="aspect-square w-full max-w-[240px] mx-auto rounded-xl overflow-hidden relative"
                  style={{ background: 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 0 0 / 24px 24px' }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white p-2 rounded-lg">
                      <img src="/logo.png" alt="logo" className="h-8 w-auto" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0f172a]/50 mb-2">Pague pelo app</div>
                <div className="text-4xl font-black uppercase tracking-tighter text-navy">
                  R$ {selectedAmount.toLocaleString('pt-BR')},00
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SEJA UM PARCEIRO ─────────────────────────────────────────────── */}
      <section className="bg-navy py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col items-center text-center max-w-2xl mx-auto">
            <Handshake size={48} className="text-brand-orange mb-6" />
            <h2 className="text-5xl md:text-6xl font-black uppercase leading-[1.0] tracking-tighter mb-6">
              <span className="text-white">Seja um </span>
              <span className="text-brand-orange">parceiro</span>
            </h2>
            <p className="text-lg leading-relaxed text-white/70">
              Ao investir na Base Vôlei Louveira, sua marca não ganha apenas visibilidade, mas se torna protagonista no desenvolvimento social de nossa cidade.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
