// ====== SET THIS: the email address that should receive sign-ups ======
var RECEIVER_EMAIL = 'tetgatluak@gmail.com';
// =====================================================================

// Pre-select the plan when a plan button is clicked
document.querySelectorAll('[data-plan]').forEach(function (link) {
  link.addEventListener('click', function () {
    var radio = document.querySelector('input[name="plan"][value="' + link.dataset.plan + '"]');
    if (radio) radio.checked = true;
  });
});

var form = document.getElementById('signup-form');
var message = document.getElementById('form-message');
var submitBtn = form.querySelector('button[type="submit"]');

function showError(text, field) {
  message.className = 'form-message';
  message.textContent = text;
  if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
}

form.addEventListener('submit', function (event) {
  event.preventDefault();
  message.className = 'form-message';
  message.textContent = '';

  var name = form.elements.name;
  var email = form.elements.email;
  [name, email].forEach(function (f) { f.removeAttribute('aria-invalid'); });

  if (!name.value.trim()) return showError('Please enter your full name.', name);
  if (!email.value.trim() || !email.checkValidity()) return showError('Please enter a valid email address.', email);

  if (RECEIVER_EMAIL.indexOf('tetgatluak@gmail.com') === 0) {
    console.error('Set RECEIVER_EMAIL at the top of script.js to your own email address.');
    return showError('Sign-up email is not set up yet. Please try again later.');
  }

  var data = Object.fromEntries(new FormData(form).entries());
  data._subject = 'New ' + data.plan.toUpperCase() + ' sign-up: ' + data.name;
  data._template = 'table';

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  fetch('https://formsubmit.co/ajax/' + encodeURIComponent(RECEIVER_EMAIL), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(function (res) { return res.json().then(function (j) { return { ok: res.ok, body: j }; }); })
    .then(function (r) {
      if (!r.ok || String(r.body.success) === 'false') throw new Error(r.body.message || 'Send failed');
      form.reset();
      message.className = 'form-message ok';
      message.textContent = 'Thank you! Your sign-up has been received. We will email you soon.';
    })
    .catch(function (err) {
      console.error(err);
      showError('Sorry, we could not send your sign-up. Please check your connection and try again.');
    })
    .then(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit sign-up';
    });
});