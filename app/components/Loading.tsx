import * as React from "react"
import { ActivityIndicator, StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, spacing, typography } from "app/theme"
import { borderRadius } from "app/theme/borderRadius"

export interface LoadingProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const Loading = observer(function Loading(props: LoadingProps) {
  const { style } = props
  const $styles = [$container, style]

  return (
    <View style={$styles}>
      <View
        style={{
          padding: 20,
          zIndex: 20,
          borderRadius: borderRadius.corner80,
          backgroundColor: "#3D3D3D",
          justifyContent: "center",
          alignItems: "center",
          elevation: 1,
          marginBottom: spacing.size400,
        }}
      >
        <ActivityIndicator color={"#8F8F8F"} size={36}></ActivityIndicator>
      </View>
    </View>
  )
})

const $container: ViewStyle = {
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.06)",
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
}
