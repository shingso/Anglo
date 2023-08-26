import { Instance, SnapshotOut, types } from "mobx-state-tree"

import { BoughtDeckStoreModel } from "./BoughtDeckStore"
import { SubscriptionStoreModel } from "./SubscriptionStore"
import { SettingsStoreModel } from "./SettingsStore"
import { AuthStoreModel } from "./AuthStore"
import { DeckStoreModel } from "./DeckStore"
import { GlobalDeckStoreModel } from "./GlobalDecks/GlobalDeckStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  globalDeckStore: types.optional(GlobalDeckStoreModel, {} as any),
  boughtDeckStore: types.optional(BoughtDeckStoreModel, {} as any),
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
