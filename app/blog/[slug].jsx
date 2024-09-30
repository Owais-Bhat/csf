import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Icon for custom back button
import urls from "../urls"; // Your URL config

const BlogDetails = () => {
  const [blog, setBlog] = useState(null);
  const router = useRouter();
  const { slug } = useLocalSearchParams();
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    if (slug) {
      fetchBlogDetails(slug);
    }
  }, [slug]);

  const fetchBlogDetails = async (blogId) => {
    try {
      const response = await axios.get(
        `${urls}/api/v1/blogs/single_blog/${blogId}`
      );
      console.log("Blog fetched:", response?.data);
      setBlog(response?.data);
    } catch (error) {
      console.error("Error fetching blog details:", error);
    }
  };

  if (!blog) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <View style={styles.screenContainer}>
      {/* Custom Back Button */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {blog && (
          <Image
            source={{ uri: `${urls}/api/v1/blogs/singlePhoto/${blog._id}` }}
            style={styles.image}
          />
        )}

        <Text style={styles.title}>{blog.heading}</Text>
        <Text style={styles.content}>{blog.mainContent}</Text>

        {blog.subContents?.map((subContent, index) => (
          <View key={index} style={styles.subContent}>
            <Text style={styles.subheading}>{subContent.subheading}</Text>
            <Text style={styles.subContentText}>{subContent.content}</Text>
            {subContent.photo && (
              <Image
                source={{
                  uri: `${urls}/api/v1/blogs/singlePhoto/${subContent.photo._id}`,
                }}
                style={styles.subContentImage}
              />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2", // Premium light background
    marginTop: 1,
  },
  topBar: {
    position: "absolute",
    top: 40, // Adjust based on header height
    left: 20,
    zIndex: 10, // To ensure it stays on top of content
  },
  backButton: {
    backgroundColor: "#007bff", // Custom button color
    padding: 8,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  container: {
    padding: 20,
    paddingTop: 80, // To avoid content overlap with the back button
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
    resizeMode: "cover",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
    textAlign: "left", // Center title for a premium look
  },
  content: {
    fontSize: 18,
    lineHeight: 28,
    color: "#555",
    marginBottom: 20,
    textAlign: "justify",
  },
  subContent: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  subheading: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
    color: "#007bff", // Color to match premium theme
  },
  subContentText: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    marginBottom: 10,
    textAlign: "justify",
  },
  subContentImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginTop: 10,
    resizeMode: "contain",
  },
  loadingText: {
    fontSize: 18,
    color: "#999",
    textAlign: "center",
    marginTop: 50,
  },
});

export default BlogDetails;
