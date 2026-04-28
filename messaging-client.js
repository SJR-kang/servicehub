(function () {
  function formatRelativeTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    if (!timestamp || Number.isNaN(date.getTime())) return "";
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  }

  function getInitial(name, fallback = "?") {
    const value = String(name || "").trim();
    return value ? value.charAt(0).toUpperCase() : fallback;
  }

  async function listConversationsSafe() {
    if (!window.ServiceHubAPI || !ServiceHubAPI.getToken()) return [];
    try {
      const conversations = await ServiceHubAPI.listConversations();
      return Array.isArray(conversations) ? conversations : [];
    } catch (_) {
      return [];
    }
  }

  async function getUnreadCount() {
    const conversations = await listConversationsSafe();
    return conversations.reduce((sum, item) => sum + Number(item.unreadCount || 0), 0);
  }

  async function renderUnreadBadge(elementId) {
    const badge = document.getElementById(elementId);
    if (!badge) return 0;
    const unreadCount = await getUnreadCount();
    badge.innerText = unreadCount;
    badge.style.display = unreadCount > 0 ? "flex" : "none";
    return unreadCount;
  }

  window.ServiceHubMessaging = {
    formatRelativeTime,
    getInitial,
    getUnreadCount,
    listConversationsSafe,
    renderUnreadBadge,
  };
})();
