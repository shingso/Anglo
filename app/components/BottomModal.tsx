import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, spacing, typography } from "../theme"
import { Text } from "./Text"
import Modal from "react-native-modal"
import { useState } from "react"

export interface BottomModalProps {
  /**
   * An optional style override useful for padding & margin.
   */
  children?: any
  visible?: boolean
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const BottomModal = observer(function BottomModal(props: BottomModalProps) {
  const { style, children, visible } = props
  const $styles = [$container, style]

  return (
    <Modal
      style={$modalContainer}
      isVisible={visible}
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
      useNativeDriverForBackdrop={true}
      //swipeDirection={["down", "up"]}
      onSwipeComplete={({ swipingDirection }) => {}}
    >
      <View style={$bottom_modal}>{children}</View>
    </Modal>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 14,
  color: colors.palette.primary500,
}

const $modalContainer: ViewStyle = {
  margin: 0,
  justifyContent: "flex-end",
}

const $bottom_modal: ViewStyle = {
  paddingBottom: 40,
  borderTopRightRadius: 12,
  borderTopLeftRadius: 12,
  backgroundColor: "white",
  padding: spacing.medium,
}
