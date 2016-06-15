// Empty JS for your own code to be here
var MAX = 10;
var ATTACK_COST = 2;
var MOVE_COST = 1;

var Team = function () {
    this.star = 1;
    this.heart = 1;
    this.circle = 1;
    this.square = 1;
    this.triangle = 1;
};

Team.prototype.endTurn = function () {
    var point = 1;
    this.star = (this.star < MAX) ? this.star + point : this.star;
    this.heart = (this.heart < MAX) ? this.heart + point: this.heart;
    this.circle = (this.circle < MAX) ? this.circle + point : this.circle;
    this.square =  (this.square < MAX) ? this.square + point : this.square;
    this.triangle = (this.triangle < MAX) ? this.triangle + point : this.triangle;
};

Team.prototype.add = function (squad) {
    if(_.isNull(this[squad]) || _.isUndefined(this[squad]) ||!_.isNumber(this[squad])) {
        alert('잘못된 접근');
        return;
    }

    var point = 1;
    this[squad] = (this[squad] < MAX) ? this[squad] + point : this[squad] ;
};


Team.prototype.attack = function (squad) {
    if(_.isNull(this[squad]) || _.isUndefined(this[squad]) ||!_.isNumber(this[squad])) {
        alert('잘못된 접근');
        return;
    }

    if(this[squad] - ATTACK_COST < 0) {
        alert("cost가 부족합니다.");
        return;
    }

    this[squad] -= ATTACK_COST;
};

Team.prototype.move = function (squad) {
    if(_.isNull(this[squad]) || _.isUndefined(this[squad]) || !_.isNumber(this[squad])) {
        alert('잘못된 접근');
        return;
    }

    if(this[squad] - MOVE_COST < 0) {
        alert("cost가 부족합니다.");
        return;
    }

    this[squad] -= MOVE_COST;
};

Team.prototype.reset = function () {
    this.star = 1;
    this.heart = 1;
    this.circle = 1;
    this.square = 1;
    this.triangle = 1;
};

var startTime = null;
var turnTime = null;
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

var reload = function() {
    $redPointTable.html(templateData({
        color : "danger",
        score: redTeam,
        team : "red"
    }));


    $bluePointTable.html(templateData({
        color : "info",
        score: blueTeam,
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
};


$turnEndButton.click(function() {
    redTeam.endTurn();
    blueTeam.endTurn();
    turnTime = moment();
    reload();
});

$resetButton.click(function () {
    redTeam.reset();
    blueTeam.reset();
    reload();
    clearInterval(timeKey);
    startTime = null;

});


reload();


$startButton.click(function () {
    startTime = moment();
    turnTime = moment();
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
            turn : tmin + ":" + tsec
        }));
    }, 1000);
});
