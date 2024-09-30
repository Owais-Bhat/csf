import React from "react";
import { enableScreens } from "react-native-screens";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Enable react-native-screens for better performance
enableScreens();

const App = () => {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="blog/[slug]" options={{ headerShown: false }} />
        <Stack.Screen name="grev/[slug]" options={{ headerShown: false }} />
        <Stack.Screen name="tabs" options={{ headerShown: false }} />
        <Stack.Screen
          name="screen/personaldetails"
          options={{ headerShown: false }}
        />
      </Stack>
    </SafeAreaProvider>
  );
};

export default App;
