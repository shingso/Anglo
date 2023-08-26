import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { Flashcard_Fields } from "../utils/flashcardUtils"
import { CardProgress, CardProgressModel, CardProgressSnapshotIn } from "./CardProgress"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { Flashcard } from "../components/Flashcard"
import { isToday } from "date-fns"

/**
 * Model description here for TypeScript hints.
 */

export const FlashcardModel = types
  .model("Flashcard")
  .props({
    [Flashcard_Fields.ID]: types.identifier,
    [Flashcard_Fields.FRONT]: types.maybe(types.string),
    [Flashcard_Fields.BACK]: types.maybe(types.string),
    [Flashcard_Fields.NEXT_SHOWN]: types.maybe(types.Date),
    [Flashcard_Fields.DECK_ID]: types.maybe(types.string),
    [Flashcard_Fields.CARD_PROGRESS]: types.optional(types.array(CardProgressModel), []),
    [Flashcard_Fields.NOTES]: types.optional(types.array(types.string), []),
    [Flashcard_Fields.PICTURE_URL]: types.maybe(types.string),
    [Flashcard_Fields.EXTRA]: types.maybe(types.string),
    [Flashcard_Fields.EXTRA_ARRAY]: types.optional(types.array(types.string), []),
    [Flashcard_Fields.SUB_HEADER]: types.maybe(types.string),
    [Flashcard_Fields.GLOBAL_FLASHCARD_ID]: types.maybe(types.string),
    [Flashcard_Fields.CREATED_AT]: types.maybe(types.Date),
    [Flashcard_Fields.DIFFICULTIY]: types.maybe(types.number),
    [Flashcard_Fields.TYPE]: types.maybe(types.string),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    //get the most recent card progress
    get mostRecentProgress() {
      if (!self?.card_progress || !(self.card_progress.length > 0)) {
        return null
      }
      return self.card_progress.reduce((r, a) => {
        return r.created_at! > a.created_at! ? r : a
      })
    },
    get todaysCardProgresses() {
      if (!self?.card_progress || !(self.card_progress.length > 0)) {
        return []
      }
      return self.card_progress.filter(
        (progress) => progress?.created_at && isToday(progress.created_at),
      )
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    updateFlashcard(flashcard: Partial<FlashcardSnapshotIn>) {
      for (const [key, value] of Object.entries(flashcard)) {
        if (!Object.values(Flashcard_Fields).includes(key as any)) {
          return
        }
        switch (key) {
          case Flashcard_Fields.NEXT_SHOWN:
            self[key] = value === undefined ? undefined : new Date(value as any)
            break
          case Flashcard_Fields.EXTRA_ARRAY:
            self.extra_array.replace(value as any)
            break
          default:
            self[key] = value
            break
        }
      }
    },
    addToCardProgress(cardProgress: CardProgressSnapshotIn) {
      const cardProgressModel = CardProgressModel.create(cardProgress)
      self.card_progress.push(cardProgressModel)
      //whenever we do this we want to update or own
    },
    addNote(note: string) {
      self.notes.replace([...self.notes, note])
    },
    deleteNote(text: string) {
      const index = self.notes.findIndex((word) => word === text)
      self.notes.splice(index, 1)
    },
  }))
// eslint-disable-line @typescript-eslint/no-unused-vars

export interface Flashcard extends Instance<typeof FlashcardModel> {}
export interface FlashcardSnapshotOut extends SnapshotOut<typeof FlashcardModel> {}
export interface FlashcardSnapshotIn extends SnapshotIn<typeof FlashcardModel> {}
export const createFlashcardDefaultModel = () => types.optional(FlashcardModel, {})
