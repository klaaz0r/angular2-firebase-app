import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable  } from 'angularfire2';
import { AuthService } from './auth';
import { Observable } from 'rxjs/Observable';
import logger from '../logger';
import { map, keys, filter, contains, flatten, mapObjIndexed, replace, toLower, toString, isArrayLike } from 'ramda';

const isUpperCase = (string) => /^[A-Z]*$/.test(string)

@Injectable()
export class StoreService {
  constructor(private af: AngularFire) { }

  push(path: string, data: any): void {
    this.af.database.list(path).push(data);
  }

  update(path: string, data: any) {
    logger('trace', 'update db', { path, data });
    this.af.database.object(path).update(data);
  }

  list(path: string, populate: boolean = false): any {
    logger('trace', 'list items', { path, populate })

    //not populating, enhance performance
    if (!populate) {
      return this.af.database.list(path);
    };

    //this is resource intensive but it abstracts away populating
    return this.af.database.list(path)
      .map(firebaseData => firebaseData.map(item => {
        const newObj = mapObjIndexed((val, key, obj) => {
          if (isUpperCase(key)) {
            //make the firebase ref path
            const ref = toLower(key);
            if (isArrayLike(val)) {
              //populate array
              return map(v => this.object(`${ref}s/${v}`), val);
            } else {
              //populate single object
              return this.object(`${ref}s/${val}`);
            }
          }
          return val; // do nothing and return
        }, item)
        newObj.$key = item.$key; //keep the key
        logger('trace', 'populated item', { newObj })
        return newObj
      }));
  }

  object(path: string): Observable<any> {
    return this.af.database.object(path);
  }

  remove(path: string): void {
    logger('trace', 'remove item', { path })
    this.af.database.list(path).remove()
  }
}
