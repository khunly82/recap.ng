import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CalendarOptions, EventClickArg, EventDropArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EditComponent } from './components/edit/edit.component';
import { EventService } from './services/event.service';
import { EventModel } from './models/event.model';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    EditComponent,
    ToastModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  options: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    editable: true,

    eventClick: (e: EventClickArg) => {
      this.selectedEvent = { 
        id: parseInt(e.event.id),
        title: e.event.title, 
        end: e.event.endStr, 
        start: e.event.startStr,
      }
      this.dialogVisible = true;
    },

    eventDrop: (e: EventDropArg) => {
      const event = {
        title: e.event.title,
        end: e.event.endStr,
        start: e.event.startStr
      }
      this._eventService.update(e.event.id, event).subscribe(() => {
        
      })
    }
  }

  selectedEvent: EventModel|null = null;

  events: any[] = [
  ];

  dialogVisible: boolean = false;

  constructor(private readonly _eventService: EventService) {
    this.loadEvents();
  }

  openDialog() {
    this.dialogVisible = true;
  }

  onEditClose(confirm: boolean) {
    if(confirm) {
      this.loadEvents();
    }
    this.dialogVisible = false;
  }

  loadEvents() {
    this._eventService.getAll().subscribe((data) => {
      this.events = data;
    })
  }
}

