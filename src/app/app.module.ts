import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

import {
  MatButtonModule,
  MatTableModule,
  MatFormFieldModule,
  MatInputModule,
  MatTabsModule,
  MatListModule,
  MatOptionModule,
  MatSelectModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatCardModule,
  MatToolbarModule,
} from '@angular/material';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatListModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    HttpClientModule,
    ChartsModule,
    MatCardModule,
    MatToolbarModule,
  ],

  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
