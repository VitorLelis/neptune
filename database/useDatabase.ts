import { useSQLiteContext } from "expo-sqlite"

export type Swimmer = {
    id: number
    name: string
    gender: string
    year_of_birth: number
}

export function useDatabase(){
    const database = useSQLiteContext()

    async function createSwimmer(data:Omit<Swimmer,"id">) {
        /*const statement = await database.prepareAsync(
            "INSERT INTO swimmers (name,gender,year_of_birth) VALUES ($name,$gender,$year_of_birth);"
        )
        try {
            await statement.executeAsync({
                $name: data.name,
                $gender: data.gender,
                $year_of_birth: data.year_of_birth
            })
        } catch (error) {
            throw error
        } finally{
            await statement.finalizeAsync()
        }*/

        const query = "INSERT INTO swimmers (name,gender,year_of_birth) VALUES (?,?,?);"

        try {
            await database.getAllAsync(query,data.name, data.gender, data.year_of_birth)
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

    return {createSwimmer, listSwimmers}
}