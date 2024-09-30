import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import User from "react-native-vector-icons/Ionicons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import urls from "../urls";
const SignIn = () => {
  const router = useRouter();
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [inputError, setInputError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Validation for email and phone
  const validateInput = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    return emailRegex.test(input) || phoneRegex.test(input);
  };

  // Password validation (min 8 characters)
  const validatePassword = (password) => {
    return password.length >= 8;
  };

  // Animate logo (looping rotation)
  useEffect(() => {
    Animated.loop(
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      })
    ).start();
  }, [fadeAnim]);

  // Handle SignIn
  // Handle SignIn
  const handleSignIn = async () => {
    setInputError("");
    setPasswordError("");

    // Validate email/phone and password
    if (!validateInput(phoneOrEmail)) {
      setInputError("Please enter a valid email address or phone number.");
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await axios.post(`${urls}/api/v1/user/login`, {
        phoneOrEmail: phoneOrEmail,
        password: password,
      });

      const userToken = response.data.token; // Assuming token is received in the response
      const userData = response.data.user;

      // Log the token to see if it's received
      console.log("User Token:", userToken);
      console.log("User Data:", userData);

      // Store the user token
      await AsyncStorage.setItem("userToken", userToken);

      // Store full user data and ID
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      await AsyncStorage.setItem("userId", userData.id);

      alert("Successfully signed in!");
      router.replace("/tabs/home");
    } catch (error) {
      // Detailed error logging
      if (error.response) {
        // Server responded with a status other than 2xx
        console.log("Response Error:", error.response.data);
        console.log("Status Code:", error.response.status);
        console.log("Headers:", error.response.headers);

        if (error.response.status === 400) {
          setPasswordError(
            "Invalid email/phone or password. Please try again."
          );
        } else {
          alert(
            "Error: " + error.response.data.message || "An error occurred."
          );
        }
      } else if (error.request) {
        // Request was made, but no response was received
        console.log("No response received:", error.request);
        alert("No response from server. Please check your network or server.");
      } else {
        // Something else caused the error
        console.log("Error:", error.message);
        alert("An unexpected error occurred: " + error.message);
      }
    }
  };

  return (
    <LinearGradient
      colors={["#ab5edc", "#ab5edc", "#ab5edc"]}
      style={styles.container}
    >
      <View style={styles.upperPortion}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <User name="chevron-back" size={30} color="white" />
          <Text style={{ fontSize: 18, color: "white" }}>Back</Text>
        </TouchableOpacity>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
          />
        </Animated.View>
      </View>

      <View style={styles.lowerPortion}>
        <Text style={styles.title}>Sign In</Text>

        {/* Email or Phone Input */}
        <TextInput
          style={styles.input}
          placeholder="Email or Phone"
          value={phoneOrEmail}
          onChangeText={setPhoneOrEmail}
          keyboardType="default"
          placeholderTextColor="#888"
        />
        {inputError ? <Text style={styles.errorText}>{inputError}</Text> : null}

        {/* Password Input with Toggle Visibility */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            placeholderTextColor="#888"
            style={{ flex: 1 }}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.eyeIconContainer}
          >
            <User
              name={passwordVisible ? "eye-off" : "eye"}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        {/* Sign In Button */}
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Don't have an account? Redirect to Sign Up */}
        <Text style={styles.dontHaveAccountText}>
          Don't have an account?{" "}
          <TouchableOpacity onPress={() => router.push("auth/sign_up")}>
            <Text style={styles.redirectText2}>Sign Up</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  upperPortion: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    marginTop: "10%",
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  lowerPortion: {
    flex: 0.8,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderBottomWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 5,
    marginBottom: 15,
    marginLeft: 10,
  },
  eyeIconContainer: {
    position: "absolute",
    right: 10,
  },
  signInButton: {
    backgroundColor: "black",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  signInButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  dontHaveAccountText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  redirectText2: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    flexDirection: "row",
    elevation: 0,
    padding: 5,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SignIn;
