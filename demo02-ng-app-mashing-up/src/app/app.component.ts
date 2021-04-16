import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '2. Angular App mashing up UI5/iframe application';

  onerror(err): void {
    console.error(err);
  }
}
