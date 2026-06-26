import { useState, useEffect } from 'react';
import {
  Milk, GlassWater, CupSoda, Zap, Coffee,
  Croissant, Bubbles, Popcorn, Cookie, Candy,
  CakeSlice, PawPrint, Cuboid,
} from 'lucide-react';

const SZ = { className: 'w-10 h-10 text-[#0F172A]', strokeWidth: 1.5 };

const ICONS: Record<string, React.ReactNode> = {
  agua:           <Milk           {...SZ} />,
  refri:          <CupSoda        {...SZ} />,
  suco:           <GlassWater     {...SZ} />,
  isoton:         <Zap            {...SZ} />,
  cafe:           <Coffee         {...SZ} />,
  salgado_assado: <Croissant      {...SZ} />,
  mini_salgado:   <Bubbles        {...SZ} />,
  pipoca_grande:  <Popcorn        {...SZ} />,
  pipoca_pequena: <Popcorn        {...SZ} />,
  salgadinho:     <Cookie         {...SZ} />,
  pacoquinha:     <Candy          {...SZ} />,
  chocolate:      <Cuboid         {...SZ} />,
  bolinho:        <CakeSlice      {...SZ} />,
  pipoquinha:     <Popcorn        {...SZ} />,
  balinha_fini:   <PawPrint       {...SZ} />,
};

const CANTINA_USER = 'admin';
const CANTINA_PWD = 'base@2026';
const PIX_KEY = '+5511991466870';
const PIX_NAME = 'Base Volei Louveira';
const PIX_CITY = 'Louveira';
const N8N_WEBHOOK = 'https://bot-n8n.k474gt.easypanel.host/webhook/cantina-registrar-venda';

function crc16(str: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function f(id: string, v: string): string {
  return `${id}${String(v.length).padStart(2, '0')}${v}`;
}

function gerarPix(amount: number): string {
  const ma = f('00', 'BR.GOV.BCB.PIX') + f('01', PIX_KEY);
  const body = [
    f('00', '01'),
    f('26', ma),
    f('52', '0000'),
    f('53', '986'),
    f('54', amount.toFixed(2)),
    f('58', 'BR'),
    f('59', PIX_NAME.slice(0, 25)),
    f('60', PIX_CITY.slice(0, 15)),
    f('62', f('05', '***')),
    '6304',
  ].join('');
  return body + crc16(body);
}

const MENU = [
  {
    category: 'Bebidas',
    items: [
      { id: 'agua',   name: 'Água',               price: 5.00 },
      { id: 'refri',  name: 'Refrigerante',        price: 5.00 },
      { id: 'suco',   name: 'Suco / Água de coco', price: 5.00 },
      { id: 'isoton', name: 'Isotônico',           price: 9.00 },
      { id: 'cafe',   name: 'Café',                price: 2.00 },
    ],
  },
  {
    category: 'Salgados',
    items: [
      { id: 'salgado_assado', name: 'Salgado assado',         price: 10.00 },
      { id: 'mini_salgado',   name: 'Mini salgado (10 unid)', price: 10.00 },
      { id: 'pipoca_grande',  name: 'Pipoca grande',          price:  8.00 },
      { id: 'pipoca_pequena', name: 'Pipoca pequena',         price:  4.50 },
      { id: 'salgadinho',     name: 'Salgadinho',             price:  4.00 },
    ],
  },
  {
    category: 'Doces',
    items: [
      { id: 'pacoquinha',   name: 'Paçoquinha',        price: 2.00 },
      { id: 'chocolate',    name: 'Chocolate',          price: 5.00 },
      { id: 'bolinho',      name: 'Bolinho / Barrinha', price: 4.00 },
      { id: 'pipoquinha',   name: 'Pipoquinha',          price: 2.00 },
      { id: 'balinha_fini', name: 'Balinha Fini',        price: 2.00 },
    ],
  },
];

type CartItem = { id: string; name: string; price: number; qty: number };
type PayMethod = 'pix' | 'dinheiro';

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function ItemCard({ item, cartQty, onAdd }: {
  item: { id: string; name: string; price: number };
  cartQty: number;
  onAdd: (item: { id: string; name: string; price: number }, qty: number) => void;
}) {
  const [qty, setQty] = useState(cartQty > 0 ? cartQty : 1);

  useEffect(() => {
    setQty(cartQty > 0 ? cartQty : 1);
  }, [cartQty]);

  const inCart = cartQty > 0;

  return (
    <div className={`bg-white rounded-2xl border-2 p-4 flex flex-col gap-3 transition-colors shadow-sm ${
      inCart ? 'border-[#ed6c15]' : 'border-gray-200 hover:border-[#ed6c15]'
    }`}>
      <div className="flex justify-center pt-1 relative">
        {ICONS[item.id]}
        {inCart && (
          <span className="absolute -top-1 -right-2 bg-[#ed6c15] text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center leading-none">
            {cartQty}
          </span>
        )}
      </div>
      <div className="text-center">
        <div className="font-bold text-[#0F172A] text-sm leading-tight">{item.name}</div>
        <div className="font-black text-[#ed6c15] text-xl mt-1">{fmt(item.price)}</div>
      </div>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setQty(q => Math.max(1, q - 1))}
          className="w-9 h-9 rounded-full bg-gray-100 text-[#0F172A] font-black flex items-center justify-center hover:bg-gray-200 transition-colors text-lg"
        >−</button>
        <span className="font-black text-[#0F172A] text-lg w-8 text-center tabular-nums">{qty}</span>
        <button
          onClick={() => setQty(q => q + 1)}
          className="w-9 h-9 rounded-full bg-gray-100 text-[#0F172A] font-black flex items-center justify-center hover:bg-gray-200 transition-colors text-lg"
        >+</button>
      </div>
      <button
        onClick={() => onAdd(item, qty)}
        className={`w-full py-2.5 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-colors ${
          inCart
            ? 'bg-[#0F172A] hover:bg-[#0F172A]/80'
            : 'bg-[#ed6c15] hover:bg-[#0F172A]'
        }`}
      >
        {inCart ? 'Atualizar' : 'Adicionar'}
      </button>
    </div>
  );
}

