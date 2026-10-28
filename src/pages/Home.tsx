import { ArrowRight, Check, Copy, Handshake, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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


const PRO_PHOTOS = Array.from({ length: 8 }, (_, i) => `/fotos-pro/${i}.jpeg`);

function ProGallery() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % PRO_PHOTOS.length), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full max-w-xs select-none">
      <div
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '8px 8px 0px #ed6c15',
          aspectRatio: '3/4',
          background: '#0f172a',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={idx}
            src={PRO_PHOTOS[idx]}
            alt="Base Vôlei Louveira"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

const MARQUEE_ITEMS = Array(8).fill('A sua ajuda realiza um sonho');

const PIX_KEY = 'voleilouveirabase@gmail.com';
const DATA_VIAGEM = new Date('2026-10-30T00:00:00-03:00');

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(target.getTime() - now, 0);
  return {
    done: diff === 0,
    dias: Math.floor(diff / 86400000),
    horas: Math.floor(diff / 3600000) % 24,
    min: Math.floor(diff / 60000) % 60,
    seg: Math.floor(diff / 1000) % 60,
  };
}

function PixKeyCopy({ dark = false }: { dark?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(PIX_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className={`w-full flex items-center justify-between gap-3 rounded-xl px-4 py-3 border-2 border-dashed text-left transition-colors ${
        dark
          ? 'border-white/25 hover:border-brand-orange bg-white/5'
          : 'border-[#0f172a]/20 hover:border-brand-orange bg-white'
      }`}
    >
      <span className="min-w-0">
        <span className={`block text-[10px] font-black uppercase tracking-widest ${dark ? 'text-white/50' : 'text-[#0f172a]/50'}`}>
          Chave Pix (e-mail)
        </span>
        <span className={`block font-black text-sm md:text-base truncate ${dark ? 'text-white' : 'text-navy'}`}>{PIX_KEY}</span>
      </span>
      <span className="shrink-0 flex items-center gap-1.5 bg-brand-orange text-white px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider">
        {copied ? <><Check size={14} /> Copiado</> : <><Copy size={14} /> Copiar</>}
      </span>
    </button>
  );
}

export default function Home() {
  const { data } = useCampanha();
  const meta     = data?.meta ?? 40000;
  const atual    = data?.arrecadado ?? 0;
  const progresso = (atual / meta) * 100;
  const countdown = useCountdown(DATA_VIAGEM);

  const [centavosInt, setCentavosInt] = useState(10000);
  const selectedAmount = centavosInt / 100;
  const setSelectedAmount = (v: number) => setCentavosInt(Math.round(v * 100));

  const handleCentavosKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key >= '0' && e.key <= '9') {
      e.preventDefault();
      const next = centavosInt * 10 + parseInt(e.key);
      if (next <= 9999999) setCentavosInt(next);
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      setCentavosInt(Math.floor(centavosInt / 10));
    }
  };

  const [showDonationForm, setShowDonationForm] = useState(false);
  const [donationForm, setDonationForm] = useState({ name: '', email: '', cpf: '' });
  const [donationLoading, setDonationLoading] = useState(false);
  const [donationPixData, setDonationPixData] = useState<{ qr_code: string; qr_code_base64: string; total: number } | null>(null);
  const [donationError, setDonationError] = useState('');
  const [donationPaid, setDonationPaid] = useState(false);

  const finalizeDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setDonationLoading(true);
    setDonationError('');
    try {
      const res = await fetch('https://bot-n8n.k474gt.easypanel.host/webhook/doacao-criar-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total: selectedAmount,
          nome: donationForm.name,
          email: donationForm.email,
          cpf: donationForm.cpf.replace(/\D/g, ''),
        }),
      });
      const json = await res.json();
      if (!res.ok || json.erro) throw new Error(json.mensagem || 'Erro ao gerar Pix');
      setDonationPixData(json);
      setShowDonationForm(false);
    } catch (err: unknown) {
      setDonationError(err instanceof Error ? err.message : 'Erro ao conectar. Tente novamente.');
    } finally {
      setDonationLoading(false);
    }
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
                  Reta final
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-navy leading-[1.0] uppercase tracking-tighter italic mb-6">
                Reta final<br />rumo à<br />
                <span className="text-brand-orange">Taça Paraná.</span>
              </h1>

              <p className="text-[#0f172a]/70 text-lg mb-8 max-w-xl leading-relaxed">
                <span className="font-bold text-navy">Obrigado a todos que contribuíram!</span> Graças a vocês, os atletas da Base Vôlei Louveira Sub-17 vão disputar a Taça Paraná. Mas ainda dá tempo de ajudar: as doações agora cobrem os custos deles durante a viagem, como alimentação e transporte.
              </p>

              {/* Reta final — countdown */}
              <div className="border-2 border-brand-orange rounded-2xl p-5 md:p-6 mb-8 max-w-xl bg-brand-orange/5">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
                  Reta final da campanha
                </div>
                {countdown.done ? (
                  <p className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-navy">
                    É hoje! Boa viagem, atletas! 🏐
                  </p>
                ) : (
                  <>
                    <p className="text-navy font-black uppercase tracking-tight text-sm mb-3">
                      {countdown.dias === 0 ? 'Menos de 1 dia' : `Falta${countdown.dias > 1 ? 'm' : ''} ${countdown.dias} dia${countdown.dias > 1 ? 's' : ''}`} para a viagem
                    </p>
                    <div className="grid grid-cols-4 gap-2 md:gap-3">
                      {[
                        { v: countdown.dias, l: 'Dias' },
                        { v: countdown.horas, l: 'Horas' },
                        { v: countdown.min, l: 'Min' },
                        { v: countdown.seg, l: 'Seg' },
                      ].map(u => (
                        <div key={u.l} className="bg-navy rounded-xl py-3 text-center">
                          <div className="text-3xl md:text-4xl font-black text-brand-orange leading-none tabular-nums">
                            {String(u.v).padStart(2, '0')}
                          </div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-white/60 mt-1">{u.l}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                <a href="#doar" className="btn-primary flex items-center gap-2">
                  Doar via Pix <ArrowRight size={16} />
                </a>
                <Link to="/atletas" className="px-6 py-3 rounded-lg font-bold uppercase tracking-wider border-2 border-[#0f172a]/30 text-navy hover:bg-navy hover:text-white transition-colors flex items-center gap-2">
                  Conheça os atletas <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>

            {/* Right — dark card */}
            <motion.aside
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-navy rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col gap-6 shadow-2xl"
            >
              {/* Rotating sticker */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute top-4 right-4 w-16 h-16 md:w-20 md:h-20"
              >
                <img src="/contribua.png" alt="Contribua" className="w-full h-full object-contain" />
              </motion.div>

              <div>
                <div className="flex items-center gap-1.5 bg-brand-orange/20 border border-brand-orange/30 text-brand-orange px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
                  Ao vivo
                </div>
                <div className="text-brand-orange font-black leading-none tracking-tighter mb-2" style={{ fontSize: 'clamp(52px,6.5vw,92px)' }}>
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
              </div>

              {/* Doação Pix direto no card */}
              <div className="border-t border-white/10 pt-6">
                <p className="text-white font-black uppercase tracking-tight text-lg mb-1">Doe via Pix agora</p>
                <p className="text-white/55 text-sm mb-4">Copie a chave e faça o Pix pelo app do seu banco, ou gere um QR Code.</p>

                <PixKeyCopy dark />

                {donationPixData ? (
                  <div className="mt-4 bg-white rounded-xl p-4 flex items-center gap-4">
                    <img
                      src={`data:image/png;base64,${donationPixData.qr_code_base64}`}
                      alt="QR Code Pix"
                      className="w-28 h-28 rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-black uppercase tracking-widest text-[#0f172a]/50">Pague pelo app</div>
                      <div className="text-2xl font-black tracking-tighter text-navy mb-2">R$ {donationPixData.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                      <button
                        onClick={() => { navigator.clipboard?.writeText(donationPixData.qr_code); }}
                        className="w-full py-2 border-2 border-[#0f172a]/20 rounded-lg font-black uppercase tracking-wider text-[11px] text-navy hover:border-brand-orange hover:text-brand-orange transition-colors"
                      >
                        <Copy size={12} className="inline mr-1" /> Copia e cola
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2 mt-4 mb-3">
                      {[10, 30, 50, 100, 250].map(v => (
                        <button
                          key={v}
                          onClick={() => setSelectedAmount(v)}
                          className={`px-3.5 py-1.5 rounded-full font-black text-sm border-2 transition-all ${
                            selectedAmount === v
                              ? 'bg-brand-orange text-white border-brand-orange'
                              : 'border-white/20 text-white hover:border-brand-orange hover:text-brand-orange'
                          }`}
                        >
                          R$ {v}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowDonationForm(true)}
                      className="w-full bg-brand-orange text-white py-3.5 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-white hover:text-navy transition-colors"
                    >
                      Gerar QR Code de R$ {selectedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} →
                    </button>
                  </>
                )}
                <p className="text-white/45 text-[11px] mt-3 leading-relaxed">
                  Mercado Pago · em nome de Mariana Rodrigues Centomo (Base Vôlei Louveira)
                </p>
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

            {/* Right — photo gallery */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center py-16 px-8"
            >
              <ProGallery />
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

              <div className="flex flex-wrap gap-3 mb-4">
                {[5, 10, 15, 30, 50, 100, 250, 500].map(v => (
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

              <div className="flex items-center gap-3 mb-7">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#0f172a]/50 whitespace-nowrap">ou doe qualquer valor</span>
                <div className="flex items-center border-2 border-[#0f172a]/20 rounded-full px-4 py-2 bg-white focus-within:border-brand-orange transition-colors flex-1 max-w-[200px]">
                  <span className="font-black text-navy/50 mr-1">R$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    readOnly
                    value={(centavosInt / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    onKeyDown={handleCentavosKey}
                    className="w-full font-black text-navy text-base outline-none bg-transparent cursor-text"
                  />
                </div>
              </div>

              <button
                onClick={() => setShowDonationForm(true)}
                className="w-full bg-brand-orange text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-navy transition-colors mb-5"
              >
                Gerar QR Code Pix →
              </button>
              <div className="mb-5">
                <p className="text-[11px] font-black uppercase tracking-widest text-[#0f172a]/50 mb-2">Ou faça o Pix direto pela chave</p>
                <PixKeyCopy />
              </div>
              <p className="text-sm text-[#0f172a]/70">
                Beneficiário: <strong className="text-navy">Base Vôlei Louveira</strong> — Mercado Pago em nome de <strong className="text-navy">Mariana Rodrigues Centomo</strong>.<br />
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
              {donationPaid ? (
                <div className="flex flex-col items-center text-center py-8 gap-4">
                  <div className="w-20 h-20 rounded-full bg-brand-orange flex items-center justify-center text-white text-[44px]">✓</div>
                  <h3 className="font-black text-navy uppercase text-xl tracking-tight">Obrigado pela doação!</h3>
                  <p className="text-navy/60 text-sm leading-relaxed">Seu Pix foi gerado. Confirme o pagamento no seu banco e você receberá um e-mail de confirmação.</p>
                  <button onClick={() => { setDonationPaid(false); setDonationPixData(null); }} className="px-6 py-3 bg-navy text-white font-black uppercase tracking-widest text-sm rounded-xl hover:bg-brand-orange transition-colors">
                    Fazer outra doação
                  </button>
                </div>
              ) : donationPixData ? (
                <>
                  <div className="bg-white p-4 rounded-xl border border-[#0f172a]/10 mb-5">
                    <img
                      src={`data:image/png;base64,${donationPixData.qr_code_base64}`}
                      alt="QR Code Pix"
                      className="w-full max-w-[220px] mx-auto block rounded-lg"
                    />
                  </div>
                  <div className="text-center mb-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0f172a]/50 mb-1">Pague pelo app</div>
                    <div className="text-3xl font-black uppercase tracking-tighter text-navy">R$ {donationPixData.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  </div>
                  <button
                    onClick={() => { navigator.clipboard?.writeText(donationPixData.qr_code); }}
                    className="w-full py-3 border-2 border-[#0f172a]/20 rounded-xl font-black uppercase tracking-widest text-sm text-navy hover:border-brand-orange hover:text-brand-orange transition-colors mb-3"
                  >
                    <Copy size={14} className="inline mr-2" /> Copiar código Pix
                  </button>
                  <button onClick={() => setDonationPaid(true)} className="w-full py-3 bg-navy text-white font-black uppercase tracking-widest text-sm rounded-xl hover:bg-brand-orange transition-colors">
                    Já paguei ✓
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-white p-6 rounded-xl border border-[#0f172a]/10 mb-6 flex items-center justify-center" style={{ minHeight: 240 }}>
                    <div className="text-center text-navy/30">
                      <div className="text-6xl mb-3">⬜</div>
                      <div className="font-black uppercase text-sm tracking-widest">QR Code aparece aqui</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0f172a]/50 mb-2">Pague pelo app</div>
                    <div className="text-4xl font-black uppercase tracking-tighter text-navy">R$ {selectedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Modal formulário doação ───────────────────────────────────────── */}
      <AnimatePresence>
        {showDonationForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowDonationForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-navy uppercase text-xl tracking-tight">Seus dados</h3>
                <button onClick={() => setShowDonationForm(false)} className="text-navy/40 hover:text-navy">
                  <X size={20} />
                </button>
              </div>
              <div className="bg-brand-orange/10 border border-brand-orange/20 rounded-xl p-4 mb-6 text-center">
                <div className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-1">Valor da doação</div>
                <div className="text-3xl font-black text-navy">R$ {selectedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              <form onSubmit={finalizeDonation} className="flex flex-col gap-4">
                {[
                  { id: 'name',  label: 'Seu nome completo', type: 'text',  placeholder: 'Ana Silva'         },
                  { id: 'email', label: 'E-mail',             type: 'email', placeholder: 'ana@email.com'     },
                  { id: 'cpf',   label: 'CPF',                type: 'text',  placeholder: '000.000.000-00'    },
                ].map(f => (
                  <div key={f.id}>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-navy/60 mb-1">{f.label}</label>
                    <input
                      type={f.type}
                      required
                      placeholder={f.placeholder}
                      value={donationForm[f.id as keyof typeof donationForm]}
                      onChange={e => setDonationForm(prev => ({ ...prev, [f.id]: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-[#0f172a]/15 font-mono text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-[#ed6c15]/20"
                    />
                  </div>
                ))}
                {donationError && <p className="text-red-500 text-sm font-bold">{donationError}</p>}
                <button
                  type="submit"
                  disabled={donationLoading}
                  className="w-full bg-brand-orange text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-navy transition-colors disabled:opacity-50 mt-2"
                >
                  {donationLoading ? 'Gerando...' : 'Gerar QR Code Pix →'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
