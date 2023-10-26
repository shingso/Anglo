import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { SubscriptionStoreModel } from "./SubscriptionStore"
import { SettingsStoreModel } from "./SettingsStore"
import { AuthStoreModel } from "./AuthStore"
import { DeckStoreModel } from "./DeckStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  subscriptionStore: types.optional(SubscriptionStoreModel, {} as any),
  settingsStore: types.optional(SettingsStoreModel, {} as any),
  authStore: types.optional(AuthStoreModel, {} as any),
  deckStore: types.optional(DeckStoreModel, {} as any),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
