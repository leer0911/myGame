cc.Class({
  extends: cc.Component,

  properties: {
    slotPrefab: {
      default: null,
      type: cc.Prefab
    },
    scrollView: {
      default: null,
      type: cc.ScrollView
    }
  },

  init: function() {
    this.heroSlots = [];
    for (let i = 1; i < window.heroes.length; ++i) {
      let heroSlot = this.addHeroSlot(i);
      this.heroSlots.push(heroSlot);
    }
  },

  addHeroSlot(index) {
    let heroSlot = cc.instantiate(this.slotPrefab);
    heroSlot.children[0].getComponent(cc.Sprite).spriteFrame = window.heroes[index];
    this.scrollView.content.addChild(heroSlot);
  },

  show: function() {
    this.node.active = true;
    this.node.emit('fade-in');
  },

  hide: function() {
    this.node.emit('fade-out');
  }
});
