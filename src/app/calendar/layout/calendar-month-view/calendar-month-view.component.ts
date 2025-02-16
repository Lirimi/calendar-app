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
  selector: 'app-calendar-month-view',
  templateUrl: './calendar-month-view.component.html',
  styleUrls: ['./calendar-month-view.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarMonthViewComponent implements OnChanges {
  @Input() currentDate!: Date;
  @Input() events: Event[] = [];

  @Output() dateChanged = new EventEmitter<Date>();

  monthDays: string[] = [];
  filteredEvents: { [day: string]: Event[] } = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentDate'] || changes['events']) {
      this.monthDays = this.getMonthDays();
      this.filterEventsForMonth();
    }
  }

  private getMonthDays(): string[] {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, month, i + 1).toISOString().split('T')[0]
    );
  }

  private filterEventsForMonth(): void {
    this.filteredEvents = this.events.reduce((acc, event) => {
      const eventDate = new Date(event.startDate).toISOString().split('T')[0];
      if (!acc[eventDate]) {
        acc[eventDate] = [];
      }
      acc[eventDate].push(event);
      return acc;
    }, {} as { [day: string]: Event[] });
  }

  previousMonth(): void {
    const newDate = new Date(this.currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    this.dateChanged.emit(newDate);
  }

  nextMonth(): void {
    const newDate = new Date(this.currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    this.dateChanged.emit(newDate);
  }

  selectDate(day: string): void {
    const clickedDate = new Date(day);
    this.dateChanged.emit(clickedDate);
  }
}
