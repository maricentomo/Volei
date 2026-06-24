export default function Cardapio() {
  const sections = [
    {
      title: 'Bebidas',
      icon: '🥤',
      items: [
        { name: 'Água',                   price: 5.00 },
        { name: 'Refrigerante pequeno',   price: 5.50 },
        { name: 'Suco / Água de coco',    price: 5.00 },
        { name: 'Gatorade / Isotônico',   price: 9.00 },
        { name: 'Café',                   price: 2.00 },
      ],
    },
    {
      title: 'Salgados',
      icon: '🥐',
      items: [
        { name: 'Salgado assado',                    price: 10.00 },
        { name: 'Combo 10 mini salgados fritos',     price: 10.00 },
        { name: 'Mini pipoca de microondas 50g',     price:  5.00 },
        { name: 'Salgadinho pequeno',                price:  2.00 },
        { name: 'Salgadinho Torcida',                price:  4.00 },
      ],
    },
    {
      title: 'Doces',
      icon: '🍫',
      items: [
        { name: 'Paçoquinha',         price: 1.00 },
        { name: 'Chocolate',          price: 4.00 },
        { name: 'Bolinho / Barrinha', price: 4.00 },
      ],
    },
  ];

  const fmt = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div>
      {/* Hero */}
      <header className="bg-navy text-white py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-brand-orange text-white px-3 py-1 text-[10px] font-black rounded uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-white" /> Cantina solidária
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
            Cardápio
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto leading-relaxed">
            Cada compra ajuda a financiar a temporada do time. Obrigado pelo apoio!
          </p>
        </div>
      </header>

      {/* Sections */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-2xl mx-auto flex flex-col gap-14">
          {sections.map(sec => (
            <div key={sec.title}>
              {/* Section header */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{sec.icon}</span>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-navy">{sec.title}</h2>
                <div className="flex-1 h-0.5 bg-navy/10 ml-2" />
              </div>

              {/* Items */}
              <div className="flex flex-col gap-1">
                {sec.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-5 py-4 rounded-xl hover:bg-navy/5 transition-colors"
                  >
                    <span className="text-navy font-medium text-[15px]">{item.name}</span>
                    <span className="font-black text-brand-orange text-[15px] tabular-nums ml-4 shrink-0">
                      {fmt(item.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer note */}
      <div className="pb-20 px-4 text-center">
        <p className="text-navy/40 text-sm">
          Valores sujeitos a alteração. Pagamento em dinheiro ou Pix.
        </p>
      </div>
    </div>
  );
}
