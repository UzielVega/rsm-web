import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-imports',
  templateUrl: './imports.component.html',
  styleUrl: './imports.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ImportsComponent {

}
