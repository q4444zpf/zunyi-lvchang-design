export type Communication = "在线" | "离线";
export interface Metric { label: string; value: number; unit: string; trend: "上升" | "下降" | "稳定"; comparison: string }
export interface Node { id: string; name: string; category: string; flow: number; pressure: number; status: "正常" | "预警" | "故障" }
export interface Pool { id: string; name: string; level: number; capacity: number; inflow: number; outflow: number; forecast_level: number; status: "正常" | "预警" | "危险" }
export interface Pump { id: string; name: string; running: boolean; frequency: number; current: number }
export interface Overview { plant_name: string; data_time: string; communication: Communication; operator: string; metrics: Metric[]; nodes: Node[]; pools: Pool[]; pumps: Pump[] }
export interface TrendPoint { time: string; actual: number; plan: number }
export interface Trends { total: TrendPoint[]; zones: Record<string, number[]> }
export interface Alarm { id: string; severity: "危险" | "预警" | "提示"; device: string; event: string; occurred_at: string; status: "未确认" | "已确认" }
export interface DispatchRequest { plan_id: string; pump_ids: string[]; target_level: number }

