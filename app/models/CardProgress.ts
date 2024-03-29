import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { Card_Progress_Fields } from "../utils/cardProgressUtils"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */

export const CardProgressModel = types
  .model("CardProgress")
  .props({
    [Card_Progress_Fields.ID]: types.identifier,
    [Card_Progress_Fields.TIME_ELAPSED]: types.maybe(types.number),
    [Card_Progress_Fields.CREATED_AT]: types.maybe(types.Date),
    [Card_Progress_Fields.FLASHCARD_ID]: types.string,
    [Card_Progress_Fields.RETRIEVAL_LEVEL]: types.maybe(types.number),
    [Card_Progress_Fields.NEXT_SHOWN]: types.maybe(types.Date),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface CardProgress extends Instance<typeof CardProgressModel> {}
export interface CardProgressSnapshotOut extends SnapshotOut<typeof CardProgressModel> {}
export interface CardProgressSnapshotIn extends SnapshotIn<typeof CardProgressModel> {}
export const createCardProgressDefaultModel = () => types.optional(CardProgressModel, {})
export const CardProgressArray = types.array(CardProgressModel)
