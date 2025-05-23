// AddAddressPage.js
import { Feather, Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import CountryPicker, {
    Country,
    CountryCode,
} from "react-native-country-picker-modal";

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export default function AddAddressPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [label, setLabel] = useState("Home");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [pincode, setPincode] = useState("");
  const [defaultAddress, setDefaultAddress] = useState(false);
  const [countryCode, setCountryCode] = useState<CountryCode>("IN");
  const [country, setCountry] = useState<Country | null>(null);

  useEffect(() => {
    const raw = params?.address;
    if (raw && typeof raw === "string") {
      try {
        const addr = JSON.parse(raw);
        setLabel(addr.label || "Home");
        setFirstName(addr.firstName || "");
        setLastName(addr.lastName || "");
        setState(addr.state || "");
        setPhone(addr.phone || "");
        setAddress1(addr.address1 || "");
        setAddress2(addr.address2 || "");
        setPincode(addr.pincode || "");
        setDefaultAddress(addr.defaultAddress || false);
      } catch (err) {
        console.warn("Failed to parse address:", err);
      }
    }
  }, [params.address]);

  const handleSave = () => {
    const newAddress = {
      label,
      firstName,
      lastName,
      state,
      phone,
      address1,
      address2,
      pincode,
      defaultAddress,
    };
    router.push({
      pathname: "/(components)/myAddress",
      params: {
        newAddress: JSON.stringify(newAddress),
        editIndex: params?.editIndex || "",
      },
    });
  };

  return (
    <View style={styles.container}>
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
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.header}>Add Address</Text>
      </View>

      <ScrollView style={styles.container1}>
        <Text style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>
          Save as
        </Text>
        <View style={styles.labelGroup}>
          {["Home", "Work", "Other"].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.labelButton,
                label === type && styles.labelSelected,
              ]}
              onPress={() => setLabel(type)}
            >
              <Ionicons
                name={
                  type === "Home"
                    ? "home"
                    : type === "Work"
                    ? "briefcase"
                    : "ellipsis-horizontal"
                }
                size={16}
                color={label === type ? "white" : "black"}
              />
              <Text
                style={[styles.labelText, label === type && { color: "white" }]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <View style={styles.dropdownWrapper}>
          <Picker
            selectedValue={state}
            onValueChange={(itemValue) => setState(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select State" value="" />
            {indianStates.map((st, idx) => (
              <Picker.Item key={idx} label={st} value={st} />
            ))}
          </Picker>
        </View>

        <View style={styles.row}>
          <View style={styles.flagBox}>
            <CountryPicker
              countryCode={countryCode}
              withFlag
              withCallingCode
              withFilter
              withEmoji
              onSelect={(country) => {
                setCountryCode(country.cca2);
              }}
            />
            <Text style={styles.phoneCode}>
              +{country?.callingCode?.[0] || "91"}
            </Text>
          </View>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Address 1"
          value={address1}
          onChangeText={setAddress1}
        />
        <TextInput
          style={styles.input}
          placeholder="Address 2"
          value={address2}
          onChangeText={setAddress2}
        />
        <TextInput
          style={styles.input}
          placeholder="Pincode"
          value={pincode}
          onChangeText={setPincode}
          keyboardType="numeric"
        />
 
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setDefaultAddress(!defaultAddress)}
          >
            <Ionicons
              name={defaultAddress ? "radio-button-on" : "radio-button-off"}
              size={20}
              color="#001F54"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.checkboxLabel}>
              Set as default delivery address
            </Text>
          </TouchableOpacity>

          

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Address</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container1: { flex: 1, padding: 16, backgroundColor: "#fff" },
  container: { flex: 1, paddingTop: 30, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 20 },
  labelGroup: { flexDirection: "row", marginBottom: 20 },
  checkboxContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 10,
},
checkboxLabel: {
  fontSize: 16,
  color: '#333',
},

  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  labelButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  labelSelected: { backgroundColor: "#002D62", borderColor: "#002D62" },
  labelText: { color: "#000" },
  labelSelectedText: { color: "#fff" },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  halfInput: { flex: 1, marginRight: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 6,
    marginBottom: 16,
  },
  flagBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 11,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginTop: -14,
    marginRight: 2,
  },
  flag: {
    fontSize: 20,
    marginRight: 4,
  },
  phoneCode: {
    fontSize: 16,
  },
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 16,
    overflow: "hidden",
  },
  picker: { height: 50, width: "100%" },
   
  saveButton: {
    backgroundColor: "#002D62",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
