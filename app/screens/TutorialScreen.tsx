import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Button, CustomText, Icon, Screen, Text } from "app/components"

// import { useStores } from "app/models"
import AppIntroSlider from "react-native-app-intro-slider"
import { saveTutorialSeen } from "app/utils/storage/tutorialUtils"
import { getAllKeys } from "app/utils/storage"
import { spacing } from "app/theme"

interface TutorialScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Tutorial">> {}

export const TutorialScreen: FC<TutorialScreenProps> = observer(function TutorialScreen() {
  // const { someStore, anotherStore } = useStores()

  useEffect(() => {
    const setTutorialSeen = async () => {
      await saveTutorialSeen(true)
    }
    setTutorialSeen()
  }, [])

  const slides = [
    {
      key: "one",
      title: "Title 1",
      text: "Spaced Repition",

      backgroundColor: "#59b2ab",
    },
    {
      key: "two",
      title: "Title 2",
      text: "You review information at longer intervals over time",

      backgroundColor: "#febe29",
    },
    {
      key: "three",
      title: "lorum ipsum",
      text: "It helps your brain remember things better by spacing out practice.",
      backgroundColor: "#22bcb5",
    },
    {
      key: "four",
      title: "lorum ipsum",
      text: "When studing swipe right if you know the card.",
      backgroundColor: "#22bcb5",
    },
    {
      key: "five",
      title: "lorum ipsum",
      text: "Swipe left if you dont know at all",
      backgroundColor: "#22bcb5",
    },
    {
      key: "six",
      title: "lorum ipsum",
      text: "Or swipe up if you somewhat can remember the card.",
      backgroundColor: "#22bcb5",
    },
    {
      key: "seven",
      title: "lorum ipsum",
      text: "AI will figure out the best interval to show the card again.",
      backgroundColor: "#22bcb5",
    },
  ]

  const _renderItem = ({ item }) => {
    return (
      <View
        style={{
          flex: 1,
          padding: spacing.size200,
        }}
      >
        <CustomText preset="title3">{item.title}</CustomText>

        <CustomText preset="body1">{item.text}</CustomText>
      </View>
    )
  }

  const _renderNextButton = () => {
    return (
      <View>
        <Icon icon="search" size={24} />
      </View>
    )
  }
  const _onDone = () => {}
  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <View style={$root}>
      <AppIntroSlider renderItem={_renderItem} data={slides} onDone={_onDone} />
    </View>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
