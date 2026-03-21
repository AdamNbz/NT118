import "@expo/metro-runtime";
import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";

// Must be imported before any other component
import "./global.css";

// https://docs.expo.dev/router/introduction/#parent-attributes
export function App() {
  const ctx = require.context("./app");
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
