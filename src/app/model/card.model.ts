export enum CardPack {
  Default = 'default',
}

export interface Card {
  id: string
  icon: string | null
  tip: string | null
  value: number
  pack: CardPack
  position: number
}
