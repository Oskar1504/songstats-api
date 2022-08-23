# Songstats api

this is a small tool which lets you host your own songstats api.

First you scrap the data from the artists u need.

Then you start an express.js API to make the files available for further processing

## Howto
- specify artists in ``/server/data/loadArtists.json``
    - available sources = ``spotify |apple_music | amazon | deezer | instagram | tiktok | youtube | shazam | tracklist | beatport | soundcloud | facebook | itunes``
    - and more. Check the songstats website to find more
- run `npm run scrap`
    - this will scrap an copy all the data from songstats
    - you can also reduce the delay between each request to speed up the process
        - be carefull you can mybe get softbanned from the website when delay to short
- specify/edit ``.env`` file to your needs
- after the script finished run `npm run start`

for dev 
- use ``npm run dev`` 
    - this will reload the application as soon as ``.js`` files change


##  Routes

|Route| details | live |
|--|--|--|
| /artists/list | returns ./server/data/loadArtists.json | [/artists/list](https://oskar1504.ngrok.io/songstats/artists/list) |
| /artists/get/<artist_name> | returns ./server/data/artists/<artist_name>.json | [/artists/get/amelie-lens](https://oskar1504.ngrok.io/songstats/artists/get/amelie-lens)|
| /artists/source/<artist_name>/<source> | returns <source> from ./server/data/artists/<artist_name>.json | [/artists/source/amelie-lens/spotify](https://oskar1504.ngrok.io/songstats/artists/source/amelie-lens/spotify)|

## more Config
- to force rescraping delete all .json files in ./server/data/artists/
- you can specify in ``.env`` file 
    - ``DELAY_BETWEEN_CACHE_INVALID`` = after how many seconds the cached artist data files gets invalidated and needs to be refetched
    - ``DELAY_BETWEEN_SOURCE`` = delay between each source request


## Future plans
- add cron job which retry scrap every n hours