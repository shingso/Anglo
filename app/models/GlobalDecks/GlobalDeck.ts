import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from ".././helpers/withSetPropAction"
import { Deck_Fields } from "app/utils/deckUtils"

import {
  PrivateGlobalFlashcardsModel,
  PrivateGlobalFlashcardsSnapshotIn,
} from "./PrivateGlobalFlashcards"

/**
 * Model description here for TypeScript hints.
 */
export const GlobalDeckModel = types
  .model("GlobalDeck")
  .props({
    [Deck_Fields.ID]: types.identifier,
    [Deck_Fields.TITLE]: types.maybe(types.string),
    private_global_flashcards: types.optional(types.array(PrivateGlobalFlashcardsModel), []),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    addFlashcard: (flashcard: PrivateGlobalFlashcardsSnapshotIn) => {
      if (!flashcard) {
        return
      }
      self.private_global_flashcards.push(PrivateGlobalFlashcardsModel.create(flashcard))
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface GlobalDeck extends Instance<typeof GlobalDeckModel> {}
export interface GlobalDeckSnapshotOut extends SnapshotOut<typeof GlobalDeckModel> {}
export interface GlobalDeckSnapshotIn extends SnapshotIn<typeof GlobalDeckModel> {}
export const createGlobalDeckDefaultModel = () => types.optional(GlobalDeckModel, {})
