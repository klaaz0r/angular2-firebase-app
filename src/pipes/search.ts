import { Pipe } from '@angular/core';
import { isEmpty, contains, toLower, values, is, map, filter } from 'ramda'
import logger from '../logger';

@Pipe({
  name: 'customSearch'
})
export class SearchPipe {
  transform(data, term) {
    if (isEmpty(term) || term == null) {
      logger('trace', 'not searching, returning data')
      return data
    }

    logger('trace', 'searching..', { term, data })
    return data.filter(value =>
      contains(true, map(item =>
        //compare the search term with the string (strings are arrays)
        contains(toLower(term), toLower(item)),
        //only filter on strings, remove all the functions
        filter(x => is(String, x), values(value)))
      ))
  }

}
