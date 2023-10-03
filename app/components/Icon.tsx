import { SCREEN_WIDTH } from "@gorhom/bottom-sheet"
import { useTheme } from "@react-navigation/native"
import * as React from "react"
import { ComponentType, useRef } from "react"
import {
  Animated,
  Image,
  ImageStyle,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native"

export type IconTypes = keyof typeof iconRegistry

interface IconProps extends TouchableOpacityProps {
  /**
   * The name of the icon
   */
  icon: IconTypes

  /**
   * An optional tint color for the icon
   */
  color?: string

  /**
   * An optional size for the icon. If not provided, the icon will be sized to the icon's resolution.
   */
  size?: number

  /**
   * Style overrides for the icon image
   */
  style?: StyleProp<ImageStyle>

  /**
   * Style overrides for the icon container
   */
  containerStyle?: StyleProp<ViewStyle>

  /**
   * An optional function to be called when the icon is pressed
   */
  onPress?: TouchableOpacityProps["onPress"]

  secondary?: boolean
}

/**
 * A component to render a registered icon.
 * It is wrapped in a <TouchableOpacity /> if `onPress` is provided, otherwise a <View />.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Icon.md)
 */
export function Icon(props: IconProps) {
  const theme = useTheme()
  const {
    icon,
    color = theme.colors.foreground1,
    size,
    secondary,
    style: $imageStyleOverride,
    containerStyle: $containerStyleOverride,
    ...WrapperProps
  } = props

  const isPressable = !!WrapperProps.onPress
  const Wrapper: ComponentType<TouchableOpacityProps> = WrapperProps?.onPress
    ? TouchableOpacity
    : View

  return (
    <Wrapper
      accessibilityRole={isPressable ? "imagebutton" : undefined}
      {...WrapperProps}
      style={$containerStyleOverride}
      testID={icon}
    >
      <Image
        style={[
          $imageStyle,
          secondary && { tintColor: theme.colors.foreground2 },
          color && { tintColor: color },
          size && { width: size, height: size },
          $imageStyleOverride,
        ]}
        source={iconRegistry[icon]}
      />
    </Wrapper>
  )
}

export const iconRegistry = {
  back: require("../../assets/icons/back.png"),
  bell: require("../../assets/icons/bell.png"),

  caretRight: require("../../assets/icons/caretRight.png"),
  check: require("../../assets/icons/check.png"),
  clap: require("../../assets/icons/clap.png"),
  community: require("../../assets/icons/community.png"),
  components: require("../../assets/icons/components.png"),
  debug: require("../../assets/icons/debug.png"),
  github: require("../../assets/icons/github.png"),
  heart: require("../../assets/icons/heart.png"),
  hidden: require("../../assets/icons/hidden.png"),
  ladybug: require("../../assets/icons/ladybug.png"),
  lock: require("../../assets/icons/lock.png"),
  menu: require("../../assets/icons/menu.png"),
  more: require("../../assets/icons/more.png"),
  pin: require("../../assets/icons/pin.png"),
  podcast: require("../../assets/icons/podcast.png"),

  slack: require("../../assets/icons/slack.png"),
  view: require("../../assets/icons/view.png"),
  x: require("../../assets/icons/x.png"),

  more_horiz: require("../../assets/icons/more_horiz.png"),
  swipe_up: require("../../assets/icons/swipe_up.png"),
  swipe_left: require("../../assets/icons/swipe_left.png"),
  repeat: require("../../assets/icons/repeat.png"),
  check_circle: require("../../assets/icons/check_circle.png"),
  check_circle_200: require("../../assets/icons/check_circle_200.png"),
  save: require("../../assets/icons/save.png"),
  menu_200: require("../../assets/icons/menu_200.png"),
  menu_300: require("../../assets/icons/menu_300.png"),
  card_300: require("../../assets/icons/card_300.png"),
  card_400: require("../../assets/icons/card_400.png"),
  card_500: require("../../assets/icons/card_500.png"),
  card_600: require("../../assets/icons/card_600.png"),
  card_700: require("../../assets/icons/card_700.png"),
  card_filled: require("../../assets/icons/card_filled.png"),
  more_vert: require("../../assets/icons/more_vert.png"),
  more_vert_600: require("../../assets/icons/more_vert_600.png"),
  more_vert_600_: require("../../assets/icons/more_vert_600_0.png"),
  more_vert_700: require("../../assets/icons/more_vert_700.png"),
  more_vert_700_100: require("../../assets/icons/more_vert_700_100.png"),
  card_add: require("../../assets/icons/card_add.png"),
  delete: require("../../assets/icons/delete.png"),
  search: require("../../assets/icons/search.png"),
  global: require("../../assets/icons/global.png"),
  global_search: require("../../assets/icons/global_search.png"),
  dot: require("../../assets/icons/dot.png"),
  cancel: require("../../assets/icons/cancel.png"),
  edit_filled: require("../../assets/icons/edit_filled.png"),
  caret_up: require("../../assets/icons/caret_up.png"),
  caret_down: require("../../assets/icons/caret_down.png"),
  caret_down400: require("../../assets/icons/caret_down400.png"),
  caret_down500: require("../../assets/icons/caret_down500.png"),
  sound: require("../../assets/icons/sound.png"),
  sound_filled: require("../../assets/icons/sound_filled.png"),
  tap: require("../../assets/icons/tap.png"),
  swipe_right: require("../../assets/icons/swipe_right.png"),
  google_logo: require("../../assets/icons/google_logo.png"),
  apple_logo: require("../../assets/icons/apple_logo.png"),
  play: require("../../assets/icons/play.png"),
  fluent_more: require("../../assets/icons/fluent_more.png"),
  fluent_edit: require("../../assets/icons/fluent_edit.png"),
  fluent_nav: require("../../assets/icons/fluent_nav.png"),
  fluent_settings: require("../../assets/icons/fluent_settings.png"),

  fluent_sort: require("../../assets/icons/fluent_sort.png"),
  fluent_add: require("../../assets/icons/fluent_add.png"),
  fluent_add_square: require("../../assets/icons/fluent_add_square.png"),
  fluent_question_circle: require("../../assets/icons/fluent_question_circle.png"),
  fluent_question_book: require("../../assets/icons/fluent_question_book.png"),
  fluent_sign_out: require("../../assets/icons/fluent_sign_out.png"),
  fluent_lightbulb: require("../../assets/icons/fluent_lightbulb.png"),
  fluent_turtle: require("../../assets/icons/fluent_turtle.png"),
  fluent_calendar: require("../../assets/icons/fluent_calendar.png"),
  fluent_alpha_sort: require("../../assets/icons/fluent_alpha_sort.png"),

  fluent_redo: require("../../assets/icons/fluent_redo.png"),
  fluent_delete: require("../../assets/icons/fluent_delete.png"),
  fluent_save: require("../../assets/icons/fluent_save.png"),
  fluent_camera: require("../../assets/icons/fluent_camera.png"),
  fluent_camera_add: require("../../assets/icons/fluent_camera_add.png"),
  fluent_play_outline: require("../../assets/icons/fluent_play_outline.png"),
  fluent_play_circle: require("../../assets/icons/fluent_play_circle.png"),
  fluent_add_flashcard: require("../../assets/icons/fluent_add_flashcard.png"),
  fluent_search_word: require("../../assets/icons/fluent_search_word.png"),
  fluent_error_circle: require("../../assets/icons/fluent_error_circle.png"),
  fluent_error_circle_filled: require("../../assets/icons/fluent_error_circle_filled.png"),
  fluent_add_circle: require("../../assets/icons/fluent_add_circle.png"),
  fluent_globe_search: require("../../assets/icons/fluent_globe_search.png"),
  fluent_note_edit: require("../../assets/icons/fluent_note_edit.png"),
  fluent_edit_outline: require("../../assets/icons/fluent_edit_outline.png"),
  fluent_add_cards: require("../../assets/icons/fluent_add_cards.png"),

  home: require("../../assets/icons/home.png"),
  play_sound: require("../../assets/icons/play_sound.png"),
  notes: require("../../assets/icons/notes.png"),
  undo: require("../../assets/icons/undo.png"),
  caret_left: require("../../assets/icons/caret_left.png"),
  caret_right: require("../../assets/icons/caret_right.png"),
  moon: require("../../assets/icons/moon.png"),
  flashcards: require("../../assets/icons/flashcards.png"),
  checkmark: require("../../assets/icons/checkmark.png"),
  repeat_arrow: require("../../assets/icons/repeat_arrow.png"),
  settings: require("../../assets/icons/fluent_settings_outline.png"),
  circle: require("../../assets/icons/circle.png"),
  circle_check_filled: require("../../assets/icons/circle_check_filled.png"),
}

const $imageStyle: ImageStyle = {
  resizeMode: "contain",
}
