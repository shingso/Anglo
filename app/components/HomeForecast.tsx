import * as React from "react"
import { StyleProp, TextStyle, TouchableOpacity, View, ViewStyle, Text, Image } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, custom_colors, custom_palette, spacing, typography } from "app/theme"
import { Card } from "./Card"
import { ScrollView } from "react-native-gesture-handler"
import { CustomText } from "./CustomText"
import { useStores } from "../models/helpers/useStores"
import { Icon } from "./Icon"
import { AppRoutes, AppStackParamList } from "app/utils/consts"
import { addDays, format } from "date-fns"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { Deck, Flashcard } from "app/models"
import { useEffect, useState } from "react"

export interface HomeForecastProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

export const HomeForecast = observer(function HomeForecast(props: HomeForecastProps) {
  const { style } = props
  const $styles = [$container, style]
  const { deckStore } = useStores()
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
  const dateFormat = "yyyy-MM-dd"
  const [weeklyForecast, setWeeklyForecast] = useState({})

  useEffect(() => {
    const forecaset = getWeeklyForecast()
    setWeeklyForecast(forecaset)
  }, [])

  const splitFlashcardsByNextShown = (flashcards: Flashcard[]) => {
    const dividedFlashcards: {
      [key: string]: Flashcard[]
    } = {}

    flashcards.forEach((card) => {
      if (!card?.next_shown) {
        return
      }
      const formattedDate = format(card?.next_shown, "yyyy-MM-dd")
      if (dividedFlashcards?.[formattedDate]) {
        dividedFlashcards[formattedDate].push(card)
      } else {
        dividedFlashcards[formattedDate] = [card]
      }
    })

    return dividedFlashcards
  }

  //what i want to display is the next showns for the next week for all the decks combine them all
  //gradiants  style={{ padding: 8, margin: -8, borderRadius: borderRadius.corner80 }}
  //  colors={["#5F0F40", "#310E68"]}
  const getWeeklyForecast = () => {
    const weeklyForecast: {
      [key: string]: Flashcard[]
    } = {}
    deckStore.decks.forEach((deck) => {
      const splitFlashcards = splitFlashcardsByNextShown(deck?.flashcards)
      for (const [key, value] of Object.entries(splitFlashcards)) {
        if (weeklyForecast?.[key]) {
          weeklyForecast[key].concat(value)
        } else {
          weeklyForecast[key] = [...value]
        }
      }
    })

    return weeklyForecast
  }

  function getDates(startDate: Date, stopDate: Date): string[] {
    const dateArray = []
    let currentDate = startDate
    while (currentDate <= stopDate) {
      dateArray.push(format(new Date(currentDate), dateFormat))
      currentDate = addDays(currentDate, 1)
    }
    return dateArray
  }

  const selectDeck = (deck: Deck) => {
    deckStore.selectDeck(deck)
    navigation.navigate(AppRoutes.DECK_HOME)
  }

  return (
    <View style={$container}>
      <ScrollView
        style={{ marginBottom: spacing.size160 }}
        contentContainerStyle={{ gap: spacing.size40 }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <Card
          style={{ minWidth: 80, elevation: 0, margin: 2 }}
          ContentComponent={
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <CustomText preset="caption1">{format(new Date(), "eee")}</CustomText>
                <CustomText preset="caption1Strong">{"Today"}</CustomText>
              </View>
              <CustomText
                preset="title3"
                style={{ fontFamily: typography.primary.light, marginTop: spacing.size40 }}
              >
                {deckStore.decks
                  .reduce((prev, deck) => {
                    return prev + deck?.todaysCards?.length
                  }, 0)
                  .toString()}
              </CustomText>
            </View>
          }
        ></Card>
        {getDates(addDays(new Date(), 2), addDays(new Date(), 7)).map((date) => {
          return (
            <Card
              key={date}
              style={{ minWidth: 80, elevation: 0, margin: 2 }}
              ContentComponent={
                <View style={{ alignItems: "center" }}>
                  <View
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <CustomText preset="caption1">{format(new Date(date), "eee")}</CustomText>
                    <CustomText preset="caption1Strong">{format(new Date(date), "do")}</CustomText>
                  </View>
                  <CustomText
                    preset="title3"
                    style={{ fontFamily: typography.primary.light, marginTop: spacing.size40 }}
                  >
                    {weeklyForecast?.[format(new Date(date), dateFormat)]?.length?.toString() ||
                      "-"}
                  </CustomText>
                </View>
              }
            ></Card>
          )
        })}
      </ScrollView>
      <View>
        {deckStore.decks.map((deck) => {
          return (
            <Card
              onPress={() => selectDeck(deck)}
              key={deck.id}
              style={{
                elevation: 0,
                marginBottom: spacing.size100,
                paddingHorizontal: spacing.size200,
                paddingVertical: spacing.size160,
                minHeight: 150,
              }}
              ContentComponent={
                <View
                  style={{
                    justifyContent: "space-between",
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      marginBottom: spacing.size240,
                      justifyContent: "space-between",
                    }}
                  >
                    <CustomText preset="body1" style={{ fontFamily: typography.primary.medium }}>
                      {deck?.title}
                    </CustomText>
                    {!!deck?.picture_url && (
                      <Image
                        style={{ height: 44, width: 44 }}
                        source={{
                          uri: deck.picture_url,
                        }}
                      />
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: spacing.size120,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        // borderWidth: 1,
                        //  paddingHorizontal: 12,
                        borderRadius: 12,
                        paddingVertical: 4,
                        borderColor: custom_palette.grey50,
                      }}
                    >
                      <Icon
                        icon="fluent_play_outline"
                        size={20}
                        style={{ marginRight: spacing.size80 }}
                      ></Icon>
                      <CustomText preset="body1">
                        {deck?.todaysCards?.length?.toString()}
                      </CustomText>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        //   borderWidth: 1,
                        paddingHorizontal: 12,
                        borderRadius: 12,
                        paddingVertical: 4,
                        borderColor: custom_palette.grey50,
                      }}
                    >
                      <Icon
                        icon="flashcards"
                        size={20}
                        style={{ marginRight: spacing.size80 }}
                      ></Icon>
                      <CustomText preset="body1">{deck?.flashcards?.length?.toString()}</CustomText>
                    </View>

                    {/*   <CustomText presetColors={"secondary"} preset="body2">
                      {deck?.flashcards?.length?.toString() + " cards"}
                    </CustomText> */}
                  </View>
                </View>
              }
            ></Card>
          )
        })}
      </View>
      {/*    <Button preset="custom_default" onPress={() => deckStore.getDecks()}>
        Refresh decks
      </Button> */}
    </View>
  )
})

const $container: ViewStyle = {
  paddingHorizontal: spacing.size200,
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 14,
  color: colors.palette.primary500,
}
