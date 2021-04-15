import { Component } from '@angular/core';

import '@ui5/webcomponents-icons/dist/phone';
import '@ui5/webcomponents-icons/dist/calendar';
import '@ui5/webcomponents-fiori/dist/Timeline';
import '@ui5/webcomponents-fiori/dist/TimelineItem';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular App consuming UI5 web component';
}
