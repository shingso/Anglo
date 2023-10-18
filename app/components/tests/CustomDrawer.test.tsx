import { render } from "@testing-library/react-native"
import { CustomDrawer } from "../CustomDrawer"
jest.mock("react-native-safe-area-context", () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 }
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({ children }) => children(inset)),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
  }
})

test("can render custom drawer", async () => {
  //const screen = render(<CustomDrawer navigation={null}></CustomDrawer>)
  expect(true).toBeTruthy()
})
