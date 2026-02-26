# Agent Vox 🎙️🤖

**Agent Vox** is a modern, multi-tenant SaaS application that enables users to configure, manage, and deploy custom AI voice assistants. Integrating **Gemini Flash Native Audio**, **LiveKit**, and **Twilio**, users can build dedicated agents powered by customizable personalities, instructions, and contextual knowledge from uploaded PDFs.

---

## 🚀 Features

* **Authentication & Security:** Secure JWT-based Authentication system for user-isolated agent configurations and Twilio credentials.
* **Telephony Integration:** Seamless bridging of Twilio voice calls via SIP into LiveKit rooms using Dynamic Routing constraints based on user credentials.
* **Custom AI Personalities:** Define agent names, distinct greeting messages, and comprehensive system prompts.
* **Retrieval-Augmented Generation (RAG):** Drag-and-drop PDF upload functionality. The AI reads uploaded user documents on-the-fly and references them heavily during live voice calls.
* **Stripe Integrations:** Agents can be given instructions to dynamically dispatch generated Stripe payment links straight into customer emails mid-conversation!
* **Stunning UI/UX:** Built on React and Framer Motion with an elegant, responsive Dark Mode glassmorphic design language.

## 🛠 Tech Stack

**Frontend Framework:** React 18 / Vite / TypeScript
**Styling:** Tailwind CSS, Framer Motion, Lucide Icons
**Routing & HTTP:** React Router DOM, Axios
**Backend Architecture (Remote/LAN):** Node.js, Express, MongoDB
**AI & RTC Dependencies:** `@google/generative-ai`, `livekit-server-sdk`, `twilio`

---

## 💻 Running the Frontend Locally

### Prerequisites
* Node.js (v18+ recommended)
* The Agent Vox Backend instance actively running (locally or on the LAN network)

### 1. Installation

Clone the repository and install dependencies in the frontend directory:

```bash
cd agent_vox/frontend
npm install
```

### 2. Environment Variables

Create a `.env` file in the root of the `frontend` directory. Assuming your backend is running on a teammate's machine on the local network at `http://192.168.1.138:5000` (or `http://localhost:5000` if local):

```env
VITE_API_URL=http://192.168.1.138:5000/api
```

### 3. Start Development Server

```bash
npm run dev
```

Visit the outputted local port (e.g. `http://localhost:5173`).

---

## 📂 Project Navigation

* `src/pages/Login.tsx` & `Register.tsx` — Public auth gateways.
* `src/components/ProtectedRoute.tsx` — Restricts access based on the `target auth user`.
* `src/context/AuthContext.tsx` — Cross-app persistence of the JWT Auth Token and standard Profile logic.
* `src/api/axios.ts` — Global interceptor to automatically attach authorization Bearer headers and gracefully route requests to `import.meta.env.VITE_API_URL`.
* `src/pages/Dashboard.tsx` — Management UI for Twilio Voice bindings and configuration properties.
* `src/pages/AgentConfig.tsx` — Defines voice tone and rules constraints mapping to MongoDB IDs.
* `src/pages/KnowledgeBase.tsx` — Form data POST processing resolving uploaded PDFs directly into the user's specific Voice Agent's context.

---

## 🤝 Collaboration

The application handles Dynamic Multi-Tenant configurations across nodes.

1. **New Users**: When registering, you log in securely.
2. **Setup your agent**: Create boundaries and context.
3. **Bring Your Own Twilio**: Every user has their own Twilio Webhook attached to their specific Twilio Number.
4. **SIP Handshake**: The user dials the number, Twilio hits the backend, the backend figures out exactly *whose* agent it is and invokes an isolated LiveKit Cloud thread for them on-demand!
