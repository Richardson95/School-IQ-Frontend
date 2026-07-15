import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, TAB_BAR_STYLE } from '../constants/theme';

import AuthorityHomeScreen from '../screens/authority/AuthorityHomeScreen';
import BroadcastScreen from '../screens/authority/BroadcastScreen';
import BestStudentsScreen from '../screens/authority/BestStudentsScreen';
import EmergencyAlertScreen from '../screens/authority/EmergencyAlertScreen';
import AuthorityProfileScreen from '../screens/authority/AuthorityProfileScreen';
import CalendarScreen from '../screens/parent/CalendarScreen';
import ParentDirectoryScreen from '../screens/shared/ParentDirectoryScreen';
import ChatScreen from '../screens/shared/ChatScreen';
import NotificationSettingsScreen from '../screens/shared/NotificationSettingsScreen';
import PickupAlertsScreen from '../screens/shared/PickupAlertsScreen';

const Tab = createBottomTabNavigator();

function makeStack(screens) {
  const S = createNativeStackNavigator();
  return function StackNav() {
    return (
      <S.Navigator screenOptions={{ headerShown: false }}>
        {screens.map(({ name, component }) => (
          <S.Screen key={name} name={name} component={component} />
        ))}
      </S.Navigator>
    );
  };
}

const HomeStackNav = makeStack([
  { name: 'AuthorityHome', component: AuthorityHomeScreen },
  { name: 'Broadcast', component: BroadcastScreen },
  { name: 'BestStudents', component: BestStudentsScreen },
  { name: 'EmergencyAlert', component: EmergencyAlertScreen },
  { name: 'AuthorityCalendar', component: CalendarScreen },
  { name: 'ManageParents', component: ParentDirectoryScreen },
  { name: 'Chat', component: ChatScreen },
  { name: 'PickupAlerts', component: PickupAlertsScreen },
]);

const BroadcastStackNav = makeStack([{ name: 'BroadcastMain', component: BroadcastScreen }]);
const BestStackNav = makeStack([{ name: 'BestMain', component: BestStudentsScreen }]);
const EmergencyStackNav = makeStack([{ name: 'EmergencyMain', component: EmergencyAlertScreen }]);
const ProfileStackNav = makeStack([
  { name: 'ProfileMain', component: AuthorityProfileScreen },
  { name: 'NotificationSettings', component: NotificationSettingsScreen },
]);

export default function AuthorityNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primaryMid,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          ...TAB_BAR_STYLE,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 6,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.semibold, marginTop: 1 },
        tabBarIcon: ({ focused, color }) => {
          const icons = {
            Home:          focused ? 'home'      : 'home-outline',
            Broadcast:     focused ? 'megaphone' : 'megaphone-outline',
            'Best Students': focused ? 'trophy'  : 'trophy-outline',
            Emergency:     'warning',
            Profile:       focused ? 'person'    : 'person-outline',
          };
          const isEmergency = route.name === 'Emergency';
          return (
            <Ionicons
              name={icons[route.name] || 'apps'}
              size={24}
              color={isEmergency ? '#DC2626' : color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNav} />
      <Tab.Screen name="Broadcast" component={BroadcastStackNav} />
      <Tab.Screen name="Best Students" component={BestStackNav} />
      <Tab.Screen
        name="Emergency"
        component={EmergencyStackNav}
        options={{ tabBarActiveTintColor: '#DC2626' }}
      />
      <Tab.Screen name="Profile" component={ProfileStackNav} />
    </Tab.Navigator>
  );
}
