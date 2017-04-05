# angular2-firebase-app
actor app made with angular2 and firebase

some notable features: 

custom search pipe, I use ramda to search object values. Ad this point I do not recursively search an object, might do this if I have some time

```javascript
return projects.filter(project =>
        contains(true, map(item =>
          contains(toLower(term), toLower(item)),
          reject(x => or(is(Object, x), is(Number, x)
          ), values(project)))
        ))
```

Populating objects in angularfire, something I am ot really happy with. Firebase is nice for simple apps but once you start making references (or try to) 
The list function on the store interface has a populate option, what it does is map the object and check if a value is uppercase, like `USER` and it will populate that,
it takes the key and makes it to a firebase path and get's the values.
```javascript
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

```
