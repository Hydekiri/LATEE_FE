import { User, UserUpdate, CreateUserRequest } from "@/src/features/admin/types/user";
import { API_BASE_URL } from "@/src/config/env";
import { getCookie } from "@/src/utils/cookies";

export async function fetchUsers(): Promise<User[]> {
    const accessToken = getCookie("accessToken");

    const res = await fetch(`${API_BASE_URL}/user/api/users`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
}

export async function getUserById(userId: string) {
    try {
        const accessToken = getCookie("accessToken");
        const res = await fetch(`${API_BASE_URL}/user/api/users/${userId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
            },
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw error;
    }
}

export async function createUser(user: Omit<User, "userId" | "createdAt" | "updatedAt">, userId: string) {
    const accessToken = getCookie("accessToken");

    const createUserData: CreateUserRequest = {
        userId,
        name: user.name,
        email: user.email,
        password: user.password || "defaultPassword",
        phone: user.phone || "defaultPhone",
        birthday: user.birthday,
        gender: user.gender || "Male",
        address: user.address || null,
        status: user.status,
        role: user.role
    };

    const res = await fetch(`${API_BASE_URL}/user/api/users`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({
            ...createUserData
        }),
    });
    if (!res.ok) throw new Error("Failed to create user");
}

export async function updateUser(userid: string, data: Partial<User>) {
    const accessToken = getCookie("accessToken");

    const updateData: UserUpdate = {
        userId: userid,
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        role: data.role || "",
        password: data.password || "",
        birthday: String(data.birthday).split("T")[0],
        gender: data.gender || "",
        address: data.address || "",
        status: data.status || ""
    };


    const res = await fetch(`${API_BASE_URL}/user/api/users/${userid}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify(updateData),
    });

    if (!res.ok) {
        const msg = await res.text();
        //throw new Error(msg || "Update failed");
        console.error("Failed to update user:", msg);
    }
}

export async function adminDashboardStats() {
    try {
        const accessToken = getCookie("accessToken");

        const data = await fetch(`${API_BASE_URL}/user/api/users/dashboard-stats`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
            },
        });
        if (!data.ok) {
            const msg = await data.text();
            throw new Error(msg || "Failed to fetch dashboard stats");
        }
        return data.json();
    }
    catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw error;
    };
}