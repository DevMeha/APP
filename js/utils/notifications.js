export class NotificationManager {
  constructor() {
    this.notificationTimeout = null;
  }

  show(message, type = "success") {
    const notification = document.getElementById("notification");
    const notificationText = document.getElementById("notificationText");

    if (!notification || !notificationText) return;

    // Clear existing timeout
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }

    // Set message and type
    notificationText.textContent = message;
    notification.className = `notification ${type}`;

    // Show notification
    notification.classList.add("show");

    // Auto hide after 5 seconds
    this.notificationTimeout = setTimeout(() => {
      this.hide();
    }, 5000);
  }

  hide() {
    const notification = document.getElementById("notification");
    if (notification) {
      notification.classList.remove("show");
    }

    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
      this.notificationTimeout = null;
    }
  }

  showError(message) {
    this.show(message, "error");
  }

  showSuccess(message) {
    this.show(message, "success");
  }

  showWarning(message) {
    this.show(message, "warning");
  }

  showInfo(message) {
    this.show(message, "info");
  }
}
