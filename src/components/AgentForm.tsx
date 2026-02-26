import { useState } from "react";
import API from "../api/axios";

const AgentForm = () => {
  const [form, setForm] = useState({
    userId: "",
    name: "",
    systemPrompt: "",
    greetingMessage: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await API.post("/agent/create", form);
      alert("Agent created!");
    } catch (error) {
      alert("Error creating agent");
    }
  };

  return (
    <div>
      <h3>Create Agent</h3>
      <input name="userId" placeholder="User ID" onChange={handleChange} />
      <input name="name" placeholder="Agent Name" onChange={handleChange} />
      <textarea name="systemPrompt" placeholder="System Prompt" onChange={handleChange} />
      <textarea name="greetingMessage" placeholder="Greeting Message" onChange={handleChange} />
      <button onClick={handleSubmit}>Create Agent</button>
    </div>
  );
};

export default AgentForm;