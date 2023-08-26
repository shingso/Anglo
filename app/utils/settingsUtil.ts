import { load, remove, save } from "./storage"

export const settingsKey = "_settings"

export interface SettingsState {
  [Settings_Fields.SHOW_SESSION_TUTORIAL]?: boolean
  [Settings_Fields.SHOW_INTRO]?: boolean
  [Settings_Fields.THEME]?: Themes
}

export enum Themes {
  LIGHT = "light",
  DARK = "dark",
}

export enum Settings_Fields {
  SHOW_INTRO = "showIntro",
  SHOW_SESSION_TUTORIAL = "showSessionTutorial",
  THEME = "theme",
}

export const defaultSettingsSettings: SettingsState = {
  [Settings_Fields.SHOW_SESSION_TUTORIAL]: true,
  [Settings_Fields.SHOW_INTRO]: true,
  [Settings_Fields.THEME]: Themes.LIGHT,
}

export const initalizeSettings = (): Promise<boolean> => {
  return save(settingsKey, defaultSettingsSettings)
}

export const loadOrInitalizeSettings = async (): Promise<SettingsState> => {
  const settings = await load(settingsKey)
  if (settings) {
    return settings
  }
  const newSettings = await initalizeSettings()
  return defaultSettingsSettings
}

export const reloadDefaultSettings = async () => {
  remove(settingsKey)
  initalizeSettings()
}

export const changeTheme = async (theme: Themes) => {
  const settings = await loadOrInitalizeSettings()
  const newSettings = {
    ...settings,
    [Settings_Fields.THEME]: theme,
  }
  save(settingsKey, newSettings)
}

export const toggleSetting = async (field: Settings_Fields, state: boolean) => {
  const settings = await loadOrInitalizeSettings()
  const newSettings = {
    ...settings,
    [field]: state,
  }
  save(settingsKey, newSettings)
}
