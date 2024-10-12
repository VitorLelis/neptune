/**
 * Checks if a swimming event exists based on the provided distance, stroke, and course type.
 *
 * @function eventExist
 *
 * @param {number} distance - The distance of the event in meters (e.g., 50, 100, 200, 400).
 * @param {string} stroke - The stroke type for the event (e.g., 'Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', 'Individual Medley').
 * @param {string} course - The type of course ('LCM' for Long Course Meters or 'SCM' for Short Course Meters).
 *
 * @returns {boolean} - Returns `true` if the event exists; `false` otherwise.
 *
 * The function applies specific rules for when an event does not exist:
 *  - A 50-meter "Individual Medley" event does not exist.
 *  - A 100-meter "Individual Medley" event does not exist in Long Course Meters (LCM).
 *  - A 400-meter event with any stroke other than "Freestyle" or "Individual Medley" does not exist.
 *  - Events longer than 400 meters only exist for the "Freestyle" stroke.
 *
 * @example
 * // Check if the 100-meter Freestyle event exists in LCM
 * const isEventValid = eventExist(100, 'Freestyle', 'LCM');
 * console.log(isEventValid); // true
 *
 * @example
 * // Check if the 50-meter Individual Medley event exists
 * const isEventValid = eventExist(50, 'Individual Medley', 'SCM');
 * console.log(isEventValid); // false
 *
 * @example
 * // Check if the 400-meter Butterfly event exists
 * const isEventValid = eventExist(400, 'Butterfly', 'LCM');
 * console.log(isEventValid); // false
 */

export default function eventExist(
  distance: number,
  stroke: string,
  course: string,
): boolean {
  if (distance === 50 && stroke === 'Individual Medley') {
    return false;
  }

  if (distance === 100 && stroke === 'Individual Medley' && course === 'LCM') {
    return false;
  }

  if (
    distance === 400 &&
    stroke !== 'Freestyle' &&
    stroke !== 'Individual Medley'
  ) {
    return false;
  }

  if (distance > 400 && stroke !== 'Freestyle') {
    return false;
  }

  return true;
}
