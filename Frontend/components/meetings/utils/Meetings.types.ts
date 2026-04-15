import { Booking } from "@/lib/types";

export interface MeetingsHeaderProps {
  filteredLength: number;
  totalLength: number;
}

export interface MeetingsTabsProps {
  tab: "upcoming" | "past" | "date_range";
  setTab: (tab: "upcoming" | "past" | "date_range") => void;
  dateRange: { start: string; end: string };
  setDateRange: (range: { start: string; end: string } | ((prev: { start: string; end: string }) => { start: string; end: string })) => void;
}

export interface MeetingsListProps {
  groupedBookings: [string, Booking[]][];
}
