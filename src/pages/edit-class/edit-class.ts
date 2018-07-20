import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';

import { Class } from './../../models/class.model';
import { ClassService } from './../../providers/class.service';

@Component({
  selector: 'page-edit-class',
  templateUrl: 'edit-class.html',
})
export class EditClassPage {

  classAbbreviation;
  classToEdit: Class;
  
  name: string = "Nome";
  abbreviation: string = "Abreviação";
  school: string = "Escola";
  room: string = "Sala";
  teacher: string = "Professor";

  constructor(
    public alertCtrl: AlertController,
    public classService: ClassService,
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
    this.classAbbreviation = navParams.get("class");
  }

  ionViewDidLoad() {
    this.classToEdit = this.classService.getClassByAbbreviation(this.classAbbreviation);
    this.name = this.classToEdit.name;
    this.abbreviation = this.classToEdit.abbreviation;
    this.school = this.classToEdit.school;
    this.room = this.classToEdit.room;
    this.teacher = this.classToEdit.teacher;
    this.classService.setCurrentClassById(this.abbreviation);
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
    switch (parameterToEdit) 
    { 
    case'name': 
      this.classToEdit.name = data;
      this.name = data;
      break; 
    case'abbreviation': 
      this.classToEdit.abbreviation = data;
      this.abbreviation = data;
      break; 
    case'school': 
      this.classToEdit.school = data;
      this.school = data;
      break; 
    case'room': 
      this.classToEdit.room = data;
      this.room = data;
      break; 
    case'teacher': 
      this.classToEdit.teacher = data;
      this.teacher = data;
      break; 
    } 
    
    this.classService.edit(this.classToEdit)
    .then(() => {
        this.classService.setClasses();
        console.log(this.classService.classes);
      });
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      subTitle: 'Ainda não é possível editar a abreviação. Aguarde a próxima versão.',
      buttons: ['OK']
    });
    alert.present();
  }


}


