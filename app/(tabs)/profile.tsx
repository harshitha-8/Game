import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '@/components/ui/GlassCard';
import { useAppStore } from '@/src/store/useAppStore';
import { colors, typography, spacing } from '@/constants/Theme';

export default function ProfileScreen() {
  const { progress } = useAppStore();

  return (
    <LinearGradient colors={colors.gradientEarth} style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatar} />
          <Text style={styles.title}>Pilot</Text>
          <Text style={styles.subtitle}>DroneFarm Coder</Text>
        </View>

        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Progress</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Missions completed</Text>
            <Text style={styles.value}>{progress.completedMissions.length} / 13</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total stars</Text>
            <Text style={styles.value}>{progress.totalStars}</Text>
          </View>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Achievements</Text>
          {progress.completedMissions.length >= 1 && (
            <View style={styles.badge}>
              <Text style={styles.badgeIcon}>🎯</Text>
              <Text style={styles.badgeText}>First Flight</Text>
            </View>
          )}
          {progress.completedMissions.length >= 5 && (
            <View style={styles.badge}>
              <Text style={styles.badgeIcon}>🌱</Text>
              <Text style={styles.badgeText}>Growing Coder</Text>
            </View>
          )}
          {progress.completedMissions.length >= 10 && (
            <View style={styles.badge}>
              <Text style={styles.badgeIcon}>⭐</Text>
              <Text style={styles.badgeText}>Mission Master</Text>
            </View>
          )}
          {progress.completedMissions.length === 0 && (
            <Text style={styles.empty}>Complete missions to earn badges!</Text>
          )}
        </GlassCard>

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
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  card: {
    marginBottom: spacing.lg,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
  },
  value: {
    ...typography.body,
    color: colors.text,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  badgeIcon: {
    fontSize: 24,
  },
  badgeText: {
    ...typography.body,
    color: colors.text,
  },
  empty: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
});
