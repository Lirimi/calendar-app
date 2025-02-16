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

  filteredEvents: Event[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentDate'] || changes['events']) {
      this.filterEventsToCurrentDate();
    }
  }

  private filterEventsToCurrentDate(): void {
    this.filteredEvents = this.events.filter(
      (event) =>
        new Date(event.startDate).toDateString() ===
        this.currentDate.toDateString()
    );
  }

  previousDay(): void {
    const newDate = new Date(this.currentDate);
    newDate.setDate(newDate.getDate() - 1);
    this.dateChanged.emit(newDate);
  }

  nextDay(): void {
    const newDate = new Date(this.currentDate);
    newDate.setDate(newDate.getDate() + 1);
    this.dateChanged.emit(newDate);
  }

  getHours(eventDate: string, hour: string): boolean {
    return new Date(eventDate).getHours() == +hour.split(':')[0];
  }

  get hours(): string[] {
    return [...Array(24).keys()].map((hour) => `${hour}:00`);
  }
}
