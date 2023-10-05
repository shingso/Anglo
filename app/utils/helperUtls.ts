export function millisecondsToTime(milliseconds: number) {
  let seconds = (milliseconds / 1000).toFixed(0)
  let minutes = (milliseconds / (1000 * 60)).toFixed(0)
  let hours = (milliseconds / (1000 * 60 * 60)).toFixed(0)
  let days = (milliseconds / (1000 * 60 * 60 * 24)).toFixed(0)
  if (Number(seconds) < 60) return seconds + " seconds"
  else if (Number(minutes) < 60) return minutes + " minutes"
  else if (Number(hours) < 24) return hours + " hours"
  else return days + " days"
}

export const shuffle = (array: any[]) => {
  let currentIndex = array.length
  let randomIndex: number
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}

export const capitalizeFirstLetter = (string: string): string => {
  if (!!string) {
    return ""
  }
  return string.charAt(0).toUpperCase() + string.slice(1)
}
