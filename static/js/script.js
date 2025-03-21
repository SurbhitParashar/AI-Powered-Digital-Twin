const users = {
    "admin@example.com": "admin123",
    "user@example.com": "password123",
    "guest@example.com": "guestpass"
};

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
    // Get form elements
    const emailInput = document.querySelector(".email");
    const passwordInput = document.querySelector(".password");
    const submitButton = document.querySelector("button");

    submitButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent form submission

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Within the submit event listener
if (users[email] && users[email] === password) {
    alert("Login successful! Welcome, " + email);
    window.location.href = '/admin'; // Correct redirect URL
} else {
    alert("Invalid email or password. Please try again.");
}
    });
})