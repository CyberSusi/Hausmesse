import { Container } from "@/models/Container.ts"
import { ContainerFormDTO } from "@/models/dto/ContainerFormDTO.ts"
import { SensorFormDTO } from "@/models/dto/SensorFormDTO.ts"
import { Sensor } from "@/models/Sensor.ts"
import { AxiosResponse } from "axios"
import axiosInstance from "./axiosInstance"
import {Measurement} from "@/models/Measurement.ts";

export const API_ROUTES = {
    CONTAINERS: "/api/containers",
    SENSORS: "/api/sensors",
    MEASUREMENTS: "/api/measurements",
    USERS: "/api/users",
}
type queryParams = {
  name?: string;
}
export const backendService = {

  async getAllContainers(params?:queryParams): Promise<Container[]> {
    const response: AxiosResponse<Container[]> = await axiosInstance.get(API_ROUTES.CONTAINERS, {params})
    return response.data
  },

  async createContainer(dto: ContainerFormDTO): Promise<void> {
    await axiosInstance.post(API_ROUTES.CONTAINERS, dto)
  },

  async updateContainer(id: number, dto: ContainerFormDTO): Promise<void> {
    await axiosInstance.put(`${API_ROUTES.CONTAINERS}/${id}`, dto)
  },

  async deleteContainer(id: number): Promise<void> {
    await axiosInstance.delete(`${API_ROUTES.CONTAINERS}/${id}`)
  },

  async getAllSensors(): Promise<Sensor[]> {
    const response: AxiosResponse<Sensor[]> = await axiosInstance.get(API_ROUTES.SENSORS)
    return response.data
  },

  async createSensor(dto: SensorFormDTO): Promise<void> {
    await axiosInstance.post(API_ROUTES.SENSORS, dto)
  },

  async updateSensor(id: number, dto: SensorFormDTO): Promise<void> {
    await axiosInstance.put(`${API_ROUTES.SENSORS}/${id}`, dto)
  },

  async deleteSensor(id: number): Promise<void> {
    await axiosInstance.delete(`${API_ROUTES.SENSORS}/${id}`)
  },

  async getAllMeasurementsByContainerId(id: number): Promise<Measurement[]> {
    const response: AxiosResponse<Measurement[]> = await axiosInstance.get(`${API_ROUTES.MEASUREMENTS}/${id}`)
    return response.data
  }
}
