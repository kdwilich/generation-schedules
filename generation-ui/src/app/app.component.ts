import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatSelectChange } from '@angular/material/select';
import { GenerationService } from './shared/generation.service';
import { GenerationData, ProjectData, ScheduleData, Schedule } from './shared/generation.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Generation Schedules';
  projects: ProjectData[] = [];
  selectedProject: ProjectData;
  selectedProjectId: string;
  scheduleData: ScheduleData;
  selectedSchedule: Schedule;
  selectedDay: string;
  loading = true;

  constructor(private readonly genService: GenerationService) { }

  ngOnInit(): void {
    this.scheduleData = {
      schedules: []
    };
    this.genService.getGenerationData().subscribe((data: GenerationData) => {
      this.projects = data.projects
      this.selectedDay = data.day;
    });
    this.getSchedules();
  }

  onDayChange(event: MatButtonToggleChange) {
    this.getSchedules(event.value);
  }

  onProjectChange(event: MatSelectChange) {
    const proj = event.value as ProjectData;
    if (proj && proj.id) {
      this.selectedSchedule = this.scheduleData.schedules.filter(sched => sched.id === proj.id)[0];
    }
  }

  getSchedules(day ?: string) {
    this.loading = true;
    this.genService.getScheduleData(day).subscribe((data: ScheduleData) => {
      this.scheduleData = data;

      if(this.selectedSchedule) {
        this.selectedSchedule = this.scheduleData.schedules.filter((sched: Schedule) => sched.id === this.selectedProject.id)[0];
      }
      this.loading = false;
    });
  }

  getProject(id: string) {
    return this.projects.filter(proj => proj.id === id)[0];
  }
}
