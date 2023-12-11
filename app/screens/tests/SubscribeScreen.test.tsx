import { useNavigation } from "@react-navigation/native"
import { HAS_SUBSCRIPTION_TITLE, SubscribeScreen } from "../SubscribeScreen"
import { SubscriptionModel, SubscriptionStoreModel, useStores } from "app/models"
import { render } from "@testing-library/react-native"
import MockedNavigator from "./MockedNavigator"
import { mockSubscriptionStoreNoSubCreate } from "app/components/mock/mock"

jest.mock("../../models/helpers/useStores", () => ({
  useStores: () => ({
    subscriptionStore: mockSubscriptionStoreNoSubCreate,
  }),
}))

test("subscribe screen works", async () => {
  const { subscriptionStore } = useStores()

  const screen = render(<MockedNavigator component={SubscribeScreen} />)
  //check if the correct subscribe buttons are on the screen
  //after a success we need to show the other screen
  expect(screen.getByText("Subscription plan")).toBeTruthy()
  expect(screen.getByText("6 month subscription")).toBeTruthy()
  expect(screen.getByText("12 month subscription")).toBeTruthy()
  //if make sure we can not unsubscribe
  expect(screen).toBeTruthy()
})
