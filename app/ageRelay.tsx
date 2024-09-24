import { StyleSheet, FlatList } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function AgeGroupScreen() {
  const ageGroups = [
    { group: 'Group 0', range: 'Below 100' },
    { group: 'Group 1', range: '100 – 119' },
    { group: 'Group 2', range: '120 – 159' },
    { group: 'Group 3', range: '160 – 199' },
    { group: 'Group 4', range: '200 – 239' },
    { group: 'Group 5', range: '240 – 279' },
    { group: 'Group 6', range: '280 – 319' },
    { group: 'Group 7', range: '320 – 359' },
  ]

  return (
    <View style={styles.container}>
      <FlatList
        data={ageGroups}
        keyExtractor={(item) => item.group}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.group}>{item.group}</Text>
            <Text style={styles.range}>{item.range}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <Text>Increment by 40 for each new Group</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
  },
  group: {
    fontSize: 18,
    fontWeight: '500',
  },
  range: {
    fontSize: 18,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#ccc',
  },
});
