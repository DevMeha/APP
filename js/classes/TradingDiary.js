import { StorageManager } from "../utils/storage.js";

export class TradingDiary {
  constructor() {
    this.storage = new StorageManager();
    this.trades = [];
    this.alerts = [];
    this.balanceHistory = [];
    this.currentBalance = 10000; // Starting balance
    this.notificationTimeout = null;

    this.loadData();
    this.initializeAlerts();
  }

  loadData() {
    this.trades = this.storage.get("trades") || [];
    this.alerts = this.storage.get("alerts") || [];
    this.balanceHistory = this.storage.get("balanceHistory") || [];
    this.currentBalance =
      parseFloat(this.storage.get("currentBalance")) || 10000;
  }

  saveData() {
    this.storage.set("trades", this.trades);
    this.storage.set("alerts", this.alerts);
    this.storage.set("balanceHistory", this.balanceHistory);
    this.storage.set("currentBalance", this.currentBalance);
  }

  initializeAlerts() {
    // Dodaj brakujące pola do istniejących alertów
    this.alerts.forEach((alert) => {
      if (alert.triggered === undefined) {
        alert.triggered = false;
      }
      if (alert.lastTriggered === undefined) {
        alert.lastTriggered = null;
      }
    });
    this.saveData();
  }

  // Balance management
  updateBalance(newBalance, reason = "") {
    const oldBalance = this.currentBalance;
    this.currentBalance = parseFloat(newBalance);

    // Add to balance history
    this.balanceHistory.push({
      date: new Date().toISOString(),
      balance: this.currentBalance,
      change: this.currentBalance - oldBalance,
      reason: reason,
    });

    this.saveData();
    return this.currentBalance;
  }

  getBalance() {
    return this.currentBalance;
  }

  // Trade management
  addTrade(trade) {
    trade.id = Date.now().toString();
    trade.date = trade.date || new Date().toISOString();
    this.trades.push(trade);
    this.saveData();
    return trade;
  }

  deleteTrade(tradeId) {
    this.trades = this.trades.filter((trade) => trade.id !== tradeId);
    this.saveData();
  }

  getTrades() {
    return this.trades;
  }

  // Alert management
  addAlert(alert) {
    alert.id = Date.now().toString();
    alert.triggered = false;
    alert.lastTriggered = null;
    this.alerts.push(alert);
    this.saveData();
    return alert;
  }

  deleteAlert(alertId) {
    this.alerts = this.alerts.filter((alert) => alert.id !== alertId);
    this.saveData();
  }

  getAlerts() {
    return this.alerts;
  }

  // Statistics
  getTotalProfit() {
    return this.trades.reduce(
      (total, trade) => total + parseFloat(trade.profit || 0),
      0
    );
  }

  getTradesCount() {
    return this.trades.length;
  }

  getWinRate() {
    if (this.trades.length === 0) return 0;
    const winningTrades = this.trades.filter(
      (trade) => parseFloat(trade.profit) > 0
    );
    return Math.round((winningTrades.length / this.trades.length) * 100);
  }

  // Data export/import
  exportData() {
    return {
      trades: this.trades,
      alerts: this.alerts,
      balanceHistory: this.balanceHistory,
      currentBalance: this.currentBalance,
    };
  }

  importData(data) {
    if (data.trades) this.trades = data.trades;
    if (data.alerts) this.alerts = data.alerts;
    if (data.balanceHistory) this.balanceHistory = data.balanceHistory;
    if (data.currentBalance) this.currentBalance = data.currentBalance;
    this.saveData();
  }
}
