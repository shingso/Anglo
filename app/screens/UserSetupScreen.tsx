import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Button, CustomText, Screen, Text } from "../components"
import { colors, spacing, typography } from "../theme"
import { Education_Levels, User, updateUser } from "../utils/userUtils"
import DropDownPicker from "react-native-dropdown-picker"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `UserSetup: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="UserSetup" component={UserSetupScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const UserSetupScreen: FC<StackScreenProps<AppStackScreenProps, "UserSetup">> = observer(
  function UserSetupScreen() {
    // Pull in one of our MST stores

    // Pull in navigation via hook
    // const navigation = useNavigation()

    const [newPerDay, setNewPerDay] = useState("")
    const [openNewPerDay, setOpenNewPerDay] = useState(false)

    const educationList = Object.values(Education_Levels).map((level) => {
      return {
        label: level,
        value: level,
      }
    })

    const updateUserData = (user: User) => {
      updateUser(user)
    }

    const submitData = () => {}

    return (
      <Screen safeAreaEdges={["top", "bottom"]} style={$root}>
        <View style={$container}>
          <CustomText>Setup</CustomText>
          <CustomText>
            This step is optional, but by providing information about yourself a more personalized
            learning experience can be created for you.
          </CustomText>
          <CustomText></CustomText>
          <CustomText>What is your highest level of education?</CustomText>
          <DropDownPicker
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
            style={$dropdown}
            dropDownContainerStyle={$dropdownContainer}
            selectedItemContainerStyle={$dropdownSelectedContainer}
            selectedItemLabelStyle={$dropdownSelectedLabel}
            TickIconComponent={() => null}
            open={openNewPerDay}
            value={newPerDay}
            items={educationList}
            setOpen={setOpenNewPerDay}
            setValue={setNewPerDay}
            listMode="SCROLLVIEW"
            zIndex={openNewPerDay ? 1 : 0}
          />
          <Button style={{ marginTop: "auto" }} preset="custom_outline">
            Save
          </Button>
        </View>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  padding: spacing.size160,
  paddingBottom: spacing.size560,
  height: "100%",
}

const $dropdownContainer: ViewStyle = {
  borderWidth: 0,
  borderTopWidth: 1,
  borderTopColor: colors.border,
}

const $dropdownSelectedContainer: ViewStyle = {
  backgroundColor: colors.palette.neutral300,
}

const $dropdownSelectedLabel: TextStyle = {
  color: colors.white,
  fontFamily: typography.primary.medium,
}

const $dropdown: ViewStyle = {
  borderWidth: 0,
}
