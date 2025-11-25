import axiosInstance from "./axiosInstance"
import { LoginForm } from "@/models/LoginForm.ts"


const AUTH_ROUTES = {
  LOGIN: "/api/user/login",
  LOGOUT: "/api/user/logout",
  CHECK: "/api/user/check",
}

export class AuthService {
  
  public static async isAdmin(): Promise<boolean> {
    try {
      const result = await axiosInstance.get(AUTH_ROUTES.CHECK)
      return result.status >= 200 && result.status <= 300
    } catch (error) {
      return false
    }
  }

  public static async login(form: LoginForm): Promise<boolean> {
    try {
      const result = await axiosInstance.post(AUTH_ROUTES.LOGIN, form)
      const token = result.data?.accessToken
      if (token) {
        localStorage.setItem("token", token)
      }
      return result.status >= 200 && result.status <= 300
    } catch (error) {
      console.log(error)
      return false
    }
  }

  public static async logout() {
    try {
      const result = await axiosInstance.post(AUTH_ROUTES.LOGOUT)
      return result.status >= 200 && result.status <= 300
    } catch (error) {
      console.log(error)
      return false
    }
  }
}