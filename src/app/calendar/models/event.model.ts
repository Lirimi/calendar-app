import { Guest } from './guest.model';

export interface Event {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  guests: Guest[];
}
