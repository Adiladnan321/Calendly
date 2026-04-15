import { PublicPayload, PublicSlot } from "./sharedTypes";

export interface BookingSuccessProps {
  payload: PublicPayload | null;
  selectedSlot: PublicSlot | null;
}
