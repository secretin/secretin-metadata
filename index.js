XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('/tmp/secretinCache');
window = {}
const Secretin = require('secretin');
const SecretinNodeAdapter = require('secretin/dist/adapters/node.umd');

const api = 'https://api.secret-in.me';

const secretin = new Secretin(SecretinNodeAdapter, Secretin.API.Server, api);

const username = process.argv[2];
const password  = process.argv[3];

const totp = process.argv[4];

secretin.loginUser(username, password, totp)
  .then((user) => {
    const keys = user.keys;
    const metadata = user.metadatas;
    const keyList = Object.keys(keys)
    const metadatumList = Object.keys(metadata)

    if(metadatumList.length === keyList.length){
      console.log('Same number of id');
      let match = 0;
      keyList.forEach(key => {
        if(typeof(metadata[key]) !== 'undefined') {
          match += 1;
        } else {
          console.log(`${key} doesn't exist in metadata`);
        }
      });

      metadatumList.forEach(key => {
        if(typeof(keys[key]) !== 'undefined') {
          match += 1;
        } else {
          console.log(`${key} doesn't exist in keys`);
        }
      });

      if(match === keyList.length*2){
        console.log('Keys and metadata match')
        metadatumList.forEach(key => {
          const metadatum = metadata[key];
          const users = Object.keys(metadatum.users);
          if(users.length === 0) {
            console.log(`Metadatum without users, should take back ownership of ${key}:${metadatum.title}`)
          } else {
            const folders = Object.keys(metadatum.users[username].folders);
            if(folders.length === 0){
              console.log(`Metadatum for user ${username} has no folder, should put ${key}:${metadatum.title} back in ROOT`);
              secretin.currentUser.metadatas[key].users[username].folders.ROOT = true;
              secretin.resetMetadatas(key);
            } else {
              folders.forEach(folder => {
                if(folder !== 'ROOT') {
                  if(typeof(metadata[folder]) === 'undefined') {
                    if(users.length > 1) {
                      console.log(`Metadatum for user ${username} has unexistent folder ${folder}, should put ${key}:${metadatum.title} back in same folder as other users`);
                      console.log(JSON.stringify(metadatum))
                    } else {
                      console.log(`Metadatum for user ${username} has unexistent folder, should put ${key}:${metadatum.title} back in ROOT`)
                    }

                  }
                }
              })
            }
          }
        })
      }
    }
    else if(nbKeys < nbMetadatas) {
      console.log('More metadata than keys !')
    } else {
      console.log('More keys than metadata !')
    }
  })
  .catch((e) => {
    console.log(e);
  })
