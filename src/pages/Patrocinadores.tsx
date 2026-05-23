import { Handshake, Megaphone, CheckCircle2, Mail, Phone } from 'lucide-react';
import { motion } from 'motion/react';

const benefits = [
  { title: 'Visibilidade na Camisa', desc: 'Sua marca estampada no uniforme oficial de competição.' },
  { title: 'Redes Sociais', desc: 'Exposição para +5.000 seguidores ativos e engajados.' },
  { title: 'Placas de Quadra', desc: 'Banner físico permanente em todos os treinos e jogos em casa.' },
  { title: 'Impacto Social', desc: 'Sua empresa associada a um projeto focado em educação e ética.' },
];

export default function Patrocinadores() {
  return (
    <div className="bg-light pb-20">

      {/* ── HERO ── */}
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

          {/* Top sponsors — maiores */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 w-full max-w-3xl mx-auto"
          >
            <a
              href="https://consultoriaquali.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border-2 border-border hover:border-brand-orange rounded-2xl p-10 flex items-center justify-center transition-all hover:shadow-lg"
            >
              <img src="/qws.png" alt="QWS Consultoria" className="max-h-20 w-auto object-contain" />
            </a>
            <div className="bg-white border-2 border-border hover:border-brand-orange rounded-2xl p-10 flex items-center justify-center transition-all hover:shadow-lg">
              <img src="/soldera.png" alt="Soldera" className="max-h-20 w-auto object-contain" />
            </div>
          </motion.div>

          {/* Bottom sponsors — menores */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full max-w-3xl mx-auto"
          >
            <div className="bg-white border-2 border-border hover:border-brand-orange rounded-2xl p-8 flex items-center justify-center transition-all hover:shadow-lg">
              <img src="/DIMAS LANCHES.png" alt="Dimas Lanches" className="max-h-14 w-auto object-contain" />
            </div>
            <div className="bg-white border-2 border-border hover:border-brand-orange rounded-2xl p-8 flex items-center justify-center transition-all hover:shadow-lg">
              <img src="/personalroberval.jpeg" alt="Personal Roberval" className="max-h-14 w-auto object-contain" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── COLABORADORES ── */}
      <section className="bg-white py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange mb-3">Com o apoio de</p>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-navy">Colaboradores deste projeto</h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-10">
            <motion.a
              href="https://iamod.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="bg-white border-2 border-border group-hover:border-brand-orange rounded-2xl p-6 flex items-center justify-center transition-all hover:shadow-lg w-48 h-24">
                <img src="/iamod.png" alt="IaMod" className="max-h-10 w-auto object-contain" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-navy/50">Desenvolvimento e Tecnologia</p>
            </motion.a>

            <motion.a
              href="https://consultoriaquali.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="bg-white border-2 border-border group-hover:border-brand-orange rounded-2xl p-6 flex items-center justify-center transition-all hover:shadow-lg w-48 h-24">
                <img src="/qws.png" alt="QWS Consultoria" className="max-h-10 w-auto object-contain" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-navy/50">Gestão e Estratégia</p>
            </motion.a>

            <motion.a
              href="https://www.instagram.com/talitaisoppi_fotografa?igsh=MTRpa2t1YzUxajdsZg%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="bg-white border-2 border-border group-hover:border-brand-orange rounded-2xl p-6 flex items-center justify-center transition-all hover:shadow-lg w-48 h-24">
                <img src="/tatlita.png" alt="Talita Isoppi" className="max-h-10 w-auto object-contain" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-navy/50">Fotos Atletas</p>
            </motion.a>
          </div>
        </div>
      </section>

      {/* ── SEJA UM PARCEIRO ── */}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {benefits.map((b, idx) => (
                  <div key={idx} className="flex gap-4">
                    <CheckCircle2 className="text-brand-orange shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wider mb-2">{b.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 lg:pl-16">
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm h-full flex flex-col justify-center">
                <h3 className="text-xl font-extrabold uppercase mb-2 border-b border-white/10 pb-4">Para mais informações</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 mt-4">
                  Quer ter sua marca associada ao time e apoiar o desenvolvimento esportivo de jovens talentos? Entre em contato com a gente.
                </p>
                <div className="space-y-5">
                  <a
                    href="mailto:voleilouveirabase@gmail.com"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center shrink-0 group-hover:bg-brand-orange transition-colors">
                      <Mail size={18} className="text-brand-orange group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5">E-mail</p>
                      <p className="text-white font-bold text-sm group-hover:text-brand-orange transition-colors">voleilouveirabase@gmail.com</p>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/5519998316285?text=Ol%C3%A1%20gostaria%20de%20ser%20um%20patrocinador"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center shrink-0 group-hover:bg-brand-orange transition-colors">
                      <Phone size={18} className="text-brand-orange group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5">WhatsApp</p>
                      <p className="text-white font-bold text-sm group-hover:text-brand-orange transition-colors">+55 (19) 99831-6285</p>
                    </div>
                  </a>
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
