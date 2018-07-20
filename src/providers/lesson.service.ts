import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BaseService } from "./base.service";

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { AngularFire, FirebaseApp, FirebaseAuthState, FirebaseListObservable, FirebaseObjectObservable } from "angularfire2";
import { Lesson } from './../models/lesson.model';

@Injectable()
export class LessonService extends BaseService{
  

  lessonsToShare: string[] = [];

  lessons: Lesson[];
  currentLesson: FirebaseObjectObservable<Lesson>;
  lessonsLenght: number;
  lessonsObservable: FirebaseListObservable<Lesson[]>;

//#region Main
  constructor(
    public af: AngularFire,
    @Inject(FirebaseApp) public firebaseApp: any,
    public http: Http
  ) {
    super();
  }

  setLessonsToShare(weekday: string, startDate: string, endDate: string, startHour: string, endHour: string): void
  {
    this.lessonsToShare = [];

    //Make month -1 because Date.UTC
    let start:string[] = startDate.split('-');
    let day: number = Number(start[2]);
    let month: number = Number(start[1])-1;
    let year: number = Number(start[0]);
    
    let end:string[] = endDate.split('-');
    let endDay: number = Number(end[2]);
    let endMonth: number = Number(end[1])-1;
    let endYear: number = Number(end[0]);

    let weekdayNumber: number;

    switch (weekday) {
      case "Monday":
        weekdayNumber = 1;
      break;
      case "Tuesday":
        weekdayNumber = 2;
      break;
      case "Wednesday":
        weekdayNumber = 3;
      break;
      case "Thursday":
        weekdayNumber = 4;
      break;
      case "Friday":
        weekdayNumber = 5;
      break;
      case "Saturday":
        weekdayNumber = 6;
      break;
      case "Sunday":
        weekdayNumber = 0;
      break;
    }

    let isCorrectYear: boolean = false;
    let isCorrectMonth: boolean = false;

    while(!isCorrectYear)
    {
      if(year == endYear)
      {
        isCorrectYear = true;
      }
      while(!isCorrectMonth)
      {
        if(isCorrectYear && month == endMonth)
        {
          isCorrectMonth = true;
        }
        while(day <= 31)
        {
          if(isCorrectYear && isCorrectMonth && day > endDay)
          {
            break;
          }
          var date = new Date(Date.UTC(year, month, day));
          if(weekdayNumber == date.getUTCDay())
          {
            let stringMonth: string = (month+1)<10 ? '0'+(month+1).toString() : (month+1).toString();
            let stringDay: string = day<10 ? '0'+day.toString() : day.toString();
            this.lessonsToShare.push(year.toString()+'-'+stringMonth+'-'+stringDay);
          }
          if(day == 31)
          {
            day = 1;
            break;
          }
          day++;
        }
        if(month == 11)
        {
          month = 0;
          break;
        }
        month++;
      }
      year++;
    }
  }

  getSchedule()
  {
    return this.lessonsToShare;
  }

  create(lesson: Lesson, classID: string, lessonID: string): firebase.Promise<void> {
    return this.af.database.object(`/lessons/${classID}/${lessonID}`)
      .set(lesson)
      .catch(this.handlePromiseError);
  }
//#endregion

showDate(lessons: Lesson[]): Lesson[] {
    let index: number = 0;

    while(index < lessons.length)
      {
        let splitDate: string[] =  lessons[index].date.split('-');
        if(splitDate[0] != "undefined")
        {
          let day: string = splitDate[2];
          let month: string = splitDate[1];
          let year: string = splitDate[0];

          switch (month) {
            case "01":
              month = "Janeiro";
            break;
            case "02":
              month = "Fevereiro";
            break;
            case "03":
              month = "Março";
            break;
            case "04":
              month = "Abril";
            break;
            case "05":
              month = "Maio";
            break;
            case "06":
              month = "Junho";
            break;
            case "07":
              month = "Julho";
            break;
            case "08":
              month = "Agosto";
            break;
            case "09":
              month = "Setembro";
            break;
            case "10":
              month = "Outubro";
            break;
            case "11":
              month = "Novembro";
            break;
            case "12":
              month = "Dezembro";
            break;
          }
          lessons[index].date = day + " de " + month;
        }
        index++;

      }
      return lessons;
  }

