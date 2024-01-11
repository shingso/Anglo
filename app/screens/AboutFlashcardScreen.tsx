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
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()

    const Field = (props) => {
      const { label, body } = props
      return (
        <View>
          <CustomText style={{ marginBottom: spacing.size40 }} preset="body2Strong">
            {label}
          </CustomText>
          <CustomText preset="body2">{body}</CustomText>
        </View>
      )
    }

    return (
      <Screen style={$root} preset="scroll">
        <View style={$container}>
          <View>
            <CustomText preset="title3">Flashcard fields</CustomText>
            <CustomText preset="caption1">
              The below are the structure of the flashcards.
            </CustomText>
          </View>
          <Field label={"Front"} body={"The word you are trying to memorize."}></Field>
          <Field
            label={"Back"}
            body={"The main definition that is associated with the front."}
          ></Field>
          <Field
            label={"Caption"}
            body={
              "A subheader that shows along with the front. Useful for context that helps differeniate the word, such as for part of speech or prounications."
            }
          ></Field>
          <Field
            label={"Extra"}
            body={
              "An extra field that can be used for any extra context. Can be used for an sample sentence or to provide any additional context."
            }
          ></Field>
          <Field label={"Extra Tags"} body={"Used for a list of items."}></Field>
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
