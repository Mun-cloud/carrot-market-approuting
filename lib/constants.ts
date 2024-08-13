export const PASSWORD_MIN_LENGTH = 4;
export const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);
export const PASSWORD_REGEX_ERROR =
  "Passwords must contain at least one UPPERCASE, lowercase, number and special characters #?!@$%^&*-";

export const CHANNEL_EVENT_NAME = "message";
export const STREAM_EVENT_NAME = "stream-message";

export const SUPABASE_URL = "https://ywcxbiotkoifuezfvjwl.supabase.co";
export const SUPABASE_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3Y3hiaW90a29pZnVlemZ2andsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE3NTA3ODEsImV4cCI6MjAzNzMyNjc4MX0.aX7EfcGrv0ljoCIpVE4jbLiGAFDGmSDlyZcAlkwiKY4";
