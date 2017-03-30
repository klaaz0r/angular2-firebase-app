import { Pipe } from '@angular/core';
import { isEmpty, contains, toLower, values, is, map, reject, or } from 'ramda'
import logger from '../logger';

@Pipe({
  name: "customSearch"
})
export class SearchPipe {
  transform(projects, term) {
    if (isEmpty(term) || term == null) {
      logger('trace', 'not searching, returning projects')
      return projects
    } else {
      logger('trace', 'searching..', term)
      return projects.filter(project =>
        contains(true, map(item =>
          contains(toLower(term), toLower(item)),
          //TODO recursive search
          reject(x => or(is(Object, x), is(Number, x)
          ), values(project)))
        ))
    }
  }

}
