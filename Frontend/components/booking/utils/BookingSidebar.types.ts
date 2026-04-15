import { PublicPayload, PublicSlot } from "./sharedTypes";

export interface BookingSidebarProps {
  payload: PublicPayload | null;
  selectedSlot: PublicSlot | null;
}
