import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

const NAVY = '#0B2239';
const NAVY_MID = '#163552';
const ACCENT = '#00D68F';
const MUTED = 'rgba(200,220,235,0.45)';
const BORDER = 'rgba(255,255,255,0.08)';

export default function WorkerTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACCENT,
        tabBarInactiveTintColor: MUTED,
        tabBarStyle: {
          backgroundColor: NAVY_MID,
          borderTopWidth: 1,
          borderTopColor: BORDER,
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.4,
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="grid" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Jobs',
          tabBarIcon: ({ color, focused }) => (
            <JobsTabIcon focused={focused} />
          ),
          tabBarLabel: () => null,
        }}
      />

      <Tabs.Screen
        name="earnings"
        options={{
          title: 'Earnings',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="wallet" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="person" color={color} focused={focused} />
          ),
        }}
      />

      {/* Hidden non-tab worker screens — still accessible via router.push */}
      <Tabs.Screen name="job-detail" options={{ href: null }} />
      <Tabs.Screen name="schedule" options={{ href: null }} />
      <Tabs.Screen name="notification" options={{ href: null }} />
      <Tabs.Screen name="verification" options={{ href: null }} />
      <Tabs.Screen name="Becomeworkerform" options={{ href: null }} />
    </Tabs>
  );
}

// Standard tab icon with active indicator dot
function TabIcon({
  name,
  color,
  focused,
}: {
  name: string;
  color: string;
  focused: boolean;
}) {
  const iconName = (focused ? name : `${name}-outline`) as React.ComponentProps<typeof Ionicons>['name'];
  return (
    <View style={tabIconStyles.wrapper}>
      <Ionicons name={iconName} size={22} color={color} />
      {focused && <View style={tabIconStyles.dot} />}
    </View>
  );
}

// Elevated center FAB-style Jobs button (mirrors customer Booking button)
function JobsTabIcon({ focused }: { focused: boolean }) {
  return (
    <View style={jobsStyles.container}>
      <View style={[jobsStyles.pill, focused && jobsStyles.pillActive]}>
        <Ionicons
          name={focused ? 'briefcase' : 'briefcase-outline'}
          size={22}
          color={focused ? NAVY : MUTED}
        />
      </View>
    </View>
  );
}

const tabIconStyles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: ACCENT,
  },
});

const jobsStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  pill: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  pillActive: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
    shadowColor: ACCENT,
    shadowOpacity: 0.4,
  },
});