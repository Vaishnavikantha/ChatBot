document.addEventListener("DOMContentLoaded", () => {
    const chatBotContainer = document.getElementById("chatbot-container");
    const closeBtn = document.getElementById("close-btn");
    const sendBtn = document.getElementById("send-btn");
    const chatBotInput = document.getElementById("chatbot-input");
    const chatBotMessages = document.getElementById("chatbot-messages");
    const chatBotIcon = document.getElementById("chatbot-icon");

    chatBotIcon.addEventListener("click",()=>{
        chatBotContainer.classList.remove("hidden");
        chatBotIcon.style.display = "none";
    })

    closeBtn.addEventListener("click",()=>{
        chatBotContainer.classList.add("hidden");
        chatBotIcon.style.display = "flex";
    })

    sendBtn.addEventListener("click",sendMessage);

    chatBotInput.addEventListener("keypress",(e)=>{
        if(e.key==="Enter") {
            sendMessage();
        }
    })
})

function sendMessage() {
    const userMessage = document.getElementById("chatbot-input").value.trim();
    if(userMessage) {
        appendMessage("user",userMessage);
        document.getElementById("chatbot-input").value.trim();
        getBotResponse(userMessage);
        document.getElementById("chatbot-input").value = "";
    }
}

function appendMessage(sender, message) {
    const messageContainer = document.getElementById("chatbot-messages");
    const messageElement = document.createElement("div");
    // console.log(sender);
    messageElement.classList.add("message", sender);
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

async function getBotResponse(userMessage) {
    // const API_KEY = "AIzaSyBRM6SGizOtpdO_SFebd6JQiqu7ntI3pOs";
    // const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{text: userMessage}],
                    },
                ],
            }),
        });

        const data = await response.json();

        if(!data.candidates || !data.candidates.length) {
            throw new Error("No response from Gemini API");
        }

        const botMessage = data.candidates[0].content.parts[0].text;
        appendMessage("bot",botMessage);
    } catch(error) {
        console.log("Error: "+error);
        appendMessage(
            "bot",
            "Sorry, I'm having trouble responding. Please try again."
        );
    }
}