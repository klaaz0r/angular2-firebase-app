import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import * as crypto from 'crypto';
import { StoreService } from './store';
import logger from '../logger';

@Injectable()
export class AuthService {

  user: any;

  constructor(private af: AngularFire, private platform: Platform, private store: StoreService) { }

  getUserData() {
    return Observable.create(observer => {
      this.af.auth.subscribe(authData => {
        if (authData) {
          this.store.object('users/' + authData.uid)
            .subscribe(user => {
              this.user = user;
              observer.next(user);
            }, err => logger('error', 'user not authenticad', { err }));
        } else {
          observer.error();
        }
      });
    });
  }

  registerUser(credentials: any) {
    return Observable.create(observer => {
      this.af.auth.createUser(credentials)
        .then((authData: any) => {
          logger('info', 'creatin user..', { authData })
          this.af.database.list('users')
            .update(authData.uid, {
              name: authData.auth.email,
              email: authData.auth.email,
              emailVerified: false,
              provider: 'email',
              //gets a gravatar or a default one, lovely because it's easy
              avatar: `https://www.gravatar.com/avatar/${crypto.createHash('md5').update(authData.auth.email).digest('hex')}`
            });
          credentials.created = true;
          observer.next(credentials);
        })
        .catch((err: any) => {
          console.log('error', err)
        });
    });
  }

  loginWithEmail(credentials) {
    return Observable.create(observer => {
      this.af.auth.login(credentials, {
        provider: AuthProviders.Password,
        method: AuthMethods.Password
      })
        .then(authData => {
          observer.next(authData);
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  loginWithGithub() {
    return Observable.create(observer => {
      this.af.auth.login({
        provider: AuthProviders.Github,
        method: AuthMethods.Popup
      })
        .then(githubData => {
          this.af.database.list('users')
            .update(githubData.auth.uid, {
              name: githubData.auth.displayName,
              email: githubData.auth.email,
              provider: 'github',
              avatar: githubData.auth.photoURL
            });
          observer.next();
        })
        .catch(error => {
          console.info("error", error);
          observer.error(error);
        });
    })
  }

  logout() {
    this.af.auth.logout();
  }
}
