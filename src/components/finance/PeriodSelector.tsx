import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { CalendarDays, ChevronDown } from 'lucide-react-native';
import type { MonthKey } from '../../domain/dates';
import { useColors } from '../../theme';
import { radius } from '../../theme/spacing';
import { formatMonthLabel } from '../../utils/format';
import { OptionSheet } from '../forms/SelectField';
import { Text } from '../ui/Text';

export interface PeriodSelectorProps {
  /** Mois disponibles (du plus ancien au plus récent). */
  months: readonly MonthKey[];
  value: MonthKey;
  /** Mois en cours : repéré dans la liste. */
  currentMonth: MonthKey;
  onChange: (month: MonthKey) => void;
}

/** Sélecteur de période mensuelle partagé par le tableau de bord, les opérations, le budget et le rapport. */
export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  months,
  value,
  currentMonth,
  onChange,
}) => {
  const colors = useColors();
  const [open, setOpen] = useState(false);

  const options = useMemo(
    () =>
      [...months].reverse().map((month) => ({
        value: month,
        label: month === currentMonth ? `${formatMonthLabel(month)} · en cours` : formatMonthLabel(month),
      })),
    [months, currentMonth],
  );

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`Période : ${formatMonthLabel(value)}`}
        accessibilityHint="Choisir un autre mois"
        style={[styles.selector, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <CalendarDays size={18} color={colors.primary} />
        <Text variant="bodyStrong" style={styles.label}>
          {formatMonthLabel(value)}
        </Text>
        <ChevronDown size={16} color={colors.textSecondary} />
      </Pressable>
      <OptionSheet
        visible={open}
        title="Choisir la période"
        options={options}
        value={value}
        onSelect={(month) => onChange(month)}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  selector: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  label: {
    flex: 1,
  },
});
