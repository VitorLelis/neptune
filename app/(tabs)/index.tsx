import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { useDatabase, Swimmer } from '@/database/useDatabase';
import React, { useEffect, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { defaultBlue, defaultDark, defaultLight } from '@/constants/Colors';
import Foundation from '@expo/vector-icons/Foundation';

type GenderIcon = 'male-symbol' | 'female-symbol';

const genderIcon: { [key: string]: GenderIcon } = {
  M: 'male-symbol',
  F: 'female-symbol',
};

const currentYear: number = new Date().getFullYear();

export default function SwimmersScreen() {
  const [swimmersList, setSwimmersList] = useState<Swimmer[]>([]);
  const [filteredData, setFilteredData] = useState<Swimmer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const database = useDatabase();

  async function getSwimmers() {
    try {
      const response = await database.listSwimmers();
      setSwimmersList(response);
      setFilteredData(response); // Initially, show all swimmers
    } catch (error) {
      Alert.alert('Error', String(error));
    }
  }

  useEffect(() => {
    getSwimmers();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getSwimmers();
    }, []),
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = swimmersList.filter(swimmer =>
        swimmer.name.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(swimmersList); // Show all swimmers when query is cleared
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder='Search by name'
        placeholderTextColor={defaultBlue}
        value={searchQuery}
        onChangeText={handleSearch} // Update the search query
      />

      <FlatList
        data={filteredData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }: { item: Swimmer }) => (
          <Pressable onPress={() => router.navigate(`/${item.id}`)}>
            <View
              style={styles.item}
              lightColor={defaultLight}
              darkColor={defaultDark}
            >
              <Text style={styles.itemName}>{item.name.toUpperCase()}</Text>
              <View
                style={styles.infoRow}
                lightColor={defaultLight}
                darkColor={defaultDark}
              >
                <Text style={styles.label}>
                  Gender:{' '}
                  <Foundation
                    name={genderIcon[item.gender]}
                    size={14}
                    style={styles.icon}
                  />
                </Text>
                <Text style={styles.label}>
                  {' '}
                  Age: {new Date().getFullYear() - item.year_of_birth}
                </Text>
                <Text style={styles.bornIn}>
                  {' '}
                  (born in {item.year_of_birth})
                </Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    height: 40,
    borderColor: defaultBlue,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
    marginBottom: 16,
    color: defaultBlue,
  },
  item: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: defaultBlue,
  },
  infoRow: {
    flexDirection: 'row', // Align elements horizontally
    alignItems: 'center', // Vertically center items
  },
  label: {
    fontSize: 14,
    marginRight: 5, // Adds space after the label text
  },
  icon: {
    marginRight: 10, // Adds space after the icon
  },
  bornIn: {
    fontSize: 14,
    color: 'grey', // You can change the color or add different styling
  },
});
