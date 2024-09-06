import { FlatList, Pressable, StyleSheet, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useDatabase, Swimmer } from '@/database/useDatabase';
import React, { useEffect, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';

export default function SwimmersScreen() {
  const [swimmersList, setSwimmersList] = useState<Swimmer[]>([]);
  const [filteredData, setFilteredData] = useState<Swimmer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const database = useDatabase();

  async function getSwimmers() {
    try {
      const response = await database.listSwimmers()
      setSwimmersList(response)
      setFilteredData(response) // Initially, show all swimmers
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getSwimmers();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getSwimmers();
    }, [])
  )

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = swimmersList.filter((swimmer) =>
        swimmer.name.toLowerCase().includes(query.toLowerCase())
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
        placeholder="Search by name"
        placeholderTextColor='#ccc'
        value={searchQuery}
        onChangeText={handleSearch} // Update the search query
      />

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }: { item: Swimmer }) => (
          <Pressable onPress={() => router.navigate(`/${item.id}`)}>
            <View style={styles.item} lightColor="#fff" darkColor="#303030">
              <Text>{item.name} - {item.gender} - {item.year_of_birth}</Text>
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
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
    marginBottom: 16,
    color: '#ccc'
  },
  item: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
})