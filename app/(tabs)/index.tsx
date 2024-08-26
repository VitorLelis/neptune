import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome6 } from '@expo/vector-icons';

export default function IndexScreen() {
  // State to handle the visibility of each section
  const [aboutVisible, setAboutVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [ageGroupsVisible, setAgeGroupsVisible] = useState(false);

  // Function to handle the press on the GitHub icon
  const openGitHub = () => {
    Linking.openURL('https://github.com/VitorLelis/neptune'); // Replace with your GitHub URL
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setAboutVisible(!aboutVisible)}>
        <Text style={styles.title}>About</Text>
      </TouchableOpacity>
      {aboutVisible && (
        <Text>Welcome to Neptune! This an open source project created to help you manage your Swimming team</Text>
      )}

      <TouchableOpacity onPress={() => setFeaturesVisible(!featuresVisible)}>
        <Text style={styles.title}>Features</Text>
      </TouchableOpacity>
      {featuresVisible && (
        <Text>You can add and manage your swimmers, setup relays, visualize event rankings and also convert times!</Text>
      )}

      <TouchableOpacity onPress={() => setAgeGroupsVisible(!ageGroupsVisible)}>
        <Text style={styles.title}>Age Groups</Text>
      </TouchableOpacity>
      {ageGroupsVisible && (
        <Text>In the relay setup, you can see the age group result. This is useful for Masters relays</Text>
      )}

      <TouchableOpacity onPress={openGitHub}>
        <FontAwesome6 name="github" size={30} color="#4184F8" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});
