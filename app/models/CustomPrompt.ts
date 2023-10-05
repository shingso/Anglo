import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const CustomPromptModel = types
  .model("CustomPrompt")
  .props({})
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface CustomPrompt extends Instance<typeof CustomPromptModel> {}
export interface CustomPromptSnapshotOut extends SnapshotOut<typeof CustomPromptModel> {}
export interface CustomPromptSnapshotIn extends SnapshotIn<typeof CustomPromptModel> {}
export const createCustomPromptDefaultModel = () => types.optional(CustomPromptModel, {})
