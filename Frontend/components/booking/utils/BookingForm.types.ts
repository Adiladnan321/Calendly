import { FormEvent } from "react";
import { PublicSlot } from "./sharedTypes";

export interface BookingFormProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  handleBook: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  setSelectedSlot: (slot: PublicSlot | null) => void;
  error: string | null;
}
