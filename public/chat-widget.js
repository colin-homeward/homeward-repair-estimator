/**
 * Homeward Repair Estimator Chat Widget
 * Embeddable chat widget for repair estimation assistance
 */

class HomewardRepairChatWidget {
    constructor(options = {}) {
        this.apiEndpoint = options.apiEndpoint || '/api/chat-fixed';
        this.isOpen = false;
        this.messages = [];
        this.isLoading = false;
        
        // Widget configuration
        this.config = {
            position: options.position || 'bottom-right',
            theme: options.theme || 'blue',
            companyName: options.companyName || 'Homeward Repair Estimator',
            welcomeMessage: options.welcomeMessage || 'Hi! I can help you estimate repair costs for your home. What needs fixing?',
            ...options
        };
        
        this.init();
    }

    init() {
        this.createStyles();
        this.createWidget();
        this.attachEventListeners();
        this.addWelcomeMessage();
    }

    createStyles() {
        const styles = `
            .homeward-chat-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
            }

                    .homeward-chat-button {
                        height: 50px;
                        padding: 0 20px;
                        border-radius: 25px;
                        background: #2D8C8C;
                        color: white;
                        border: none;
                        cursor: pointer;
                        box-shadow: 0 4px 20px rgba(45, 140, 140, 0.3);
                        transition: all 0.3s ease;
                        font-size: 14px;
                        font-weight: 500;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        font-family: 'Montserrat', sans-serif;
                    }

            .homeward-chat-button:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 25px rgba(45, 140, 140, 0.5);
                background: #247a7a;
            }

            .homeward-chat-container {
                display: none;
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 380px;
                height: 600px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
                flex-direction: column;
                overflow: hidden;
                border: 1px solid #e1e5e9;
            }

                    .homeward-chat-header {
                        padding: 20px;
                        background: #2D8C8C;
                        color: white;
                        font-weight: 600;
                        font-size: 16px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }

            .homeward-chat-title {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .homeward-chat-close {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: background-color 0.2s;
            }

            .homeward-chat-close:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }

            .homeward-chat-messages {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                background: #f8fafc;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .homeward-message {
                max-width: 85%;
                padding: 12px 16px;
                border-radius: 18px;
                word-wrap: break-word;
                line-height: 1.4;
                animation: messageSlide 0.3s ease-out;
            }

            @keyframes messageSlide {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

                    .homeward-user-message {
                        background: #2D8C8C;
                        color: white;
                        margin-left: auto;
                        border-bottom-right-radius: 4px;
                    }

            .homeward-bot-message {
                background: white;
                border: 1px solid #e1e5e9;
                color: #2d3748;
                border-bottom-left-radius: 4px;
            }

            .homeward-loading-message {
                background: #f1f5f9;
                color: #64748b;
                font-style: italic;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .homeward-typing-indicator {
                display: flex;
                gap: 4px;
            }

            .homeward-typing-dot {
                width: 6px;
                height: 6px;
                background: #64748b;
                border-radius: 50%;
                animation: typingDot 1.4s infinite ease-in-out;
            }

            .homeward-typing-dot:nth-child(1) { animation-delay: -0.32s; }
            .homeward-typing-dot:nth-child(2) { animation-delay: -0.16s; }

            @keyframes typingDot {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
            }

            .homeward-chat-input-container {
                padding: 20px;
                background: white;
                border-top: 1px solid #e1e5e9;
            }

            .homeward-chat-input {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #e1e5e9;
                border-radius: 24px;
                outline: none;
                font-size: 14px;
                transition: border-color 0.2s;
                box-sizing: border-box;
            }

            .homeward-chat-input:focus {
                border-color: #2D8C8C;
            }

            .homeward-chat-input::placeholder {
                color: #a0aec0;
            }

            .homeward-error-message {
                background: #fed7d7;
                color: #c53030;
                border: 1px solid #feb2b2;
            }

            /* Mobile responsiveness */
            @media (max-width: 480px) {
                .homeward-chat-container {
                    width: calc(100vw - 40px);
                    right: 20px;
                    left: 20px;
                    height: 70vh;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    createWidget() {
        // Create main widget container
        this.widget = document.createElement('div');
        this.widget.className = 'homeward-chat-widget';

        // Create chat button
                this.chatButton = document.createElement('button');
                this.chatButton.className = 'homeward-chat-button';
                this.chatButton.innerHTML = `
                    <img src="help-icon.svg" alt="Help" style="width: 20px; height: 20px;">
                    <span>Need help?</span>
                `;
                this.chatButton.setAttribute('aria-label', 'Open chat');

        // Create chat container
        this.chatContainer = document.createElement('div');
        this.chatContainer.className = 'homeward-chat-container';
        this.chatContainer.setAttribute('aria-hidden', 'true');

        // Create header
        const header = document.createElement('div');
        header.className = 'homeward-chat-header';
        
        const title = document.createElement('div');
        title.className = 'homeward-chat-title';
        title.innerHTML = '🔧 <span>Repair Estimator</span>';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'homeward-chat-close';
        closeButton.innerHTML = '×';
        closeButton.setAttribute('aria-label', 'Close chat');

        header.appendChild(title);
        header.appendChild(closeButton);

        // Create messages container
        this.messagesContainer = document.createElement('div');
        this.messagesContainer.className = 'homeward-chat-messages';

        // Create input container
        const inputContainer = document.createElement('div');
        inputContainer.className = 'homeward-chat-input-container';

        this.input = document.createElement('input');
        this.input.className = 'homeward-chat-input';
        this.input.placeholder = 'Describe what needs repair...';
        this.input.setAttribute('aria-label', 'Type your message');

        inputContainer.appendChild(this.input);

        // Assemble the widget
        this.chatContainer.appendChild(header);
        this.chatContainer.appendChild(this.messagesContainer);
        this.chatContainer.appendChild(inputContainer);
        this.widget.appendChild(this.chatContainer);
        this.widget.appendChild(this.chatButton);

        // Add to page
        document.body.appendChild(this.widget);
    }

    attachEventListeners() {
        this.chatButton.addEventListener('click', () => this.toggleChat());
        
        const closeButton = this.chatContainer.querySelector('.homeward-chat-close');
        closeButton.addEventListener('click', () => this.closeChat());

        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.input.value.trim() && !this.isLoading) {
                this.sendMessage(this.input.value.trim());
                this.input.value = '';
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChat();
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.chatContainer.style.display = this.isOpen ? 'flex' : 'none';
        this.chatContainer.setAttribute('aria-hidden', !this.isOpen);
        
        if (this.isOpen) {
            this.input.focus();
            this.scrollToBottom();
        }
    }

    closeChat() {
        this.isOpen = false;
        this.chatContainer.style.display = 'none';
        this.chatContainer.setAttribute('aria-hidden', 'true');
    }

    addWelcomeMessage() {
        this.addMessage(this.config.welcomeMessage, 'bot');
    }

    async sendMessage(message) {
        if (this.isLoading) return;

        this.addMessage(message, 'user');
        this.isLoading = true;
        this.input.disabled = true;

        try {
            // Show typing indicator
            this.showTypingIndicator();

            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Remove typing indicator
            this.hideTypingIndicator();
            
            this.addMessage(data.response, 'bot');
        } catch (error) {
            console.error('Chat error:', error);
            this.hideTypingIndicator();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot', 'error');
        } finally {
            this.isLoading = false;
            this.input.disabled = false;
            this.input.focus();
        }
    }

    addMessage(message, type, className = '') {
        const messageElement = document.createElement('div');
        messageElement.className = `homeward-message homeward-${type}-message ${className}`;
        messageElement.textContent = message;
        
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.className = 'homeward-message homeward-bot-message homeward-loading-message';
        typingElement.innerHTML = `
            <span>Estimating repair costs</span>
            <div class="homeward-typing-indicator">
                <div class="homeward-typing-dot"></div>
                <div class="homeward-typing-dot"></div>
                <div class="homeward-typing-dot"></div>
            </div>
        `;
        typingElement.id = 'typing-indicator';
        
        this.messagesContainer.appendChild(typingElement);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Auto-initialize if script is loaded
if (typeof window !== 'undefined') {
    window.HomewardRepairChatWidget = HomewardRepairChatWidget;
    
    // Auto-initialize with default settings if data attributes are present
    document.addEventListener('DOMContentLoaded', () => {
        const script = document.querySelector('script[src*="chat-widget.js"]');
        if (script) {
            const apiEndpoint = script.getAttribute('data-api-endpoint') || '/api/chat-fixed';
            const companyName = script.getAttribute('data-company-name') || 'Homeward Repair Estimator';
            const welcomeMessage = script.getAttribute('data-welcome-message') || 'Hi! I can help you estimate repair costs for your home. What needs fixing?';
            
            new HomewardRepairChatWidget({
                apiEndpoint,
                companyName,
                welcomeMessage
            });
        }
    });
}
