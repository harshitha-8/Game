import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import type { FarmGrid as FarmGridType, FarmTile } from '@/src/game/farmUtils';
import { colors } from '@/constants/Theme';

interface FarmGridProps {
  farm: FarmGridType;
  dronePosition: { x: number; y: number };
  battery: number;
  watered?: Set<string>;
  sprayed?: Set<string>;
  scanned?: Set<string>;
  collected?: Set<string>;
}

const TILE_COLORS: Record<string, string> = {
  soil: '#5D4E37',
  crop: '#3D7B2E',
  weed: '#6B4423',
  water: '#0EA5E9',
  obstacle: '#4B5563',
  recharge: '#22C55E',
  sample: '#F59E0B',
  target: '#22C55E',
};

function TileCell({
  tile,
  isDrone,
  isWatered,
  isSprayed,
  isScanned,
  isCollected,
  size,
}: {
  tile: FarmTile;
  isDrone: boolean;
  isWatered: boolean;
  isSprayed: boolean;
  isScanned: boolean;
  isCollected: boolean;
  size: number;
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isWatered || isSprayed || isScanned || isCollected) {
      scale.value = withSequence(
        withSpring(1.1, { damping: 10 }),
        withSpring(1)
      );
    }
  }, [isWatered, isSprayed, isScanned, isCollected]);

  const bgColor = TILE_COLORS[tile.type] ?? colors.soil;
  const borderColor = isDrone ? colors.primary : colors.border;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          backgroundColor: bgColor,
          borderColor,
          borderWidth: isDrone ? 3 : 1,
        },
        animatedStyle,
      ]}
    >
      {isDrone && (
        <View style={styles.drone} />
      )}
      {tile.state === 'dry' && tile.type === 'crop' && (
        <View style={[styles.overlay, { backgroundColor: 'rgba(245,158,11,0.4)' }]} />
      )}
      {isWatered && <View style={[styles.overlay, { backgroundColor: 'rgba(14,165,233,0.3)' }]} />
      {isSprayed && <View style={[styles.overlay, { backgroundColor: 'rgba(239,68,68,0.3)' }]} />
      {isScanned && <View style={[styles.overlay, { backgroundColor: 'rgba(34,197,94,0.2)' }]} />
    </Animated.View>
  );
}

export function FarmGrid({
  farm,
  dronePosition,
  battery,
  watered = new Set(),
  sprayed = new Set(),
  scanned = new Set(),
  collected = new Set(),
}: FarmGridProps) {
  const maxWidth = Dimensions.get('window').width - 32;
  const tileSize = Math.min(
    Math.floor(maxWidth / farm.width),
    48
  );
  const gridWidth = tileSize * farm.width;
  const gridHeight = tileSize * farm.height;

  const getKey = (x: number, y: number) => `${x},${y}`;

  return (
    <View style={[styles.container, { width: gridWidth, height: gridHeight }]}>
      {farm.tiles.map((row, y) =>
        row.map((tile, x) => (
          <TileCell
            key={getKey(x, y)}
            tile={tile}
            isDrone={dronePosition.x === x && dronePosition.y === y}
            isWatered={watered.has(getKey(x, y))}
            isSprayed={sprayed.has(getKey(x, y))}
            isScanned={scanned.has(getKey(x, y))}
            isCollected={collected.has(getKey(x, y))}
            size={tileSize - 2}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    alignSelf: 'center',
  },
  tile: {
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drone: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.text,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 4,
  },
});
