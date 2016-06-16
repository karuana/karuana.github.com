// Empty JS for your own code to be here


var $activeMaxPoint = $('#activeMaxPoint');

var getActiveMaxPoint = function () {
    return Number($activeMaxPoint.val());
};


var Team = function () {
    this.score = [1, 1, 1, 1, 1];
};

Team.prototype.endTurn = function () {
    var MAX = getActiveMaxPoint();
    var point = Number($('#max').val());
    point = _.isUndefined(point) ? 1 : point;

    for(var i = 0; i< 5; i++) {
        this.score[i] = (this.score[i] + point < MAX) ? this.score[i] + point : MAX;
    }
};

Team.prototype.add = function (idx) {
    var MAX = getActiveMaxPoint();
    idx = (!_.isNumber(idx)) ? Number(idx) : idx;
    if(_.isNull(this.score[idx]) || _.isUndefined(this.score[idx]) ||!_.isNumber(this.score[idx])) {
        alert('잘못된 접근');
        return;
    }

    var point = 1;
    this.score[idx] = (this.score[idx] < MAX) ? this.score[idx]+ point : this.score[idx] ;
};


Team.prototype.attack = function (idx) {
    idx = (!_.isNumber(idx)) ? Number(idx) : idx;
    if(_.isNull(this.score[idx]) || _.isUndefined(this.score[idx]) ||!_.isNumber(this.score[idx])) {
        alert('잘못된 접근');
        return;
    }

    var ATTACK_COST = Number($('#attack').val());

    if(this.score[idx] - ATTACK_COST < 0) {
        alert("cost가 부족합니다.");
        return;
    }

    this.score[idx] -= ATTACK_COST;
};

Team.prototype.move = function (idx) {
    idx = (!_.isNumber(idx)) ? Number(idx) : idx;
    if(_.isNull(this.score[idx]) || _.isUndefined(this.score[idx]) ||!_.isNumber(this.score[idx])) {
        alert('잘못된 접근');
        return;
    }
    var MOVE_COST = Number($('#move').val());
    if(this.score[idx] - MOVE_COST < 0) {
        alert("cost가 부족합니다.");
        return;
    }

    this.score[idx] -= MOVE_COST;
};

Team.prototype.revival = function (idx) {
    idx = (!_.isNumber(idx)) ? Number(idx) : idx;
    if(_.isNull(this.score[idx]) || _.isUndefined(this.score[idx]) ||!_.isNumber(this.score[idx])) {
        alert('잘못된 접근');
        return;
    }
    var REVIVAL_COST = Number($('#revival').val());
    if(this.score[idx] - REVIVAL_COST < 0) {
        alert("cost가 부족합니다.");
        return;
    }

    this.score[idx] -= REVIVAL_COST;
};

Team.prototype.reset = function () {
    for(var i = 0; i< 5; i++) {
        this.score[i] = 1;
    }
};

var startTime = null;
var turnTime = null;
var turnCount = 1;
var timeKey = null;
var redTeam = new Team();
var blueTeam = new Team();


var $redPointTable = $('.red');
var $bluePointTable = $('.blue');
var $timeScoreBoard = $('.time-score');
var templateData =_.template( $('#team-template').html());

var timeTemplateData =_.template( $('#time-template').html());

//버튼
var $turnEndButton = $('#turn-end-button');
var $resetButton = $('#reset-button');
var $startButton = $('#start-button');

var $redWeight = $('#red-weight');
var $blueWeight = $('#blue-weight');

var reload = function() {
    $redPointTable.html(templateData({
        color : "danger",
        data: redTeam,
        team : "red"
    }));


    $bluePointTable.html(templateData({
        color : "info",
        data: blueTeam,
        team: "blue"
    }));

    $('.attack-button').click(function () {
        var $this = $(this);
        var target = $this.data('target');
        if($this.data('team') === "red") {
            redTeam.attack(target);
        } else {
            blueTeam.attack(target);
        }

        reload();
    });

    $('.move-button').click(function () {
        var $this = $(this);
        var target = $this.data('target');
        if($this.data('team') === "red") {
            redTeam.move(target);
        } else {
            blueTeam.move(target);
        }

        reload();
    });

    $('.add-button').click(function () {
        var $this = $(this);
        var target = $this.data('target');
        if($this.data('team') === "red") {
            redTeam.add(target);
        } else {
            blueTeam.add(target);
        }

        reload();
    });

    $('.revival-button').click(function () {
        var $this = $(this);
        var target = $this.data('target');
        if($this.data('team') === "red") {
            redTeam.revival(target);
        } else {
            blueTeam.revival(target);
        }

        reload()
    })
};


$turnEndButton.click(function() {
    redTeam.endTurn();
    blueTeam.endTurn();
    turnTime = moment();
    turnCount ++;
    reload();
});

$resetButton.click(function () {
    redTeam.reset();
    blueTeam.reset();
    reload();
    clearInterval(timeKey);
    startTime = null;
    timeKey = null;
    turnCount = 1;

});


reload();


$startButton.click(function () {
    startTime = moment();
    turnTime = moment();
    turnCount = 1;
    if(!_.isNull(timeKey)) {
        clearInterval(timeKey);
    }
    timeKey = setInterval(function () {
        var now = moment();
        var diffTime = now.diff(startTime);
        var min = Math.floor(diffTime / 60000);
        var sec = Math.floor((diffTime % 60000) / 1000);
        
        //turn
        var turnDiff = now.diff(turnTime);
        var tmin = Math.floor(turnDiff / 60000);
        var tsec = Math.floor((turnDiff % 60000) / 1000);
        $timeScoreBoard.html(timeTemplateData({
            time : min + ":" + sec,
            turn : tmin + ":" + tsec,
            turnCount : turnCount
        }));
    }, 1000);
});

var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};


var getRBWeightRand = function () {
    var redW = Number($redWeight.val());
    var blueW = Number($blueWeight.val());

    var val = getRandomInt(1, redW + blueW);

    return{
        result :  val <= redW ? "RED" : "BLUE",
        value : val
    };
};

var $coinResult = $('#coin-result');

$('#coin-toss').click(function () {
    var result = getRBWeightRand();

    $coinResult.text(result.result + " 가중치: " + result.value );
});



