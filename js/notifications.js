if ("Notification" in window) {
  Notification.requestPermission();
}

function notifyBreaking(title) {
  new Notification("🚨 Cyber Alert", {
    body: title,
    icon: "assets/icons/icon-192.png"
  });
}
