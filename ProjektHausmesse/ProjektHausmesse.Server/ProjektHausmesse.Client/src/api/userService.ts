import {UserCreateForm, UserListModel} from "@/models/dto/User.ts";
import axiosInstance from "@/api/axiosInstance.ts";
import {API_ROUTES} from "@/api/backendService.ts";
import {AxiosResponse} from "axios";

export class UserService {
    static async getUsers(): Promise<UserListModel[]> {
        const response: AxiosResponse<UserListModel[]> = await axiosInstance.get(API_ROUTES.USERS)
        return response.data;
    }

    static async deleteUser(userId: string): Promise<boolean> {
        try {
            await axiosInstance.delete(`${API_ROUTES.USERS}/${userId}`)
            return true;
        } catch (e) {
            return false;
        }
    }

    static async addUser(user: UserCreateForm): Promise<boolean> {
        try {
            await axiosInstance.post(API_ROUTES.USERS, user)
            return true;
        } catch (e) {
            return false;
        }
    }

    static async updateUser(id: string, form: UserCreateForm): Promise<boolean> {
        try {
            await axiosInstance.put(`${API_ROUTES.USERS}/${id}`, form)
            return true;
        } catch (e) {
            return false;
        }
    }

    static async toggleAdmin(id: string, value: boolean): Promise<boolean> {
        try {
            await axiosInstance.put(`${API_ROUTES.USERS}/${id}/admin`, value)
            return true;
        } catch (e) {
            return false;
        }
    }
}