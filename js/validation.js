/**
 * validation.js  (runs on login.html)
 * Validates the registration form, saves the data to localStorage
 * as JSON, then opens ticket.html.
 *
 * Course content used: Weeks 1-8 (variables, objects, arrays, loops,
 * functions, DOM, event listeners, localStorage, JSON).
 */

var STORAGE_KEY = "codingConfTicket";
var MAX_AVATAR_BYTES = 500 * 1024; // 500KB limit
var ALLOWED_TYPES = ["image/jpeg", "image/png"];
var GITHUB_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-";
var FIELD_KEYS = ["avatar", "name", "email", "github"];

var form = document.getElementById("registration-form");
var fields = {
  avatar: document.getElementById("avatar"),
  name: document.getElementById("full-name"),
  email: document.getElementById("email"),
  github: document.getElementById("github")
};
var errors = {
  avatar: document.getElementById("avatar-error"),
  name: document.getElementById("name-error"),
  email: document.getElementById("email-error"),
  github: document.getElementById("github-error")
};
var preview = document.getElementById("avatar-preview");
var dropzoneIcon = document.getElementById("dropzone-icon");
var dropzoneText = document.getElementById("dropzone-text");


/* ---------- Error helpers ---------- */

function setError(key, message) {
  errors[key].textContent = message;
  if (message !== "") {
    fields[key].setAttribute("aria-invalid", "true");
  } else {
    fields[key].removeAttribute("aria-invalid");
  }
}

function clearErrors() {
  for (var i = 0; i < FIELD_KEYS.length; i++) {
    setError(FIELD_KEYS[i], "");
  }
}


/* ---------- Validation (return "" if OK, or an error message) ---------- */

function validateName(value) {
  if (value.trim() === "") {
    return "Please enter your full name.";
  }
  return "";
}

// Email: one @, text before it, and a dot with text after the @
function validateEmail(value) {
  var message = "Please enter a valid email address.";
  var email = value.trim();
  var atPos = email.indexOf("@");
  var dotPos = email.lastIndexOf(".");

  if (email === "" || email.indexOf(" ") !== -1) {
    return message;
  }
  if (atPos < 1 || email.indexOf("@", atPos + 1) !== -1) {
    return message;
  }
  if (dotPos < atPos + 2 || dotPos === email.length - 1) {
    return message;
  }
  return "";
}

// GitHub: starts with @, then 1-39 letters, numbers or hyphens
function validateGithub(value) {
  var message = "Please enter a valid GitHub username starting with @.";
  var handle = value.trim();

  if (handle.charAt(0) !== "@" || handle.length < 2 || handle.length > 40) {
    return message;
  }
  if (handle.charAt(1) === "-") {
    return message;
  }
  for (var i = 1; i < handle.length; i++) {
    if (GITHUB_CHARS.indexOf(handle.charAt(i)) === -1) {
      return message;
    }
  }
  return "";
}

// Avatar: must exist, be JPG/PNG and be under 500KB
function validateAvatar(file) {
  if (!file) {
    return "Please upload an avatar photo.";
  }
  if (ALLOWED_TYPES.indexOf(file.type) === -1) {
    return "Invalid file type. Please upload a JPG or PNG image.";
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return "File too large. Please upload a photo under 500KB.";
  }
  return "";
}


/* ---------- Ticket helpers ---------- */

// Build a ticket number such as #01609
function generateSerial() {
  var number = Math.floor(Math.random() * 99999) + 1;
  var text = String(number);
  while (text.length < 5) {
    text = "0" + text;
  }
  return "#" + text;
}

// Save the ticket object as JSON text, then go to the ticket page
function saveTicket(avatarData) {
  var ticket = {
    name: fields.name.value.trim(),
    email: fields.email.value.trim(),
    github: fields.github.value.trim(),
    avatar: avatarData,
    serial: generateSerial()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(ticket));
  window.location.href = "ticket.html";
}


/* ---------- Event listeners ---------- */

// Preview the chosen avatar inside the dropzone
fields.avatar.addEventListener("change", function () {
  var file = fields.avatar.files[0];
  var message = validateAvatar(file);

  if (file) {
    setError("avatar", message);
  } else {
    setError("avatar", "");
  }

  if (file && message === "") {
    var reader = new FileReader();
    reader.addEventListener("load", function () {
      preview.src = reader.result;
      preview.hidden = false;
      dropzoneIcon.hidden = true;
      dropzoneText.textContent = file.name;
    });
    reader.readAsDataURL(file);
  } else {
    preview.hidden = true;
    dropzoneIcon.hidden = false;
    dropzoneText.textContent = "Drag and drop or click to upload";
  }
});

// Validate, save and redirect on submit
form.addEventListener("submit", function (event) {
  event.preventDefault();
  clearErrors();

  var file = fields.avatar.files[0];
  var messages = {
    avatar: validateAvatar(file),
    name: validateName(fields.name.value),
    email: validateEmail(fields.email.value),
    github: validateGithub(fields.github.value)
  };

  // Show every error, then focus the first invalid field
  var firstInvalid = null;
  for (var i = 0; i < FIELD_KEYS.length; i++) {
    var key = FIELD_KEYS[i];
    setError(key, messages[key]);
    if (messages[key] !== "" && firstInvalid === null) {
      firstInvalid = fields[key];
    }
  }
  if (firstInvalid !== null) {
    firstInvalid.focus();
    return;
  }

  // Valid: turn the image into text (data URL), then save and redirect
  var reader = new FileReader();
  reader.addEventListener("load", function () {
    saveTicket(reader.result);
  });
  reader.addEventListener("error", function () {
    setError("avatar", "Could not read the image. Try another file.");
  });
  reader.readAsDataURL(file);
});
