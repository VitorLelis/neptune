import { EventTime } from "@/database/useDatabase";

export type TimeDatePair = {
    id: number
    time: number
    date: string
}
  
export type EventTimeItem = {
    key: string 
    events: TimeDatePair[]
}

export default function convertEventTimes(events: EventTime[]): EventTimeItem[] {
    // Create a map to group events by the composite key
    const eventMap: { [key: string]: TimeDatePair[] } = {};
  
    // Populate the map
    events.forEach((event) => {
      const key = `${event.distance} ${event.stroke} (${event.course})`;
      const timePair: TimeDatePair = { id: event.id ,time: event.time, date: event.date };
  
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
      events: eventMap[key]
    }));
  }
  
  