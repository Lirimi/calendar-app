import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { Event } from '../../models/event.model';
import { CommonModule } from '@angular/common';

type HoursToDisplay = Record<string, { event: Event; duration: number }>;

@Component({
  selector: 'app-calendar-day-view',
  templateUrl: './calendar-day-view.component.html',
  styleUrls: ['./calendar-day-view.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarDayViewComponent implements OnChanges {
  @Input() currentDate!: Date;
  @Input() events: Event[] = [];
  @Output() dateChanged = new EventEmitter<Date>();

  hoursToDisplay = signal<HoursToDisplay>({});

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentDate'] || changes['events']) {
      this.updateView();
    }
  }

  changeDay(offset: number): void {
    const newDate = new Date(this.currentDate);
    newDate.setDate(newDate.getDate() + offset);
    this.dateChanged.emit(newDate);
  }

  private updateView(): void {
    this.hoursToDisplay.set(this.computeEventsForDay());
  }

  private computeEventsForDay(): HoursToDisplay {
    return this.filterEventsBySelectedDate().reduce((acc, event) => {
      const startHour = this.getHour(event.startDate);
      const endHour = this.getHour(event.endDate);
      acc[`${startHour}:00`] = { event, duration: endHour - startHour + 1 };
      return acc;
    }, {} as Record<string, { event: Event; duration: number }>);
  }

  private filterEventsBySelectedDate(): Event[] {
    return this.events.filter((event) =>
      this.isSameDay(new Date(event.startDate), this.currentDate)
    );
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  private getHour(date: string | Date): number {
    return new Date(date).getHours();
  }

  get hours(): string[] {
    return Array.from({ length: 24 }, (_, hour) => `${hour}:00`);
  }
}
