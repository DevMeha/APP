// Trading Diary Application
import { TranslationManager } from "./js/utils/translations.js";

// Aplikacja startuje od razu, TradingDiary i CalendarView są inicjalizowane bez sprawdzania użytkownika
window.addEventListener("DOMContentLoaded", function () {
  // Pokaż główny kontener aplikacji od razu
  const appContainer = document.getElementById("appContainer");
  if (appContainer) appContainer.style.display = "block";
  window.tradingDiary = new TradingDiary();
  window.calendarView = new CalendarView(window.tradingDiary);
});

class TradingDiary {
  constructor() {
    this.trades = JSON.parse(localStorage.getItem("trades")) || [];
    this.alerts = JSON.parse(localStorage.getItem("alerts")) || [];
    this.balanceHistory =
      JSON.parse(localStorage.getItem("balanceHistory")) || [];
    this.initialBalance =
      parseFloat(localStorage.getItem("initialBalance")) || 0;
    this.currentBalance =
      this.initialBalance +
      this.trades.reduce((sum, t) => sum + (parseFloat(t.profit) || 0), 0);
    this.notificationTimeout = null;
    this.currentUser = null;

    // Initialize translation manager
    this.translationManager = new TranslationManager();
    const savedLanguage = localStorage.getItem("language") || "en";
    this.translationManager.setLanguage(savedLanguage);

    // ZAWSZE chowaj powiadomienie na starcie
    const notification = document.getElementById("notification");
    if (notification) {
      notification.classList.remove("show");
    }

    // Dodaj brakujące pola do istniejących alertów
    this.alerts.forEach((alert) => {
      if (alert.triggered === undefined) {
        alert.triggered = false;
      }
      if (alert.lastTriggered === undefined) {
        alert.lastTriggered = null;
      }
    });
    localStorage.setItem("alerts", JSON.stringify(this.alerts));

    this.init();
  }

  loadUserData(userTrades, userBalance, userAlerts) {
    // Load user-specific data from API
    this.currentUser = window.loginManager.currentUser;
    this.loadTradesFromAPI();
    this.initialBalance = parseFloat(userBalance) || 0;
    this.currentBalance =
      this.initialBalance +
      this.trades.reduce((sum, t) => sum + (parseFloat(t.profit) || 0), 0);

    // Update UI with new data
    this.updateUI();
    this.updateBalanceHistory();
    this.updateChart();
  }

