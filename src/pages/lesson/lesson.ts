import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { EditLessonPage } from './../edit-lesson/edit-lesson';
import { Lesson } from './../../models/lesson.model';
import { LessonService } from './../../providers/lesson.service';

@Component({
  selector: 'page-lesson',
  templateUrl: 'lesson.html',
})
export class LessonPage {
  classAbbreviation: string;
  lessonName: string;
  lessonDate: string;
  lesson: Lesson;
  room: string = "Sala";
  teacher: string = "Professor";
  schedule: string = "Próxima Aula";
  presence: boolean = true;


  constructor(
    public lessonService: LessonService,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.classAbbreviation = navParams.get("classAbbreviation");
    this.lessonName = navParams.get("lessonName");

  }

  ionViewDidLoad() {
    this.lesson = this.lessonService.getLessonByName(this.classAbbreviation, this.lessonName);
    this.lessonService.setCurrentLesson(this.lessonName, this.classAbbreviation);
    this.lesson = this.lessonService.setLessonDate(this.lesson);  

    this.lessonDate = this.lesson.date;
    this.room = this.lesson.room;
    this.teacher = this.lesson.teacher;
    this.schedule = this.lesson.date + " às " + this.lesson.startHour;

    if(this.lesson.presence != undefined){
      this.presence = this.lesson.presence;
    }
    
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  onEdit(){
    
    this.navCtrl.push(EditLessonPage, {
      lessonName: this.lessonName,
      classAbbreviation: this.classAbbreviation
    });
  }

  onPresence() {
      let lesson: Lesson = this.lessonService.getLessonByName(this.classAbbreviation, this.lessonName);
      lesson.presence = this.presence;
      this.lessonService.edit(lesson);
  }

}
