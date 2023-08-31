import * as React from "react"
import { StyleProp, TextStyle, TouchableOpacity, View, ViewStyle, Text, Image } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, custom_colors, spacing, typography } from "app/theme"

import { Card } from "./Card"
import { ScrollView } from "react-native-gesture-handler"
import { CustomText } from "./CustomText"
import { useStores } from "../models/helpers/useStores"
import MaskedView from "@react-native-masked-view/masked-view"
import { LinearGradient } from "expo-linear-gradient"
import { Icon } from "./Icon"
import { AppRoutes, AppStackParamList } from "app/utils/consts"
import { addDays, format } from "date-fns"
import { Button } from "./Button"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { custom } from "mobx-state-tree/dist/internal"
import { borderRadius } from "app/theme/borderRadius"
import { Deck, Flashcard } from "app/models"
import { useEffect, useState } from "react"
import { StatusLabel } from "./StatusLabel"

export interface HomeForecastProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

export const HomeForecast = observer(function HomeForecast(props: HomeForecastProps) {
  const { style } = props
  const $styles = [$container, style]
  const { deckStore, boughtDeckStore } = useStores()
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
    <View style={{ paddingHorizontal: spacing.size160 }}>
      <Card
        onPress={() => navigation.navigate(AppRoutes.SUBSCRIBE)}
        style={{
          marginTop: spacing.size160,

          minHeight: 0,
          elevation: 4,
        }}
        ContentComponent={
          <LinearGradient
            // Button Linear Gradient
            style={{ padding: 8, margin: -8, borderRadius: borderRadius.corner80 }}
            colors={["#5F0F40", "#310E68"]}
            //colors={["#9921e8", "#5f72be"]}

            start={{ x: 0, y: 0.1 }}
          >
            <View
              style={{
                paddingHorizontal: spacing.size160,
                paddingVertical: spacing.size40,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Icon
                icon="fluent_lightbulb"
                style={{ marginRight: spacing.size160 }}
                size={32}
                color="white"
              ></Icon>
              <View>
                <CustomText style={{ color: "white" }} preset="body1Strong">
                  {"Get Smarter"}
                </CustomText>
                <CustomText style={{ color: "white" }} preset="caption1">
                  {"Retain information even better"}
                </CustomText>
              </View>
            </View>
          </LinearGradient>
        }
      ></Card>

      <View style={{ marginTop: spacing.size200, marginBottom: spacing.size120 }}>
        <CustomText preset="title3">{"Today"}</CustomText>
        <View>
          <CustomText preset="body2">
            {format(new Date(), "EEEE")} {format(new Date(), "do")}
          </CustomText>
        </View>
      </View>

      <View>
        {deckStore.decks.map((deck) => {
          return (
            <Card
              onPress={() => selectDeck(deck)}
              key={deck.id}
              style={{
                minHeight: 0,
                elevation: 2,
                marginBottom: spacing.size100,
              }}
              ContentComponent={
                <View
                  style={{
                    paddingHorizontal: spacing.size160,
                    paddingVertical: spacing.size80,
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flex: 1,
                      }}
                    >
                      <CustomText preset="body2Strong">{deck.title}</CustomText>
                      <StatusLabel text={deck?.todaysCards?.length?.toString()}></StatusLabel>
                    </View>
                    {/*  <Icon
                      icon="fluent_play_outline"
                      containerStyle={{ alignSelf: "center" }}
                      color={custom_colors.foreground1}
                      size={20}
                    ></Icon> */}
                  </View>
                </View>
              }
            ></Card>
          )
        })}
      </View>

      <View style={{ marginTop: spacing.size200, marginBottom: spacing.size120 }}>
        <CustomText preset="title3">{"This week"}</CustomText>
      </View>
      <ScrollView
        contentContainerStyle={{ gap: spacing.size40 }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {getDates(addDays(new Date(), 1), addDays(new Date(), 6)).map((date) => {
          return (
            <Card
              key={date}
              style={{ minWidth: 110, elevation: 1, margin: 2, minHeight: 120 }}
              ContentComponent={
                <View>
                  <CustomText preset="body2">{format(new Date(date), "do")}</CustomText>
                  <CustomText preset="body2Strong">
                    {weeklyForecast?.[format(new Date(date), dateFormat)]?.length?.toString()}
                  </CustomText>
                </View>
              }
            ></Card>
          )
        })}
      </ScrollView>

      {/*  <Card
        style={{ padding: spacing.size200, margin: spacing.size120 }}
        ContentComponent={
          <View>
            <MaskedView
              style={{ height: 24, width: 200 }}
              maskElement={
                <View
                  style={{
                    height: 24,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.size60,
                  }}
                >
                  <Image
                    style={[{ tintColor: "black" }, { width: 24, height: 24 }]}
                    source={require("../../assets/icons/fluent_lightbulb.png")}
                  />
                  <CustomText preset="title3">Get Smart</CustomText>
                </View>
              }
            >
              <LinearGradient
                colors={["cadetblue", "#fabada"]}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 0.33 }}
                style={{ flex: 1 }}
              />
            </MaskedView>

            <CustomText preset="title3">Today</CustomText>
            <CustomText preset="caption2" style={{ marginBottom: 20 }}>
              Sat 14th
            </CustomText>
            {deckStore?.decks.map((deck) => {
              return (
                <TouchableOpacity key={deck.id} onPress={() => deckStore.selectDeck(deck)}>
                  <View style={{ marginBottom: spacing.size320 }}>
                    <View>
                      <CustomText preset="body1Strong" style={{ marginBottom: spacing.size40 }}>
                        {deck.title}
                      </CustomText>
                      <CustomText preset="body1">{deck.todaysCards.length} </CustomText>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        }
      ></Card> */}
    </View>
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
