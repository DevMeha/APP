export const translations = {
  en: {
    // Header
    app_title: "Trading Diary",
    balance_label: "Balance:",
    currency: "USD",

    // Navigation
    nav_trades: "Trades",
    nav_charts: "Charts",
    nav_calculator: "Calculator",
    nav_calendar: "Calendar",
    nav_alerts: "Alerts",
    nav_settings: "Settings",

    // Trades Tab
    trades_header: "Trade History",
    add_trade: "Add Trade",
    total_profit: "Total Profit",
    trades_count: "Trades Count",
    win_rate: "Win Rate",
    no_trades: "No trades",
    no_trades_desc: "Add your first trade to start tracking",

    // Trade Form
    trade_symbol: "Symbol:",
    trade_symbol_placeholder: "e.g. BTC/USD",
    trade_type: "Type:",
    trade_type_buy: "Buy",
    trade_type_sell: "Sell",
    trade_size: "Position Size:",
    trade_size_placeholder: "",
    trade_profit: "Profit/Loss:",
    trade_profit_placeholder: "0.00",
    trade_date: "Date:",
    trade_notes: "Notes:",
    trade_notes_placeholder: "Trade description...",
    trade_image: "Image:",
    save_trade: "Save Trade",
    cancel: "Cancel",

    // Size Types
    size_lot: "Lot",
    size_mini: "Mini Lot",
    size_micro: "Micro Lot",
    size_nano: "Nano Lot",
    size_size: "Size",

    // Trade Display
    trade_size_label: "Size",
    trade_date_label: "Date:",
    delete_trade: "Delete",

    // Charts Tab
    charts_header: "Capital Analysis",
    chart_period_7: "7 days",
    chart_period_30: "30 days",
    chart_period_90: "90 days",
    chart_period_365: "1 year",
    generate_sample_data: "Generate Sample Data",
    avg_balance: "Average Balance",
    max_balance: "Maximum Balance",
    capital_growth: "Capital Growth",

    // Calculator Tab
    calculator_header: "Risk Calculator",
    risk_calculator: "Risk Calculator",
    risk_percentage: "Risk Percentage (%):",
    stop_loss_percentage: "Stop Loss (%):",
    risk_amount: "Amount to Risk:",
    position_size: "Position Size:",
    max_loss: "Maximum Loss:",

    drawdown_calculator: "Drawdown Calculator",
    consecutive_losses: "Consecutive Losses:",
    loss_per_trade: "Loss per Trade (%):",
    total_loss: "Total Loss:",
    remaining_capital: "Remaining Capital:",
    days_to_bankruptcy: "Days to Bankruptcy:",

    position_sizing: "Position Sizing",
    target_profit: "Target Profit (%):",
    win_rate_input: "Win Rate (%):",
    optimal_size: "Optimal Size:",
    expected_profit: "Expected Profit:",
    risk_reward: "Risk/Reward:",

    // Alerts Tab
    alerts_header: "Alert Settings",
    add_alert: "Add Alert",
    new_alert: "New Alert",
    alert_type: "Alert Type:",
    alert_type_balance: "Balance",
    alert_type_profit: "Profit",
    alert_type_loss: "Loss",
    alert_value: "Value:",
    alert_value_placeholder: "0.00",
    alert_condition: "Condition:",
    alert_condition_above: "Above",
    alert_condition_below: "Below",
    save_alert: "Save Alert",
    no_alerts: "No alerts",
    no_alerts_desc: "Add an alert to receive notifications",
    alert_active: "Active",
    alert_inactive: "Inactive",
    reset_alert: "Reset",

    // Calendar Tab
    calendar_header: "Trading Calendar",
    current_month: "January 2024",
    add_entry: "Add Entry",
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun",
    monthly_profit: "Monthly Profit",
    trading_days: "Trading Days",
    winning_days: "Winning Days",
    add_calendar_entry: "Add Calendar Entry",
    entry_date: "Date:",
    entry_pnl: "Profit/Loss:",
    entry_pnl_placeholder: "0.00",
    entry_type: "Type:",
    entry_type_profit: "Profit",
    entry_type_loss: "Loss",
    entry_notes: "Notes:",
    entry_notes_placeholder: "Trading notes for this day...",
    save_entry: "Save Entry",

    // Settings Tab
    settings_header: "Application Settings",
    currency_settings: "Currency Settings",
    currency: "Currency:",
    currency_info: "Currency Info",

    display_settings: "Display Settings",
    decimal_places: "Decimal Places:",
    decimal_places_0: "0 (e.g. 1000)",
    decimal_places_1: "1 (e.g. 1000.5)",
    decimal_places_2: "2 (e.g. 1000.50)",
    decimal_places_3: "3 (e.g. 1000.500)",
    decimal_places_4: "4 (e.g. 1000.5000)",
    date_format: "Date Format:",
    date_format_en: "English (MM/DD/YYYY)",
    date_format_en_gb: "British (DD/MM/YYYY)",
    date_format_de: "German (DD.MM.YYYY)",
    save_display: "Save Display",

    data_management: "Data Management",
    export_data: "Export Data",
    import_data: "Import Data",
    clear_data: "Clear All Data",

    backup_settings: "Backup Settings",
    auto_backup: "Automatic data backup",
    backup_interval: "Backup frequency:",
    backup_daily: "Daily",
    backup_weekly: "Weekly",
    backup_monthly: "Monthly",
    save_backup: "Save Backup",

    // Language Settings
    language_settings: "Language Settings",
    language: "Language:",
    language_en: "English",
    language_pl: "Polish",
    language_de: "German",
    language_es: "Spanish",
    language_fr: "French",
    save_language: "Save Language",

    // Modals
    edit_balance: "Edit Balance",
    new_balance: "New Balance:",
    balance_reason: "Reason for change (optional):",
    balance_reason_placeholder: "e.g. Deposit, withdrawal, adjustment...",
    save_balance: "Save Balance",

    // Notifications
    trade_added: "Trade added successfully",
    trade_deleted: "Trade deleted",
    balance_updated: "Balance updated",
    alert_added: "Alert added successfully",
    alert_deleted: "Alert deleted",
    alert_reset: "Alert reset",
    entry_saved: "Calendar entry saved",
    settings_saved: "Settings saved",
    data_exported: "Data exported",
    data_imported: "Data imported",
    data_cleared: "All data cleared",
    currency_saved: "Currency saved",
    language_saved: "Language saved",

    // Errors
    error_symbol_required: "Symbol is required",
    error_size_required: "Position size must be greater than 0",
    error_profit_required: "Profit/Loss is required",

    // Month names
    month_january: "January",
    month_february: "February",
    month_march: "March",
    month_april: "April",
    month_may: "May",
    month_june: "June",
    month_july: "July",
    month_august: "August",
    month_september: "September",
    month_october: "October",
    month_november: "November",
    month_december: "December",
    error_date_required: "Date is required",
    error_invalid_balance: "Invalid balance",
    error_alert_value_required: "Alert value is required",
    error_invalid_entry: "Invalid calendar entry",
    error_import_failed: "Error importing data",
    error_image_type: "Please select an image file",
    error_image_size: "File is too large. Maximum size is 5MB",

    // Confirmations
    confirm_clear_data:
      "Are you sure you want to clear all data? This action cannot be undone.",

    // File Input
    select_image: "Select Image",
    drag_drop_hint: "or drag and drop here",

    // Currency Names
    currency_nok: "Norwegian Krone",
    currency_pln: "Polish Złoty",
    currency_eur: "Euro",
    currency_usd: "US Dollar",
    currency_usdt: "Tether",
    currency_btc: "Bitcoin",
    currency_eth: "Ethereum",
    currency_gbp: "British Pound",
    currency_chf: "Swiss Franc",
    currency_jpy: "Japanese Yen",

    // Missing translations
    save_currency: "Save Currency",
    sample_data_generated: "Sample data generated",
  },

  pl: {
    // Header
    app_title: "Dziennik Handlowy",
    balance_label: "Saldo:",
    currency: "PLN",

    // Navigation
    nav_trades: "Transakcje",
    nav_charts: "Wykresy",
    nav_calculator: "Kalkulator",
    nav_calendar: "Kalendarz",
    nav_alerts: "Alerty",
    nav_settings: "Ustawienia",

    // Trades Tab
    trades_header: "Historia Transakcji",
    add_trade: "Dodaj Transakcję",
    total_profit: "Całkowity Profit",
    trades_count: "Liczba Transakcji",
    win_rate: "Win Rate",
    no_trades: "Brak transakcji",
    no_trades_desc: "Dodaj pierwszą transakcję, aby rozpocząć śledzenie",

    // Trade Form
    trade_symbol: "Symbol:",
    trade_symbol_placeholder: "np. BTC/USD",
    trade_type: "Typ:",
    trade_type_buy: "Kupno",
    trade_type_sell: "Sprzedaż",
    trade_size: "Wielkość Pozycji:",
    trade_size_placeholder: "",
    trade_profit: "Profit/Strata:",
    trade_profit_placeholder: "0.00",
    trade_date: "Data:",
    trade_notes: "Notatki:",
    trade_notes_placeholder: "Opis transakcji...",
    trade_image: "Zdjęcie:",
    save_trade: "Zapisz Transakcję",
    cancel: "Anuluj",

    // Size Types
    size_lot: "Lot",
    size_mini: "Mini Lot",
    size_micro: "Micro Lot",
    size_nano: "Nano Lot",
    size_size: "Size",

    // Trade Display
    trade_size_label: "Wielkość",
    trade_date_label: "Data:",
    delete_trade: "Usuń",

    // Charts Tab
    charts_header: "Analiza Kapitału",
    chart_period_7: "7 dni",
    chart_period_30: "30 dni",
    chart_period_90: "90 dni",
    chart_period_365: "1 rok",
    generate_sample_data: "Przykładowe Dane",
    avg_balance: "Średni Kapitał",
    max_balance: "Maksymalny Kapitał",
    capital_growth: "Wzrost Kapitału",

    // Calculator Tab
    calculator_header: "Kalkulator Ryzyka",
    risk_calculator: "Kalkulator Ryzyka",
    risk_percentage: "Procent Ryzyka (%):",
    stop_loss_percentage: "Stop Loss (%):",
    risk_amount: "Kwota do Ryzykowania:",
    position_size: "Wielkość Pozycji:",
    max_loss: "Maksymalna Strata:",

    drawdown_calculator: "Kalkulator Drawdown",
    consecutive_losses: "Liczba Przegranych z Rzędu:",
    loss_per_trade: "Strata na Transakcję (%):",
    total_loss: "Strata Po Przegranych:",
    remaining_capital: "Pozostały Kapitał:",
    days_to_bankruptcy: "Dni do Bankructwa:",

    position_sizing: "Wielkość Pozycji",
    target_profit: "Cel Profit (%):",
    win_rate_input: "Win Rate (%):",
    optimal_size: "Optymalna Wielkość:",
    expected_profit: "Oczekiwany Profit:",
    risk_reward: "Ryzyko/Reward:",

    // Alerts Tab
    alerts_header: "Ustawienia Alertów",
    add_alert: "Dodaj Alert",
    new_alert: "Nowy Alert",
    alert_type: "Typ Alertu:",
    alert_type_balance: "Saldo",
    alert_type_profit: "Profit",
    alert_type_loss: "Strata",
    alert_value: "Wartość:",
    alert_value_placeholder: "0.00",
    alert_condition: "Warunek:",
    alert_condition_above: "Powyżej",
    alert_condition_below: "Poniżej",
    save_alert: "Zapisz Alert",
    no_alerts: "Brak alertów",
    no_alerts_desc: "Dodaj alert, aby otrzymywać powiadomienia",
    alert_active: "Aktywny",
    alert_inactive: "Nieaktywny",
    reset_alert: "Resetuj",

    // Calendar Tab
    calendar_header: "Kalendarz Handlowy",
    current_month: "Styczeń 2024",
    add_entry: "Dodaj Wpis",
    monday: "Pon",
    tuesday: "Wt",
    wednesday: "Śr",
    thursday: "Czw",
    friday: "Pt",
    saturday: "Sob",
    sunday: "Ndz",
    monthly_profit: "Profit Miesięczny",
    trading_days: "Dni Handlowe",
    winning_days: "Dni Wygrane",
    add_calendar_entry: "Dodaj Wpis do Kalendarza",
    entry_date: "Data:",
    entry_pnl: "Profit/Strata:",
    entry_pnl_placeholder: "0.00",
    entry_type: "Typ:",
    entry_type_profit: "Profit",
    entry_type_loss: "Strata",
    entry_notes: "Notatki:",
    entry_notes_placeholder: "Notatki handlowe na ten dzień...",
    save_entry: "Zapisz Wpis",

    // Settings Tab
    settings_header: "Ustawienia Aplikacji",
    currency_settings: "Ustawienia Waluty",
    currency: "Waluta:",
    currency_info: "Informacje o Walucie",

    display_settings: "Ustawienia Wyświetlania",
    decimal_places: "Liczba miejsc po przecinku:",
    decimal_places_0: "0 (np. 1000)",
    decimal_places_1: "1 (np. 1000.5)",
    decimal_places_2: "2 (np. 1000.50)",
    decimal_places_3: "3 (np. 1000.500)",
    decimal_places_4: "4 (np. 1000.5000)",
    date_format: "Format daty:",
    date_format_pl: "Polski (DD.MM.YYYY)",
    date_format_en: "Amerykański (MM/DD/YYYY)",
    date_format_en_gb: "Brytyjski (DD/MM/YYYY)",
    date_format_de: "Niemiecki (DD.MM.YYYY)",
    save_display: "Zapisz Wyświetlanie",

    data_management: "Zarządzanie Danymi",
    export_data: "Eksportuj Dane",
    import_data: "Importuj Dane",
    clear_data: "Wyczyść Wszystkie Dane",

    backup_settings: "Ustawienia Backup",
    auto_backup: "Automatyczny backup danych",
    backup_interval: "Częstotliwość backup:",
    backup_daily: "Codziennie",
    backup_weekly: "Co tydzień",
    backup_monthly: "Co miesiąc",
    save_backup: "Zapisz Backup",

    // Language Settings
    language_settings: "Ustawienia Języka",
    language: "Język:",
    language_en: "Angielski",
    language_pl: "Polski",
    language_de: "Niemiecki",
    language_es: "Hiszpański",
    language_fr: "Francuski",
    save_language: "Zapisz Język",

    // Modals
    edit_balance: "Edytuj Saldo",
    new_balance: "Nowe Saldo:",
    balance_reason: "Powód Zmiany (opcjonalnie):",
    balance_reason_placeholder: "np. Wpłata, wypłata, korekta...",
    save_balance: "Zapisz Saldo",

    // Notifications
    trade_added: "Transakcja dodana pomyślnie",
    trade_deleted: "Transakcja usunięta",
    balance_updated: "Saldo zaktualizowane",
    alert_added: "Alert dodany pomyślnie",
    alert_deleted: "Alert usunięty",
    alert_reset: "Alert zresetowany",
    entry_saved: "Wpis do kalendarza zapisany",
    settings_saved: "Ustawienia zapisane",
    data_exported: "Dane wyeksportowane",
    data_imported: "Dane zaimportowane",
    data_cleared: "Wszystkie dane wyczyszczone",
    currency_saved: "Waluta zapisana",
    language_saved: "Język zapisany",

    // Errors
    error_symbol_required: "Symbol jest wymagany",
    error_size_required: "Wielkość pozycji musi być większa od 0",
    error_profit_required: "Profit/Strata jest wymagana",
    error_date_required: "Data jest wymagana",
    error_invalid_balance: "Nieprawidłowe saldo",
    error_alert_value_required: "Wartość alertu jest wymagana",
    error_invalid_entry: "Nieprawidłowy wpis do kalendarza",
    error_import_failed: "Błąd podczas importowania danych",
    error_image_type: "Proszę wybrać plik obrazu",
    error_image_size: "Plik jest za duży. Maksymalny rozmiar to 5MB",

    // Confirmations
    confirm_clear_data:
      "Czy na pewno chcesz wyczyścić wszystkie dane? Ta operacja nie może być cofnięta.",

    // File Input
    select_image: "Wybierz zdjęcie",
    drag_drop_hint: "lub przeciągnij tutaj",

    // Currency Names
    currency_nok: "Korona Norweska",
    currency_pln: "Złoty Polski",
    currency_eur: "Euro",
    currency_usd: "Dolar Amerykański",
    currency_usdt: "Tether",
    currency_btc: "Bitcoin",
    currency_eth: "Ethereum",
    currency_gbp: "Funt Brytyjski",
    currency_chf: "Frank Szwajcarski",
    currency_jpy: "Jen Japoński",

    // Missing translations
    save_currency: "Zapisz Walutę",
    sample_data_generated: "Przykładowe dane wygenerowane",

    // Month names
    month_january: "Styczeń",
    month_february: "Luty",
    month_march: "Marzec",
    month_april: "Kwiecień",
    month_may: "Maj",
    month_june: "Czerwiec",
    month_july: "Lipiec",
    month_august: "Sierpień",
    month_september: "Wrzesień",
    month_october: "Październik",
    month_november: "Listopad",
    month_december: "Grudzień",
  },
};

