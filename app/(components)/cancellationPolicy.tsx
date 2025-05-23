import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const CancellationPolicyScreen = () => {
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
        <Text style={styles.header}>Cancellation Policy</Text>
      </View>
      <ScrollView style={styles.container2}>
        <Text style={styles.updated}>
          Last updated on <Text style={styles.bold}>02-12-2024 11:17:32</Text>
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>SERV SETU</Text>[Ganeshrao Gopale] believes
          in helping its customers as far as possible, and has therefore a
          liberal cancellation policy. Under this policy:
        </Text>

        <Text style={styles.bullet}>
          • Cancellations will be considered only if the request is made
          immediately after placing the order. However, the cancellation request
          may not be entertained if the orders have been communicated to the
          vendors/merchants and they have initiated the process of shipping
          them.
        </Text>

        <Text style={styles.bullet}>
          • <Text style={styles.bold}>SERV SETU</Text>[Ganeshrao Gopale] does
          not accept cancellation requests for perishable items like flowers,
          eatables etc. However, refund/replacement can be made if the customer
          establishes that the quality of product delivered is not good.
        </Text>

        <Text style={styles.bullet}>
          • In case of receipt of damaged or defective items please report the
          same to our Customer Service team. The request will, however, be
          entertained once the merchant has checked and determined the same at
          his own end. This should be reported within 7 Days of receipt of the
          products. In case you feel that the product received is not as shown
          on the site or as per your expectations, you must bring it to the
          notice of our customer service within 7 Days of receiving the product.
          The Customer Service Team after looking into your complaint will take
          an appropriate decision.
        </Text>

        <Text style={styles.bullet}>
          • In case of complaints regarding products that come with a warranty
          from manufacturers, please refer the issue to them. In case of any
          Refunds approved by the <Text style={styles.bold}>SERV SETU</Text>
          [Ganeshrao Gopale], it’ll take 9–15 Days for the refund to be
          processed to the end customer.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    backgroundColor: "#fff",
    paddingBottom: 160,
  },
  container2: {
    paddingHorizontal: 18,
    backgroundColor: "#fff",
    paddingTop: 15,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  updated: {
    fontSize: 14,
    marginBottom: 16,
  },
  bold: {
    fontWeight: "bold",
  },
  paragraph: {
    fontSize: 14,
    marginBottom: 12,
    color: "#333",
  },
  bullet: {
    fontSize: 14,
    marginBottom: 12,
    color: "#333",
  },
});

export default CancellationPolicyScreen;
