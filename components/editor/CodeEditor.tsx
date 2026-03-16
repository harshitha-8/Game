import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  ScrollView,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { colors, typography, borderRadius } from '@/constants/Theme';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  editable?: boolean;
  onRun?: () => void;
}

export function CodeEditor({
  value,
  onChange,
  placeholder = '# Write your code here\nmove_right()',
  editable = true,
}: CodeEditorProps) {
  const inputRef = useRef<TextInput>(null);

  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (Platform.OS === 'web' && e.nativeEvent.key === 'Tab') {
        e.preventDefault();
        onChange(value + '  ');
      }
    },
    [value, onChange]
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.lineNumbers}>
          {Array.from(
            { length: Math.max(value.split('\n').length, 1) },
            (_, i) => (
              <Text key={i} style={styles.lineNumText}>
                {i + 1}
              </Text>
            )
          )}
        </View>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          multiline
          editable={editable}
          onKeyPress={handleKeyPress}
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 120,
    maxHeight: 200,
  },
  scrollContent: {
    flexDirection: 'row',
    flexGrow: 1,
  },
  lineNumbers: {
    width: 36,
    paddingVertical: 12,
    paddingLeft: 8,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  lineNumText: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: 'monospace',
    height: 22,
  },
  input: {
    flex: 1,
    padding: 12,
    paddingLeft: 8,
    color: colors.text,
    ...typography.code,
    minWidth: 200,
  },
});
