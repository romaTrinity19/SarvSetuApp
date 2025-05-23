// LifetimeMembershipScreen.tsx
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const LifetimeMembershipScreen = () => {
  return (
    <LinearGradient colors={["#053159", "#057496"]} style={styles.container}>
      <Ionicons
        name="close"
        size={28}
        color="#fff"
        style={styles.closeIcon}
        onPress={() => router.back()}
      />
      <Text style={styles.heading}>Enjoy Lifetime Membership Features!</Text>
      <View style={styles.horizontalLine} />
      <View style={styles.benefitList}>
        <Text style={styles.benefit}>
          ✓ Enjoy a lifetime membership with just one payment
        </Text>
        <Text style={styles.benefit}>
          ✓ Get early access to new events, promotions, or exclusive content.
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
            <Text style={styles.discountedPrice}>₹ 960.00/-</Text>
            <Text style={styles.originalPrice}>₹ 1000.00/-</Text>
          </View>
        </View>
        <Image
          source={require("../../assets/images/gift.avif")} // Your actual image path here
          style={styles.giftImage}
        />
      </View>

      <TouchableOpacity style={styles.buyNowBtn}>
        <Text style={styles.buyNowText}>Buy Now!</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.payOfflineBtn} onPress={()=>router.push('/(components)/payOffline')}>
        <Text style={styles.payOfflineText}>Pay Offline</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default LifetimeMembershipScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#004080",
    padding: 20,
    paddingTop: 70,
    marginTop: 30,
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
    borderColor:'#fff',
    borderWidth:1,
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
});
