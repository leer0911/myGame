const getRandomInt = function(min, max) {
  var ratio = cc.random0To1();
  return min + Math.floor((max - min) * ratio);
};

cc.Class({
  extends: cc.Component,

  properties: {
    slotPrefab: {
      default: null,
      type: cc.Prefab
    },
    heroes: {
      default: [],
      type: cc.SpriteFrame
    }
  },
  onLoad() {
    this.init();
    window.heroes = this.heroes;
  },
  init() {
    let userData = cc.sys.localStorage.getItem('userData');
    if (!userData) {
      this.heroesNodes = [];
      for (let index = 0; index < 15; index++) {
        this.heroesNodes.push(0);
      }
      cc.sys.localStorage.setItem('userData', JSON.stringify(this.heroesNodes));
    } else {
      this.heroesNodes = JSON.parse(userData);
    }
    this.heroesNodes.forEach((num, index) => {
      let heroSlot = cc.instantiate(this.slotPrefab);
      this.node.addChild(heroSlot);
      heroSlot.getComponent(cc.Sprite).spriteFrame = this.heroes[num];
      heroSlot.name = `item-${index}`;
    });
  },
  addHeroSlot() {
    let canUpdate = true;
    this.heroesNodes = JSON.parse(cc.sys.localStorage.getItem('userData'));
    let type = Number(cc.sys.localStorage.getItem('heroType')) || 1;
    this.heroesNodes.forEach((hero, index) => {
      if (hero === 0 && canUpdate) {
        this.heroesNodes[index] = type;
        cc.sys.localStorage.setItem(
          'userData',
          JSON.stringify(this.heroesNodes)
        );
        canUpdate = false;
      }
    });
    this.updateHeroSlot();
  },
  updateHeroSlot() {
    let childs = this.node.children;
    childs.forEach((child, index) => {
      child.getComponent(cc.Sprite).spriteFrame = this.heroes[
        this.heroesNodes[index]
      ];
    });
  },
  clearAll() {
    this.heroesNodes.fill(0);
    cc.sys.localStorage.setItem('userData', JSON.stringify(this.heroesNodes));
    this.updateHeroSlot();
    // cc.sys.localStorage.removeItem('userData');
  }
});
