// LifetimeMembershipScreen.tsx
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";

const packages = [
  { label: "₹599 – 3 Months Prime", value: "3_months", amount: 599 },
  { label: "₹999 – 6 Months Prime", value: "6_months", amount: 999 },
  { label: "₹1499 – 12 Months Prime", value: "12_months", amount: 1499 },
  { label: "₹2999 – Lifetime Prime", value: "lifetime", amount: 2999 },
];
const LifetimeMembershipScreen = () => {
  const [selectedPackage, setSelectedPackage] = useState<null | {
    label: string;
    value: string;
    amount: number;
  }>(null);

  const handleBuyNow = () => {
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
        label: selectedPackage.label,
        value: selectedPackage.value,
        amount: selectedPackage.amount.toString(), // pass as string in URL
      },
    });
  };

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
        label: selectedPackage.label,
        value: selectedPackage.value,
        amount: selectedPackage.amount.toString(),
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <LinearGradient colors={["#053159", "#057496"]} style={styles.container}>
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
              <Text style={styles.label}>Lifetime Membership</Text>
              <View style={styles.priceRow}>
                <Text style={styles.discountedPrice}>₹ 2999.00/-</Text>
                <Text style={styles.originalPrice}>₹ 5000.00/-</Text>
              </View>
            </View>
            <Image
              source={require("../../assets/images/gift.avif")} // Your actual image path here
              style={styles.giftImage}
            />
          </View>

          <Text style={styles.heading2}>Choose your Prime Membership:</Text>
          <View style={styles.horizontalLine} />

          <View style={styles.packageList}>
            {packages.map((pkg) => (
              <TouchableOpacity
                key={pkg.value}
                style={[
                  styles.packageItem,
                  selectedPackage?.value === pkg.value &&
                    styles.selectedPackage,
                ]}
                onPress={() => setSelectedPackage(pkg)}
              >
                <Text
                  style={[
                    styles.packageText,
                    selectedPackage?.value === pkg.value &&
                      styles.selectedPackageText,
                  ]}
                >
                  {pkg.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.buyNowBtn} onPress={handleBuyNow}>
            <Text style={styles.buyNowText}>Buy Now!</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.payOfflineBtn}
            onPress={handlePayOffline}
          >
            <Text style={styles.payOfflineText}>Pay Offline</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
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
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
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
