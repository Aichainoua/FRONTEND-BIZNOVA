import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { useThemeStore } from '../../stores/themeStore';

export const ThemeToggle: React.FC = () => {
  const { mode, colors, toggleTheme } = useThemeStore();
  const isDark = mode === 'dark';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={toggleTheme}
      activeOpacity={0.7}
      accessibilityLabel="Basculer le mode sombre"
    >
      {isDark ? (
        <Sun size={18} color="#F59E0B" />
      ) : (
        <Moon size={18} color={colors.text} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
