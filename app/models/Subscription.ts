import { Instance, SnapshotIn, SnapshotOut, flow, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import {
  Subscription_Fields,
  cancelSubscription,
  reactivateSubscription,
} from "../utils/subscriptionUtils"
import { showErrorToast } from "app/utils/errorUtils"

/**
 * Model description here for TypeScript hints.
 */
export const SubscriptionModel = types
  .model("Subscription")
  .props({
    [Subscription_Fields.ID]: types.maybe(types.string),
    [Subscription_Fields.CREATED_AT]: types.maybe(types.Date),
    [Subscription_Fields.START_DATE]: types.maybe(types.Date),
    [Subscription_Fields.END_DATE]: types.maybe(types.Date),
    [Subscription_Fields.SUBSCRIPTION_ID]: types.maybe(types.string),
    [Subscription_Fields.CANCEL_AT_END]: types.maybe(types.boolean),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    cancelSubscription: flow(function* () {
      //Will replace the store with the remote state
      if (!self.subscription_id) {
        showErrorToast("Could not cancel subscription")
        return false
      }
      const result = yield cancelSubscription(self?.subscription_id)
      if (result) {
        self.cancel_at_end = true
      }
      return result
    }),

    resumeSubscription: flow(function* () {
      //Will replace the store with the remote state
      if (!self.subscription_id) {
        showErrorToast("Could not reactivate subscription")
        return false
      }
      const result = yield reactivateSubscription(self?.subscription_id)
      if (result) {
        self.cancel_at_end = false
      }
      return result
    }),
  }))
export interface Subscription extends Instance<typeof SubscriptionModel> {}
export interface SubscriptionSnapshotOut extends SnapshotOut<typeof SubscriptionModel> {}
export interface SubscriptionSnapshotIn extends SnapshotIn<typeof SubscriptionModel> {}
export const createSubscriptionDefaultModel = () => types.optional(SubscriptionModel, {})
