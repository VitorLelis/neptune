import { Button, FlatList, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useDatabase, Swimmer } from '@/database/useDatabase';
import { useEffect, useState } from 'react';

export default function SwimmersScreen() {
  const [swimmersList, setSwimmersList] = useState<Swimmer[]>([]);
  const [sortedData, setSortedData] = useState<Swimmer[]>([]);
  const [sortKey, setSortKey] = useState<'name' | 'gender' | 'year_of_birth'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const database = useDatabase();

  async function getSwimmers() {
    try {
      const response = await database.listSwimmers();
      setSwimmersList(response);
      sortData(response, sortKey, sortOrder);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getSwimmers();
  }, [sortKey, sortOrder]);

  const sortData = (data: Swimmer[], key: 'name' | 'gender' | 'year_of_birth', order: 'asc' | 'desc') => {
    const sorted = [...data].sort((a, b) => {
      if (key === 'year_of_birth') {
        return order === 'asc' ? a.year_of_birth - b.year_of_birth : b.year_of_birth - a.year_of_birth;
      } else {
        if (a[key] > b[key]) return  1;
        if (a[key] < b[key]) return -1; 
        return 0;
      }
    });
    setSortedData(sorted);
  };

  const handleSort = (key: 'name' | 'gender' | 'year_of_birth') => {
    if (key === 'year_of_birth') {
      const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      setSortOrder(newOrder);
    } else {
      setSortOrder('asc'); // Default order for name and gender
    }
    setSortKey(key)
    sortData(swimmersList,key,sortOrder)
  };

  const renderItem = ({ item }: { item: Swimmer }) => (
    <View style={styles.item}>
      <Text>{item.name} - {item.gender} - {item.year_of_birth}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Swimmers</Text>
      <View style={styles.buttonContainer}>
        <Button title="Sort by Name" onPress={() => handleSort('name')} />
        <Button title="Sort by Gender" onPress={() => handleSort('gender')} />
        <Button title={`Sort by Year (${sortOrder === 'asc' ? 'Youngest' : 'Oldest'})`} onPress={() => handleSort('year_of_birth')} />
      </View>
      <FlatList
        data={sortedData}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});