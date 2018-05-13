import { expect } from 'chai';
import { Item, GildedRose } from '../app/gilded-rose';

describe('Gilded Rose', function () {
    describe('class Item inmutable', () => {
        const item = new Item('foo', 10, 10);
        const properties = Object.keys(item);
        const methods = Object.keys(Item.prototype);
        it('should there 3 properties', () => {
            expect(properties.length).to.equal(3);
        })

        it('should the first property is name', ()=> {
            expect(properties[0]).to.equal('name');
        })

        it('sould the second property is sellIn', ()=> {
            expect(properties[1]).to.equal('sellIn');
        })

        it('sould the third property is quality', ()=> {
            expect(properties[2]).to.equal('quality');
        })

        it("shouldn't there any method", () => {
            expect(methods.length).to.equal(0);
        })
    })
    describe('any items', () => {
        describe('should check all Items have a sellIn attribute', () => {
            const itemMock1 = [
                new Item('foo', 10, 10)
            ];
            it('should discardconst a null item', () => {
                const ItemWithNull = [
                    ...itemMock1, null
                ];
                const gildedRose = new GildedRose(ItemWithNull);
                const items = gildedRose.updateQuality();
                expect(items.length).to.equal(1);
            })

            it('should discardconst a null quality', () => {
                const ItemWithNull = [
                    ...itemMock1, { name: 'foo2', sellIn: 1, quality: null }
                ];
                const gildedRose = new GildedRose(ItemWithNull);
                const items = gildedRose.updateQuality();
                expect(items.length).to.equal(1);
            })

            it('should discardconst a null sellIn', () => {
                const ItemWithNull = [
                    ...itemMock1, { name: 'foo2', sellIn: null, quality: 1 }
                ];
                const gildedRose = new GildedRose(ItemWithNull);
                const items = gildedRose.updateQuality();
                expect(items.length).to.equal(1);
            })
        });

        it('should lower both values for every item by the end of the day', () => {
            const itemMock1 = [
                new Item('foo', 10, 10)
            ];
            const gildedRose = new GildedRose(itemMock1);
            const items = gildedRose.updateQuality();
            expect(items[0].quality).to.equal(9);
            expect(items[0].sellIn).to.equal(9);
        });



        it('should degrade quality twice as fast, once the sell by date has passed', () => {
            const initalNegativeSellIns = [0, -1, -2];
            initalNegativeSellIns.map(sellIn => {
                const itemMock1 = [
                    new Item('foo1', sellIn, 10)
                ];
                const gildedRose = new GildedRose(itemMock1);
                const items = gildedRose.updateQuality();
                expect(items[0].quality).to.equal(10 - 1 - 1);
                expect(items[0].sellIn).to.equal(sellIn - 1);
            });
        });

        it('should never negative a negative quality', () => {
            const initalQuality = [1, 0 - 1];
            initalQuality.map(quality => {
                const itemMock1 = [
                    new Item('foo1', 10, quality)
                ];
                const gildedRose = new GildedRose(itemMock1);
                const items = gildedRose.updateQuality();
                expect(items[0].quality).to.equal(0);
            })
        });


        it('should never have a quality more than 50', () => {
            const initalQuality = [51, 52];
            initalQuality.map(quality => {
                const itemMock1 = [
                    new Item('foo1', 10, quality)
                ];
                const gildedRose = new GildedRose(itemMock1);
                const items = gildedRose.updateQuality();
                expect(items[0].quality).to.equal(50);
            })
        });
    });

    describe('Age Bried special case', () => {
        it('should increased quality with item "Aged Brie"', () => {
            const itemMock1 = [
                new Item('Aged Brie', 10, 1)
            ];
            const gildedRose = new GildedRose(itemMock1);
            const items = gildedRose.updateQuality();
            expect(items[0].quality).to.equal(2);
        });

        it('should increased quality twice by date has passed', () => {
            const itemMock1 = [
                new Item('Aged Brie', 0, 5)
            ];
            const gildedRose = new GildedRose(itemMock1);
            const items = gildedRose.updateQuality();
            expect(items[0].quality).to.equal(5 + 1 + 1);
        });
    });

    describe('Backstage special case', () => {
        it('increases by 1 when there are more than 10 days', () => {
            const itemMock1 = [
                new Item('Backstage passes to a TAFKAL80ETC concert', 11, 40)
            ];
            const gildedRose = new GildedRose(itemMock1);
            const items = gildedRose.updateQuality();
            expect(items[0].quality).to.equal(41);
            expect(items[0].sellIn).to.equal(10);
        })

        it('increases by 2 when there are 10 days or less', () => {
            const days = [10, 9, 8, 7, 6];
            days.map(day => {
                const itemMock1 = [
                    new Item('Backstage passes to a TAFKAL80ETC concert', day, 40)
                ];
                const gildedRose = new GildedRose(itemMock1);
                const items = gildedRose.updateQuality();
                expect(items[0].quality).to.equal(40 + 1 + 1);
                expect(items[0].sellIn).to.equal(day - 1);
            })
        })

        it('increased 3 when there are 5 days or less', () => {
            const days = [5, 4, 3, 2, 1];
            days.map(day => {
                const itemMock1 = [
                    new Item('Backstage passes to a TAFKAL80ETC concert', day, 40)
                ];
                const gildedRose = new GildedRose(itemMock1);
                const items = gildedRose.updateQuality();
                expect(items[0].quality).to.equal(40 + 1 + 1 + 1);
                expect(items[0].sellIn).to.equal(day - 1);
            })
        })

        it('drop to zero after the concert', () => {
            const itemMock1 = [
                new Item('Backstage passes to a TAFKAL80ETC concert', 0, 40)
            ];
            const gildedRose = new GildedRose(itemMock1);
            const items = gildedRose.updateQuality();
            expect(items[0].quality).to.equal(0);
        })
    });

    describe('Conjured', () => {
        it('degrade quality twice as fast', () => {
            const itemMock1 = [
                new Item('Conjured', 10, 10)
            ];
            const gildedRose = new GildedRose(itemMock1);
            const items = gildedRose.updateQuality();
            expect(items[0].quality).to.equal(8);
            expect(items[0].sellIn).to.equal(9);
        })
    })

});

describe('Sulfuras special case', () => {
    it('should quality never down', () => {
        const itemMock1 = [
            new Item('Sulfuras, Hand of Ragnaros', 10, 40)
        ];
        const gildedRose = new GildedRose(itemMock1);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(80);
    });

    it('should always have quality equals 80', () => {
        const itemMock1 = [
            new Item('Sulfuras, Hand of Ragnaros', 10, 80)
        ];
        const gildedRose = new GildedRose(itemMock1);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(80);
    });
})
