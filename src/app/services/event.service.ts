import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { EventModel } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private readonly baseUrl = environment.API_URL + '/CalendarEvent';

  constructor(
    private readonly _httpClient: HttpClient
  ) { }

  getAll() {
    return this._httpClient.get<EventModel[]>(this.baseUrl);
  }

  add(form: EventModel) {
    return this._httpClient.post(this.baseUrl, form);
  }

  update(id: any, form: EventModel) {
    return this._httpClient.put(this.baseUrl + '/' + id, form);
  }

  delete(id: any) {
    return this._httpClient.delete(this.baseUrl + '/' + id);
  }
}
