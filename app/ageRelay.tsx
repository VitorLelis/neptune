import { StyleSheet, FlatList } from 'react-native';
import { Text, View } from '@/components/Themed';
import { defaultDark, defaultLight } from '@/constants/Colors';

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
      <View style={styles.card} lightColor={defaultLight} darkColor={defaultDark}>
      <FlatList
        data={ageGroups}
        keyExtractor={(item) => item.group}
        renderItem={({ item }) => (
          <View style={styles.row} lightColor={defaultLight} darkColor={defaultDark}>
            <Text style={styles.group}>{item.group}</Text>
            <Text style={styles.range}>{item.range}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <Text style={styles.footer}>Increment by 40 for each new Group</Text>
      </View>
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
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  footer: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 16,
  },
});
