import { Handshake, Megaphone, TrendingUp, CheckCircle2, Mail, Phone } from 'lucide-react';
import { motion } from 'motion/react';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const sponsors = [
  { name: 'SOLDERA', type: 'Diamante', description: 'Oficina Mecânica especializada e soluções automotivas.' },
  { name: 'LOUVEIRA BURGUER', type: 'Ouro', description: 'A melhor hamburgueria da região apoiando a base.' },
  { name: 'DIMAS LANCHES', type: 'Ouro', description: 'O tradicional hot-dog de Louveira com o vôlei.' },
  { name: 'CVS', type: 'Prata', description: 'Logística e distribuição.' },
];

const benefits = [
  { title: 'Visibilidade na Camisa', desc: 'Sua marca estampada no uniforme oficial de competição.' },
  { title: 'Redes Sociais', desc: 'Exposição para +5.000 seguidores ativos e engajados.' },
  { title: 'Placas de Quadra', desc: 'Banner físico permanente em todos os treinos e jogos em casa.' },
  { title: 'Impacto Social', desc: 'Sua empresa associada a um projeto focado em educação e ética.' },
];

export default function Patrocinadores() {
  return (
    <div className="bg-light pb-20">
      <section className="bg-white py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="badge mb-6">Parceiros de Valor</div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-navy uppercase tracking-tighter mb-6 italic">
              Nossos <span className="text-brand-orange">Patrocinadores</span>
            </h1>
            <p className="text-slate text-lg max-w-2xl leading-relaxed">
              O Vôlei Louveira só é possível graças ao apoio de empresas que acreditam no potencial transformador do esporte na vida de nossos jovens.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full"
          >
            {sponsors.map((s, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                className="bg-white border-2 border-border p-8 rounded-2xl transition-colors hover:border-brand-blue text-center group"
              >
                <div className="text-[10px] font-bold uppercase tracking-widest text-brand-blue mb-4 bg-blue-50 py-1 inline-block px-3 rounded-full">
                  {s.type}
                </div>
                <h3 className="text-2xl font-black text-navy mb-4 group-hover:text-brand-blue transition-colors">{s.name}</h3>
                <p className="text-sm text-slate">{s.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 md:px-8 py-20"
      >
        <div className="bg-navy rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/2">
              <div className="flex items-center gap-4 mb-8">
                <Handshake size={32} className="text-brand-orange" />
                <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tighter">
                  Seja um <br /> <span className="text-brand-orange">Parceiro</span>
                </h2>
              </div>
              <p className="text-slate-400 text-lg mb-12 leading-relaxed">
                Ao investir na Base Vôlei Louveira, sua marca não ganha apenas visibilidade, mas se torna protagonista no desenvolvimento social de nossa cidade.
              </p>

              <motion.div
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {benefits.map((b, idx) => (
                  <motion.div key={idx} variants={fadeUp} className="flex gap-4">
                    <CheckCircle2 className="text-brand-orange shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wider mb-2">{b.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <div className="lg:w-1/2 lg:pl-16">
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
                <h3 className="text-xl font-extrabold uppercase mb-8 border-b border-white/10 pb-4">Plano de Cotas</h3>
                <div className="space-y-6">
                  {[
                    { level: 'DIAMANTE', sub: 'Cota Master - Exclusiva' },
                    { level: 'OURO', sub: 'Exposição de Uniforme' },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ x: 6 }}
                      className="flex justify-between items-center group cursor-default"
                    >
                      <div>
                        <span className="block font-black text-lg">{item.level}</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest">{item.sub}</span>
                      </div>
                      <TrendingUp className="text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  ))}
                  <div className="flex justify-between items-center group cursor-default border-t border-white/10 pt-6">
                    <div>
                      <span className="block font-black text-lg">CONTATO</span>
                      <div className="flex flex-col gap-2 mt-4">
                        <div className="flex items-center gap-3 text-sm text-slate-300">
                          <Mail size={16} className="text-brand-orange" />
                          contato@basevoleilouveira.com
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-300">
                          <Phone size={16} className="text-brand-orange" />
                          (19) 99999-9999
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150">
            <Megaphone size={300} />
          </div>
        </div>
      </motion.section>
    </div>
  );
}
