import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { CustomText, Screen, Text } from "app/components"
import { spacing } from "app/theme"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface AboutFlashcardScreenProps extends AppStackScreenProps<"AboutFlashcard"> {}

export const AboutFlashcardScreen: FC<AboutFlashcardScreenProps> = observer(
  function AboutFlashcardScreen() {
    const Field = (props) => {
      const { label, body } = props
      return (
        <View>
          <CustomText style={{ marginBottom: spacing.size40 }} preset="body1Strong">
            {label}
          </CustomText>
          <CustomText preset="body2">{body}</CustomText>
        </View>
      )
    }

    return (
      <Screen style={$root} preset="scroll">
        <View style={$container}>
          <Field label={"Front"} body={"The word or concept you are trying to memorize."}></Field>
          <Field
            label={"Back"}
            body={"The information you are trying to relate to the front."}
          ></Field>
          <Field
            label={"Caption"}
            body={
              "A subheader that shows along with the front. Useful for context that helps differentiate the word or concept."
            }
          ></Field>
          <Field
            label={"Extra"}
            body={
              "A field that can be used for any extra context. Can be used for a sample sentence or to provide any additional context."
            }
          ></Field>
          <Field
            label={"Extra Tags"}
            body={"A field used for tags. Used to return a list of items."}
          ></Field>
        </View>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  padding: spacing.size240,
  gap: 20,
}
