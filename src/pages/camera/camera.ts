import { ViewChild, Component, ElementRef } from '@angular/core'
import { ViewController, ToastController } from 'ionic-angular';
import { StoreService } from '../../services/store';
import { AuthService } from '../../services/auth';
import logger from '../../logger';

@Component({
  selector: 'camera-view',
  templateUrl: 'camera.html'
})
export class CameraComponent {
  @ViewChild('video') video: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;

  user: any;
  tookPicture: boolean;

  constructor(
    public viewCtrl: ViewController,
    public store: StoreService,
    public auth: AuthService,
    public toastCtrl: ToastController,
  ) {

    logger('trace', 'camera component loading..');

    this.auth.getUserData()
      .subscribe(
      user => this.user = user,
      err => logger('error', 'error getting user', err))
  }

  ngAfterViewInit(): void {
    this.tookPicture = false;
    const video = this.video.nativeElement;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          video.src = window.URL.createObjectURL(stream);
          video.play();
        })
    }
  }

  takeScreenshot(): void {
    this.tookPicture = true;
    const context = this.canvas.nativeElement.getContext('2d');
    context.drawImage(this.video.nativeElement, 0, 0, 250, 250);
    this.canvas.nativeElement.toBlob(blob => {
      this.store.upload(blob)
        .then(url => this.updateProfilePicture(url))
    }, 'image/jpeg', 0.95);
  }

  updateProfilePicture(newUrl): void {
    logger('info', 'new user object', this.user)
    this.store.update(`users/${this.user.$key}`, { avatar: newUrl });
    this.toastCtrl.create({
      message: 'avatar updated!',
      duration: 1000
    }).present();
    this.viewCtrl.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
