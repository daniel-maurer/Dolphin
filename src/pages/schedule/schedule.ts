import { LessonService } from './../../providers/lesson.service';
import { AddClassPage } from './../add-class/add-class';
import { Component } from '@angular/core';

import { ClassService } from './../../providers/class.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {

  scheduleForm: FormGroup;
  addClassPage: AddClassPage;
  repeats: boolean = false;
  startDate: string = "Data";

  constructor(
    public classService: ClassService,
    public formBuilder: FormBuilder,
    public lessonService: LessonService,
    public navCtrl: NavController,
    public navParams: NavParams
  ) 
  {
    this.scheduleForm = this.formBuilder.group({
      weekday: [''],
      startDate: ['', [Validators.required, Validators.minLength(3)]],
      endDate: [''],
      startHour: ['', [Validators.required, Validators.minLength(3)]],
      endHour: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onRepeats(): void
  {
    this.repeats = !this.repeats;
    if(this.repeats)
    {
      this.startDate = "Data Início"
    }
    else
    {
      this.startDate = "Data"
    }
  }

  onSubmit(): void {
    this.classService.setSchedule(
      this.scheduleForm.get("weekday").value, 
      this.scheduleForm.get("startDate").value, 
      this.scheduleForm.get("endDate").value, 
      this.scheduleForm.get("startHour").value, 
      this.scheduleForm.get("endHour").value);

      this.lessonService.setLessonsToShare(
      this.scheduleForm.get("weekday").value, 
      this.scheduleForm.get("startDate").value, 
      this.scheduleForm.get("endDate").value, 
      this.scheduleForm.get("startHour").value, 
      this.scheduleForm.get("endHour").value);


      this.navCtrl.pop();
      
  }
}
