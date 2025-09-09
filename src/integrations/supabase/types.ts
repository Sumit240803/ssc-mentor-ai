export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      chat_conversations: {
        Row: {
          completion_tokens: number | null
          content_id: string | null
          created_at: string | null
          id: string
          message_context: Json | null
          message_order: number | null
          message_text: string
          message_type: string
          model_used: string | null
          profile_id: string
          prompt_tokens: number | null
          response_time_ms: number | null
          session_id: string
          total_tokens: number | null
          user_rating: number | null
          was_helpful: boolean | null
        }
        Insert: {
          completion_tokens?: number | null
          content_id?: string | null
          created_at?: string | null
          id?: string
          message_context?: Json | null
          message_order?: number | null
          message_text: string
          message_type: string
          model_used?: string | null
          profile_id: string
          prompt_tokens?: number | null
          response_time_ms?: number | null
          session_id: string
          total_tokens?: number | null
          user_rating?: number | null
          was_helpful?: boolean | null
        }
        Update: {
          completion_tokens?: number | null
          content_id?: string | null
          created_at?: string | null
          id?: string
          message_context?: Json | null
          message_order?: number | null
          message_text?: string
          message_type?: string
          model_used?: string | null
          profile_id?: string
          prompt_tokens?: number | null
          response_time_ms?: number | null
          session_id?: string
          total_tokens?: number | null
          user_rating?: number | null
          was_helpful?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_with_summaries"
            referencedColumns: ["content_id"]
          },
          {
            foreignKeyName: "chat_conversations_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "study_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_activity_stats"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "chat_conversations_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions_with_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          avg_response_time_ms: number | null
          content_id: string | null
          created_at: string | null
          ended_at: string | null
          id: string
          is_active: boolean | null
          message_count: number | null
          profile_id: string
          session_id: string
          session_name: string | null
          session_type: string | null
          topic_context: string | null
          total_response_time_ms: number | null
          updated_at: string | null
        }
        Insert: {
          avg_response_time_ms?: number | null
          content_id?: string | null
          created_at?: string | null
          ended_at?: string | null
          id?: string
          is_active?: boolean | null
          message_count?: number | null
          profile_id: string
          session_id: string
          session_name?: string | null
          session_type?: string | null
          topic_context?: string | null
          total_response_time_ms?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_response_time_ms?: number | null
          content_id?: string | null
          created_at?: string | null
          ended_at?: string | null
          id?: string
          is_active?: boolean | null
          message_count?: number | null
          profile_id?: string
          session_id?: string
          session_name?: string | null
          session_type?: string | null
          topic_context?: string | null
          total_response_time_ms?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_sessions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_activity_stats"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      content_summaries: {
        Row: {
          api_cost: number | null
          compression_ratio: number | null
          content_id: string
          content_length: number | null
          created_at: string | null
          generated_at: string | null
          generation_time_ms: number | null
          id: string
          keyword_density: Json | null
          model_used: string | null
          prompt_version: string | null
          readability_score: number | null
          summary_length: number | null
          summary_text: string
          summary_type: string
          updated_at: string | null
        }
        Insert: {
          api_cost?: number | null
          compression_ratio?: number | null
          content_id: string
          content_length?: number | null
          created_at?: string | null
          generated_at?: string | null
          generation_time_ms?: number | null
          id?: string
          keyword_density?: Json | null
          model_used?: string | null
          prompt_version?: string | null
          readability_score?: number | null
          summary_length?: number | null
          summary_text: string
          summary_type: string
          updated_at?: string | null
        }
        Update: {
          api_cost?: number | null
          compression_ratio?: number | null
          content_id?: string
          content_length?: number | null
          created_at?: string | null
          generated_at?: string | null
          generation_time_ms?: number | null
          id?: string
          keyword_density?: Json | null
          model_used?: string | null
          prompt_version?: string | null
          readability_score?: number | null
          summary_length?: number | null
          summary_text?: string
          summary_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_summaries_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_with_summaries"
            referencedColumns: ["content_id"]
          },
          {
            foreignKeyName: "content_summaries_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "study_content"
            referencedColumns: ["id"]
          },
        ]
      }
      lectures: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          difficulty_level: string | null
          duration_minutes: number
          id: string
          is_published: boolean | null
          subject: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string | null
          view_count: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number
          id?: string
          is_published?: boolean | null
          subject: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
          view_count?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number
          id?: string
          is_published?: boolean | null
          subject?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      mock_test_results: {
        Row: {
          answered_questions: number
          correct_answers: number
          created_at: string
          id: string
          incorrect_answers: number
          percentage: number
          score: number
          section_wise_scores: Json | null
          test_date: string
          time_taken_seconds: number
          total_questions: number
          unanswered_questions: number
          updated_at: string
          user_id: string
        }
        Insert: {
          answered_questions: number
          correct_answers: number
          created_at?: string
          id?: string
          incorrect_answers: number
          percentage: number
          score: number
          section_wise_scores?: Json | null
          test_date?: string
          time_taken_seconds: number
          total_questions: number
          unanswered_questions: number
          updated_at?: string
          user_id: string
        }
        Update: {
          answered_questions?: number
          correct_answers?: number
          created_at?: string
          id?: string
          incorrect_answers?: number
          percentage?: number
          score?: number
          section_wise_scores?: Json | null
          test_date?: string
          time_taken_seconds?: number
          total_questions?: number
          unanswered_questions?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivational_content: {
        Row: {
          author: string | null
          category: string | null
          content: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean | null
          is_daily: boolean | null
          likes_count: number | null
          title: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_daily?: boolean | null
          likes_count?: number | null
          title?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_daily?: boolean | null
          likes_count?: number | null
          title?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          payment_method: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          payment_method?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          payment_method?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string | null
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          exam_type: string | null
          full_name: string | null
          id: string
          last_active: string | null
          payment_status: string | null
          preferences: Json | null
          study_streak: number | null
          total_sessions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          exam_type?: string | null
          full_name?: string | null
          id?: string
          last_active?: string | null
          payment_status?: string | null
          preferences?: Json | null
          study_streak?: number | null
          total_sessions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          exam_type?: string | null
          full_name?: string | null
          id?: string
          last_active?: string | null
          payment_status?: string | null
          preferences?: Json | null
          study_streak?: number | null
          total_sessions?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_content: {
        Row: {
          content_length: number | null
          content_type: string | null
          created_at: string | null
          file_path: string | null
          file_size: number | null
          filename: string
          formatted_content: string | null
          id: string
          page_count: number | null
          processed_at: string | null
          processing_error: string | null
          processing_status: string | null
          scraped_content: Json | null
          storage_url: string | null
          subject_id: string
          updated_at: string | null
        }
        Insert: {
          content_length?: number | null
          content_type?: string | null
          created_at?: string | null
          file_path?: string | null
          file_size?: number | null
          filename: string
          formatted_content?: string | null
          id?: string
          page_count?: number | null
          processed_at?: string | null
          processing_error?: string | null
          processing_status?: string | null
          scraped_content?: Json | null
          storage_url?: string | null
          subject_id: string
          updated_at?: string | null
        }
        Update: {
          content_length?: number | null
          content_type?: string | null
          created_at?: string | null
          file_path?: string | null
          file_size?: number | null
          filename?: string
          formatted_content?: string | null
          id?: string
          page_count?: number | null
          processed_at?: string | null
          processing_error?: string | null
          processing_status?: string | null
          scraped_content?: Json | null
          storage_url?: string | null
          subject_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "study_content_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          created_at: string | null
          id: string
          sub_subject: string
          subject: string
          subtopic: string
          topic: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          sub_subject: string
          subject: string
          subtopic: string
          topic: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          sub_subject?: string
          subject?: string
          subtopic?: string
          topic?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_completed: boolean | null
          priority: string | null
          scheduled_date: string | null
          scheduled_time: string | null
          subject: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_completed?: boolean | null
          priority?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          subject: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_completed?: boolean | null
          priority?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          subject?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          created_at: string
          current_streak: number | null
          id: string
          last_activity_date: string | null
          lectures_completed: number | null
          motivation_score: number | null
          study_hours_total: number | null
          tasks_completed_today: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          lectures_completed?: number | null
          motivation_score?: number | null
          study_hours_total?: number | null
          tasks_completed_today?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          lectures_completed?: number | null
          motivation_score?: number | null
          study_hours_total?: number | null
          tasks_completed_today?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      chat_conversations_with_context: {
        Row: {
          completion_tokens: number | null
          content_filename: string | null
          content_id: string | null
          created_at: string | null
          full_name: string | null
          id: string | null
          message_context: Json | null
          message_order: number | null
          message_text: string | null
          message_type: string | null
          model_used: string | null
          profile_id: string | null
          prompt_tokens: number | null
          response_time_ms: number | null
          session_id: string | null
          session_name: string | null
          session_type: string | null
          sub_subject: string | null
          subject: string | null
          subtopic: string | null
          topic: string | null
          topic_context: string | null
          total_tokens: number | null
          user_id: string | null
          user_rating: number | null
          was_helpful: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_with_summaries"
            referencedColumns: ["content_id"]
          },
          {
            foreignKeyName: "chat_conversations_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "study_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_activity_stats"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "chat_conversations_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions_with_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions_with_profile: {
        Row: {
          avg_response_time_ms: number | null
          content_filename: string | null
          content_id: string | null
          created_at: string | null
          email: string | null
          ended_at: string | null
          exam_type: string | null
          full_name: string | null
          id: string | null
          is_active: boolean | null
          message_count: number | null
          profile_id: string | null
          session_id: string | null
          session_name: string | null
          session_type: string | null
          study_streak: number | null
          sub_subject: string | null
          subject: string | null
          subtopic: string | null
          topic: string | null
          topic_context: string | null
          total_response_time_ms: number | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_sessions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_activity_stats"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      content_with_summaries: {
        Row: {
          content_id: string | null
          content_length: number | null
          created_at: string | null
          enhanced_summary: string | null
          enhanced_summary_date: string | null
          file_path: string | null
          file_size: number | null
          filename: string | null
          formatted_content: string | null
          page_count: number | null
          processed_at: string | null
          processing_status: string | null
          standard_summary: string | null
          standard_summary_date: string | null
          storage_url: string | null
          sub_subject: string | null
          subject: string | null
          subtopic: string | null
          topic: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      summary_statistics: {
        Row: {
          avg_content_length: number | null
          avg_enhanced_compression: number | null
          avg_standard_compression: number | null
          enhanced_summaries: number | null
          standard_summaries: number | null
          sub_subject: string | null
          subject: string | null
          total_content: number | null
        }
        Relationships: []
      }
      user_activity_stats: {
        Row: {
          ai_responses: number | null
          avg_response_time: number | null
          chat_sessions_count: number | null
          full_name: string | null
          last_chat_session: string | null
          positive_ratings: number | null
          profile_id: string | null
          study_streak: number | null
          total_messages: number | null
          total_sessions: number | null
          user_id: string | null
          user_messages: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      exec_sql: {
        Args: { sql: string }
        Returns: string
      }
      get_admin_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_or_create_profile_by_string_id: {
        Args: { p_email?: string; p_full_name?: string; p_user_id: string }
        Returns: {
          created_at: string
          email: string
          exam_type: string
          full_name: string
          id: string
          last_active: string
          preferences: Json
          study_streak: number
          total_sessions: number
          updated_at: string
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      user_has_paid: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
