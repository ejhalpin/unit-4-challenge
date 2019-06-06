var characters = [
  { name: "Aeris", imgSrc: "assets/images/aeris.png", playable: false, hp: 100, ap: 9, ca: 10 }, //0,0
  { name: "Barret", imgSrc: "assets/images/barret.png", playable: true, hp: 125, ap: 8, ca: 15 },
  { name: "Cait-Sith", imgSrc: "assets/images/cait-sith.png", playable: false, hp: 105, ap: 11, ca: 9 }, //3,
  { name: "Gold Chocobo", imgSrc: "assets/images/chocobo-gold.png", playable: false, hp: 200, ap: 20, ca: 28 }, //
  { name: "Regualr Chocobo", imgSrc: "assets/images/chocobo-regular.png", playable: false, hp: 90, ap: 25, ca: 6 },
  { name: "Cid", imgSrc: "assets/images/cid.png", playable: false, hp: 100, ap: 8, ca: 11 },
  { name: "Cloud", imgSrc: "assets/images/cloud.png", playable: true, hp: 100, ap: 10, ca: 10 },
  { name: "Diamond Weapon", imgSrc: "assets/images/diamond-weapon.png", playable: false, hp: 500, ap: 50, ca: 35 },
  { name: "Emerald Weapon", imgSrc: "assets/images/emerald-weapon.png", playable: false, hp: 250, ap: 28, ca: 28 },
  { name: "Godo", imgSrc: "assets/images/godo.png", playable: false, hp: 125, ap: 12, ca: 8 },
  { name: "Hojo", imgSrc: "assets/images/hojo.png", playable: false, hp: 100, ap: 15, ca: 20 },
  { name: "Palmer", imgSrc: "assets/images/palmer.png", playable: false, hp: 119, ap: 13, ca: 16 },
  { name: "Red XIII", imgSrc: "assets/images/red-13.png", playable: false, hp: 100, ap: 9, ca: 19 },
  { name: "Reno", imgSrc: "assets/images/reno.png", playable: true, hp: 125, ap: 12, ca: 5 },
  { name: "Ruby Weapon", imgSrc: "assets/images/ruby-weapon.png", playable: false, hp: 300, ap: 5, ca: 2 },
  { name: "Rufus", imgSrc: "assets/images/rufus.png", playable: true, hp: 150, ap: 5, ca: 20 },
  { name: "Sephiroth", imgSrc: "assets/images/sephiroth.png", playable: false, hp: 175, ap: 18, ca: 60 },
  { name: "Tifa", imgSrc: "assets/images/tifa.png", playable: true, hp: 100, ap: 12, ca: 23 },
  { name: "Vincent", imgSrc: "assets/images/vincent.png", playable: false, hp: 119, ap: 11, ca: 21 },
  { name: "Yuffie", imgSrc: "assets/images/yuffie.png", playable: false, hp: 108, ap: 12, ca: 12 },
  { name: "Zack", imgSrc: "assets/images/zack.png", playable: false, hp: 141, ap: 14, ca: 21 }
];
//Aeris, Hojo, Red, Sephiroth, Cait, Palmer, Cid, Regular, Godo, Yuffie, Vincent, Ruby, Gold, Emerald, Diamond, Zack
var unlockOrder = [0, 10, 12, 16, 2, 11, 5, 4, 9, 19, 18, 14, 3, 8, 7, 20];
//global variables
var n;
var nShowing;
var span;
var theta;
var radius;
var frontCard = 0;
var fighterSet = false;
var enemiesNeeded = 3;
var playableCharacters = [];
var halfSceneWidth = 85;

//global elements
var container = $(".container");
var header = $("#header");
var scene = $(".scene");
var nav = $("#nav");
var deck = $(".deck");
var fighter = $("#fighter");
var enemies = $("#enemies");
var attackButton = $("#attack-button");
var message = $("#fight-message");
var resetButton = $("<button>Play Again?</button>").attr("id", "reset-button");

//function definitions

