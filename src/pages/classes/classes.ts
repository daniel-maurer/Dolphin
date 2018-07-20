import { FirebaseListObservable } from 'angularfire2';
import { LessonService } from './../../providers/lesson.service';
import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, AlertController, FabContainer } from 'ionic-angular';

import { AddClassPage } from './../add-class/add-class';
import { Class } from './../../models/class.model';
import { ClassService } from './../../providers/class.service';
import { EditClassPage } from './../edit-class/edit-class';
import { Lesson } from './../../models/lesson.model';
import { LessonPage } from './../lesson/lesson';
import { User } from './../../models/user.model';

@Component({
  selector: 'page-classes',
  templateUrl: 'classes.html',
})
export class ClassesPage {

  name: string = "Nome";
  room: string = "Sala";
  teacher: string = "Professor";
  schedule: string = "Próxima Aula";
  classAbbreviation;
  showMenuItem: boolean = false;
  showMenu: boolean = true;
  lessons: Lesson[];

  constructor(
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public classService: ClassService,
    public lessonService: LessonService
  ) {
    this.classAbbreviation = navParams.get("class");
  }

  ionViewDidLoad() {
    let currentClass: Class = this.classService.getClassByAbbreviation(this.classAbbreviation)
    this.name = currentClass.name;
    this.room = currentClass.room;
    this.teacher = currentClass.teacher;
    this.schedule = "Próxima Aula";

    this.lessons = this.lessonService.getLessonsByClass(this.classAbbreviation);
    this.lessons = this.lessonService.showDate(this.lessons);
  }

  ionViewWillEnter(){
    this.ionViewDidLoad();
  }

  onAddClass(fab: FabContainer): void {
    this.navCtrl.push(AddClassPage);
    fab.close();
  }

  onEdit(): void {
    this.navCtrl.push(EditClassPage, {
          class: this.classAbbreviation
        });
  }

  showMenuItems(){
      this.showMenuItem = !this.showMenuItem;
  }

  onShowClasses(fab: FabContainer)
  {
    let alert = this.alertCtrl.create();
    alert.setTitle('Turmas');

    let index: number = 0;
    let classesLenght: number = this.classService.classesLenght;
    console.log(this.classService.classes);
    while(index < classesLenght)
      {
        
        let abbreviation: string = this.classService.classes[index].abbreviation;
        alert.addInput({
          type: 'radio',
          label: abbreviation,
          value: abbreviation,
          checked: (index == 0) ? true : false
        });
        index++;
      }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.classAbbreviation = data;
        this.ionViewDidLoad();
      }
    });
    alert.present();
    fab.close();
  }

  onLesson(lesson: Lesson): void {
    let myModal = this.modalCtrl.create(LessonPage, {
      lessonName: lesson.name,
      classAbbreviation: this.classAbbreviation
    });
    myModal.present();
  }
  

}
