export interface User {
  userId: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  birthday: string;
  gender?: "Male" | "Female";
  address?: string;
  role: "Learner" | "Expert" | "Admin";
  status: "active" | "inactive";
  avatar_url?: string;
  createdAt: string;
  updatedAt: string;

  profile?: ExpertProfile;
}

export interface ExpertProfile {
  eid: string;
  ssn: string;
  bio_quote: string;
  education_detail: string;
  title_position: string;
  expertise_skill: string;
  social_link: string;
}

export interface UserUpdate {
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  birthday: string;
  gender: string;
  address: string;
  status: string;
}

export interface CreateUserRequest {
  userId: string,
  name: string,
  email: string,
  password: string,
  phone: string | null,
  birthday: string,
  gender: string,
  address: string | null,
  status: string,
  role: string
}

export interface AdminDashboardStats {
  increase_user: number;
  total_learners: number;
  total_experts: number;
  total_admins: number;
  total_active_users: number;
}