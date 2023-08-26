import { Instance, SnapshotIn, SnapshotOut, flow, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { Subscription, SubscriptionModel, SubscriptionSnapshotIn } from "./Subscription"
import { getSubscription } from "../utils/subscriptionUtils"
import { isAfter } from "date-fns"

/**
 * Model description here for TypeScript hints.
 */
export const SubscriptionStoreModel = types
  .model("SubscriptionStore")
  .props({
    subscription: types.optional(SubscriptionModel, {}),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    hasActiveSubscription: () => {
      const now = new Date()
      return (
        !!self.subscription &&
        !!self.subscription?.end_date &&
        isAfter(new Date(self.subscription?.end_date), now)
      )
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    getSubscription: flow(function* () {
      //Will replace the store with the remote state

      const result: SubscriptionSnapshotIn[] = yield getSubscription()
      const subscriptionModel: Subscription = SubscriptionModel.create(result)

      self.subscription = subscriptionModel
      return result
    }),
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface SubscriptionStore extends Instance<typeof SubscriptionStoreModel> {}
export interface SubscriptionStoreSnapshotOut extends SnapshotOut<typeof SubscriptionStoreModel> {}
export interface SubscriptionStoreSnapshotIn extends SnapshotIn<typeof SubscriptionStoreModel> {}
export const createSubscriptionStoreDefaultModel = () => types.optional(SubscriptionStoreModel, {})
