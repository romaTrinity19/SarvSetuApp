import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CheckoutScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">(
    "online"
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
         
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.header}>Checkout</Text>
          </View>
          {/* Address Section */}
          <View style={styles.addressContainer}>
            <Text style={styles.name}>roma Chakradhari</Text>
            <Text style={styles.addressText}>
              vtv, rfr, Devbhog, Gariaband, Chhattisgarh, India
            </Text>
            <Text style={styles.phone}>+91 7999559862</Text>
            <TouchableOpacity
              onPress={() => router.push("/(components)/myAddress")}
            >
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
          {/* Item Summary */}
          <Text style={styles.sectionTitle}>Items Summary</Text>
          <View style={styles.itemContainer}>
            <Image
              source={require("../../assets/images/image.jpeg")}
              style={styles.itemImage}
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemTitle} numberOfLines={1}>
                Adbiz Unisex Facial Hair Remover – 30-M...
              </Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>₹ 499.00</Text>
                <Text style={styles.originalPrice}>₹ 799.00</Text>
                <Text style={styles.qty}>Qty: 1</Text>
              </View>
            </View>
          </View>
          {/* Payment Method */}
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => setPaymentMethod("cod")}
            >
              <MaterialCommunityIcons
                name={
                  paymentMethod === "cod" ? "radiobox-marked" : "radiobox-blank"
                }
                size={24}
                color="#002B5B"
              />
              <Text style={styles.radioLabel}>Cash On Delivery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => setPaymentMethod("online")}
            >
              <MaterialCommunityIcons
                name={
                  paymentMethod === "online"
                    ? "radiobox-marked"
                    : "radiobox-blank"
                }
                size={24}
                color="#002B5B"
              />
              <Text style={styles.radioLabel}>Online Payment</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 100 }} /> 
          {/* For spacing above fixed bottom */}
        </ScrollView>

        {/* Fixed Bottom Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total (1 Item)</Text>
            <Text style={styles.totalAmount}>₹ 499.00</Text>
          </View>
          <TouchableOpacity style={styles.paymentButton} onPress={()=>router.push('/(components)/proceedPayment')}>
            <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop:20
  },
  wrapper: {
    flex: 1,
    position: "relative",
  },
  container: {
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    gap: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addressContainer: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 16,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  addressText: {
    fontSize: 14,
    marginTop: 5,
  },
  phone: {
    fontSize: 14,
    marginTop: 5,
  },
  changeText: {
    color: "#002B5B",
    marginTop: 8,
    textDecorationLine: "underline",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 12,
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  originalPrice: {
    fontSize: 14,
    color: "gray",
    textDecorationLine: "line-through",
  },
  qty: {
    fontSize: 14,
  },
  radioGroup: {
    marginVertical: 10,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  radioLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
  bottomBar: {
    position: "absolute",
    bottom:25,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
    padding: 15,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#002B5B",
  },
  paymentButton: {
    backgroundColor: "#002B5B",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  paymentButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
