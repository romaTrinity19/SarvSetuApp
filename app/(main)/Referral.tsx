import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Clipboard, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const ReferAndEarn = () => {
  const referralCode = 'ROM24798';

  const copyToClipboard = () => {
    Clipboard.setString(referralCode);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Refer & Earn</Text>
        <ScrollView style={styles.container1}> 
      <Image
        source={require("../../assets/images/image.jpeg")}  
        style={styles.banner}
        resizeMode="cover"
      />

       <View style={{paddingHorizontal:18}}>
        <Text style={styles.subHeader}>How It Works</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>DIRECT REFERRAL</Text>
        <Text style={styles.cardReward}>Earn ₹100.00</Text>
        <Text style={styles.cardDescription}>when someone you refer buys a subscription.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>INDIRECT REFERRAL</Text>
        <Text style={styles.cardReward}>Earn Additional ₹50.00</Text>
        <Text style={styles.cardDescription}>When your referred friend refers someone else who buys a subscription.</Text>
      </View>

      <View style={styles.referralBox}>
        <TextInput style={styles.referralInput} value={referralCode} editable={false} />
        <TouchableOpacity onPress={copyToClipboard}>
          <Ionicons name="copy-outline" size={24} color="#002855" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.buttonPrimary} onPress={()=>router.push('/(components)/memberShip')}>
        <Text style={styles.buttonText}>Refer Now</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonOutline}>
        <Text style={styles.buttonOutlineText}>View Referrals</Text>
      </TouchableOpacity>
       </View>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical:30,
    backgroundColor: '#fff',
  },
    container1: {
     
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
    paddingLeft:14
  },
  banner: {
    width: '100%',
    height: 180,
    marginTop: 10,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFF4EC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    color: '#FF7A00',
    fontWeight: '600',
    marginBottom: 6,
  },
  cardReward: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
  },
  referralBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#002855',
    borderRadius: 10,
    padding: 8,
    marginTop: 20,
  },
  referralInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  buttonPrimary: {
    backgroundColor: '#002855',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonOutline: {
    borderWidth: 1.5,
    borderColor: '#002855',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  buttonOutlineText: {
    color: '#002855',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ReferAndEarn;
