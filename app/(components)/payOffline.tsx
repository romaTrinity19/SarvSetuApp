import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Clipboard,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import ProtectedRoute from "./ProtectedRoute";

type PaymentData = {
  bank_id: string;
  qrcode: string;
  upi_id: string;
  upi_id2: string;
  account_numbar: string;
  ifsc_code: string;
};

export default function PaymentInformation() {
  const [userData, setUserData] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [selectedImage, setSelectedImage] = useState<ImagePickerAsset | null>(
    null
  );
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const { packages } = useLocalSearchParams(); // This is a JSON string
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof packages === "string") {
      try {
        const parsedPackage = JSON.parse(packages);
        setSelectedPackage(parsedPackage);
      } catch (error) {
        console.error("Failed to parse package:", error);
      }
    }
  }, [packages]);

  const qrCodeImage = require("../../assets/images/react-logo.png"); // Replace with your actual QR image

  const handleSelect = (method: any) => {
    setSelectedMethod(selectedMethod === method ? null : method);
  };

  const copyToClipboard = (text: any) => {
    Clipboard.setString(text);
  };

  const handleVerify = async () => {
    if (!transactionId.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing UPI ID",
        text2: "Please enter your UPI ID.",
        position: "top",
      });
      return;
    }

    if (!selectedImage) {
      Toast.show({
        type: "error",
        text1: "Missing Screenshot",
        text2: "Please upload a payment screenshot.",
        position: "top",
      });
      return;
    }

    if (!userData || !selectedPackage) {
      Toast.show({
        type: "error",
        text1: "Missing Data",
        text2: "User or package information is incomplete.",
        position: "top",
      });
      return;
    }

    const formData = new FormData();
    formData.append("reg_id", userData?.reg_id.toString());
    formData.append("packege_id", selectedPackage?.package_id.toString());
    formData.append("transection_id", transactionId);
    formData.append("type", "bypackege");

    formData.append("image", {
      uri: selectedImage.uri,
      name: selectedImage.fileName || "screenshot.jpg",
      type: "image/jpeg",
    } as any);

    setLoading(true);
    //console.log("formData", formData);
    try {
      const response = await fetch(
        "https://sarvsetu.trinitycrm.in/admin/Api/package_api.php",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        }
      );

      const textResult = await response.text();

      const json = JSON.parse(textResult);
      // console.error("Payment verify error textResulttextResult:", textResult);

      if (response.ok && json.status === "success") {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Payment verified successfully.",
          position: "top",
        });
        setTransactionId("");
        setSelectedImage(null);
        setSelectedMethod(null);
        setModalVisible(false);
        router.push("/(main)/Home");
      } else {
        Toast.show({
          type: "error",
          text1: "Server Error",
          text2: textResult || "Something went wrong.",
          position: "top",
        });
      }
    } catch (error) {
      //console.error("Payment verify error:", error);
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: "Failed to verify payment. Please try again.",
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1, // Keep high quality from picker; compression is handled separately
    });

    if (!result.canceled) {
      const original = result.assets[0];

      // 🔧 Compress and resize image
      const compressed = await ImageManipulator.manipulateAsync(
        original.uri,
        [{ resize: { width: 800 } }], // Resize to 800px width (optional)
        {
          compress: 0.7, // Compression factor (0 to 1)
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      setSelectedImage({ ...original, uri: compressed.uri }); // Use compressed URI
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userData");
        if (storedData) {
          const user = JSON.parse(storedData);
          setUserData(user);
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await fetch(
          "https://sarvsetu.trinitycrm.in/admin/Api/dashboard_api.php?type=getpayment_details"
        );
        const data = await response.json();

        if (data.status === "success") {
          setPaymentData(data.message.payment_data[0]);
        } else {
          Toast.show({
            type: "error",
            text1: "Failed to fetch payment details",
          });
        }
      } catch (err) {
        Toast.show({
          type: "error",
          text1: "An error occurred while fetching payment details",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, []);

  return (
    <ProtectedRoute>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#fff" }}
        edges={["top"]}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" color="#000" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Information</Text>
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.selectedPackageBox}>
            <Text style={styles.packageHeading}>🎉 Great Choice!</Text>
            <Text style={styles.packageSubtext}>
              You’ve chosen the{" "}
              <Text style={styles.packageLabel}>
                {selectedPackage?.type === "user"
                  ? `${selectedPackage?.in_month} - Month`
                  : `${selectedPackage?.peradd} - Ads`}
              </Text>{" "}
              <Text style={styles.packageLabel}>
                {selectedPackage?.package_name}
              </Text>{" "}
              plan for just{" "}
              <Text style={styles.packageLabel}>
                {" "}
                ₹ {selectedPackage?.amount}
              </Text>
              !
            </Text>
            <Text style={styles.packageSubtext}>
              Unlock premium features and enjoy exclusive benefits throughout
              your subscription period.
            </Text>
          </View>

          <Text style={styles.pageTitle}>Payment Information </Text>
          <Text style={styles.pageSub}>
            Choose any method below to complete your payment.
          </Text>

          {/* QR Payment */}
          <View style={styles.paymentCard}>
            <TouchableOpacity
              onPress={() => handleSelect("qr")}
              style={styles.cardHeader}
            >
              <View style={styles.cardHeaderLeft}>
                <Ionicons
                  name="qr-code"
                  size={28}
                  color="#000"
                  style={styles.icon}
                />
                <View>
                  <Text style={styles.methodTitle}>QR Code</Text>
                  <Text style={styles.methodSub}>
                    Quick Payment via QR Code
                  </Text>
                </View>
              </View>

              <Feather
                name={selectedMethod === "qr" ? "chevron-up" : "chevron-down"}
                size={20}
                color="#6b7280"
              />
            </TouchableOpacity>
            {selectedMethod === "qr" && (
              <View style={styles.cardContent}>
                {paymentData && (
                  <Image
                    source={{ uri: paymentData.qrcode }}
                    style={styles.qrImage}
                  />
                )}
                <Text style={styles.note}>
                  Scan this code using your payment app to send your payment
                  instantly.
                </Text>
              </View>
            )}
          </View>

          {/* UPI Payment */}
          <View style={styles.paymentCard}>
            <TouchableOpacity
              onPress={() => handleSelect("upi")}
              style={styles.cardHeader}
            >
              <View style={styles.cardHeaderLeft}>
                <MaterialIcons
                  name="sensor-occupied"
                  size={24}
                  color="black"
                  style={styles.icon}
                />

                <View>
                  <Text style={styles.methodTitle}>UPI payment</Text>
                  <Text style={styles.methodSub}>Quick Payment via UPI</Text>
                </View>
              </View>

              <Feather
                name={selectedMethod === "upi" ? "chevron-up" : "chevron-down"}
                size={20}
                color="#6b7280"
              />
            </TouchableOpacity>
            {selectedMethod === "upi" && (
              <View style={styles.cardContent}>
                <View style={styles.detailRow}>
                  <Text>{paymentData?.upi_id}</Text>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(paymentData?.upi_id)}
                  >
                    <Feather name="copy" size={24} color="#000" />
                  </TouchableOpacity>
                </View>
                <View style={styles.detailRow}>
                  <Text>{paymentData?.upi_id2}</Text>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(paymentData?.upi_id2)}
                  >
                    <Feather name="copy" size={24} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Bank Transfer */}
          <View style={styles.paymentCard}>
            <TouchableOpacity
              onPress={() => handleSelect("bank")}
              style={styles.cardHeader}
            >
              <View style={styles.cardHeaderLeft}>
                <FontAwesome
                  name="bank"
                  size={24}
                  color="black"
                  style={styles.icon}
                />

                <View>
                  <Text style={styles.methodTitle}>Bank Transfer</Text>
                  <Text style={styles.methodSub}>
                    Transfer funds directly using the details below
                  </Text>
                </View>
              </View>
              <Feather
                name={selectedMethod === "bank" ? "chevron-up" : "chevron-down"}
                size={20}
                color="#6b7280"
              />
            </TouchableOpacity>
            {selectedMethod === "bank" && (
              <View style={styles.cardContent}>
                <View style={styles.detailRow}>
                  <Text>Ac No - {paymentData?.account_numbar}</Text>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(paymentData?.account_numbar)}
                  >
                    <Feather name="copy" size={24} color="#000" />
                  </TouchableOpacity>
                </View>
                <View style={styles.detailRow}>
                  <Text>IFSC Code {paymentData?.ifsc_code}</Text>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(paymentData?.ifsc_code)}
                  >
                    <Feather name="copy" size={24} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={styles.verifyButton2}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.verifyButtonText}>Verify Payment</Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Bank Detail</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Feather name="x" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <Text style={styles.inputLabel}>UPI ID</Text>
              <TextInput
                value={transactionId}
                onChangeText={setTransactionId}
                placeholder="Enter UPI ID"
                placeholderTextColor="#555"
                style={styles.textInput}
              />
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.uploadButtonText}>
                  Upload Payment Screenshot
                </Text>
              </TouchableOpacity>

              {selectedImage && (
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              )}
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={handleVerify}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.verifyButtonText}>Verify Payment</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  selectedPackageBox: {
    backgroundColor: "#E0F2FE",
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    borderLeftWidth: 5,
    borderLeftColor: "#057496",
    borderWidth: 1,
    borderColor: "#057496",
  },
  packageHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#057496",
    marginBottom: 6,
  },
  packageSubtext: {
    fontSize: 16,
    color: "#0369A1",
  },
  packageLabel: {
    fontWeight: "bold",
    color: "#f36c21",
  },
  packageNote: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },

  uploadButton: {
    backgroundColor: "#0284C7",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  previewImage: {
    width: "100%",
    height: 200,
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    color: "#000",
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
    color: "#057496",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: "#fff",

    zIndex: 100,
  },
  headerTitle: {
    color: "#000",
    fontSize: 20,
    fontWeight: 600,
    flex: 1,
    marginHorizontal: 12,
  },
  pageSub: {
    fontSize: 14,
    color: "#0369A1",
    marginBottom: 24,
  },
  paymentCard: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 2,
    marginTop: 10,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  methodSub: {
    fontSize: 13,
    color: "#6b7280",
  },
  caret: {
    fontSize: 18,
    color: "#6b7280",
  },
  cardContent: {
    marginTop: 12,
  },
  qrImage: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  note: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f3f4f6",
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  copyText: {
    color: "#1D4ED8",
    fontWeight: "600",
  },
  verifyButton: {
    backgroundColor: "#002B5B",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 20,
  },
  verifyButton2: {
    backgroundColor: "#002B5B",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 200,
  },
  verifyButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
