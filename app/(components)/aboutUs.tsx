import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const AboutUsScreen = ({
  companyName = "Sarv Setu",
  founderName = "Ganeshrao Gopale",
  mission = "to provide high-quality products that meet the diverse needs and desires of our customers",
  values = [
    {
      title: "Quality First",
      description:
        "We pride ourselves on offering only the best products that we would use ourselves.",
    },
    {
      title: "Customer-Centric Approach",
      description:
        "Your satisfaction is our priority. We’re here to assist with any questions or concerns you may have.",
    },
    {
      title: "Innovation",
      description:
        "We are always looking for new ways to improve our store and make your shopping experience better.",
    },
    {
      title: "Sustainability",
      description:
        "We are committed to sourcing products and using packaging that support sustainability and eco-conscious choices whenever possible.",
    },
  ],
}) => {
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
        <Text style={styles.header}>About Us</Text>
      </View>

      <ScrollView
        style={styles.container2}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text style={styles.sectionText}>
          Welcome to <Text style={styles.bold}>{companyName}</Text>!
        </Text>

        <Text style={styles.sectionHeader}>Who We Are</Text>
        <Text style={styles.sectionText}>
          <Text style={styles.bold}>{companyName}</Text> ({founderName}) began
          with a passion for curating a wide range of carefully selected
          products for modern consumers. What started as a small online shop has
          grown into a full-fledged eCommerce platform that brings customers
          closer to the things they love.
          {"\n\n"}
          We are a team of innovators, trendsetters, and customer-first
          advocates who constantly strive to find the perfect balance between
          style, quality, and affordability.
        </Text>

        <Text style={styles.sectionHeader}>What We Offer</Text>
        <Text style={styles.sectionText}>
          We ensure that every item in our store is selected with care and
          attention to detail. We believe that online shopping should be fun,
          easy, and stress-free, and that’s why we focus on offering a
          user-friendly shopping experience, fast shipping, and secure payment
          options.
        </Text>

        <Text style={styles.sectionHeader}>Our Values</Text>
        {values.map((value, index) => (
          <Text key={index} style={styles.sectionText}>
            {index + 1}. <Text style={styles.bold}>{value.title}</Text> –{" "}
            {value.description}
          </Text>
        ))}

        <Text style={styles.sectionHeader}>Why Shop with Us?</Text>
        <Text style={styles.sectionText}>
          - <Text style={styles.bold}>Wide Selection:</Text> We offer a diverse
          range of products to meet all your needs.{"\n"}-{" "}
          <Text style={styles.bold}>Competitive Prices:</Text> Enjoy amazing
          deals and discounts without compromising on quality.{"\n"}-{" "}
          <Text style={styles.bold}>Fast Shipping:</Text> Get your orders
          delivered quickly and reliably.{"\n"}-{" "}
          <Text style={styles.bold}>Secure Shopping:</Text> With encrypted
          payment systems, your information is always safe.{"\n"}-{" "}
          <Text style={styles.bold}>Customer Support:</Text> Our team is
          available 24/7 to assist with any inquiries or issues.
        </Text>

        <Text style={styles.sectionHeader}>Join Us on Our Journey</Text>
        <Text style={styles.sectionText}>
          We’re here to create a better shopping experience, one purchase at a
          time. Whether you're shopping for yourself or a loved one,{" "}
          <Text style={styles.bold}>{companyName}</Text> ({founderName}) is your
          destination for quality. Thank you for choosing us — we can’t wait to
          serve you!
        </Text>

        <Text style={[styles.sectionText, { marginTop: 20 }]}>
          Stay connected with us for latest updates, offers, and exciting new
          arrivals.
        </Text>
        <Text style={styles.sectionText}>
          Let us know if you'd like to add or modify any sections!
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingTop: 30,
  },
  container2: {
    backgroundColor: "#fff",
    padding: 18,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  bold: {
    fontWeight: "bold",
  },
});

export default AboutUsScreen;
