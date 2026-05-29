import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCampanha } from '../lib/useCampanha';

function AtCard({ num, short, pos, photo }: { num: string; short: string; pos: string; photo?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4 }}
      className="relative aspect-[2/3] rounded-xl overflow-hidden bg-white border border-[#0f172a]/10"
      style={{ backgroundImage: photo ? 'none' : 'repeating-linear-gradient(135deg, rgba(11,26,58,.04) 0 2px, transparent 2px 14px)' }}
    >
      {photo && (
        <img
          src={photo}
          alt={short}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          style={{ position: 'absolute', top: '-12%', left: 0, width: '100%', height: '112%', objectFit: 'cover', objectPosition: 'top' }}
        />
      )}
      {!photo && (
        <span className="absolute -top-4 -right-2 text-[120px] font-black leading-none text-navy/[0.07] pointer-events-none select-none">{num}</span>
      )}
      <span className="absolute top-3 left-4 text-5xl font-black text-brand-orange leading-none drop-shadow-sm">{num}</span>
      <span className="absolute top-4 right-4 bg-navy text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">{pos}</span>
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 px-4 pt-3 pb-3">
        <div className="font-extrabold text-navy uppercase text-sm leading-tight tracking-tight">{short}</div>
      </div>
    </motion.div>
  );
}

