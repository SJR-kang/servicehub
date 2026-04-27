// ========= auth.js =========
// Shared authentication helper functions

// Check if user is logged in
function isUserLoggedIn() {
  const user = localStorage.getItem('servicehub_user');
  return user ? JSON.parse(user) : null;
}

// Redirect to login if not authenticated
function requireAuth(redirectUrl = 'signin.html') {
  const user = localStorage.getItem('servicehub_user');
  if (!user) {
    window.location.href = redirectUrl;
    return false;
  }
  return true;
}

// Get current user
function getCurrentUser() {
  const userStr = localStorage.getItem('servicehub_user');
  return userStr ? JSON.parse(userStr) : null;
}

// Logout function
function logoutUser() {
  localStorage.removeItem('servicehub_user');
  localStorage.removeItem('serviceCart');
  localStorage.removeItem('servicehub_connections');
  window.location.href = 'index.html';
}

// Update UI based on login status (for pages with navbar)
function updateAuthUI() {
  const user = getCurrentUser();
  const authButtons = document.querySelector('.auth-buttons');
  const userGreeting = document.querySelector('.user-greeting');
  const greetingSpan = document.querySelector('#greetingName');
  
  if (user && user.name) {
    if (authButtons) authButtons.style.display = 'none';
    if (userGreeting) {
      userGreeting.style.display = 'flex';
      if (greetingSpan) greetingSpan.innerText = user.name;
    }
  } else {
    if (authButtons) authButtons.style.display = 'flex';
    if (userGreeting) userGreeting.style.display = 'none';
  }
}

// Export for global use
window.isUserLoggedIn = isUserLoggedIn;
window.requireAuth = requireAuth;
window.getCurrentUser = getCurrentUser;
window.logoutUser = logoutUser;
window.updateAuthUI = updateAuthUI;