import * as React from "react"
import { StyleProp, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, spacing, typography } from "app/theme"
import { Text } from "app/components/Text"
import { FlashcardModel } from "app/models"

import { CustomText } from "./CustomText"
import { Card } from "./Card"

export interface FlashcardListItemProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  onPress?: Function
  flashcard: any
  RightComponent?: any
  LeftComponent?: any
}

/**
 * Describe your component here
 */
export const FlashcardListItem = observer(function FlashcardListItem(
  props: FlashcardListItemProps,
) {
  const { style, onPress, flashcard, RightComponent, LeftComponent } = props
  const $styles = [$container, style]

  return (
    <TouchableOpacity
      onPress={() => (onPress ? onPress() : null)}
      style={{ paddingVertical: spacing.size20 }}
      children={
        <Card
          style={{
            width: "100%",
            padding: 0,
            flexDirection: "row",
            justifyContent: "space-between",
            elevation: 0,
            borderRadius: 4,
            paddingHorizontal: spacing.size160,
            paddingVertical: spacing.size120,
            minHeight: 0,
          }}
          ContentComponent={
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: spacing.size80,
                }}
              >
                {LeftComponent && LeftComponent}
                <CustomText preset="body2">{flashcard.front}</CustomText>
              </View>
              {RightComponent && RightComponent}
            </View>
          }
        ></Card>
      }
    ></TouchableOpacity>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}
