export default function timeToString(time: number) : string{
    if (time >= 60){
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds.toFixed(2).toString()}`;
      }else{
        return `${time.toFixed(2).toString()}`;
      }
}