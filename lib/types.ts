export type GroupLink = {
  id: string;
  group_id: string;
  label: string;
  url: string;
  position: number;
};

export type Group = {
  id: string;
  slug: string;
  title: string;
  icon_url: string | null;
  position: number;
  created_at: string;
};

export type GroupWithLinks = Group & {
  links: GroupLink[];
};

export type Database = {
  public: {
    Tables: {
      groups: {
        Row: Group;
        Insert: {
          id?: string;
          slug: string;
          title: string;
          icon_url?: string | null;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          icon_url?: string | null;
          position?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      group_links: {
        Row: GroupLink;
        Insert: {
          id?: string;
          group_id: string;
          label: string;
          url: string;
          position?: number;
        };
        Update: {
          id?: string;
          group_id?: string;
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
