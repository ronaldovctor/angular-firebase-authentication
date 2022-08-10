import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { PeopleComponent } from './components/people/people.component';
import { MaterialModule } from '../material.module';
import { TestComponent } from './components/test/test.component';


@NgModule({
  declarations: [
    PeopleComponent,
    TestComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MaterialModule
  ]
})
export class MainModule { }
