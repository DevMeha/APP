export class StorageManager {
  constructor() {
    this.prefix = "trading_diary_";
  }

  set(key, value) {
    try {
      const fullKey = this.prefix + key;
      localStorage.setItem(fullKey, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      return false;
    }
  }

  get(key, defaultValue = null) {
    try {
      const fullKey = this.prefix + key;
      const item = localStorage.getItem(fullKey);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return defaultValue;
    }
  }

  remove(key) {
    try {
      const fullKey = this.prefix + key;
      localStorage.removeItem(fullKey);
      return true;
    } catch (error) {
      console.error("Error removing from localStorage:", error);
      return false;
    }
  }

  clear() {
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith(this.prefix))
        .forEach((key) => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      return false;
    }
  }

  getAll() {
    const data = {};
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith(this.prefix))
        .forEach((key) => {
          const shortKey = key.replace(this.prefix, "");
          data[shortKey] = this.get(shortKey);
        });
    } catch (error) {
      console.error("Error getting all data from localStorage:", error);
    }
    return data;
  }
}
