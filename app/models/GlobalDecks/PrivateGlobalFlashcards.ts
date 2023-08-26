import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./../helpers/withSetPropAction"
import { Flashcard_Fields } from "app/utils/flashcardUtils"

/**
 * Model description here for TypeScript hints.
 */
export const PrivateGlobalFlashcardsModel = types
  .model("PrivateGlobalFlashcards")
  .props({
    [Flashcard_Fields.ID]: types.identifier,
    [Flashcard_Fields.FRONT]: types.maybe(types.string),
    [Flashcard_Fields.BACK]: types.maybe(types.string),
    [Flashcard_Fields.EXTRA]: types.maybe(types.string),
    [Flashcard_Fields.EXTRA_ARRAY]: types.optional(types.array(types.string), []),
    [Flashcard_Fields.PICTURE_URL]: types.maybe(types.string),
    [Flashcard_Fields.SUB_HEADER]: types.maybe(types.string),
    [Flashcard_Fields.CREATED_AT]: types.maybe(types.Date),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface PrivateGlobalFlashcards extends Instance<typeof PrivateGlobalFlashcardsModel> {}
export interface PrivateGlobalFlashcardsSnapshotOut
  extends SnapshotOut<typeof PrivateGlobalFlashcardsModel> {}
export interface PrivateGlobalFlashcardsSnapshotIn
  extends SnapshotIn<typeof PrivateGlobalFlashcardsModel> {}
export const createPrivateGlobalFlashcardsDefaultModel = () =>
  types.optional(PrivateGlobalFlashcardsModel, {})
