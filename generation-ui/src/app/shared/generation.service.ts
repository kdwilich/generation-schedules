import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GenerationData, ScheduleData, ProjectData } from './generation.interface';

@Injectable({
  providedIn: 'root'
})
export class GenerationService {
  generation: any
  api: string;

  constructor(private readonly http: HttpClient) {
    this.api = environment.apiEndpoint;
  }

  getScheduleData(day = 'cur') {
    return this.http.get<ScheduleData>(`${this.api}/${day}`);
  }

  getSchedule(proj_id: string, day = 'cur') {
    console.log(`${this.api}/${day}/${proj_id}`)
    return this.http.get<ScheduleData>(`${this.api}/${day}/${proj_id}`);
  }

  getGenerationData() {
    return this.http.get<GenerationData>(`${this.api}/projects`);
  }
}
