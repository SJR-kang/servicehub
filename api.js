(function () {
  const API_BASE = "/.netlify/functions";
  const TOKEN_KEY = "servicehub_token";

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  async function request(path, options = {}) {
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(`${API_BASE}/${path}`, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Request failed");
    return data;
  }

  window.ServiceHubAPI = {
    getToken,
    setToken,
    clearToken,
    signup: (payload) => request("auth-signup", { method: "POST", body: JSON.stringify(payload) }),
    signin: (payload) => request("auth-signin", { method: "POST", body: JSON.stringify(payload) }),
    listProviders: () => request("providers-list"),
    getProviderDetails: (providerId) => request(`provider-details?id=${encodeURIComponent(providerId)}`),
    getProviderProfile: () => request("provider-profile"),
    updateProviderProfile: (payload) =>
      request("provider-profile", { method: "PATCH", body: JSON.stringify(payload) }),
    listConversations: () => request("messages-conversations-list"),
    getConversationThread: (conversationId) =>
      request(`messages-thread?conversationId=${encodeURIComponent(conversationId)}`),
    startConversation: (payload) =>
      request("messages-start", { method: "POST", body: JSON.stringify(payload) }),
    sendMessage: (payload) =>
      request("messages-send", { method: "POST", body: JSON.stringify(payload) }),
    createRequest: (payload) => request("requests-create", { method: "POST", body: JSON.stringify(payload) }),
    listRequests: () => request("requests-list"),
    updateRequestStatus: (payload) =>
      request("requests-update-status", { method: "PATCH", body: JSON.stringify(payload) }),
  };
})();

