module.exports = {
    randomOneNumber : function (min, max) {
        var randomFun = Math.random;
        var number = Math.floor(randomFun() * (max - min) + min);
        return number;
    },

    // 随机 X 个数，合计为 Y
    randomItemsNumber : function (items, total) {
        var result = [];
        if(items < 1) return [];
        // 剩余值
        var last = total;
        for (var i = 0; i < items; i++) {
            var curNumber = this.randomOneNumber(1, last - (items - i));
            if ( i === items -1 ) {
                result.push(last);
            }else {
                // 最小值为1 ，最大值为 当前剩余值，减去 剩余 项目数
                result.push( curNumber );
                last -= curNumber;
            }
        }
        return result;
    },

    // 将 0 ～ items 的数字打乱排序
    shuffle : function (list) {
        return list.sort(() => Math.random() - 0.5);
    },

    getFileName: function() {
        // 临时手写一下
        return  [
            'bandit',
            'boss_lich',
            'boss_wyvern',
            'cyclops',
            'death_knight',
            'ent',
            'evil_dragon',
            'ghost',
            'golem',
            'hutu_chief',
            'hutu_shaman',
            'liger',
            'lizard_king',
            'lizard_man_wizard',
            'lizard_pat_warrior',
            'lizard_warrior',
            'mummy',
            'mushrooms',
            'ogre',
            'ogre_king',
            'orc_warrior',
            'pagan',
            'samurai',
            'skeleton',
            'spider',
            'tauren',
            'troll',
            'wolf'
        ];
    }
};