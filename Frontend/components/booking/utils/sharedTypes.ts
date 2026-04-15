export type PublicSlot = {
  start: string;
  end: string;
  startLabel: string;
  endLabel: string;
};

export type PublicPayload = {
  user: {
    name: string;
    timezone: string;
  };
  eventType: {
    id: string;
    name: string;
    duration: number;
    color: string;
  };
  slots: PublicSlot[];
};