export default function Atletas() {
  const { data, loading } = useCampanha();
  const roster = data?.atletas ?? [];

  return (
    <div className="bg-white">

      {/* ── Hero ─────────────────────────────────────────── */}
      <header className="bg-navy text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-16 md:py-20">

          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-flex items-center gap-2 bg-brand-orange text-white px-3 py-1 text-[10px] font-black rounded uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Sub-17 Masculino
              </span>
              <span className="inline-block bg-white/10 text-white px-3 py-1 text-[10px] font-black rounded uppercase tracking-widest">
                Fundado em 2021
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
              O time<br /><span className="text-brand-orange">por trás</span><br />do sonho.
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-lg">
              22 atletas entre 15 e 17 anos, um técnico dedicado, uma quadra municipal e uma cidade inteira torcendo. Conheça a equipe que representa Louveira na Taça Paraná.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex items-center justify-center"
          >
            <div
              className="w-full max-w-sm"
              style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '8px 8px 0px #ed6c15', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(8px,8px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0px 0px 0px #ed6c15'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(0,0)'; (e.currentTarget as HTMLElement).style.boxShadow = '8px 8px 0px #ed6c15'; }}
            >
              <img src="/time.png" alt="Time Base Vôlei Louveira" className="w-full object-cover" style={{ aspectRatio: '16/10' }} />
            </div>
          </motion.div>

        </div>
      </header>

      {/* ── Stats strip ──────────────────────────────────── */}
      <div className="bg-brand-orange">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { v: '80+', l: 'Atletas no projeto' },
            { v: '1',   l: 'Técnico principal' },
            { v: '6',   l: 'Competições por ano' },
            { v: '7',   l: 'Títulos em 2024–25' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="text-6xl font-black text-navy leading-none">{s.v}</div>
              <div className="text-[11px] font-black uppercase tracking-widest text-navy/70 mt-2">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Nossa história ───────────────────────────────── */}
      <section className="py-24 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-20 items-start">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-4">Nossa história</p>
            <h2 className="text-4xl md:text-6xl font-black text-navy uppercase tracking-tighter leading-tight">
              Formando atletas.<br /><span className="text-brand-orange">Inspirando futuros</span><br />campeões.
            </h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <p className="text-navy/75 text-lg leading-relaxed mb-5">
              O Time Masculino Sub-17 encontrou no esporte muito mais do que competição: encontrou disciplina, propósito, amadurecimento, superação e transformação.
            </p>
            <p className="text-navy/65 text-base leading-relaxed mb-5">
              Agora, o time se mobiliza para disputar a Taça Paraná — uma das maiores competições de voleibol de base do Brasil e da América Latina. Mais do que um campeonato, essa experiência representa oportunidade, crescimento e memórias que podem marcar esses jovens para o resto da vida.
            </p>
            <p className="text-navy/65 text-base leading-relaxed mb-8">
              O projeto Base Vôlei Louveira nasceu em 2021, vinculado à Prefeitura Municipal de Louveira, e hoje reúne diversas categorias de formação esportiva. Mas a participação da categoria Sub-17 Masculino nessa importante competição depende também de uma grande mobilização fora das quadras.
            </p>

            <div className="bg-navy rounded-2xl p-8">
              <p className="font-black text-white text-base md:text-lg leading-tight tracking-tight mb-4">
                <span className="text-brand-orange">"</span>A gente quer que esses meninos olhem pra trás e lembrem que a cidade inteira empurrou junto.<span className="text-brand-orange">"</span>
              </p>
              <p className="text-[11px] font-black uppercase tracking-widest text-white/50">— Alisson Salomão · Técnico principal</p>
            </div>
          </motion.div>
        </div>
      </section>

    
      {/* ── Elenco completo ──────────────────────────────── */}
      <section className="py-24 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-3">Elenco completo</p>
              <h2 className="text-4xl md:text-6xl font-black text-navy uppercase tracking-tighter leading-tight">
                Os 22<br />na quadra.
              </h2>
            </div>
            <p className="text-[#0f172a]/60 max-w-xs leading-relaxed text-sm">
              Cada atleta representa um número na rifa. Apoie o seu favorito comprando a cota com o nome dele.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {loading && (
              <div className="col-span-full py-16 text-center font-black text-navy/30 uppercase tracking-widest text-sm">Carregando elenco…</div>
            )}
            {roster.map((a, i) => (
              <motion.div
                key={a.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 6) * 0.06, duration: 0.4 }}
              >
                <AtCard num={a.num} short={a.short} pos={a.pos} photo={a.photo ?? undefined} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comissão técnica ─────────────────────────────── */}
      <section className="py-24 px-4 md:px-8 bg-navy">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — texto */}
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-4">Comissão técnica</p>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight mb-10">
              Quem<br />conduz.
            </h2>
            <div className="font-black text-white uppercase text-2xl tracking-tight mb-1">Alisson Salomão</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-4">Técnico principal · desde 2021</div>
            <p className="text-white/60 text-base leading-relaxed">
            Vinculado à Secretaria de Esportes, Lazer e Juventude, a Base Vôlei Louveira é comandada, desde 2021, pelo professor Alisson Salomão.

Alisson é formado em Educação Física pela Escola Superior de Educação Física — ESEF — e possui mais de 10 anos de experiência atuando com voleibol.            </p>
          </motion.div>

          {/* Right — foto com efeito */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div
              style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '8px 8px 0px #ed6c15', transition: 'transform 0.2s ease, box-shadow 0.2s ease', cursor: 'pointer', width: '70%' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(8px,8px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0px 0px 0px #ed6c15'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(0,0)'; (e.currentTarget as HTMLElement).style.boxShadow = '8px 8px 0px #ed6c15'; }}
            >
              <img src="/Fotos_Atletas/31_ALISSONtecnico.jpg" alt="Alisson Salomão" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
            </div>
          </motion.div>

        </div>
      </section>

        {/* ── Linha do tempo ───────────────────────────────── */}
        <section className="py-24 px-4 md:px-8 bg-navy">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-4">Linha do tempo</p>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight">
              Como chegamos<br />até aqui.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-16">
            {[
              [
                { yr: '2021', title: 'Primeiro saque', body: 'O projeto nasce vinculado à Prefeitura de Louveira. Primeiros treinos, primeiras equipes formadas.' },
                { yr: '2022', title: 'Consolidação', body: 'Crescimento do número de atletas e participação nas primeiras competições regionais.' },
                { yr: '2023', title: 'Primeiro título', body: 'Campeões regionais sub-21 em Santa Gertrudes. A cidade começa a olhar pro projeto.' },
              ],
              [
                { yr: '2024', title: 'Safra de ouro', body: 'Campeões regionais sub-19 e sub-21, vice na Liga de Sorocaba sub-17 e sub-19, 3º nos Jogos Regionais.' },
                { yr: '2025', title: 'Expansão nacional', body: 'Taça Paraná, Copa São Paulo, Jogos da Juventude. 7 competições, 4 pódios, visibilidade nacional.' },
                { yr: '2026', title: 'Rumo a São José dos Pinhais e Curitiba', body: 'Campanha pública aberta. Meta de R$ 40 mil. Você está lendo a história em tempo real.' },
              ],
            ].map((col, ci) => (
              <div key={ci} className="relative pl-8 border-l-2 border-white/10">
                {col.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (ci * 3 + i) * 0.07 }}
                    className="pb-10 relative"
                  >
                    <span className="absolute -left-[41px] top-2 w-3.5 h-3.5 rounded-full bg-brand-orange ring-4 ring-navy" />
                    <div className="text-3xl font-black text-brand-orange leading-none mb-2">{item.yr}</div>
                    <h4 className="font-black text-white uppercase text-lg tracking-tight mb-2">{item.title}</h4>
                    <p className="text-white/55 text-sm leading-relaxed">{item.body}</p>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── Por que essa categoria importa ───────────────── */}
      <section className="py-24 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-4">Sobre o vôlei de base</p>
            <h2 className="text-4xl md:text-6xl font-black text-navy uppercase tracking-tighter leading-tight">
              Por que<br />essa categoria<br />importa.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: '01', title: 'O esporte molda o caráter e desenvolve virtudes', body: 'Além da formação de atletas, o esporte desenvolve competências que fortalecem o caráter e acompanham esses jovens por toda a vida, dentro e fora das quadras.' },
              { n: '02', title: 'A Taça Paraná é uma vitrine de oportunidades', body: 'A Taça Paraná reúne grandes equipes e jovens talentos do Brasil e da América Latina. Mais do que uma competição, é uma oportunidade de crescimento, aprendizado e visibilidade que pode marcar o futuro desses atletas.' },
              { n: '03', title: 'Por trás de cada atleta, existe uma rede acreditando', body: 'Pais, familiares, técnicos e apoiadores caminham juntos para manter esse sonho vivo. Cada contribuição ajuda a transformar dedicação, esforço e talento em oportunidades reais para esses jovens.' },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="border border-navy/10 rounded-2xl p-8 hover:border-brand-orange transition-colors"
              >
                <div className="text-7xl font-black text-brand-orange leading-none mb-4">{c.n}</div>
                <h3 className="font-extrabold text-navy uppercase text-xl tracking-tight mb-3">{c.title}</h3>
                <p className="text-navy/60 text-sm leading-relaxed">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy py-28 px-4 md:px-8 text-center">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span className="text-[25vw] font-black text-white/[0.04] uppercase leading-none select-none whitespace-nowrap">VOLEI</span>
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight mb-6">
              Bora juntos<br />com esse time?
            </h2>
            <p className="text-white/70 text-lg mb-10 leading-relaxed">
              R$ 30 numa rifa. Um Pix qualquer. Cada gesto vira passagem, hotel e prato cheio pra esses atletas realizarem o sonho.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/rifa" className="flex items-center gap-3 px-8 py-4 bg-brand-orange text-white font-black uppercase tracking-widest text-sm rounded-xl hover:bg-white hover:text-brand-orange transition-colors">
                Comprar Rifa <ArrowRight size={18} />
              </Link>
              <Link to="/arrecadacao" className="flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/20 text-white font-black uppercase tracking-widest text-sm rounded-xl hover:bg-white/20 transition-colors">
                Ver Transparência
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
