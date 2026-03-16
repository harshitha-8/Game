import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FarmGrid } from '@/components/game/FarmGrid';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { getMission } from '@/src/data/missions';
import { parseMissionToFarm } from '@/src/game/farmUtils';
import { parse } from '@/src/interpreter/parser';
import { createInitialState } from '@/src/interpreter/interpreter';
import { executeProgram } from '@/src/interpreter/executor';
import {
  createFarmState,
  computeScore,
  checkMissionComplete,
} from '@/src/game/gameRunner';
import { colors, typography, spacing } from '@/constants/Theme';

export default function SimulatorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const mission = id ? getMission(id) : null;
  const [code, setCode] = useState(mission?.sampleSolution?.split('\n').slice(0, 2).join('\n') ?? 'move_right()');
  const [runState, setRunState] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [droneState, setDroneState] = useState<{
    x: number;
    y: number;
    battery: number;
    watered: Set<string>;
    sprayed: Set<string>;
    scanned: Set<string>;
    collected: Set<string>;
    output: string[];
    error: string | null;
    stepCount: number;
  } | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const runnerRef = useRef<Generator<{ state: any; command: any }> | null>(null);
  const runIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const farm = mission ? parseMissionToFarm(mission) : null;
  const farmState = mission ? createFarmState(mission) : null;

  const reset = () => {
    if (runIntervalRef.current) {
      clearInterval(runIntervalRef.current);
      runIntervalRef.current = null;
    }
    runnerRef.current = null;
    if (farmState) {
      const init = createInitialState(farmState);
      setDroneState({
        x: init.x,
        y: init.y,
        battery: init.battery,
        watered: new Set(),
        sprayed: new Set(),
        scanned: new Set(),
        collected: new Set(),
        output: [],
        error: null,
        stepCount: 0,
      });
    }
    setRunState('idle');
  };

  useEffect(() => {
    if (farmState) reset();
    return () => {
      if (runIntervalRef.current) clearInterval(runIntervalRef.current);
    };
  }, [id]);

  const run = () => {
    if (!mission || !farmState || !farm) return;
    const { commands, errors } = parse(code);
    if (errors.length > 0) {
      setParseError(errors[0]);
      setRunState('error');
      return;
    }
    setParseError(null);
    const init = createInitialState(farmState);
    setDroneState({
      x: init.x,
      y: init.y,
      battery: init.battery,
      watered: new Set(),
      sprayed: new Set(),
      scanned: new Set(),
      output: [],
      error: null,
      stepCount: 0,
    });
    const gen = executeProgram(commands, init, farmState);
    runnerRef.current = gen;
    setRunState('running');

    let lastYieldedState: typeof droneState = null;
    const step = () => {
      const next = gen.next();
      if (next.done) {
        if (runIntervalRef.current) {
          clearInterval(runIntervalRef.current);
          runIntervalRef.current = null;
        }
        setRunState('done');
        const s = lastYieldedState ?? next.value?.state;
        if (s?.error || (s?.battery ?? 100) <= 0) {
          setRunState('error');
          setDroneState(s ? {
            x: s.x,
            y: s.y,
            battery: s.battery,
            watered: s.watered,
            sprayed: s.sprayed,
            scanned: s.scanned,
            collected: s.collected,
            output: s.output,
            error: s.error,
            stepCount: s.stepCount,
          } : null);
        } else if (s) {
          const reached = checkMissionComplete(mission, s);
          const score = computeScore(mission, s.stepCount, s.error, reached);
          router.replace({
            pathname: '/results/[id]',
            params: { id: mission.id, score: String(score), steps: String(s.stepCount) },
          });
        }
        return;
      }
      lastYieldedState = next.value.state;
      setDroneState({
        x: next.value.state.x,
        y: next.value.state.y,
        battery: next.value.state.battery,
        watered: next.value.state.watered,
        sprayed: next.value.state.sprayed,
        scanned: next.value.state.scanned,
        collected: next.value.state.collected,
        output: next.value.state.output,
        error: next.value.state.error,
        stepCount: next.value.state.stepCount,
      });
      if (next.value.state.error || next.value.state.battery <= 0) {
        if (runIntervalRef.current) clearInterval(runIntervalRef.current);
        setRunState('error');
      }
    };

    step(); // run first step immediately
    runIntervalRef.current = setInterval(step, 400);
  };

  const step = () => {
    if (!mission || !farmState || !farm) return;
    if (runState === 'running') return;
    const { commands, errors } = parse(code);
    if (errors.length > 0) {
      setParseError(errors[0]);
      return;
    }
    setParseError(null);
    if (!droneState) {
      const init = createInitialState(farmState);
      setDroneState({
        x: init.x,
        y: init.y,
        battery: init.battery,
        watered: new Set(),
        sprayed: new Set(),
        scanned: new Set(),
        collected: new Set(),
        output: [],
        error: null,
        stepCount: 0,
      });
      runnerRef.current = executeProgram(commands, init, farmState);
    }
    const gen = runnerRef.current;
    if (!gen) return;
    const next = gen.next();
    if (next.done) {
      setRunState('done');
      const reached = checkMissionComplete(mission, next.value.state);
      const score = computeScore(mission, next.value.state.stepCount, next.value.state.error, reached);
      router.replace({
        pathname: '/results/[id]',
        params: { id: mission.id, score: String(score), steps: String(next.value.state.stepCount) },
      });
      return;
    }
    setDroneState({
      x: next.value.state.x,
      y: next.value.state.y,
      battery: next.value.state.battery,
      watered: next.value.state.watered,
      sprayed: next.value.state.sprayed,
      scanned: next.value.state.scanned,
      output: next.value.state.output,
      error: next.value.state.error,
      stepCount: next.value.state.stepCount,
    });
  };

  if (!mission || !farm) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Mission not found</Text>
      </View>
    );
  }

  const displayState = droneState ?? (farmState ? {
    ...createInitialState(farmState),
    watered: new Set<string>(),
    sprayed: new Set<string>(),
    scanned: new Set<string>(),
    collected: new Set<string>(),
    output: [] as string[],
  } : null);

  return (
    <LinearGradient colors={colors.gradientEarth} style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>{mission.title}</Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Battery</Text>
            <View style={styles.barBg}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${(displayState?.battery ?? 100) / 100 * 60}%`,
                    backgroundColor: (displayState?.battery ?? 100) > 20 ? colors.battery : colors.batteryLow,
                  },
                ]}
              />
            </View>
          </View>
          <Text style={styles.steps}>{displayState?.stepCount ?? 0} steps</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridWrap}>
          <FarmGrid
            farm={farm}
            dronePosition={{ x: displayState?.x ?? 0, y: displayState?.y ?? 0 }}
            battery={displayState?.battery ?? 100}
            watered={displayState?.watered}
            sprayed={displayState?.sprayed}
            scanned={displayState?.scanned}
            collected={displayState?.collected}
          />
        </View>

        {parseError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{parseError}</Text>
          </View>
        )}

        {displayState?.error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{displayState.error}</Text>
          </View>
        )}

        <View style={styles.editorSection}>
          <View style={styles.editorHeader}>
            <Text style={styles.editorTitle}>Code</Text>
            <Pressable onPress={() => setShowHint(!showHint)}>
              <Text style={styles.hintBtn}>{showHint ? 'Hide' : 'Show'} hint</Text>
            </Pressable>
          </View>
          {showHint && (
            <View style={styles.hintBox}>
              <Text style={styles.hintText}>{mission.hint}</Text>
            </View>
          )}
          <CodeEditor value={code} onChange={setCode} />
        </View>

        <View style={styles.buttons}>
          <Pressable style={styles.runBtn} onPress={run}>
            <Text style={styles.runBtnText}>Run</Text>
          </Pressable>
          <Pressable style={styles.stepBtn} onPress={step}>
            <Text style={styles.stepBtnText}>Step</Text>
          </Pressable>
          <Pressable style={styles.resetBtn} onPress={reset}>
            <Text style={styles.resetBtnText}>Reset</Text>
          </Pressable>
        </View>

        {displayState?.output && displayState.output.length > 0 && (
          <View style={styles.console}>
            <Text style={styles.consoleTitle}>Output</Text>
            {displayState.output.map((line, i) => (
              <Text key={i} style={styles.consoleLine}>{line}</Text>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.md,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: {
    color: colors.primary,
    ...typography.bodySmall,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  barBg: {
    height: 6,
    backgroundColor: colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  steps: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  gridWrap: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.2)',
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.weed,
    ...typography.bodySmall,
  },
  editorSection: {
    marginBottom: spacing.md,
  },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  editorTitle: {
    ...typography.h3,
    color: colors.text,
  },
  hintBtn: {
    color: colors.primary,
    ...typography.bodySmall,
  },
  hintBox: {
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  hintText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  runBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  runBtnText: {
    color: '#000',
    ...typography.h3,
  },
  stepBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepBtnText: {
    color: colors.text,
    ...typography.h3,
  },
  resetBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetBtnText: {
    color: colors.textSecondary,
    ...typography.h3,
  },
  console: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  consoleTitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  consoleLine: {
    ...typography.code,
    color: colors.text,
  },
  error: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    padding: spacing.lg,
  },
});
