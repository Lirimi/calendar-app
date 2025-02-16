import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Event } from './models/event.model';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private eventsSubject = new BehaviorSubject<Event[]>([
    {
      name: 'Event 1',
      description: 'Description for Event 1',
      startDate: '2025-02-16T10:00:00Z',
      endDate: '2025-02-16T13:00:00Z',
      location: 'Location 1',
      guests: [
        { name: 'Guest 1', email: 'guest1@example.com', position: 'Speaker' },
      ],
    },
    {
      name: 'Event 2',
      description: 'Description for Event 2',
      startDate: '2024-06-11T14:00:00Z',
      endDate: '2024-06-11T16:00:00Z',
      location: 'Location 2',
      guests: [
        { name: 'Guest 2', email: 'guest2@example.com', position: 'Panelist' },
      ],
    },
  ]);

  getEvents(): Observable<Event[]> {
    return this.eventsSubject.asObservable();
  }

  addEvent(event: Event): void {
    const currentEvents = this.eventsSubject.value;
    this.eventsSubject.next([...currentEvents, event]);
  }

  removeEvent(index: number): void {
    const currentEvents = this.eventsSubject.value;
    if (index < 0 || index >= currentEvents.length) return;

    const updatedEvents = [...currentEvents];
    updatedEvents.splice(index, 1);

    this.eventsSubject.next(updatedEvents);
  }

  removeRandomEvent(): void {
    const currentEvents = this.eventsSubject.value;
    if (currentEvents.length === 0) return;

    // Remove a random event
    const randomIndex = Math.floor(Math.random() * currentEvents.length);
    const updatedEvents = currentEvents.filter((_, idx) => idx !== randomIndex);

    this.eventsSubject.next(updatedEvents);
  }
}
