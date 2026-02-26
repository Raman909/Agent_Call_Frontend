var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import API from "../api/axios";
const TwilioForm = () => {
    const [form, setForm] = useState({
        userId: "",
        accountSid: "",
        authToken: "",
        phoneNumber: "",
    });
    const handleChange = (e) => {
        setForm(Object.assign(Object.assign({}, form), { [e.target.name]: e.target.value }));
    };
    const handleSubmit = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield API.post("/twilio/save", form);
            alert("Twilio credentials saved!");
        }
        catch (error) {
            alert("Error saving credentials");
        }
    });
    return (_jsxs("div", { children: [_jsx("h3", { children: "Twilio Credentials" }), _jsx("input", { name: "userId", placeholder: "User ID", onChange: handleChange }), _jsx("input", { name: "accountSid", placeholder: "Account SID", onChange: handleChange }), _jsx("input", { name: "authToken", placeholder: "Auth Token", onChange: handleChange }), _jsx("input", { name: "phoneNumber", placeholder: "Phone Number", onChange: handleChange }), _jsx("button", { onClick: handleSubmit, children: "Save" })] }));
};
export default TwilioForm;
