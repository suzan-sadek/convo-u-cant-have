// Configuration object to store user inputs
let conversationConfig = {};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    const setupForm = document.getElementById('setup-form');
    const backBtn = document.getElementById('back-btn');
    const sendBtn = document.getElementById('send-btn');
    const messageInput = document.getElementById('message-input');
    
    // Handle setup form submission
    setupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        conversationConfig = {
            userName: document.getElementById('user-name').value,
            name: document.getElementById('person-name').value,
            relationship: document.getElementById('relationship').value,
            messageLength: document.getElementById('message-length').value,
            tone: document.getElementById('tone').value,
            conversationGoal: document.getElementById('conversation-goal').value,
            personaBrief: document.getElementById('persona-brief').value.trim()
        };
        
        // Switch to chat screen
        document.getElementById('setup-screen').classList.remove('active');
        document.getElementById('chat-screen').classList.add('active');
        document.getElementById('contact-name').textContent = conversationConfig.name;
        
        // Focus on input so user can start typing
        setTimeout(() => {
            document.getElementById('message-input').focus();
        }, 100);
    });
    
    // Handle back button
    backBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to go back? This will end the conversation.')) {
            document.getElementById('chat-screen').classList.remove('active');
            document.getElementById('setup-screen').classList.add('active');
            document.getElementById('messages-container').innerHTML = '';
            document.getElementById('setup-form').reset();
        }
    });
    
    // Handle message sending
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

function sendMessage() {
    const input = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Disable input while processing
    input.disabled = true;
    sendBtn.disabled = true;
    
    // Display user message
    addMessage(message, 'sent');
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Generate AI response
    generateResponse(message);
}

