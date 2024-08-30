import stringToTime from "./stringToTime";
import timeToString from "./timeToString";

interface ConversionFactors {
    [key: string]: {
      [key: string]: number;
    };
  }
  
export const conversionFactors: ConversionFactors = {
  'LCM to SCM': {
    '50 Freestyle': -0.75,
    '50 Backstroke': -0.90,
    '50 Breaststroke': -1.35,
    '50 Butterfly': -0.85,
    '100 Freestyle': -1.75,
    '100 Backstroke': -1.90,
    '100 Breaststroke': -2.75,
    '100 Butterfly': -1.75,
    '200 Freestyle': -3.75,
    '200 Backstroke': -4.00,
    '200 Breaststroke': -5.50,
    '200 Butterfly': -4.00,
    '200 IM': -4.00,
    '400 Freestyle': -7.75,
    '400 IM': -8.00,
    '800 Freestyle': -16.00,
    '1500 Freestyle': -30.00,
  },
  'SCM to LCM': {
    '50 Freestyle': 0.75,
    '50 Backstroke': 0.90,
    '50 Breaststroke': 1.35,
    '50 Butterfly': 0.85,
    '100 Freestyle': 1.75,
    '100 Backstroke': 1.90,
    '100 Breaststroke': 2.75,
    '100 Butterfly': 1.75,
    '200 Freestyle': 3.75,
    '200 Backstroke': 4.00,
    '200 Breaststroke': 5.50,
    '200 Butterfly': 4.00,
    '200 IM': 4.00,
    '400 Freestyle': 7.75,
    '400 IM': 8.00,
    '800 Freestyle': 16.00,
    '1500 Freestyle': 30.00,
  }
};  

export function convertTime(
    time: string,
    stroke: string,
    distance: string,
    originalCourse: string,
    targetCourse: string
  ): string {
    const key = `${originalCourse} to ${targetCourse}`;
    const conversionKey = `${distance} ${stroke}`;
    const factor = conversionFactors[key][conversionKey];
  
    if (!factor) {
      throw new Error('Conversion factor not found');
    }
  
    return timeToString((stringToTime(time) + factor));
  } 