import stringToTime from "./stringToTime";
import timeToString from "./timeToString";

/**
 * Converts a swimming time between Long Course Meters (LCM) and Short Course Meters (SCM) 
 * using predefined conversion factors for various strokes and distances.
 * 
 * @function convertTime
 * 
 * @param {string} time - The swimming time to be converted, in the format 'mm:ss.xx' or 'ss.xx'. 
 *                        This should represent the time in either LCM or SCM, based on the originalCourse parameter.
 * @param {string} stroke - The type of stroke being swum (e.g., 'Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', or 'IM').
 * @param {string} distance - The distance of the swim event (e.g., '50', '100', '200', '400', '800', '1500').
 * @param {string} originalCourse - The course type of the provided time ('LCM' for Long Course Meters or 'SCM' for Short Course Meters).
 * @param {string} targetCourse - The course type to which the time should be converted ('LCM' or 'SCM').
 * 
 * @returns {string} - The converted swimming time in the same format as the input time, adjusted for the target course.
 * 
 * @throws {Error} - Throws an error if no conversion factor is found for the given stroke and distance combination.
 * 
 * @example
 * // Convert a time of 1:05.34 for 100 Freestyle from LCM to SCM
 * const convertedTime = convertTime('1:05.34', 'Freestyle', '100', 'LCM', 'SCM');
 * console.log(convertedTime); // Output will be the converted time in SCM
 * 
 * @example
 * // Attempting to convert a time for an unsupported stroke or distance
 * try {
 *   const convertedTime = convertTime('1:05.34', 'Freestyle', '25', 'LCM', 'SCM');
 * } catch (error) {
 *   console.error(error.message); // "Conversion factor not found"
 * }
 */


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