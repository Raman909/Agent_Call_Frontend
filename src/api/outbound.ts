import api from "./axios";

export interface OutboundCallPayload {
  phoneNumber: string;
  agentId: string;
}

export const startOutboundCall = async (data: OutboundCallPayload) => {
  const res = await api.post("/outbound/call", data);
  return res.data;
};