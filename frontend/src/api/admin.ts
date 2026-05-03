import { apiRequest } from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { USE_MOCK } from "../config/mock";
import axios from "axios";

// 🧪 MOCK DATA
const mockWorkers = [
  { id: "1", name: "Ramesh", skill: "Plumber" },
  { id: "2", name: "Suresh", skill: "Electrician" },
];

const mockWorkerDetail = {
  id: "1",
  name: "Ramesh",
  skill: "Plumber",
  ai_score: 92,
};

// ✅ 1. Get all workers
export const getAllWorkers = async () => {
  if (USE_MOCK) {
    return new Promise((res) => setTimeout(() => res(mockWorkers), 800));
  }
  return apiRequest("/admin/workers", "GET");
};

// ✅ 2. Get worker details
export const getWorkerDetails = async (worker_id: string) => {
  if (USE_MOCK) {
    return new Promise((res) => setTimeout(() => res(mockWorkerDetail), 800));
  }
  return apiRequest(`/admin/worker/${worker_id}`, "GET");
};

// ✅ 3. Approve worker
export const approveWorker = async (worker_id: string) => {
  if (USE_MOCK) {
    return new Promise((res) =>
      setTimeout(() => res({ message: "Approved" }), 500),
    );
  }
  return apiRequest(`/admin/approve/${worker_id}`, "POST");
};

// ✅ 4. Reject worker
export const rejectWorker = async (worker_id: string) => {
  if (USE_MOCK) {
    return new Promise((res) =>
      setTimeout(() => res({ message: "Rejected" }), 500),
    );
  }
  return apiRequest(`/admin/reject/${worker_id}`, "POST");
};
/* ✅ NEW FUNCTION (IMPORTANT) */
export const getWorkers = async (status: string) => {
  const res = await axios.get(`/admin/workers?status=${status}`);
  return res.data;
};    

// ================== BOOKINGS APIs (ADDED) ==================

// ✅ Get all bookings
export const getAllBookings = async () => {
  if (USE_MOCK) {
    return new Promise((res) =>
      setTimeout(
        () =>
          res([
            {
              _id: "1",
              service: "Plumbing",
              userName: "Rahul",
              workerName: "Ramesh",
              date: "2026-05-04",
              price: 500,
              status: "pending",
            },
            {
              _id: "2",
              service: "Electrician",
              userName: "Amit",
              workerName: "Suresh",
              date: "2026-05-05",
              price: 700,
              status: "completed",
            },
          ]),
        800
      )
    );
  }

  return apiRequest("/admin/bookings", "GET");
};

// ✅ Update booking status
export const updateBookingStatus = async (
  booking_id: string,
  status: string
) => {
  if (USE_MOCK) {
    return new Promise((res) =>
      setTimeout(() => res({ message: "Updated" }), 500)
    );
  }

  return apiRequest(`/admin/bookings/${booking_id}/status`, "PATCH", {
    status,
  });
};