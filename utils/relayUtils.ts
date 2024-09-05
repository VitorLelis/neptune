/**
 * Generates the best relay team from a group of swimmers, calculates their total time, and determines their age group.
 * 
 * @function makeRelay
 * 
 * @param {SwimmerRelay[]} swimmers - An array of `SwimmerRelay` objects, where each object contains:
 *    - `id` (number): The unique identifier of the swimmer.
 *    - `name` (string): The name of the swimmer.
 *    - `year_of_birth` (number): The year of birth of the swimmer.
 *    - `stroke` (string): The stroke that the swimmer specializes in ('Backstroke', 'Breaststroke', 'Butterfly', 'Freestyle').
 *    - `time` (number): The time the swimmer achieved for their stroke in seconds.
 * 
 * @returns {Relay | null} - The best relay team if possible, or `null` if no valid team can be formed. The `Relay` object contains:
 *    - `backstroke` (object): Contains the name and time of the selected backstroke swimmer.
 *    - `breaststroke` (object): Contains the name and time of the selected breaststroke swimmer.
 *    - `butterfly` (object): Contains the name and time of the selected butterfly swimmer.
 *    - `freestyle` (object): Contains the name and time of the selected freestyle swimmer.
 *    - `totalTime` (number): The total time of the relay team in seconds.
 *    - `ageGroup` (number): The age group of the relay team, calculated based on the swimmers' ages.
 * 
 * @example
 * const swimmers: SwimmerRelay[] = [
 *   { id: 1, name: 'Alice', stroke: 'Backstroke', time: 60, year_of_birth: 1985 },
 *   { id: 2, name: 'Bob', stroke: 'Breaststroke', time: 70, year_of_birth: 1988 },
 *   { id: 3, name: 'Charlie', stroke: 'Butterfly', time: 65, year_of_birth: 1990 },
 *   { id: 4, name: 'Diana', stroke: 'Freestyle', time: 58, year_of_birth: 1987 },
 * ];
 * 
 * const bestRelay = makeRelay(swimmers);
 * console.log(bestRelay);
 * // Output: {
 * //   backstroke: { name: 'Alice', time: 60 },
 * //   breaststroke: { name: 'Bob', time: 70 },
 * //   butterfly: { name: 'Charlie', time: 65 },
 * //   freestyle: { name: 'Diana', time: 58 },
 * //   totalTime: 253,
 * //   ageGroup: 2
 * // }
 */


import { SwimmerRelay } from "@/database/useDatabase";

export type Relay ={
    backstroke: {name: string, time: number}
    breaststroke: {name: string, time: number}
    butterfly: {name: string, time: number}
    freestyle: {name: string, time: number}
    totalTime: number
    ageGroup: number
}

function getRelayCombinations(swimmers: SwimmerRelay[]): SwimmerRelay[][] {
    const strokes = ['Backstroke', 'Breaststroke', 'Butterfly', 'Freestyle'];
  
    return strokes.reduce((combinations, stroke) => {
      const currentStrokeSwimmers = swimmers.filter(s => s.stroke === stroke);
      return combinations.flatMap(combo =>
        currentStrokeSwimmers
          .filter(swimmer => !combo.some(s => s.id === swimmer.id))
          .map(swimmer => [...combo, swimmer])
      );
    }, [[]] as SwimmerRelay[][])
}

function calculateTime(relay: SwimmerRelay[]): number{
    return relay.reduce((acc,current) => {return acc + current.time}, 0)
}

function calculateAgeGroup(relay: SwimmerRelay[], currentYear: number): number {
    const totalAge = relay.reduce((sum, swimmer) => {
        return sum + (currentYear - swimmer.year_of_birth)
    }, 0)

    if (totalAge < 100){
        return 0
    }

    else{
        return Math.ceil((totalAge-79) / 40)
    }
}

function getBestRelay(relayOptions:SwimmerRelay[]): SwimmerRelay[] {
    const allCombinations = getRelayCombinations(relayOptions)
    let bestRelay: SwimmerRelay[] = []
    let bestTime = Infinity

    allCombinations.forEach(relay => {
        const currentTime = calculateTime(relay)
        if (currentTime < bestTime) { 
            bestTime = currentTime;
            bestRelay = relay;
        }
    });

    return bestRelay
}

export default function makeRelay(swimmers:SwimmerRelay[]) : Relay|null {
    const bestRelay = getBestRelay(swimmers)

    if (bestRelay === undefined || bestRelay.length == 0) {
        return null;
    }

    const currentYear = new Date().getFullYear()
    const ageGroup = calculateAgeGroup(bestRelay, currentYear)

    const relay: Relay = {
        backstroke: {
            name: bestRelay.find(s => s.stroke === 'Backstroke')!.name,
            time: bestRelay.find(s => s.stroke === 'Backstroke')!.time,
        },
        breaststroke: {
            name: bestRelay.find(s => s.stroke === 'Breaststroke')!.name,
            time: bestRelay.find(s => s.stroke === 'Breaststroke')!.time,
        },
        butterfly: {
            name: bestRelay.find(s => s.stroke === 'Butterfly')!.name,
            time: bestRelay.find(s => s.stroke === 'Butterfly')!.time,
        },
        freestyle: {
            name: bestRelay.find(s => s.stroke === 'Freestyle')!.name,
            time: bestRelay.find(s => s.stroke === 'Freestyle')!.time,
        },
        totalTime: calculateTime(bestRelay),
        ageGroup: ageGroup,
    }

    return relay
}