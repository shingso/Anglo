import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { addFlashcard, deleteFlashcard, updateFlashcard } from "app/utils/flashcardUtils"
import { insertCardProgress } from "app/utils/cardProgressUtils"

/**
 * Model description here for TypeScript hints.
 */

export enum QueryFunctions {
  UPDATE_FLASHCARD = "update_flashcard",
  INSERT_FLASHCARD = "insert_flashcard",
  INSERT_CARD_PROGRESS = "insert_card_progress",
  DELETE_FLASHCARD = "delete_flashcard",
}
export const functionsMap = {
  [QueryFunctions.UPDATE_FLASHCARD]: updateFlashcard,
  [QueryFunctions.INSERT_FLASHCARD]: addFlashcard,
  [QueryFunctions.INSERT_CARD_PROGRESS]: insertCardProgress,
  [QueryFunctions.DELETE_FLASHCARD]: deleteFlashcard,
}

export const QueryModel = types
  .model("Query")
  .props({
    id: types.string,
    function: types.enumeration([
      QueryFunctions.UPDATE_FLASHCARD,
      QueryFunctions.INSERT_FLASHCARD,
      QueryFunctions.INSERT_CARD_PROGRESS,
      QueryFunctions.DELETE_FLASHCARD,
    ]),
    variables: types.maybeNull(types.string),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Query extends Instance<typeof QueryModel> {}
export interface QuerySnapshotOut extends SnapshotOut<typeof QueryModel> {}
export interface QuerySnapshotIn extends SnapshotIn<typeof QueryModel> {}
export const createQueryDefaultModel = () => types.optional(QueryModel, {})
