import axios from 'axios';
import { Request, Response, Router} from 'express';
import IController from '../controller.interface';
import ICoord from '../coordonnees.interface';
import IResultat from '../resultat.interface';
import IPosition from './position.interface';


const geocodeUrl = `${process.env.baseUrl}/geocode/json`
const timezoneUrl = `${process.env.baseUrl}/timezone/json`


class PositionController implements IController{
public router = Router();
public path = '/api'

constructor() {
this.router.post(`${this.path}/get_distance_and_time`,  this.getDistanceAndTime)
}

  getDistanceAndTime = (async (req:Request, res:Response) => {

    const newposition:IPosition = req.body;
    
    let resultat : IResultat = {
      start: {country : '', timezone: '', location: {lat:0, lng: 0}},
      end:  {country : '', timezone: '', location: {lat:0, lng: 0}},
      distance: {value: 0, units: ''},
      time_diff: {value: 0, units: ''}
    };

    let timestamp = Date.now() / 1000

    // Récupération country et location de chaque coordonnees
  const start = await this.getContryAndLocation(geocodeUrl,`${newposition.start.lat},${newposition.start.lng}`, `${process.env.API_KEY}`)


  const end = await this.getContryAndLocation(geocodeUrl,`${newposition.end.lat},${newposition.end.lng}`, `${process.env.API_KEY}` )


    // Récupération offset GMT
 
  const startOffset = await  this.getTimeZone(timezoneUrl, `${newposition.start.lat},${newposition.start.lng}`, timestamp, `${process.env.API_KEY}`)


  const endOffset = await  this.getTimeZone(timezoneUrl, `${newposition.end.lat},${newposition.end.lng}`, timestamp, `${process.env.API_KEY}`)


    // Calcule de la distance
  const distance =   this.calculDistance(newposition.start, newposition.end);

     
// obtenir start country, timezone && location

resultat.start.country = start.country;
resultat.start.timezone = this.formatTimeZone(startOffset)
resultat.start.location = start.location;
    
// obtenir start country, timezone && location
resultat.end.country = end.country;
resultat.end.timezone = this.formatTimeZone(endOffset)
resultat.end.location = end.location;


    // obtenir time zone
resultat.distance.value = this.formatDistance(distance); 
resultat.distance.units = 'km'

     // get time diff and units
resultat.time_diff.value = Math.abs(Math.abs(startOffset)-Math.abs(endOffset))
resultat.time_diff.units = 'hours'

     res.send(resultat);
 })

// Méthode pour obtenir Country et Location
private async getContryAndLocation(url: string,  latlng: string, key: string ) {
    let result: any
    let country: any
    let location: any
  await axios.get(url, {
      params: {
        latlng,
          key
      }
  })

   .then(res => {result = res; 
    const address_components = result.data.results[0].address_components;
   country = address_components[address_components.length -2].long_name;
   location = result.data.results[0].geometry.location;
})

   .catch(err => console.log(err))
  
return {country, location};
}

// Méthode pour obtenir le time zone
private async getTimeZone(url: string, location: string, timestamp:number, key: string) {
    let dstOffset: any;
    let rawOffset: any;
    let result: any
    await axios.get(url, {
       params: {
        location,
        timestamp,
           key
       }
   })
   .then(response => {result = response.data;
     dstOffset = result.dstOffset;
     rawOffset = result.rawOffset})
  .catch(err => console.log(err))

const offset = (dstOffset + rawOffset)/3600
return offset

}

 //Methode de calcul de distance (haversine formula) 
 private calculDistance(origin: ICoord, destination: ICoord) {

    let radius = 6371e3; // # m
  const  dlat = this.degreesToRadians(origin.lat-destination.lat);
  const  dlng = this.degreesToRadians(origin.lng-destination.lng);

    const a = 
              Math.sin(dlat/2) * Math.sin(dlat/2) //  sin(dlat/2)²
            + Math.cos(this.degreesToRadians(origin.lat)) * Math.cos(this.degreesToRadians(destination.lat)) 
            * Math.sin(dlng/2) * Math.sin(dlng/2) // sin(dlng/2)²
            
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = radius * c; //  # m
    return distance

 }

 private degreesToRadians(degrees){
    return degrees * Math.PI / 180;
}

private formatDistance(value: number) {
    return (value / 1000)
}

private formatTimeZone(value : number){
let gmt: string
    if (value < 0) {
      gmt = 'GMT-' + (-value);
      } else {
        gmt = 'GMT+' + (value);
      }
return gmt 
}
}

export default PositionController;