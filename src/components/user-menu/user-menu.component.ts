import { Component, Input } from '@angular/core';
import { AlertController, App, MenuController } from 'ionic-angular';

import { AuthService } from './../../providers/auth.service';
import { Class } from './../../models/class.model';
import { BaseComponent } from "../base.component";
import { ClassService } from './../../providers/class.service';
import { ClassesPage } from './../../pages/classes/classes';
import { FirebaseListObservable } from 'angularfire2';
import { User } from './../../models/user.model';
import { UserProfilePage } from './../../pages/user-profile/user-profile';
import { SelectClassesPage } from '../../pages/select-classes/select-classes';


@Component({
  selector: 'user-menu',
  templateUrl: 'user-menu.component.html'
})
export class UserMenuComponent extends BaseComponent {

radioOpen: boolean;
radioResult;
classes: FirebaseListObservable<Class[]>;
class: FirebaseListObservable<Class>;


  @Input('user') currentUser: User;
  constructor(
    public alertCtrl: AlertController,
    public authService: AuthService,
    public app: App,
    public classService: ClassService,
    public menuCtrl: MenuController
  ) {
    super(alertCtrl, authService, app, menuCtrl);
  }

  onProfile(): void {
    this.navCtrl.push(UserProfilePage);
  }

  onClasses() {
    this.navCtrl.push(SelectClassesPage);
    /*
    let alert = this.alertCtrl.create();
    alert.setTitle('Turmas');

    let index: number = 0;
    let classesLenght: number = this.classService.classesLenght;

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

        this.navCtrl.push(ClassesPage, {
          class: data
        });

        this.radioOpen = false;
        this.radioResult = data;
      }
    });
    alert.present();
    */
  }

}
