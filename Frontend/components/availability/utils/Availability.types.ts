import type { Schedule } from "@/lib/types";

export type DayForm = {
  enabled: boolean;
  startTime: string;
  endTime: string;
};

export interface AvailabilityEditorProps {
  schedule: Schedule;
  form: DayForm[];
  setForm: React.Dispatch<React.SetStateAction<DayForm[]>>;
  onSave: () => Promise<void>;
  loading: boolean;
  error: string | null;
  saved: string | null;
  onUpdateName?: (name: string) => Promise<void>;
  onSetDefault?: () => Promise<void>;
}

export interface SchedulesSidebarProps {
  schedules: Schedule[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}
