import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';

import { Lesson } from './../../models/lesson.model';
import { LessonService } from './../../providers/lesson.service';

@Component({
  selector: 'page-edit-lesson',
  templateUrl: 'edit-lesson.html',
})
export class EditLessonPage {

  lessonToEdit: Lesson;
  classAbbreviation: string;
  lessonName: string;

  name: string = "Nome";
  info: string = "Informação"
  teacher: string = "Professor";
  room: string = "Sala";
  startHour: string = "Hora do Início";
  endHour: string = "Hora do Fim";
  presence: boolean = true;

  constructor(
    public alertCtrl: AlertController,
    public lessonService: LessonService,
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
    this.classAbbreviation = navParams.get("classAbbreviation");
    this.lessonName = navParams.get("lessonName");
  }

  ionViewDidLoad() {
    this.lessonToEdit = this.lessonService.getLessonByName(this.classAbbreviation, this.lessonName);
    this.lessonService.setCurrentLesson(this.lessonName, this.classAbbreviation);
    this.lessonToEdit = this.lessonService.setLessonDate(this.lessonToEdit);  

    this.name = this.lessonToEdit.name;
    this.info = this.lessonToEdit.info;
    this.teacher = this.lessonToEdit.teacher;
    this.room = this.lessonToEdit.room;
    this.startHour = this.lessonToEdit.startHour;
    this.endHour = this.lessonToEdit.endHour;

    if(this.lessonToEdit.presence != undefined){
      this.presence = this.lessonToEdit.presence;
    }
  }


  showPrompt(title: string, message: string, oldValue: string, parameterToEdit: string) {
    let prompt = this.alertCtrl.create({
      title: title,
      message: message,
      inputs: [
        {
          name: 'title',
          placeholder: oldValue
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
          }
        },
        {
          text: 'Salvar',
          handler: data => {

            this.editLesson(data.title, parameterToEdit);
          }
        }
      ]
    });
    prompt.present();
  }

  editLesson(data: string, parameterToEdit: string) {
    // switch (parameterToEdit) 
    // { 
    // case'name': 
    //   this.classToEdit.name = data;
    //   this.name = data;
    //   break; 
    // case'abbreviation': 
    //   this.classToEdit.abbreviation = data;
    //   this.abbreviation = data;
    //   break; 
    // case'school': 
    //   this.classToEdit.school = data;
    //   this.school = data;
    //   break; 
    // case'room': 
    //   this.classToEdit.room = data;
    //   this.room = data;
    //   break; 
    // case'teacher': 
    //   this.classToEdit.teacher = data;
    //   this.teacher = data;
    //   break; 
    // } 
    
    // this.classService.edit(this.classToEdit)
    // .then(() => {
    //     this.classService.setClasses();
    //     console.log(this.classService.classes);
    //   });
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      subTitle: 'Ainda não é possível editar a abreviação. Aguarde a próxima versão.',
      buttons: ['OK']
    });
    alert.present();
  }


}
