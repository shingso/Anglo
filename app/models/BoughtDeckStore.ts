import { Instance, SnapshotIn, SnapshotOut, flow, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { BoughtDecks, BoughtDecksModel } from "./BoughtDecks"
import { getUserBoughtDecks } from "../utils/boughtDecksUtils"

/**
 * Model description here for TypeScript hints.
 */
export const BoughtDeckStoreModel = types
  .model("BoughtDeckStore")
  .props({
    boughtDecks: types.optional(types.array(BoughtDecksModel), []),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    getUserBoughtDecks: flow(function* () {
      const result: BoughtDeckStoreSnapshotIn[] = yield getUserBoughtDecks()
      const boughtDeckModels: BoughtDecks[] = result.map((c) => BoughtDecksModel.create(c))
      self.boughtDecks.replace(boughtDeckModels)
      return result
    }),
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface BoughtDeckStore extends Instance<typeof BoughtDeckStoreModel> {}
export interface BoughtDeckStoreSnapshotOut extends SnapshotOut<typeof BoughtDeckStoreModel> {}
export interface BoughtDeckStoreSnapshotIn extends SnapshotIn<typeof BoughtDeckStoreModel> {}
export const createBoughtDeckStoreDefaultModel = () => types.optional(BoughtDeckStoreModel, {})
