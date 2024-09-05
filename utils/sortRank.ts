/**
 * Sorts and filters swimmer data based on gender and whether the data should represent individual swimmers or all data.
 * 
 * @function sortRank
 * 
 * @param {SwimmerTime[]} data - An array of swimmer records. Each `SwimmerTime` object contains:
 *    - `id` (number): The unique identifier of the swimmer.
 *    - `name` (string): The name of the swimmer.
 *    - `gender` (string): The gender of the swimmer (e.g., 'Male', 'Female').
 *    - `time` (number): The recorded time for the event in seconds.
 *    - `date` (string): The date when the time was recorded, in 'YYYY-MM-DD' format.
 * @param {boolean} isIndividual - A flag indicating whether to filter for individual swimmers (`true`) or allow all entries (`false`).
 * @param {string} genderSort - A string representing the gender to filter by. Valid values include 'Male', 'Female', or 'None'. 
 *    If 'None' is provided, no gender-based filtering is applied.
 * 
 * @returns {SwimmerTime[]} - Returns a filtered array of swimmer records based on the gender and individual swimmer criteria.
 *    - If `isIndividual` is true, the returned array contains unique swimmer entries (based on their `id`).
 *    - If `isIndividual` is false, all entries that match the gender filter are returned.
 * 
 * @example
 * // Example usage with sample data
 * const swimmers = [
 *   { id: 1, name: 'John Doe', gender: 'Male', time: 60.5, date: '2024-01-10' },
 *   { id: 2, name: 'Jane Smith', gender: 'Female', time: 62.3, date: '2024-02-15' },
 *   { id: 1, name: 'John Doe', gender: 'Male', time: 58.7, date: '2024-03-10' },
 *   { id: 3, name: 'Mary Johnson', gender: 'Female', time: 65.4, date: '2024-04-20' }
 * ];
 * 
 * // Filter for individual male swimmers
 * const maleSwimmers = sortRank(swimmers, true, 'Male');
 * console.log(maleSwimmers);
 * // Output: [{ id: 1, name: 'John Doe', gender: 'Male', time: 60.5, date: '2024-01-10' }]
 * 
 * @example
 * // Filter for all female swimmers, allowing duplicates
 * const femaleSwimmers = sortRank(swimmers, false, 'Female');
 * console.log(femaleSwimmers);
 * // Output: [
 * //   { id: 2, name: 'Jane Smith', gender: 'Female', time: 62.3, date: '2024-02-15' },
 * //   { id: 3, name: 'Mary Johnson', gender: 'Female', time: 65.4, date: '2024-04-20' }
 * // ]
 * 
 * @example
 * // No gender filter, include all entries, without duplicates
 * const allSwimmers = sortRank(swimmers, true, 'None');
 * console.log(allSwimmers);
 * // Output: [
 * //   { id: 1, name: 'John Doe', gender: 'Male', time: 60.5, date: '2024-01-10' },
 * //   { id: 2, name: 'Jane Smith', gender: 'Female', time: 62.3, date: '2024-02-15' },
 * //   { id: 3, name: 'Mary Johnson', gender: 'Female', time: 65.4, date: '2024-04-20' }
 * // ]
 */


import { SwimmerTime } from "@/database/useDatabase";

export default function sortRank(data:SwimmerTime[], isIndividual: boolean, genderSort: string) : SwimmerTime[] {
    let genderData: SwimmerTime[] = []
    if (genderSort !== "None"){
        genderData = data.filter(swimmer => swimmer.gender === genderSort)
    } else{
        genderData = data
    }

  let uniqueData: SwimmerTime[] = [];
  if (isIndividual) {
    const seenIds = new Set<number>();
    genderData.forEach(swimmer => {
      if (!seenIds.has(swimmer.id)) {
        seenIds.add(swimmer.id);
        uniqueData.push(swimmer); 
      }
    })
  } else {
    uniqueData = genderData
  }

  return uniqueData
}