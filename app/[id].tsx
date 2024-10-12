import { View, Text } from "@/components/Themed";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome6';
import { TouchableOpacity, StyleSheet, FlatList, Pressable, Alert } from "react-native";
import { useDatabase } from "@/database/useDatabase";
import { useActionSheet } from "@expo/react-native-action-sheet";
import convertEventTimes, { EventTimeItem, TimeDatePair } from "@/utils/eventTimesUtils";
import timeToString from "@/utils/timeToString";
import RNPickerSelect from "react-native-picker-select";
import { defaultBlue, defaultDark, defaultLight, pickerText } from "@/constants/Colors";

const gender: { [key: string]: string } = {
  "M": "Male",
  "F": "Female",
}

export default function SwimmerInfo(){
    const [data, setData] = useState({
        name: "",
        gender: "",
        year_of_birth: 0
    });
    const [eventList, setEventList] = useState<EventTimeItem[]>([]);
    const [expandedKey, setExpandedKey] = useState<string | null>(null);

    const database = useDatabase();
    const params = useLocalSearchParams<{id :string}>();
    const { showActionSheetWithOptions } = useActionSheet();

    async function getSwimmerInfo(){
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
    }

    useEffect(() => {
        getSwimmerInfo();
    }, [params.id]);

    useFocusEffect(
        React.useCallback(() => {
            getSwimmerInfo();
        }, [])
    );

    async function deleteSwimmer(id: number) {
        try {
            await database.removeSwimmer(id)
        } catch (error) {
            console.log(error)
        }
    }

    const handleActionPress = (index: number) => {
        switch (index) {
            case 0:
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
                router.navigate({
                    pathname: '/addTime',
                    params: { id: params.id }
                });
                break;
            case 2:
                Alert.alert('Delete Swimmer', 'This will also delete the swimmer times!', [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {text: 'OK', onPress: () => {
                        deleteSwimmer(Number(params.id))
                        getSwimmerInfo(),
                        router.navigate('/')
                    }},
                ]);
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
            params: {
                id: data.id,
                swimmer_id: params.id,
                time: timeToString(data.time),
                date: data.date,
                event: event
            }
        })
    }

    async function deleteTime(time_id:number) {
        try {
            await database.removeTime(time_id)
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteTime = (time_id: number) => {
        Alert.alert('Delete Time', 'This action cannot be undone!', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {text: 'OK', onPress: () => {
                deleteTime(time_id),
                getSwimmerInfo()
            }},
        ]);
    }
    
    return (
        <View style={{ flex: 1, padding: 20 }}>
            <View style={styles.card} lightColor={defaultLight} darkColor={defaultDark}>
                <TouchableOpacity style={styles.fab} onPress={showActionSheet}>
                    <FontAwesome name="user-gear" color={defaultBlue} size={24} />
                </TouchableOpacity>
                <Text style={styles.cardTitle}>INFO</Text>
                <Text style={styles.resultText}>
                 <Text style={styles.resultLabel}>Name:</Text> {data.name}
               </Text>
               <Text style={styles.resultText}>
                 <Text style={styles.resultLabel}>Gender:</Text> {gender[data.gender]}
               </Text>
               <Text style={styles.resultText}>
                 <Text style={styles.resultLabel}>Age:</Text> {new Date().getFullYear() - data.year_of_birth} (born in {data.year_of_birth})
               </Text>
            </View>

            <View style={styles.card} lightColor={defaultLight} darkColor={defaultDark}>
                <Text style={styles.cardTitle}>EVENTS</Text>
                <RNPickerSelect
                    onValueChange={(value) => setExpandedKey(value)}
                    items={eventList.map((item) => ({ label: item.key, value: item.key }))}
                    style={pickerSelectStyles}
                    placeholder={{ label: "Select Event", value: null }}
                    value={expandedKey}
                />

                {expandedKey && (
                    <FlatList
                        data={eventList.find(item => item.key === expandedKey)?.events || []}
                        keyExtractor={(event, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <View style={styles.nestedList} lightColor={defaultLight} darkColor={defaultDark}>
                                <Text>({index + 1}) {timeToString(item.time)} - {item.date}</Text>
                                <TouchableOpacity onPress={() => handleEditTime(item, expandedKey)}>
                                    <FontAwesome name="edit" color={defaultBlue} size={18} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => handleDeleteTime(item.id)}>
                                    <FontAwesome name="trash-can" color="#e52a2a" size={18} />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',    // Takes full width of the container
    maxHeight: 450,           // Optional: limit width on larger screens
    padding: 20,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: defaultBlue
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
    nestedList: {
        paddingLeft: 20,
        padding: 24,
        borderRadius: 5,
        gap: 18,
        flexDirection: "row",
    },
    resultText: {
      fontSize: 16,
      marginBottom: 8,
      textAlign: 'left',
    },
    resultLabel: {
      fontWeight: 'bold',
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: pickerText,
        paddingRight: 30,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 8,
        color: pickerText,
        paddingRight: 30,
    },
    placeholder: {
        color: pickerText,
      },
});