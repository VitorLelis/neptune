/**
 * Converts a numerical time value (in seconds) into a formatted time string.
 *
 * @function timeToString
 *
 * @param {number} time - A numerical value representing time in total seconds.
 *    - If the time is 60 seconds or more, it is formatted as `MIN:SEC.HH`.
 *    - If the time is less than 60 seconds, it is formatted as `SEC.HH`.
 *    - The `HH` part represents hundredths of a second.
 *
 * @returns {string} - A string representing the time in a human-readable format:
 *    - `MIN:SEC.HH` for times of 60 seconds or more (e.g., '1:23.45').
 *    - `SEC.HH` for times under 60 seconds (e.g., '59.99').
 *
 * @example
 * // Convert 83.45 seconds to a time string
 * const result1 = timeToString(83.45);
 * console.log(result1);
 * // Output: '1:23.45'
 *
 * @example
 * // Convert 59.99 seconds to a time string
 * const result2 = timeToString(59.99);
 * console.log(result2);
 * // Output: '59.99'
 *
 * @example
 * // Convert 70.5 seconds to a time string
 * const result3 = timeToString(70.5);
 * console.log(result3);
 * // Output: '1:10.50'
 *
 * @example
 * // Convert 45.123 seconds to a time string
 * const result4 = timeToString(45.123);
 * console.log(result4);
 * // Output: '45.12'
 */

export default function timeToString(time: number): string {
  let result: string = '';
  if (time >= 60) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    if (seconds >= 10) {
      return `${minutes}:${seconds.toFixed(2).toString()}`;
    } else {
      return `${minutes}:0${seconds.toFixed(2).toString()}`;
    }
  } else {
    return `${time.toFixed(2).toString()}`;
  }
}
