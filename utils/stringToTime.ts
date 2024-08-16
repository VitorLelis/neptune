export default function stringToTime(time:string): number {
    // Regular expression to match MIN:SEC.HH or SEC.HH
    const timeRegex = /^([0-5]?\d\:)?([0-5]\d\.\d{2})$/;
    const match = time.match(timeRegex);
  
    if (!match) {
      throw new Error('Invalid time format');
    }
  
    let totalSeconds: number;

    totalSeconds = parseFloat(match[2]); //SEC.HH
  
    if (match[1]) { // MIN:SEC.HH
      const minutes = parseFloat(match[1].slice(0, -1)); // Remove the trailing ':'
      totalSeconds += minutes * 60;
    } 

    return totalSeconds
}