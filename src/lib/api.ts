import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8081/api",
  headers: { "Content-Type": "application/json" },
});

export type Ticket = {
  ticketId: string | number;
  plateNumber: string;
  ownerName: string;
  phone?: string;
  vehicleType: "CAR" | "BIKE" | "TRUCK";
  slot: string | number;
  entryTime: string;
  exitTime?: string;
  fee?: number;
};
