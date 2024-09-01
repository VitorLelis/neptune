import { FlatList, Pressable, StyleSheet, Switch } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { useDatabase, Event, SwimmerTime } from '@/database/useDatabase';
import { Picker } from '@react-native-picker/picker';
import sortRank from '@/utils/sortRank';
import { router, useFocusEffect } from 'expo-router';
import timeToString from '@/utils/timeToString';
import React from 'react';

export default function RanksScreen() {
  const [eventList, setEventList] = useState<Event[]>([])
  const [eventId, setEventId] = useState(0)
  const [rank, setRank] = useState<SwimmerTime[]>([])
  const [isIndividual, setIsIndividual] = useState(false)
  const [genderSort, setGenderSort] = useState('None')

  const database = useDatabase()

  async function getEventList() {
    try {
      const response = await database.listEvents();
      setEventList(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function getRankList() {
    try {
      const response = await database.getRank(eventId)
      const resultRank = sortRank(response,isIndividual,genderSort)
      setRank(resultRank)
    } catch (error) {
      console.log(error);
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
      <Picker
        style={styles.picker}
        selectedValue={eventId}
        placeholder='Select Event'
        onValueChange={(itemValue) => setEventId(itemValue)}
      >
        {eventList.map(event => (
          <Picker.Item 
            key={event.id} 
            label={`${event.distance}m ${event.stroke} (${event.course})`} 
            value={event.id} 
          />
        ))}
      </Picker>

      <View style={styles.switchContainer}>
        <Text>Individual</Text>
        <Switch
          value={isIndividual}
          onValueChange={(value) => {
            setIsIndividual(value)
            getRankList()
          }}
        />
      </View>

      <Picker
        style={styles.picker}
        selectedValue={genderSort}
        onValueChange={(itemValue) => {
          setGenderSort(itemValue);
          getRankList(); // Fetch ranks again when changing gender filter
        }}
      >
        <Picker.Item label="None" value="None" />
        <Picker.Item label="Male" value="M" />
        <Picker.Item label="Female" value="F" />
      </Picker>

      <FlatList
        data={rank}
        keyExtractor={(item, index) => `${item.id}-${index}`} // Combine id and index to ensure uniqueness
        renderItem={({ item, index }) => (
          <Pressable onPress={() => router.navigate(`/${item.id}`)}>
            <View style={styles.item} lightColor="#fff" darkColor="#303030">
              <Text>({index+1}) {item.name} - {timeToString(item.time)} - {item.date}</Text>
            </View>
          </Pressable>)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  picker: {
    height: 50,
    width: '100%', // Full width for picker
    marginBottom: 20,
    borderColor: 'gray',
    borderWidth: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  item: {
    padding: 10,
    width: '100%',
  },
});