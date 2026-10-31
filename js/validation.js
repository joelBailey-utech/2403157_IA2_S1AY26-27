/**
 * validation.js
 * Handles the registration form on login.html:
 * intercepts the submit event, validates every field, shows errors
 * in place, saves the valid data to localStorage and opens ticket.html.
 */

/*
 * validation.js
 * Handles the registration form on login.html.
 * Validates every field, displays error messages,
 * saves valid information and opens ticket.html.
 */

const STORAGE_KEY = "codingConfTicket";
const MAX_AVATAR_BYTES = 500 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GITHUB_PATTERN = /^@[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;


// Get the registration form

const form = document.getElementById("registration-form");


// Get the form fields

const fields = {
  avatar: document.getElementById("avatar"),
  name: document.getElementById("full-name"),
  email: document.getElementById("email"),
  github: document.getElementById("github")
};


// Get the error message areas

const errors = {
  avatar: document.getElementById("avatar-error"),
  name: document.getElementById("name-error"),
  email: document.getElementById("email-error"),
  github: document.getElementById("github-error")
};


// Get avatar preview elements

const preview = document.getElementById("avatar-preview");
const dropzoneIcon = document.getElementById("dropzone-icon");
const dropzoneText = document.getElementById("dropzone-text");


// Display an error message under a field

function setError(key, message) {

  errors[key].textContent = message;

  if (message !== "") {

    fields[key].setAttribute("aria-invalid", "true");

  } else {

    fields[key].removeAttribute("aria-invalid");

  }

}


// Clear all error messages

function clearErrors() {

  setError("avatar", "");
  setError("name", "");
  setError("email", "");
  setError("github", "");

}


// Validate the user's name

function validateName(value) {

  if (value.trim() === "") {

    return "Please enter your full name.";

  }

  return "";

}


// Validate the email address

function validateEmail(value) {

  if (!EMAIL_PATTERN.test(value.trim())) {

    return "Please enter a valid email address.";

  }

  return "";

}


// Validate the GitHub username

function validateGithub(value) {

  if (!GITHUB_PATTERN.test(value.trim())) {

    return "Please enter a valid GitHub username starting with @.";

  }

  return "";

}


// Validate the uploaded avatar

function validateAvatar(file) {

  if (!file) {

    return "Please upload an avatar photo.";

  }

  if (!ALLOWED_TYPES.includes(file.type)) {

    return "Invalid file type. Please upload a JPG or PNG image.";

  }

  if (file.size > MAX_AVATAR_BYTES) {

    return "File too large. Please upload a photo under 500KB.";

  }

  return "";

}


// Read the image using FileReader and a callback function

function readFileAsDataURL(file, callback) {

  const reader = new FileReader();

  reader.onload = function () {

    callback(reader.result);

  };

  reader.onerror = function () {

    setError("avatar", "Could not read the image. Try another file.");

  };

  reader.readAsDataURL(file);

}


// Generate a ticket number

function generateSerial() {

  const number = Math.floor(Math.random() * 99999) + 1;

  return "#" + String(number).padStart(5, "0");

}


// Display a preview when an avatar is selected

fields.avatar.addEventListener("change", function () {

  const file = fields.avatar.files[0];

  const message = validateAvatar(file);

  setError("avatar", file ? message : "");

  if (file && message === "") {

    readFileAsDataURL(file, function (dataUrl) {

      preview.src = dataUrl;
      preview.hidden = false;

      dropzoneIcon.hidden = true;
      dropzoneText.textContent = file.name;

    });

  } else {

    preview.hidden = true;
    dropzoneIcon.hidden = false;

    dropzoneText.textContent = "Drag and drop or click to upload";

  }

});


// Validate and submit the registration form

form.addEventListener("submit", function (event) {

  event.preventDefault();

  clearErrors();

  const file = fields.avatar.files[0];


  // Check every field

  const messages = {

    avatar: validateAvatar(file),
    name: validateName(fields.name.value),
    email: validateEmail(fields.email.value),
    github: validateGithub(fields.github.value)

  };


  // Display all error messages

  let firstInvalid = null;

  for (let key in messages) {

    setError(key, messages[key]);

    if (messages[key] !== "" && firstInvalid === null) {

      firstInvalid = fields[key];

    }

  }


  // Stop if any field is invalid

  if (firstInvalid !== null) {

    firstInvalid.focus();

    return;

  }


  // Read the avatar and save the registration details

  readFileAsDataURL(file, function (avatarData) {

    const ticket = {

      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      github: fields.github.value.trim(),
      avatar: avatarData,
      serial: generateSerial()

    };


    // Save the information and open the ticket page

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(ticket)
      );

      window.location.href = "ticket.html";

    } catch (error) {

      setError(
        "avatar",
        "Could not save your details. Try a smaller image."
      );

    }

  });

});
