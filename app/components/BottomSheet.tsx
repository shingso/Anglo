import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, custom_palette, spacing, typography } from "../theme"
import { Text } from "./Text"
import {
  BottomSheetModalProvider,
  BottomSheetModal,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet"
import { Icon } from "./Icon"
import { forwardRef, Ref, useEffect, useImperativeHandle, useMemo, useRef } from "react"
import { CustomText } from "./CustomText"
import { borderRadius } from "app/theme/borderRadius"
import { useTheme } from "@react-navigation/native"

export interface BottomSheetProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  children?: any
  header?: any
  customSnap?: any
  title?: string
  onDismiss?: Function
}

/**
 * Describe your component here
 */
export const BottomSheet = forwardRef(function BottomSheet(
  props: BottomSheetProps,
  ref: Ref<BottomSheetModal>,
) {
  const { style, children, header, customSnap, title, onDismiss } = props
  const $styles = [$container, style]
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => (customSnap ? customSnap : ["50%", "90%"]), [customSnap])
  const theme = useTheme()
  useImperativeHandle(ref, () => bottomSheetRef.current)

  const renderBackdrop = React.useCallback(
    (props) => (
      <BottomSheetBackdrop opacity={0.4} disappearsOnIndex={-1} appearsOnIndex={0} {...props} />
    ),
    [],
  )

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        backgroundStyle={{
          backgroundColor: theme.colors.background2,
        }}
        handleComponent={() => (
          <View
            style={{
              marginBottom: spacing.size80,
              minHeight: 0,
              paddingBottom: 0,
              alignItems: "center",
              justifyContent: "center",
              marginTop: spacing.size80,
            }}
          >
            <View
              style={{
                width: 40,
                backgroundColor: theme.colors.foreground3,
                height: 4,
                borderRadius: borderRadius.corner120,
              }}
            ></View>
          </View>
        )}
        onDismiss={() => (onDismiss ? onDismiss() : null)}
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        enablePanDownToClose={true}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
      >
        <View style={$styles}>{children}</View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  )
})

const $container: ViewStyle = {
  paddingHorizontal: spacing.size160,
  flex: 1,
}
