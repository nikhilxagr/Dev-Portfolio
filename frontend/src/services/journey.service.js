import { api } from "@/services/api";

export const getJourneyEntries = async (params = {}) => {
  const { data } = await api.get("/journey", { params });
  return data;
};
