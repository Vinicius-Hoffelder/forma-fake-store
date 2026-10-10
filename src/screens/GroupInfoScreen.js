import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen } from "../components/ui";
import { groupDescription, groupMembers } from "../data/group";
import { colors, shadow } from "../theme";

export default function GroupInfoScreen() {
  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introduction}>
          <Text style={styles.eyebrow}>QUEM FEZ O APP</Text>
          <Text accessibilityRole="header" style={styles.title}>
            Nosso grupo
          </Text>
          <Text style={styles.description}>{groupDescription}</Text>
        </View>
        {/* Nome e RA de cada integrante. */}
        <View style={styles.membersSection}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            Integrantes
          </Text>
          {groupMembers.map((member) => (
            <View key={member.ra} style={styles.memberCard}>
              <View accessible={false} style={styles.avatar}>
                <Text style={styles.initials}>
                  {member.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </Text>
              </View>
              <View style={styles.memberInformation}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRa}>RA {member.ra}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.projectInformation}>
          <Text style={styles.projectTitle}>React Native · Consumo de API</Text>
          <Text style={styles.projectDescription}>
            Projeto acadêmico com dados da Fake Store API.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

// Estilos
const styles = StyleSheet.create({
  content: {
    padding: 24,
    paddingBottom: 40,
    gap: 32,
  },
  introduction: {
    gap: 14,
    paddingTop: 8,
  },
  eyebrow: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.5,
  },
  title: {
    color: colors.ink,
    fontSize: 32,
    fontWeight: "600",
    letterSpacing: -1,
  },
  description: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 25,
  },
  membersSection: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...shadow,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.soft,
  },
  initials: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: "600",
  },
  memberInformation: {
    flex: 1,
    gap: 6,
  },
  memberName: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "600",
  },
  memberRa: {
    color: colors.muted,
    fontSize: 13,
    letterSpacing: 0.3,
  },
  projectInformation: {
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 24,
  },
  projectTitle: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "600",
  },
  projectDescription: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 20,
  },
});
