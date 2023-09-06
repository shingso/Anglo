import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { Subscription_Fields } from "../utils/subscriptionUtils"

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
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Subscription extends Instance<typeof SubscriptionModel> {}
export interface SubscriptionSnapshotOut extends SnapshotOut<typeof SubscriptionModel> {}
export interface SubscriptionSnapshotIn extends SnapshotIn<typeof SubscriptionModel> {}
export const createSubscriptionDefaultModel = () => types.optional(SubscriptionModel, {})
