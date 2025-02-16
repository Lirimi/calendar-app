import { Event } from './models/event.model';

export class CalendarUtil {
  static getMonthDays(currentDate: Date): string[] {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, month, i + 1).toISOString().split('T')[0]
    );
  }

  static getMonthFilteredEvents(
    events: Event[],
    eventStartDate: Date
  ): { [day: string]: Event[] } {
    const filteredEventsBasedOnMotth = events.reduce((acc, event) => {
      const eventDate = new Date(eventStartDate).toISOString().split('T')[0];
      if (!acc[eventDate]) {
        acc[eventDate] = [];
      }
      acc[eventDate].push(event);
      return acc;
    }, {} as { [day: string]: Event[] });
    return filteredEventsBasedOnMotth;
  }

  // add other helper functions here and use them in the components or inside the class itself for better abstraction as needed
}
