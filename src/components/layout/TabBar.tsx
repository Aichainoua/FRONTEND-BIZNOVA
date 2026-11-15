import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BriefcaseBusiness,
  ChartNoAxesCombined,
  FileText,
  House,
  type LucideIcon,
} from 'lucide-react-native';
import { TABS } from '../../navigation/routes';
import { useColors } from '../../theme';
import { layout, radius } from '../../theme/spacing';
import { Text } from '../ui/Text';

const TAB_ICONS: Record<string, LucideIcon> = {
  [TABS.HOME]: House,
  [TABS.PROJECTS]: ChartNoAxesCombined,
  [TABS.BUSINESS]: BriefcaseBusiness,
  [TABS.REPORTS]: FileText,
};

/** Barre de navigation principale (4 destinations), fidèle à la maquette. */
export const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: layout.tabBarHeight + Math.max(insets.bottom - 8, 0),
          paddingBottom: Math.max(insets.bottom, 15),
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key] ?? { options: {} };
        const label = typeof options.tabBarLabel === 'string' ? options.tabBarLabel : route.name;
        const Icon = TAB_ICONS[route.name] ?? House;
        const color = focused ? colors.primary : colors.textSecondary;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={label}
            style={styles.tab}
          >
            <Icon size={21} color={color} strokeWidth={focused ? 2.2 : 1.8} />
            <Text variant={focused ? 'microStrong' : 'micro'} style={[styles.label, { color }]}>
              {label}
            </Text>
            <View style={[styles.indicator, focused && { backgroundColor: colors.primary }]} />
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  label: {
    textTransform: 'none',
    letterSpacing: 0,
  },
  indicator: {
    width: 16,
    height: 3,
    borderRadius: radius.xs / 2,
    backgroundColor: 'transparent',
  },
});
