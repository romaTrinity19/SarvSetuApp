import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, StatusBar, StyleSheet, View } from "react-native";

const WelcomeScreen: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const checkUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");

        setTimeout(() => {
          if (userData) {
            // If user is logged in, go to Home screen
            router.replace("/(main)/Home");
          } else {
            // If not logged in, go to Register screen
            router.replace("/(auth)/register");
          }
        }, 3000); // You can reduce or increase the splash screen time
      } catch (error) {
        console.error("Failed to check user data:", error);
        router.replace("/(auth)/register"); // Fallback to register
      }
    };

    checkUserData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 150,
  },
});
