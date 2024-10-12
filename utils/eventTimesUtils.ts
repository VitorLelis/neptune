/**
 * Converts an array of swimming event data into a structured format, grouping events by
 * a composite key (distance, stroke, and course) and sorting them by time.
 *
 * @function convertEventTimes
 *
 * @param {EventTime[]} events - An array of swimming event objects, where each event has properties:
 *    - `id` (number): The unique identifier of the time.
 *    - `distance` (number): The distance of the event in meters.
 *    - `stroke` (string): The stroke of the event (e.g., 'Freestyle', 'Backstroke', etc.).
 *    - `course` (string): The type of course ('LCM' or 'SCM').
 *    - `time` (number): The time recorded for the event in seconds.
 *    - `date` (string): The date when the event occurred.
 *
 * @returns {EventTimeItem[]} - Returns an array of `EventTimeItem` objects. Each object contains:
 *    - `key` (string): A composite key combining distance, stroke, and course (e.g., '100m Freestyle (LCM)').
 *    - `events` (TimeDatePair[]): An array of `TimeDatePair` objects, each representing a specific event instance with:
 *       - `id` (number): The unique ID of the time.
 *       - `time` (number): The recorded time in seconds.
 *       - `date` (string): The date of the event in 'YYYY-MM-DD' format.
 *
 * The function performs the following operations:
 *  - Groups events based on a composite key (`distance`, `stroke`, and `course`).
 *  - Sorts the grouped events by their recorded time in ascending order.
 *  - Returns the result as an array of grouped and sorted event records.
 *
 * @example
 * // Example usage with sample event data
 * const eventData = [
 *   { id: 1, distance: 100, stroke: 'Freestyle', course: 'LCM', time: 65.3, date: '2024-01-10' },
 *   { id: 2, distance: 100, stroke: 'Freestyle', course: 'LCM', time: 63.2, date: '2024-02-15' },
 *   { id: 3, distance: 200, stroke: 'Butterfly', course: 'SCM', time: 140.5, date: '2024-01-20' }
 * ];
 *
 * const result = convertEventTimes(eventData);
 * console.log(result);
 *
 * // Output:
 * // [
 * //   {
 * //     key: '100m Freestyle (LCM)',
 * //     events: [
 * //       { id: 2, time: 63.2, date: '2024-02-15' },
 * //       { id: 1, time: 65.3, date: '2024-01-10' }
 * //     ]
 * //   },
 * //   {
 * //     key: '200m Butterfly (SCM)',
 * //     events: [
 * //       { id: 3, time: 140.5, date: '2024-01-20' }
 * //     ]
 * //   }
 * // ]
 */

import { EventTime } from '@/database/useDatabase';

export type TimeDatePair = {
  id: number;
  time: number;
  date: string;
};

export type EventTimeItem = {
  key: string;
  events: TimeDatePair[];
};

export default function convertEventTimes(
  events: EventTime[],
): EventTimeItem[] {
  // Create a map to group events by the composite key
  const eventMap: { [key: string]: TimeDatePair[] } = {};

  // Populate the map
  events.forEach(event => {
    const key = `${event.distance}m ${event.stroke} (${event.course})`;
    const timePair: TimeDatePair = {
      id: event.id,
      time: event.time,
      date: event.date,
    };

    if (!eventMap[key]) {
      eventMap[key] = [];
    }

    eventMap[key].push(timePair);
  });

  // Sort each list by time
  for (const key in eventMap) {
    if (eventMap.hasOwnProperty(key)) {
      eventMap[key].sort((a, b) => a.time - b.time);
    }
  }

  // Convert the map to an array of EventItem
  return Object.keys(eventMap).map(key => ({
    key,
    events: eventMap[key],
  }));
}
