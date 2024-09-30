import { Stack } from "expo-router";
import { View, Text } from "react-native";
import React from "react";

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="sign_in" options={{ headerShown: false }} />
      <Stack.Screen name="sign_up" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;
