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

/*
 * ticket.js
 * Reads the saved registration information from localStorage
 * and displays the information on ticket.html.
 */

const STORAGE_KEY = "codingConfTicket";


/* Load the saved registration information */

function loadTicket() {

  try {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === null) {
      return null;
    }

    const data = JSON.parse(saved);

    if (
      data &&
      data.name &&
      data.email &&
      data.github &&
      data.avatar
    ) {

      return data;

    }

    return null;

  } catch (error) {

    return null;

  }

}


/* Display the registration information on the ticket */

function renderTicket(data) {

  document.getElementById("ticket-name").textContent =
    data.name;

  document.getElementById("ticket-email").textContent =
    data.email;

  document.getElementById("ticket-fullname").textContent =
    data.name;

  document.getElementById("ticket-serial").textContent =
    data.serial || "#00001";


  // Display the avatar

  const avatar = document.getElementById("ticket-avatar");

  avatar.src = data.avatar;
  avatar.alt = "Avatar of " + data.name;


  // Display the GitHub username

  const github = document.getElementById("ticket-github");

  github.textContent = data.github;

  github.href =
    "https://github.com/" + data.github.replace(/^@/, "");

}


/* Check whether registration information exists */

const ticketData = loadTicket();

if (ticketData !== null) {

  renderTicket(ticketData);

} else {

  window.location.replace("index.html");

}
