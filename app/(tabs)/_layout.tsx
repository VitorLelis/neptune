import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome6';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="house" color={color} />,
        }}
      />
      <Tabs.Screen
        name="swimmers"
        options={{
          title: 'Swimmers',
          tabBarIcon: ({ color }) => <TabBarIcon name="person-swimming" color={color} />,
          headerRight: () => (
            <Link href="/addSwimmer" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="user-plus"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="relay"
        options={{
          title: 'Relay Setup',
          tabBarIcon: ({ color }) => <TabBarIcon name="stopwatch" color={color} />,
        }}
      />
      <Tabs.Screen
        name="ranks"
        options={{
          title: 'Rankings',
          tabBarIcon: ({ color }) => <TabBarIcon name="ranking-star" color={color} />,
        }}
      />
      <Tabs.Screen
        name="converter"
        options={{
          title: 'Time Converter',
          tabBarIcon: ({ color }) => <TabBarIcon name="clock-rotate-left" color={color} />,
        }}
      />
    </Tabs>
  );
}
