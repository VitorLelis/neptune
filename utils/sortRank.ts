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