import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
type Address = {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  state: string;
  pincode: string;
  phone: string;
  label: string;
  defaultAddress: boolean;
};

export default function MyAddressPage() {
  const router = useRouter();
  const params = useLocalSearchParams() as {
    newAddress?: string;
    editIndex?: string;
  };
  const [addresses, setAddresses] = useState([
    {
      firstName: "Roma",
      lastName: "Chakradhari",
      address1: "vtv, rfr",
      address2: "Devbhog, Gariaband",
      state: "Chhattisgarh",
      pincode: "493992",
      phone: "7999559862",
      label: "Home",
      defaultAddress: true,
    },
  ]);

  useEffect(() => {
    if (params?.newAddress && typeof params.newAddress === "string") {
      try {
        const parsedAddress = JSON.parse(params.newAddress);
        const index = params.editIndex ? parseInt(params.editIndex) : -1;

        setAddresses((prev) => {
          const updated = [...prev];
          if (!isNaN(index) && index >= 0 && index < prev.length) {
            updated[index] = parsedAddress; // Edit existing
          } else {
            updated.push(parsedAddress); // Add new
          }
          return updated;
        });
      } catch (err) {
        console.warn("Failed to parse address:", err);
      }
    }
  }, [params.newAddress]); // ONLY depend on newAddress so it runs once

  const handleAddAddress = () => {
    router.push("/(components)/addAddress");
  };

  const handleEdit = (index: any) => {
    router.push({
      pathname: "/(components)/addAddress",
      params: {
        address: JSON.stringify(addresses[index]),
        editIndex: index.toString(),
      },
    });
  };

  const renderAddress = ({ item, index }: { item: Address; index: number }) => (
    <View style={styles.addressContainer}>
      <View style={styles.row}>
        <Ionicons name="home-outline" size={18} />
        <Text style={styles.name}>
          {item.firstName} {item.lastName}
        </Text>
        {item.defaultAddress && (
          <Ionicons
            name="radio-button-on-outline"
            size={18}
            color="#001F54"
            style={{ marginLeft: "auto" }}
          />
        )}
      </View>
      <Text style={styles.addressText}>
        {item.address1}, {item.address2}, {item.state}, India-{item.pincode}
      </Text>
      <Text style={styles.phone}>+91 {item.phone}</Text>
      <TouchableOpacity
        onPress={() => handleEdit(index)}
        style={styles.editBtn}
      >
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}> 
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          paddingVertical: 25,
          marginBottom:10
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.header}>My Address</Text>
      </View>
      <TouchableOpacity onPress={handleAddAddress} style={styles.addButton}>
        <Text style={styles.addText}>+ Add Address</Text>
      </TouchableOpacity>

      <Text style={styles.savedTitle}>Saved Address</Text>
      <FlatList
        data={addresses}
        renderItem={renderAddress}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    borderWidth: 1,
    borderColor: "#001F54",
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  addText: { color: "#001F54", fontWeight: "600" },
  savedTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  addressContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 10,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  name: { fontWeight: "bold", fontSize: 16, marginLeft: 6 },
  addressText: { color: "#666", marginBottom: 4 },
  phone: { color: "#001F54", fontWeight: "500" },
  editBtn: { position: "absolute", right: 0, top: 65 },
  editText: { color: "#001F54", fontWeight: "bold" },
});
