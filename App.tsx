import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';

interface Quest {
  id: string;
  title: string;
  target: string;
  xp: number;
  stat: 'FOR' | 'VIT' | 'AGI';
  completed: boolean;
}

export default function App() {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [stats, setStats] = useState({ FOR: 10, VIT: 10, AGI: 10, INT: 10 });
  const [hp, setHp] = useState(65); // Representa % da meta de proteínas/calorias do dia
  const [mp, setMp] = useState(50); // Representa % de hidratação/carboidratos

  const [quests, setQuests] = useState<Quest[]>([
    { id: '1', title: 'Treino de Força (Peito/Tríceps)', target: '45 min', xp: 50, stat: 'FOR', completed: false },
    { id: '2', title: 'Cardio / Caminhada Rápida', target: '5 km', xp: 40, stat: 'AGI', completed: false },
    { id: '3', title: 'Ingestão Hídrica', target: '3.0 Litros', xp: 20, stat: 'VIT', completed: false },
    { id: '4', title: 'Bater Meta de Proteína', target: '160g', xp: 30, stat: 'VIT', completed: false },
  ]);

  const xpToNextLevel = level * 100;

  const getRank = (lvl: number) => {
    if (lvl >= 50) return 'S';
    if (lvl >= 35) return 'A';
    if (lvl >= 20) return 'B';
    if (lvl >= 10) return 'C';
    if (lvl >= 5) return 'D';
    return 'E';
  };

  const toggleQuest = (id: string) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id !== id || q.completed) return q;

        const newXp = xp + q.xp;
        if (newXp >= xpToNextLevel) {
          setLevel((l) => l + 1);
          setXp(newXp - xpToNextLevel);
          Alert.alert('⚠️ SISTEMA', 'SUBIU DE NÍVEL! Seus atributos aumentaram.');
        } else {
          setXp(newXp);
        }

        setStats((s) => ({ ...s, [q.stat]: s[q.stat] + 1 }));
        if (q.stat === 'VIT') {
          setHp((h) => Math.min(100, h + 15));
          setMp((m) => Math.min(100, m + 20));
        }

        return { ...q, completed: true };
      })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050B14" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Cabeçalho do Sistema */}
        <View style={styles.systemBox}>
          <Text style={styles.systemAlert}>[ NOTIFICAÇÃO DO SISTEMA ]</Text>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.label}>JOGADOR</Text>
              <Text style={styles.playerName}>CAÇADOR</Text>
              <Text style={styles.jobText}>CLASSE: Iniciante da Forja</Text>
            </View>
            <View style={styles.rankBadge}>
              <Text style={styles.rankLabel}>RANK</Text>
              <Text style={styles.rankValue}>{getRank(level)}</Text>
            </View>
          </View>

          {/* Nível e Barra de XP */}
          <View style={styles.levelRow}>
            <Text style={styles.levelText}>NV. {level}</Text>
            <Text style={styles.xpText}>
              XP: {xp} / {xpToNextLevel}
            </Text>
          </View>
          <View style={styles.barBg}>
            <View style={[styles.barFillCyan, { width: `${(xp / xpToNextLevel) * 100}%` }]} />
          </View>

          {/* Barras de Dieta (HP = Nutrição / MP = Hidratação & Energia) */}
          <View style={styles.vitalsContainer}>
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>HP (DIETA/PROT): {hp}%</Text>
              <View style={styles.barBg}>
                <View style={[styles.barFillHp, { width: `${hp}%` }]} />
              </View>
            </View>
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>MP (ÁGUA/CARBO): {mp}%</Text>
              <View style={styles.barBg}>
                <View style={[styles.barFillMp, { width: `${mp}%` }]} />
              </View>
            </View>
          </View>

          {/* Atributos */}
          <View style={styles.statsGrid}>
            <Text style={styles.statItem}>FOR: {stats.FOR}</Text>
            <Text style={styles.statItem}>AGI: {stats.AGI}</Text>
            <Text style={styles.statItem}>VIT: {stats.VIT}</Text>
            <Text style={styles.statItem}>INT: {stats.INT}</Text>
          </View>
        </View>

        {/* Missões Diárias */}
        <View style={styles.systemBox}>
          <Text style={styles.sectionTitle}>MISSÃO DIÁRIA: PREPARAÇÃO</Text>
          <Text style={styles.warningText}>
            Aviso: Falhar em completar as missões diárias resultará em penalidade.
          </Text>

          {quests.map((quest) => (
            <TouchableOpacity
              key={quest.id}
              style={[styles.questRow, quest.completed && styles.questCompleted]}
              onPress={() => toggleQuest(quest.id)}
              activeOpacity={0.7}
            >
              <View style={styles.questInfo}>
                <Text style={[styles.questTitle, quest.completed && styles.textStrike]}>
                  {quest.title}
                </Text>
                <Text style={styles.questMeta}>
                  Meta: {quest.target} • +{quest.xp} XP (+1 {quest.stat})
                </Text>
              </View>
              <View style={[styles.checkbox, quest.completed && styles.checkboxChecked]}>
                <Text style={styles.checkText}>{quest.completed ? '✓' : ''}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050B14' },
  scroll: { padding: 16, gap: 16 },
  systemBox: {
    backgroundColor: 'rgba(10, 25, 47, 0.92)',
    borderWidth: 1.5,
    borderColor: '#00E5FF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  systemAlert: {
    color: '#00E5FF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 12,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: '#64748B', fontSize: 11, letterSpacing: 1.5 },
  playerName: { color: '#FFFFFF', fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  jobText: { color: '#38BDF8', fontSize: 13, marginTop: 2 },
  rankBadge: {
    borderWidth: 1,
    borderColor: '#00E5FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
  },
  rankLabel: { color: '#00E5FF', fontSize: 10, fontWeight: 'bold' },
  rankValue: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, marginBottom: 6 },
  levelText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  xpText: { color: '#00E5FF', fontSize: 13 },
  barBg: { height: 8, backgroundColor: '#0F172A', borderRadius: 4, overflow: 'hidden' },
  barFillCyan: { height: '100%', backgroundColor: '#00E5FF' },
  barFillHp: { height: '100%', backgroundColor: '#EF4444' },
  barFillMp: { height: '100%', backgroundColor: '#3B82F6' },
  vitalsContainer: { flexDirection: 'row', gap: 12, marginTop: 14 },
  vitalItem: { flex: 1 },
  vitalLabel: { color: '#CBD5E1', fontSize: 11, fontWeight: 'bold', marginBottom: 4 },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 229, 255, 0.25)',
  },
  statItem: { color: '#E2E8F0', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
  sectionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  warningText: { color: '#F87171', fontSize: 12, marginTop: 4, marginBottom: 14 },
  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  questCompleted: { borderColor: '#10B981', opacity: 0.65 },
  questInfo: { flex: 1, paddingRight: 10 },
  questTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: '600' },
  textStrike: { textDecorationLine: 'line-through', color: '#94A3B8' },
  questMeta: { color: '#38BDF8', fontSize: 12, marginTop: 3 },
  checkbox: {
    width: 26,
    height: 26,
    borderWidth: 1.5,
    borderColor: '#00E5FF',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#10B981', borderColor: '#10B981' },
  checkText: { color: '#050B14', fontWeight: 'bold', fontSize: 16 },
});