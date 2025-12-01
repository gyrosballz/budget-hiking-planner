document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    // Security: do NOT log passwords.
   // AI-recommended: avoid exposing sensitive credentials in logs (can be saved, viewed by extensions, or leaked).
    console.log('Login attempt:', { username: username });
    alert('Form submitted — username logged to console.');
  });
});
