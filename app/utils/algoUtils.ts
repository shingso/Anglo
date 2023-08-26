//Add a new card progress - no matter what?

import { insertCardProgress } from "./cardProgressUtils"

//We always update the flashcard no amtter what

//The new card progress is always relatted to the last new card progress

const addMockProgressTest = () => {
  const ids: string[] = [
    "506e24d2-8722-4091-bbe2-0fbe098c247b",
    "54663669-903e-4a18-9855-793a26567de5",
    "eb539d49-1c08-4092-9199-2cf56395bc9e",
    "17c868e2-e9fd-428f-88a7-f612917a35e7",
    "4bfc647c-61ca-48cf-8c58-4f03fbaede6b",
    "aefa1027-9641-4fe0-9550-f73b8507db39",
    "0f48a6ec-3e80-4605-9216-73818dcbc3b7",
    "74d1e3e9-3668-48d4-b901-97ceac67defc",
    "98e2584b-482b-4f00-a425-4b9dc87a9ccc",
    "4f3d0698-6bc1-4b5f-b4e6-844ee714ea59",
    "fb22ce4e-7cad-447f-9cc3-724f2242e05c",
    "5d1fb358-7955-4b5b-bc5b-b8315eb018b0",
    "78925ef1-96ab-46d0-a863-c9d582235887",
    "01a353d4-ff11-4cc2-8a66-dd1b26949eb8",
    "c94ae223-8e49-4fbe-9956-e3a446f3c849",
    "323d0c7b-c9b7-4bd4-b5a1-2266f91788b6",
  ]

  const baseMem = {
    0: 0,
    1: 1440,
    2: 2880,
    3: 5760,
    4: 11520,
    5: 23040,
  }

  function weightedRandom(max, numDice) {
    let num = 0
    for (let i = 0; i < numDice; i++) {
      num += Math.random() * (max / numDice)
    }
    return num
  }

  const progressArray = ids.map((id) => {
    const progress: any = {
      flashcard_id: id,
      mem_level: 0,
      seen: 0,
    }
    return progress
  })

  while (progressArray.length > 0) {
    progressArray.forEach((progress, index) => {
      if (progress.mem_level > 5) {
        progressArray.splice(index, 1)
        return
      }

      const seenMulti = progress.seen * Math.floor(Math.random() * 5) + 1
      const baseElapsedTime = baseMem[progress.mem_level]
      const randomTime = weightedRandom(100, 2)
      let elapsedTime = baseElapsedTime

      let percentChanceToSolve = 100 - randomTime + seenMulti + 5

      if (progress.mem_level === 0) {
        percentChanceToSolve = 50
      }

      const solveChance = Math.floor(Math.random() * 100) + 1
      const passed = solveChance <= percentChanceToSolve

      if (randomTime > 50) {
        const scaled = 100 - randomTime
        const percentage = scaled * 0.01
        const addedTime = baseElapsedTime * percentage
        elapsedTime = baseElapsedTime + addedTime
      } else {
        const scaled = randomTime
        const percentage = scaled * 0.01
        const subTime = baseElapsedTime * percentage
        elapsedTime = baseElapsedTime - subTime
      }

      const newProgress: any = {
        flashcard_id: progress.flashcard_id,
        mem_level: progress.mem_level,
        passed: passed,
        time_elapsed: Math.floor(elapsedTime),
      }

      if (passed) {
        progress.mem_level = progress.mem_level + 1
      } else {
        progress.mem_level = 0
        progress.seen = progress.seen + 1
      }

      insertCardProgress(newProgress)
    })
  }
}
