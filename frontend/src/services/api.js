const API_BASE = "https://backend-brown-omega-94.vercel.app/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to login");
  }
  return data;
};

export const register = async (name, email, password) => {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to register");
  }
  return data;
};

export const createTrip = async (tripData) => {
  const response = await fetch(`${API_BASE}/trips`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(tripData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to generate trip");
  }
  return data;
};

export const getTrips = async () => {
  const response = await fetch(`${API_BASE}/trips`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch trips");
  }
  return data;
};

export const getTrip = async (id) => {
  const response = await fetch(`${API_BASE}/trips/${id}`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch trip details");
  }
  return data;
};

export const updateTrip = async (id, updatedFields) => {
  const response = await fetch(`${API_BASE}/trips/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(updatedFields),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update trip");
  }
  return data;
};

export const regenerateDay = async (id, dayNumber, instruction) => {
  const response = await fetch(`${API_BASE}/trips/${id}/regenerate-day`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ dayNumber, instruction }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to regenerate day");
  }
  return data;
};
