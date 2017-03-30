import { Component } from '@angular/core';
import { NavController, NavParams, ToastController} from 'ionic-angular';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Project } from '../../interfaces/project.interface';
import { StoreService } from "../../services/store";
import { AuthService } from "../../services/auth";
import { merge, dissoc } from 'ramda';
import logger from '../../logger';

@Component({
  selector: 'page-project-form',
  templateUrl: 'project-form.html'
})
export class ProjectFormPage {

  user: any;
  projectForm: FormGroup;
  existingProject;
  actoren: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private form: FormBuilder,
    private store: StoreService,
    private auth: AuthService,
    public toastCtrl: ToastController
  ) {

    this.projectForm = this.form.group({
      name: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      description: ['',],
      ACTOR: ['',]
    });

    this.actoren = this.store.list('actoren')

    this.auth.getUserData()
      .subscribe(
      user => this.user = user,
      err => logger('error', 'holy shit user is not logged in', err)
      );

    if (navParams.get('key')) {
      store.object(`projects/${navParams.get('key')}`)
        .subscribe(project => {
          this.populateForm(project);
          this.existingProject = project;
        }, err => console.log(err));
    }
  }

  populateForm(currentProject): void {
    (<FormControl>this.projectForm.controls['name'])
      .setValue(currentProject.name, { onlySelf: true });

    (<FormControl>this.projectForm.controls['description'])
      .setValue(currentProject.description, { onlySelf: true });
  }

  save(projectObj: any, isValid: boolean): void {
    //add the author key to the project (we can populate these)
    const project = merge(dissoc('user', projectObj), { USER: this.user.$key })

    if (this.existingProject) {
      logger('info', 'update project', { key: this.existingProject.$key, project });
      this.store.update(`projects/${this.existingProject.$key}`, project);
    } else {
      logger('info', 'new project', project);
      this.store.push('projects', project);
    }

    //go back a route and notife user of the save
    this.presentToast('saved project')
    this.navCtrl.pop();
  }

  delete(): void {
    //the delete button is not show if there is no existingProject
    const key = this.existingProject.$key;
    logger('info', 'deleting project', key)
    this.store.remove(`projects/${key}`);
    this.presentToast('deleted project');
    this.navCtrl.pop();
  }

  presentToast(message: string): void {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1000
    });
    toast.present();
  }

}