function buildCard(charObj) {
  var card = $("<div>")
    .addClass("card")
    .addClass("abs")
    .attr("name", charObj.name)
    .attr("value", 0);
  var front = $("<div>").addClass("front");
  var back = $("<div>").addClass("back");
  var img = $("<div>")
    .addClass("character-img")
    .css("background-image", "url(" + charObj.imgSrc + ")");
  front.append(img);
  var stats = $("<div>").addClass("stats");
  var hpLabel = $("<div>").addClass("label");
  var apLabel = $("<div>").addClass("label");
  var caLabel = $("<div>").addClass("label");
  var hpStat = $("<div>").addClass("stat-bar hp");
  var apStat = $("<div>")
    .addClass("stat-bar")
    .attr("id", charObj.name + "-ap-stat");
  var caStat = $("<div>").addClass("stat-bar");
  var hpval = $("<div>")
    .addClass("stat-val")
    .attr("id", charObj.name + "-hp-val");
  var apval = $("<div>")
    .addClass("stat-val")
    .attr("id", charObj.name + "-ap-val");
  var caval = $("<div>").addClass("stat-val");
  //add hp
  hpLabel.text("HP");
  hpval.css("width", "100%");
  hpStat.append(hpval);
  stats.append(hpLabel).append(hpStat);
  //add ap
  apLabel.text("AP");
  apval.css("width", charObj.ap.toString() + "px");
  apStat.append(apval);
  stats.append(apLabel).append(apStat);
  //add ca
  caLabel.text("CA");
  caval.css("width", charObj.ca.toString() + "px");
  caStat.append(caval);
  stats.append(caLabel).append(caStat);
  front.append(stats);
  //add the nth-child css!
  card.append(front);
  card.append(back);
  card.on("click", cardClick);
  return card;
}

function transform3D() {
  var children = deck.children().toArray();
  $.each(children, function(index, val) {
    var currentCard = $(children[index]);
    var rotate = index * theta;
    currentCard.css("transform", "rotateY(" + rotate + "deg) translateZ(" + radius + "px)");
  });
  frontCard--;
  rotateDeck();
  frontCard++;
  rotateDeck();
}

function rotateDeck() {
  //this one can be made more efficient!
  var phi = theta * frontCard * -1;
  // var deckElem = document.querySelector(".deck");
  // deckElem.style.transform = "translateZ(" + -radius + "px) rotateY(" + phi + "deg)";
  deck.css("transform", "translateZ(" + -radius + "px) rotateY(" + phi + "deg)");
  var kids = deck.children().toArray();
  var n = kids.length;
  if (n >= 14) {
    nShowing = 7;
  } else if (n > 8) {
    nShowing = 5;
  } else {
    nShowing = 3;
  }
  var fc = frontCard; //fc points to the index of the card that is showing in playableCharacters
  while (fc < 0) {
    fc = n + fc;
  }
  while (fc > n) {
    fc = fc - n;
  }
  var before = fc - Math.floor(nShowing / 2);
  if (before < 0) {
    before = n + before;
  }
  var frontCardIndices = [];
  while (frontCardIndices.length < nShowing) {
    frontCardIndices.push(before);
    before++;
    if (before === n) {
      before = 0;
    }
  }
  $.each(kids, function(dex, val) {
    var c = $(kids[dex]).children()[1];
    if (!frontCardIndices.includes(dex)) {
      $(c).css("z-index", "3");
    } else {
      $(c).css("z-index", "1");
    }
  });
}

function fetchCardData(name = "String") {
  for (var i = 0; i < characters.length; i++) {
    if (characters[i].name === name) {
      return characters[i];
    }
  }
}

function toggleDeck(m) {
  if (m) {
    container.animate(
      {
        opacity: 0
      },
      250,
      function() {
        nav.detach();
        scene.detach();
        message.toggleClass("visible");
        console.log(m + "visible class toggled to on");
        container.animate({ opacity: 1 }, 250);
      }
    );
  } else {
    container.animate({ opacity: 0 }, 250, function() {
      header.detach();
      scene.prependTo(container);
      nav.prependTo(container);
      header.prependTo(container);
      message.toggleClass("visible");
      console.log(m + "visible class toggled to off");
      container.animate({ opacity: 1 }, 250);
      resetButton.detach();
    });
  }
}
function stackDeck(charactersArray) {
  if (charactersArray.length !== 0) {
    var currentCards = deck.children().toArray();
    var currentCharacters = [];
    $.each(currentCards, function(index, value) {
      currentCharacters.push(fetchCardData($(currentCards[index]).attr("name")));
    });
    var cardsToBuild = charactersArray.filter(function(val) {
      return !currentCharacters.includes(val);
    });
    for (var i = 0; i < cardsToBuild.length; i++) {
      deck.append(buildCard(cardsToBuild[i]));
    }
  }

  //recalculate the global variables used in the layout
  n = deck.children().toArray().length;
  span = Math.floor(nShowing / 2);
  theta = 360 / n;
  radius = halfSceneWidth / Math.tan(Math.PI / n);
  //lay out the deck
  deck.css("transform", "translateZ(" + -radius + "px)");
  transform3D();
}

