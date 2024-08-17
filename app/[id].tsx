import { View,Text } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome6';
import { TouchableOpacity,StyleSheet } from "react-native";
import { useDatabase } from "@/database/useDatabase";

export default function SwimmerInfo(){
 
    const [data, setData] = useState({
        name: "",
        gender: "",
        year_of_birth: 0
    })

    const database = useDatabase();
    const params = useLocalSearchParams<{id :string}>()

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
    
    return(
        <View>
            <Text style={{fontSize: 20,fontWeight: 'bold',}}> INFO</Text>
            <Text> Name: {data.name}</Text>
            <Text> Gender: {data.gender}</Text>
            <Text> Year of Birth: {data.year_of_birth}</Text>
            
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Edit Info</Text>
              <FontAwesome name="edit" color="#fff"/>
            </TouchableOpacity>
            
            <Text style={{fontSize: 20,fontWeight: 'bold',}}> TIMES</Text>
            <Text>TODO: Picker event</Text>
            <Text>TODO: Time Flatlist</Text>
            
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Delete Swimmer</Text>
              <FontAwesome name="trash-can" color="#fff"/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#007AFF',
      borderRadius: 5,
    },
    buttonText: {
      color: '#fff',
      marginRight: 8,
      fontSize: 16,
    },
  });