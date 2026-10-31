

/**
 * ticket.js  (runs on ticket.html)
 * Reads the saved JSON from localStorage and fills in the ticket.
 * If there is no saved data, the visitor is sent back to login.html.
 */

var STORAGE_KEY = "codingConfTicket";

// Get the saved ticket object, or null if nothing is saved
function loadTicket() {
  var saved = localStorage.getItem(STORAGE_KEY);

  if (saved === null) {
    return null;
  }

  var data = JSON.parse(saved); // JSON text -> object

  if (data.name && data.email && data.github && data.avatar) {
    return data;
  }
  return null;
}

// Put the saved values into the page
function renderTicket(data) {
  document.getElementById("ticket-name").textContent = data.name;
  document.getElementById("ticket-fullname").textContent = data.name;
  document.getElementById("ticket-email").textContent = data.email;
  document.getElementById("ticket-serial").textContent = data.serial;

  var avatar = document.getElementById("ticket-avatar");
  avatar.src = data.avatar;
  avatar.alt = "Avatar of " + data.name;

  var github = document.getElementById("ticket-github");
  github.textContent = data.github;
  github.href = "https://github.com/" + data.github.slice(1); // drop the @
}

var ticketData = loadTicket();

if (ticketData !== null) {
  renderTicket(ticketData);
} else {
  // Visited without registering: go back to the form
  window.location.href = "login.html";
}
