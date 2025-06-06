import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (loading) return; // Prevent double submission
    setLoading(true);
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Missing Field",
        text2: "Please enter your email address.",
        position: "top",
      });
      return;
    }

    try {
      const response = await axios.post(
        "https://sarvsetu.trinitycrm.in/admin/Api/registration_api.php",
        {
          type: "forget_password",
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      if (data.status === "success") {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: data.message || "Password reset link sent to your email.",
          position: "top",
        });
        router.back();
      } else {
        Alert.alert("Error", data.message || "Unable to process request.");
      }
    } catch (error: any) {
      console.error("Forgot Password Error:", error);
      Toast.show({
        type: "error",
        text1: "Request Failed",
        text2: error?.response?.data?.message || "Please try again.",
        position: "top",
      });
    } finally {
      setLoading(false); // Reset loading regardless of outcome
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.heading}>Forgot Password</Text>
          <Text style={styles.subHeading}>
            Enter your email and we’ll send a reset link.
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 30 }}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#555"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleForgotPassword}
          >
            {loading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <Text style={styles.submitText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#002B5B",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  backButton: {
    marginTop: -30,
    marginBottom: 30,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 16,
    color: "#fff",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    color:'black'
  },
  submitButton: {
    backgroundColor: "#002B5B",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
