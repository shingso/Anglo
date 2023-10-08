import * as React from "react"
import { ActivityIndicator, StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, spacing, typography } from "app/theme"
import { borderRadius } from "app/theme/borderRadius"
import { CustomText } from "."

export interface LoadingProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  text?: String
}

/**
 * Describe your component here
 */
export const Loading = observer(function Loading(props: LoadingProps) {
  const { style, text } = props
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
          paddingHorizontal: !!text ? 40 : 20,
        }}
      >
        <ActivityIndicator
          color={"#8F8F8F"}
          style={{ marginBottom: !!text ? spacing.size80 : 0 }}
          size={36}
        ></ActivityIndicator>
        {text ? (
          <CustomText preset="body1" style={{ color: "white" }}>
            {text}
          </CustomText>
        ) : null}
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
