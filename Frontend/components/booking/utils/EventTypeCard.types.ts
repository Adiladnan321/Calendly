export type EventType = {
  id: string;
  name: string;
  slug: string;
  duration: number;
  color: string;
};

export type EventTypeCardProps = {
  event: EventType;
  username: string;
};
