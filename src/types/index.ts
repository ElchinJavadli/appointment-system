export type UserRole = "client" | "provider" | "admin";
export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";



export type RouteParams = {
  params: { [key: string]: string };
};



export interface AppointmentWithRelations {
  id: number;
  date: string | Date;
  startTime: string;
  endTime: string;
  status: string;
  service?: {
    id: number;
    name: string;
    price?: number;
    duration?: number;
  } | null;
  client?: {
    id: number;
    name: string;
  } | null;
  provider?: {
    id: number;
    user?: {
      id: number;
      name: string;
    } | null;
  } | null;
}