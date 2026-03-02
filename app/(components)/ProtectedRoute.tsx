// app/(components)/ProtectedRoute.tsx
import { fetchUserData } from "@/components/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (!userData) {
          router.replace("/(auth)/login");
          return;
        }

        const parsedUser = JSON.parse(userData);
        const freshUser = await fetchUserData(parsedUser.reg_id);
        if (!freshUser) {
          await AsyncStorage.removeItem("userData");
          router.replace("/(auth)/login");
          return;
        }

        setIsLoggedIn(true);
        // if (userData) {
        //   setIsLoggedIn(true);
        // } else {
        //   router.replace("/(auth)/login"); // redirect if not logged in
        // }
      } catch (error) {
        console.error("Error checking user data:", error);
        router.replace("/(auth)/login");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isLoggedIn) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
