import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, typography, spacing } from '@/constants/Theme';

export default function SettingsScreen() {
  return (
    <LinearGradient colors={colors.gradientEarth} style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>App</Text>
        <GlassCard style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Sound effects</Text>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Haptic feedback</Text>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>
        </GlassCard>

        <Text style={styles.sectionTitle}>About</Text>
        <GlassCard style={styles.card}>
          <Text style={styles.label}>DroneFarm</Text>
          <Text style={styles.value}>Version 1.0.0</Text>
          <Text style={styles.caption}>Code. Fly. Grow.</Text>
        </GlassCard>

        <Text style={styles.sectionTitle}>Privacy</Text>
        <GlassCard style={styles.card}>
          <Text style={styles.body}>
            Your progress is stored locally on your device. No data is sent to
            external servers. We respect your privacy.
          </Text>
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
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  card: {
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    ...typography.body,
    color: colors.text,
  },
  value: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 4,
  },
  caption: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
  },
  body: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
