import { Component, OnInit } from '@angular/core';
import { faker } from '@faker-js/faker';
import { stringLength } from '@firebase/util';
import { Observable } from 'rxjs';
import { MainService } from '../../main.service';
import { Person } from '../../models/Person';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  people$?: Observable<Person[]>

  constructor(private mainService: MainService) { }

  ngOnInit(): void {
    this.people$ = this.mainService.getPeople()
  }

  addOne(): void {
    const p: Person = {
      name: faker.name.findName(),
      age: Number(faker.random.numeric(2)),
      email: faker.internet.email(),
      company: faker.company.companyName(),
      country: faker.address.country()
    }
    this.mainService.addPerson(p)
  }

  generate(): void {
    for(let i=0; i<5; i++){
      this.addOne()
    }
  }

}
