# node-curseforge ![npm bundle size](https://img.shields.io/bundlephobia/min/node-curseforge) ![npm](https://img.shields.io/npm/dw/node-curseforge)

A zero-dependencies NodeJS package to interact with the curseforge core api.
Requires a CFCore authentication token (get one from [console.curseforge.com/#/api-keys](https://console.curseforge.com/#/api-keys) and yes you need to use a google account to login (sadly)).

### view on npm: [node-curseforge](https://www.npmjs.com/package/node-curseforge)

## Installation

To install this package you can use either yarn or npm.

`yarn add node-curseforge`

or

`npm install node-curseforge`

---

## How-To Use

You can use this package mostly in two ways. Either you fetch a game first and interact over the game mostly with the api or you use the root class and give the required ids or objects directly.

### Using the Curseforge class

```javascript

const {Curseforge} = require("node-curseforge");

let cf = new Curseforge(cf_token);

let mc = cf.get_game("minecraft");

cf.search_mods(mc).then((mods) => {
    for(let mod of mods){
        cf.get_description(mod).then((desc) => {
            console.log(desc);
        });
    }
});

```

---

### Using the Curseforge objects

Using the methods on the objects themselves actually calls them using the curseforge instance and directly fills in the ids.

```javascript

const {Curseforge} = require("node-curseforge")

let cf = new Curseforge(cf_token);

let mc = cf.get_game("minecraft");

mc.search_mods().then((mods) => {
    for(let mod of mods){
        mod.get_description().then((desc) => {
            console.log(desc);
        })
    }
})

```

## Typescript Support

The entire package is written in typescript and compiled to Javascript with an additional declaration file! You can therefore use this file with regular Javascript or with regular Typescript.

## Documentation

You can find the (wip) documentation at [mondanzo.github.io/node-curseforge](https://mondanzo.github.io/node-curseforge). Most of the code is very self-explanatory though and overall also 1:1 identical with the [CFCore Docs](<https://docs.curseforge.com>).
