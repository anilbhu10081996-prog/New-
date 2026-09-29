export type UserRole = 'user' | 'worker' | 'admin';

export type MembershipTier = 'free' | 'silver' | 'gold' | 'platinum';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  address?: string;
  membership: MembershipTier;
  is_verified?: boolean;
  created_at: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  price_starting: number;
  icon: string;
  rating: number;
  reviews_count: number;
  description: string;
  popular?: boolean;
  delivery_time: string;
}

export interface WorkerProfile {
  id: string;
  name: string;
  category: string;
  rating: number;
  jobs_completed: number;
  hourly_rate: number;
  location: string;
  phone: string;
  experience_years: number;
  verified: boolean;
  skills: string[];
  available: boolean;
  avatar: string;
}

export interface BusinessProfile {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  category: string;
  sub_category?: string;
  location: string;
  address: string;
  whatsapp?: string;
  google_maps_url?: string;
  home_delivery: boolean;
  service_area?: string;
  opening_hours?: string;
  description: string;
  published: boolean;
  created_at: string;
}

export interface WorkPost {
  id: string;
  user_id: string;
  user_name: string;
  title: string;
  category: string;
  budget: number;
  timeline: string;
  address: string;
  phone: string;
  description: string;
  status: 'open' | 'assigned' | 'completed';
  created_at: string;
  applicants_count: number;
}

export interface ProductItem {
  id: string;
  title: string;
  category: string;
  price: number;
  original_price: number;
  rating: number;
  reviews_count: number;
  image: string;
  description: string;
  in_stock: boolean;
  specifications: string[];
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  user_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: CartItem[];
  total_amount: number;
  status: 'placed' | 'confirmed' | 'dispatched' | 'delivered';
  payment_method: 'cod' | 'upi';
  created_at: string;
}

export interface ServiceBooking {
  id: string;
  service_id: string;
  service_title: string;
  user_id: string;
  customer_name: string;
  customer_phone: string;
  service_address: string;
  booking_date: string;
  booking_time: string;
  estimated_price: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

export interface DeliveryBooking {
  id: string;
  user_id: string;
  sender_name: string;
  sender_phone: string;
  sender_address: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;
  weight_kg: number;
  parcel_type: string;
  urgent: boolean;
  price: number;
  tracking_number: string;
  status: 'pickup_scheduled' | 'picked_up' | 'in_transit' | 'delivered';
  created_at: string;
}

export interface JobVacancy {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_range: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  category: string;
  openings: number;
  requirements: string[];
  contact_email: string;
  posted_at: string;
}

export interface EducationCourse {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  level: string;
  lessons_count: number;
  students_enrolled: number;
  rating: number;
  price: number;
  is_free: boolean;
  category: string;
  description: string;
  thumbnail: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'alert';
  time: string;
  read: boolean;
}

// CRACK EXAM TYPES
export interface ExamQuestion {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'A' | 'B' | 'C' | 'D';
  solution_explanation: string;
  image_url?: string;
  marks: number;
  negative_marks: number;
}

export interface ExamFolder {
  id: string;
  name: string;
  parent_folder_id?: string | null;
  description: string;
  icon?: string;
  is_published: boolean;
  status: 'active' | 'inactive';
  created_at?: string;
  tests_count?: number;
}

export interface ExamTest {
  id: string;
  title: string;
  folder_id: string;
  folder_name?: string;
  duration_minutes: number;
  total_marks: number;
  passing_percentage: number;
  positive_marks: number;
  negative_marks: number;
  price?: number;
  offer_price?: number;
  access_type?: 'free' | 'paid';
  is_published: boolean; // Normal user sees ONLY published tests! Admin sees all
  status?: 'draft' | 'under_review' | 'verified' | 'published';
  created_at: string;
  questions: ExamQuestion[];
  attempts_count: number;
  instructions: string;
}

export interface UserExamAttempt {
  id: string;
  test_id: string;
  test_title: string;
  folder_name: string;
  user_id: string;
  user_name: string;
  user_email: string;
  score: number;
  total_marks: number;
  accuracy_percentage: number;
  time_taken_seconds: number;
  attempted_at: string;
  answers: Record<string, 'A' | 'B' | 'C' | 'D' | ''>;
  marks_breakdown: {
    correct: number;
    incorrect: number;
    unattempted: number;
    negative_deducted: number;
  };
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  lastChecked?: string;
}
