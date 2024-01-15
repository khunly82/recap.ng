import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { EventService } from '../../services/event.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EventModel } from '../../models/event.model';
import { iif, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    CalendarModule,
    InputTextModule,
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnChanges {
  @Output()
  close: EventEmitter<boolean> = new EventEmitter();

  @Input()
  event: EventModel|null = null;

  formGroup: FormGroup;

  private readonly httpHandler = { 
    next: () => {
      this._messageService.add({ 
        severity: 'success', 
        summary: `Evenement ${this.event ? 'modifié' : 'ajouté'}` 
      });
      this.close.emit(true);
      this.formGroup.reset(this.defaultValue);
    }, error: (err: any) => {
      this._messageService.add({ severity: 'error', summary: err.error })
    }
  }

  private readonly defaultValue: any ={
    title: null,
    start: new Date()
  }

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _eventService: EventService,
    private readonly _messageService: MessageService,
    private readonly _confirmationService: ConfirmationService,
  ) {
    this.formGroup = this._fb.group({
      title: [null, [Validators.required]],
      start: [null, [Validators.required]],
      end: [null]
    });
    this.formGroup.reset(this.defaultValue);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.event) {
      let endDate = null;
      if(this.event.end) {

        endDate = new Date(this.event.end)
        endDate.setDate(endDate.getDate() - 1)
      }
      this.formGroup.reset({ 
        ...this.event, 
        start: new Date(this.event.start), 
        end: endDate 
      });
    } else {
      this.formGroup.reset(this.defaultValue);
    }
  }

  send() {
    if(this.formGroup.invalid) {
      return;
    }

    let end = this.formGroup.value.end
    if(end) {
      (end as Date).setDate(end.getDate() + 1);
    }

    const values={ 
      ...this.formGroup.value,
      start: this.formatDate(this.formGroup.value.start),
      end: this.formatDate(end)
     }

    iif(
      () => !!this.event,
      this._eventService.update(this.event?.id, values), 
      this._eventService.add(values)
    ).subscribe(this.httpHandler);
  }

  cancel() {
    this.close.emit(false);
  }

  askConfirmDelete() {
    this._confirmationService.confirm({ header: 'Are you sure ??', accept: () => {
      this._eventService.delete(this.event?.id)
        .subscribe(this.httpHandler)
    }})
  }

  private formatDate(date: Date) {
    if(!date) {
      return null;
    }
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }
}
