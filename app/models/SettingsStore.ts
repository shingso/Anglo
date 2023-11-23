import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const SettingsStoreModel = types
  .model("SettingsStore")
  .props({
    isOffline: types.optional(types.boolean, false),
    isDarkMode: types.optional(types.boolean, false),
    showSessionTutorial: types.optional(types.boolean, true),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setIsOffline(state: boolean) {
      self.isOffline = state
    },
    toggleTheme() {
      self.isDarkMode = !self.isDarkMode
    },
    setShowSessionTutorial(state: boolean) {
      self.showSessionTutorial = state
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface SettingsStore extends Instance<typeof SettingsStoreModel> {}
export interface SettingsStoreSnapshotOut extends SnapshotOut<typeof SettingsStoreModel> {}
export interface SettingsStoreSnapshotIn extends SnapshotIn<typeof SettingsStoreModel> {}
export const createSettingsStoreDefaultModel = () => types.optional(SettingsStoreModel, {})
