import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, Image } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Button, CustomText, Icon, Screen, Text } from "app/components"

// import { useStores } from "app/models"
import AppIntroSlider from "react-native-app-intro-slider"
import { saveTutorialSeen } from "app/utils/storage/tutorialUtils"
import { getAllKeys } from "app/utils/storage"
import { custom_palette, spacing } from "app/theme"

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
      title: "Study less, know it better",
      text: "Studying is hard. Studying efficiently is even harder. See how this app helps you retain information better.",
      image: require("../../assets/images/girl_looking_at_phone.png"),
    },
    {
      key: "two",
      title: "Our memory spans",
      text: "When we try to memorize something, our brains will forget the information over a period of time",
      image: require("../../assets/images/goldfish_in_bowl.png"),
      backgroundColor: "#febe29",
    },
    {
      key: "three",
      title: "Spaced repitition",
      image: require("../../assets/images/girl_looking_at_phone.png"),
      text: "By revisting what we are trying to memorize before the we completely forget it, we can extend our memory retention",
      backgroundColor: "#22bcb5",
    },
    {
      key: "four",
      image: require("../../assets/images/girl_looking_at_phone.png"),
      title: "Smart cards",
      text: "By using Anglo flashcards, the app can figure out the best time to show you the card again.",
      backgroundColor: "#22bcb5",
    },
    {
      key: "five",
      image: require("../../assets/images/girl_looking_at_phone.png"),
      title: "You know it!",
      text: "If you know the definition of the card confidently, swipe the card left",
      backgroundColor: "#22bcb5",
    },
    {
      key: "six",
      image: require("../../assets/images/girl_looking_at_phone.png"),
      title: "You know it, but weren't confident about it",
      text: "If you got the definition correct, were unsure and took some time recalling, swipe the card up.",
      backgroundColor: "#22bcb5",
    },
    {
      key: "seven",
      image: require("../../assets/images/girl_looking_at_phone.png"),
      title: "Forgot card",
      text: "If you don't know the defintition, swipe left",
    },
    {
      key: "eight",
      image: require("../../assets/images/girl_looking_at_phone.png"),
      title: "Review cards at intervals",
      text: "As you know the card better and better, it the interval will continue to grow. Consistently come back and study the cards",
      backgroundColor: "#22bcb5",
    },
  ]

  const _renderItem = ({ item }) => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: spacing.size200,
          paddingBottom: spacing.size400,
        }}
      >
        <Image
          style={{ height: 275, width: 275, marginBottom: spacing.size200 }}
          source={item.image}
        />
        <CustomText style={{ textAlign: "center", marginBottom: spacing.size80 }} preset="title2">
          {item.title}
        </CustomText>

        <CustomText style={{ textAlign: "center" }} preset="body1">
          {item.text}
        </CustomText>
      </View>
    )
  }

  const _renderNextButton = () => {
    return (
      <View style={{}}>
        <CustomText preset="body1Strong">Next</CustomText>
      </View>
    )
  }
  const _onDone = () => {}
  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <View style={$root}>
      <AppIntroSlider
        activeDotStyle={{ backgroundColor: custom_palette.primary100 }}
        dotStyle={{ backgroundColor: custom_palette.primary60 }}
        renderNextButton={_renderNextButton}
        renderItem={_renderItem}
        data={slides}
        onDone={_onDone}
      />
    </View>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
