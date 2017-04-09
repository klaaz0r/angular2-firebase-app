import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import * as crypto from 'crypto';
import { StoreService } from './store';
import logger from '../logger';
import firebase from 'firebase';
import { head, replace, has } from 'ramda';

@Injectable()
export class AuthService {

  constructor(
    private af: AngularFire,
    private platform: Platform,
    private store: StoreService
  ) { }

  /*
  watches for auth changes and returns an observer with the user
  if it is logged in.
  */
  getUserData() {
    return Observable.create(observer => {
      this.af.auth.subscribe(authData => {
        if (authData) {
          this.store.object('users/' + authData.uid)
            .subscribe(user => observer.next(user),
            err => logger('error', 'user not authenticad', { err }));
        } else {
          observer.error();
        }
      });
    });
  }

  /*
  this is used as auth  middleware, if firebase throws an error we
  pass this function in the promise chain. And try to link the account,
  if it fails it still breaks the chain and errors out.
  */
  linkAccounts(account: any) {
    logger('error', 'authenticating user, tryin to link', { account })
    const { credential, email } = account;
    //store the failed attempt to the storage for later! this way we
    //can handle redirect, not used now. Might start using it
    //if I want to go to Nightmare.JS for testing.
    // localStorage.setItem('linkUser', JSON.stringify({ credential }));

    return firebase.auth().fetchProvidersForEmail(email)
      .then(provider => {
        logger('debug', 'found provider for email', { email, provider })

        let providerPromise;
        //find the matching provider
        switch (replace('.com', '', head(provider))) {
          case 'google':
            logger('trace', 'linking with google..');
            providerPromise = this.loginWithGoogle();
            break;
          case 'github':
            logger('trace', 'linking with github..');
            providerPromise = this.loginWithGithub();
            break;
          default:
            logger('error', 'no provider found!')
            throw new Error('no provider found')
        }
        //resolve the promise
        return providerPromise
      })
      .then(masterProvider => {
        logger('debug', 'master provider result', { masterProvider })

        //email credentials need to be created from the email and password
        const linkCredential = has('credential', account) ? credential :
          firebase.auth.EmailAuthProvider.credential(account.email, account.password)

        logger('trace', 'link credentials created ', { linkCredential })
        return firebase.auth().currentUser.link(linkCredential)
          .then(user => {
            logger('info', 'linked accounts', { user })
            return user;
          })
      })
      .catch(error => {
        logger('error', 'linking went wrong', { error });
        throw error;
      })
  }

  registerUser(credentials: any): Promise<any> {
    return this.af.auth.createUser(credentials)
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
      })
      .catch(err => {
        return this.linkAccounts(credentials);
      })
      .catch(err => {
        logger('error', 'error registering user', { err })
        throw err
      });

  }

  loginWithEmail(credentials) {
    return this.af.auth.login(credentials, {
      provider: AuthProviders.Password,
      method: AuthMethods.Password
    })
      .then(authData => authData)
      .catch(error => error);
  }

  loginWithGithub(): Promise<any> {
    return this.af.auth.login({
      provider: AuthProviders.Github,
      method: AuthMethods.Popup
    })
      .then(githubData => {
        logger('info', 'github auth result', { githubData });
        this.af.database.list('users')
          .update(githubData.auth.uid, {
            name: githubData.auth.displayName,
            email: githubData.auth.email,
            provider: 'github',
            avatar: githubData.auth.photoURL
          });
      })
      .catch((error: any) => {
        //the error we receive can be an error
        //that the user already has an account
        //attempt to link them otherwise it
        //errors out en goes to the next catch
        return this.linkAccounts(error);
      })
      .catch(error => {
        logger('error', 'authentication and attempted linking failed', { error });
        throw error;
      })
  }

  loginWithGoogle(): Promise<any> {
    return this.af.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup
    })
      .then(googleData => {
        logger('info', 'google auth result', { googleData });
        this.af.database.list('users')
          .update(googleData.auth.uid, {
            name: googleData.auth.displayName,
            email: googleData.auth.email,
            provider: 'google',
            avatar: googleData.auth.photoURL
          });
      })
      .catch((error: any) => {
        return this.linkAccounts(error);
      })
      .catch(error => {
        logger('error', 'authentication and attempted linking failed', { error });
        throw error;
      })
  }

  logout(): void {
    this.af.auth.logout();
  }
}