  init() {
    this.setupEventListeners();
    this.updateUI();

    // Dodaj punkt początkowy do historii jeśli jest pusta
    if (this.balanceHistory.length === 0) {
      this.updateBalanceHistory();
    }

    this.checkAlerts();
    this.setupChart();
    this.setupCalculator();

    // Set default date to current date/time
    document.getElementById("tradeDate").value = new Date()
      .toISOString()
      .slice(0, 16);

    // Add manual close for notification
    const closeBtn = document.getElementById("notificationCloseBtn");
    if (closeBtn) {
      closeBtn.onclick = () => this.hideNotification();
    }

    console.log("Trading Diary initialized successfully");

    this.setupImageModal();

    const exitTabBtn = document.getElementById("exitTabBtn");
    if (exitTabBtn) {
      exitTabBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.close();
      });
    }
  }

  setupEventListeners() {
    // Tab navigation
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tabBtn = e.target.closest(".tab-btn");
        if (!tabBtn) return;
        this.switchTab(tabBtn.dataset.tab);
      });
    });

    // Trade modal
    const addTradeBtn = document.getElementById("addTradeBtn");
    if (addTradeBtn)
      addTradeBtn.addEventListener("click", () => this.openTradeModal());
    const closeTradeModalBtn = document.getElementById("closeTradeModal");
    if (closeTradeModalBtn)
      closeTradeModalBtn.addEventListener("click", () =>
        this.closeTradeModal()
      );
    const cancelTradeBtn = document.getElementById("cancelTradeBtn");
    if (cancelTradeBtn)
      cancelTradeBtn.addEventListener("click", () => this.closeTradeModal());

    // Trade form submission
    const tradeForm = document.getElementById("tradeForm");
    if (tradeForm) {
      tradeForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.addTrade();
      });
    }

    // Balance edit
    const editBalanceBtn = document.getElementById("editBalanceBtn");
    if (editBalanceBtn)
      editBalanceBtn.addEventListener("click", () => this.openBalanceModal());
    const closeBalanceModalBtn = document.getElementById("closeBalanceModal");
    if (closeBalanceModalBtn)
      closeBalanceModalBtn.addEventListener("click", () =>
        this.closeBalanceModal()
      );
    const cancelBalanceBtn = document.getElementById("cancelBalanceBtn");
    if (cancelBalanceBtn)
      cancelBalanceBtn.addEventListener("click", () =>
        this.closeBalanceModal()
      );

    // Balance form submission
    const balanceForm = document.getElementById("balanceForm");
    if (balanceForm)
      balanceForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.updateBalance();
      });

    // Alert form
    const saveAlertBtn = document.getElementById("saveAlertBtn");
    if (saveAlertBtn)
      saveAlertBtn.addEventListener("click", () => this.addAlert());

    // Chart period change
    const chartPeriod = document.getElementById("chartPeriod");
    if (chartPeriod)
      chartPeriod.addEventListener("change", () => this.updateChart());

    // Calculator inputs
    this.setupCalculatorEventListeners();

    // Language settings
    const languageSelect = document.getElementById("languageSelect");
    if (languageSelect) {
      languageSelect.value = this.translationManager.getLanguage();
      languageSelect.addEventListener("change", () => {
        this.translationManager.setLanguage(languageSelect.value);
      });
    }

    const saveLanguageBtn = document.getElementById("saveLanguageBtn");
    if (saveLanguageBtn) {
      saveLanguageBtn.addEventListener("click", () => this.saveLanguage());
    }

    // Close modals when clicking outside
    const tradeModal = document.getElementById("tradeModal");
    if (tradeModal)
      tradeModal.addEventListener("click", (e) => {
        if (e.target.id === "tradeModal") this.closeTradeModal();
      });
    const balanceModal = document.getElementById("balanceModal");
    if (balanceModal)
      balanceModal.addEventListener("click", (e) => {
        if (e.target.id === "balanceModal") this.closeBalanceModal();
      });

    // Data Management
    const clearDataBtn = document.getElementById("clearDataBtn");
    if (clearDataBtn)
      clearDataBtn.addEventListener("click", () => this.clearAllData());
    const exportDataBtn = document.getElementById("exportDataBtn");
    if (exportDataBtn)
      exportDataBtn.addEventListener("click", () => this.exportData());
    const importDataBtn = document.getElementById("importDataBtn");
    if (importDataBtn)
      importDataBtn.addEventListener("click", () => {
        document.getElementById("importFileInput").click();
      });
    const importFileInput = document.getElementById("importFileInput");
    if (importFileInput)
      importFileInput.addEventListener("change", (e) => this.importData(e));

    // Logout functionality
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => this.logout());
    }

    // Currency settings
    const saveCurrencyBtn = document.getElementById("saveCurrencyBtn");
    if (saveCurrencyBtn) {
      saveCurrencyBtn.addEventListener("click", () => {
        const currencySelect = document.getElementById("currencySelect");
        if (currencySelect) {
          const currency = currencySelect.value;
          localStorage.setItem("currency", currency);
          this.updateUI();
          this.updateBalanceModalCurrency();
          if (this.chart) {
            this.updateChartCurrency();
            this.updateChart();
          }
          this.updateCalculator();
          if (window.calendarView) {
            window.calendarView.renderCalendar();
          }
          this.showNotification(
            this.translationManager.t("currency_saved"),
            "success"
          );
        }
      });
    }
  }

  setupCalculatorEventListeners() {
    // Risk calculator inputs
    document.getElementById("riskPercentage").addEventListener("input", () => {
      this.calculateRisk();
    });

    document
      .getElementById("stopLossPercentage")
      .addEventListener("input", () => {
        this.calculateRisk();
      });

    // Drawdown calculator inputs
    document
      .getElementById("consecutiveLosses")
      .addEventListener("input", () => {
        this.calculateDrawdown();
      });

    document.getElementById("lossPerTrade").addEventListener("input", () => {
      this.calculateDrawdown();
    });

    // Position sizing inputs
    document.getElementById("targetProfit").addEventListener("input", () => {
      this.calculatePositionSize();
    });

    document.getElementById("winRateInput").addEventListener("input", () => {
      this.calculatePositionSize();
    });
  }

  switchTab(tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      if (btn) btn.classList.remove("active");
    });
    document.querySelectorAll(".tab-content").forEach((content) => {
      if (content) content.classList.remove("active");
    });
    // Add active class to selected tab and content
    const tabBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (tabBtn) tabBtn.classList.add("active");
    const tabContent = document.getElementById(tabName);
    if (tabContent) tabContent.classList.add("active");
    // Natychmiast odśwież dynamiczne sekcje
    if (tabName === "trades") {
      this.updateUI();
    }
    if (tabName === "charts") {
      if (this.chart) this.updateChart();
    }
    if (tabName === "settings") {
      // Jeśli masz dynamiczne ustawienia, odśwież je tutaj
    }
  }

  openTradeModal() {
    document.getElementById("tradeModal").classList.add("active");
    document.getElementById("tradeForm").reset();
    document.getElementById("tradeDate").value = new Date()
      .toISOString()
      .slice(0, 16);
    document.getElementById("tradeSize").value = "";
    document.getElementById("tradeSymbol").value = "";
    console.log("Trade modal opened");
  }

  closeTradeModal() {
    document.getElementById("tradeModal").classList.remove("active");
    console.log("Trade modal closed");
  }

  openBalanceModal() {
    document.getElementById("balanceModal").classList.add("active");
    document.getElementById("newBalance").value =
      this.initialBalance.toFixed(2);
    document.getElementById("balanceReason").value = "";
  }

  closeBalanceModal() {
    document.getElementById("balanceModal").classList.remove("active");
  }

  async loadTradesFromAPI() {
    if (!this.currentUser) return;

    try {
      const res = await fetch(
        `http://localhost:3001/api/trades/${this.currentUser.id}`
      );
      if (!res.ok) {
        console.error("Błąd pobierania transakcji");
        this.trades = [];
        return;
      }
      this.trades = await res.json();
      // Odśwież UI i kalendarz po pobraniu danych
      this.updateUI();
      if (window.calendarView) window.calendarView.renderCalendar();
    } catch (err) {
      console.error("Błąd połączenia z serwerem:", err);
      this.trades = [];
    }
  }

  async saveUserData() {
    if (!this.currentUser) return;

    // Saldo jest aktualizowane przez updateBalance()
    // Transakcje są zapisywane przez addTrade()
  }

  async addTrade() {
    const symbol = document.getElementById("tradeSymbol").value;
    const profit = parseFloat(document.getElementById("tradeProfit").value);
    const date = document.getElementById("tradeDate").value;
    const notes = document.getElementById("tradeNotes").value;

    if (!symbol || isNaN(profit)) {
      this.showNotification("Wypełnij wszystkie wymagane pola", "error");
      return;
    }

    const trade = {
      symbol: symbol,
      profit: profit,
      date: date,
      notes: notes,
    };

    try {
      const res = await fetch("http://localhost:3001/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: this.currentUser.id,
          symbol: trade.symbol,
          profit: trade.profit,
          date: trade.date,
          notes: trade.notes,
        }),
      });

      if (!res.ok) {
        this.showNotification("Błąd zapisywania transakcji", "error");
        return;
      }

      // Pobierz zaktualizowane transakcje z serwera
      await this.loadTradesFromAPI();

      this.currentBalance += profit;
      this.updateUI();
      this.updateBalanceHistory();
      this.updateChart();
      this.closeTradeModal();
      this.showNotification("Transakcja dodana pomyślnie", "success");
    } catch (err) {
      this.showNotification("Błąd połączenia z serwerem", "error");
    }
  }

  async updateBalance() {
    const newBalance = parseFloat(document.getElementById("newBalance").value);
    const operationType = document.getElementById("balanceOperationType").value;

    if (isNaN(newBalance)) {
      this.showNotification("Wprowadź poprawną kwotę", "error");
      return;
    }

    let finalBalance = this.initialBalance;
    if (operationType === "deposit") {
      finalBalance += newBalance;
    } else if (operationType === "withdraw") {
      finalBalance -= newBalance;
    } else {
      finalBalance = newBalance;
    }

    try {
      const res = await fetch("http://localhost:3001/api/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: this.currentUser.id,
          balance: finalBalance,
        }),
      });

      if (!res.ok) {
        this.showNotification("Błąd aktualizacji salda", "error");
        return;
      }

      this.initialBalance = finalBalance;
      this.currentBalance =
        this.initialBalance +
        this.trades.reduce((sum, t) => sum + (parseFloat(t.profit) || 0), 0);

      this.updateUI();
      this.updateBalanceHistory();
      this.updateChart();
      this.closeBalanceModal();
      this.showNotification("Saldo zaktualizowane pomyślnie", "success");
    } catch (err) {
      this.showNotification("Błąd połączenia z serwerem", "error");
    }
  }

  checkSingleLossAlert(trade) {
    // Only for loss alerts
    const profit = parseFloat(trade.profit) || 0;
    this.alerts.forEach((alert) => {
      if (alert.type === "loss" && alert.condition === "below") {
        // alert.value is positive, profit is negative
        if (profit < 0 && profit <= -Math.abs(alert.value)) {
          this.showNotification(
            `${this.translationManager.t("entry_type_loss")}: ${profit.toFixed(
              2
            )} NOK ${this.translationManager.t(
              "alert_condition_below"
            )} ${-Math.abs(alert.value).toFixed(2)} NOK!`,
            "error"
          );
          this.playAlertSound();
        }
      }
    });
  }

  updateUI() {
    this.updateBalanceDisplay();
    this.updateTradesList();
    this.updateSummary();
    this.updateAlertsList();
  }

  updateBalanceDisplay() {
    // Synchronizuj currentBalance zawsze z initialBalance + suma profitów
    const prevBalance = this.currentBalance;
    this.currentBalance =
      this.initialBalance +
      this.trades.reduce((sum, t) => sum + (parseFloat(t.profit) || 0), 0);
    const el = document.getElementById("currentBalance");
    if (el) animateNumber(el, this.currentBalance);
    // Waluta
    const currency = (localStorage.getItem("currency") || "USD").toUpperCase();
    const currencyEl = document.getElementById("balanceCurrency");
    if (currencyEl) currencyEl.textContent = currency;
    // Procent zmiany względem depozytu
    const percent = this.initialBalance
      ? ((this.currentBalance - this.initialBalance) /
          Math.abs(this.initialBalance)) *
        100
      : 0;
    const percentEl = document.getElementById("balancePercent");
    if (percentEl) {
      percentEl.textContent =
        (percent >= 0 ? "+" : "") + percent.toFixed(2) + "%";
      percentEl.className =
        "balance-percent " +
        (percent > 0 ? "balance-up" : percent < 0 ? "balance-down" : "");
    }
  }

  updateTradesList() {
    const currency = (localStorage.getItem("currency") || "USD").toUpperCase();
    const tradesList = document.getElementById("tradesList");

    if (this.trades.length === 0) {
      tradesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chart-line"></i>
                <h3>${this.translationManager.t("no_trades")}</h3>
                <p>${this.translationManager.t("no_trades_desc")}</p>
            </div>
        `;
      return;
    }

    tradesList.innerHTML = this.trades
      .map((trade) => {
        // Ensure profit is a number
        const profit = parseFloat(trade.profit) || 0;
        const size = parseFloat(trade.size) || 0;

        return `
            <div class="trade-item" data-trade-id="${trade.id}">
                ${
                  trade.image
                    ? `<img src="${trade.image}" alt="Trade" class="trade-image">`
                    : ""
                }
                <div class="trade-info">
                    <div class="trade-header">
                        <span class="trade-symbol">${
                          trade.symbol || "N/A"
                        }</span>
                        <span class="trade-date">${this.formatDate(
                          trade.date
                        )}</span>
                    </div>
                    <div class="trade-details">
                        <span class="trade-type ${trade.type}">${
          trade.type === "buy"
            ? this.translationManager.t("trade_type_buy")
            : this.translationManager.t("trade_type_sell")
        }</span>
                        <span class="trade-amount">${size} ${this.getSizeTypeName(
          trade.sizeType
        )}</span>
                        <span class="trade-profit ${
                          profit >= 0 ? "positive" : "negative"
                        }">
                            ${profit >= 0 ? "+" : ""}${profit.toFixed(
          2
        )} ${currency}
                        </span>
                    </div>
                    ${
                      trade.notes
                        ? `<div class="trade-notes">${trade.notes}</div>`
                        : ""
                    }
                </div>
                <div class="trade-actions">
                    <button class="btn btn-danger" onclick="tradingDiary.deleteTrade(${
                      trade.id
                    })">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
      })
      .join("");
  }

  getSizeTypeName(sizeType) {
    const types = {
      lot: this.translationManager.t("size_lot"),
      mini: this.translationManager.t("size_mini"),
      micro: this.translationManager.t("size_micro"),
      nano: this.translationManager.t("size_nano"),
      size: this.translationManager.t("size_size"),
    };
    return types[sizeType] || sizeType;
  }

  deleteTrade(tradeId) {
    const tradeIndex = this.trades.findIndex((t) => t.id === tradeId);
    if (tradeIndex !== -1) {
      this.trades.splice(tradeIndex, 1);
      localStorage.setItem("trades", JSON.stringify(this.trades));
      this.recalculateBalanceHistory();
      this.updateUI();
      this.updateChart();
      this.checkAlerts();
      this.showNotification(
        this.translationManager.t("trade_deleted"),
        "success"
      );
    }
    // Jeśli nie ma już żadnych transakcji, wymuś synchronizację currentBalance
    if (this.trades.length === 0) {
      this.currentBalance = this.initialBalance;
      localStorage.setItem("currentBalance", this.currentBalance.toString());
      this.updateBalanceDisplay();
      this.updateChart();
    }
  }

  updateSummary() {
    const totalProfit = this.trades.reduce((sum, trade) => {
      const profit = parseFloat(trade.profit) || 0;
      return sum + profit;
    }, 0);
    const tradesCount = this.trades.length;
    const winningTrades = this.trades.filter((trade) => {
      const profit = parseFloat(trade.profit) || 0;
      return profit > 0;
    }).length;
    const winRate =
      tradesCount > 0 ? ((winningTrades / tradesCount) * 100).toFixed(1) : 0;
    const currency = (localStorage.getItem("currency") || "USD").toUpperCase();
    document.getElementById("totalProfit").textContent = `${totalProfit.toFixed(
      2
    )} ${currency}`;
    document.getElementById("tradesCount").textContent = tradesCount;
    document.getElementById("winRate").textContent = `${winRate}%`;
    // Update color based on profit
    const profitElement = document.getElementById("totalProfit");
    profitElement.className =
      totalProfit >= 0 ? "profit-amount" : "profit-amount negative";
  }

  updateBalanceHistory() {
    const now = new Date();
    const timestamp = now.toISOString();

    // Nie dodawaj duplikatów dla tej samej daty (ostatni wpis)
    if (
      this.balanceHistory.length > 0 &&
      this.balanceHistory[this.balanceHistory.length - 1].date === timestamp
    ) {
      // Zaktualizuj tylko saldo
      this.balanceHistory[this.balanceHistory.length - 1].balance =
        this.currentBalance;
    } else {
      // Dodaj nowy wpis
      this.balanceHistory.push({
        date: timestamp,
        balance: this.currentBalance,
        timestamp: now.getTime(),
      });
    }

    // Usuń stare wpisy (zachowaj ostatnie 1000 wpisów)
    if (this.balanceHistory.length > 1000) {
      this.balanceHistory = this.balanceHistory.slice(-1000);
    }

    localStorage.setItem("balanceHistory", JSON.stringify(this.balanceHistory));
  }

  setupChart() {
    const ctx = document.getElementById("balanceChart").getContext("2d");
    const currency = (localStorage.getItem("currency") || "USD").toUpperCase();
    this.chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: `${this.translationManager
              .t("balance_label")
              .replace(":", "")} (${currency})`,
            data: [],
            borderColor: "#667eea",
            backgroundColor: "rgba(102, 126, 234, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: "#667eea",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: "index",
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "#ffffff",
            bodyColor: "#ffffff",
            borderColor: "#667eea",
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: function (context) {
                return `${this.translationManager
                  .t("balance_label")
                  .replace(":", "")}: ${context.parsed.y.toFixed(
                  2
                )} ${currency}`;
              }.bind(this),
            },
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
            ticks: {
              callback: function (value) {
                return value.toFixed(0) + " " + currency;
              },
            },
          },
          x: {
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
            ticks: {
              maxRotation: 45,
              minRotation: 0,
            },
          },
        },
      },
    });
  }

  updateChart() {
    if (!this.chart || !this.chart.options) return;
    let filteredData = [...this.balanceHistory];
    const chartPeriod = document.getElementById("chartPeriod");
    const period = chartPeriod ? chartPeriod.value : "all";
    const now = new Date();
    if (period === "day") {
      // Ostatnie 24h, punkty co godzinę
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      filteredData = filteredData.filter((e) => new Date(e.date) >= dayAgo);
    } else if (period === "week") {
      // Ostatnie 7 dni, punkty co dzień
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredData = filteredData.filter((e) => new Date(e.date) >= weekAgo);
    } else if (period === "month") {
      // Ostatnie 30 dni, punkty co dzień
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredData = filteredData.filter((e) => new Date(e.date) >= monthAgo);
    } else if (period === "year") {
      // Ostatnie 12 miesięcy, punkty co miesiąc
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      filteredData = filteredData.filter((e) => new Date(e.date) >= yearAgo);
      // Grupuj po miesiącu
      const monthMap = {};
      filteredData.forEach((e) => {
        const d = new Date(e.date);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (!monthMap[key]) monthMap[key] = e;
        else
          monthMap[key] = d > new Date(monthMap[key].date) ? e : monthMap[key];
      });
      filteredData = Object.values(monthMap).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
    }
    if (filteredData.length < 2) {
      let value;
      if (this.balanceHistory.length > 0) {
        value = this.balanceHistory[0].balance;
      } else {
        value = this.initialBalance || this.currentBalance || 0;
      }
      filteredData = [
        {
          date: now.toISOString(),
          balance: value,
          timestamp: now.getTime(),
        },
        {
          date: now.toISOString(),
          balance: value,
          timestamp: now.getTime(),
        },
      ];
    }
    filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
    const currentLanguage = this.translationManager.getLanguage();
    const localeMap = {
      en: "en-US",
      pl: "pl-PL",
    };
    const locale = localeMap[currentLanguage] || "en-US";
    const step = Math.max(1, Math.floor(filteredData.length / 10));
    const labels = filteredData.map((entry, index) => {
      const date = new Date(entry.date);
      if (index % step === 0 || index === filteredData.length - 1) {
        if (period === "day") {
          return date.getHours() + ":00";
        } else if (period === "year") {
          return date.toLocaleDateString(locale, {
            month: "short",
            year: "numeric",
          });
        } else {
          return date.toLocaleDateString(locale, {
            month: "short",
            day: "numeric",
          });
        }
      }
      return "";
    });
    const data = filteredData.map((entry) => entry.balance);
    let minY = Math.min(...data);
    let maxY = Math.max(...data);
    if (minY === maxY) {
      minY = minY - 10;
      maxY = maxY + 10;
    }
    this.chart.options.scales.y.min = minY;
    this.chart.options.scales.y.max = maxY;
    this.chart.options.scales.y.beginAtZero = false;
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data;
    this.chart.update();
    this.updateStats(filteredData);
  }

  updateChartCurrency() {
    if (!this.chart) return;
    const currency = (localStorage.getItem("currency") || "USD").toUpperCase();

    // Update chart label
    this.chart.data.datasets[0].label = `${this.translationManager
      .t("balance_label")
      .replace(":", "")} (${currency})`;

    // Update tooltip callback
    this.chart.options.plugins.tooltip.callbacks.label = function (context) {
      return `${this.translationManager
        .t("balance_label")
        .replace(":", "")}: ${context.parsed.y.toFixed(2)} ${currency}`;
    }.bind(this);

    // Update Y-axis ticks
    this.chart.options.scales.y.ticks.callback = function (value) {
      return value.toFixed(0) + " " + currency;
    };

    this.chart.update();
  }

  updateStats(data) {
    if (data.length === 0) return;

    const balances = data.map((entry) => entry.balance);
    const avgBalance =
      balances.reduce((sum, balance) => sum + balance, 0) / balances.length;
    const maxBalance = Math.max(...balances);
    const initialBalance = data[0].balance;
    const finalBalance = data[data.length - 1].balance;
    const growth =
      initialBalance > 0
        ? ((finalBalance - initialBalance) / initialBalance) * 100
        : 0;

    const currency = (localStorage.getItem("currency") || "USD").toUpperCase();
    document.getElementById("avgBalance").textContent = `${avgBalance.toFixed(
      2
    )} ${currency}`;
    document.getElementById("maxBalance").textContent = `${maxBalance.toFixed(
      2
    )} ${currency}`;
    document.getElementById("capitalGrowth").textContent = `${growth.toFixed(
      2
    )}%`;
  }

  setupCalculator() {
    this.calculateRisk();
    this.calculateDrawdown();
    this.calculatePositionSize();
  }

  updateCalculator() {
    this.calculateRisk();
    this.calculateDrawdown();
    this.calculatePositionSize();
    // Po obliczeniu remainingCapital:
    const remainingCapitalEl = document.getElementById("remainingCapital");
    if (remainingCapitalEl) {
      const value = parseFloat(
        remainingCapitalEl.textContent.replace(/[^\d.-]/g, "")
      );
      if (!isNaN(value) && value < 0) {
        remainingCapitalEl.style.color = "#ea3943";
      } else if (!isNaN(value) && value > 0) {
        remainingCapitalEl.style.color = "#16c784";
      } else {
        remainingCapitalEl.style.color = "";
      }
    }
  }

  calculateRisk() {
    const riskPercentage =
      parseFloat(document.getElementById("riskPercentage").value) || 1;
    const stopLossPercentage =
      parseFloat(document.getElementById("stopLossPercentage").value) || 2;

    const riskAmount = (this.currentBalance * riskPercentage) / 100;
    const positionSize = (riskAmount * 100) / stopLossPercentage;
    const maxLoss = (positionSize * stopLossPercentage) / 100;

    const currency = (localStorage.getItem("currency") || "USD").toUpperCase();
    document.getElementById("riskAmount").textContent = `${riskAmount.toFixed(
      2
    )} ${currency}`;
    document.getElementById(
      "positionSize"
    ).textContent = `${positionSize.toFixed(2)} ${currency}`;
    document.getElementById("maxLoss").textContent = `${maxLoss.toFixed(
      2
    )} ${currency}`;
  }

  calculateDrawdown() {
    const consecutiveLosses =
      parseInt(document.getElementById("consecutiveLosses").value) || 5;
    const lossPerTrade =
      parseFloat(document.getElementById("lossPerTrade").value) || 2;

    // Calculate compound loss
    let remainingCapital = this.currentBalance;
    for (let i = 0; i < consecutiveLosses; i++) {
      remainingCapital = remainingCapital * (1 - lossPerTrade / 100);
    }

    const totalLossPercentage =
      ((this.currentBalance - remainingCapital) / this.currentBalance) * 100;

    // Calculate days to bankruptcy (assuming 1 trade per day)
    const tradesPerDay = 1;
    const daysToBankruptcy =
      Math.log(0.01) / Math.log(1 - lossPerTrade / 100) / tradesPerDay;

    document.getElementById(
      "totalLoss"
    ).textContent = `${totalLossPercentage.toFixed(2)}%`;
    const currency = (localStorage.getItem("currency") || "USD").toUpperCase();
    document.getElementById(
      "remainingCapital"
    ).textContent = `${remainingCapital.toFixed(2)} ${currency}`;
    document.getElementById("daysToBankruptcy").textContent =
      daysToBankruptcy > 1000 ? "∞" : `${Math.ceil(daysToBankruptcy)} dni`;
  }

  calculatePositionSize() {
    const targetProfit =
      parseFloat(document.getElementById("targetProfit").value) || 5;
    const winRate =
      parseFloat(document.getElementById("winRateInput").value) || 60;

    // Calculate optimal position size based on Kelly Criterion
    const winProbability = winRate / 100;
    const lossProbability = 1 - winProbability;
    const winRatio = targetProfit / 100;
    const lossRatio = 2 / 100; // Assuming 2% stop loss

    const kellyPercentage =
      (winProbability * winRatio - lossProbability * lossRatio) / winRatio;
    const optimalSize = Math.max(0, kellyPercentage * this.currentBalance);

    const expectedProfit = optimalSize * (winRate / 100) * (targetProfit / 100);
    const riskRewardRatio = targetProfit / 2; // Assuming 2% stop loss

    const currency = (localStorage.getItem("currency") || "USD").toUpperCase();
    document.getElementById("optimalSize").textContent = `${optimalSize.toFixed(
      2
    )} ${currency}`;
    document.getElementById(
      "expectedProfit"
    ).textContent = `${expectedProfit.toFixed(2)} ${currency}`;
    document.getElementById(
      "riskReward"
    ).textContent = `1:${riskRewardRatio.toFixed(1)}`;
  }

  addAlert() {
    const type = document.getElementById("alertType").value;
    const value = parseFloat(document.getElementById("alertValue").value);
    const condition = document.getElementById("alertCondition").value;

    if (!value || isNaN(value)) {
      this.showNotification(
        this.translationManager.t("error_alert_value_required"),
        "error"
      );
      return;
    }

    const alert = {
      id: Date.now(),
      type,
      value,
      condition,
      active: true,
      triggered: false,
      lastTriggered: null,
    };

    this.alerts.push(alert);
    localStorage.setItem("alerts", JSON.stringify(this.alerts));

    this.updateAlertsList();
    this.showNotification(this.translationManager.t("alert_added"), "success");

    // Clear form
    document.getElementById("alertValue").value = "";
  }

  updateAlertsList() {
    const alertsList = document.getElementById("alertsList");

    if (this.alerts.length === 0) {
      alertsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bell"></i>
                    <h3>${this.translationManager.t("no_alerts")}</h3>
                    <p>${this.translationManager.t("no_alerts_desc")}</p>
                </div>
            `;
      return;
    }

    alertsList.innerHTML = this.alerts
      .map(
        (alert) => `
            <div class="alert-item ${alert.triggered ? "triggered" : ""}">
                <div class="alert-info">
                    <div class="alert-type">${this.getAlertTypeName(
                      alert.type
                    )}</div>
                    <div class="alert-condition">
                        ${
                          alert.condition === "above"
                            ? this.translationManager.t("alert_condition_above")
                            : this.translationManager.t("alert_condition_below")
                        } 
                        <span class="alert-value">${alert.value.toFixed(
                          2
                        )} NOK</span>
                    </div>
                    ${
                      alert.triggered
                        ? `<div class="alert-status">${this.translationManager.t(
                            "alert_active"
                          )}</div>`
                        : ""
                    }
                </div>
                <div class="alert-actions">
                    <button class="btn btn-warning" onclick="tradingDiary.resetAlert(${
                      alert.id
                    })" title="${this.translationManager.t("reset_alert")}">
                        <i class="fas fa-redo"></i>
                    </button>
                    <button class="btn btn-danger" onclick="tradingDiary.deleteAlert(${
                      alert.id
                    })">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `
      )
      .join("");
  }

  deleteAlert(alertId) {
    this.alerts = this.alerts.filter((alert) => alert.id !== alertId);
    localStorage.setItem("alerts", JSON.stringify(this.alerts));
    this.updateAlertsList();
    this.showNotification(
      this.translationManager.t("alert_deleted"),
      "success"
    );
  }

  resetAlert(alertId) {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.triggered = false;
      alert.lastTriggered = null;
      localStorage.setItem("alerts", JSON.stringify(this.alerts));
      this.updateAlertsList();
      this.showNotification(
        this.translationManager.t("alert_reset"),
        "success"
      );
    }
  }

  getAlertTypeName(type) {
    const types = {
      balance: this.translationManager.t("balance_label").replace(":", ""),
      profit: this.translationManager.t("total_profit"),
      loss: this.translationManager.t("entry_type_loss"),
    };
    return types[type] || type;
  }

  checkAlerts() {
    const totalProfit = this.trades.reduce((sum, trade) => {
      const profit = parseFloat(trade.profit) || 0;
      return sum + profit;
    }, 0);

    this.alerts.forEach((alert) => {
      if (!alert.active) return;

      let currentValue;
      let alertText = "";
      switch (alert.type) {
        case "balance":
          currentValue = this.currentBalance;
          alertText = `${this.translationManager
            .t("balance_label")
            .replace(":", "")} ${this.translationManager.t(
            "alert_condition_below"
          )} ${alert.value.toFixed(2)} NOK!`;
          break;
        case "profit":
          currentValue = totalProfit;
          alertText = `${this.translationManager.t(
            "total_profit"
          )} ${this.translationManager.t(
            "alert_condition_below"
          )} ${alert.value.toFixed(2)} NOK!`;
          break;
        case "loss":
          currentValue = Math.abs(Math.min(0, totalProfit));
          alertText = `${this.translationManager.t(
            "entry_type_loss"
          )} ${this.translationManager.t(
            "alert_condition_below"
          )} ${alert.value.toFixed(2)} NOK!`;
          break;
      }

      let triggered = false;
      if (alert.condition === "above" && currentValue > alert.value) {
        triggered = true;
        alertText = `${this.getAlertTypeName(
          alert.type
        )} ${this.translationManager.t(
          "alert_condition_above"
        )} ${alert.value.toFixed(2)} NOK!`;
      } else if (alert.condition === "below" && currentValue < alert.value) {
        triggered = true;
      }

      // Sprawdź czy alert już był wyzwolony i czy warunek nadal jest spełniony
      if (triggered && !alert.triggered) {
        this.showNotification(alertText, "error");
        this.playAlertSound();

        // Oznacz alert jako wyzwolony
        alert.triggered = true;
        alert.lastTriggered = new Date().toISOString();
        localStorage.setItem("alerts", JSON.stringify(this.alerts));
      } else if (!triggered && alert.triggered) {
        // Reset alertu gdy warunek przestaje być spełniony
        alert.triggered = false;
        alert.lastTriggered = null;
        localStorage.setItem("alerts", JSON.stringify(this.alerts));
      }
    });
  }

  playAlertSound() {
    try {
      // Create a simple beep sound
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.2
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);

      console.log("Alert sound played");
    } catch (error) {
      console.log("Could not play alert sound:", error);
    }
  }

  showNotification(message, type = "success") {
    const notification = document.getElementById("notification");
    const notificationText = document.getElementById("notificationText");
    if (!notification || !notificationText) return;
    notification.classList.remove("show");
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }
    notificationText.textContent = message;
    notification.className = `notification ${type} show`;
    this.notificationTimeout = setTimeout(() => {
      this.hideNotification();
    }, 5000);
  }

  hideNotification() {
    const notification = document.getElementById("notification");
    if (notification) {
      notification.classList.remove("show");
    }
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
      this.notificationTimeout = null;
    }
  }

  saveLanguage() {
    const languageSelect = document.getElementById("languageSelect");
    const language = languageSelect.value;
    localStorage.setItem("language", language);
    this.translationManager.setLanguage(language);
    this.updateUI();
    if (this.chart) this.updateChart();
    this.showNotification(
      this.translationManager.t("language_saved"),
      "success"
    );
  }

  // Test function to manually check alerts
  testAlerts() {
    console.log("=== TESTING ALERTS ===");
    console.log("Current balance:", this.currentBalance);
    console.log("All alerts:", this.alerts);
    this.checkAlerts();
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Nowa funkcja: pełna rekalkulacja historii salda na podstawie transakcji i zmian salda
  recalculateBalanceHistory() {
    // Ustal saldo początkowe
    let initialBalance = this.initialBalance;
    // Zbierz wszystkie transakcje, posortuj po dacie rosnąco
    const allTrades = [...this.trades].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const history = [];
    let runningBalance = initialBalance;
    // Ustal datę początkową historii
    let firstDate;
    if (allTrades.length > 0) {
      firstDate = new Date(allTrades[0].date);
    } else if (this.balanceHistory.length > 0) {
      firstDate = new Date(this.balanceHistory[0].date);
    } else {
      firstDate = new Date();
    }
    // Dodaj pierwszy punkt z datą najstarszej transakcji lub początkową
    history.push({
      date: firstDate.toISOString(),
      balance: initialBalance,
      timestamp: firstDate.getTime(),
    });
    // Dodaj kolejne punkty na podstawie transakcji
    allTrades.forEach((trade) => {
      runningBalance += parseFloat(trade.profit) || 0;
      history.push({
        date: trade.date,
        balance: runningBalance,
        timestamp: new Date(trade.date).getTime(),
      });
    });
    // Zaktualizuj historię i saldo
    this.balanceHistory = history;
    this.currentBalance = runningBalance;
    localStorage.setItem("balanceHistory", JSON.stringify(this.balanceHistory));
  }

  clearAllData() {
    if (!confirm(this.translationManager.t("confirm_clear_data"))) return;
    // Wyczyść localStorage
    localStorage.clear();
    // Ustaw puste wartości
    this.trades = [];
    this.alerts = [];
    this.balanceHistory = [];
    this.initialBalance = 0;
    this.currentBalance = 0;
    // Zapisz do localStorage
    localStorage.setItem("trades", JSON.stringify([]));
    localStorage.setItem("alerts", JSON.stringify([]));
    localStorage.setItem("balanceHistory", JSON.stringify([]));
    localStorage.setItem("initialBalance", "0");
    localStorage.setItem("currentBalance", "0");
    localStorage.setItem("currency", "USD");
    this.updateUI();
    if (this.chart) this.updateChart();
    this.showNotification(this.translationManager.t("data_cleared"), "success");
    setTimeout(() => location.reload(), 500);
  }

  exportData() {
    const data = {
      trades: this.trades,
      alerts: this.alerts,
      balanceHistory: this.balanceHistory,
      initialBalance: this.initialBalance,
      currentBalance: this.currentBalance,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "trading-diary-backup.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showNotification(
      this.translationManager.t("data_exported"),
      "success"
    );
  }

  importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        this.trades = data.trades || [];
        this.alerts = data.alerts || [];
        this.balanceHistory = data.balanceHistory || [];
        this.initialBalance = data.initialBalance ?? 0;
        this.currentBalance = data.currentBalance || this.initialBalance;
        localStorage.setItem("trades", JSON.stringify(this.trades));
        localStorage.setItem("alerts", JSON.stringify(this.alerts));
        localStorage.setItem(
          "balanceHistory",
          JSON.stringify(this.balanceHistory)
        );
        localStorage.setItem("initialBalance", this.initialBalance);
        localStorage.setItem("currentBalance", this.currentBalance);
        this.updateUI();
        if (this.chart) this.updateChart();
        this.showNotification(
          this.translationManager.t("data_imported"),
          "success"
        );
      } catch (err) {
        this.showNotification(
          this.translationManager.t("error_import_failed"),
          "error"
        );
      }
    };
    reader.readAsText(file);
  }

  updateBalanceModalCurrency() {
    const currency = (localStorage.getItem("currency") || "USD").toUpperCase();
    const currencyEls = document.querySelectorAll(
      "#balanceModal .balance-currency"
    );
    currencyEls.forEach((el) => (el.textContent = currency));
  }

  logout() {
    // Clear user data
    this.currentUser = null;
    this.trades = [];
    this.alerts = [];
    this.balanceHistory = [];
    this.initialBalance = 0;
    this.currentBalance = 0;

    // Clear localStorage
    localStorage.removeItem("trades");
    localStorage.removeItem("alerts");
    localStorage.removeItem("balanceHistory");
    localStorage.removeItem("initialBalance");
    localStorage.removeItem("currentUser");

    // Show login modal
    if (window.loginManager) {
      window.loginManager.showLoginModal();
    }

    // Update UI
    this.updateUI();
    this.showNotification(
      this.translationManager.t("logout_success"),
      "success"
    );
  }

  setupImageModal() {
    // Dodaj modal do body jeśli nie istnieje
    if (!document.getElementById("imageModal")) {
      const modal = document.createElement("div");
      modal.id = "imageModal";
      modal.style =
        "display:none;position:fixed;z-index:9999;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.85);justify-content:center;align-items:center;";
      modal.innerHTML = `
        <span id="closeImageModal" style="position:absolute;top:32px;right:48px;font-size:2.5rem;color:#fff;cursor:pointer;z-index:10001">&times;</span>
        <img id="modalImage" src="" style="max-width:90vw;max-height:90vh;border-radius:18px;box-shadow:0 0 32px #000;" />
      `;
      document.body.appendChild(modal);
    }
    // Obsługa kliknięcia w miniaturę
    document.body.addEventListener("click", (e) => {
      if (e.target.classList.contains("trade-image")) {
        const src = e.target.getAttribute("src");
        document.getElementById("modalImage").src = src;
        document.getElementById("imageModal").style.display = "flex";
      }
      if (e.target.id === "closeImageModal" || e.target.id === "imageModal") {
        document.getElementById("imageModal").style.display = "none";
        document.getElementById("modalImage").src = "";
      }
    });
  }
}

