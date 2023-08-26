import { load, saveString } from "./storage"

export const tutorialKey = "_tutorialKey"

export const saveTutorialSeen = async (seen: boolean): Promise<boolean> => {
  return await saveString(tutorialKey, JSON.stringify(seen))
}

export const getTutorialSeen = async (): Promise<any | null> => {
  return await load(tutorialKey)
}

//TODO write a E2E test that tests going to the tutorial screen and reloading the app
//and making sure that the tutorial screen does not show