function handleCard(cardObject, remove = false) {
  var charArr = [];
  if (remove) {
    stackDeck(charArr);
    return;
  }
  charArr.push(cardObject);
  stackDeck(charArr);
}

function cardClick() {
  var card = $(this);

  var character = fetchCardData(card.attr("name"));
  var cardVal = parseInt(card.attr("value"));
  //console.log(card.attr("name") + " has a value");
  switch (cardVal) {
    case 0: //a card in the deck was selected
      if (!fighterSet) {
        card
          .attr("value", 1)
          .detach()
          .toggleClass("abs")
          .css("transform", "rotateY(0deg) translateZ(0px)")
          .appendTo(fighter);
        $(card.children()[1]).css("z-index", "1");
        fighterSet = true;
        if (enemiesNeeded === 1) {
          header.text("Select " + enemiesNeeded + " Opponent to Battle");
        } else {
          header.text("Select " + enemiesNeeded + " Opponents to Battle");
        }
      } else if (enemiesNeeded > 0) {
        card
          .attr("value", 2)
          .toggleClass("abs")
          .detach()
          .css("transform", "rotateY(0deg) translateZ(0px)")
          .appendTo(enemies);
        $(card.children()[1]).css("z-index", "1");
        enemiesNeeded--;
        if (enemiesNeeded === 0) {
          header.text("Select Your First Opponent");
          //get rid of the deck, show the fight button and the arena
          toggleDeck(1);
          $(fighter.children()[0]).off("click");
          selectedFighter = fetchCardData($(fighter.children().toArray()[0]).attr("name"));
          attackButton.attr("disabled", false);
          attackButton.on("click", attack);
          getOpponents();
        } else {
          if (enemiesNeeded === 1) {
            header.text("Select " + enemiesNeeded + " Opponent to Battle");
          } else {
            header.text("Select " + enemiesNeeded + " Opponents to Battle");
          }
        }
      }
      handleCard(character, true);

      break;
    case 1:
      // console.log("before attach: " + n);
      card
        .attr("value", 0)
        .detach()
        .toggleClass("abs")
        .appendTo(deck);
      $(card.children()[1]).css("z-index", "1");
      fighterSet = false;
      header.text("Select Your Fighter");
      handleCard(character, false);

      break;
    case 2:
      if (!fighterSet) {
        card
          .attr("value", 1)
          .detach()
          .css("transform", "rotateY(0deg) translateZ(0px)")
          .appendTo(fighter);
        $(card.children()[1]).css("z-index", "1");
        fighterSet = true;
        enemiesNeeded++;
        if (enemiesNeeded === 1) {
          header.text("Select " + enemiesNeeded + " Opponent to Battle");
        } else {
          header.text("Select " + enemiesNeeded + " Opponents to Battle");
        }
      } else {
        card
          .attr("value", 0)
          .detach()
          .toggleClass("abs")
          .css("transform", "rotateY(0deg) translateZ(0px)")
          .appendTo(deck);
        $(card.children()[1]).css("z-index", "1");
        enemiesNeeded++;
        if (enemiesNeeded === 1) {
          header.text("Select " + enemiesNeeded + " Opponent to Battle");
        } else {
          header.text("Select " + enemiesNeeded + " Opponents to Battle");
        }
        handleCard(character, false);
      }

      break;
    default:
    // console.log("default switch statement");
  }
}

