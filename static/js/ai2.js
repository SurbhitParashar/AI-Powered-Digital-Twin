document.addEventListener("DOMContentLoaded", function() {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;

    // 🌙 Dark Mode Toggle
    darkModeToggle.addEventListener("click", function() {
        body.classList.toggle("dark-mode");
    });

    // 🔎 Search Emails
    const searchInput = document.getElementById("search");
    const messages = document.querySelectorAll(".message");

    searchInput.addEventListener("input", function() {
        const searchTerm = searchInput.value.toLowerCase();
        messages.forEach(message => {
            const text = message.textContent.toLowerCase();
            message.style.display = text.includes(searchTerm) ? "block" : "none";
        });
    });

    // 🗑 Bulk Delete Messages
    const bulkDeleteBtn = document.getElementById("bulkDelete");
    bulkDeleteBtn.addEventListener("click", function() {
        const selectedMessages = document.querySelectorAll(".select-message:checked");
        selectedMessages.forEach(message => {
            message.closest(".message").remove();
        });
    });

    // 📧 Auto Email System (Demo with Predefined Emails)
    const emailList = [
        { sender: "Alice", message: "Dear [Recipient's Name],\n\nThis is to confirm our scheduled meeting on [Date] at [Time]. We'll discuss [Agenda/Topics]. Please let me know if any changes are needed.\n\nLooking forward to it." },
        { sender: "Monika", message: "Meeting at 12 AM..." },
        { sender: "Vic Steward", message: "Join our new tech group..." },
        { sender: "Shalu Jangid", message: "Join our new data analyst group..." },
        { sender: "Shehnaz Khan", message: "Meeting at 9 AM..." }
    ];

    const messagesContainer = document.querySelector(".message-list");
    const emailBody = document.getElementById("emailBody");

    messagesContainer.addEventListener("click", function(event) {
        const messageElement = event.target.closest(".message");
        if (messageElement) {
            emailBody.value = messageElement.dataset.message || "";
        }
    });

    // 🤖 AI Smart Reply
    const smartReplyBtn = document.getElementById("smartReply");
    smartReplyBtn.addEventListener("click", function() {
        const responses = [
            "Dear [Recipient's Name],\n\nThis is to confirm our scheduled meeting on [Date] at [Time]. We'll discuss [Agenda/Topics]. Please let me know if any changes are needed.\n\nLooking forward to it.",
            "Hello [Recipient's Name],\n\nThank you for reaching out. I appreciate your message and will review the details shortly. I'll get back to you as soon as possible.\n\nBest regards,",
            "Hi [Recipient's Name],\n\nI hope you're doing well. Just a quick reminder about our upcoming deadline on [Date]. Let me know if you need any assistance.\n\nBest,"
        ];
        emailBody.value = responses[Math.floor(Math.random() * responses.length)];
    });

    // 📄 AI Summarization
    const summarizeEmailBtn = document.getElementById("summarizeEmail");
    summarizeEmailBtn.addEventListener("click", function() {
        const content = emailBody.value;
        if (content.length > 50) {
            emailBody.value = content.substring(0, 50) + "... (summary)";
        }
    });

    // 😊 AI Sentiment Analysis
    const analyzeSentimentBtn = document.getElementById("analyzeSentiment");
    analyzeSentimentBtn.addEventListener("click", function() {
        const content = emailBody.value.toLowerCase();
        let sentiment = "🙂 Neutral";

        if (content.includes("thank you") || content.includes("great") || content.includes("love")) {
            sentiment = "😊 Positive";
        } else if (content.includes("sad") || content.includes("bad") || content.includes("disappointed")) {
            sentiment = "😔 Negative";
        }
        alert("Sentiment Analysis: " + sentiment);
    });

    // 🚀 Send Message (Simulated)
    const sendMessageBtn = document.getElementById("sendMessage");
    sendMessageBtn.addEventListener("click", function() {
        alert("Email Sent Successfully!");
    });

    // 📊 Update Email Stats
    function updateEmailStats() {
        document.getElementById("totalEmails").textContent = messages.length;
        document.getElementById("unreadEmails").textContent = document.querySelectorAll(".message.unread").length;
    }
    updateEmailStats();
});
