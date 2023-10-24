import axiosInstance from "@/app/axios"; // path to your axios.ts file

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  return response.data;
};
