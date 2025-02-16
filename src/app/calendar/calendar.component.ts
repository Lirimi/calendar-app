import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { CalendarService } from './calendar.service';
import { Observable, Subject, interval, takeUntil } from 'rxjs';
import { Event } from './models/event.model';
import { CalendarView } from './models/calendar-view.enum';
import { CalendarDayViewComponent } from './layout/calendar-day-view/calendar-day-view.component';
import { CalendarMonthViewComponent } from './layout/calendar-month-view/calendar-month-view.component';
import { CalendarWeekViewComponent } from './layout/calendar-week-view/calendar-week-view.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  template: `<div>
      <label>View: {{ selectedDate() }}</label>
      <input
        type="radio"
        name="calendarView"
        value="day"
        (change)="switchView(CalendarView.Day)"
        [checked]="currentView() === CalendarView.Day"
      />
      Day
      <input
        type="radio"
        name="calendarView"
        value="week"
        (change)="switchView(CalendarView.Week)"
        [checked]="currentView() === CalendarView.Week"
      />
      Week
      <input
        type="radio"
        name="calendarView"
        value="month"
        (change)="switchView(CalendarView.Month)"
        [checked]="currentView() === CalendarView.Month"
      />
      Month
      <button (click)="addRandomEvent()">Add Event</button>
    </div>
    @switch (currentView()) { @case('day') {
    <app-calendar-day-view
      [events]="(events$ | async)!"
      [currentDate]="selectedDate()"
      (dateChanged)="changeDate($event)"
    ></app-calendar-day-view>
    } @case('week') {
    <app-calendar-week-view
      [events]="(events$ | async)!"
      [currentDate]="selectedDate()"
      (dateChanged)="changeDate($event)"
    ></app-calendar-week-view>
    } @case('month') {
    <app-calendar-month-view
      [events]="(events$ | async)!"
      [currentDate]="selectedDate()"
      (dateChanged)="changeDate($event)"
    ></app-calendar-month-view>
    } @default {
    <app-calendar-month-view
      [events]="(events$ | async)!"
      [currentDate]="selectedDate()"
      (dateChanged)="changeDate($event)"
    ></app-calendar-month-view>
    } }`,
  styles: ``,
  imports: [
    CalendarDayViewComponent,
    CalendarMonthViewComponent,
    CalendarWeekViewComponent,
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private calendarService = inject(CalendarService);
  private scheduler: any;

  currentView = signal<CalendarView>(CalendarView.Month);
  events$!: Observable<Event[]>;
  CalendarView = CalendarView;
  selectedDate = signal(new Date());

  ngOnInit(): void {
    this.refresh();
    this.startScheduler();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearInterval(this.scheduler);
  }

  switchView(view: CalendarView): void {
    this.currentView.set(view);
  }

  changeDate(newDate: Date): void {
    this.selectedDate.set(newDate);
  }

  private refresh(): void {
    this.events$ = this.calendarService.getEvents();

    // used as an example on how we can subscribe to the observable and consume the data inside subsribe block
    // takeUntil operator is used to unsubscribe from the observable when the component is destroyed
    // this example is not used in the code as we pass the events instead using the async pipe
    this.calendarService.getEvents().pipe(takeUntil(this.destroy$)).subscribe();
  }

  addRandomEvent(): void {
    const selectedMonth = this.selectedDate().getMonth();
    const selectedYear = this.selectedDate().getFullYear();
    const randomDay = Math.floor(Math.random() * 28) + 1;
    const randomHour = Math.floor(Math.random() * 23);
    const randomMinutes = Math.floor(Math.random() * 59);
    const startDate = new Date(
      selectedYear,
      selectedMonth,
      randomDay,
      randomHour,
      randomMinutes
    );
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 2);

    const newEvent: Event = {
      name: `Event ${Math.floor(Math.random() * 1000)}`,
      description: 'Generated Event',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      location: `Random Location ${Math.floor(Math.random() * 5)}`,
      guests: [
        {
          name: 'GuestX',
          email: 'guestX@example.com',
          position: 'Speaker',
        },
      ],
    };

    this.calendarService.addEvent(newEvent);
  }

  private startScheduler(): void {
    this.scheduler = setInterval(() => {
      this.refresh();
    }, 20000);
  }
}
