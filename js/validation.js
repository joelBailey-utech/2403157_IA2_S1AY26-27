/**
 * validation.js
 * Handles the registration form on login.html:
 * intercepts the submit event, validates every field, shows errors
 * in place, saves the valid data to localStorage and opens ticket.html.
 */

const STORAGE_KEY = "codingConfTicket";
const MAX_AVATAR_BYTES = 500 * 1024;               // 500KB limit
const ALLOWED_TYPES = ["image/jpeg", "image/png"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // user@domain.com
const GITHUB_PATTERN = /^@[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;

const form = document.getElementById("registration-form");
const fields = {
  avatar: document.getElementById("avatar"),
  name: document.getElementById("full-name"),
  email: document.getElementById("email"),
  github: document.getElementById("github")
};
const errors = {
  avatar: document.getElementById("avatar-error"),
  name: document.getElementById("name-error"),
  email: document.getElementById("email-error"),
  github: document.getElementById("github-error")
};
const preview = document.getElementById("avatar-preview");
const dropzoneIcon = document.getElementById("dropzone-icon");
const dropzoneText = document.getElementById("dropzone-text");

/**
 * Show (or clear) an error message under a field.
 * @param {string} key - key of the field in `fields` / `errors`
 * @param {string} message - text to display; empty string clears the error
 */
function setError(key, message) {
  errors[key].textContent = message;
  if (message) {
    fields[key].setAttribute("aria-invalid", "true");
  } else {
    fields[key].removeAttribute("aria-invalid");
  }
}

/** Remove every error message. */
function clearErrors() {
  Object.keys(errors).forEach(function (key) {
    setError(key, "");
  });
}

/** Name is required and cannot be only spaces. */
function validateName(value) {
  return value.trim() !== "" ? "" : "Please enter your full name.";
}

/** Email must look like user@domain.com. */
function validateEmail(value) {
  return EMAIL_PATTERN.test(value.trim()) ? "" : "Please enter a valid email address.";
}

/** GitHub handle must start with @ followed by a valid username. */
function validateGithub(value) {
  return GITHUB_PATTERN.test(value.trim())
    ? ""
    : "Please enter a valid GitHub username starting with @.";
}

/** Avatar must exist, be JPEG/PNG and be under 500KB. */
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

/**
 * Read an image file as a data URL so it can be stored as text.
 * @param {File} file
 * @returns {Promise<string>}
 */
function readFileAsDataURL(file) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    reader.onload = function () { resolve(reader.result); };
    reader.onerror = function () { reject(new Error("Could not read the image.")); };
    reader.readAsDataURL(file);
  });
}

/** Build a ticket number such as #01609. */
function generateSerial() {
  const number = Math.floor(Math.random() * 99999) + 1;
  return "#" + String(number).padStart(5, "0");
}

/** Show a small preview of the chosen avatar inside the dropzone. */
fields.avatar.addEventListener("change", function () {
  const file = fields.avatar.files[0];
  const message = validateAvatar(file);
  setError("avatar", file ? message : "");

  if (file && !message) {
    readFileAsDataURL(file).then(function (dataUrl) {
      preview.src = dataUrl;
      preview.hidden = false;
      dropzoneIcon.hidden = true;
      dropzoneText.textContent = file.name;
    }).catch(function () {
      setError("avatar", "Could not read the image. Try another file.");
    });
  } else {
    preview.hidden = true;
    dropzoneIcon.hidden = false;
    dropzoneText.textContent = "Drag and drop or click to upload";
  }
});

/** Validate, save and redirect when the form is submitted. */
form.addEventListener("submit", async function (event) {
  event.preventDefault();
  clearErrors();

  const file = fields.avatar.files[0];
  const messages = {
    avatar: validateAvatar(file),
    name: validateName(fields.name.value),
    email: validateEmail(fields.email.value),
    github: validateGithub(fields.github.value)
  };

  // Display every error, then focus the first invalid field
  let firstInvalid = null;
  Object.keys(messages).forEach(function (key) {
    setError(key, messages[key]);
    if (messages[key] && !firstInvalid) {
      firstInvalid = fields[key];
    }
  });
  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  try {
    const avatarData = await readFileAsDataURL(file);
    const ticket = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      github: fields.github.value.trim(),
      avatar: avatarData,
      serial: generateSerial()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ticket));
    window.location.href = "ticket.html";
  } catch (error) {
    // Storage full or image unreadable
    setError("avatar", "Could not save your details. Try a smaller image.");
  }
});
