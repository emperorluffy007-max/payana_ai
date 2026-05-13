export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      alerts: {
        Row: {
          created_at: string | null;
          id: string;
          message: string;
          timestamp: string;
          title: string;
          type: string;
        };
        Insert: {
          created_at?: string | null;
          id: string;
          message: string;
          timestamp: string;
          title: string;
          type: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          message?: string;
          timestamp?: string;
          title?: string;
          type?: string;
        };
        Relationships: [];
      };
      bus_stops: {
        Row: {
          created_at: string | null;
          id: string;
          lat: number;
          lng: number;
          name: string;
        };
        Insert: {
          created_at?: string | null;
          id: string;
          lat: number;
          lng: number;
          name: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          lat?: number;
          lng?: number;
          name?: string;
        };
        Relationships: [];
      };
      buses: {
        Row: {
          crowd_level: string;
          delay: number;
          eta: number;
          id: string;
          is_best_route: boolean;
          lat: number;
          lng: number;
          next_bus_eta: number;
          occupancy: number;
          route: string;
          route_name: string;
          stops: string[];
          updated_at: string | null;
        };
        Insert: {
          crowd_level: string;
          delay: number;
          eta: number;
          id: string;
          is_best_route?: boolean;
          lat: number;
          lng: number;
          next_bus_eta: number;
          occupancy: number;
          route: string;
          route_name: string;
          stops: string[];
          updated_at?: string | null;
        };
        Update: {
          crowd_level?: string;
          delay?: number;
          eta?: number;
          id?: string;
          is_best_route?: boolean;
          lat?: number;
          lng?: number;
          next_bus_eta?: number;
          occupancy?: number;
          route?: string;
          route_name?: string;
          stops?: string[];
          updated_at?: string | null;
        };
        Relationships: [];
      };
      leaderboard_entries: {
        Row: {
          area: string;
          co2_saved: number;
          id: string;
          name: string;
          points: number;
          rank: number;
        };
        Insert: {
          area: string;
          co2_saved: number;
          id?: string;
          name: string;
          points: number;
          rank: number;
        };
        Update: {
          area?: string;
          co2_saved?: number;
          id?: string;
          name?: string;
          points?: number;
          rank?: number;
        };
        Relationships: [];
      };
      metro_lines: {
        Row: {
          color: string;
          id: string;
          name: string;
          path: Json;
        };
        Insert: {
          color: string;
          id: string;
          name: string;
          path: Json;
        };
        Update: {
          color?: string;
          id?: string;
          name?: string;
          path?: Json;
        };
        Relationships: [];
      };
      metro_stations: {
        Row: {
          id: string;
          lat: number;
          line: string;
          lng: number;
          name: string;
        };
        Insert: {
          id: string;
          lat: number;
          line: string;
          lng: number;
          name: string;
        };
        Update: {
          id?: string;
          lat?: number;
          line?: string;
          lng?: number;
          name?: string;
        };
        Relationships: [];
      };
      metro_trains: {
        Row: {
          id: string;
          lat: number;
          line: string;
          lng: number;
          next_station: string;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          lat: number;
          line: string;
          lng: number;
          next_station: string;
          status: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          lat?: number;
          line?: string;
          lng?: number;
          next_station?: string;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      route_info: {
        Row: {
          area: string;
          crowd_level: string;
          duration: string;
          frequency: string;
          from_area: string;
          id: string;
          route: string;
          to_area: string;
        };
        Insert: {
          area: string;
          crowd_level: string;
          duration: string;
          frequency: string;
          from_area: string;
          id: string;
          route: string;
          to_area: string;
        };
        Update: {
          area?: string;
          crowd_level?: string;
          duration?: string;
          frequency?: string;
          from_area?: string;
          id?: string;
          route?: string;
          to_area?: string;
        };
        Relationships: [];
      };
      transfer_routes: {
        Row: {
          from_area: string;
          id: string;
          routes: string[];
          time_saved: number;
          to_area: string;
          transfers: number;
        };
        Insert: {
          from_area: string;
          id: string;
          routes: string[];
          time_saved: number;
          to_area: string;
          transfers: number;
        };
        Update: {
          from_area?: string;
          id?: string;
          routes?: string[];
          time_saved?: number;
          to_area?: string;
          transfers?: number;
        };
        Relationships: [];
      };
      trip_history: {
        Row: {
          co2_saved: number;
          crowd_level: string;
          date: string;
          duration: string;
          id: string;
          route: string;
        };
        Insert: {
          co2_saved: number;
          crowd_level: string;
          date: string;
          duration: string;
          id: string;
          route: string;
        };
        Update: {
          co2_saved?: number;
          crowd_level?: string;
          date?: string;
          duration?: string;
          id?: string;
          route?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
