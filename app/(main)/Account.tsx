import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AccountScreen = () => {
  const name = "roma Chakradhari";
  const initial = name.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}  edges={['top']}> 
     <StatusBar barStyle="dark-content" backgroundColor="#fff" />
    <View style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>My Account</Text>
      </View>

      {/* Scrollable content below */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View>
            <Text style={styles.name}>Hello {name}</Text>
            <Text style={styles.email}>romachakradhari123@gmail.com</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.listItem2} onPress={() => router.push('/(components)/memberShip')}>
          <Text style={styles.title}>Buy An Subscription</Text>
          <Text style={styles.status}>
            Status: <Text style={styles.statusActive}>In Active</Text>
          </Text>
        </TouchableOpacity>

        <MenuItem title="Edit Profile" subtitle="Update your information" route='/(components)/editProfile'/>
        <MenuItem title="Orders" subtitle="Track your orders" route='/(components)/orders'/>
        <MenuItem title="My Address" subtitle="Manage your saved address" route='/(components)/myAddress' />
        <MenuItem title="Wishlist" subtitle="Save for Later" route='/(components)/wishList'/>
        <MenuItem title="Become A Franchise" subtitle="Join Our Network" route='/(components)/franchise' />
        <MenuItem title="About Us" subtitle="Get to Know Us" route='/(components)/aboutUs'/>
        <MenuItem title="Privacy Policy" subtitle="How we use your information" route='/(components)/privacyPolicy'/>
        <MenuItem title="Cancellation Policy" subtitle="Cancellation Support Info" route='/(components)/cancellationPolicy'/>
        <MenuItem title="Help" subtitle="Learn Easily with Video Guides" route='/(components)/franchise'/>
        <MenuItem title="Contact Us" subtitle="Reach us anytime, anywhere!" route='/(components)/contactUs'/>

        <TouchableOpacity style={styles.logoutButton} onPress={()=>router.push('/(auth)/login')}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

        <View style={styles.socialContainer}>
          <FontAwesome name="instagram" size={24} style={styles.socialIcon} />
          <Entypo name="facebook" size={24} style={styles.socialIcon} />
          <Ionicons name="logo-twitter" size={24} style={styles.socialIcon} />
        </View>
      </ScrollView>
    </View>
    </SafeAreaView>
  );
};

const MenuItem = ({ title, subtitle , route}: { title: string; subtitle: string, route:any }) => (
  <TouchableOpacity style={styles.listItem} onPress={()=>router.push(route)}>
    <View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="gray" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    zIndex: 10,
    elevation: 2,  
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#7D7A7A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  email: {
    color: "gray",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  listItem2: {
    flexDirection: "column",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
    gap: 5,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 12,
    color: "gray",
  },
  status: {
    fontSize: 12,
    color: "gray",
  },
  statusActive: {
    color: "red",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#F2EBEB",
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 30,
    borderRadius: 8,
  },
  logoutText: {
    color: "red",
    fontWeight: "bold",
  },
  socialContainer: {
    flexDirection: "row",
    alignItems: 'center',
    marginTop: 20,
    gap: 20,
    marginBottom: 60,
  },
  socialIcon: {
    color: "#002B5B",
  },
});


export default AccountScreen;
