import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const VALUES = ['Disciplina', 'Propósito', 'Pertencimento', 'Superação', 'Transformação'];
const VIRTUES = [
  'Maturidade', 'Resiliência', 'Responsabilidade', 'Controle emocional',
  'Cooperação', 'Respeito', 'Liderança', 'Coragem', 'Autocontrole',
];

export default function Projeto() {
  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-navy text-white overflow-hidden" style={{ minHeight: 560 }}>
        <img
          src="/fotos-jogo/jogo1.jpg"
          alt="Base Vôlei Louveira em jogo"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-24 flex flex-col justify-end" style={{ minHeight: 560 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 bg-brand-orange text-white px-3 py-1 text-[10px] font-black rounded uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Base Vôlei Louveira
            </span>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
              Formando atletas.<br />
              <span className="text-brand-orange">Inspirando futuros</span><br />
              campeões.
            </h1>
            <p className="text-white/70 text-xl max-w-xl mt-4">
              Um sonho grande demais para ficar só dentro da quadra.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── VALORES ──────────────────────────────────────────── */}
      <section className="bg-brand-orange py-14 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-white font-black uppercase text-lg tracking-widest mb-8 text-center">
            Encontraram no esporte muito mais do que competição. Encontraram…
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {VALUES.map((v, i) => (
              <motion.div
                key={v}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white text-navy font-black uppercase text-xl px-8 py-4 rounded-full tracking-tight shadow"
              >
                {v}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOTO + TEXTO ─────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <img src="/fotos-jogo/jogo2.jpg" alt="Em jogo" className="w-full rounded-2xl object-cover shadow-lg" style={{ maxHeight: 480 }} />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange block mb-4">A Taça Paraná</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight text-navy mb-6">
              A maior competição<br />de base da<br />América Latina.
            </h2>
            <p className="text-navy/70 text-lg leading-relaxed">
              Jovens atletas do Time de Vôlei Masculino Sub-17 têm a oportunidade de disputar a <strong className="text-navy">Taça Paraná</strong> — uma das maiores e mais importantes competições de voleibol de base do Brasil e da América Latina, reunindo milhares de atletas, equipes tradicionais e jovens talentos de diferentes estados e países.
            </p>
            <p className="text-navy/70 text-lg leading-relaxed mt-4">
              Muito mais do que um campeonato, a Taça Paraná representa <strong className="text-navy">experiência, amadurecimento e oportunidades</strong> que podem marcar a trajetória desses jovens para o resto da vida.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── HISTÓRIA DO PROJETO ──────────────────────────────── */}
      <section className="py-20 px-4 md:px-8" style={{ background: 'rgba(15,23,42,0.03)' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 lg:order-1">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange block mb-4">Desde 2021</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight text-navy mb-6">
              Uma história<br />de união.
            </h2>
            <p className="text-navy/70 text-lg leading-relaxed mb-4">
              O projeto Base Vôlei Louveira nasceu em 2021, vinculado à Prefeitura Municipal de Louveira, e hoje reúne diversas categorias de formação esportiva.
            </p>
            <p className="text-navy/70 text-lg leading-relaxed mb-4">
              Pais, familiares, amigos, apoiadores, patrocinadores e os próprios atletas decidiram unir forças para transformar esse sonho em realidade.
            </p>
            <div className="flex flex-col gap-3 mt-6">
              {['De cooperação.', 'De pessoas dispostas a acreditar nesses jovens.', 'De dedicação que merece apoio.'].map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-orange mt-2 shrink-0" />
                  <p className="text-navy font-bold text-base">{t}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 lg:order-2">
            <img src="/fotos-jogo/jogo3.jpg" alt="Time em ação" className="w-full rounded-2xl object-cover shadow-lg" style={{ maxHeight: 480 }} />
          </motion.div>
        </div>
      </section>

      {/* ── QUOTE CENTRAL ────────────────────────────────────── */}
      <section className="bg-navy py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-white/50 font-black uppercase text-[11px] tracking-[0.4em] mb-8">Por que eles são especiais</p>
            <p className="text-white text-2xl md:text-3xl font-black leading-relaxed mb-6">
              Enquanto muitos adolescentes ainda estão tentando descobrir seus caminhos, eles conciliam{' '}
              <span className="text-brand-orange">escola, provas, treinos, viagens, rotina intensa</span>,
              esforço físico e dedicação ao esporte.
            </p>
            <p className="text-white/70 text-xl leading-relaxed">
              Porque escolheram evoluir. Porque aprenderam que crescimento exige constância. Porque descobriram no esporte um caminho de amadurecimento, caráter e transformação.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FOTOS GRID ───────────────────────────────────────── */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
          {['/fotos-jogo/jogo4.jpg', '/fotos-jogo/jogo5.jpg', '/fotos-jogo/jogo1.jpg'].map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl overflow-hidden shadow"
            >
              <img src={src} alt="Base Vôlei Louveira" className="w-full h-64 object-cover" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── VIRTUDES ─────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8" style={{ background: 'rgba(15,23,42,0.03)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange block mb-4">O que o esporte forma</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-navy">
              Cada treino fortalece<br />mais do que atletas.
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {VIRTUES.map((v, i) => (
              <motion.div
                key={v}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white border border-[#0f172a]/10 rounded-xl p-5 text-center shadow-sm"
              >
                <img src="/bolabola.png" alt="" className="w-10 h-10 mx-auto mb-3 object-contain" />
                <p className="font-black uppercase text-navy text-sm tracking-tight">{v}</p>
              </motion.div>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-navy/60 text-lg mt-10 max-w-2xl mx-auto leading-relaxed"
          >
            Virtudes que eles levarão para muito além das quadras: para a vida adulta, para os estudos, para suas futuras profissões e para o futuro que estão construindo todos os dias.
          </motion.p>
        </div>
      </section>

      {/* ── IMPACTO ──────────────────────────────────────────── */}
      <section className="bg-navy py-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
              Cada apoio se transforma<br />em <span className="text-brand-orange">futuro.</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
            {['Número vendido', 'Apoio', 'Compartilhamento', 'Parceiro'].map((label, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
              >
                <img src="/bolabola.png" alt="" className="w-12 h-12 mx-auto mb-3 object-contain" />
                <p className="text-white font-black uppercase text-sm tracking-tight">Cada {label}</p>
                <p className="text-brand-orange font-black uppercase text-sm mt-1">= Oportunidade</p>
              </motion.div>
            ))}
          </div>
          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center border-t border-white/10 pt-12"
          >
            <p className="text-white/80 text-xl md:text-2xl leading-relaxed italic mb-6">
              "Talvez, daqui a alguns anos, eles não se lembrem do placar de todos os jogos… mas certamente se lembrarão das pessoas que acreditaram neles quando esse sonho ainda estava começando."
            </p>
            <p className="text-brand-orange font-black uppercase tracking-widest text-sm">💙 Base Vôlei Louveira — Sub-17</p>
          </motion.blockquote>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-navy mb-6">
              Bem-vindo ao<br /><span className="text-brand-orange">Time Sub-17.</span>
            </h2>
            <p className="text-navy/60 text-lg leading-relaxed mb-10">
              Faça parte dessa história. Cada contribuição, por menor que seja, ajuda esses jovens a viver experiências que podem mudar suas vidas.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/rifa" className="inline-flex items-center gap-2 bg-brand-orange text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-navy transition-colors">
                Participar da Rifa <ArrowRight size={16} />
              </Link>
              <Link to="/atletas" className="inline-flex items-center gap-2 border-2 border-navy text-navy px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-navy hover:text-white transition-colors">
                Conhecer a Equipe <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
