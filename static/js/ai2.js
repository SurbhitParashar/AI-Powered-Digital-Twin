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

    // 🤖 AI Smart Reply (Simple Response)
    const smartReplyBtn = document.getElementById("smartReply");
    const emailBody = document.getElementById("emailBody");

    smartReplyBtn.addEventListener("click", function() {
        const responses = [
            "Sounds great! Let's do it.",
            "I'll get back to you shortly.",
            "Thanks for the update!",
            "Noted! I'll follow up soon."
        ];
        emailBody.value = responses[Math.floor(Math.random() * responses.length)];
    });

    // 📄 AI Summarization (Basic)
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

    // ⚙ AI Auto-Reply System
    const setAutoReplyBtn = document.getElementById("setAutoReply");

    setAutoReplyBtn.addEventListener("click", function() {
        const autoReplyMsg = prompt("Enter your Auto-Reply message:");
        if (autoReplyMsg) {
            localStorage.setItem("autoReply", autoReplyMsg);
            alert("Auto-Reply Set!");
        }
    });

    // 🎤 Voice Dictation for Emails
    const startVoiceBtn = document.getElementById("startVoice");

    startVoiceBtn.addEventListener("click", function() {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";

        recognition.start();

        recognition.onresult = function(event) {
            emailBody.value += " " + event.results[0][0].transcript;
        };

        recognition.onerror = function(event) {
            alert("Error with speech recognition: " + event.error);
        };
    });

    // 🚀 Send Message (Simulated)
    const sendMessageBtn = document.getElementById("sendMessage");

    sendMessageBtn.addEventListener("click", function() {
        alert("Email Sent Successfully!");
    });
});
