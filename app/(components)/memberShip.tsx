// LifetimeMembershipScreen.tsx
import { fetchUserData } from "@/components/utils/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import ProtectedRoute from "./ProtectedRoute";

interface Package {
  package_id: string;
  package_name: string;
  in_month: string;
  amount: string;
}
const LifetimeMembershipScreen = () => {
  const [packages, setPackage] = useState<Package[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
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
    loadAndFetchUser();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get(
        "https://sarvsetu.trinitycrm.in/admin/Api/dashboard_api.php",
        {
          params: {
            type: "getpackage_info",
            reg_id: userData?.reg_id,
          },
        }
      );
      const data = response.data;
      if (data.status === "success" && data.message) {
        setPackage(data?.message?.package_data);
        console.log("packages packages", packages);
      } else {
        Toast.show({
          type: "error",
          text1: "Invalid package response",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error fetching packages",
      });
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.reg_id) {
      fetchPackages();
    }
  }, [userData?.reg_id]);

  const handlePayOffline = () => {
    if (!selectedPackage) {
      Toast.show({
        type: "error",
        text1: "Please select a membership package",
        position: "top",
      });
      return;
    }

    router.push({
      pathname: "/(components)/payOffline",
      params: {
        packages: JSON.stringify(selectedPackage),
      },
    });
  };

  return (
    <ProtectedRoute>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <LinearGradient
          colors={["#053159", "#057496"]}
          style={styles.container}
        >
          <Ionicons
            name="close"
            size={28}
            color="#fff"
            style={styles.closeIcon}
            onPress={() => router.back()}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.heading}>
              Enjoy Lifetime Membership Features!
            </Text>
            <View style={styles.horizontalLine} />
            <View style={styles.benefitList}>
              <Text style={styles.benefit}>
                ✓ Enjoy a lifetime membership with just one payment
              </Text>
              <Text style={styles.benefit}>
                ✓ Get early access to new events, promotions, or exclusive
                content.
              </Text>
              <Text style={styles.benefit}>
                ✓ Exclusive ability to refer products & earn money.
              </Text>
              <Text style={styles.benefit}>
                ✓ Share product deals & discounts with friends.
              </Text>
            </View>

            <View style={styles.pricingBox}>
              <View style={styles.priceRow1}>
                <Text style={styles.label}>Select Your Prime Membership</Text>
                <Text style={styles.motivationalText}>
                  🎁 Every plan comes with powerful perks — select your package
                  🌟 and level up!🚀
                </Text>
              </View>
              <Image
                source={require("../../assets/images/gift.avif")}
                style={styles.giftImage}
              />
            </View>

            <Text style={styles.heading2}>Choose your Prime Membership:</Text>
            <View style={styles.horizontalLine} />

            <View style={styles.packageList}>
              {loading ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 20,
                  }}
                >
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              ) : packages?.length > 0 ? (
                packages.map((pkg) => (
                  <TouchableOpacity
                    key={pkg.amount}
                    style={[
                      styles.packageItem,
                      selectedPackage?.amount === pkg.amount &&
                        styles.selectedPackage,
                    ]}
                    onPress={() => setSelectedPackage(pkg)}
                  >
                    <Text
                      style={[
                        styles.packageText,
                        selectedPackage?.amount === pkg.amount &&
                          styles.selectedPackageText,
                      ]}
                    >
                      ₹ {pkg.amount} - {pkg.in_month} month {pkg.package_name}{" "}
                      Package
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text
                  style={{
                    textAlign: "center",
                    color: "gray",
                    paddingVertical: 20,
                  }}
                >
                  No packages available.
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.payOfflineBtn}
              onPress={handlePayOffline}
            >
              <Text style={styles.payOfflineText}>Pay Offline</Text>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </ProtectedRoute>
  );
};

export default LifetimeMembershipScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#004080",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  closeIcon: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "#fff",
    marginBottom: 15,
  },

  heading: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 15,
    maxWidth: 200,
  },
  heading2: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 15,
  },
  benefitList: {
    marginBottom: 20,
  },
  benefit: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  pricingBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  motivationalText: {
    fontSize: 15,
    color: "#004080",
    marginTop: 5,
    maxWidth: 220,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#004080",
    marginBottom: 6,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceRow1: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  discountedPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#004080",
  },
  originalPrice: {
    marginLeft: 10,
    fontSize: 16,
    color: "gray",
    textDecorationLine: "line-through",
  },
  giftImage: {
    marginTop: 10,
    width: 90,
    height: 60,
    alignSelf: "flex-end",
  },
  buyNowBtn: {
    padding: 15,
    borderColor: "#fff",
    borderWidth: 1,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
  buyNowText: {
    color: "#fff",
    fontWeight: "bold",
  },
  payOfflineBtn: {
    padding: 15,
    backgroundColor: "#f36c21",
    alignItems: "center",
    borderRadius: 8,
  },
  payOfflineText: {
    color: "#fff",
    fontWeight: "bold",
  },
  packageList: {
    marginBottom: 20,
  },
  packageItem: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#ffffff30",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ffffff50",
  },
  packageText: {
    color: "#fff",
    fontSize: 16,
  },
  selectedPackage: {
    backgroundColor: "#f36c21",
    borderColor: "#fff",
  },
  selectedPackageText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
