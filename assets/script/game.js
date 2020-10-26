/*jshint esversion: 6 */
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
            nickname: '玩家',
            openId: ''
        };
        this.opponentUserInfo = {
            avatar: '',
            nickname: '敌人',
            openId: ''
        };
        this.carrier = {
            curAttackPower: 0,
            isCrit: false,
            isNirvana: false,
            isDodge: false,
            isCounterattack: false,
            isDeath: false
        };
        // 加载完成
        this.rolesLoaded = {
            player: false,
            opponent: false
        };
    },

    remarkCarrier({
        curAttackPower = 0,
        isCrit = false,
        isNirvana = false,
        isDodge = false,
        isCounterattack = false,
        isDeath = false
    }) {
        this.carrier.curAttackPower = curAttackPower;
        this.carrier.isCrit = isCrit;
        this.carrier.isNirvana = isNirvana;
        this.carrier.isDodge = isDodge;
        this.carrier.isCounterattack = isCounterattack;
        this.carrier.isDeath = isDeath;
    },

    // 重制游戏
    remarkGame() {

    },

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
        const roleAnimation = {
            attacks: [], // 攻击动作
            skills: [],  // 技能
            hit: 'hit', // 被打
            stun: 'stun',   // 被击晕
            die: 'die', // 死亡
            default: 'default'  // 默认动作
        };

        const animations = [];
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
            this.bindSpineListener();
            this.onStartGame();
        }
    },

    bindSpineListener() {
        this.playerRole.setEndListener((event)=>{this.playerAnimationEndListener(event)});
        this.opponentRole.setEndListener((event)=>{this.opponentAnimationEndListener(event)});
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

    // 随机两个用户的属性
    getRoleValue() {
        // 设置随机点数
        const playerValueNumber = this.playerValue.otherValue.defaultValueNumber + this.playerValue.otherValue.level;
        const opponentValueNumber = this.opponentValue.otherValue.defaultValueNumber + this.opponentValue.otherValue.level;

        // 获取点数列表
        let playerValueList = util.randomItemsNumber(Object.keys(this.playerValue.characteristic).length, playerValueNumber);
        let opponentValueList = util.randomItemsNumber(Object.keys(this.opponentValue.characteristic).length, opponentValueNumber);
        
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
        // 技能没有相应的接口, 前端写死之后加
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
        this.opponentHealthText.string = `${this.opponentValue.healthValue.cur} / ${this.opponentValue.healthValue.max}`;
    },

    startRoleAction() {
        // 获取谁先手
        const firstRole = Math.random() < 0.5 ? 'player' : 'opponent';

        this[`${firstRole}Attack`]();
    },

    // 计算攻击力
    getAttackPower(curRole) {
        const standard = 1.25;
        return this[`${curRole}Value`].characteristic.power * standard;
    },

    // 计算伤害
    getHarm(curRole) {
        let harm = this.carrier.curAttackPower -  Math.floor(this[`${curRole}Value`].characteristic.strength * 0.5);
        // 设定最小伤害
        harm < 2 ? harm = 2 : 0 ;
        return harm;
    },

    // 判断是否暴击
    isCrit(curRole) {
        const standard = 20;
        return this[`${curRole}Value`].characteristic.charm > Math.random() * standard;
    },

    // 判断是否一击必杀
    isNirvana(curRole) {
        const standard = 100;
        return this[`${curRole}Value`].characteristic.charm > Math.random() * standard;
    },

    // 判断是否闪避
    isDodge(curRole) {
        const otherRole = curRole === 'player' ? 'opponent' : 'player';
        const standard = 50;
        return this[`${curRole}Value`].characteristic.agilityA - this[`${otherRole}Value`].characteristic.agilityA > Math.random() * standard;
    },

    // 判断是否反击
    isCounterattack(curRole) {
        const otherRole = curRole === 'player' ? 'opponent' : 'player';
        const standard = 150;
        return this[`${curRole}Value`].characteristic.luck - this[`${otherRole}Value`].characteristic.luck > Math.random() * standard;
    },

    // 判断是否死亡
    isDeath (curRole) {
        return this[`${curRole}Value`].healthValue.cur <= 0;
    },

    // 设置战斗文本
    setBattleText(curRole, proposal, curHarm) {
        const otherRole = curRole === 'player' ? 'opponent' : 'player';
        const curRoleName = this[`${curRole}UserInfo`].nickname;
        const otherRoleName = this[`${otherRole}UserInfo`].nickname;
        let battleText = '';
        const proposals = {
            start: '战斗开始',
            attack: `${curRoleName}对${otherRoleName}发动了进攻`,
            crit: [`${curRoleName}对${otherRoleName}发动了猛烈的进攻`],
            nirvana: [`${curRoleName}对${otherRoleName}发起全力一击`],
            defense: `${otherRoleName}对${curRoleName}造成了${curHarm}点伤害`,
            dodge: [`${otherRoleName}闪避了攻击`],
            counterattack: [`${otherRoleName}发起了反击`],
            over: '游戏结束'
        };
        // 如果是数组则随机一个
        if(Array.isArray(proposals[proposal])){
            battleText = proposals[proposal][util.randomOneNumber(0,proposals[proposal].length-1)];
        }else{
            battleText = this.battleText.string = proposals[proposal];
        }
        console.log('battleText is :', battleText);
        this.battleText.string = battleText;
    },

    // 设置动画
    playAnimation(curRole, animation) {
        const otherRole = curRole === 'player' ? 'opponent' : 'player';
        switch(animation) {
            case 'attack':
                // 从攻击动画中随机一个
                const attackAnimation = this[`${curRole}Animation`].attacks.length > 0 ? 
                    this[`${curRole}Animation`].attacks[util.randomOneNumber(0,this[`${curRole}Animation`].attacks.length-1)] : 
                    this[`${curRole}Animation`].skills[util.randomOneNumber(0,this[`${curRole}Animation`].skills.length-1)];
                this[`${curRole}Role`].setAnimation(0, attackAnimation, false);
                this[`${curRole}Role`].addAnimation(0, `${attackAnimation}end`, false);
                this[`${curRole}Role`].addAnimation(0, 'default', true);
                break;
            case 'skill':
                const skillAnimation = this[`${curRole}Animation`].skills.length > 0 ? 
                    this[`${curRole}Animation`].skills[util.randomOneNumber(0,this[`${curRole}Animation`].skills.length-1)] : 
                    this[`${curRole}Animation`].attacks[util.randomOneNumber(0,this[`${curRole}Animation`].attacks.length-1)];
                this[`${curRole}Role`].setAnimation(0, skillAnimation, false);
                this[`${curRole}Role`].addAnimation(0, `${skillAnimation}end`, false);
                this[`${curRole}Role`].addAnimation(0, 'default', true);
                break;
            case 'hit':
                this[`${curRole}Role`].setAnimation(0, 'hit', false);
                this[`${curRole}Role`].addAnimation(0, 'default', true);
                break;
            case 'stun':
                this[`${curRole}Role`].setAnimation(0, 'stun', false);
                this[`${curRole}Role`].addAnimation(0, 'default', true);
                break;
            case 'die':
                this[`${curRole}Role`].setAnimation(0, 'die', false);
                break;
        }
    },

    // 动画完成函数
    playerAnimationEndListener(event) {
        const animationName = event['animation']['name'];
        if (animationName.includes('end') || animationName.includes('default')) { return ''; }
        if (animationName.includes('attack') || animationName.includes('skill')) {
            this.opponentDefense();
        }
        if (animationName.includes('hit') || animationName.includes('stun')) {
            this.playerAttack();
        }
        if (animationName.includes('die')) {
            this.gameOver();
        }
    },

    opponentAnimationEndListener(event) {
        const animationName = event['animation']['name'];
        if (animationName.includes('end') || animationName.includes('default')) { return ''; }
        if (animationName.includes('attack') || animationName.includes('skill')) {
            this.playerDefense();
        }
        if (animationName.includes('hit') || animationName.includes('stun')) {
            this.opponentAttack();
        }
        if (animationName.includes('die')) {
            this.gameOver();
        }
    },

    // 玩家攻击
    playerAttack() {
        const curRole = 'player';
        let proposal = 'hit';
        let curAttackPower = this.getAttackPower(curRole);
        const isNirvana = this.isNirvana(curRole);
        const isCrit =  this.isCrit(curRole);
        // 计算伤害
        curAttackPower = isNirvana ? curAttackPower * 10 : isCrit ? curAttackPower * 2 : curAttackPower;

        proposal = isNirvana ? 'nirvana' : isCrit ? 'crit' : 'attack';

        this.remarkCarrier({curAttackPower, isCrit, isNirvana});

        // 播放攻击动画
        this.playAnimation(curRole, isNirvana || isCrit ? 'skill' : 'attack');
        this.setBattleText(curRole, proposal);
    },

    playerDefense() {
        const curRole = 'player';
        let proposal = 'defense';
        const curAttackPower = this.carrier.curAttackPower;
        const isDodge = this.isDodge(curRole);
        const isCounterattack =  this.isCounterattack(curRole);

        let curHarm = Math.floor(curAttackPower - this.playerValue.characteristic.strength * 0.5);

        this.remarkCarrier({isDodge, isCounterattack});

        if(curHarm < 2) curHarm = 2;

        if(!isDodge){
            // 没有闪避
            if(isCounterattack){
                proposal = 'counterattack';
                // 反击
                this.playAnimation(curRole, 'attack');
                this.setBattleText(curRole, proposal);
            }else{
                this.playerValue.healthValue.cur -= curHarm;
                if( this.playerValue.healthValue.cur < 0) this.playerValue.healthValue.cur = 0;
                this.playerHealthText.string = `${this.playerValue.healthValue.cur} / ${this.playerValue.healthValue.max}`;

                if(this.isDeath(curRole)) {
                    this.playAnimation(curRole, 'die');
                }else{
                    // 播放防御
                    this.playAnimation(curRole, this.carrier.isCrit || this.carrier.isNirvana ? 'stun' : 'hit');
                    this.setBattleText(curRole, proposal, curHarm);
                }
            }
        }else{
            // 闪避成功
            proposal = 'dodge';
            this.playAnimation(curRole, 'hit');
            this.setBattleText(curRole, proposal);
        }        
    },

    opponentAttack() {
        const curRole = 'opponent';
        let proposal = 'attack'
        let curAttackPower = this.getAttackPower(curRole);
        const isNirvana = this.isNirvana(curRole);
        const isCrit =  this.isCrit(curRole);
        // 计算伤害
        curAttackPower = isNirvana ? curAttackPower * 10 : isCrit ? curAttackPower * 2 : curAttackPower;

        proposal = isNirvana ? 'nirvana' : isCrit ? 'crit' : 'attack';

        this.remarkCarrier({curAttackPower, isCrit, isNirvana});

        // 播放攻击动画
        this.playAnimation(curRole, isNirvana || isCrit ? 'skill' : 'attack');
        this.setBattleText(curRole, proposal);
    },

    opponentDefense() {
        const curRole = 'opponent';
        const proposal = 'defense';
        const curAttackPower = this.carrier.curAttackPower;
        const isDodge = this.isDodge(curRole);
        const isCounterattack =  this.isCounterattack(curRole);

        let curHarm = Math.floor(curAttackPower - this.playerValue.characteristic.strength * 0.5);

        this.remarkCarrier({isDodge, isCounterattack});

        if(curHarm < 2) curHarm = 2;

        if(!isDodge){
            // 没有闪避
            if(isCounterattack){
                // 反击
                this.playAnimation(curRole, 'attack');
                this.setBattleText(curRole, proposal);
            }else{
                this.opponentValue.healthValue.cur -= curHarm;
                if( this.opponentValue.healthValue.cur < 0) this.opponentValue.healthValue.cur = 0;
                this.opponentHealthText.string = `${this.opponentValue.healthValue.cur} / ${this.opponentValue.healthValue.max}`;

                if(this.isDeath(curRole)) {
                    this.playAnimation(curRole, 'die');
                }else{
                    // 播放防御
                    this.playAnimation(curRole, this.carrier.isCrit || this.carrier.isNirvana ? 'stun' : 'hit');
                    this.setBattleText(curRole, proposal, curHarm);
                }
            }
        }else{
            // 闪避成功
            this.playAnimation(curRole, 'hit');
            this.setBattleText(curRole, proposal);
        }
    },

    gameOver() {
        console.log('游戏结束');
    },

});
