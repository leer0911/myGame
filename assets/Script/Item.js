cc.Class({
  extends: cc.Component,

  properties: {},

  // LIFE-CYCLE CALLBACKS:
  onLoad: function() {
    this.node.on('touchstart', this.touchStart, this);
  },
  // Methods:
  touchStart(event) {
    if (!this.node.getComponent(cc.Sprite).spriteFrame) {
      return;
    }
    if (this.node.disableDrag) {
      const RUNBOX = cc.find('Canvas/RunBox');
      this.node.opacity = 255;
      RUNBOX.getChildByName(this.node.name).destroy();
      this.node.disableDrag = false;
      return;
    }
    let scene = cc.director.getScene();
    let location = event.touch.getLocation();
    let { x, y } = location;
    this.copyNode = cc.instantiate(this.node);
    this.copyNode.parent = scene;
    this.copyNode.setPosition(x, y);
    this.node.opacity = 166;
    this.node.on('touchmove', this.touchMove, this);
    this.node.on('touchend', this.touchEnd, this);
    this.node.on('touchcancel', this.touchCancel, this);
  },
  touchMove(event) {
    let location = event.touch.getLocation();
    let { x, y } = location;
    this.copyNode.setPosition(x, y);
  },
  touchEnd() {
    this.offTouchEvent();
  },
  offTouchEvent() {
    this.node.opacity = 255;
    this.copyNode.destroy();
    this.copyNode = null;
    this.node.off('touchmove', this.touchMove, this);
    this.node.off('touchend', this.touchEnd, this);
    this.node.off('touchcancel', this.touchCancel, this);
  },
  dropInRunBox(event) {
    const RUNBOX = cc.find('Canvas/RunBox');
    let fromIndex = this.node.getSiblingIndex();
    let userData = JSON.parse(cc.sys.localStorage.getItem('userData'));

    if (
      cc.rectContainsPoint(
        RUNBOX.getBoundingBox(),
        RUNBOX.parent.convertToNodeSpaceAR(event.getLocation())
      )
    ) {
      let runItem = cc.instantiate(RUNBOX.children[0]);
      runItem.parent = RUNBOX;
      runItem.name = this.node.name;
      runItem.getComponent(cc.Sprite).spriteFrame = this.node.getComponent(
        cc.Sprite
      ).spriteFrame;
      // userData[fromIndex] = 0;
      // cc.sys.localStorage.setItem('userData', JSON.stringify(userData));
      // this.node.getComponent(cc.Sprite).spriteFrame = null;
      this.node.disableDrag = true;
      this.node.opacity = 166;
    }
  },
  changePackPosition(event) {
    let userData = JSON.parse(cc.sys.localStorage.getItem('userData'));
    let fromIndex = this.node.getSiblingIndex();
    let items = this.node.parent.children;

    items.forEach((item, toIndex) => {
      if (
        cc.rectContainsPoint(
          item.getBoundingBox(),
          this.node.parent.convertToNodeSpaceAR(event.getLocation())
        )
      ) {
        if (items[toIndex].opacity !== 255) {
          return;
        }
        if (userData[toIndex] === userData[fromIndex]) {
          if (window.heroes[userData[toIndex] + 1]) {
            userData[toIndex] = userData[toIndex] + 1;
            userData[fromIndex] = 0;
          } else {
            const CANVAS = cc.find('Canvas');
            let node = CANVAS.children[CANVAS.children.length - 1];
            node.active = true;
            setTimeout(() => {
              node.active = false;
            }, 1000);
          }
        } else {
          userData = this.swapArray(userData, fromIndex, toIndex);
        }
        this.updateHeroSlot(userData);
        cc.sys.localStorage.setItem('userData', JSON.stringify(userData));
      }
    });
  },
  touchCancel(event) {
    this.offTouchEvent();
    this.dropInRunBox(event);
    this.changePackPosition(event);
  },
  updateHeroSlot(userData) {
    let childs = this.node.parent.children;
    childs.forEach((child, index) => {
      child.getComponent(cc.Sprite).spriteFrame =
        window.heroes[userData[index]];
    });
  },
  swapArray(arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
  }
});
