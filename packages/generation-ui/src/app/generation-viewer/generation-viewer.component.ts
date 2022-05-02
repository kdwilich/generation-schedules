import { Component, Input } from '@angular/core';
import { Schedule, ProjectData } from '../shared/generation.interface';

@Component({
  selector: 'app-generation-viewer',
  templateUrl: './generation-viewer.component.html',
  styleUrls: ['./generation-viewer.component.scss']
})
export class GenerationViewerComponent{
  @Input() project: ProjectData;
  @Input() schedule: Schedule;

  constructor() { }
  
  makeRelative(arr: number[]): number[] {
    const maxValue = Math.max(...arr);
    const maxHeight = 40;
    return arr.map((num: number) => Math.round(num / maxValue * maxHeight));
  }
}