// Nowa funkcja: generowanie losowych transakcji do testów
function generateRandomTrades(count = 20) {
  const symbols = [
    "BTC/USD",
    "ETH/USD",
    "AAPL",
    "TSLA",
    "EUR/USD",
    "NQ",
    "SPX",
    "USD/JPY",
    "GOLD",
    "OIL",
  ];
  const types = ["buy", "sell"];
  const sizeTypes = ["lot", "mini", "micro", "nano", "size"];
  const notes = [
    "Test trade",
    "Quick scalp",
    "Long-term position",
    "SL close",
    "Take profit",
    "Manual exit",
    "Swing trade",
    "Day trade",
    "After news",
    "Following trend",
  ];
  const trades = [];
  for (let i = 0; i < count; i++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const size = (Math.random() * 5 + 0.01).toFixed(2);
    const sizeType = sizeTypes[Math.floor(Math.random() * sizeTypes.length)];
    // Profit: losowo od -200 do +300
    const profit = (Math.random() * 500 - 200).toFixed(2);
    // Data: losowy dzień z ostatnich 30 dni
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(
      now.getTime() -
        daysAgo * 24 * 60 * 60 * 1000 -
        Math.floor(Math.random() * 86400000)
    );
    const dateStr = date.toISOString().slice(0, 16);
    const note = notes[Math.floor(Math.random() * notes.length)];
    trades.push({
      id: Date.now() + i,
      symbol,
      type,
      size: parseFloat(size),
      sizeType,
      profit: parseFloat(profit),
      date: dateStr,
      notes: note,
      image: null,
    });
  }
  return trades;
}

