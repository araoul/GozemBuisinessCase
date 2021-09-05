import ICoord from "./coordonnees.interface"

interface IResultat {
    start: IStart;
    end : IStart;
    distance: IDistance;
    time_diff: IDistance
    
}

interface IStart {
    country: string;
    timezone?: string;
    location: ICoord
}

interface IDistance {
    value: number,
    units: string
}

export default IResultat;