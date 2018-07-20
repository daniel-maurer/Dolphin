import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Class } from './../../models/class.model';
import { ClassService } from './../../providers/class.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Lesson } from './../../models/lesson.model';
import { LessonService } from './../../providers/lesson.service';
import { SchedulePage } from './../schedule/schedule';
import { UserService } from './../../providers/user.service';
import { User } from './../../models/user.model';

@Component({
  selector: 'page-add-class',
  templateUrl: 'add-class.html',
})
export class AddClassPage {

  classForm: FormGroup;
  class: Class;
  schedule: string = "Horário";

  constructor(
    public classService: ClassService,
    public lessonService: LessonService,
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService
  ) {

    this.classForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      abbreviation: ['', [Validators.required, Validators.minLength(3)]],
      room: ['', [Validators.required, Validators.minLength(3)]],
      teacher: ['', [Validators.required, Validators.nullValidator]],
    });

  }

  ionViewWillEnter() {
    let schedule:string[] = this.classService.getSchedule().split(' ');
    if(schedule[0] != "undefined")
    {
      if(schedule[0] == '')
      {
        let date:string[] = schedule[1].split('-');
        schedule[1] = date[2]+ '/' + date[1];
        this.schedule = schedule[1] + ' das ' + schedule[3] + ' às ' + schedule[4];
      }
      else
      {
        this.schedule = schedule[0] + 's das ' + schedule[3] + ' às ' + schedule[4];
      }
    }
  }

  onSchedule(): void {
    this.navCtrl.push(SchedulePage);
  }

  onSubmit(): void {
    let classID: string = "";

    this.userService.currentUser
      .first()
      .subscribe((currentUser: User) => {

        classID = currentUser.$key + "/" + this.classForm.value.abbreviation;

        if(this.lessonService.getSchedule())
        {
          let lessonsDate: string[] = this.lessonService.getSchedule();
          let lessonNumber: number = 1;
          while(lessonNumber < lessonsDate.length)
          {
            let startHour: string;
            let endHour: string;
            let schedule:string[] = this.classService.getSchedule().split(' ');
            if(schedule[0] != "undefined")
            {
              startHour = schedule[3];
              endHour = schedule[4];
            }

            let lesson: Lesson = new Lesson(
              `Aula ${lessonNumber}`,
              this.classForm.value.room,
              "",
              this.classForm.value.teacher,
              lessonsDate[lessonNumber-1],
              startHour,
              endHour,
              null

              );

            let lessonID: string = "lesson"+lessonNumber.toString();
            if(lessonNumber<10)
            {
              lessonID = "lesson0"+lessonNumber.toString();
            }

            this.lessonService.create(lesson, classID, lessonID);
            lessonNumber++;
          }
        }
      });

      let classToAdd: Class = new Class(
        this.classForm.value.name,
        this.classForm.value.abbreviation,
        "",
        this.classForm.value.room,
        this.classForm.value.teacher
        );
      this.classService.create(classToAdd, classID);

    
  }  
}