  setLessonDate(lesson: Lesson): Lesson {
        let splitDate: string[] =  lesson.date.split('-');
        if(splitDate[0] != "undefined")
        {
          let day: string = splitDate[2];
          let month: string = splitDate[1];
          let year: string = splitDate[0];

          switch (month) {
            case "01":
              month = "Janeiro";
            break;
            case "02":
              month = "Fevereiro";
            break;
            case "03":
              month = "Março";
            break;
            case "04":
              month = "Abril";
            break;
            case "05":
              month = "Maio";
            break;
            case "06":
              month = "Junho";
            break;
            case "07":
              month = "Julho";
            break;
            case "08":
              month = "Agosto";
            break;
            case "09":
              month = "Setembro";
            break;
            case "10":
              month = "Outubro";
            break;
            case "11":
              month = "Novembro";
            break;
            case "12":
              month = "Dezembro";
            break;
          }
          lesson.date = day + " de " + month;
        }
      return lesson;
  }

  setLessons(): void{
    this.af.auth
      .subscribe((authState: FirebaseAuthState) => {
        if (authState) {

          this.lessonsObservable = <FirebaseListObservable<Lesson[]>>this.af.database.list(`/lessons/${authState.auth.uid}`, {
          }).map((lessons: Lesson[]) => {
            return lessons.reverse();
          }).catch(this.handleObservableError);
        }
      });

      this.lessonsObservable.forEach(item => {
          this.lessons = item
          .sort((a,b) => {
              if (a.date < b.date) {
                  return -1;
              }

              if (a.date > b.date) {
                  return 1;
              }

              return 0;
          });
          this.lessonsLenght = item.length;
      });
        

  }

  getLessonsByClass(classAbbreviation: string): Lesson[]{
    let lessons: FirebaseListObservable<Lesson[]>;
    let lessonsToReturn: Lesson[];
    this.af.auth
      .subscribe((authState: FirebaseAuthState) => {
        if (authState) {

          lessons = <FirebaseListObservable<Lesson[]>>this.af.database.list(`/lessons/${authState.auth.uid}/${classAbbreviation}`, {
          }).map((classes: Lesson[]) => {
            return classes.reverse();
          }).catch(this.handleObservableError);
        }
      });

      lessons.forEach(item => {
          lessonsToReturn = item
          .sort((a,b) => {
              if (a.date < b.date) {
                  return -1;
              }

              if (a.date > b.date) {
                  return 1;
              }

              return 0;
          });
      });

        return lessonsToReturn;
  }

  getLessonByName(classAbbreviation: string,  lessonName: string): Lesson{

    let index: number = 0;
    let lesson: Lesson;
    let lessons: Lesson[] = this.getLessonsByClass(classAbbreviation);
    while(index < lessons.length)
      {
        let name: string = lessons[index].name;

        if(name == lessonName)
          {
              lesson = lessons[index];
              
              break;
          }
        
        index++;
      }
    return lesson
  }

  setCurrentLesson(name: string, classAbbreviation: string): void{
    
    let index: number = 0;
    let lesson: Lesson;
    let lessons: Lesson[] = this.getLessonsByClass(classAbbreviation);
    while(index < lessons.length)
      {
        let lessonName: string = lessons[index].name;

        if(lessonName == name)
          {
              lesson = lessons[index];
              let lessonID: string = "lesson" + (index+1).toString();
              if(index<10){
                lessonID = "lesson0" + (index+1).toString();
              }
                
              this.af.auth
                .subscribe((authState: FirebaseAuthState) => {
                  if (authState) {
                    this.currentLesson = <FirebaseObjectObservable<Lesson>>this.af.database.object(`/lessons/${authState.auth.uid}/${classAbbreviation}/${lessonID}`);
                  }
              });
              
              break;
          }
        
        index++;
      }

  }

  edit(lessonToEdit: Lesson): firebase.Promise<void> {
    return this.currentLesson
      .update(lessonToEdit)
      .catch(this.handlePromiseError);
  }

}
