import { View,Text } from "@/components/Themed";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome6';
import { TouchableOpacity,StyleSheet } from "react-native";
import { useDatabase } from "@/database/useDatabase";
import { useActionSheet } from "@expo/react-native-action-sheet";

export default function SwimmerInfo(){
    const [data, setData] = useState({
        name: "",
        gender: "",
        year_of_birth: 0
    })

    const database = useDatabase();
    const params = useLocalSearchParams<{id :string}>();
    const { showActionSheetWithOptions } = useActionSheet();

    useEffect(() => {
        if(params.id){
            database.infoSwimmer(Number(params.id)).then(response => {
                if (response) {
                    setData({
                        name: response.name,
                        gender: response.gender,
                        year_of_birth: response.year_of_birth
                    })
                }
            })
        }
    }, [params.id])

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
        <Text style={styles.cardTitle}>TIMES</Text>
        <Text>TODO: Picker event</Text>
        <Text>TODO: Time Flatlist</Text>
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
});