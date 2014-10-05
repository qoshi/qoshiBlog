// 'use strict'
var zt = {
    resultPool : [],
    pool : [
        {
            name : "金谷园",
            description : "饺子^^"
        },
        {
            name : "陕西面条",
            description : "好大一碗哇"
        },
        {
            name : "第一家米线",
            description : "味道不错"
        },
        {
            name : "桂林米粉",
            description : "湿兄比较爱吃笋尖"
        },
        {
            name : "北门烤鱼",
            description : "盖饭gogogo"
        },
        {
            name : "教工餐厅",
            description : "山西肉酱面"
        },
        {
            name : "中门牛肉面",
            description : "肿么都是面T_T"
        },
        {
            name : "羊汤",
            description : "湿兄悄悄加上的"
        }
    ],
};

function createDiv(obj,ind) {
    var val = -1;
    var $main = $('<div class="foodP panel panel-success"><div class="panel-heading"><h3 class="panel-title">'+obj.name+'<span  class="close pull-right glyphicon glyphicon-remove-circle"></span></h3></div><div class="panel-body">'+obj.description+'</div></div>');
    var $container = $("#result");
    if ( zt.resultPool.length == 3 ) {
        val = zt.resultPool[0].index;
        zt.resultPool.shift().dom.remove();
    }
    $container.append($main);
    zt.resultPool.push({
    dom : $main,
    index : ind
    });
    return val;
}

function getOne(){
    return parseInt(Math.random()*zt.pool.length);
}

function findSomeFood() {
    var times = 0;
    var visited = [];
    var i,iterator;
    for ( i = 0; i < zt.pool.length; i++ ) {
        visited.push(0);
    }
    iterator = setInterval(function(){
        var $process = $("#processBar");
        var t = getOne();
        var result,$process;
        times += 1;
        if ( times == 30 ) {
            clearInterval(iterator);
        }
        while( visited[t] == 1 ) {
            t = getOne();
        }
        result = createDiv(zt.pool[t],t);
        visited[t] = 1;
        if ( result != -1 ) {
            visited[result] = 0;
        }
        $process.css("width",(times/30*100)+"%")
    },100);
}


$(document).ready(function(){
    $("#startButton").on("click",function(){
        $("#start").hide();
        findSomeFood();
    });
    $("body").on("click","span",function(event){
        if ( zt.resultPool.length == 1 ) {
            alert("只剩人家一个了^^没有的选了^^");
            return;
        }
        zt.resultPool.shift();
        $(event.target).parents(".foodP").remove();
    });
});
