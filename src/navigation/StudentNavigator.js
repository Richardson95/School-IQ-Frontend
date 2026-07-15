import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, TAB_BAR_STYLE } from '../constants/theme';

import StudentHomeScreen from '../screens/student/StudentHomeScreen';
import AssignmentsScreen from '../screens/student/AssignmentsScreen';
import TestsExamsScreen from '../screens/student/TestsExamsScreen';
import TakeTestScreen from '../screens/student/TakeTestScreen';
import GradesScreen from '../screens/student/GradesScreen';
import TopicsNotesScreen from '../screens/student/TopicsNotesScreen';
import LiveClassesScreen from '../screens/student/LiveClassesScreen';
import ClassNotesScreen from '../screens/student/ClassNotesScreen';
import NotesQuizScreen from '../screens/student/NotesQuizScreen';
import TimetableScreen from '../screens/student/TimetableScreen';
import ResourcesScreen from '../screens/student/ResourcesScreen';
import StudentProfileScreen from '../screens/student/StudentProfileScreen';
import EditProfileScreen from '../screens/shared/EditProfileScreen';
import NotificationSettingsScreen from '../screens/shared/NotificationSettingsScreen';
import HelpSupportScreen from '../screens/shared/HelpSupportScreen';

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
  { name: 'StudentHome', component: StudentHomeScreen },
  { name: 'TestsExams', component: TestsExamsScreen },
  { name: 'TakeTest', component: TakeTestScreen },
  { name: 'TopicsNotes', component: TopicsNotesScreen },
  { name: 'ClassNotes', component: ClassNotesScreen },
  { name: 'NotesQuiz', component: NotesQuizScreen },
  { name: 'Timetable', component: TimetableScreen },
  { name: 'Resources', component: ResourcesScreen },
]);

const AssignmentsStackNav = makeStack([{ name: 'AssignmentsMain', component: AssignmentsScreen }]);
const ClassesStackNav = makeStack([
  { name: 'LiveClassesMain', component: LiveClassesScreen },
  { name: 'ClassNotes', component: ClassNotesScreen },
  { name: 'NotesQuiz', component: NotesQuizScreen },
]);
const GradesStackNav = makeStack([{ name: 'GradesMain', component: GradesScreen }]);
const ProfileStackNav = makeStack([
  { name: 'ProfileMain', component: StudentProfileScreen },
  { name: 'EditProfile', component: EditProfileScreen },
  { name: 'Timetable', component: TimetableScreen },
  { name: 'Resources', component: ResourcesScreen },
  { name: 'NotificationSettings', component: NotificationSettingsScreen },
  { name: 'HelpSupport', component: HelpSupportScreen },
]);

const TAB_ICONS = {
  Home:        ['home',           'home-outline'],
  Assignments: ['clipboard',      'clipboard-outline'],
  Classes:     ['videocam',       'videocam-outline'],
  Grades:      ['ribbon',         'ribbon-outline'],
  Profile:     ['person',         'person-outline'],
};

export default function StudentNavigator() {
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
      <Tab.Screen name="Assignments" component={AssignmentsStackNav} />
      <Tab.Screen name="Classes" component={ClassesStackNav} />
      <Tab.Screen name="Grades" component={GradesStackNav} />
      <Tab.Screen name="Profile" component={ProfileStackNav} />
    </Tab.Navigator>
  );
}
