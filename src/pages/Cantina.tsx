import { useState } from 'react';

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
    emoji: '🥤',
    items: [
      { id: 'agua',   name: 'Água',               price: 5.00, icon: '💧' },
      { id: 'refri',  name: 'Refrigerante',        price: 5.00, icon: '🥤' },
      { id: 'suco',   name: 'Suco / Água de coco', price: 5.00, icon: '🍹' },
      { id: 'isoton', name: 'Isotônico',           price: 9.00, icon: '⚡' },
      { id: 'cafe',   name: 'Café',                price: 2.00, icon: '☕' },
    ],
  },
  {
    category: 'Salgados',
    emoji: '🥐',
    items: [
      { id: 'salgado_assado', name: 'Salgado assado',         price: 10.00, icon: '🥐' },
      { id: 'mini_salgado',   name: 'Mini salgado (10 unid)', price: 10.00, icon: '🧆' },
      { id: 'pipoca_grande',  name: 'Pipoca grande',          price:  8.00, icon: '🍿' },
      { id: 'pipoca_pequena', name: 'Pipoca pequena',         price:  4.50, icon: '🍿' },
      { id: 'salgadinho',     name: 'Salgadinho',             price:  4.00, icon: '🥨' },
    ],
  },
  {
    category: 'Doces',
    emoji: '🍫',
    items: [
      { id: 'pacoquinha', name: 'Paçoquinha',        price: 2.00, icon: '🍬' },
      { id: 'chocolate',  name: 'Chocolate',          price: 5.00, icon: '🍫' },
      { id: 'bolinho',    name: 'Bolinho / Barrinha', price: 4.00, icon: '🧁' },
      { id: 'pipoquinha', name: 'Pipoquinha',          price: 2.00, icon: '🍿' },
    ],
  },
];

type CartItem = { id: string; name: string; price: number; qty: number };

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function ItemCard({ item, onAdd }: {
  item: { id: string; name: string; price: number; icon: string };
  onAdd: (item: { id: string; name: string; price: number }, qty: number) => void;
}) {
  const [qty, setQty] = useState(1);
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-3 hover:border-[#ed6c15] transition-colors shadow-sm">
      {/* Icon */}
      <div className="text-4xl text-center">{item.icon}</div>
      {/* Name + price */}
      <div className="text-center">
        <div className="font-bold text-[#0F172A] text-sm leading-tight">{item.name}</div>
        <div className="font-black text-[#ed6c15] text-xl mt-1">{fmt(item.price)}</div>
      </div>
      {/* Quantity */}
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
      {/* Add button */}
      <button
        onClick={() => { onAdd(item, qty); setQty(1); }}
        className="w-full py-2.5 bg-[#ed6c15] text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-[#0F172A] transition-colors"
      >
        Adicionar
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
  const [showPix, setShowPix] = useState(false);
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
    setCart(prev => {
      const next = { ...prev };
      if (next[item.id]) next[item.id] = { ...next[item.id], qty: next[item.id].qty + qty };
      else next[item.id] = { ...item, qty };
      return next;
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const cartItems = Object.values(cart);
  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  const pixStr = showPix && total > 0 ? gerarPix(total) : '';
  const qrUrl = pixStr ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pixStr)}` : '';

  const confirmar = async () => {
    setConfirming(true);
    try {
      const now = new Date();
      const data = now.toLocaleDateString('pt-BR');
      const hora = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const itens = cartItems.map(i => `${i.name} x${i.qty}`).join(', ');
      await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, hora, itens, total_arrecadado: total, evento: `Cantina ${data}` }),
      });
      setConfirmed(true);
      setCart({});
      setTimeout(() => { setShowPix(false); setConfirmed(false); }, 3000);
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
        <div className="flex items-center gap-4">
          {total > 0 && (
            <span className="bg-[#ed6c15] text-white font-black text-sm px-4 py-1.5 rounded-full tabular-nums">
              {fmt(total)}
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
                <span className="text-2xl">{sec.emoji}</span>
                <h2 className="font-black text-[#0F172A] text-2xl uppercase tracking-tighter">{sec.category}</h2>
                <div className="flex-1 h-px bg-gray-200 ml-1" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {sec.items.map(item => (
                  <ItemCard key={item.id} item={item} onAdd={addToCart} />
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
                  <div className="flex justify-between items-center py-3 border-t border-gray-100 mb-4">
                    <span className="font-black uppercase text-[#0F172A] text-sm tracking-wide">Total</span>
                    <span className="font-black text-[#ed6c15] text-2xl tabular-nums">{fmt(total)}</span>
                  </div>
                  <button
                    onClick={() => setShowPix(true)}
                    className="w-full py-3.5 bg-[#ed6c15] text-white font-black uppercase tracking-widest text-sm rounded-xl hover:bg-[#0F172A] transition-colors"
                  >
                    Gerar PIX →
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

      {/* PIX Modal */}
      {showPix && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
          onClick={() => !confirming && !confirmed && setShowPix(false)}
        >
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            {confirmed ? (
              <div className="text-center py-8">
                <div className="text-[64px] mb-4">✅</div>
                <h3 className="font-black text-[#0F172A] text-2xl uppercase tracking-tight">Venda registrada!</h3>
                <p className="text-gray-500 text-sm mt-2">Planilha atualizada com sucesso.</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-5">
                  <span className="inline-flex items-center gap-2 bg-[#ed6c15] text-white px-3 py-1 text-[10px] font-black rounded uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Aguardando pagamento
                  </span>
                  <div className="text-4xl font-black text-[#0F172A] mt-4 tabular-nums">{fmt(total)}</div>
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
                <button
                  onClick={() => setShowPix(false)}
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
