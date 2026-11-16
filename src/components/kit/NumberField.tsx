import { groupDigits } from '../../utils/format';
import { TextField, type TextFieldProps } from './TextField';

interface Props extends Omit<TextFieldProps, 'keyboardType' | 'secure' | 'valid' | 'suffix'> {
  kind: 'money' | 'percent';
  /** Texte après l'unité : "/ mois", "des revenus", "/ an". */
  unit?: string;
}

/**
 * Champ numérique : la valeur du formulaire reste "brute" (chiffres seuls pour un montant,
 * "12,5" pour un pourcentage) ; seul l'affichage est regroupé ("3 000 000").
 */
export function NumberField({ kind, unit, value, onChangeText, ...rest }: Props) {
  const handleChange = (text: string) => {
    if (kind === 'money') {
      onChangeText(text.replace(/\D/g, ''));
      return;
    }
    const cleaned = text.replace(/[^\d.,]/g, '');
    const firstSep = cleaned.search(/[.,]/);
    const normalized = firstSep === -1 ? cleaned : cleaned.slice(0, firstSep + 1) + cleaned.slice(firstSep + 1).replace(/[.,]/g, '');
    onChangeText(normalized.replace('.', ','));
  };

  return (
    <TextField
      {...rest}
      value={kind === 'money' ? groupDigits(value) : value}
      onChangeText={handleChange}
      keyboardType={kind === 'money' ? 'number-pad' : 'decimal-pad'}
      suffix={kind === 'money' ? `FCFA${unit ? ` ${unit}` : ''}` : `%${unit ? ` ${unit}` : ''}`}
    />
  );
}
