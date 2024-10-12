import { Alert, FlatList, Pressable, StyleSheet, Switch } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { useDatabase, Event, SwimmerTime } from '@/database/useDatabase';
import sortRank from '@/utils/sortRank';
import { router, useFocusEffect } from 'expo-router';
import timeToString from '@/utils/timeToString';
import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { defaultBlue, defaultDark, defaultLight, pickerText, switchOn } from '@/constants/Colors';

export default function RanksScreen() {
  const [eventList, setEventList] = useState<Event[]>([]);
  const [eventId, setEventId] = useState(0);
  const [rank, setRank] = useState<SwimmerTime[]>([]);
  const [isIndividual, setIsIndividual] = useState(false);
  const [genderSort, setGenderSort] = useState('None');

  const database = useDatabase();

  async function getEventList() {
    try {
      const response = await database.listEvents();
      setEventList(response);
    } catch (error) {
      Alert.alert("Error", String(error));;
    }
  }

  async function getRankList() {
    try {
      const response = await database.getRank(eventId);
      const resultRank = sortRank(response, isIndividual, genderSort);
      setRank(resultRank);
    } catch (error) {
      Alert.alert("Error", String(error));;
    }
  }

  useEffect(() => {
    getEventList();
    if (eventId > 0) {
      getRankList();
    }
  }, [eventId, isIndividual, genderSort]);

  useFocusEffect(
    React.useCallback(() => {
      getEventList();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.card} lightColor={defaultLight} darkColor={defaultDark}>
      <Text style={styles.label}>EVENT</Text>
      <RNPickerSelect
        onValueChange={(value) => setEventId(value)}
        items={eventList.map(event => ({
          label: `${event.distance}m ${event.stroke} (${event.course})`,
          value: event.id,
        }))}
        style={pickerSelectStyles}
        placeholder={{ label: "Select an Event", value: null }}
      />

      <View style={styles.switchContainer} lightColor={defaultLight} darkColor={defaultDark}>
        <Text style={styles.label}>INDIVIDUAL</Text>
        <Switch
          value={isIndividual}
          onValueChange={(value) => {
            setIsIndividual(value);
            getRankList();
          }}
          trackColor={{ false: pickerText, true: switchOn }}
          thumbColor={defaultBlue}
        />
      </View>

      <Text style={styles.label}>GENDER</Text>
      <RNPickerSelect
        onValueChange={(value) => {
          setGenderSort(value);
          getRankList();
        }}
        items={[
          { label: "None", value: "None" },
          { label: "Male", value: "M" },
          { label: "Female", value: "F" },
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: "Select Gender", value: null }}
      />

      <FlatList
        data={rank}
        keyExtractor={(item, index) => `${item.id}-${index}`} // Combine id and index to ensure uniqueness
        renderItem={({ item, index }) => (
          <Pressable onPress={() => router.navigate(`/${item.id}`)}>
            <View style={styles.item}>
              <Text style={styles.itemText}>({index + 1}) {item.name} - {timeToString(item.time)} - {item.date}</Text>
            </View>
          </Pressable>
        )}
      />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  item: {
    padding: 10,
    width: '100%',
    backgroundColor: defaultBlue,
    borderRadius: 5,
    marginVertical: 5,
  },
  itemText:{
    color: 'white'
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  card: {
    alignSelf: 'stretch',    // Takes full width of the container
    maxHeight: 600,           // Optional: limit width on larger screens
    padding: 20,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
});

// Custom styles for RNPickerSelect
const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: pickerText,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: pickerText,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  placeholder: {
    color: pickerText,
  },
};
