// Helper functions for the trading diary application

export function formatCurrency(amount, currency = "NOK") {
  return `${parseFloat(amount).toFixed(2)} ${currency}`;
}

export function formatPercentage(value) {
  return `${parseFloat(value).toFixed(1)}%`;
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatShortDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("pl-PL");
}

export function getSizeTypeName(sizeType) {
  const sizeTypes = {
    lot: "Lot",
    mini: "Mini Lot",
    micro: "Micro Lot",
    nano: "Nano Lot",
    size: "Size",
  };
  return sizeTypes[sizeType] || sizeType;
}

export function getAlertTypeName(type) {
  const typeNames = {
    balance: "Saldo",
    profit: "Profit",
    loss: "Strata",
  };
  return typeNames[type] || type;
}

export function calculateWinRate(trades) {
  if (trades.length === 0) return 0;
  const winningTrades = trades.filter((trade) => parseFloat(trade.profit) > 0);
  return Math.round((winningTrades.length / trades.length) * 100);
}

export function calculateTotalProfit(trades) {
  return trades.reduce(
    (total, trade) => total + parseFloat(trade.profit || 0),
    0
  );
}

export function calculateAverageProfit(trades) {
  if (trades.length === 0) return 0;
  return calculateTotalProfit(trades) / trades.length;
}

export function calculateMaxDrawdown(balanceHistory) {
  if (balanceHistory.length === 0) return 0;

  let maxBalance = balanceHistory[0].balance;
  let maxDrawdown = 0;

  balanceHistory.forEach((entry) => {
    if (entry.balance > maxBalance) {
      maxBalance = entry.balance;
    }

    const drawdown = ((maxBalance - entry.balance) / maxBalance) * 100;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });

  return maxDrawdown;
}

export function validateNumber(value, min = null, max = null) {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  if (min !== null && num < min) return false;
  if (max !== null && num > max) return false;
  return true;
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}
