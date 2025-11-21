const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const api = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
	const token = localStorage.getItem("token");

	const headers: HeadersInit = {
		"Content-Type": "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
		...(options.headers || {}),
	};

	const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

	if (response.status === 204) {
		return {} as T;
	}

	let data;
	try {
		data = await response.json();
	} catch (error) {
		if (response.ok) data = {};
		else throw new Error("Failed to parse server response");
	}

	if (!response.ok) {
		throw new Error(data?.message || `Request failed: ${response.status} ${response.statusText}`);
	}

	return data as T;
};
