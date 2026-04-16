export type EventType = {
  id: string;
  name: string;
  slug: string;
  duration: number;
  color: string;
  isActive: boolean;
  scheduleId?: string | null;
  schedule?: {
    id: string;
    name: string;
  } | null;
};

export type Availability = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

export type Schedule = {
  id: string;
  name: string;
  isDefault: boolean;
  availability: Availability[];
};

export type Booking = {
  id: string;
  inviteeName: string;
  inviteeEmail: string;
  startTime: string;
  endTime: string;
  status: string;
  eventType: {
    id: string;
    name: string;
    slug: string;
    duration: number;
    color: string;
  };
};