// KALENDARZ: generowanie widoku i podsumowań
class CalendarView {
  constructor(tradingDiary) {
    this.tradingDiary = tradingDiary;
    this.translationManager = tradingDiary.translationManager;
    this.currentDate = new Date();
    this.init();
  }

  init() {
    this.renderCalendar();
    document.getElementById("prevMonthBtn").onclick = () =>
      this.changeMonth(-1);
    document.getElementById("nextMonthBtn").onclick = () => this.changeMonth(1);
  }

  changeMonth(offset) {
    this.currentDate.setMonth(this.currentDate.getMonth() + offset);
    this.renderCalendar();
  }

  renderCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // poniedziałek=0
    const daysInMonth = lastDay.getDate();
    const calendarGrid = document.getElementById("calendarGrid");
    const currentMonthLabel = document.getElementById("currentMonth");
    const monthNames = [
      this.tradingDiary.translationManager.t("month_january"),
      this.tradingDiary.translationManager.t("month_february"),
      this.tradingDiary.translationManager.t("month_march"),
      this.tradingDiary.translationManager.t("month_april"),
      this.tradingDiary.translationManager.t("month_may"),
      this.tradingDiary.translationManager.t("month_june"),
      this.tradingDiary.translationManager.t("month_july"),
      this.tradingDiary.translationManager.t("month_august"),
      this.tradingDiary.translationManager.t("month_september"),
      this.tradingDiary.translationManager.t("month_october"),
      this.tradingDiary.translationManager.t("month_november"),
      this.tradingDiary.translationManager.t("month_december"),
    ];
    currentMonthLabel.textContent = `${monthNames[month]} ${year}`;

