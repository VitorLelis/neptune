export default function timeToString(time: number) : string{
  let result: string = ''
    if (time >= 60){
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        if (seconds>=10){ return `${minutes}:${seconds.toFixed(2).toString()}`}
        else{ return `${minutes}:0${seconds.toFixed(2).toString()}`}
      }else{
        return `${time.toFixed(2).toString()}`;
      }
}