import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClassService } from '../../providers/class.service';
import { Class } from '../../models/class.model';

@Component({
  selector: 'page-select-classes',
  templateUrl: 'select-classes.html',
})
export class SelectClassesPage {

  classes: Class[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public classService: ClassService
  ) {

  }

  ionViewDidLoad() {
    this.classService.setClasses();

    this.classService.getClasses().forEach(item => {
      this.classes = item.sort((n1,n2) => {
          if (n1.abbreviation > n2.abbreviation) {
              return 1;
          }

          if (n1.abbreviation < n2.abbreviation) {
              return -1;
          }

          return 0;
      });
  });

    

    

    console.log("Selecionar Turma");
    console.log(this.classes);
  }

}
