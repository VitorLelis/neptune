import { View,Text } from "@/components/Themed";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome6';
import { TouchableOpacity,StyleSheet, FlatList, Pressable } from "react-native";
import { useDatabase } from "@/database/useDatabase";
import { useActionSheet } from "@expo/react-native-action-sheet";
import convertEventTimes, { EventTimeItem, TimeDatePair } from "@/utils/eventTimesUtils";
import timeToString from "@/utils/timeToString";

export default function SwimmerInfo(){
    const [data, setData] = useState({
        name: "",
        gender: "",
        year_of_birth: 0
    })
    const [eventList, setEventList] = useState<EventTimeItem[]>([])
    const [expandedKey, setExpandedKey] = useState<string | null>(null);

    const database = useDatabase();
    const params = useLocalSearchParams<{id :string}>();
    const { showActionSheetWithOptions } = useActionSheet();

    const getSwimmerInfo = async () => {
      if (params.id) {
          const swimmerInfo = await database.infoSwimmer(Number(params.id));
          const events = await database.getSwimmerEventTime(Number(params.id));

          if (swimmerInfo) {
              setData({
                  name: swimmerInfo.name,
                  gender: swimmerInfo.gender,
                  year_of_birth: swimmerInfo.year_of_birth,
              });
          }
          if (events) {
              const eventItems = convertEventTimes(events);
              setEventList(eventItems);
          }
      }
  };

  useEffect(() => {
    getSwimmerInfo();
  }, [params.id]);

  useFocusEffect(
    React.useCallback(() => {
        getSwimmerInfo();
    }, [])
);

    const handleActionPress = (index: number) => {
      switch (index) {
          case 0:
              // Navigate to Edit Swimmer screen
              router.navigate({
                  pathname: '/editSwimmer',
                  params: {
                      id: params.id,
                      name: data.name,
                      gender: data.gender,
                      year_of_birth: data.year_of_birth.toString(),
                  }
              });
              break;
          case 1:
              // Navigate to Add Time screen
              router.navigate({
                  pathname: '/addTime',
                  params: { id: params.id }
              });
              break;
          case 2:
              // Handle Delete Swimmer action
              // Implement your delete logic here
              break;
          default:
              break;
      }
  };

  const showActionSheet = () => {
      const options = ['Edit Swimmer', 'Add Time', 'Delete Swimmer', 'Cancel'];
      const cancelButtonIndex = 3;

      showActionSheetWithOptions(
          {
              options,
              cancelButtonIndex,
              destructiveButtonIndex: 2,
          },
          (buttonIndex: number | undefined) => {
            if (buttonIndex !== undefined) {
              handleActionPress(buttonIndex);
            }
          }
      );
  };

  const handleEditTime = (data: TimeDatePair, event: string) => {
    router.navigate({
      pathname: '/editTime',
      params:{
        id: data.id, //Time ID
        swimmer_id: params.id,
        time: timeToString(data.time),
        date: data.date,
        event: event
      }
    })
  }
    
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.fab} onPress={showActionSheet}>
          <FontAwesome name="user-gear" color="#4184F8" size={24} />
        </TouchableOpacity>
        <Text style={styles.cardTitle}>INFO</Text>
        <Text>Name: {data.name}</Text>
        <Text>Gender: {data.gender}</Text>
        <Text>Year of Birth: {data.year_of_birth}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>EVENTS</Text>
        <FlatList
        data={eventList}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <View>
            <Pressable onPress={() => setExpandedKey(expandedKey === item.key ? null : item.key)}>
              <View style={styles.header}>
                <Text>{item.key}</Text>
              </View>
            </Pressable>
            {expandedKey === item.key && (
              <View>
                <FlatList
                data={item.events}
                keyExtractor={(event, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.nestedList}>
                    <Text>({index+1}) {timeToString(item.time)} - {item.date}</Text>

                    <TouchableOpacity onPress={()=> handleEditTime(item,expandedKey)}>
                      <FontAwesome name="edit" color="#4184F8" size={18} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => console.log('DELETE TIME')}>
                      <FontAwesome name="trash-can" color="#f00" size={18} />
                    </TouchableOpacity>
                  </View>
                )}
              />
              </View>
            )}
          </View>
        )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#4184F8',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    position: 'relative'
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 30,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  header: {
    fontWeight: 'bold',
    padding: 10,
  },
  nestedList: {
    paddingLeft: 20,
    padding: 24,
    borderRadius: 5,
    gap: 18,
    flexDirection: "row",
  },
});