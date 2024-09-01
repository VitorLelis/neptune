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
    return relay.reduce((acc,current) => {
        return acc + current.time
    }, 0)
}

function calculateAgeGroup(relay: SwimmerRelay[], currentYear: number): number | null {
    const ageGroups: { [key: number]: {min:number,max:number} } = {
        0: { min: 0, max: 99 },
        1: { min: 100, max: 119 },
        2: { min: 120, max: 159 },
        3: { min: 160, max: 199 },
        4: { min: 200, max: 239 },
        5: { min: 240, max: 279 },
        6: { min: 280, max: 319 },
        7: { min: 320, max: 359 },
    }

    const totalAge = relay.reduce((sum, swimmer) => {
        const age = currentYear - swimmer.year_of_birth;
        return sum + age;
    }, 0)

    for (const key in ageGroups) {
        const group = ageGroups[Number(key)];
        if (totalAge >= group.min && totalAge <= group.max) {
            return Number(key)
        }
    }

    return null;
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

    if (ageGroup === null) {
        return null
    }

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