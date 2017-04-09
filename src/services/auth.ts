import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import * as crypto from 'crypto';
import { StoreService } from './store';
import logger from '../logger';
import firebase from 'firebase';
import { is } from 'ramda';

@Injectable()
export class AuthService {

  user: any;

  constructor(private af: AngularFire, private platform: Platform, private store: StoreService) { }

  linkUser(authData: any): void {
    logger('info', 'linking user', { authData })
    firebase.database().ref('users')
      .orderByChild('email').equalTo(authData.email).once('value', snapshot => {
        if (snapshot.exists()) {
          logger('debug', 'this is an existing user', { user: snapshot.val() })
          console.log('compare with this user ')

        } else {
          logger('debug', 'this is a new user')
          this.store.push('users', authData)
        }

      });
  }

  emailToKey(email): string {
    return btoa(email);
  }

  getUserData() {
    return Observable.create(observer => {
      this.af.auth.subscribe(authData => {
        if (authData) {
          logger('info', 'getting user', { authData })
          this.store.object('users/' + authData.uid)
            .subscribe(user => {
              this.user = user;
              logger('info', 'found user', { user })
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
        .then((emailData: any) => {
          const authData: any = {
            uuid: emailData.uid,
            name: credentials.name, //pick this from the credentials
            email: emailData.auth.email,
            emailVerified: false,
            provider: 'email',
            //gets a gravatar or a default one, lovely because it's easy
            avatar: `https://www.gravatar.com/avatar/${crypto.createHash('md5').update(emailData.auth.email).digest('hex')}`
          };
          this.linkUser(authData);
          credentials.created = true;
          observer.next(credentials);
        })
        .catch(err => logger('error', 'error registering user', { err }));
    });
  }

  loginWithEmail(credentials) {
    return Observable.create(observer => {
      this.af.auth.login(credentials, {
        provider: AuthProviders.Password,
        method: AuthMethods.Password
      })
        .then(authData => {
          this.linkUser(authData);
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
          const authData: any = {
            uuid: githubData.auth.uid,
            name: githubData.auth.displayName,
            email: githubData.auth.email,
            provider: 'github',
            avatar: githubData.auth.photoURL
          }
          this.linkUser(authData);
          observer.next();
        })
        .catch(error => {
          observer.error(error);
        });
    })
  }

  loginWithGoogle() {
    return Observable.create(observer => {
      this.af.auth.login({
        provider: AuthProviders.Google,
        method: AuthMethods.Popup
      })
        .then(googleData => {
          console.log(googleData)
          const authData: any = {
            uuid: googleData.auth.uid,
            name: googleData.auth.displayName,
            email: googleData.auth.email,
            provider: 'twitter',
            avatar: googleData.auth.photoURL
          }
          this.linkUser(authData);
          observer.next();
        })
        .catch(error => {
          observer.error(error);
        });
    })
  }

  logout(): void {
    this.af.auth.logout();
  }
}
