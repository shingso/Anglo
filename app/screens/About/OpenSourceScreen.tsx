import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { CustomText, Screen, Text } from "../../components"
import { spacing } from "../../theme"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `OpenSource: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="OpenSource" component={OpenSourceScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const OpenSourceScreen: FC<StackScreenProps<AppStackScreenProps, "OpenSource">> = observer(
  function OpenSourceScreen() {
    const OpenSourceItem = ({ title, body }) => {
      return (
        <View style={$item_container}>
          <CustomText preset="body2Strong" style={{ marginBottom: spacing.size120 }}>
            {title}
          </CustomText>
          <CustomText preset="caption1">{body}</CustomText>
        </View>
      )
    }

    const MITLicence = ({ title, copyright }) => {
      return (
        <View style={{ marginBottom: spacing.size280 }}>
          <CustomText style={{ marginBottom: spacing.size120 }} preset="body2Strong">
            {title}
          </CustomText>
          <CustomText preset="caption2" style={{ marginBottom: spacing.size120 }}>
            MIT License
          </CustomText>
          <CustomText preset="caption1Strong" style={{ marginBottom: spacing.size120 }}>
            {copyright}
          </CustomText>
          <CustomText preset="caption2" style={{ marginBottom: spacing.size120 }}>
            Permission is hereby granted, free of charge, to any person obtaining a copy of this
            software and associated documentation files (the 'Software'), to deal in the Software
            without restriction, including without limitation the rights to use, copy, modify,
            merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
            permit persons to whom the Software is furnished to do so, subject to the following
            conditions: The above copyright notice and this permission notice shall be included in
            all copies or substantial portions of the Software.
          </CustomText>
          <CustomText preset="caption2">
            THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
            INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
            PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
            LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
            OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
            OTHER DEALINGS IN THE SOFTWARE."
          </CustomText>
        </View>
      )
    }

    const ApacheLicence = ({ title, copyright }) => {
      return (
        <View style={{ marginBottom: spacing.size280 }}>
          <CustomText style={{ marginBottom: spacing.size120 }} preset="body2Strong">
            {title}
          </CustomText>
          <CustomText preset="caption2" style={{ marginBottom: spacing.size120 }}>
            Apache License
          </CustomText>
          <CustomText preset="caption1Strong" style={{ marginBottom: spacing.size120 }}>
            {copyright}
          </CustomText>
          <CustomText preset="caption2" style={{ marginBottom: spacing.size120 }}>
            Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
            file except in compliance with the License. You may obtain a copy of the License at
            http://www.apache.org/licenses/LICENSE-2.0
          </CustomText>
          <CustomText preset="caption2">
            Unless required by applicable law or agreed to in writing, software distributed under
            the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
            KIND, either express or implied. See the License for the specific language governing
            permissions and limitations under the License.
          </CustomText>
        </View>
      )
    }

    return (
      <Screen style={$root} preset="scroll">
        <View style={$container}>
          <MITLicence
            title={"react"}
            copyright={"Copyright (c) Meta Platforms, Inc. and affiliates."}
          ></MITLicence>
          <MITLicence
            title={"react-native"}
            copyright={"Copyright (c) Meta Platforms, Inc. and affiliates."}
          ></MITLicence>
          <MITLicence
            title={"expo"}
            copyright={"Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)"}
          ></MITLicence>
          <MITLicence
            title={"lodash"}
            copyright={"Copyright JS Foundation and other contributors <https://js.foundation/>"}
          ></MITLicence>
          <MITLicence
            title={"apisauce"}
            copyright={"Copyright (c) 2016 Steve Kellock"}
          ></MITLicence>
          <MITLicence
            title={"react-native-image-picker"}
            copyright={"Copyright (c) 2015-present, Facebook, Inc"}
          ></MITLicence>
          <MITLicence
            title={"react-native-bottom-sheet"}
            copyright={"Copyright (c) 2020 Mo Gorhom"}
          ></MITLicence>
          <MITLicence
            title={"react-native-floating-action"}
            copyright={"Copyright (c) 2017 Gonzalo Santome"}
          ></MITLicence>
          <MITLicence
            title={"react-native-modal"}
            copyright={"Copyright (c) 2017 React Native Community"}
          ></MITLicence>
          <MITLicence
            title={"react-native-toast-message"}
            copyright={"Copyright (c) 2019 Calin Tamas"}
          ></MITLicence>
          <MITLicence
            title={"mobx"}
            copyright={"Copyright (c) 2016 Michel Weststrate"}
          ></MITLicence>
          <MITLicence
            title={"react-native-sound"}
            copyright={"Copyright (c) 2015 Zhen Wang"}
          ></MITLicence>
          <MITLicence
            title={"reactotron"}
            copyright={"Copyright (c) 2016 - 3016 Infinite Red LLC."}
          ></MITLicence>
          <ApacheLicence title={"supabase"} copyright={"Copyright 2023 Supabase"}></ApacheLicence>
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
}

const $item_container: ViewStyle = {
  marginBottom: spacing.size200,
}
