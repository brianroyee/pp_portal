export interface Submission {
  id: string;
  username: string;
  email: string;
  name: string;
  prompt: string;
  image_url?: string;
  submitted_at: string;
  status: "pending" | "selected" | "rejected";
}