import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '@/components/ui/GlassCard';
import { getMission } from '@/src/data/missions';
import { colors, typography, spacing } from '@/constants/Theme';

export default function MissionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const mission = id ? getMission(id) : null;

  if (!mission) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Mission not found</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={colors.gradientEarth} style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{mission.title}</Text>
          <Text style={styles.description}>{mission.description}</Text>
        </View>

        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Objective</Text>
          <Text style={styles.objective}>{mission.objective}</Text>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Hint</Text>
          <Text style={styles.hint}>{mission.hint}</Text>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Sample solution</Text>
          <Text style={styles.code}>{mission.sampleSolution}</Text>
        </GlassCard>

        <Pressable
          style={styles.button}
          onPress={() => router.push(`/simulator/${mission.id}`)}
        >
          <Text style={styles.buttonText}>Start Mission</Text>
        </Pressable>

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
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
  },
  card: {
    marginBottom: spacing.lg,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  objective: {
    ...typography.body,
    color: colors.textSecondary,
  },
  hint: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  code: {
    ...typography.code,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonText: {
    color: '#000',
    ...typography.h3,
  },
  error: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    padding: spacing.lg,
  },
});
