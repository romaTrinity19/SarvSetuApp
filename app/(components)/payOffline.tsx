import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Clipboard,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PaymentInformation() {
  const [selectedMethod, setSelectedMethod] = useState(null);
   const [modalVisible, setModalVisible] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const qrCodeImage = require("../../assets/images/react-logo.png"); // Replace with your actual QR image

  const handleSelect = (method: any) => {
    setSelectedMethod(selectedMethod === method ? null : method);
  };

  const copyToClipboard = (text: any) => {
    Clipboard.setString(text);
  };
 const handleVerify = () => {
    if (!transactionId.trim()) {
      Alert.alert("Missing Transaction ID", "Please enter your Transaction ID.");
      return;
    }
    setModalVisible(false);
    router.push("/(main)/Home");
  };
  return (
    <View style={{backgroundColor:'#fff'}}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Information</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>Payment Information</Text>
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
              <Image
                source={require("../../assets/images/react-logo.png")}
                style={styles.icon}
              />
              <View>
                <Text style={styles.methodTitle}>QR Code</Text>
                <Text style={styles.methodSub}>Quick Payment via QR Code</Text>
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
              <Image source={qrCodeImage} style={styles.qrImage} />
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
              <Image
                source={require("../../assets/images/react-logo.png")}
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
                <Text>yespay.bizsbiz81910@yesbankltd</Text>
                <TouchableOpacity
                  onPress={() =>
                    copyToClipboard("yespay.bizsbiz81910@yesbankltd")
                  }
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
              <Image
                source={require("../../assets/images/react-logo.png")}
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
                <Text>Ac No 074061900003583</Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard("074061900003583")}
                >
                  <Feather name="copy" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <View style={styles.detailRow}>
                <Text>IFSC Code YESB0000740</Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard("YESB0000740")}
                >
                  <Feather name="copy" size={24} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Verify Button */}
        <TouchableOpacity style={styles.verifyButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.verifyButtonText}>Verify Payment</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Transaction Detail</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>Transaction ID</Text>
            <TextInput
              value={transactionId}
              onChangeText={setTransactionId}
              placeholder="Enter Transaction ID"
              style={styles.textInput}
            />
            <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
              <Text style={styles.verifyButtonText}>Verify Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
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
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    color: "#6b7280",
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
    marginBottom:10
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 12,
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
  },
  verifyButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
