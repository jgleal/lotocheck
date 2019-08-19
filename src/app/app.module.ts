import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SorteoService } from "./sorteo.service";

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NumpremioComponent } from './numpremio/numpremio.component';
import { NumlotoPipe } from './numloto.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NumpremioComponent,
    NumlotoPipe
  ],
  imports: [
    BrowserModule, HttpClientModule
  ],
  providers: [SorteoService, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
