import axios from "axios";
import type { Alarm, DispatchRequest, Overview, Trends } from "./types";

const api = axios.create({ baseURL: "/api", timeout: 8000 });
export const getOverview = async () => (await api.get<Overview>("/overview")).data;
export const getTrends = async () => (await api.get<Trends>("/trends")).data;
export const getAlarms = async () => (await api.get<Alarm[]>("/alarms")).data;
export const acknowledgeAlarm = async (id: string) => (await api.post<Alarm>(`/alarms/${id}/ack`)).data;
export const dispatchPlan = async (payload: DispatchRequest) => (await api.post("/dispatch", payload)).data;

