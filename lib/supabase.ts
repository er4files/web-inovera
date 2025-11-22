import { createClient } from '@supabase/supabase-js';

// Hanya gunakan environment variables, jangan ada fallback hardcoded
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


export interface Blog {
  id: string;
  title: string;
  paragraph: string;
  content: string;
  image_url: string | null;
  tags: string[];
  category: string | null;
  publish_date: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  created_at: string;
  updated_at: string;
}

// ==================== AUTH FUNCTIONS ====================

// Login user
export async function loginUser(username: string, password: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error) {
      console.error('Error logging in:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in loginUser:', error);
    return null;
  }
}

// Check if user is authenticated (client-side)
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  const authData = localStorage.getItem('auth_user');
  if (!authData) return false;

  try {
    const { timestamp } = JSON.parse(authData);
    const now = Date.now();
    const FIVE_MINUTES = 5 * 60 * 1000; // 5 minutes in milliseconds

    // Check if session expired (more than 5 minutes)
    if (now - timestamp > FIVE_MINUTES) {
      localStorage.removeItem('auth_user');
      return false;
    }

    return true;
  } catch (error) {
    localStorage.removeItem('auth_user');
    return false;
  }
}

// Save auth user to localStorage
export function saveAuthUser(user: User): void {
  if (typeof window === 'undefined') return;
  
  const authData = {
    id: user.id,
    username: user.username,
    timestamp: Date.now()
  };
  localStorage.setItem('auth_user', JSON.stringify(authData));
}

// Get current auth user
export function getAuthUser(): { id: string; username: string; timestamp: number } | null {
  if (typeof window === 'undefined') return null;
  
  const authData = localStorage.getItem('auth_user');
  if (!authData) return null;

  try {
    return JSON.parse(authData);
  } catch (error) {
    return null;
  }
}

// Update activity timestamp (call this on user actions)
export function updateActivityTimestamp(): void {
  if (typeof window === 'undefined') return;
  
  const authData = localStorage.getItem('auth_user');
  if (!authData) return;

  try {
    const data = JSON.parse(authData);
    data.timestamp = Date.now();
    localStorage.setItem('auth_user', JSON.stringify(data));
  } catch (error) {
    console.error('Error updating timestamp:', error);
  }
}

// Logout user
export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_user');
}

// ==================== BLOG FUNCTIONS ====================

// Upload image ke Supabase Storage
export async function uploadImage(file: File): Promise<string | null> {
  try {
    console.log('Starting image upload...', file.name);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    console.log('Upload successful:', uploadData);

    const { data } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    console.log('Public URL:', data.publicUrl);
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

// Delete image dari Supabase Storage
export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    
    if (!fileName) return false;

    const { error } = await supabase.storage
      .from('blog-images')
      .remove([fileName]);

    if (error) {
      console.error('Error deleting image:', error);
      throw error;
    }

    console.log('Image deleted successfully:', fileName);
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

// Get all blogs
export async function getAllBlogs(): Promise<Blog[]> {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('publish_date', { ascending: false });

    if (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllBlogs:', error);
    return [];
  }
}

// Get blog by ID
export async function getBlogById(id: string): Promise<Blog | null> {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching blog:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getBlogById:', error);
    return null;
  }
}

// Create new blog
export async function createBlog(blog: Omit<Blog, 'id' | 'created_at' | 'updated_at'>): Promise<Blog | null> {
  try {
    console.log('Creating blog with data:', blog);
    
    const { data, error } = await supabase
      .from('blogs')
      .insert([blog])
      .select()
      .single();

    if (error) {
      console.error('Error creating blog:', error);
      throw error;
    }

    console.log('Blog created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createBlog:', error);
    return null;
  }
}

// Update existing blog
export async function updateBlog(id: string, blog: Partial<Blog>): Promise<Blog | null> {
  try {
    console.log('Updating blog:', id, blog);
    
    const { data, error } = await supabase
      .from('blogs')
      .update(blog)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog:', error);
      throw error;
    }

    console.log('Blog updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in updateBlog:', error);
    return null;
  }
}

// Delete blog
export async function deleteBlog(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }

    console.log('Blog deleted successfully:', id);
    return true;
  } catch (error) {
    console.error('Error in deleteBlog:', error);
    return false;
  }
}