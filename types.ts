
// These types can be generated automatically using the Supabase CLI:
// npx supabase gen types typescript --project-id <your-project-id> > types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          client_id: string
          created_at: string
          destination: string
          id: string
          pickup: string
          price: number
          status: string
        }
        Insert: {
          client_id: string
          created_at?: string
          destination: string
          id?: string
          pickup: string
          price: number
          status?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          destination?: string
          id?: string
          pickup?: string
          price?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          client_id: string
          comment: string | null
          created_at: string
          id: string
          order_id: string
          rating: number
        }
        Insert: {
          client_id: string
          comment?: string | null
          created_at?: string
          id?: string
          order_id: string
          rating: number
        }
        Update: {
          client_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          order_id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Order = Database['public']['Tables']['orders']['Row'];
export type NewOrder = Database['public']['Tables']['orders']['Insert'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type NewReview = Database['public']['Tables']['reviews']['Insert'];
