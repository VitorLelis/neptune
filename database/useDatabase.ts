import { useSQLiteContext } from "expo-sqlite"

export type Swimmer = {
    id: number
    name: string
    gender: string
    year_of_birth: number
}

export type Event = {
    id: number
    distance: number
    stroke: string
    course: string
}

export type Time = {
    id: number
    swimmer_id: number
    event_id: number
    time: number
    date: string
}

export type EventTime = {
    distance: number
    stroke: string
    course: string
    id: number // Times ID
    time: number
    date: string
}

export type SwimmerTime = {
    id: number // Swimmer ID
    name: string 
    gender: string 
    time: number 
    date: string 
}

export type SwimmerRelay = {
    id: number // Swimmer ID
    name: string
    year_of_birth: number
    stroke: string
    time: number
}

export function useDatabase(){
    const database = useSQLiteContext()
    async function createSwimmer(data:Omit<Swimmer,"id">) {
        const query = "INSERT INTO swimmers (name,gender,year_of_birth) VALUES (?,?,?);"
        try {
            await database.getAllAsync(query,[data.name, data.gender, data.year_of_birth])
        } catch (error) {
            throw error
        }
    }

    async function listSwimmers() {
        const query =  "SELECT * FROM swimmers;"
        try {
            const response = await database.getAllAsync<Swimmer>(query)
            return response
        } catch (error) {
            throw error
        }
    }

    async function infoSwimmer(id: number) {
        const query = "SELECT * FROM swimmers WHERE id = ?"
        try {
            const response = await database.getFirstAsync<Swimmer>(query, id)
            return response
        } catch (error) {
            throw error
        }
    }

    async function updateSwimmer(data:Swimmer) {
        const query = "UPDATE swimmers SET name = ?, gender = ?, year_of_birth = ? WHERE id = ?"
        try {
            await database.getAllAsync(query,[data.name, data.gender, data.year_of_birth, data.id])
        } catch (error) {
            throw error
        }
    }

    async function addEvent(data: Omit<Event,"id">) {
        const statement = await database.prepareAsync(
            "INSERT INTO events (distance, stroke, course) VALUES ($distance, $stroke, $course)"
          )
      
          try {
            const result = await statement.executeAsync({
              $distance: data.distance,
              $stroke: data.stroke,
              $course: data.course
            })
      
            const insertedRowId = result.lastInsertRowId
      
            return { insertedRowId }
          } catch (error) {
            throw error
          } finally {
            await statement.finalizeAsync()
          }
    }

    async function getEvent(data: Omit<Event,"id">) {
        const query = "SELECT id FROM events WHERE distance = ? AND stroke = ? AND course = ?"
        try {
            const response = await database.getFirstAsync<{ id: number }>(query, [data.distance,data.stroke,data.course])
            if (response && response.id !== undefined) {
                return response.id;
            } else {
                return null;
            }
        } catch (error) {
            throw error
        }
    }

    async function addTime(data:Omit<Time,"id">) {
        const query = "INSERT INTO times (swimmer_id,event_id,time,date) VALUES (?,?,?,?)"
        try {
            await database.getAllAsync(query, [data.swimmer_id,data.event_id,data.time,data.date])
        } catch (error) {
            throw error
        }
    }

    async function updateTime(data:Time) {
        const query = `UPDATE times SET swimmer_id = ?, event_id = ?, time = ?, date = ?
                        WHERE id = ?`
        try {
            await database.getAllAsync(query,[data.swimmer_id, 
                data.event_id, data.time, data.date, data.id])
        } catch (error) {
            throw error
        }
    }

    async function getSwimmerEventTime(id: number) {
        const query = `SELECT events.distance, events.stroke, events.course, times.id, times.time, times.date
                        FROM times INNER JOIN events ON times.event_id = events.id
                        WHERE times.swimmer_id = ?
                        ORDER BY events.stroke ASC, events.distance ASC, course ASC;
                        `
        try {
            const response = database.getAllAsync<EventTime>(query,id)
            return response
        } catch (error) {
            throw error
        }
    }

    async function removeTime(id:number) {
        try {
            await database.execAsync(`DELETE FROM times WHERE id = ${id}`)
          } catch (error) {
            throw error
          }
    }

    async function removeSwimmer(id:number) {
        try {
            await database.execAsync(`DELETE FROM times WHERE swimmer_id = ${id}`)
            await database.execAsync(`DELETE FROM swimmers WHERE id = ${id}`)
        } catch (error) {
            throw error
        }
    }

    async function listEvents() {
        const query =  `SELECT * FROM events
                        ORDER BY stroke ASC, distance ASC, course ASC;
                        `
        try {
            const response = await database.getAllAsync<Event>(query)
            return response
        } catch (error) {
            throw error
        }
    }

    async function getRank(event_id:number) {
        const query = `SELECT swimmers.id, swimmers.name, swimmers.gender, times.time, times.date 
                        FROM times JOIN swimmers ON times.swimmer_id = swimmers.id
                        WHERE times.event_id = ?
                        ORDER BY times.time ASC`
        try {
            const response = database.getAllAsync<SwimmerTime>(query,event_id)
            return response
        } catch (error) {
            throw error
        }
    }

    async function getSwimmerRelay(swimmer_id: number, course: string, distance:number) {
        const query = `SELECT swimmers.id, swimmers.name, swimmers.year_of_birth, events.stroke, MIN(times.time) AS time
                       FROM times 
                       JOIN swimmers ON times.swimmer_id = swimmers.id
                       JOIN events ON times.event_id = events.id
                       WHERE swimmers.id = ? AND events.course = ? AND events.distance = ?
                       GROUP BY events.stroke`
        try {
            const response = database.getAllAsync<SwimmerRelay>(query,[swimmer_id,course,distance])
            return response
        } catch (error) {
            throw error
        }
    }

    return {createSwimmer, listSwimmers, infoSwimmer, updateSwimmer, 
            addEvent, getEvent, addTime, updateTime, getSwimmerEventTime,
            removeTime, removeSwimmer, listEvents, getRank,getSwimmerRelay}
}