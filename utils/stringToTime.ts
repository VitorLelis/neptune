/**
 * Converts a time string in the format `MIN:SEC.HH` or `SEC.HH` into a numerical value representing total seconds.
 *
 * @function stringToTime
 *
 * @param {string} time - A string representing the time. It can be in one of the following formats:
 *    - `MIN:SEC.HH` (e.g., '1:23.45' for 1 minute, 23.45 seconds)
 *    - `SEC.HH` (e.g., '59.99' for 59.99 seconds)
 *    - The time must be valid and follow the pattern described.
 *
 * @returns {number} - The total time in seconds as a floating-point number.
 *    - The result includes the integer part for seconds and the decimal part for hundredths of a second.
 *
 * @throws {Error} - Throws an error if the input string does not match the valid time format.
 *
 * @example
 * // Convert time in minutes and seconds to total seconds
 * const result1 = stringToTime('1:23.45');
 * console.log(result1);
 * // Output: 83.45 (1 minute = 60 seconds + 23.45 seconds)
 *
 * @example
 * // Convert time in seconds to total seconds
 * const result2 = stringToTime('59.99');
 * console.log(result2);
 * // Output: 59.99
 *
 * @example
 * // Invalid time format
 * try {
 *   const result3 = stringToTime('12:34:56');
 * } catch (e) {
 *   console.error(e.message);
 *   // Output: 'Invalid time format'
 * }
 */

export default function stringToTime(time: string): number {
  // Regular expression to match MIN:SEC.HH or SEC.HH
  const timeRegex = /^([0-5]?\d\:)?([0-5]\d\.\d{2})$/;
  const match = time.match(timeRegex);

  if (!match) {
    throw new Error('Invalid time format');
  }

  let totalSeconds: number;

  totalSeconds = parseFloat(match[2]); //SEC.HH

  if (match[1]) {
    // MIN:SEC.HH
    const minutes = parseFloat(match[1].slice(0, -1)); // Remove the trailing ':'
    totalSeconds += minutes * 60;
  }

  return totalSeconds;
}
