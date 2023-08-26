import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const BoughtDecksModel = types
  .model("BoughtDecks")
  .props({
    bought_deck_id: types.string,
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface BoughtDecks extends Instance<typeof BoughtDecksModel> {}
export interface BoughtDecksSnapshotOut extends SnapshotOut<typeof BoughtDecksModel> {}
export interface BoughtDecksSnapshotIn extends SnapshotIn<typeof BoughtDecksModel> {}
export const createBoughtDecksDefaultModel = () => types.optional(BoughtDecksModel, {})
