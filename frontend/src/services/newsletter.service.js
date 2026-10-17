import { api } from "@/services/api";

export const subscribeNewsletter = async (email, source = "engineering-docs") => {
  const { data } = await api.post("/newsletter/subscribe", { email, source });
  return data;
};