export class TranslationManager {
  constructor() {
    this.currentLanguage = "en"; // Default to English
    this.translations = translations;
  }

  setLanguage(language) {
    this.currentLanguage = language;
    this.updateAllTexts();
    if (window.tradingDiary) {
      window.tradingDiary.updateUI();
      if (window.tradingDiary.chart) window.tradingDiary.updateChart();
    }
  }

  getLanguage() {
    return this.currentLanguage;
  }

  t(key) {
    const lang = this.translations[this.currentLanguage];
    if (!lang) {
      console.warn(
        `Language ${this.currentLanguage} not found, falling back to English`
      );
      return this.translations["en"][key] || key;
    }
    return lang[key] || this.translations["en"][key] || key;
  }

  updateAllTexts() {
    // Update all text elements with data-translate attributes
    document.querySelectorAll("[data-translate]").forEach((element) => {
      const key = element.getAttribute("data-translate");
      element.textContent = this.t(key);
    });

    // Update placeholders
    document
      .querySelectorAll("[data-translate-placeholder]")
      .forEach((element) => {
        const key = element.getAttribute("data-translate-placeholder");
        element.placeholder = this.t(key);
      });

    // Update titles
    document.querySelectorAll("[data-translate-title]").forEach((element) => {
      const key = element.getAttribute("data-translate-title");
      element.title = this.t(key);
    });

    // Update alt texts
    document.querySelectorAll("[data-translate-alt]").forEach((element) => {
      const key = element.getAttribute("data-translate-alt");
      element.alt = this.t(key);
    });

    // Update select options
    document.querySelectorAll("option[data-translate]").forEach((option) => {
      const key = option.getAttribute("data-translate");
      option.textContent = this.t(key);
    });
  }
}
