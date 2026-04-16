import type { EventType, Schedule } from "@/lib/types";

export interface EventTypesHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
  onCreateClick: () => void;
}

export interface EventTypesListProps {
  items: EventType[];
  loading: boolean;
  error: string | null;
  menuOpenFor: string | null;
  copiedId: string | null;
  onToggleActive: (id: string, currentStatus: boolean | undefined) => void;
  onMenuToggle: (id: string | null) => void;
  onCopyLink: (id: string, slug: string) => void;
  onEdit?: (item: EventType) => void;
  onDelete?: (id: string) => void;
}

export interface EventTypeItemProps {
  item: EventType;
  isActive: boolean;
  menuOpenFor: string | null;
  copiedId: string | null;
  onToggleActive: (id: string, currentStatus: boolean | undefined) => void;
  onMenuToggle: (id: string | null) => void;
  onCopyLink: (id: string, slug: string) => void;
  onEdit?: (item: EventType) => void;
  onDelete?: (id: string) => void;
}

export interface CreatePayload {
  name: string;
  slug: string;
  duration: number;
  color: string;
  scheduleId?: string;
}

export interface CreateEventTypeModalProps {
  isOpen: boolean;
  isEdit?: boolean;
  payload: CreatePayload;
  schedules: Schedule[];
  loading: boolean;
  onClose: () => void;
  onChange: (payload: CreatePayload) => void;
  onSubmit: (e: React.FormEvent) => void;
}
