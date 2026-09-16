export interface ItemDefinition {
  id: string;
  name: string;
}

export const ITEM_DEFINITIONS: Record<string, ItemDefinition> = {
  blueberries: { id: "blueberries", name: "Blåbär" },
  chanterelle: { id: "chanterelle", name: "Kantareller" },
  lingonberries: { id: "lingonberries", name: "Lingon" },
};
