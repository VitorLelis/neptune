export default function eventExist(distance: number, stroke: string, course: string): boolean {
    if (distance === 50 && stroke === "Individual Medley") {
        return false;
    }
    
    if (distance === 100 && stroke === "Individual Medley" && course === "LCM") {
        return false;
    }

    if (distance === 400 && stroke !== "Freestyle" && stroke !== "Individual Medley") {
        return false;
    }

    if (distance > 400 && stroke !== "Freestyle") {
        return false;
    }

    return true;
}
