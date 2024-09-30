import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const WelcomeScreen = () => {
  const router = useRouter();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity for fade-in
  const scaleAnim = useRef(new Animated.Value(1)).current; // Initial scale for button
  const scaleXAnim = useRef(new Animated.Value(1)).current; // Initial scaleX for width

  // Start the fade-in animation on component mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Fully opaque
      duration: 2000, // 2 seconds
      useNativeDriver: true, // Use native driver for better performance
    }).start();

    // Simulate a width animation using scaleX
    Animated.timing(scaleXAnim, {
      toValue: 1.5, // Increase the width (via scaleX)
      duration: 2000, // 2 seconds
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, scaleXAnim]);

  // Button press animation (scale)
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.2, // Enlarge button
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1, // Back to original size
      friction: 6,
      useNativeDriver: true,
    }).start();
    // Navigate to the sign-up page
    router.push("auth/sign_up");
  };

  return (
    <LinearGradient
      colors={["#ab5edc", "#ab5edc", "#ab5edc"]}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        {/* Animated Image with fade-in */}
        <Animated.Image
          source={require("../assets/logo.png")}
          style={[styles.logo, { opacity: fadeAnim }]} // Bind opacity to fadeAnim
        />
        {/* Animated Button with scale effect */}
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }, { scaleX: scaleXAnim }],
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <View style={styles.textContainer}>
              <Text style={styles.buttonText}>Let's Go</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  logo: {
    width: 400,
    height: 300,
    resizeMode: "contain",
    marginBottom: "20%",
  },
  button: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "40%",
  },
  textContainer: {
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#4c669f",
  },
});

export default WelcomeScreen;
