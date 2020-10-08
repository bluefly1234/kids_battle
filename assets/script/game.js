const util = require('./util/util');

cc.Class({
    extends: cc.Component,

    properties: {
        // 当前玩家
        playerRole: {
            default: null,
            type: sp.Skeleton,
        },
        playerAnimation: {
            default: {},
            type: Object,
            visible: false
        },
        playerValue: {
            default: {},
            type: Object,
            visible: false
        },
        playerUserInfo: {
            default: {},
            type: Object,
            visible: false
        },
        playerHealthText: {
            default: null,
            type: cc.Label
        },

        // 对手
        opponentRole: {
            default: null,
            type: sp.Skeleton,
        },
        opponentAnimation: {
            default: {},
            type: Object,
            visible: false
        },
        opponentValue: {
            default: {},
            type: Object,
            visible: false
        },
        opponentUserInfo: {
            default: {},
            type: Object,
            visible: false
        },
        opponentHealthText: {
            default: null,
            type: cc.Label
        },

        // 其它
        rolesLoaded: {
            default: {},
            type: Object,
            visible: false
        },
        battleText: {
            default: null,
            type: cc.Label
        },
        carrier: {
            default: {},
            type: Object,
            visible: false
        }
    },

    onLoad () {
        // 接受到点击开始游戏事件
        this.node.on('onStartGame', this.onLoadRole.bind(this));

        // 监听游戏角色加载完成
        this.node.on('onRoleLoaded', this.onRoleLoaded.bind(this));
    },

    start () {
        // 格式化数据
        this.initDataFormat();
        // 随机人物属性
        this.initRoleValue();
    },

    // 格式化数据
    initDataFormat() {
        // 动画
        this.playerAnimation = {
            attacks: [], // 攻击动作
            skills: [],  // 技能
            hit: 'hit', // 被打
            stun: 'stun',   // 被击晕
            die: 'die', // 死亡
            default: 'default'  // 默认动作
        };
        this.opponentAnimation = {
            attacks: [], // 攻击动作
            skills: [],  // 技能
            hit: 'hit', // 被打
            stun: 'stun',   // 被击晕
            die: 'die', // 死亡
            default: 'default'  // 默认动作
        };
        // 玩家属性
        this.playerValue = {
            characteristic: {
                strength: 0, // 体力值
                agilityA: 0, // 敏捷值
                power: 0, // 力量值
                luck: 0, // 运气值
                charm: 0, //  魅力
            },
            magic: {
                indigenous: {
                    isHave: false,
                    isInitTrigger: false
                },
                octopus: {
                    isHave: false,
                    isInitTrigger: false
                },
            },
            healthValue: {
                max: 0,
                cur: 0
            },
            otherValue: {
                // 默认属性点
                defaultValueNumber: 15,
                // 幸运数字
                luckyNumber: 0,
                // 等级
                level: 0,
            }
        };
        this.opponentValue = {
            characteristic: {
                strength: 0, // 体力值
                agilityA: 0, // 敏捷值
                power: 0, // 力量值
                luck: 0, // 运气值
                charm: 0, //  魅力
            },
            magic: {
                indigenous: {
                    isHave: false,
                    isInitTrigger: false
                },
                octopus: {
                    isHave: false,
                    isInitTrigger: false
                },
            },
            healthValue: {
                max: 0,
                cur: 0
            },
            otherValue: {
                // 默认属性点
                defaultValueNumber: 15,
                // 幸运数字
                luckyNumber: 0,
                // 等级
                level: 0,
            }
        };
        // 用户信息
        this.playerUserInfo = {
            avatar: '',
            nickname: '',
            openId: ''
        };
        this.opponentUserInfo = {
            avatar: '',
            nickname: '',
            openId: ''
        };
        this.carrier = {
            curAttackPower: 0
        };
        // 加载完成
        this.rolesLoaded = {
            player: false,
            opponent: false
        };
    },

    // 重制游戏
    remarkGame() {},

    // 加载游戏角色
    onLoadRole(event) {
        this.setPlayerRole(event.detail.playerSpine);

        this.setOpponentRole(event.detail.opponentSpine);
    },

    setPlayerRole(spine) {
        cc.resources.load(`spine/${spine.spineName}/${spine.spineName}`, sp.SkeletonData, (err, res) => {
            // 赋值
            this.playerRole.SkeletonData = res;
            this.playerRole.skeletonData = res;
            
            // 设置皮肤
            this.playerRole.setSkin(spine.spineSkin);

            // 设置默认动画
            this.playerRole.setAnimation(0,'default', true);

            // 设置动画
            this.setRoleAnimation('player');

            // 发送加载事件
            this.node.emit('onRoleLoaded', 'player');
        });
    },

    setOpponentRole(spine) {
        cc.resources.load(`spine/${spine.spineName}/${spine.spineName}`, sp.SkeletonData, (err, res) => {
            // 赋值
            this.opponentRole.SkeletonData = res;
            this.opponentRole.skeletonData = res;
            
            // 设置皮肤
            this.opponentRole.setSkin(spine.spineSkin);

            // 设置默认动画
            this.opponentRole.setAnimation(0,'default', true);

            // 设置动画
            this.setRoleAnimation('opponent');

            // 发送加载事件
            this.node.emit('onRoleLoaded', 'opponent');
        });
    },

    setRoleAnimation(role) {
        // 储存当前人物动画
        var roleAnimation = {
            attacks: [], // 攻击动作
            skills: [],  // 技能
            hit: 'hit', // 被打
            stun: 'stun',   // 被击晕
            die: 'die', // 死亡
            default: 'default'  // 默认动作
        };

        var animations = [];
        // 去掉 end 动作
        Object.keys(this[`${role}Role`].skeletonData.skeletonJson.animations).forEach(item => {
            item.includes('end') || animations.push(item);
        })
        // 分类
        animations.forEach(item => {
            item.includes('attack') && roleAnimation.attacks.push(item);
            item.includes('skill') && roleAnimation.skills.push(item);
        })

        this[`${role}Animation`] = roleAnimation;
    },

    onRoleLoaded(event) {
        this.rolesLoaded[event] = true;
        if(this.rolesLoaded.player && this.rolesLoaded.opponent) {
            this.onStartGame();
        }
    },

    bindSpineListener() {
        this.playerRole.setEndListener(playerAnimationEndListener);
        this.opponentRole.setEndListener(opponentAnimationEndListener);
    },

    initRoleValue() {
        this.getUserInfo();
        this.getRoleValue();
        this.setRoleHealth();
    },

    getUserInfo() {
        // 待补充接口

        // 渲染用户昵称与头像
    },

    getRoleValue() {
        // 随机两个用户的属性
        
        // 设置随机点数
        var playerValueNumber = this.playerValue.otherValue.defaultValueNumber + this.playerValue.otherValue.level;
        var opponentValueNumber = this.opponentValue.otherValue.defaultValueNumber + this.opponentValue.otherValue.level;

        // 获取点数列表
        var playerValueList = util.randomItemsNumber(Object.keys(this.playerValue.characteristic).length, playerValueNumber);
        var opponentValueList = util.randomItemsNumber(Object.keys(this.opponentValue.characteristic).length, opponentValueNumber);
        
        // 乱序属性
        playerValueList = util.shuffle(playerValueList);
        opponentValueList = util.shuffle(opponentValueList);

        // 设置属性
        Object.keys(this.playerValue.characteristic).forEach((item, index) => {
            this.playerValue.characteristic[item] = playerValueList[index];
        });

        Object.keys(this.opponentValue.characteristic).forEach((item, index) => {
            this.opponentValue.characteristic[item] = opponentValueList[index];
        });

        console.log('playerValue is :', this.playerValue);
        console.log('opponentValue is :', this.opponentValue);
    },

    getRoleSkill() {
        // 技能没有相应的接口，前端写死之后加
    },

    triggerPassiveMagic() {
        // 触发默认技能
    },

    setRoleHealth() {
        // 计算玩家血量
        this.playerValue.healthValue.max = 20 + this.playerValue.characteristic.strength * 5;
        this.playerValue.healthValue.cur = this.playerValue.healthValue.max;

        this.opponentValue.healthValue.max = 20 + this.opponentValue.characteristic.strength * 5;
        this.opponentValue.healthValue.cur = this.opponentValue.healthValue.max;
    },

    onStartGame() {
        this.initGameUI();
        this.startRoleAction();
    },

    // 初始化游戏 UI
    initGameUI() {
        // 暂时用文本代替一下吧
        this.battleText.string = '战斗开始';
        this.playerHealthText.string = `${this.playerValue.healthValue.cur} / ${this.playerValue.healthValue.max}`;
        this.opponentHealthText.string = `${this.opponentValue.healthValue.cur} / ${this.opponentValue.healthValue.cur}`;
    },

    startRoleAction() {
        // 获取谁先手
        var firstRole = Math.random() < 0.5 ? 'player' : 'opponent';

        // this[`${firstRole}Attack`]();
        this.playerAttack();
    },

    // 计算攻击力
    getAttackPower(curRole) {
        return this[`${curRole}Value`].characteristic.power;
    },

    // 计算伤害
    getHarm(curRole) {
        var harm = this.carrier.curAttackPower -  Math.floor(this[`${curRole}Value`].characteristic.strength * 0.5);
        // 设定最小伤害
        harm < 2 ? harm = 2 : 0 ;
        return harm;
    },

    // 判断是否暴击
    isCrit(curRole) {
        var standard = 20;
        return this[`${curRole}Value`].characteristic.charm > Math.random() * standard;
    },

    // 判断是否一击必杀
    isNirvana(curRole) {
        var standard = 100;
        return this[`${curRole}Value`].characteristic.charm > Math.random() * luck;
    },

    // 判断是否闪避
    isDodge(curRole) {
        var otherRole = curRole === 'player' ? 'opponent' : 'player';
        var standard = 50;
        return this[`${curRole}Value`].characteristic.agilityA - this[`${otherRole}Value`].characteristic.agilityA > Math.random() * standard;
    },

    // 判断是否反击
    isCounterattack(curRole) {
        var otherRole = curRole === 'player' ? 'opponent' : 'player';
        var standard = 150;
        return this[`${curRole}Value`].characteristic.luck - this[`${otherRole}Value`].characteristic.luck > Math.random() * standard;
    },

    // 判断是否死亡
    isDeath (curRole) {
        return this[`${curRole}Value`].healthValue.cur <= 0;
    },

    // 设置战斗文本
    setBattleText(curRole, proposal) {
        const proposals = {
            start: '战斗开始',
            attack: '玩家1对玩家2发动攻击',
            crit: ['玩家1对玩家2发动暴烈攻击'],
            nirvana: ['玩家1对玩家2发起全力一击'],
            defense: '玩家1对玩家2造成了2点伤害'
            dodge: ['玩家2闪避了攻击'],
            counterattack: ['玩家2发起了反击'],
            over: '游戏结束'
        };
        // 如果是数组则随机一个

        // 如果是字符串则直接设置
        this.battleText.string = text;
    },

    // 设置动画
    playAnimation(curRole, animation) {
        switch(animation) {
            case 'attack':
                // 从攻击动画中随机一个
                var attackAnimation = this[`${curRole}Animation`].attacks[util.randomOneNumber(0,this[`${curRole}Animation`].attacks.length-1)];
                this[`${curRole}Role`].setAnimation(attackAnimation);
                this[`${curRole}Role`].setAnimation(`${attackAnimation}end`);
                this[`${curRole}Role`].setAnimation('default');
                break;
            case 'skill':
                var skillAnimation = this[`${curRole}Animation`].skills.length > 0 ? 
                    this[`${curRole}Animation`].skills[util.randomOneNumber(0,this[`${curRole}Animation`].skills.length-1)] : 
                    this[`${curRole}Animation`].attacks[util.randomOneNumber(0,this[`${curRole}Animation`].attacks.length-1)];
                this[`${curRole}Role`].setAnimation(attackAnimation);
                this[`${curRole}Role`].setAnimation(`${attackAnimation}end`);
                this[`${curRole}Role`].setAnimation('default');
                break;
            case 'die': 
                break;
        }
    },

    // 动画完成函数
    playerAnimationEndListener(event) {
        console.log(event)
    },

    opponentAnimationEndListener(event) {
        console.log(event)
    },

    // 玩家攻击
    playerAttack() {
        var curRole = 'player';
        var proposals = 'attack'
        var curAttackPower = this.getAttackPower(curRole);
        var isNirvana = this.isNirvana(curRole);
        var isCrit =  this.isCrit(curRole);
        // 计算伤害
        curAttackPower = isNirvana ? curAttackPower * 10 : isCrit ? curAttackPower * 2 : curAttackPower;

        proposals = isNirvana ? 'nirvana' : isCrit ? 'crit' : 'attack';

        // 播放攻击动画
        this.playAnimation(curRole, isNirvana || isCrit ? 'skill' : 'attack');
        this.setBattleText(curRole, proposals);
    },

    playerDefense() {

    },

    opponentAttack() {

    },

    opponentDefense() {

    },

    gameOver() {

    },

});
