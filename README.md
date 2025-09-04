Live Collaborative Editor

A modern, AI-powered collaborative editor built with React/Next.js, featuring real-time AI assistance, text editing capabilities, and web search integration.

Live Demo

View Live Application: https://live-collaborative-editor-ihxbqtau6.vercel.app

Features

Core Features
- Rich Text Editor - Built with Tiptap for professional text editing
- AI Chat Assistant - Real-time AI conversations with Groq API
- Floating Toolbar - Context-aware editing tools on text selection
- Preview Modal - Compare original vs AI-suggested content
- Resizable Sidebar - Customizable AI assistant panel

AI-Powered Editing
- Text Shortening - Make content more concise
- Text Expansion - Add detail and context
- Style Improvement - Enhance writing flow and clarity
- Table Conversion - Transform text into structured tables
- Grammar Fixing - AI-powered grammar correction

Advanced Features
- Web Search Agent - Research and insert web content
- Real-time Collaboration - Multi-user editing capabilities
- Responsive Design - Works on all screen sizes
- Modern UI - Beautiful gradients and animations

Tech Stack

- Frontend: React 18, Next.js 15, TypeScript
- Styling: Tailwind CSS
- Editor: Tiptap (rich text editor)
- AI Integration: Groq API (free alternative to OpenAI)
- Web Search: Serper API
- Deployment: Vercel
- Version Control: GitHub

Getting Started

Prerequisites
- Node.js 18+ 
- npm or yarn
- Groq API key (free)
- Serper API key (free)

Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Pawan-Yaduveer/live-collaborative-editor.git
   cd live-collaborative-editor
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create .env.local file:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   SERPER_API_KEY=your_serper_api_key_here
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open your browser
   Navigate to http://localhost:3000

Usage

Basic Editing
1. Start typing in the main editor
2. Select text to see the floating toolbar
3. Choose from AI editing options
4. Preview changes before applying

AI Assistant
1. Use the right sidebar for AI chat
2. Select text and use quick actions
3. Ask questions or request edits
4. Use web search for research

Advanced Features
1. Resize the sidebar by dragging the handle
2. Use web search to find and insert content
3. Apply AI edits with preview modal
4. Collaborate in real-time

API Endpoints

- POST /api/ai/chat - AI chat conversations
- POST /api/ai/edit - AI text editing
- POST /api/agent/search - Web search agent

Deployment

The application is deployed on Vercel with automatic deployments from GitHub.

Live URL: https://live-collaborative-editor-ihxbqtau6.vercel.app

Screenshots

- Modern gradient header with animated status
- Rich text editor with floating toolbar
- AI assistant with quick actions
- Preview modal for AI suggestions
- Resizable sidebar interface

Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

License

This project is open source and available under the MIT License.

Author

Pawan Kumar
- GitHub: @Pawan-Yaduveer
- Email: editslatest@gmail.com

Assessment Submission

This project was built for the First Connect Group Software Engineer assessment, demonstrating:
- React/Next.js proficiency
- AI API integration
- Modern UI/UX design
- Full-stack development skills
- Production deployment

Built with React, Next.js, and AI