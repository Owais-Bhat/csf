import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import User from "react-native-vector-icons/FontAwesome6";
import Dono from "react-native-vector-icons/FontAwesome6";
import Blog from "react-native-vector-icons/FontAwesome5";
import Chat from "react-native-vector-icons/MaterialCommunityIcons";

const TabLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: " ",
          tabBarIcon: ({ color, size }) => (
            <User name="house-chimney-user" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="donation"
        options={{
          headerShown: false,
          title: " ",
          tabBarIcon: ({ color, size }) => (
            <Dono name="hand-holding-dollar" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="blog"
        options={{
          headerShown: false,
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Blog name="blogger" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="grevience"
        options={{
          headerShown: false,
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Chat name="message-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "",
          tabBarIcon: ({ color, size }) => (
            <User name="clipboard-user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
