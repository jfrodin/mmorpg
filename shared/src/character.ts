import type { AppearanceDescriptor } from "./appearance";

export interface Character {
  id: string;
  accountId: string;
  name: string;
  x: number;
  y: number;
  appearance: AppearanceDescriptor;
}
