/**
 * ticket.js
 * Runs on ticket.html: reads the saved registration data from
 * localStorage and fills in the ticket. If no valid data exists the
 * visitor is sent back to index.html.
 */

const STORAGE_KEY = "codingConfTicket";

/**
 * Load the saved ticket object.
 * @returns {object|null} the ticket data, or null if missing/invalid
 */
function loadTicket() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return null;
    }
    const data = JSON.parse(saved);
    const complete = data && data.name && data.email && data.github && data.avatar;
    return complete ? data : null;
  } catch (error) {
    return null; // corrupted JSON or storage blocked
  }
}

/** Put the saved values into the page. */
function renderTicket(data) {
  document.getElementById("ticket-name").textContent = data.name;
  document.getElementById("ticket-email").textContent = data.email;
  document.getElementById("ticket-fullname").textContent = data.name;
  document.getElementById("ticket-serial").textContent = data.serial || "#00001";

  const avatar = document.getElementById("ticket-avatar");
  avatar.src = data.avatar;
  avatar.alt = "Avatar of " + data.name;

  const github = document.getElementById("ticket-github");
  github.textContent = data.github;
  github.href = "https://github.com/" + data.github.replace(/^@/, "");
}

const ticketData = loadTicket();

if (ticketData) {
  renderTicket(ticketData);
} else {
  // Direct visit without registering: go back to the landing page
  window.location.replace("index.html");
}
