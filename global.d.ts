import type { Theme } from "./app/theme"
import "@react-navigation/native"
declare module "@react-navigation/native" {
  export function useTheme(): Theme
}
