import Feather from "@expo/vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [secureText, setSecureText] = useState(true);
  
  const navigation = useNavigation();
   const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (loading) return; // Prevent double submission
    setLoading(true);
    if (!email ||!password) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please fill out all required fields.",
        position: "top",
      });
        setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        "https://sarvsetu.trinitycrm.in/admin/Api/registration_api.php",
        {
          email: email,
          password: password,
         
          type: "login",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
     

      if (data.status === "success") {
        await AsyncStorage.setItem("userData", JSON.stringify(data.user_data));
       
        Toast.show({
          type: "success",
          text1: response.data.message,
          position: "top",
        });
        router.replace("/(main)/Home");
      } else {
        Alert.alert("Error", data.message || "Something went wrong.");
      }
    } catch (error: any) {
      if (error.response) {
        console.error("API Error - Response Data:", error.response.data);
        console.error("API Error - Status Code:", error.response.status);
        console.error("API Error - Headers:", error.response.headers);
      } else if (error.request) {
        console.error(" API Error - No response received:", error.request);
      } else {
        console.error("API Error - Error Message:", error.message);
      }
      Toast.show({
        type: "error",
        text1:  error.response?.data?.message ||
          "Something went wrong. Please try again.", 
        text2:
         "Login Failed",
        position: "top",
      });
    }finally {
    setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
       <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // adjust as needed
        > 
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.heading}>Sign in to your{"\n"}Account</Text>

          <Text style={styles.subHeading}>
            Dont have an account?{" "}
            <Text
              style={styles.link2}
              onPress={() => router.push("/(auth)/register")}
            >
              Sign Up
            </Text>
          </Text>
        </View>
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
         
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={{ flex: 1 }}
              placeholder=""
              secureTextEntry={secureText}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              <Feather
                name={secureText ? "eye-off" : "eye"}
                size={20}
                color="#aaa"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Feather
                name={rememberMe ? "check-square" : "square"}
                size={24}
                color={rememberMe ? "#002B5B" : "#ccc"}
              />
              <Text style={{ marginLeft: 8 }}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => router.push("/(auth)/forgotPassword")}
            >
              <Text style={styles.link}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
             {loading ? <ActivityIndicator size="large" color="#fff" />:   <Text style={styles.loginText}>Log In</Text> }
           
          </TouchableOpacity>

          <Text style={styles.footerText}>
            By signing up, you agree to the{" "}
            <Text
              style={styles.link}
              onPress={() => router.push("/(components)/termsOfUse")}
            >
              Terms Of Use
            </Text>{" "}
            and{" "}
            <Text
              style={styles.link}
              onPress={() => router.push("/(components)/dataDeletetionPolicy")}
            >
              Data Deletion Policy
            </Text>
          </Text>
        </View>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 30,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 16,
    marginBottom: 20,
    color: "#fff",
  },
  link: {
    color: "#002B5B",
    fontWeight: 600,
    textDecorationLine: "underline",
  },
  link2: {
    color: "#fff",
    textDecorationLine: "underline",
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
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  remember: {
    marginLeft: 8,
    flex: 1,
  },
  forgotPassword: {
    marginLeft: "auto",
  },
  loginButton: {
    backgroundColor: "#002B5B",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },
});
