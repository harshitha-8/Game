import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withSequence } from 'react-native-reanimated';
import { useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { getMission } from '@/src/data/missions';
import { useAppStore } from '@/src/store/useAppStore';
import { colors, typography, spacing } from '@/constants/Theme';

export default function ResultsScreen() {
  const { id, score, steps } = useLocalSearchParams<{ id: string; score?: string; steps?: string }>();
  const router = useRouter();
  const { completeMission, progress } = useAppStore();
  const mission = id ? getMission(id) : null;
  const scoreNum = score ? parseInt(score, 10) : 0;
  const stepsNum = steps ? parseInt(steps, 10) : 0;
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (mission && scoreNum > 0) {
      completeMission(mission.id, scoreNum, stepsNum);
    }
  }, [id, scoreNum, stepsNum]);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.2, { damping: 8 }),
      withSpring(1)
    );
    opacity.value = withSpring(1);
  }, []);

  const stars = scoreNum >= 95 ? 3 : scoreNum >= 80 ? 2 : scoreNum >= 60 ? 1 : 0;
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!mission) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Mission not found</Text>
      </View>
    );
  }

  const feedback =
    scoreNum >= 95
      ? 'Outstanding! You mastered this mission.'
      : scoreNum >= 80
      ? 'Great job! Try to optimize for more stars.'
      : scoreNum >= 60
      ? 'Good effort! Review the hint and try again.'
      : "Keep practicing! You'll get there.";

  return (
    <LinearGradient colors={colors.gradientEarth} style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.scoreCard, animatedStyle]}>
          <Text style={styles.title}>Mission Complete!</Text>
          <Text style={styles.missionName}>{mission.title}</Text>
          <View style={styles.stars}>
            {[1, 2, 3].map((i) => (
              <Text
                key={i}
                style={[styles.star, i <= stars && styles.starActive]}
              >
                ★
              </Text>
            ))}
          </View>
          <Text style={styles.score}>{scoreNum} pts</Text>
          <Text style={styles.steps}>{stepsNum} steps</Text>
        </Animated.View>

        <GlassCard style={styles.feedbackCard}>
          <Text style={styles.feedback}>{feedback}</Text>
        </GlassCard>

        <View style={styles.buttons}>
          <Pressable
            style={styles.replayBtn}
            onPress={() => router.replace(`/simulator/${mission.id}`)}
          >
            <Text style={styles.replayBtnText}>Replay</Text>
          </Pressable>
          <Pressable
            style={styles.homeBtn}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.homeBtnText}>Home</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  content: {
    alignItems: 'center',
  },
  scoreCard: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  missionName: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  stars: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.sm,
  },
  star: {
    fontSize: 36,
    color: colors.border,
  },
  starActive: {
    color: colors.accent,
  },
  score: {
    ...typography.title,
    color: colors.text,
    marginBottom: 4,
  },
  steps: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  feedbackCard: {
    marginBottom: spacing.xl,
    minWidth: 280,
  },
  feedback: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  replayBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
  },
  replayBtnText: {
    color: '#000',
    ...typography.h3,
  },
  homeBtn: {
    backgroundColor: colors.surface,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  homeBtnText: {
    color: colors.text,
    ...typography.h3,
  },
  error: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
  },
});