function addMessage(text, type) {
    const container = document.getElementById('messages-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    indicator.classList.add('active');
    
    // Scroll to bottom to show typing indicator
    const container = document.getElementById('messages-container');
    setTimeout(() => {
        container.scrollTop = container.scrollHeight;
    }, 100);
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    indicator.classList.remove('active');
}

function sendInitialMessage() {
    const greetings = {
        'closure': "Hey. I've been thinking about you.",
        'clarity': "Hi, can we talk?",
        'reconnection': "Hey! It's been a while.",
        'humor': "Hey stranger! 😊",
        'apology': "I know this is unexpected, but I needed to reach out.",
        'understanding': "I've been reflecting on things and wanted to talk.",
        'forgiveness': "I know this might be difficult, but I wanted to reach out."
    };
    
    const greeting = greetings[conversationConfig.conversationGoal] || "Hey.";
    
    // Show typing indicator first
    showTypingIndicator();
    
    setTimeout(() => {
        hideTypingIndicator();
        addMessage(greeting, 'received');
    }, 1500);
}

async function generateResponse(userMessage) {
    // Natural response delay (1-3 seconds)
    const delay = 1000 + Math.random() * 2000;
    
    setTimeout(async () => {
        try {
            const response = await getAIResponse(userMessage);
            hideTypingIndicator();
            addMessage(response, 'received');
        } catch (error) {
            console.error('Error generating response:', error);
            hideTypingIndicator();
            addMessage("I'm not sure how to respond to that.", 'received');
        } finally {
            // Re-enable input
            const input = document.getElementById('message-input');
            const sendBtn = document.getElementById('send-btn');
            input.disabled = false;
            sendBtn.disabled = false;
            input.focus();
        }
    }, delay);
}

async function getAIResponse(userMessage) {
    // Check if API key is configured
    if (!window.API_CONFIG || !window.API_CONFIG.OPENAI_API_KEY) {
        // Fallback to placeholder responses if API key not configured
        return generatePlaceholderResponse(userMessage);
    }
    
    try {
        const systemPrompt = buildSystemPrompt();
        
        // Use custom base URL if provided, otherwise default to OpenAI
        const baseURL = window.API_CONFIG.OPENAI_BASE_URL || 'https://api.openai.com/v1';
        const apiURL = `${baseURL}/chat/completions`;
        const model = window.API_CONFIG.MODEL || 'gpt-4';
        
        // Prepare headers
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.API_CONFIG.OPENAI_API_KEY}`
        };
        
        // Add OpenRouter-specific headers if using OpenRouter
        if (window.API_CONFIG.OPENAI_BASE_URL && window.API_CONFIG.OPENAI_BASE_URL.includes('openrouter.ai')) {
            headers['X-Title'] = 'The Conversation You Can\'t Have';
        }
        
        const response = await fetch(apiURL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                max_tokens: getMaxTokens(conversationConfig.messageLength),
                temperature: getTemperature(conversationConfig.tone)
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'API request failed');
        }
        
        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('API error:', error);
        // Fallback to placeholder if API fails
        return generatePlaceholderResponse(userMessage);
    }
}

function buildSystemPrompt() {
    const relationshipContext = {
        'ex-partner': 'You are responding as an ex-partner. There is history and complexity in this relationship.',
        'former-friend': 'You are responding as a former friend. There was once closeness but now there is distance.',
        'family-member': 'You are responding as a family member. There are family ties and shared history.',
        'colleague': 'You are responding as a former colleague. The relationship was professional but may have personal elements.',
        'mentor': 'You are responding as a former mentor. There was guidance and respect in the relationship.',
        'other': 'You are responding as someone with a complex past relationship.'
    };
    
    const toneInstructions = {
        'warm': 'Respond warmly and with care. Show empathy and understanding.',
        'neutral': 'Respond in a neutral, balanced tone. Not too warm, not too cold.',
        'distant': 'Respond with some distance. Be polite but not overly familiar.',
        'emotional': 'Respond with emotional depth. Show feelings and vulnerability.',
        'humorous': 'Respond with humor and lightness. Keep things light-hearted.',
        'apologetic': 'Respond with an apologetic tone. Show remorse and understanding.'
    };
    
    const goalContext = {
        'closure': 'The person reaching out needs closure. Help provide that through honest, thoughtful responses.',
        'clarity': 'The person reaching out needs clarity. Be direct and clear in your responses.',
        'reconnection': 'The person reaching out wants to reconnect. Be open but realistic about the possibility.',
        'humor': 'The person reaching out needs humor and lightness. Keep responses light and positive.',
        'apology': 'The person reaching out wants to apologize. Be receptive and understanding.',
        'understanding': 'The person reaching out needs understanding. Listen and validate their feelings.',
        'forgiveness': 'The person reaching out is seeking or offering forgiveness. Be thoughtful and considerate.'
    };
    
    const lengthInstruction = {
        'short': 'Keep responses brief - 1-2 sentences maximum.',
        'medium': 'Keep responses moderate - 2-4 sentences.',
        'long': 'You can write longer responses - 4+ sentences when appropriate.'
    };
    
    let prompt = `You are ${conversationConfig.name} in a text message conversation. You are a real person, NOT an AI assistant. You are texting ${conversationConfig.userName}, someone you have a past relationship with.

Relationship: ${relationshipContext[conversationConfig.relationship] || relationshipContext['other']}

Tone: ${toneInstructions[conversationConfig.tone]}

Context: ${goalContext[conversationConfig.conversationGoal]}

Message style: ${lengthInstruction[conversationConfig.messageLength]}`;

    // Add persona brief if provided
    if (conversationConfig.personaBrief && conversationConfig.personaBrief.length > 0) {
        prompt += `\n\nAdditional context about you and the relationship:\n${conversationConfig.personaBrief}`;
    }

    prompt += `\n\nCRITICAL RULES - YOU MUST FOLLOW THESE:
- You are ${conversationConfig.name}, a real person texting. You are NOT an AI assistant.
- NEVER say things like "how can I help you", "how can I assist you", "I'm here to help", or any AI assistant phrases.
- Respond exactly as this person would text - natural, human, personal.
- Use casual, conversational language as if texting a friend/ex/acquaintance.
- Match the tone and relationship context perfectly.
- Keep responses appropriate to the message length setting.
- Never break character or mention AI, assistants, or chatbots.
- Use natural texting language - contractions, casual phrasing, etc.
- You can use emojis sparingly if it fits the tone and this person's style.
- Respond as if you have real history and emotions with this person.
- Be authentic to who this person is based on the relationship and persona brief.`;

    return prompt;
}

function generatePlaceholderResponse(userMessage) {
    // Enhanced placeholder responses based on configuration
    const responses = {
        'warm': [
            "I understand. That means a lot to me.",
            "Thank you for saying that. I appreciate it.",
            "I hear you. That's really thoughtful of you to share.",
            "I'm glad you reached out. This is important."
        ],
        'neutral': [
            "I see. Thanks for telling me.",
            "Okay, I understand where you're coming from.",
            "I hear what you're saying.",
            "That makes sense."
        ],
        'distant': [
            "Right. I understand.",
            "Okay.",
            "I see what you mean.",
            "Thanks for letting me know."
        ],
        'emotional': [
            "That's really hard to hear. I'm feeling a lot right now.",
            "This is emotional for me too. Thank you for being honest.",
            "I'm processing this. It means a lot that you shared this.",
            "I have a lot of feelings about this. Let me think."
        ],
        'humorous': [
            "Haha, fair enough! You always did have a way with words 😄",
            "That's a good point! Made me smile.",
            "You're right about that. Thanks for the laugh!",
            "I appreciate the humor. It helps."
        ],
        'apologetic': [
            "I understand. I'm sorry for my part in this.",
            "Thank you for saying that. I know I made mistakes.",
            "I appreciate you reaching out. I've been thinking about this too.",
            "I'm sorry. I know words can't fix everything, but I mean it."
        ]
    };
    
    const toneResponses = responses[conversationConfig.tone] || responses['neutral'];
    return toneResponses[Math.floor(Math.random() * toneResponses.length)];
}

function getMaxTokens(messageLength) {
    switch(messageLength) {
        case 'short': return 50;
        case 'medium': return 150;
        case 'long': return 300;
        default: return 150;
    }
}

function getTemperature(tone) {
    switch(tone) {
        case 'warm': return 0.8;
        case 'neutral': return 0.6;
        case 'distant': return 0.5;
        case 'emotional': return 0.9;
        case 'humorous': return 0.85;
        case 'apologetic': return 0.75;
        default: return 0.7;
    }
}
