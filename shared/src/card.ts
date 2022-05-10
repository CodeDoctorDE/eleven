export type CardColor = 'red' | 'yellow' | 'green' | 'blue';
export type CardNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;

export type Card = {
    color: CardColor;
    number: CardNumber;
}
export const isEqualCard = (a: Card, b: Card): boolean => a.color === b.color && a.number === b.number;

export class CardCollection {
    constructor(public redCollection: number[], public yellowCollection: number[], public greenCollection: number[], public blueCollection: number[]) { }

    public getCollection(color: CardColor) {
        switch (color) {
            case 'red':
                return this.redCollection;
            case 'yellow':
                return this.yellowCollection;
            case 'green':
                return this.greenCollection;
            case 'blue':
                return this.blueCollection;
        }
    }
}
export const getAllCards = () : Card[] => {
    const cards: Card[] = [];
    for (const color of ['red', 'yellow', 'green', 'blue']) {
        for (const number of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) {
            cards.push({color: color as CardColor, number: number as CardNumber});
        }
    }
    return cards;
}