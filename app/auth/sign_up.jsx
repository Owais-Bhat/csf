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
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import urls from "../urls.jsx";

const SignUp = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailValid, setEmailValid] = useState(null);
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    address: "",
  });
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate logo (looping rotation)
    Animated.loop(
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      })
    ).start();
  }, [fadeAnim]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync(location.coords);
      if (geocode.length > 0) {
        setAddress(
          `${geocode[0].street}, ${geocode[0].city}, ${geocode[0].region}, ${geocode[0].country}`
        );
      }
    })();
  }, []);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateFullName = (name) => {
    const regex = /^[A-Z][a-zA-Z\s]+$/;
    return regex.test(name);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const validatePhoneNumber = (phone) => {
    return phone.length === 10 && /^\d+$/.test(phone);
  };

  const handleSubmit = async () => {
    const newErrors = {
      fullName: validateFullName(fullName)
        ? ""
        : "Full name must start with a capital letter and contain only letters.",
      email: validateEmail(email) ? "" : "Please enter a valid email address.",
      phoneNumber: validatePhoneNumber(phoneNumber)
        ? ""
        : "Phone number must be exactly 10 digits.",
      password: validatePassword(password)
        ? ""
        : "Password must be at least 8 characters, include a capital letter, and a symbol.",
    };
    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        const response = await axios.post(`${urls}/api/v1/user/register`, {
          name: fullName,
          email: email,
          phone: phoneNumber,
          password: password,
          address: address,
        });

        // Store user data in AsyncStorage
        const userData = {
          id: response.data.user._id,
          name: fullName,
          email: email,
          phone: phoneNumber,
          address: address,
        };

        await AsyncStorage.setItem("userData", JSON.stringify(userData));

        alert("Successfully signed up!");
        router.replace("/tabs/home");
      } catch (error) {
        if (error.response) {
          if (
            error.response.data.message ===
            "Email or phone number already registered"
          ) {
            alert(
              "Email or phone number is already registered. Please try another one."
            );
          } else {
            alert("Error signing up. Please try again.");
          }
        } else if (error.request) {
          alert("No response from the server. Please check your connection.");
        } else {
          alert("An error occurred. Please try again.");
        }
      }
    }
  };

  const handleFullNameChange = (name) => {
    setFullName(name.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase()));
    setErrors({ ...errors, fullName: "" });
  };

  const handleEmailChange = (input) => {
    setEmail(input);
    setEmailValid(validateEmail(input));
    setErrors({ ...errors, email: "" });
  };

  const handlePhoneNumberChange = (input) => {
    if (input.length <= 10) {
      setPhoneNumber(input.replace(/[^0-9]/g, ""));
    }
    setErrors({ ...errors, phoneNumber: "" });
  };

  const handlePasswordChange = (input) => {
    setPassword(input);
    setErrors({ ...errors, password: "" });
  };

  const handleAddressChange = (input) => {
    setAddress(input);
    setErrors({ ...errors, address: "" });
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
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          style={styles.fullNameInput}
          placeholder="Full Name"
          value={fullName}
          onChangeText={handleFullNameChange}
          placeholderTextColor="#888"
        />
        {errors.fullName ? (
          <Text style={styles.errorText}>{errors.fullName}</Text>
        ) : null}

        <View style={styles.emailContainer}>
          <TextInput
            style={styles.emailInput}
            placeholder="Email"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            placeholderTextColor="#888"
          />
          {emailValid !== null && (
            <User
              name={emailValid ? "checkmark-circle" : "close-circle"}
              size={24}
              color={emailValid ? "green" : "red"}
              style={{ marginLeft: 10 }}
            />
          )}
        </View>
        {errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}

        <TextInput
          style={styles.phoneNumberInput}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          keyboardType="phone-pad"
          placeholderTextColor="#888"
        />
        {errors.phoneNumber ? (
          <Text style={styles.errorText}>{errors.phoneNumber}</Text>
        ) : null}

        <TextInput
          style={styles.addressInput}
          placeholder="Address"
          value={address}
          onChangeText={handleAddressChange}
          placeholderTextColor="#888"
        />
        {errors.address ? (
          <Text style={styles.errorText}>{errors.address}</Text>
        ) : null}

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={handlePasswordChange}
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
        {errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}

        <Text style={styles.termsText}>
          By signing up, you agree to our{" "}
          <TouchableOpacity onPress={() => alert("Terms & Conditions clicked")}>
            <Text style={styles.termsText2}>Terms & Conditions</Text>
          </TouchableOpacity>{" "}
          and{" "}
          <TouchableOpacity onPress={() => alert("Policies clicked")}>
            <Text style={styles.termsText2}>Policies.</Text>
          </TouchableOpacity>
        </Text>

        <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        <Text style={styles.alreadyHaveAccountText}>
          Already have an account?{" "}
          <TouchableOpacity onPress={() => router.push("auth/sign_in")}>
            <Text style={styles.termsText2}>Login</Text>
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
    flex: 2,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  fullNameInput: {
    height: 40,
    borderColor: "#ccc",
    borderBottomWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
  },
  emailInput: {
    height: 40,
    paddingHorizontal: 10,
    flex: 1,
  },
  phoneNumberInput: {
    height: 40,
    borderColor: "#ccc",
    borderBottomWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  addressInput: {
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
  registerButton: {
    backgroundColor: "black",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  registerButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "light",
    marginBottom: 20,
  },
  termsText: {
    marginTop: 5,
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  termsText2: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
    marginLeft: 5,
  },
  alreadyHaveAccountText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 15,
  },
});

export default SignUp;
