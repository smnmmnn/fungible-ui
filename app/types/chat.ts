export interface Message {
  role: "user" | "assistant";
  content: string;
  ui?: UIResponse;
}

export interface UIResponse {
  version: number;
  components: UIComponent[];
}

export interface UIComponent {
  type: "single_number" | "bar_chart";
  id: string;
  title?: string;
  data?: Record<string, any>;
}
