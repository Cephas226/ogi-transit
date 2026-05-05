import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ConteneursListComponent } from '../components/list/conteneurs-list.component';

@Component({
  selector: 'app-conteneurs-page',
  standalone: true,
  imports: [ConteneursListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-conteneurs-list />`,
})
export class ConteneursPageComponent {}
