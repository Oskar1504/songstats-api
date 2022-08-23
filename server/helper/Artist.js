const axios = require("axios");
const fs = require("fs");

const dataFiles = "./server/data/artists/"

const scrapDelay = 5

module.exports = class Artist {
  constructor(index, searchName, sources) {
    this.name = index
    this.searchName = searchName;
    this.songstatsSearch = null
    this.charts = {}
    this.created = new Date().getTime()
    this.sources = sources
  }

  async resolveSearchName() {
    let query = {
      q: this.searchName,
      searchType: "all",
    };
    this.songstatsSearch = await axios({
      method: "get",
      url: "https://data.songstats.com/api/v1/subscriptions/artist_label_search",
      params: query,
      headers: {
        accept: "application/json",
        "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        "cache-control": "no-cache",
        "content-type": "application/json",
        pragma: "no-cache",
        "sec-ch-ua":
          '"Opera";v="89", "Chromium";v="103", "_Not:A-Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        Referer: "https://songstats.com/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    })
      .then(function (response) {
        let o = response.data.artists[0];
        delete o.bio;
        return o;
      })
      .catch(function (error) {
        console.log(error);
        return null;
      });

      return this.songstatsSearch
  }

  async getSongstats() {
    if (this.songstatsSearch != null) {
      console.group(`Starting scrapping sources from "${this.name}"`)
      console.log(`${scrapDelay} seconds between each request`)
      console.log(`${this.sources.length} different sources specified`)

      for(let source of this.sources){
        let query = {
          idUnique: this.songstatsSearch.idUnique,
          source: source,  // spotify |apple_music | amazon | deezer | instagram | tiktok | youtube | shazam | tracklist | beatport | soundcloud | facebook | itunes
          version: 140,
          platform: "web"
        };
        console.log(`"${this.name}" updating data source "${source}"`)
        this.charts[source] = await axios({
          method: "get",
          url: "https://data.songstats.com/api/v1/analytics/chart",
          params: query,
          "headers": {
            "accept": "application/json",
            "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Opera\";v=\"89\", \"Chromium\";v=\"103\", \"_Not:A-Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "Referer": "https://songstats.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
          },
        })
          .then(function (response) {
            let o = response.data.chart.iconData;
            return o
          })
          .catch(function (error) {
            console.log(error);
          });

          await new Promise(resolve => setTimeout(resolve, (scrapDelay * 1000)));
        }
        console.groupEnd()
    } else {
      throw "this.songstatsSearch is null";
    }
  }

  saveToFile(){
    fs.writeFileSync(`${dataFiles}${this.name}.json`, JSON.stringify(this, null, 2))
  }
  
  loadFromCache(){
    let inData = JSON.parse(fs.readFileSync(`${dataFiles}${this.name}.json`))

    Object.keys(inData).forEach(key => {
      // dont load sources from cache due to the fact the can be changed/specified in loadArtist.json
      if(!key == "sources"){
        this[key] = inData[key]
      }
      
    })
  }

  alreadyExistInCache(){
    return fs.existsSync(`${dataFiles}${this.name}.json`)
  }


  async refreshData(){
    await this.getSongstats()
  }
};
