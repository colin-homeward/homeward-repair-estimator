/**
 * Homeward Repair Estimator Chat Widget - Fixed Version
 * Embeddable chat widget for repair estimation assistance
 */

class HomewardRepairChatWidget {
    constructor(options = {}) {
        this.apiEndpoint = options.apiEndpoint || 'https://colin-homeward.app.n8n.cloud/webhook-test/30670948-d6da-45d5-9f32-b0d9b88a8d5a';
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
        console.log('Initializing chat widget...');
        this.createStyles();
        this.createWidget();
        this.attachEventListeners();
        this.addWelcomeMessage();
        console.log('Chat widget initialized successfully');
    }

    createStyles() {
        const styles = `
            .homeward-chat-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
                font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
                font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                transition: border-color 0.2s;
                box-sizing: border-box;
            }

            .homeward-chat-input:focus {
                border-color: #2D8C8C;
            }

            .homeward-chat-input::placeholder {
                color: #a0aec0;
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
            <span style="font-size: 20px;">🔧</span>
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
        console.log('Chat widget created and added to page');
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
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message: message,
                    // Add any additional context you want to send to your n8n agent
                    context: {
                        company: 'Homebase',
                        agent: 'Homie',
                        timestamp: new Date().toISOString()
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Handle different response formats from n8n
            let botResponse;
            if (data.response) {
                botResponse = data.response;
            } else if (data.message) {
                botResponse = data.message;
            } else if (typeof data === 'string') {
                botResponse = data;
            } else {
                botResponse = 'I received your message but need to process it. Please try again.';
            }
            
            this.addMessage(botResponse, 'bot');
        } catch (error) {
            console.error('Chat error:', error);
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        } finally {
            this.isLoading = false;
            this.input.disabled = false;
            this.input.focus();
        }
    }

    addMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `homeward-message homeward-${type}-message`;
        messageElement.textContent = message;
        
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Auto-initialize
if (typeof window !== 'undefined') {
    window.HomewardRepairChatWidget = HomewardRepairChatWidget;
    
    function initializeWidget() {
        console.log('Auto-initializing chat widget...');
        const script = document.querySelector('script[src*="chat-widget-fixed.js"]');
        if (script) {
            const apiEndpoint = script.getAttribute('data-api-endpoint') || 'https://colin-homeward.app.n8n.cloud/webhook-test/30670948-d6da-45d5-9f32-b0d9b88a8d5a';
            const companyName = script.getAttribute('data-company-name') || 'Homie';
            const welcomeMessage = script.getAttribute('data-welcome-message') || 'Hi, I\'m Homie! The Homebase chatbot. I can help with generating floor plans, understanding Homeward policy, or pricing repairs not yet in our catalog';
            
            try {
                new HomewardRepairChatWidget({
                    apiEndpoint,
                    companyName,
                    welcomeMessage
                });
            } catch (error) {
                console.error('Error initializing widget:', error);
            }
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWidget);
    } else {
        initializeWidget();
    }
}
