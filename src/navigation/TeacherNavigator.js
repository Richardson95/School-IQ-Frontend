import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, TAB_BAR_STYLE } from '../constants/theme';

import TeacherHomeScreen from '../screens/teacher/TeacherHomeScreen';
import SubmitReportScreen from '../screens/teacher/SubmitReportScreen';
import MarkAttendanceScreen from '../screens/teacher/MarkAttendanceScreen';
import MessageParentScreen from '../screens/teacher/MessageParentScreen';
import TeacherProfileScreen from '../screens/teacher/TeacherProfileScreen';
import CalendarScreen from '../screens/parent/CalendarScreen';
import NotificationSettingsScreen from '../screens/shared/NotificationSettingsScreen';
import EditProfileScreen from '../screens/shared/EditProfileScreen';
import HelpSupportScreen from '../screens/shared/HelpSupportScreen';
import MySubjectsScreen from '../screens/teacher/MySubjectsScreen';
import MyClassesScreen from '../screens/teacher/MyClassesScreen';
import TeacherNotificationsScreen from '../screens/teacher/TeacherNotificationsScreen';
import TeacherLiveClassScreen from '../screens/teacher/TeacherLiveClassScreen';
import VoiceNotesScreen from '../screens/teacher/VoiceNotesScreen';
import PickupAlertsScreen from '../screens/shared/PickupAlertsScreen';
import AssignmentSubmissionsScreen from '../screens/teacher/AssignmentSubmissionsScreen';

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
  { name: 'TeacherHome', component: TeacherHomeScreen },
  { name: 'SubmitReport', component: SubmitReportScreen },
  { name: 'MarkAttendance', component: MarkAttendanceScreen },
  { name: 'MessageParent', component: MessageParentScreen },
  { name: 'TeacherCalendar', component: CalendarScreen },
  { name: 'Notifications', component: TeacherNotificationsScreen },
  { name: 'TeacherLiveClass', component: TeacherLiveClassScreen },
  { name: 'VoiceNotes', component: VoiceNotesScreen },
  { name: 'PickupAlerts', component: PickupAlertsScreen },
  { name: 'AssignmentSubmissions', component: AssignmentSubmissionsScreen },
]);

const ReportsStackNav = makeStack([{ name: 'SubmitReportMain', component: SubmitReportScreen }]);
const AttendanceStackNav = makeStack([{ name: 'AttendanceMain', component: MarkAttendanceScreen }]);
const MessagesStackNav = makeStack([{ name: 'MessagesMain', component: MessageParentScreen }]);
const ProfileStackNav = makeStack([
  { name: 'ProfileMain', component: TeacherProfileScreen },
  { name: 'EditProfile', component: EditProfileScreen },
  { name: 'MySubjects', component: MySubjectsScreen },
  { name: 'MyClasses', component: MyClassesScreen },
  { name: 'TeacherLiveClass', component: TeacherLiveClassScreen },
  { name: 'VoiceNotes', component: VoiceNotesScreen },
  { name: 'NotificationSettings', component: NotificationSettingsScreen },
  { name: 'HelpSupport', component: HelpSupportScreen },
]);

const TAB_ICONS = {
  Home:       ['home',              'home-outline'],
  Reports:    ['document-text',     'document-text-outline'],
  Attendance: ['checkmark-circle',  'checkmark-circle-outline'],
  Messages:   ['chatbubble',        'chatbubble-outline'],
  Profile:    ['person',            'person-outline'],
};

export default function TeacherNavigator() {
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
          const [active, inactive] = TAB_ICONS[route.name] || ['apps', 'apps-outline'];
          return <Ionicons name={focused ? active : inactive} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNav} />
      <Tab.Screen name="Reports" component={ReportsStackNav} />
      <Tab.Screen name="Attendance" component={AttendanceStackNav} />
      <Tab.Screen name="Messages" component={MessagesStackNav} />
      <Tab.Screen name="Profile" component={ProfileStackNav} />
    </Tab.Navigator>
  );
}
