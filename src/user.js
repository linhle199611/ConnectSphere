import GUN from 'gun';
import 'gun/sea';
import 'gun/axe';
import { writable } from 'svelte/store';

// Database
export const db = GUN();

// Gun User
export const user = db.user().recall({sessionStorage: true});

// Current User's username
export const username = writable('');

user.get('alias').on(v => username.set(v))

db.on('auth', async(event) => {
    const alias = await user.get('alias'); // username string
    username.set(alias);

    console.log(`signed in as ${alias}`);
    /*
    db.get('time').on(function(data, key){
      data.forEach(function(obj){
        for (var k in obj){
            console.log("Key" + k + " , Value: " + obj[k]);
        }
      }
    });*/
    //console.log(typeof alias);
    // database to keep track of time
    //let self = {'yourtime' : 0};
    //let main = {};
    //main[alias] = 0;
    //db.get('time3').get(alias).put(8);

});