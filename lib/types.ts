export type Link = {
  id: string;
  button_id: string;
  label: string;
  url: string;
  position: number;
};

export type ButtonItem = {
  id: string;
  title: string;
  icon_url: string | null;
  position: number;
  created_at: string;
};

export type ButtonWithLinks = ButtonItem & {
  links: Link[];
};

export type Database = {
  public: {
    Tables: {
      buttons: {
        Row: ButtonItem;
        Insert: {
          id?: string;
          title: string;
          icon_url?: string | null;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          icon_url?: string | null;
          position?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      links: {
        Row: Link;
        Insert: {
          id?: string;
          button_id: string;
          label: string;
          url: string;
          position?: number;
        };
        Update: {
          id?: string;
          button_id?: string;
          label?: string;
          url?: string;
          position?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
