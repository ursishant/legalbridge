import React, { useEffect, useState, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/genai';

const API_KEY = 'YOUR_API_KEY';

// Initialize GoogleGenerativeAI once
let genAIInstance;

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Helper to format chat history for Gemini API
  const formatHistory = (history) =>
    history.map(({ sender, text }) => ({
      role: sender === "user" ? "user" : "model",
      parts: [{ text }],
    }));

  // Initialize chat session
  useEffect(() => {
    if (!API_KEY) {
      console.error("API key missing.");
      setMessages([
        {
          sender: "bot",
          text:
            "Configuration Error: The API key is missing. Please configure your Gemini API key.",
        },
      ]);
      return;
    }

    const init = async () => {
      try {
        // Load chat history
        let history = [];
        try {
          history = JSON.parse(
            localStorage.getItem("legalbridge_chat_history") || "[]"
          );
        } catch (e) {
          console.warn("Corrupted chat history. Clearing it.");
          localStorage.removeItem("legalbridge_chat_history");
          history = [];
        }

        if (history.length === 0) {
          setMessages([
            {
              sender: "bot",
              text:
                "Hello! I'm LegalBridge India AI, your intelligent legal assistant. How may I assist you today?",
            },
          ]);
        } else {
          setMessages(history);
        }

        // Store history in ref for later use
        chatRef.current = { history: formatHistory(history) };
      } catch (err) {
        console.error("Failed to initialize Gemini", err);
        let errorMessage = "There was an error initializing the AI. ";
        if (err.message?.includes('API key')) {
          errorMessage += "The API key is invalid. Please ensure you are using a valid Google AI/Gemini API key.";
        } else if (err.message?.includes('quota')) {
          errorMessage += "The API quota has been exceeded. Please check your Google AI Studio dashboard.";
        } else {
          errorMessage += "Please check the browser console for detailed error information.";
        }
        setMessages([
          {
            sender: "bot",
            text: errorMessage,
          },
        ]);
      }
    };

    init();
  }, []);

  // Save chat history to localStorage on message update
  useEffect(() => {
    if (messages.length === 0) return;
    localStorage.setItem("legalbridge_chat_history", JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send user message and get AI response
  const sendMessage = async (text) => {
    if (!text.trim() || !chatRef.current) return;

    setLoading(true);
    const userMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": API_KEY
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${ADVOCATE_LEX_PROMPT}

Additional Instructions:
1. Keep responses concise and to the point, focusing on practical advice.
2. Limit responses to 2-3 paragraphs maximum.
3. Remove any asterisks (*) from the output and use clear language.
4. Use HTML-style bold for emphasis instead of markdown (e.g., <b>important text</b>).
5. Break longer responses into bullet points for readability.
6. Always start with a brief, direct answer before any explanation.

User: ${text}`
                  }
                ]
              }
            ]
          })
        }
      );

      if (!response.ok) {
        console.error('API Response:', await response.text());
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);
      
      if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
        throw new Error('Invalid response format from API');
      }
      
      let botReply = data.candidates[0].content.parts[0].text;

      // Add disclaimer only for the first message
      if (messages.length <= 1) {
        botReply = "I am LegalBridge India AI, your intelligent legal assistant. My purpose is to provide legal information and guidance based on my training data. I am not a human lawyer, and our interaction does not create an advocate-client relationship. The information I provide should not be considered as legal advice. You should always consult with a qualified human lawyer for advice on your specific situation.\n\n" + botReply;
      }

      // Clean up the response
      botReply = botReply
        .replace(/\*\*/g, "") // Remove markdown bold
        .replace(/\[/g, "<b>") // Replace markdown with HTML bold
        .replace(/\]/g, "</b>")
        .trim();

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      console.error("Error sending message:", err);
      let errorMessage = "I apologize, but I encountered an issue. ";
      
      if (err.message.includes('API request failed')) {
        errorMessage += "There seems to be a problem connecting to the service. Please try again in a moment.";
      } else if (err.message.includes('Invalid response format')) {
        errorMessage += "I received an unexpected response format. Our team has been notified.";
      } else {
        errorMessage += "An unexpected error occurred. Please try again.";
      }
      
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");
    await sendMessage(trimmed);
  };

  const quickQuestions = [
    {
      text: "Property Dispute",
      prompt:
        "I have a property dispute with my neighbour in Delhi about a boundary wall. What are the initial legal steps I should consider under Indian law?",
    },
    {
      text: "Consumer Complaint",
      prompt:
        "I purchased a defective electronic item online and the seller is refusing a refund. How can I file a complaint with the consumer forum in India?",
    },
    {
      text: "Employment Issue",
      prompt:
        "My employer in Mumbai has wrongfully terminated my contract without notice. What are my legal rights?",
    },
    {
      text: "Filing for Divorce",
      prompt:
        "I need to understand the basic procedure for filing a mutual consent divorce in the family courts in Bangalore.",
    },
  ];

  return (
    <div className="chat-page" style={{ 
      padding: "2rem",
      background: "linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)",
      minHeight: "100vh"
    }}>
      <h2 style={{ 
        textAlign: "center", 
        marginBottom: "2rem",
        color: "#2c3e50",
        fontSize: "2.2rem",
        fontWeight: "600",
        textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
      }}>
        LegalBridge India AI
      </h2>

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          height: "75vh",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          border: "1px solid rgba(0,0,0,0.1)",
          overflow: "hidden"
        }}
      >
        {/* Chat messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                maxWidth: "70%",
                position: "relative",
                marginBottom: "16px"
              }}
            >
              <div
                style={{
                  fontSize: "0.85rem",
                  color: msg.sender === "user" ? "#4a5568" : "#2d3748",
                  marginLeft: msg.sender === "user" ? "auto" : "12px",
                  marginBottom: "4px",
                  fontWeight: "500"
                }}
              >
                {msg.sender === "user" ? "You" : "LegalBridge India AI"}
              </div>
              <div
                style={{
                  backgroundColor: msg.sender === "user" ? "#3182ce" : "#f7fafc",
                  color: msg.sender === "user" ? "white" : "#1a202c",
                  padding: "12px 16px",
                  borderRadius: msg.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  maxWidth: "100%",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  lineHeight: "1.5",
                  fontSize: "0.95rem",
                  border: msg.sender === "user" ? "none" : "1px solid #e2e8f0"
                }}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
            </div>
          ))}

          {loading && (
            <div
              style={{
                alignSelf: "flex-start",
                backgroundColor: "#f7fafc",
                padding: "12px 16px",
                borderRadius: "18px",
                fontStyle: "italic",
                color: "#4a5568",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                marginBottom: "16px"
              }}
            >
              <div style={{
                display: "flex",
                gap: "4px",
                alignItems: "center"
              }}>
                <span style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#3182ce",
                  animation: "pulse 1s infinite",
                  opacity: "0.6"
                }}></span>
                <span style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#3182ce",
                  animation: "pulse 1s infinite",
                  animationDelay: "0.2s",
                  opacity: "0.6"
                }}></span>
                <span style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#3182ce",
                  animation: "pulse 1s infinite",
                  animationDelay: "0.4s",
                  opacity: "0.6"
                }}></span>
              </div>
              <span>LegalBridge India AI is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick questions */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
          }}
        >
          <p style={{ 
            margin: 0, 
            marginBottom: "0.75rem", 
            color: "#4a5568",
            fontSize: "0.9rem",
            fontWeight: "500"
          }}>
            Common Legal Queries:
          </p>
          <div style={{ 
            display: "flex", 
            flexWrap: "wrap", 
            gap: "0.75rem"
          }}>
            {quickQuestions.map(({ text, prompt }) => (
              <button
                key={text}
                disabled={loading}
                onClick={() => sendMessage(prompt)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "0.9rem",
                  color: "#2d3748",
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  fontWeight: "500",
                  opacity: loading ? "0.7" : "1",
                  ':hover': {
                    backgroundColor: "#f7fafc",
                    borderColor: "#cbd5e0"
                  }
                }}
              >
                {text}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: "0.75rem",
            padding: "1rem 1.5rem",
            borderTop: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
          }}
        >
          <input
            type="text"
            placeholder={
              loading
                ? "LegalBridge India AI is thinking..."
                : "Describe your legal concern..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              fontSize: "0.95rem",
              color: "#2d3748",
              outline: "none",
              transition: "all 0.2s ease",
              backgroundColor: "#f8fafc",
              ':focus': {
                borderColor: "#3182ce",
                boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.15)"
              }
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#3182ce",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "0 1.5rem",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "0.95rem",
              fontWeight: "500",
              height: "42px",
              display: "flex",
              alignItems: "center",
              transition: "all 0.2s ease",
              opacity: loading ? "0.7" : "1",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              ':hover': {
                backgroundColor: "#2c5282"
              }
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