    // Zbierz transakcje z tego miesiąca
    const trades = this.tradingDiary.trades.filter((trade) => {
      const d = new Date(trade.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
    // Grupuj po dniu
    const dayMap = {};
    trades.forEach((trade) => {
      const d = new Date(trade.date);
      const day = d.getDate();
      if (!dayMap[day]) dayMap[day] = [];
      dayMap[day].push(trade);
    });

    // Generuj siatkę
    let html = "";
    let dayNum = 1;
    for (let row = 0; row < 6; row++) {
      html += '<div class="calendar-row">';
      for (let col = 0; col < 7; col++) {
        const cellIndex = row * 7 + col;
        if (cellIndex < startDay || dayNum > daysInMonth) {
          html += '<div class="calendar-cell empty"></div>';
        } else {
          // Podsumowanie dnia
          const tradesForDay = dayMap[dayNum] || [];
          const profit = tradesForDay.reduce(
            (sum, t) => sum + (parseFloat(t.profit) || 0),
            0
          );
          const tradeCount = tradesForDay.length;
          let cellClass = "calendar-cell";
          let summary = "";
          if (tradeCount > 0) {
            const bgColor = profit >= 0 ? "#16c784" : "#ea3943";
            const color = "#fff";
            const profitClass = profit >= 0 ? "profit" : "loss";
            const currency = (
              localStorage.getItem("currency") || "USD"
            ).toUpperCase();
            summary = `<div class='calendar-cell-content'><div class='calendar-profit ${profitClass}' style='font-weight:bold;'>${
              profit >= 0 ? "+" : ""
            }${profit.toFixed(
              2
            )} ${currency}</div><div class='calendar-trades'>${tradeCount} trades</div></div>`;
            html += `<div class='${cellClass}' style='background:${bgColor};'>
              <div class='calendar-day' style='color:${color};'>${dayNum}</div>
              ${summary}
            </div>`;
          } else {
            html += `<div class='${cellClass}'>
              <div class='calendar-day'>${dayNum}</div>
            </div>`;
          }
          dayNum++;
        }
      }
      html += "</div>";
      if (dayNum > daysInMonth) break;
    }
    calendarGrid.innerHTML = html;
    this.updateSummary(dayMap);
  }

  updateSummary(dayMap) {
    let monthlyProfit = 0;
    let tradingDays = 0;
    let winningDays = 0;
    Object.values(dayMap).forEach((trades) => {
      const profit = trades.reduce(
        (sum, t) => sum + (parseFloat(t.profit) || 0),
        0
      );
      monthlyProfit += profit;
      if (trades.length > 0) tradingDays++;
      if (profit > 0) winningDays++;
    });
    const currency = (localStorage.getItem("currency") || "USD").toUpperCase();
    document.getElementById("monthlyProfit").textContent = `${
      monthlyProfit >= 0 ? "+" : "-"
    }${Math.abs(monthlyProfit).toFixed(2)} ${currency}`;
    document.getElementById("monthlyProfit").style.color =
      monthlyProfit >= 0 ? "#16c784" : "#ea3943";
    document.getElementById("tradingDays").textContent = tradingDays;
    document.getElementById("winningDays").textContent = winningDays;
  }
}

// Dodaj na końcu pliku (po klasie TradingDiary):
function generateStarsBg() {
  const starsBg = document.getElementById("starsBg");
  if (!starsBg) return;
  starsBg.innerHTML = "";
  for (let i = 0; i < 80; i++) {
    const star = document.createElement("div");
    star.className = "star";
    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}vw`;
    star.style.top = `${Math.random() * 100}vh`;
    star.style.animationDuration = `${8 + Math.random() * 8}s`;
    starsBg.appendChild(star);
  }
}
document.addEventListener("DOMContentLoaded", generateStarsBg);

// Animacja liczb
function animateNumber(el, to, duration = 800) {
  const from = parseFloat(el.textContent.replace(/[^\d.-]/g, "")) || 0;
  const start = performance.now();
  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = from + (to - from) * progress;
    el.textContent = value.toFixed(2);
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
