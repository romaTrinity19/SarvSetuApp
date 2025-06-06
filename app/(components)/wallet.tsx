import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  StatusBar,
  Image,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const screenHeight = Dimensions.get("window").height;

export default function WalletScreen() {
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [addFundModalVisible, setAddFundModalVisible] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [withdrawStatus, setWithdrawStatus] = useState("Pending");

  const [fundAmount, setFundAmount] = useState("");
  const [fundImage, setFundImage] = useState<string | null>(null);

  const walletData = {
    total: 1500,
    referral: 500,
    status: 1000,
  };

  const handleWithdraw = () => {
    setWithdrawModalVisible(false);
    setWithdrawStatus("Pending");
    setWithdrawAmount("");
    setUpiId("");
  };

  const handleAddFund = () => {
    setAddFundModalVisible(false);
    setFundAmount("");
    setFundImage(null);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled) {
      setFundImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <StatusBar backgroundColor="#fff" />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          paddingLeft: 10,
          paddingVertical: 20,
          borderBottomWidth: 2,
          borderColor: "#eee",
          backgroundColor: "#fff",
          marginBottom: 15,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>About Us</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Wallet Card */}
        <LinearGradient colors={["#4B65E9", "#7F8CFF"]} style={styles.card}>
          <Text style={styles.cardTitle}>Total Wallet Balance</Text>
          <Text style={styles.cardAmount}>₹ {walletData.total}</Text>
        </LinearGradient>

        {/* Earnings */}
        <View style={styles.infoCard}>
          <View style={styles.row}>
            <Text style={styles.label}>🎁 Referral Earning</Text>
            <Text style={styles.value}>
              : {"  "}₹ {walletData.referral}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>📊 Status Earning</Text>
            <Text style={styles.value}>
              : {"  "}₹ {walletData.status}
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.fundButton}
            onPress={() => setAddFundModalVisible(true)}
          >
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Add Fund</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={() => setWithdrawModalVisible(true)}
          >
            <Ionicons name="cash-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Withdraw Status */}
        <View style={styles.statusBox}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            <Text style={styles.statusLabel}>Withdraw Amount</Text>
            <Text
              style={{
                color: "red",
                fontWeight: "bold",
                width: "50%",
              }}
            >
              ₹ {walletData.total}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            <Text style={styles.statusLabel}>Withdraw Status</Text>
            <Text
              style={{
                color:
                  withdrawStatus === "Pending"
                    ? "#FFA500"
                    : withdrawStatus === "Confirmed"
                    ? "#34A853"
                    : "#FF3B30",
                fontWeight: "bold",
                width: "50%",
              }}
            >
              {withdrawStatus}
            </Text>
          </View>
        </View>

        {/* Withdraw Modal */}
        <Modal
          visible={withdrawModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setWithdrawModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => setWithdrawModalVisible(false)}
              >
                <Ionicons name="close-circle" size={28} color="#888" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Withdraw Funds</Text>

              <Text style={styles.balanceInfo}>
                Available Balance: ₹ {walletData.total}
              </Text>

              <TextInput
                placeholder="Enter Amount"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
                style={styles.input}
              />
              <TextInput
                placeholder="Enter UPI ID"
                placeholderTextColor="#aaa"
                value={upiId}
                onChangeText={setUpiId}
                style={styles.input}
              />

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleWithdraw}
              >
                <Text style={styles.confirmButtonText}>Confirm Withdrawal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Add Fund Modal */}
        <Modal
          visible={addFundModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setAddFundModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => setAddFundModalVisible(false)}
              >
                <Ionicons name="close-circle" size={28} color="#888" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Add Funds</Text>

              <TextInput
                placeholder="Enter Amount"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                value={fundAmount}
                onChangeText={setFundAmount}
                style={styles.input}
              />

              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Ionicons name="image-outline" size={20} color="#fff" />
                <Text style={styles.uploadText}>Upload Screenshot</Text>
              </TouchableOpacity>

              {fundImage && (
                <Image
                  source={{ uri: fundImage }}
                  style={styles.previewImage}
                />
              )}

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleAddFund}
              >
                <Text style={styles.confirmButtonText}>
                  Submit Fund Request
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    minHeight: screenHeight,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    width: "50%",
  },
  value: {
    fontSize: 14,
    color: "#444",
    width: "50%",
  },
  headerContainer: {
    backgroundColor: "#4B65E9",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  card: {
    padding: 35,
    borderRadius: 16,
    marginBottom: 20,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
  },
  cardAmount: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    color: "#002B5B",
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  fundButton: {
    backgroundColor: "#4B65E9",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    justifyContent: "center",
  },
  withdrawButton: {
    backgroundColor: "#34A853",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  statusBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    flexDirection: "column",
    elevation: 2,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    width: "50%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    position: "relative",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#002B5B",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: "#333",
  },
  confirmButton: {
    backgroundColor: "#002B5B",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  balanceInfo: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  uploadButton: {
    backgroundColor: "#4B65E9",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "600",
  },
  previewImage: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
    borderRadius: 10,
    marginBottom: 12,
  },
});
