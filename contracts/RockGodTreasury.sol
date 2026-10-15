// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RockGodTreasury
 * @notice Contrato Inteligente de Tesorería y Dispersión de Regalías en USDC/USDT para Rock God Tycoon.
 * @dev Permite a la tesorería del juego financiar un pool de liquidez y autorizar al backend (Dispenser)
 * a transferir tokens ERC-20 reales (USDC / USDT) directamente a las billeteras de los jugadores.
 */

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

contract RockGodTreasury {
    address public owner;
    address public authorizedDispenser;
    bool public isPaused;

    // Límite máximo de retiro por transacción para protección de tesorería (ej. 10,000 USDC con 6 decimales)
    uint256 public maxSinglePayout = 10000 * 10**6;

    // Registro de pagos para evitar dobles liquidaciones de vouchers del juego
    mapping(string => bool) public processedGameVouchers;

    event PayoutExecuted(
        string indexed voucherId,
        address indexed token,
        address indexed recipient,
        uint256 amount,
        uint256 timestamp
    );
    event DispenserUpdated(address indexed newDispenser);
    event FundsDeposited(address indexed token, address indexed sender, uint256 amount);
    event EmergencyWithdraw(address indexed token, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el propietario puede ejecutar esta accion");
        _;
    }

    modifier onlyDispenser() {
        require(
            msg.sender == authorizedDispenser || msg.sender == owner,
            "Emisor no autorizado como Dispenser de Tesoreria"
        );
        _;
    }

    modifier whenNotPaused() {
        require(!isPaused, "La tesoreria se encuentra en pausa temporal");
        _;
    }

    constructor(address _authorizedDispenser) {
        owner = msg.sender;
        authorizedDispenser = _authorizedDispenser;
    }

    /**
     * @notice Ejecuta el desembolso de USDC/USDT on-chain hacia la billetera del jugador.
     * @param token Dirección del contrato ERC-20 (ej. USDC en Polygon: 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359)
     * @param recipient Dirección EVM del jugador
     * @param amount Monto en unidades mínimas (6 decimales para USDC/USDT)
     * @param voucherId Identificador criptográfico único emitido por el juego
     */
    function executePayout(
        address token,
        address recipient,
        uint256 amount,
        string calldata voucherId
    ) external onlyDispenser whenNotPaused {
        require(recipient != address(0), "Direccion de destino invalida");
        require(amount > 0 && amount <= maxSinglePayout, "Monto excede limite de seguridad");
        require(!processedGameVouchers[voucherId], "Este comprobante ya ha sido liquidado");

        IERC20 erc20 = IERC20(token);
        require(erc20.balanceOf(address(this)) >= amount, "Fondos insuficientes en la tesoreria");

        processedGameVouchers[voucherId] = true;
        bool success = erc20.transfer(recipient, amount);
        require(success, "Fallo la transferencia ERC-20 de USDC");

        emit PayoutExecuted(voucherId, token, recipient, amount, block.timestamp);
    }

    function setAuthorizedDispenser(address _newDispenser) external onlyOwner {
        authorizedDispenser = _newDispenser;
        emit DispenserUpdated(_newDispenser);
    }

    function setMaxPayout(uint256 _max) external onlyOwner {
        maxSinglePayout = _max;
    }

    function togglePause(bool _paused) external onlyOwner {
        isPaused = _paused;
    }

    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner, amount);
        emit EmergencyWithdraw(token, amount);
    }
}
