import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFire, FirebaseListObservable, FirebaseAuthState, FirebaseObjectObservable } from 'angularfire2';

import { BaseService } from "./base.service";
import { Class } from './../models/class.model';

@Injectable()
export class ClassService extends BaseService{

    classesObservable: FirebaseListObservable<Class[]>;
    currentClass: FirebaseObjectObservable<Class>;
    classes: Class[];
    classesLenght: number;
    weekday: string;
    startDate: string; 
    endDate: string;
    startHour: string;
    endHour: string;

  constructor(
    public af: AngularFire,
    public http: Http
  ) 
  {
    super();
  }

  setClasses(): void{
    this.af.auth
      .subscribe((authState: FirebaseAuthState) => {
        if (authState) {

          this.classesObservable = <FirebaseListObservable<Class[]>>this.af.database.list(`/classes/${authState.auth.uid}`, {
          }).map((classes: Class[]) => {
            return classes.reverse();
          }).catch(this.handleObservableError);
        }
      });

      this.classesObservable.forEach(item => {
          this.classes = item.sort((n1,n2) => {
              if (n1.abbreviation > n2.abbreviation) {
                  return 1;
              }

              if (n1.abbreviation < n2.abbreviation) {
                  return -1;
              }

              return 0;
          });
          this.classesLenght = item.length;
      });

  }

  getClasses(): FirebaseListObservable<Class[]> {
    let classes: FirebaseListObservable<Class[]> ;

    this.af.auth
      .subscribe((authState: FirebaseAuthState) => {
        if (authState) {

          classes = <FirebaseListObservable<Class[]>>this.af.database.list(`/classes/${authState.auth.uid}`, {
             query: {
               orderByChild: 'abbreviation'
             }
          }).map((classes: Class[]) => {
            return classes.reverse();
          }).catch(this.handleObservableError);
        }
      });
      return classes;
  }

  setCurrentClassById(abbreviation: string): void{
    let index: number = 0;
    while(index < this.classesLenght)
      {
        if(this.classes[index].abbreviation == abbreviation)
          {
              this.af.auth
                .subscribe((authState: FirebaseAuthState) => {
                  if (authState) {
                    this.currentClass = <FirebaseObjectObservable<Class>>this.af.database.object(`/classes/${authState.auth.uid}/${abbreviation}`);
                  }
              });
          }

        index++;
      }

  }

  getClassByAbbreviation(abbreviation: string): Class {
      let index: number = 0;
    while(index < this.classesLenght)
      {
        if(this.classes[index].abbreviation == abbreviation)
          {
            return this.classes[index];
          }
        
        index++;
      }
      
      return null;
  }

  //To share content
  setSchedule(weekday: string, startDate: string, endDate: string, startHour: string, endHour: string): void
  {
    this.weekday = weekday;
    this.startDate = startDate;
    this.endDate = endDate;
    this.startHour = startHour;
    this.endHour = endHour;
  }

  getSchedule()
  {
    return this.weekday + ' ' + this.startDate + ' ' + this.endDate + ' ' + this.startHour + ' ' + this.endHour;
  }

  create(classToSet: Class, classID: string): firebase.Promise<void> {
    return this.af.database.object(`/classes/${classID}/`)
      .set(classToSet)
      .catch(this.handlePromiseError);
  }

  edit(classToEdit: Class): firebase.Promise<void> {
    return this.currentClass
      .update(classToEdit)
      .catch(this.handlePromiseError);
  }

}
