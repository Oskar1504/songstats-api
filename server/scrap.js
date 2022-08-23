const Artist = require("./helper/Artist");
const Need = require("./data/loadArtists.json")


const updateSeconds = 3600

let artists = {}


async function main(){

    for (let artis of Need){
        let a = new Artist(artis.name, artis.searchName, artis.sources)
        if(a.alreadyExistInCache()){
            console.log(`${artis.name} already data file in cache. Using this data`)

            a.loadFromCache()
        }else{
            console.log(`${artis.name} not in cache. Scrapping data and write to cache`)

            await a.refreshData()
            a.saveToFile()
        }


        if((new Date().getTime() - a.created) >= (updateSeconds * 1000)){
            console.log(`${artis.name} scrapping is already more then ${updateSeconds} seconds past. Updating data`)

            a.created = new Date().getTime()
            await a.refreshData()
            a.saveToFile()
        }

        artists[artis.name] = a
    }

  
}

main()