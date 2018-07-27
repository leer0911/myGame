cc.Class({
  extends: cc.Component,

  properties: {},
  onLoad() {
    this.heroes = window.heroes;
  },

  add() {
    let BackPackUI = cc.find('Canvas/BackPackUI');
    let type = this.node.getSiblingIndex() + 1;
    BackPackUI.active = false;
    cc.sys.localStorage.setItem('heroType', type);
    let canUpdate = true;
    this.heroesNodes = JSON.parse(cc.sys.localStorage.getItem('userData'));
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
    let childs = cc.find('Canvas/HomeUI/container').children;
    childs.forEach((child, index) => {
      child.getComponent(cc.Sprite).spriteFrame = this.heroes[
        this.heroesNodes[index]
      ];
    });
  }
});