//game variables and functions
var opponents = []; //holds the cards for the opponents
var selectedOpponent; //holds the object from the characters array
var selectedFighter;
var fighterHP;
var opponentHP;
var fighterAP;
var fighterCA;
var opponentCA;
var fighterHpDiv;
var fighterApDiv;
var fighterStatDiv;
var opponentHpDiv;
var opponentCard;
var opponentCount = 3;
var hasFought = false;
var apcolor = ["rgb(135, 206, 250)", "rgb(255, 165, 0)", "rgb(164, 66, 244)", "rgb(70, 6, 122)", "rgb(181, 68, 109)", "rgb(255, 0, 93)"];
function attack() {
  if (selectedOpponent == undefined) {
    return;
  }
  hasFought = true;
  $.each(opponents, function(index, val) {
    val.off("click");
  });
  opponentHP -= fighterAP;
  fighterAP += selectedFighter.ap;
  opponentHpDiv.css("width", ((opponentHP / selectedOpponent.hp) * 100).toString() + "%");

  if (fighterAP > 118) {
    var width = fighterAP - 118;
    while (width > 118) {
      width -= 118;
    }
    var ratio = Math.floor(fighterAP / 118);
    fighterApDiv.css("background-color", apcolor[ratio]);
    fighterApDiv.css("width", width.toString() + "px");
    fighterStatDiv.css("background-color", apcolor[ratio - 1]);
  } else {
    fighterApDiv.css("width", fighterAP + "px");
  }
  fighterHP -= opponentCA;
  var attackMessage = selectedFighter.name + " attacked " + selectedOpponent.name + " and dealt " + fighterAP + " damage.";

  var caMessage = selectedOpponent.name + " counter-attacked and dealt " + opponentCA + " damage.";
  message.html(attackMessage).append("<p>" + caMessage + "</p>");
  fighterHpDiv.css("width", ((fighterHP / selectedFighter.hp) * 100).toString() + "%");
  //check for victory or loss
  if (opponentHP <= 0) {
    opponentCount--;
    var winMessage = selectedFighter.name + " defeated " + selectedOpponent.name + "!";
    setTimeout(function() {
      message.html(winMessage);
    }, 500);
    opponentCard.attr("value", "3");
    opponentCard.toggleClass("selected");
    opponentCard.toggleClass("defeated");
    selectedOpponent = undefined;
    //anything else?
    switch (opponentCount) {
      case 2:
        header.text("Select Your Next Opponent");
        getOpponents();
        break;
      case 1:
        getOpponents();
        $.each(opponents, function(index, value) {
          if (value.attr("value") == 2) {
            value.trigger("click");
          }
        });
        header.text("Attack!");
        break;
      case 0:
        setTimeout(function() {
          message.html("You won!");
          var newChar = characters[unlockOrder.shift()];
          newChar.playable = true;
          message.append("<p>You have unlocked " + newChar.name + "!</p>");
        }, 500);
        setTimeout(function() {
          message.html(resetButton);
          resetButton.on("click", resetGame);
          attackButton.attr("disabled", true);
        }, 2000);

        break;
      default:
        console.log("fight default");
    }
  } else if (fighterHP <= 0) {
    header.text("You Lost!");
    message.html(resetButton);
    resetButton.on("click", resetGame);
    attackButton.attr("disabled", true);
  }
}

function resetGame() {
  opponents = []; //holds the cards for the opponents
  selectedOpponent = undefined; //holds the object from the characters array
  selectedFighter = undefined;
  fighterHP = undefined;
  opponentHP = undefined;
  fighterAP = undefined;
  fighterCA = undefined;
  opponentCA = undefined;
  fighterHpDiv = undefined;
  fighterApDiv = undefined;
  fighterStatDiv = undefined;
  opponentHpDiv = undefined;
  opponentCard = undefined;
  opponentCount = 3;
  hasFought = false;
  fighterSet = false;
  enemiesNeeded = 3;
  deck.empty();
  fighter.empty();
  enemies.empty();
  playableCharacters = characters.filter(function(value) {
    return value.playable;
  });
  stackDeck(playableCharacters);
  toggleDeck(0);
}

function getOpponents() {
  $.each(enemies.children().toArray(), function(dex, val) {
    opponents.push($(val));
    $(val).off("click");
    if (parseInt($(val).attr("value")) == 2) {
      $(val).on("click", select);
    }
  });
  if (!hasFought) {
    fighterHP = selectedFighter.hp;
    fighterAP = selectedFighter.ap;
    fighterCA = selectedFighter.ca;
    apPlus = fighterAP;
    fighterHpDiv = $("#" + selectedFighter.name + "-hp-val");
    fighterApDiv = $("#" + selectedFighter.name + "-ap-val");
    fighterStatDiv = $("#" + selectedFighter.name + "-ap-stat");
  }
}
function select() {
  //console.log($(this).attr("name"));
  //update the selected character, if any
  opponentCard = $(this);
  if (selectedOpponent != undefined) {
    $.each(opponents, function(dex, val) {
      if (val.attr("name") == selectedOpponent.name) {
        val.toggleClass("selected");
      }
    });
  }
  selectedOpponent = fetchCardData($(this).attr("name"));
  $(this).toggleClass("selected");
  opponentCA = selectedOpponent.ca;
  opponentHP = selectedOpponent.hp;
  opponentHpDiv = $("#" + selectedOpponent.name + "-hp-val");
  header.text("Attack!");
}
$(document).ready(function() {
  playableCharacters = characters.filter(function(value) {
    return value.playable;
  });
  stackDeck(playableCharacters);
  //event declaration
  $("#rotateClockwise").on("click", function() {
    frontCard++;
    rotateDeck();
  });
  $("#rotateCounterClockwise").on("click", function() {
    frontCard--;
    rotateDeck();
  });
});
