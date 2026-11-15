import React from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { useColors } from '../../theme';
import { textStyles, type TextVariant } from '../../theme/typography';

export type TextTone =
  | 'text'
  | 'textSecondary'
  | 'primary'
  | 'onPrimary'
  | 'onPrimaryMuted'
  | 'danger';

export interface TextProps extends RNTextProps {
  /** Style typographique de l'échelle Biznova. */
  variant?: TextVariant;
  /** Couleur sémantique du thème. */
  tone?: TextTone;
}

/**
 * Seul composant texte à utiliser dans l'application : il garantit la police Inter,
 * l'échelle typographique et les couleurs du thème.
 */
export const Text: React.FC<TextProps> = ({
  variant = 'body',
  tone = 'text',
  style,
  maxFontSizeMultiplier = 1.3,
  ...props
}) => {
  const colors = useColors();
  return (
    <RNText
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={[textStyles[variant], { color: colors[tone] }, style]}
      {...props}
    />
  );
};
