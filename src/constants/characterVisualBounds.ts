import { IListCharacter } from "./listCharacter";

/**
 * Khoảng trong suốt hai bên trong ô sprite (cùng hệ với --width 375px).
 * Dùng để clamp vị trí theo “thân” nhìn thấy, không theo cả khung 375px.
 */
export const CHARACTER_SPRITE_INSET: Record<
  IListCharacter,
  { left: number; right: number }
> = {
  [IListCharacter.marco]: { left: 96, right: 96 },
  [IListCharacter.enel]: { left: 88, right: 88 },
};
