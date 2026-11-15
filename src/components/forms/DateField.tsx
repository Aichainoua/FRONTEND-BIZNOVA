import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react-native';
import {
  addMonths,
  daysInMonth,
  makeMonthKey,
  monthKeyOf,
  parseMonthKey,
  type IsoDate,
  type MonthKey,
} from '../../domain/dates';
import { useColors } from '../../theme';
import { formatDateField, formatMonthLabel } from '../../utils/format';
import { BottomSheet } from '../ui/BottomSheet';
import { Text } from '../ui/Text';
import { Field, FieldBox } from './Field';

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'] as const;

interface DatePickerSheetProps {
  visible: boolean;
  title: string;
  value: IsoDate | null;
  min: IsoDate;
  max: IsoDate;
  onSelect: (date: IsoDate) => void;
  onClose: () => void;
}

/** Calendrier mensuel borné par `min` et `max` (aucune dépendance native). */
export const DatePickerSheet: React.FC<DatePickerSheetProps> = ({
  visible,
  title,
  value,
  min,
  max,
  onSelect,
  onClose,
}) => {
  const colors = useColors();
  const [viewMonth, setViewMonth] = useState<MonthKey>(monthKeyOf(value ?? max));

  const { year, month } = parseMonthKey(viewMonth);
  const canGoBack = addMonths(viewMonth, -1) >= monthKeyOf(min);
  const canGoForward = addMonths(viewMonth, 1) <= monthKeyOf(max);

  const cells = useMemo(() => {
    // Semaine commençant le lundi.
    const offset = (new Date(year, month - 1, 1).getDay() + 6) % 7;
    const total = daysInMonth(year, month);
    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from({ length: total }, (_, index) => index + 1),
    ];
  }, [year, month]);

  return (
    <BottomSheet visible={visible} title={title} onClose={onClose}>
      <View style={styles.monthBar}>
        <Pressable
          onPress={() => setViewMonth(addMonths(viewMonth, -1))}
          disabled={!canGoBack}
          accessibilityRole="button"
          accessibilityLabel="Mois précédent"
          style={[styles.navButton, !canGoBack && styles.disabled]}
        >
          <ChevronLeft size={20} color={colors.text} />
        </Pressable>
        <Text variant="bodyStrong" accessibilityLiveRegion="polite">
          {formatMonthLabel(viewMonth)}
        </Text>
        <Pressable
          onPress={() => setViewMonth(addMonths(viewMonth, 1))}
          disabled={!canGoForward}
          accessibilityRole="button"
          accessibilityLabel="Mois suivant"
          style={[styles.navButton, !canGoForward && styles.disabled]}
        >
          <ChevronRight size={20} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.grid}>
        {WEEKDAYS.map((weekday, index) => (
          <View key={`weekday-${index}`} style={styles.cell}>
            <Text variant="smallStrong" tone="textSecondary">
              {weekday}
            </Text>
          </View>
        ))}
        {cells.map((day, index) => {
          if (day === null) return <View key={`empty-${index}`} style={styles.cell} />;
          const iso = `${makeMonthKey(year, month)}-${String(day).padStart(2, '0')}`;
          const outOfRange = iso < min || iso > max;
          const selected = iso === value;
          return (
            <Pressable
              key={iso}
              disabled={outOfRange}
              onPress={() => {
                onSelect(iso);
                onClose();
              }}
              accessibilityRole="button"
              accessibilityLabel={formatDateField(iso)}
              accessibilityState={{ selected, disabled: outOfRange }}
              style={styles.cell}
            >
              <View style={[styles.day, selected && { backgroundColor: colors.primary }]}>
                <Text
                  variant="body"
                  tone={selected ? 'onPrimary' : outOfRange ? 'textSecondary' : 'text'}
                  style={outOfRange ? styles.disabled : undefined}
                >
                  {String(day)}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </BottomSheet>
  );
};

export interface DateFieldProps {
  label: string;
  value: IsoDate | null;
  onChange: (date: IsoDate) => void;
  /** Première date sélectionnable. */
  min: IsoDate;
  /** Dernière date sélectionnable. */
  max: IsoDate;
  required?: boolean;
  helper?: string;
  error?: string;
}

/** Champ date : s'ouvre sur un calendrier, sans saisie au clavier. */
export const DateField: React.FC<DateFieldProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  required,
  helper,
  error,
}) => {
  const colors = useColors();
  const [open, setOpen] = useState(false);

  return (
    <Field label={label} required={required} helper={helper} error={error}>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label} : ${value ? formatDateField(value) : 'non renseignée'}`}
        accessibilityHint="Ouvre le calendrier"
      >
        <FieldBox focused={open} invalid={Boolean(error)}>
          <Text variant="lead" tone={value ? 'text' : 'textSecondary'} style={styles.value}>
            {value ? formatDateField(value) : 'JJ / MM / AAAA'}
          </Text>
          <CalendarDays size={18} color={colors.textSecondary} />
        </FieldBox>
      </Pressable>
      {open ? (
        <DatePickerSheet
          visible={open}
          title={label}
          value={value}
          min={min}
          max={max}
          onSelect={onChange}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </Field>
  );
};

const styles = StyleSheet.create({
  value: {
    flex: 1,
    paddingVertical: 12,
  },
  monthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  navButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  day: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
