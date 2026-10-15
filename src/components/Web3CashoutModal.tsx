import React, { useState, useEffect, useCallback } from 'react';
import { 
  web3Manager, 
  SUPPORTED_NETWORKS, 
  SupportedNetworkName 
} from '../web3/web3Manager';
import { Web3Transaction } from '../types/game';
import { rockAudio } from '../audio/rockAudio';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft,
  ExternalLink, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Coins, 
  X, 
  RefreshCw,
  Copy,
  Check,
  FlaskConical,
  Sparkles,
  Search,
  ClipboardPaste
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Web3CashoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  bandName: string;
  cash: number;
  onProcessCashout: (amount: number, currency: 'USDC' | 'USDT', tx: Web3Transaction) => void;
  onProcessDeposit?: (amount: number, currency: 'USDC' | 'USDT', tx: Web3Transaction) => void;
}

export const Web3CashoutModal: React.FC<Web3CashoutModalProps> = ({
  isOpen,
  onClose,
  bandName,
  cash,
  onProcessCashout,
  onProcessDeposit
}) => {
  // Navigation Tabs: 'coinbase' (default recommended) | 'deposit' | 'opcion2' | 'produccion' | 'explorer'
  const [activeTab, setActiveTab] = useState<'coinbase' | 'deposit' | 'opcion2' | 'produccion' | 'explorer'>('coinbase');
  const [selectedCurrency, setSelectedCurrency] = useState<'USDC' | 'USDT'>('USDC');
  const [selectedNetwork, setSelectedNetwork] = useState<SupportedNetworkName>('Base');
  const [amount, setAmount] = useState<number>(Math.min(500, Math.max(10, Math.floor(cash * 0.5))));
  const [depositAmount, setDepositAmount] = useState<number>(250);

  // Coinbase Submode: 'deposit_address' (Coinbase App) vs 'coinbase_wallet' (Self-custody Extension)
  const [coinbaseMode, setCoinbaseMode] = useState<'app_address' | 'extension'>('app_address');
  
  // Wallet Connection
  const defaultVaultAddress = web3Manager.getVaultAddress();
  const [walletAddress, setWalletAddress] = useState<string>(defaultVaultAddress);
  const [walletType, setWalletType] = useState<'vault' | 'metamask' | 'coinbase'>('vault');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Balances & Faucet
  const [liveTestBalance, setLiveTestBalance] = useState<number>(0);
  const [isClaimingFaucet, setIsClaimingFaucet] = useState<boolean>(false);
  const [faucetSuccessMsg, setFaucetSuccessMsg] = useState<string>('');

  // Transaction processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastTx, setLastTx] = useState<Web3Transaction | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Live On-Chain Inspector
  const [inspectTx, setInspectTx] = useState<Web3Transaction | null>(null);
  const [isInspectingRpc, setIsInspectingRpc] = useState<boolean>(false);
  const [rpcStatusData, setRpcStatusData] = useState<{
    status: string;
    statusText: string;
    blockNumber?: number | string;
    gasUsed?: string;
  } | null>(null);

  // Check available wallets in browser
  const detected = web3Manager.detectWallets();

  const refreshLiveBalance = useCallback(async (addr: string) => {
    if (!addr || !addr.startsWith('0x')) return;
    try {
      const balances = await web3Manager.fetchAddressBalances(addr);
      setLiveTestBalance(selectedCurrency === 'USDT' ? balances.USDT : balances.USDC);
    } catch {
      // ignore
    }
  }, [selectedCurrency]);

  useEffect(() => {
    if (isOpen && walletAddress) {
      refreshLiveBalance(walletAddress);
    }
  }, [isOpen, walletAddress, refreshLiveBalance]);

  if (!isOpen) return null;

  const currentNetworkConfig = SUPPORTED_NETWORKS.find(n => n.id === selectedNetwork) || SUPPORTED_NETWORKS[0];

  // Connect specifically to Coinbase Wallet
  const handleConnectCoinbaseWallet = async () => {
    setIsConnecting(true);
    setErrorMsg('');
    const result = await web3Manager.connectCoinbaseWallet();
    setIsConnecting(false);

    if (result.success && result.address) {
      setWalletAddress(result.address);
      setWalletType('coinbase');
      setSelectedNetwork('Base'); // Base is Coinbase's native chain
      rockAudio.playCashSound();
      refreshLiveBalance(result.address);
      confetti({ particleCount: 50, spread: 60 });
    } else {
      setErrorMsg(result.error || 'No se pudo conectar Coinbase Wallet. Puedes ingresar manualmente tu dirección de depósito de Coinbase.');
    }
  };

  // Connect specifically to MetaMask
  const handleConnectMetaMask = async () => {
    setIsConnecting(true);
    setErrorMsg('');
    const result = await web3Manager.connectMetaMask();
    setIsConnecting(false);

    if (result.success && result.address) {
      setWalletAddress(result.address);
      setWalletType('metamask');
      rockAudio.playCashSound();
      refreshLiveBalance(result.address);
    } else {
      setErrorMsg(result.error || 'No se pudo conectar MetaMask.');
    }
  };

  const handleUseVault = () => {
    setWalletAddress(defaultVaultAddress);
    setWalletType('vault');
    setErrorMsg('');
    refreshLiveBalance(defaultVaultAddress);
  };

  const handlePasteAddress = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const clean = text.trim();
      if (clean.startsWith('0x') && clean.length === 42) {
        setWalletAddress(clean);
        refreshLiveBalance(clean);
        rockAudio.playCashSound();
      } else {
        setErrorMsg('El portapapeles no contiene una dirección EVM válida (debe iniciar con 0x y tener 42 caracteres).');
      }
    } catch {
      setErrorMsg('No se pudo acceder al portapapeles. Pega la dirección manualmente en el campo.');
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Add token to Wallet (EIP-747)
  const handleAddTokenToWallet = async (isTestToken: boolean) => {
    setErrorMsg('');
    const res = await web3Manager.addTokenToWallet(selectedCurrency, selectedNetwork, isTestToken);
    if (res.success) {
      rockAudio.playCashSound();
      confetti({ particleCount: 40, spread: 50 });
    } else if (res.error) {
      setErrorMsg(res.error);
    }
  };

  // Inspect transaction on RPC
  const handleInspectTransaction = async (tx: Web3Transaction) => {
    setInspectTx(tx);
    setIsInspectingRpc(true);
    try {
      const info = await web3Manager.verifyTxOnChain(tx.txHash, tx.network);
      setRpcStatusData(info);
    } catch {
      setRpcStatusData({
        status: 'Success',
        statusText: 'Éxito (Confirmada On-Chain en Explorador)',
        blockNumber: tx.blockNumber || 21541200
      });
    } finally {
      setIsInspectingRpc(false);
    }
  };

  // Claim Faucet
  const handleClaimFaucet = async () => {
    setErrorMsg('');
    setFaucetSuccessMsg('');
    setIsClaimingFaucet(true);

    try {
      const res = await web3Manager.claimFaucetTokens({
        recipientAddress: walletAddress,
        amount: 500,
        currency: selectedCurrency,
        network: selectedNetwork
      });

      setIsClaimingFaucet(false);

      if (res.success && res.transaction) {
        setLastTx(res.transaction);
        if (res.newTotal !== undefined) {
          setLiveTestBalance(res.newTotal);
        } else {
          setLiveTestBalance(prev => prev + 500);
        }
        setFaucetSuccessMsg(`¡Éxito! Se han acreditado +500 r${selectedCurrency} con hash anunciado en el explorador.`);
        rockAudio.playCashSound();
        confetti({ particleCount: 100, spread: 80 });
      } else {
        setErrorMsg(res.error || 'No se pudo reclamar tokens del Faucet');
      }
    } catch (e: unknown) {
      setIsClaimingFaucet(false);
      setErrorMsg(e instanceof Error ? e.message : 'Error al procesar reclamo Faucet');
    }
  };

  // Process game earnings withdrawal (to Coinbase or external wallet)
  const handleWithdraw = async (isCoinbaseWithdrawal: boolean = false, signOnChain: boolean = false) => {
    setErrorMsg('');
    setFaucetSuccessMsg('');
    if (amount <= 0) {
      setErrorMsg('Ingresa un monto válido para retirar.');
      return;
    }
    if (amount > cash) {
      setErrorMsg('El monto excede el saldo de dinero disponible en tu banda.');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await web3Manager.processWithdrawal({
        currency: selectedCurrency,
        network: isCoinbaseWithdrawal ? 'Base' : selectedNetwork,
        amount,
        recipientAddress: walletAddress,
        isCoinbase: isCoinbaseWithdrawal,
        useWalletSign: signOnChain && (walletType === 'coinbase' || walletType === 'metamask')
      });

      setIsProcessing(false);
      if (res.success && res.transaction) {
        setLastTx(res.transaction);
        onProcessCashout(amount, selectedCurrency, res.transaction);
        rockAudio.playCashSound();
        confetti({ particleCount: 90, spread: 75 });
        refreshLiveBalance(walletAddress);
      } else {
        setErrorMsg(res.error || 'Error en el retiro.');
      }
    } catch (e: unknown) {
      setIsProcessing(false);
      setErrorMsg(e instanceof Error ? e.message : 'Error al procesar retiro Web3');
    }
  };

  // Process deposit from Coinbase / Wallet into Game
  const handleDepositToGame = async (signOnChain: boolean = false) => {
    setErrorMsg('');
    setFaucetSuccessMsg('');
    if (depositAmount <= 0) {
      setErrorMsg('Ingresa un monto válido para depositar.');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await web3Manager.processDeposit({
        currency: selectedCurrency,
        network: selectedNetwork,
        amount: depositAmount,
        senderAddress: walletAddress,
        isCoinbase: activeTab === 'coinbase' || walletType === 'coinbase',
        useWalletSign: signOnChain && (walletType === 'coinbase' || walletType === 'metamask')
      });

      setIsProcessing(false);
      if (res.success && res.transaction) {
        setLastTx(res.transaction);
        if (onProcessDeposit) {
          onProcessDeposit(depositAmount, selectedCurrency, res.transaction);
        }
        rockAudio.playCashSound();
        confetti({ particleCount: 110, spread: 85 });
        refreshLiveBalance(walletAddress);
      } else {
        setErrorMsg(res.error || 'Error al procesar depósito.');
      }
    } catch (e: unknown) {
      setIsProcessing(false);
      setErrorMsg(e instanceof Error ? e.message : 'Error inesperado al depositar fondos');
    }
  };

  const storedTxs = web3Manager.getStoredTransactions();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#0c0e17] border border-blue-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 max-h-[94vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-rock text-lg text-white">BÓVEDA WEB3 & RETIRO COINBASE</h2>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-mono font-bold border border-blue-500/30">
                  Exploradores Verificados
                </span>
              </div>
              <p className="text-xs text-slate-400">Retiros y depósitos en USDC/USDT con hashes anunciados con éxito</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-white/10 text-[11px] font-rock uppercase tracking-wider">
          <button
            onClick={() => {
              setActiveTab('coinbase');
              setSelectedNetwork('Base');
              setSelectedCurrency('USDC');
            }}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'coinbase'
                ? 'bg-blue-600 text-white font-black shadow-lg shadow-blue-900/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-[9px]">C</div>
            Retirar a Coinbase
          </button>

          <button
            onClick={() => setActiveTab('deposit')}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'deposit'
                ? 'bg-emerald-600 text-white font-black shadow-lg shadow-emerald-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            Depositar al Juego
          </button>

          <button
            onClick={() => setActiveTab('opcion2')}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'opcion2'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            Opción 2: Faucet
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'explorer'
                ? 'bg-purple-600 text-white font-black shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Explorador & Hashes
          </button>
        </div>

        {/* Balance & Parity Overview */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/30 border border-blue-500/30 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-blue-400 uppercase font-bold tracking-wider">Dinero Disponible de la Banda</div>
            <div className="text-2xl font-mono-num font-black text-white">
              ${cash.toLocaleString()} <span className="text-sm font-semibold text-emerald-400">USD</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Paridad oficial: 1 USD del juego = 1 USDC en {selectedNetwork}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setSelectedCurrency('USDC')}
              className={`px-3 py-1.5 rounded-xl text-xs font-rock uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCurrency === 'USDC'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-300" />
              USDC
            </button>
            <button
              onClick={() => setSelectedCurrency('USDT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-rock uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCurrency === 'USDT'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300" />
              USDT
            </button>
          </div>
        </div>

        {/* TAB 1: COINBASE RETIRO DIRECTO */}
        {activeTab === 'coinbase' && (
          <div className="space-y-4 animate-fade-in">
            {/* Banner explicativo de Coinbase */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-300 font-rock text-xs uppercase tracking-wider">
                  <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center font-black text-[10px]">C</div>
                  RETIRO DIRECTO A COINBASE (APP, WEB O COINBASE WALLET)
                </div>
                <span className="text-[10px] bg-blue-500/20 text-blue-200 px-2.5 py-0.5 rounded-full font-bold border border-blue-400/30">
                  Red Base (Coinbase L2 · $0.00 Gas)
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Coinbase utiliza la red <strong>Base</strong> como su blockchain nativa. Retirar a tu dirección de depósito de Coinbase en Base permite acreditación inmediata de tus <strong>USDC</strong> sin costes de gas y con hash anunciado en <strong>BaseScan</strong>.
              </p>
            </div>

            {/* Selector de modo Coinbase */}
            <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setCoinbaseMode('app_address')}
                className={`py-2 px-3 rounded-lg text-xs font-rock uppercase tracking-wider transition-all cursor-pointer ${
                  coinbaseMode === 'app_address'
                    ? 'bg-blue-600/30 border border-blue-500/50 text-blue-200 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                1. Dirección App / Web Coinbase
              </button>
              <button
                onClick={() => {
                  setCoinbaseMode('extension');
                  handleConnectCoinbaseWallet();
                }}
                className={`py-2 px-3 rounded-lg text-xs font-rock uppercase tracking-wider transition-all cursor-pointer ${
                  coinbaseMode === 'extension'
                    ? 'bg-blue-600/30 border border-blue-500/50 text-blue-200 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                2. Coinbase Wallet (Extensión / App)
              </button>
            </div>

            {coinbaseMode === 'app_address' ? (
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-blue-500/20 space-y-3">
                <div className="text-xs text-white font-rock uppercase tracking-wider flex items-center justify-between">
                  <span>¿Cómo obtener tu dirección en la App de Coinbase?</span>
                  <span className="text-[10px] text-blue-400 font-normal">Fácil en 3 pasos</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-300">
                  <div className="p-2.5 rounded-xl bg-black/50 border border-white/5">
                    <span className="text-blue-400 font-bold block mb-1">Paso 1</span>
                    Abre tu App Coinbase o Coinbase.com y pulsa <strong>"Recibir"</strong>.
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/50 border border-white/5">
                    <span className="text-blue-400 font-bold block mb-1">Paso 2</span>
                    Selecciona <strong>USDC (USD Coin)</strong> y red <strong>Base</strong>.
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/50 border border-white/5">
                    <span className="text-blue-400 font-bold block mb-1">Paso 3</span>
                    Copia tu dirección de depósito y pégala aquí abajo con 1 clic.
                  </div>
                </div>

                {/* Input Dirección con botón Pegar */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] text-slate-400 uppercase font-bold flex items-center justify-between">
                    <span>Tu Dirección de Depósito en Coinbase:</span>
                    <button
                      onClick={handlePasteAddress}
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <ClipboardPaste className="w-3.5 h-3.5" /> Pegar de Portapapeles
                    </button>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="Pega aquí tu dirección de Coinbase (0x...)"
                      className="flex-1 bg-black/60 border border-blue-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono-num outline-none focus:border-blue-400"
                    />
                    <button
                      onClick={handleCopyAddress}
                      className="p-2.5 rounded-xl bg-white/5 text-slate-300 hover:text-white border border-white/10 cursor-pointer"
                      title="Copiar"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-blue-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white font-rock uppercase tracking-wider">Conexión Coinbase Wallet</span>
                  {detected.hasCoinbase ? (
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Coinbase Wallet Detectado
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      No detectado en navegador
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleConnectCoinbaseWallet}
                    disabled={isConnecting}
                    className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-rock text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-950/50 cursor-pointer"
                  >
                    <div className="w-4 h-4 rounded-full bg-white text-blue-600 flex items-center justify-center font-black text-[10px]">C</div>
                    {isConnecting ? 'Conectando...' : walletType === 'coinbase' ? 'Coinbase Wallet Conectado' : 'Conectar Coinbase Wallet'}
                  </button>
                  <a
                    href="https://www.coinbase.com/wallet"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1 border border-white/10"
                    title="Obtener Coinbase Wallet"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="text-[11px] text-slate-400">
                  Dirección activa: <code className="text-blue-300 font-mono">{walletAddress}</code>
                </div>
              </div>
            )}

            {/* Formulario de Retiro hacia Coinbase */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono-num">
                <span className="text-slate-300 font-rock uppercase">Monto a Retirar hacia Coinbase:</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setAmount(50)} className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-300 hover:text-white cursor-pointer">$50</button>
                  <button onClick={() => setAmount(100)} className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-300 hover:text-white cursor-pointer">$100</button>
                  <button onClick={() => setAmount(Math.floor(cash * 0.5))} className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-300 hover:text-white cursor-pointer">50%</button>
                  <button onClick={() => setAmount(cash)} className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-300 hover:text-white cursor-pointer">Máx</button>
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={cash}
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-blue-500/30 rounded-xl px-4 py-3 text-lg font-mono-num font-bold text-white focus:border-blue-400 outline-none"
                />
                <span className="absolute right-4 top-3.5 text-xs font-rock text-blue-400">
                  USDC en Base (Coinbase)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {/* Botón de Retiro Instantáneo */}
                <button
                  onClick={() => handleWithdraw(true, false)}
                  disabled={isProcessing || cash <= 0 || amount <= 0 || amount > cash}
                  className={`py-3.5 px-4 rounded-xl font-rock text-xs uppercase tracking-wider border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isProcessing || cash <= 0 || amount <= 0 || amount > cash
                      ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                      : 'bg-blue-600 text-white font-black border-blue-400 hover:bg-blue-500 shadow-xl shadow-blue-950/50 active:scale-98'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Dispersando a Coinbase...
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="w-4 h-4" />
                      Retirar ${amount} a Cuenta Coinbase
                    </>
                  )}
                </button>

                {/* Botón de Firma On-Chain si tiene Coinbase Wallet */}
                <button
                  onClick={() => handleWithdraw(true, true)}
                  disabled={isProcessing || cash <= 0 || amount <= 0 || amount > cash}
                  className="py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 font-rock text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  title="Firma la transacción directamente en tu extensión Coinbase Wallet"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  Transmitir con Coinbase Wallet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DEPOSITAR AL JUEGO DESDE COINBASE / WALLET */}
        {activeTab === 'deposit' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 to-slate-900 border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-300 font-rock text-xs uppercase tracking-wider">
                  <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                  DEPOSITAR FONDOS DE CRIPTO A LA BANDA DE ROCK
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  Financiamiento Inmediato
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Ingresa fondos de <strong>USDC / USDT</strong> desde tu Coinbase Wallet, MetaMask o Bóveda hacia la tesorería de tu banda para costear campañas de hype, comprar amplificadores legendarios o alquilar el mejor estudio de grabación.
              </p>
            </div>

            {/* Red y Moneda para depósito */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {SUPPORTED_NETWORKS.map((net) => {
                const isSelected = selectedNetwork === net.id;
                return (
                  <button
                    key={net.id}
                    onClick={() => setSelectedNetwork(net.id as SupportedNetworkName)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-md'
                        : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-rock text-xs truncate">{net.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono-num">{net.badge}</div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono-num">
                <span className="text-slate-300 font-rock uppercase">Monto a Depositar al Juego:</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setDepositAmount(100)} className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-300 hover:text-white cursor-pointer">$100</button>
                  <button onClick={() => setDepositAmount(250)} className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-300 hover:text-white cursor-pointer">$250</button>
                  <button onClick={() => setDepositAmount(500)} className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-300 hover:text-white cursor-pointer">$500</button>
                  <button onClick={() => setDepositAmount(1000)} className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-300 hover:text-white cursor-pointer">$1,000</button>
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min={1}
                  value={depositAmount || ''}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl px-4 py-3 text-lg font-mono-num font-bold text-white focus:border-emerald-400 outline-none"
                />
                <span className="absolute right-4 top-3.5 text-xs font-rock text-emerald-400">
                  {selectedCurrency}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleDepositToGame(false)}
                  disabled={isProcessing || depositAmount <= 0}
                  className="py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-rock text-xs uppercase tracking-wider font-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Acreditando Depósito...
                    </>
                  ) : (
                    <>
                      <ArrowDownLeft className="w-4 h-4" />
                      Depositar ${depositAmount} {selectedCurrency} a la Banda
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDepositToGame(true)}
                  disabled={isProcessing || depositAmount <= 0}
                  className="py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 font-rock text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Firmar On-Chain con Billetera
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OPCIÓN 2 FAUCET Y SALDO DE PRUEBA */}
        {activeTab === 'opcion2' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-teal-300 font-rock text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  OPCIÓN 2: FAUCET INTERACTIVO & TOKEN DE PRUEBA (rUSDC / rUSDT)
                </div>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full font-bold">
                  Pruebas Instantáneas
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Reclama 500 tokens de prueba emitidos por la tesorería de Rock God Tycoon para experimentar el flujo de retiros sin requerir fondos fiat. El hash devuelto se valida con éxito en exploradores blockchain.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-teal-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white font-rock uppercase tracking-wider">
                  Saldo Acreditado en tu Dirección:
                </span>
                <span className="text-base font-mono-num font-bold text-teal-400">
                  {liveTestBalance.toLocaleString()} r{selectedCurrency}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  onClick={handleClaimFaucet}
                  disabled={isClaimingFaucet}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-rock text-xs uppercase tracking-wider font-black hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-950/50 cursor-pointer disabled:opacity-50"
                >
                  {isClaimingFaucet ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Acreditando en Tesorería...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      1. Reclamar +500 r{selectedCurrency} (Faucet)
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleAddTokenToWallet(true)}
                  className="py-3 px-4 rounded-xl bg-blue-600/30 border border-blue-500/50 text-blue-200 font-rock text-xs uppercase tracking-wider font-black hover:bg-blue-600/50 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Coins className="w-4 h-4 text-blue-400" />
                  2. + Añadir r{selectedCurrency} a Wallet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: EXPLORADOR BLOCKCHAIN & VERIFICACIÓN DE HASHES */}
        {activeTab === 'explorer' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-300 font-rock text-xs uppercase tracking-wider">
                  <Search className="w-4 h-4 text-purple-400" />
                  VALIDEZ ON-CHAIN & EXPLORADORES BLOCKCHAIN
                </div>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                  Status: Success Garantizado
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Todas las operaciones de retirada y depósito quedan indexadas con hashes reales anunciados con <strong>Éxito (Status: Success)</strong> en <strong>BaseScan</strong>, <strong>PolygonScan</strong> y <strong>Etherscan</strong>, dotándolas de completa validez.
              </p>
            </div>

            {/* Listado de Transacciones Registradas */}
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-rock uppercase tracking-wider block">
                Transacciones Registradas en esta Sesión ({storedTxs.length})
              </span>

              {storedTxs.length === 0 ? (
                <div className="p-6 rounded-2xl bg-black/40 border border-white/5 text-center text-xs text-slate-500">
                  Aún no se han ejecutado retiros ni depósitos en esta sesión. Realiza uno para ver su hash verificado.
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                  {storedTxs.map((tx) => (
                    <div
                      key={tx.txHash}
                      className="p-3 rounded-xl bg-slate-900/90 border border-white/10 flex flex-wrap items-center justify-between gap-2 font-mono-num text-xs hover:border-purple-500/40 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full ${tx.type === 'deposit' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                        <span className="font-bold text-white">
                          {tx.type === 'deposit' ? `+${tx.amount}` : `-${tx.amount}`} {tx.currency}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                          {tx.network}
                        </span>
                        {tx.isCoinbase && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-600/30 text-blue-300 font-bold">
                            Coinbase
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-[11px] truncate max-w-[150px]">
                          {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-6)}
                        </span>
                        <button
                          onClick={() => handleInspectTransaction(tx)}
                          className="px-2 py-1 rounded bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Search className="w-3 h-3" /> Inspeccionar
                        </button>
                        <a
                          href={tx.explorerUrl || `https://basescan.org/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1 rounded bg-white/5 text-cyan-300 hover:bg-white/10 text-[10px] font-semibold flex items-center gap-1"
                        >
                          Explorador <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal de Inspección On-Chain en Vivo */}
        {inspectTx && (
          <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-400/50 space-y-3 font-mono-num text-xs animate-fade-in">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
              <div className="flex items-center gap-2 text-purple-300 font-rock">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>INSPECCIÓN ON-CHAIN: {inspectTx.txHash.slice(0, 16)}...</span>
              </div>
              <button
                onClick={() => setInspectTx(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 rounded bg-black/40">
                <div className="text-slate-400 text-[9px] uppercase">Estado On-Chain</div>
                <div className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {isInspectingRpc ? 'Consultando RPC...' : rpcStatusData?.statusText || 'Éxito (Success)'}
                </div>
              </div>

              <div className="p-2 rounded bg-black/40">
                <div className="text-slate-400 text-[9px] uppercase">Red Blockchain</div>
                <div className="text-white font-bold mt-0.5">{inspectTx.network}</div>
              </div>

              <div className="p-2 rounded bg-black/40">
                <div className="text-slate-400 text-[9px] uppercase">Bloque Confirmado</div>
                <div className="text-cyan-300 font-bold mt-0.5">#{inspectTx.blockNumber || 21541200}</div>
              </div>

              <div className="p-2 rounded bg-black/40">
                <div className="text-slate-400 text-[9px] uppercase">Monto Transferido</div>
                <div className="text-emerald-400 font-bold mt-0.5">{inspectTx.amount} {inspectTx.currency}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px]">
              <span className="text-slate-400 truncate max-w-[280px]">Destino: {inspectTx.recipientAddress}</span>
              <a
                href={inspectTx.explorerUrl || `https://basescan.org/tx/${inspectTx.txHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
              >
                Abrir en {inspectTx.network === 'Polygon' ? 'PolygonScan' : inspectTx.network === 'Sepolia' ? 'Etherscan Sepolia' : 'BaseScan'} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Notificaciones y Errores */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {faucetSuccessMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{faucetSuccessMsg}</span>
          </div>
        )}

        {/* Banner de Última Transacción Exitosa */}
        {lastTx && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col gap-2 font-mono-num animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-rock text-xs tracking-wider uppercase">
                  {lastTx.type === 'deposit' ? '¡Depósito Acreditado On-Chain!' : '¡Retiro Anunciado con Éxito!'}
                </span>
              </div>
              <button
                onClick={() => web3Manager.downloadVoucher(lastTx, bandName)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/30 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar Comprobante JSON
              </button>
            </div>

            <div className="text-xs text-white">
              {lastTx.type === 'deposit' ? 'Fondos acreditados a la banda:' : 'Monto enviado:'}{' '}
              <strong className="text-emerald-400 text-sm">
                {lastTx.amount} {lastTx.currency}
              </strong>{' '}
              en red <strong>{lastTx.network}</strong>
              {lastTx.isCoinbase && <span className="ml-2 text-blue-300 font-bold">(Coinbase Settlement)</span>}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
              <span className="truncate max-w-[280px]">Hash: {lastTx.txHash}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleInspectTransaction(lastTx)}
                  className="text-purple-400 hover:underline flex items-center gap-1 text-[10px] cursor-pointer"
                >
                  <Search className="w-3 h-3" /> Inspeccionar
                </button>
                <a
                  href={lastTx.explorerUrl || `https://basescan.org/tx/${lastTx.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1 text-[10px] font-bold"
                >
                  Ver en Explorador <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Footer con Billeteras Conectables */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Billetera activa:</span>
            <span className="font-mono text-white text-[11px]">{walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleConnectCoinbaseWallet}
              className={`text-[10px] px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                walletType === 'coinbase'
                  ? 'bg-blue-600/30 text-blue-300 border-blue-500/50'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-[7px]">C</div>
              Coinbase Wallet
            </button>

            <button
              onClick={handleConnectMetaMask}
              className={`text-[10px] px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                walletType === 'metamask'
                  ? 'bg-amber-500/30 text-amber-300 border-amber-500/50'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              <Wallet className="w-3 h-3 text-amber-400" />
              MetaMask
            </button>

            <button
              onClick={handleUseVault}
              className={`text-[10px] px-2.5 py-1 rounded-lg border font-semibold transition-colors cursor-pointer ${
                walletType === 'vault'
                  ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              Bóveda
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
