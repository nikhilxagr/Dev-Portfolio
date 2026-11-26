import { api } from "@/services/api";

export const getSiteContent = async () => {
  const { data } = await api.get("/site-content");
  return data;
};