export default function Cantina() {
  const [authed, setAuthed] = useState(() => localStorage.getItem('cantina_auth') === 'true');
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [isDoacao, setIsDoacao] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [payMethod, setPayMethod] = useState<PayMethod>('pix');
  const [valorRecebido, setValorRecebido] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const login = () => {
    if (user === CANTINA_USER && pwd === CANTINA_PWD) {
      localStorage.setItem('cantina_auth', 'true');
      setAuthed(true);
    } else {
      setLoginError(true);
      setPwd('');
    }
  };

  const logout = () => {
    localStorage.removeItem('cantina_auth');
    setAuthed(false);
    setUser('');
    setPwd('');
  };

  const addToCart = (item: { id: string; name: string; price: number }, qty: number) => {
    setCart(prev => ({ ...prev, [item.id]: { ...item, qty } }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const cartItems = Object.values(cart);
  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const recebido = parseFloat(valorRecebido.replace(',', '.') || '0');
  const troco = recebido - total;

  const pixStr = showModal && !isDoacao && payMethod === 'pix' && total > 0 ? gerarPix(total) : '';
  const qrUrl = pixStr ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pixStr)}` : '';

  const abrirModal = () => {
    setValorRecebido('');
    setConfirmed(false);
    setShowModal(true);
  };

  const confirmar = async () => {
    setConfirming(true);
    try {
      const now = new Date();
      const data = now.toLocaleDateString('pt-BR');
      const hora = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const itens = cartItems.map(i => `${i.name} x${i.qty}`).join(', ');
      const itens_json = cartItems.map(i => ({ id: i.id, qty: i.qty }));
      const res = await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data, hora, itens, itens_json,
          total_arrecadado: isDoacao ? 0 : total,
          is_doacao: isDoacao,
          pagamento: isDoacao ? 'vale' : payMethod,
          evento: `Cantina ${data}`,
        }),
      });
      if (!res.ok) throw new Error(`n8n ${res.status}`);
      setConfirmed(true);
      setCart({});
      setTimeout(() => {
        setShowModal(false);
        setConfirmed(false);
        setIsDoacao(false);
      }, 3000);
    } catch {
      alert('Erro ao registrar na planilha. Registre manualmente.');
    } finally {
      setConfirming(false);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">🏐</div>
            <h1 className="text-white font-black text-3xl uppercase tracking-tighter">
              Cantina<br /><span className="text-[#ed6c15]">Solidária</span>
            </h1>
            <p className="text-white/40 text-sm mt-2 uppercase tracking-widest font-mono">Acesso do caixa</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <label className="block font-mono text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Usuário</label>
              <input
                type="text" value={user} autoComplete="username"
                onChange={e => { setUser(e.target.value); setLoginError(false); }}
                onKeyDown={e => e.key === 'Enter' && login()}
                placeholder="admin"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-[#ed6c15] placeholder:text-white/30"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] tracking-widest uppercase text-white/40 mb-1.5">Senha</label>
              <input
                type="password" value={pwd} autoComplete="current-password"
                onChange={e => { setPwd(e.target.value); setLoginError(false); }}
                onKeyDown={e => e.key === 'Enter' && login()}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-[#ed6c15] placeholder:text-white/30"
              />
            </div>
            {loginError && <p className="text-red-400 text-xs text-center">Usuário ou senha incorretos</p>}
            <button
              onClick={login}
              className="w-full py-3 bg-[#ed6c15] text-white font-black uppercase tracking-widest text-sm rounded-xl hover:bg-white hover:text-[#0F172A] transition-colors"
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0F172A] text-white px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <div>
          <span className="text-[#ed6c15] font-black text-base uppercase tracking-widest">Cantina Solidária</span>
          <div className="text-white/40 text-xs font-mono mt-0.5">Caixa · {new Date().toLocaleDateString('pt-BR')}</div>
        </div>
        <div className="flex items-center gap-3">
          {total > 0 && !isDoacao && (
            <span className="bg-[#ed6c15] text-white font-black text-sm px-4 py-1.5 rounded-full tabular-nums">
              {fmt(total)}
            </span>
          )}
          {isDoacao && total > 0 && (
            <span className="bg-green-500 text-white font-black text-xs px-3 py-1.5 rounded-full uppercase tracking-widest">
              Vale Lanche
            </span>
          )}
          <button onClick={logout} className="text-white/30 text-xs hover:text-white transition-colors uppercase tracking-widest font-mono">
            Sair
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

        {/* Menu grid */}
        <div className="flex flex-col gap-8">
          {MENU.map(sec => (
            <div key={sec.category}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-black text-[#0F172A] text-2xl uppercase tracking-tighter">{sec.category}</h2>
                <div className="flex-1 h-px bg-gray-200 ml-1" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {sec.items.map(item => (
                  <ItemCard key={item.id} item={item} cartQty={cart[item.id]?.qty ?? 0} onAdd={addToCart} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Order panel */}
        <div className="lg:sticky lg:top-[72px] h-fit">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-[#0F172A] px-5 py-4">
              <h3 className="text-white font-black uppercase tracking-tight text-lg">Pedido atual</h3>
            </div>
            <div className="p-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3">🛒</div>
                  <p className="text-gray-400 text-sm">Nenhum item adicionado</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-2 mb-4 max-h-64 overflow-y-auto">
                    {cartItems.map(ci => (
                      <div key={ci.id} className="flex items-center gap-2 text-sm py-1 border-b border-gray-50">
                        <span className="text-[#0F172A] font-medium flex-1 leading-tight">{ci.name}</span>
                        <span className="text-gray-400 text-xs shrink-0">x{ci.qty}</span>
                        <span className="font-black text-[#0F172A] tabular-nums shrink-0">{fmt(ci.price * ci.qty)}</span>
                        <button onClick={() => removeFromCart(ci.id)} className="text-red-300 hover:text-red-500 transition-colors text-xs shrink-0 ml-1">✕</button>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center py-3 border-t border-gray-100 mb-3">
                    <span className="font-black uppercase text-[#0F172A] text-sm tracking-wide">Total</span>
                    <span className={`font-black text-2xl tabular-nums ${isDoacao ? 'line-through text-gray-300' : 'text-[#ed6c15]'}`}>
                      {fmt(total)}
                    </span>
                  </div>

                  {/* Vale Lanche toggle */}
                  <button
                    onClick={() => setIsDoacao(v => !v)}
                    className={`w-full py-2.5 mb-3 font-black uppercase text-xs tracking-widest rounded-xl border-2 transition-colors ${
                      isDoacao
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-white border-gray-200 text-gray-400 hover:border-green-400 hover:text-green-500'
                    }`}
                  >
                    🏐 Vale Lanche (Atleta)
                  </button>

                  <button
                    onClick={abrirModal}
                    className={`w-full py-3.5 text-white font-black uppercase tracking-widest text-sm rounded-xl transition-colors ${
                      isDoacao ? 'bg-green-500 hover:bg-green-600' : 'bg-[#ed6c15] hover:bg-[#0F172A]'
                    }`}
                  >
                    {isDoacao ? 'Entregar →' : 'Prosseguir →'}
                  </button>

                  <button
                    onClick={() => setCart({})}
                    className="w-full py-2 text-gray-400 text-xs uppercase tracking-widest mt-2 hover:text-gray-600 transition-colors font-mono"
                  >
                    Limpar pedido
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
          onClick={() => !confirming && !confirmed && setShowModal(false)}
        >
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>

            {/* Success screen */}
            {confirmed ? (
              <div className="text-center py-8">
                <div className="text-[64px] mb-4">✅</div>
                <h3 className="font-black text-[#0F172A] text-2xl uppercase tracking-tight">
                  {isDoacao ? 'Entrega registrada!' : 'Venda registrada!'}
                </h3>
                <p className="text-gray-500 text-sm mt-2">Planilha atualizada com sucesso.</p>
              </div>

            /* Vale Lanche screen */
            ) : isDoacao ? (
              <>
                <div className="text-center mb-5">
                  <span className="inline-flex items-center gap-2 bg-green-500 text-white px-3 py-1 text-[10px] font-black rounded uppercase tracking-widest">
                    🏐 Vale Lanche · Atleta
                  </span>
                  <div className="line-through text-gray-300 text-3xl font-black mt-4 tabular-nums">{fmt(total)}</div>
                  <div className="text-green-500 font-black text-sm mt-1 uppercase tracking-widest">Gratuito</div>
                </div>
                <div className="flex flex-col gap-1 mb-5">
                  {cartItems.map(ci => (
                    <div key={ci.id} className="flex justify-between text-sm py-1.5 border-b border-gray-50">
                      <span className="text-[#0F172A]">{ci.name} x{ci.qty}</span>
                      <span className="text-gray-300 line-through tabular-nums">{fmt(ci.price * ci.qty)}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={confirmar}
                  disabled={confirming}
                  className="w-full py-4 bg-green-500 text-white font-black uppercase tracking-widest text-sm rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {confirming ? 'Registrando…' : '✓ Confirmar entrega'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-2 text-gray-400 text-xs uppercase tracking-widest mt-2 font-mono"
                >
                  Cancelar
                </button>
              </>

            /* Payment screen */
            ) : (
              <>
                <div className="text-center mb-4">
                  <div className="text-4xl font-black text-[#0F172A] tabular-nums">{fmt(total)}</div>
                </div>

                {/* Payment method tabs */}
                <div className="flex gap-1 mb-5 p-1 bg-gray-100 rounded-xl">
                  {(['pix', 'dinheiro'] as PayMethod[]).map(m => (
                    <button
                      key={m}
                      onClick={() => setPayMethod(m)}
                      className={`flex-1 py-2 rounded-lg font-black uppercase text-xs tracking-widest transition-all ${
                        payMethod === m
                          ? 'bg-white text-[#0F172A] shadow-sm'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {m === 'pix' ? 'PIX' : 'Dinheiro'}
                    </button>
                  ))}
                </div>

                {payMethod === 'pix' ? (
                  <>
                    <div className="text-center mb-3">
                      <span className="inline-flex items-center gap-2 bg-[#ed6c15] text-white px-3 py-1 text-[10px] font-black rounded uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Aguardando pagamento
                      </span>
                    </div>
                    <div className="flex justify-center mb-4">
                      <img src={qrUrl} alt="QR Code PIX" className="w-[220px] h-[220px] rounded-xl border border-gray-100" />
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 mb-5 cursor-pointer" onClick={() => navigator.clipboard?.writeText(pixStr)}>
                      <p className="text-[10px] font-mono uppercase text-gray-400 mb-1">Pix copia e cola · toque para copiar</p>
                      <p className="text-[10px] font-mono text-gray-600 break-all select-all line-clamp-2">{pixStr}</p>
                    </div>
                    <button
                      onClick={confirmar}
                      disabled={confirming}
                      className="w-full py-4 bg-[#ed6c15] text-white font-black uppercase tracking-widest text-sm rounded-xl hover:bg-[#0F172A] transition-colors disabled:opacity-50"
                    >
                      {confirming ? 'Registrando…' : '✓ Confirmar pagamento recebido'}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-2">Valor recebido</label>
                      <div className="flex items-center gap-2 border-2 border-gray-200 rounded-xl px-4 py-3 focus-within:border-[#0F172A] transition-colors">
                        <span className="text-gray-400 font-black text-sm shrink-0">R$</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={valorRecebido}
                          onChange={e => setValorRecebido(e.target.value)}
                          placeholder="0,00"
                          autoFocus
                          className="flex-1 outline-none text-[#0F172A] font-black text-2xl tabular-nums bg-transparent placeholder:text-gray-200"
                        />
                      </div>
                    </div>
                    {recebido > 0 && (
                      <div className={`rounded-xl px-4 py-3 mb-4 flex justify-between items-center border ${
                        troco >= 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
                      }`}>
                        <span className={`font-black text-sm uppercase tracking-wide ${troco >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                          {troco >= 0 ? 'Troco' : 'Falta'}
                        </span>
                        <span className={`font-black text-2xl tabular-nums ${troco >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                          {fmt(Math.abs(troco))}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={confirmar}
                      disabled={confirming || recebido < total}
                      className="w-full py-4 bg-[#ed6c15] text-white font-black uppercase tracking-widest text-sm rounded-xl hover:bg-[#0F172A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {confirming ? 'Registrando…' : '✓ Confirmar pagamento recebido'}
                    </button>
                  </>
                )}

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-2 text-gray-400 text-xs uppercase tracking-widest mt-2 font-mono"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
