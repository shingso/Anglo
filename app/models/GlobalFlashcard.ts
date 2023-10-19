import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { Global_Flashcard_Fields } from "../utils/globalFlashcardsUtils"

export enum ConflictTypes {
  UPDATE = "update",
  INSERT = "insert",
}
//TODO CURRENTLY UNUSED/REVIEW AND REMOVE
/**
 * Model description here for TypeScript hints.
 */
export const GlobalFlashcardModel = types
  .model("GlobalFlashcard")
  .props({
    [Global_Flashcard_Fields.ID]: types.identifier,
    [Global_Flashcard_Fields.FRONT]: types.maybe(types.string),
    [Global_Flashcard_Fields.BACK]: types.maybe(types.string),
    [Global_Flashcard_Fields.PICTURE_URL]: types.maybe(types.string),
    [Global_Flashcard_Fields.EXTRA]: types.maybe(types.string),
    [Global_Flashcard_Fields.EXTRA_ARRAY]: types.optional(types.array(types.string), []),
    [Global_Flashcard_Fields.SUB_HEADER]: types.maybe(types.string),
    [Global_Flashcard_Fields.CREATED_AT]: types.maybe(types.Date),
    [Global_Flashcard_Fields.DIFFICULTIY]: types.maybe(types.number),
    [Global_Flashcard_Fields.FREQUENCY]: types.maybe(types.number),
    [Global_Flashcard_Fields.TYPE]: types.maybe(types.string),
    [Global_Flashcard_Fields.LAST_UPDATED]: types.maybe(types.Date),
    conflictType: types.maybe(types.enumeration([ConflictTypes.INSERT, ConflictTypes.UPDATE])),
    include: types.optional(types.boolean, true),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setConflictType(conflictType: ConflictTypes) {
      self.conflictType = conflictType
    },
    toggleInclude() {
      self.include = !self.include
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface GlobalFlashcard extends Instance<typeof GlobalFlashcardModel> {}
export interface GlobalFlashcardSnapshotOut extends SnapshotOut<typeof GlobalFlashcardModel> {}
export interface GlobalFlashcardSnapshotIn extends SnapshotIn<typeof GlobalFlashcardModel> {}
export const createGlobalFlashcardDefaultModel = () => types.optional(GlobalFlashcardModel, {})
