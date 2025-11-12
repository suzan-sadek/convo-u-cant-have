# The Conversation You Can't Have

An iMessage-style conversation simulator that allows you to have a simulated text conversation with someone you can't talk to anymore. This tool helps you process emotions, find closure, or explore conversations in a safe, controlled environment.

## Features

- **Customizable Person Profile**: Set the name and relationship context
- **Texting Style Control**: Adjust message length, response frequency, and tone
- **Conversation Goals**: Choose what you need (closure, clarity, reconnection, humor, etc.)
- **iMessage-Style Interface**: Beautiful, familiar chat interface
- **AI-Powered Responses**: Uses OpenAI GPT-4 for contextual, realistic responses
- **Fallback Mode**: Works with placeholder responses if API key isn't configured

## Setup

### Option 1: Quick Start (No API Key)

1. Open `index.html` in your web browser
2. Fill out the form and start chatting
3. The app will use intelligent placeholder responses based on your settings

### Option 2: Full Setup with AI (Recommended)

1. **Get an OpenAI API Key**:
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Sign up or log in
   - Create a new API key

2. **Configure the API Key**:
   - Open `config.js`
   - Replace `'your-api-key-here'` with your actual API key:
   ```javascript
   OPENAI_API_KEY: 'sk-your-actual-key-here'
   ```

3. **Open the App**:
   - Open `index.html` in your web browser
   - The app will now use GPT-4 for realistic, contextual responses

## Usage

1. **Fill Out the Setup Form**:
   - Enter the person's name
   - Select your relationship with them
   - Choose message length (short, medium, long)
   - Set response frequency (immediate, quick, delayed)
   - Pick a tone (warm, neutral, distant, emotional, humorous, apologetic)
   - Select your conversation goal

2. **Start Chatting**:
   - The conversation will begin with an initial message
   - Type your messages and press Enter or click Send
   - Responses will appear based on your configured settings

3. **Navigate**:
   - Click "Back" to return to setup (this will end the current conversation)

## Configuration Options

### Message Length
- **Short**: 1-2 sentences
- **Medium**: 2-4 sentences (default)
- **Long**: 4+ sentences

### Response Frequency
- **Immediate**: Instant responses (~1 second)
- **Quick**: Fast responses (2-4 seconds)
- **Delayed**: Realistic delays (5-15 seconds)

### Tone
- **Warm & Friendly**: Caring, empathetic responses
- **Neutral**: Balanced, measured tone
- **Distant**: Polite but reserved
- **Emotional**: Deep, feeling responses
- **Humorous**: Light-hearted, funny
- **Apologetic**: Remorseful, understanding

### Conversation Goals
- **Closure**: Find resolution and peace
- **Clarity**: Understand what happened
- **Reconnection**: Explore reconnecting
- **Humor**: Lighten the mood
- **Apology**: Offer or receive apologies
- **Understanding**: Gain perspective
- **Forgiveness**: Work through forgiveness

## Privacy & Security

- **Local Only**: All conversations happen in your browser - nothing is stored or sent anywhere except to OpenAI (if configured)
- **API Key**: Keep your API key secure. Never commit `config.js` to version control
- **No Data Storage**: Conversations are not saved between sessions

## Technical Details

- **Pure HTML/CSS/JavaScript**: No build process required
- **OpenAI API**: Uses GPT-4 for realistic responses
- **Responsive Design**: Works on desktop and mobile
- **No Dependencies**: Runs entirely in the browser

## Troubleshooting

### API Errors
- Check that your API key is correct in `config.js`
- Ensure you have credits in your OpenAI account
- The app will automatically fall back to placeholder responses if the API fails

### CORS Issues
- If you see CORS errors, you may need to run a local server:
  ```bash
  # Python
  python -m http.server 8000
  
  # Node.js
  npx http-server
  ```
  Then open `http://localhost:8000`

## Notes

This is a therapeutic tool designed to help process difficult emotions and conversations. It's not a replacement for professional therapy or counseling. If you're struggling with difficult emotions, please consider speaking with a mental health professional.

## License

This project is provided as-is for personal use.

---

**Remember**: This is a simulation. The responses are AI-generated and may not reflect how the actual person would respond. Use this tool as a way to process your own thoughts and feelings, not as a substitute for real communication when possible.
