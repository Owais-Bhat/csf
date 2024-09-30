import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import axios from "axios";
import urls from "../urls"; // Make sure axios is installed
import Slider from "../components/slider"; // Import the Slider component
import Blog from "../components/blogList";
import Header from "../components/header";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [singleCategoryPhoto, setSingleCategoryPhoto] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${urls}/api/v1/categry/get-category`);
        console.log("Categories Response:", response.data); // Log the response
        setCategories(response.data.category); // Assuming response.data contains the category array
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch single category photo and store it in state
  const fetchSingleCategory = async (id) => {
    try {
      const response = await axios.get(
        `${urls}/api/v1/categry/singlePhoto-category/${id}`
      );
      if (response.data.photo) {
        setSingleCategoryPhoto(response.data.photo); // Assuming API returns the photo URL in response.data.photo
      } else {
        console.error("Photo URL is empty.");
        setSingleCategoryPhoto(null); // Clear the state if no photo is found
      }
    } catch (error) {
      console.error("Error fetching single category photo:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Static Header */}
      <Header />

      {/* Scrollable content */}
      <ScrollView>
        <Text style={styles.title}>Csf Work</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.cardsContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              categories.map((category, index) => (
                <Card
                  key={index}
                  subtitle={category.name} // Assuming each category has a "name" field
                  image={`${urls}/api/v1/categry/singlePhoto-category/${category._id}`} // Assuming the category has an "image" URL
                  onPress={() => fetchSingleCategory(category._id)} // Fetch single category photo on press
                />
              ))
            )}
          </View>
        </ScrollView>
        {singleCategoryPhoto && (
          <View style={styles.singleCategoryContainer}>
            <Text style={styles.singleCategoryTitle}>
              Selected Category Photo
            </Text>
            <Image
              source={{ uri: singleCategoryPhoto }}
              style={styles.singleCategoryImage}
            />
          </View>
        )}
        <Text style={styles.title2}>Events</Text>

        <Slider />

        <View>
          <Text style={styles.title3}>Blogs</Text>
          <Blog />
        </View>
      </ScrollView>
    </View>
  );
};

// Card Component
const Card = ({ subtitle, image, onPress }) => {
  const [imageError, setImageError] = useState(false); // State to manage image loading error

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={imageError ? require("../../assets/logo.png") : { uri: image }} // Fallback image
        style={styles.cardImage}
        onError={() => setImageError(true)} // Set error if image fails to load
      />
      <Text style={styles.cardText}>{subtitle}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
    marginHorizontal: 10,
  },
  cardsContainer: {
    flexDirection: "row",
    gap: 0,
    paddingHorizontal: 10,
  },
  card: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
    borderColor: "#ccc",
  },
  cardImage: {
    width: "100%",
    height: 80,
    resizeMode: "cover",
    borderRadius: 10,
  },
  cardText: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    width: 100,
  },
  title2: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
    marginHorizontal: 10,
  },
  singleCategoryContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  singleCategoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  singleCategoryImage: {
    width: 300,
    height: 300,
    resizeMode: "cover",
    borderRadius: 10,
  },
  title3: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginHorizontal: 10,
  },
});

export default Home;
