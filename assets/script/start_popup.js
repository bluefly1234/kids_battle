const util = require('./util/util');

cc.Class({
    extends: cc.Component,

    properties: {
        randomBtn: {
            default: null,
            type: cc.Node
        },
        startBtn: {
            default: null,
            type: cc.Node
        },
        playerSpine: {
            default: null,
            type: sp.Skeleton,
        },
        playerAnimation: {
            default: null,
            type: Object
        }
    },

    start () {
        // 获取玩家皮肤
        this.getPlayerSpine();

        // 获取对手皮肤
        this.getOpponentSpine();
    },

    clickRandomBtn() {
       this.getPlayerSpine(); 
    },

    clickStartBtn() {
        // 隐藏当前节点
        this.node.active = false;
        // 触发开始游戏事件
        var onStartGame = new cc.Event.EventCustom('onStartGame', true);
        // 携带当前 spine name 与 spine skin
        onStartGame.setUserData({
            playerSpine: this.playerSpineData,
            opponentSpine: this.opponentSpine
        });
        this.node.dispatchEvent(onStartGame);
    },

    getPlayerSpine() {
        var spineName = util.getFileName()[util.randomOneNumber(0,util.getFileName().length-1)];
        cc.resources.load(`spine/${spineName}/${spineName}`, sp.SkeletonData, (err, res) => {
            // 赋值
            this.playerSpine.SkeletonData = res;
            this.playerSpine.skeletonData = res;
            
            // 获取皮肤
            var playerSkin = this.getPlayerSkin(res.skeletonJson.skins);

            // 设置皮肤
            this.playerSpine.setSkin(playerSkin);

            // 设置默认动画
            this.playerSpine.setAnimation(0,'default', true);

            // 返回参数
            this.playerSpineData = {
                spineName: spineName,
                spineSkin: playerSkin
            };
        });
    },

    getOpponentSpine() {
        var spineName = util.getFileName()[util.randomOneNumber(0,util.getFileName().length-1)];
        cc.resources.load(`spine/${spineName}/${spineName}`, sp.SkeletonData, (err, res) => {
            // 获取皮肤
            var playerSkin = this.getPlayerSkin(res.skeletonJson.skins);

            // 返回参数
            this.opponentSpine = {
                spineName: spineName,
                spineSkin: playerSkin
            };
        });
    },

    getPlayerSkin(spineSkins) {
        var skins = [];
        Object.keys(spineSkins).forEach(item => {
            item.includes('skin') && skins.push(item);
        });
        var index = util.randomOneNumber(0, skins.length-1);

        return skins[index];
    },
});
