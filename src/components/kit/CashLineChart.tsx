import { useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { colors } from '../../theme/tokens';

export interface ChartPoint {
  /** Étiquette sous l'axe (ex. "M3"). Absente = pas d'étiquette. */
  label?: string;
  value: number;
}

interface Props {
  points: ChartPoint[];
  /** Texte au-dessus du dernier point (ex. "6,72 M FCFA"). */
  endLabel?: string;
  height?: number;
  accessibilityLabel?: string;
}

const PAD = { left: 12, right: 12, top: 26, bottom: 26 };

/** Courbe simple en SVG (aucune bibliothèque de graphiques). La ligne pointillée marque 0. */
export function CashLineChart({ points, endLabel, height = 170, accessibilityLabel }: Props) {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const values = points.map((p) => p.value);
  const minV = Math.min(0, ...values);
  const maxV = Math.max(0, ...values);
  const span = maxV - minV || 1;
  const innerW = Math.max(width - PAD.left - PAD.right, 1);
  const innerH = height - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (points.length > 1 ? (i * innerW) / (points.length - 1) : 0);
  const y = (v: number) => PAD.top + ((maxV - v) / span) * innerH;

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(' ');
  const last = points.length - 1;

  return (
    <View onLayout={onLayout} style={{ height }} accessible accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      {width > 0 && points.length > 1 ? (
        <Svg width={width} height={height}>
          <Line x1={PAD.left} x2={width - PAD.right} y1={y(0)} y2={y(0)} stroke={colors.borderStrong} strokeWidth={1} strokeDasharray="4 4" />
          <Path d={path} stroke={colors.primary} strokeWidth={3} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          <Circle cx={x(last)} cy={y(points[last].value)} r={5} fill={colors.primary} />
          {endLabel ? (
            <SvgText x={x(last)} y={Math.max(y(points[last].value) - 12, 12)} fontSize={12} fontWeight="700" fill={colors.text} textAnchor="end">
              {endLabel}
            </SvgText>
          ) : null}
          {points.map((p, i) =>
            p.label ? (
              <SvgText key={`${p.label}-${i}`} x={x(i)} y={height - 8} fontSize={11} fill={colors.textMuted} textAnchor={i === 0 ? 'start' : i === last ? 'end' : 'middle'}>
                {p.label}
              </SvgText>
            ) : null,
          )}
        </Svg>
      ) : null}
    </View>
  );
}
