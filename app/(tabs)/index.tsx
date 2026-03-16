import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '@/components/ui/GlassCard';
import { useAppStore } from '@/src/store/useAppStore';
import { tutorialMissions, advancedMissions } from '@/src/data/missions';
import { colors, typography, spacing } from '@/constants/Theme';

function MissionCard({
  id,
  title,
  description,
  stars,
  completed,
  onPress,
}: {
  id: string;
  title: string;
  description: string;
  stars: number;
  completed: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <GlassCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{title}</Text>
          {completed && (
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
          )}
        </View>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {description}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardAction}>
            {completed ? 'Replay' : 'Play'}
          </Text>
          <Text style={styles.cardArrow}>→</Text>
        </View>
      </GlassCard>
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { progress } = useAppStore();

  return (
    <LinearGradient colors={colors.gradientEarth} style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>DroneFarm</Text>
          <Text style={styles.tagline}>Code. Fly. Grow.</Text>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{progress.totalStars}</Text>
              <Text style={styles.statLabel}>Stars</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{progress.completedMissions.length}</Text>
              <Text style={styles.statLabel}>Missions</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Tutorial</Text>
        {tutorialMissions.map((m) => (
          <MissionCard
            key={m.id}
            id={m.id}
            title={m.title}
            description={m.description}
            stars={progress.missionScores[m.id]?.stars ?? 0}
            completed={progress.completedMissions.includes(m.id)}
            onPress={() => router.push(`/mission/${m.id}`)}
          />
        ))}

        <Text style={styles.sectionTitle}>Advanced</Text>
        {advancedMissions.map((m) => (
          <MissionCard
            key={m.id}
            id={m.id}
            title={m.title}
            description={m.description}
            stars={progress.missionScores[m.id]?.stars ?? 0}
            completed={progress.completedMissions.includes(m.id)}
            onPress={() => router.push(`/mission/${m.id}`)}
          />
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: 4,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  stat: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
    minWidth: 80,
  },
  statValue: {
    ...typography.h2,
    color: colors.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    color: colors.border,
    fontSize: 14,
  },
  starActive: {
    color: colors.accent,
  },
  cardDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardAction: {
    ...typography.bodySmall,
    color: colors.primary,
  },
  cardArrow: {
    color: colors.primary,
    fontSize: 14,
  },
});
