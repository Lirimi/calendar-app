import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Event } from '../../models/event.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar-week-view',
  templateUrl: './calendar-week-view.component.html',
  styleUrls: ['./calendar-week-view.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarWeekViewComponent implements OnChanges {
  @Input() currentDate!: Date;
  @Input() events: Event[] = [];

  @Output() dateChanged = new EventEmitter<Date>();

  filteredEvents: Event[] = [];

  weekDays: Date[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentDate'] || changes['events']) {
      this.weekDays = this.getWeekDays();
      this.filterEventsForWeek();
    }
  }

  previousWeek(): void {
    const newDate = new Date(this.currentDate);
    newDate.setDate(newDate.getDate() - 7);
    this.dateChanged.emit(newDate);
  }

  nextWeek(): void {
    const newDate = new Date(this.currentDate);
    newDate.setDate(newDate.getDate() + 7);
    this.dateChanged.emit(newDate);
  }

  isSameDate(eventDate: string, currDay: Date, hour: string): boolean {
    return (
      new Date(eventDate).toDateString() === currDay.toDateString() &&
      new Date(eventDate).getHours() === +hour.split(':')[0]
    );
  }

  private getWeekDays(): Date[] {
    const firstDayOfWeek = new Date(this.currentDate);
    firstDayOfWeek.setDate(
      this.currentDate.getDate() - this.currentDate.getDay()
    );
    return [...Array(7).keys()].map((offset) => {
      const day = new Date(firstDayOfWeek);
      day.setDate(firstDayOfWeek.getDate() + offset);
      return day;
    });
  }

  private filterEventsForWeek(): void {
    this.filteredEvents = this.events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return this.weekDays.some(
        (day) => eventDate.toDateString() === day.toDateString()
      );
    });
  }

  get hours(): string[] {
    return [...Array(24).keys()].map((hour) => `${hour}:00`);
  }
}
