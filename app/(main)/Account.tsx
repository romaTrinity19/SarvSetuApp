import {
  fetchUserData,
  getPackageIngfo,
  getPackageIngfoForUser,
} from "@/components/utils/api";
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
type PackageInfo = {
  is_approved: string;
  amount: string;
  peradd: number;
  // add other fields you use
};
const AccountScreen = () => {
  const [userData, setUserData] = useState<any>(null);
  const name = `${userData?.first_name} ${userData?.last_name}`;
  const [packageInfo, setPackageInfo] = useState<PackageInfo[]>([]);
  const [packageInfoUser, setPackageInfoUser] = useState<PackageInfo[]>([]);

  const initial = name?.charAt(0).toUpperCase();
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userData"); // userData ko local storage se hatao
      router.replace("/(auth)/login"); // login screen pe redirect karo
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const loadAndFetchUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const regId = parsedUser?.reg_id;
        const freshUserData = await fetchUserData(regId);

        setUserData(freshUserData || parsedUser);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  useEffect(() => {
    loadAndFetchUser();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAndFetchUser();
    }, [])
  );

  if (userData?.reg_id) {
    getPackageIngfo(userData.reg_id)
      .then((res) => {
        setPackageInfo(res);
      })
      .catch((err) => {
        console.error("Failed to fetch package info", err);
      });
  }

  if (userData?.reg_id) {
    getPackageIngfoForUser(userData.reg_id)
      .then((res) => {
        setPackageInfoUser(res);
      })
      .catch((err) => {
        console.error("Failed to fetch package info", err);
      });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        {/* Sticky Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>My Account</Text>
        </View>

        {/* Scrollable content below */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              {userData?.profile_image ? (
                <Image
                  source={{ uri: userData.profile_image }}
                  style={styles.avatarImage}
                />
              ) : (
                <Text style={styles.avatarText}>{initial}</Text>
              )}
            </View>

            <View>
              <Text style={styles.name}>Hello {name}</Text>
              <Text style={styles.email}>{userData?.email}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.listItem2}
            onPress={() => {
              packageInfoUser[0]?.is_approved == "1" ||
              packageInfo[0]?.is_approved == "1"
                ? router.push("/(main)/Home")
                : router.push("/(components)/memberShip");
            }}
          >
            <Text style={styles.title}>Buy An Subscription</Text>
            <Text style={styles.status}>
              Status:{" "}
              <Text
                style={
                  packageInfoUser[0]?.is_approved == "1" ||
                  packageInfo[0]?.is_approved == "1"
                    ? styles.statusActive
                    : styles.statusInactive
                }
              >
                {packageInfoUser[0]?.is_approved == "1" ||
                packageInfo[0]?.is_approved == "1"
                  ? "Active"
                  : "Inactive"}
              </Text>
            </Text>
          </TouchableOpacity>

          <MenuItem
            title="Edit Profile"
            subtitle="Update your information"
            route="/(components)/editProfile"
          />
          <MenuItem
            title="About Us"
            subtitle="Get to Know Us"
            route="/(components)/aboutUs"
          />
          <MenuItem
            title="Privacy Policy"
            subtitle="How we use your information"
            route="/(components)/privacyPolicy"
          />
          <MenuItem
            title="Cancellation Policy"
            subtitle="Cancellation Support Info"
            route="/(components)/cancellationPolicy"
          />
          <MenuItem
            title="Help"
            subtitle="Learn Easily with Video Guides"
            route="/(components)/help"
          />
          <MenuItem
            title="Contact Us"
            subtitle="Reach us anytime, anywhere!"
            route="/(components)/contactUs"
          />

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>

          {/* <View style={styles.socialContainer}>
            <FontAwesome name="instagram" size={24} style={styles.socialIcon} />
            <Entypo name="facebook" size={24} style={styles.socialIcon} />
            <Ionicons name="logo-twitter" size={24} style={styles.socialIcon} />
          </View> */}
          
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const MenuItem = ({
  title,
  subtitle,
  route,
}: {
  title: string;
  subtitle: string;
  route: any;
}) => (
  <TouchableOpacity style={styles.listItem} onPress={() => router.push(route)}>
    <View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="gray" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: "cover",
  },

  headerContainer: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    zIndex: 10,
    elevation: 2,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#7D7A7A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  email: {
    color: "gray",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  listItem2: {
    flexDirection: "column",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
    gap: 5,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 12,
    color: "gray",
  },
  status: {
    fontSize: 12,
    color: "gray",
  },
  statusActive: {
    color: "green",
    fontWeight: "bold",
  },
  statusInactive: {
    color: "red",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#F2EBEB",
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 30,
    borderRadius: 8,
  },
  logoutText: {
    color: "red",
    fontWeight: "bold",
  },
  socialContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 20,
    marginBottom: 60,
  },
  socialIcon: {
    color: "#002B5B",
  },
});

export default AccountScreen;
