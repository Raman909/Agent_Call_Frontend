import { useState } from "react";
import API from "../api/axios";

const TwilioForm = () => {
  const [form, setForm] = useState({
    userId: "",
    accountSid: "",
    authToken: "",
    phoneNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await API.post("/twilio/save", form);
      alert("Twilio credentials saved!");
    } catch (error) {
      alert("Error saving credentials");
    }
  };

  return (
    <div>
      <h3>Twilio Credentials</h3>
      <input name="userId" placeholder="User ID" onChange={handleChange} />
      <input name="accountSid" placeholder="Account SID" onChange={handleChange} />
      <input name="authToken" placeholder="Auth Token" onChange={handleChange} />
      <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} />
      <button onClick={handleSubmit}>Save</button>
    </div>
  );
};

export default TwilioForm;