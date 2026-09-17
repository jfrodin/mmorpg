export interface SkillDefinition {
  id: string;
  name: string;
}

export const SKILL_DEFINITIONS: Record<string, SkillDefinition> = {
  foraging: { id: "foraging", name: "Insamling" },
};
