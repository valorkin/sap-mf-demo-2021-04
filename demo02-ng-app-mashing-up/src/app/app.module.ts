import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AppShellModule} from '@fundamental-ngx/app-shell';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppShellModule.forRoot('/assets/config/plugins.json'),
    AppRoutingModule
  ],
  providers: [],
  schemas: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
