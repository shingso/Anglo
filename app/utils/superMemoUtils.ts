import { CardProgressSnapshotIn, Flashcard } from "app/models"

export const calculateEasinessFactor = (cardProgresses: CardProgressSnapshotIn[]): number => {
  let collectiveEasinessFactor = 2.5
  cardProgresses.forEach((progress) => {
    //implementation of supermemo
    collectiveEasinessFactor +=
      0.1 - (2 - progress.retrieval_level) * (0.08 + (2 - progress.retrieval_level) * 0.02)
    //dont let it go below 1.3
    if (collectiveEasinessFactor < 1.3) {
      collectiveEasinessFactor = 1.3
    }
  })
  //return rounded collective easiness factor to two decimal
  return Math.round(collectiveEasinessFactor * 100) / 100
}

export const calculateCurrentRepetition = (cardProgresses: CardProgressSnapshotIn[]): number => {
  let repetition = 0
  cardProgresses.forEach((progress) => {
    if (progress.retrieval_level >= 2) {
      repetition += 1
    } else if (progress.retrieval_level >= 1 && repetition > 1) {
      repetition += 1
    } else {
      repetition = 0
    }
  })
  return repetition
}

export const calculateNextInterval = (flashcard: Flashcard, retrievalLevel: number): number => {
  //interval is a representation of the number of days
  const currentRepitition = calculateCurrentRepetition(flashcard.card_progress)
  const easeFactor = calculateEasinessFactor(flashcard.card_progress)
  // we only want this to occur if the current repition is less than 2

  if (retrievalLevel <= 1 && currentRepitition <= 1) {
    //for the first rank we want to return 0 if we are only sure -> we want to mame sure that we move upwards
    return 0
  }

  if (retrievalLevel >= 1) {
    if (currentRepitition === 0) {
      return 1
    } else if (currentRepitition === 1) {
      return 6
    } else {
      return Math.round(currentRepitition * easeFactor)
    }
  } else {
    return 0
  }
}
