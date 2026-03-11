import api from "./axios";

export const fetchAgents = async () => {
  const res = await api.get("/agents");
  return res.data.agents;
};