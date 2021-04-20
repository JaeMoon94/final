<template>
  <div class="table">

<header>
  <div class="header">
  </div>
</header>

<div class="gap">

</div>

<body>
  <div class = "excludefooter">
      <div class = "bet" v-if ="!hasStarted">
        <h1> Current Balance: ${{this.$root.$data.profile.balance}} </h1>
        <h2> Place Bet: </h2>
        <div class = "quickbet">
            <button class = "gameButton" v-on:click="bet = 5" v-bind:class="{choose: bet == 5}"><h1>$5</h1></button>
            <button class = "gameButton" v-on:click="bet = 10" v-bind:class="{choose: bet == 10}"><h1>$10</h1></button>
            <button class = "gameButton" v-on:click="bet = 50" v-bind:class="{choose: bet == 50}"><h1>$50</h1></button>
            <button class = "gameButton" v-on:click="bet = 100" v-bind:class="{choose: bet == 100}"><h1>$100</h1></button>
            <button class = "gameButton" v-on:click="bet = 1000" v-bind:class="{choose: bet == 1000}"><h1>$1000</h1></button>
        </div>
      </div>
    <div class = "main">
      <div v-if= "bet!= -1 && validBet && !hasStarted" class="gamebox" id="start" v-on:click="gameStart()">
        <h1>Start Game</h1>
      </div>

      <h1 v-if="!validBet && !hasStarted" class="text">You don't have enough money to make this bet...</h1>
      <h1 v-if="!validBet && !hasStarted" class="text">(Go to User Details to add more money to your account!)</h1>
        <div id="dealerCards" class="dealerbox hidden">
        </div>
      <div class = "row">
        <div id="buttonbox" class="buttonbox">
          <div id ="stand" class="gameButton fixsize hidden" v-on:click="standEvent()">
            <h1>STAND</h1>
          </div>
          <div id="playagain" class="gameButton hidden" v-on:click="playAgain()">
            <h1>PLAY AGAIN</h1>
          </div>
          <div id ="hit" class="gameButton fixsize hidden" v-on:click="hitEvent()">
            <h1>HIT</h1>
          </div>
        </div>
    </div>

      <div id="playerCards" class="playerbox hidden">
      </div>

    </div>
  </div>
  </body>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Table',
  components: {
  },
  data: function () {
    return {
      deckid: 0,
      dealercards: [],
      dealertotal: [0],
      playercards: [],
      playertotal: [0],
      started: false,
      bust: false,
      dealerbust: false,
      finished: false,
      bet: -1
    }
  },
  computed: {
      validBet() {
          if (this.bet <= this.$root.$data.profile.balance) {
              return true;
          }
          else {
              return false;
          }
      },
      hasStarted() {
          if (this.started) {
              return true;
          }
          else {
              return false;
          }
      }
  },
  methods: {
    gameStart() {
      this.dealercards = []
      this.dealertotal = [0];
      this.playercards = []
      this.playertotal = [0];
      this.started = false;
      this.bust = false;
      this.dealerbust = false;
      this.finished = false;

      var data = this;

      if (!this.started) {
          this.started = true;
          var url = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
          fetch(url)
          .then(function(response){
              return response.json();
          })
          .then(function(result) {
              data.deckid = result['deck_id']
          })
          .then(function() {
              var url = "https://deckofcardsapi.com/api/deck/"+ data.deckid +"/draw/?count=4";
              fetch(url)
              .then(function(response) {
                  return response.json();
              })
              .then(function(result) {
                  for (let i=0; i<2; ++i) {
                      data.addToDealerTotal(result['cards'][i])
                      data.dealercards.push([result['cards'][i]['value'], result['cards'][i]['suit'], result['cards'][i]['image']])
                  }
                  for (let i=2; i < 4; ++i) {
                      data.addToPlayerTotal(result['cards'][i])
                      data.playercards.push([result['cards'][i]['value'], result['cards'][i]['suit'], result['cards'][i]['image']])
                  }
              })
              .then(function() {
                  data.checkDealerHand();
                  data.updateDealer();
                  data.checkPlayerHand();
                  data.updatePlayer();
                  document.getElementById("stand").classList.replace("hidden", "show");
                  document.getElementById("hit").classList.replace("hidden", "show");
              })
          })
      }
    },

    hitEvent() {
        this.hit()
    },

    standEvent() {
        this.stand()
    },

    playAgain() {
        document.getElementById("playagain").classList.replace("show", "hidden")
        document.getElementById("buttonbox").classList.replace("adjust", "none")
        document.getElementById("dealerCards").classList.replace("show", "hidden");
        document.getElementById("playerCards").classList.replace("show", "hidden");
        document.getElementById("hit").classList.replace("show", "hidden");
        document.getElementById("stand").classList.replace("show", "hidden");
        this.started = false;
    },

    updateDealer() {
        var string = ""
        if (this.bust) {
            string = "<h1>Total: "
            string += Math.max.apply(Math, this.dealertotal) + "</h1>";
            for (let i=0; i < this.dealercards.length; i++) {
                string += "<img src=\"" + this.dealercards[i][2] + "\">\n"
            }
            document.getElementById("dealerCards").classList.add("dealerboxdisplay")
            string += "<div class=\"result\"><h2>WIN</h2></div>"
        }
        else if (this.dealerbust) {
            string = "<h1>Total: "
            string += Math.max.apply(Math, this.dealertotal) + "</h1>";
            for (let i=0; i < this.dealercards.length; i++) {
                string += "<img src=\"" + this.dealercards[i][2] + "\">\n"
            }
            document.getElementById("dealerCards").classList.add("dealerboxdisplay")
        }
        else if (this.dealercards.length == 2 && !this.finished) {
            string += "<div class=\"back\"><img src=\"/images/back.jpg\"></div>\n"
            for (let i=1; i < this.dealercards.length; i++) {
                string += "<div class=\"visible\"><img src=\"" + this.dealercards[i][2] + "\"></div>\n"
            }
        }
        else {
            string = "<h1>Total: "
            string += Math.max.apply(Math, this.dealertotal) + "</h1>";
            for (let i=0; i < this.dealercards.length; i++) {
                string += "<div><img src=\"" + this.dealercards[i][2] + "\"></div>\n"
            }
        }
        document.getElementById("dealerCards").innerHTML = string;
        document.getElementById("dealerCards").classList.replace("hidden", "show");
    },

    async updatePlayer() {
        var string = "<h1>Total: "
        string += Math.max.apply(Math, this.playertotal) + "</h1>";
        for (let i=0; i < this.playercards.length; i++) {
            string += "<img src=\"" + this.playercards[i][2] + "\">\n"
        }
        document.getElementById("playerCards").innerHTML = string;
        document.getElementById("playerCards").classList.replace("hidden", "show");
        if (this.bust) {
            string += Math.min.apply(Math, this.playertotal) + "</h1>";
            for (let i=0; i < this.playercards.length; i++) {
                string += "<img src=\"" + this.playercards[i][2] + "\">\n"
            }
            try {
                    let newbalance = this.$root.$data.profile.balance - this.bet;
                    let newloss = this.$root.$data.profile.losses + 1;
                    let response = await axios.put("/api/users/" + this.$root.$data.user.username, {
                        balance: newbalance,
                        losses: newloss
                    })
                    this.$root.$data.user = response.data.user;
                    this.$root.$data.profile = response.data.profile;
                }
                catch(error) {
                    
                }
            document.getElementById("playerCards").innerHTML += "<div class=\"result\"><h2>BUST</h2></div>"
            document.getElementById("playerCards").classList.replace("hidden", "show");
            document.getElementById("playagain").classList.replace("hidden", "show");
            document.getElementById("buttonbox").classList.add("adjust")
        }
    },

    hit() {
        var data = this;
        if (!this.finished){
            var url = "https://deckofcardsapi.com/api/deck/"+ this.deckid +"/draw/?count=1";
            fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(result) {
                data.addToPlayerTotal(result['cards'][0]);
                data.playercards.push([result['cards'][0]['value'], result['cards'][0]['suit'], result['cards'][0]['image']]);
                data.checkPlayerHand();
                data.updatePlayer();
                data.updateDealer();
            })
        }
    },

    stand() {
        if (!this.finished && Math.max.apply(Math, this.dealertotal) < 17){
            this.dealerPlays();
        }
        else {
            this.finished = true;
            this.updateDealer();
            this.finish();
        }
        document.getElementById("playagain").classList.replace("hidden", "show");
        document.getElementById("buttonbox").classList.add("adjust")
    },

    dealerPlays() {
        var url = "https://deckofcardsapi.com/api/deck/"+ this.deckid +"/draw/?count=1";
        var data = this;
        fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            data.addToDealerTotal(result['cards'][0]);
            data.dealercards.push([result['cards'][0]['value'], result['cards'][0]['suit'], result['cards'][0]['image']]);
            data.checkDealerHand();
            data.updateDealer();
        })
        .then(function() {
            if (!data.dealerbust && Math.max.apply(Math, data.dealertotal) < 17){
                data.dealerPlays()
            }
            else {
                data.finish();
            }
        })
    },

    async finish() {
        this.checkDealerHand();
        this.updateDealer();
        if (!this.dealerbust && !this.bust && Math.max.apply(Math, this.dealertotal) >= 17) {
            this.finished = true;
            if (Math.max.apply(Math, this.dealertotal) > Math.max.apply(Math, this.playertotal)) {
                try {
                    let newbalance = this.$root.$data.profile.balance - this.bet;
                    let newloss = this.$root.$data.profile.losses + 1;
                    let response = await axios.put("/api/users/" + this.$root.$data.user.username, {
                        balance: newbalance,
                        losses: newloss
                    })
                    this.$root.$data.user = response.data.user;
                    this.$root.$data.profile = response.data.profile;
                }
                catch(error) {
                    
                }
                document.getElementById("dealerCards").classList.add("dealerboxdisplay")
                document.getElementById("dealerCards").innerHTML+= "<div class=\"result\"><h2>  WIN  </h2></div>"
                document.getElementById("playerCards").innerHTML+= "<div class=\"result\"><h2>  LOSE  <h2></div>"
            }
            else if (Math.max.apply(Math, this.playertotal) > Math.max.apply(Math, this.dealertotal)) {
                try {
                    let newbalance = this.bet + this.$root.$data.profile.balance;
                    let newwins = this.$root.$data.profile.wins + 1;
                    let response = await axios.put("/api/users/" + this.$root.$data.user.username, {
                        balance: newbalance,
                        wins: newwins
                    })
                    this.$root.$data.user = response.data.user;
                    this.$root.$data.profile = response.data.profile;
                }
                catch(error) {
                    
                }
                document.getElementById("dealerCards").classList.add("dealerboxdisplay")
                document.getElementById("dealerCards").innerHTML+= "<div class=\"result\"><h2>  LOSE  </h2></div>"
                document.getElementById("playerCards").innerHTML+= "<div class=\"result\"><h2>  WIN  <h2></div>"
            }
            else {
                try {
                    let newties = this.$root.$data.profile.ties + 1;
                    let response = await axios.put("/api/users/" + this.$root.$data.user.username, {
                        ties: newties
                    })
                    this.$root.$data.user = response.data.user;
                    this.$root.$data.profile = response.data.profile;
                }
                catch(error) {
                   
                }
                document.getElementById("dealerCards").classList.add("dealerboxdisplay")
                document.getElementById("dealerCards").innerHTML+= "<div class=\"result\"><h2>  TIE  </h2></div>"
                document.getElementById("playerCards").innerHTML+= "<div class=\"result\"><h2>  TIE  <h2></div>"
            }
        }
        if (this.dealerbust) {
            try {
                    let newbalance = this.bet + this.$root.$data.profile.balance;
                    let newwins = this.$root.$data.profile.wins + 1;
                    let response = await axios.put("/api/users/" + this.$root.$data.user.username, {
                        balance: newbalance,
                        wins: newwins
                    })
                    this.$root.$data.user = response.data.user;
                    this.$root.$data.profile = response.data.profile;
                }
                catch(error) {
                    
                }
            document.getElementById("dealerCards").classList.add("dealerboxdisplay")
            document.getElementById("dealerCards").innerHTML+= "<div class=\"result\"><h2>  BUST  </h2></div>"
            document.getElementById("playerCards").innerHTML+= "<div class=\"result\"><h2>  WIN  <h2></div>"
        }
    },

    checkPlayerHand() {
        if (this.playertotal.filter(num => num < 22 ).length == 0) {
            this.bust = true;
            this.finished = true;
            return
        }
        else {
            this.playertotal = this.playertotal.filter(num => num < 22);
        }
    },

    checkDealerHand() {
        if (this.dealertotal.filter(num => num < 22 ).length == 0) {
            this.dealerbust = true;
            this.finished = true;
            return
        }
        else {
            this.dealertotal = this.dealertotal.filter(num => num < 22);
        }
    },

    checkDealerTotal() {
        for (let i in this.dealertotal) {
            if (i >= 17) {
                return true;
            }
            else {
                return false;
            }
        }
    },

    addToDealerTotal(card) {
        var dictionary = {"KING":10, "QUEEN":10, "JACK":10, "10":10, "9":9, "8":8, "7":7,"6":6, "5":5,"4":4, "3":3, "2":2}
        if (card['value'] == "ACE") {
            var newtotal = [];
            for (let i = 0; i < this.dealertotal.length; ++i) {
                newtotal.push(1+this.dealertotal[i])
                newtotal.push(11+this.dealertotal[i])
            }
            this.dealertotal = []
            for (let i = 0; i < newtotal.length; ++i){
                this.dealertotal.push(newtotal[i])
            }
        }
        else {
            for (let i = 0; i < this.dealertotal.length; ++i) {
                this.dealertotal[i] += dictionary[card['value']]
            }
        }
    },

    addToPlayerTotal(card) {
        var dictionary = {"KING":10, "QUEEN":10, "JACK":10, "10":10, "9":9, "8":8, "7":7,"6":6, "5":5,"4":4, "3":3, "2":2}
        if (card['value'] == "ACE") {
            var newtotal = [];
            for (let i = 0; i < this.playertotal.length; ++i) {
                newtotal.push(1 + this.playertotal[i])
                newtotal.push(11 + this.playertotal[i])
            }
            this.playertotal = []
            for (let i = 0; i < newtotal.length; ++i){
                if (!this.playertotal.includes(newtotal[i])) {
                    this.playertotal.push(newtotal[i])
                }
            }
        }
        else {
            for (let i = 0; i < this.playertotal.length; ++i) {
                this.playertotal[i] += dictionary[card['value']]
            }
        }
    }

  }
}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.text {
    color:black;
}

.quickbet {
    display: flex;
    justify-content: center;
}

.bet {
    padding-top:20px;
    color: black;
}

.bet h1 {
    margin-bottom: 10px;
}

.quickbet h1 {
    margin-bottom: 0px;
}

header {
  background-color: pink;
}

.header {
    height: 100px;
    width : 100%;
    background: url(/images/Header.jpg);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-family: "Century Gothic", CenturyGothic, Geneva, AppleGothic, sans-serif;
}

.header >>> h1 {
    font-size: 3em;
    color: rgb(246,250,251);
}

.gap {
    height: 25px;
    background-color: pink;
}

body {
    background: pink;
}

.excludefooter {
    min-height: calc(100vh - 360px);
}

.main {
    text-align: center;
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
}

.gamebox {
    border-radius: 8px;
    background-color: white;
    width: 45%;
    height: auto;
    padding: 20px;
    margin: 20px;
    box-shadow: 7px 7px 8px #888888;
    cursor: pointer;
}

.buttonbox {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
}

.adjust {
    width: 60%;
    justify-content: space-between;
}

.gameButton {
    border-radius: 8px;
    background-color: white;
    padding: 20px;
    margin: 20px;
    box-shadow: 7px 7px 8px #313131;
    cursor: pointer;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
}

.gameButton >>> img {
    height: 40px;
    margin-left: 20px
}

.dealerbox {
    border-radius: 8px;
    background-color: white;
    width: auto;
    height: auto;
    padding: 20px;
    padding-left:0px;
    padding-right:0px;
    margin: 20px;
    box-shadow: 7px 7px 8px #888888;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.dealerbox >>> h1{
    color: black;
    width: 100%;
    margin-bottom: 20px;
}

.dealerboxdisplay {
    padding: 20px;
}

.row {
    width: 100%;
    display: flex;
    justify-content: center;
}

.fixsize {
    width: 207px;
}

.dealerbox >>> img {
    height: 157px;
    width: auto;
}

.dealerbox >>> .back {
    position:relative;
    z-index: 1;
    left: 30px;
}

.dealerbox >>> .visible {
    position:relative;
    z-index:2;
    left: -30px;
}

.playerbox {
    border-radius: 8px;
    background: linear-gradient(rgb(23, 59, 18),rgb(78, 138, 105));
    padding: 20px;
    margin: 20px;
    box-shadow: 7px 7px 8px #888888;
    display:flex;
    flex-wrap: wrap;
    justify-content: center;
}

.playerbox >>> img {
    height: 157px;
    width: auto;
}

.playerbox >>> h1{
    color: white;
    width: 100%;
    margin-bottom: 20px;
}

.hidden {
    display: none;
}

.dealerbox >>> .result {
    position: absolute;
    font-size: 7.8em;
    color: black;
    background-color: rgba(197, 197, 197, 0.575);
    z-index:3;
}

.playerbox >>> .result {
    position: absolute;
    font-size: 7.8em;
    color: black;
    background-color: rgba(197, 197, 197, 0.575);
    z-index:3;
}

footer {
  background-color: #000000;
  border-bottom: 5px solid #b08a4f;
  text-align: center;
  font-family: "Century Gothic", CenturyGothic, Geneva, AppleGothic, sans-serif;
  color: #b08a4f;
  border-top: 5px solid #b08a4f;
  margin-top: 50px;
}

h5 {
  font-size: 24pt;
  margin: 0px;
}

#menu {
  list-style-type: none;
}

li >>> a {
  display: block;
  color: #b08a4f;
  text-align: center;
  padding: 8px 10px;
  text-decoration: none;
  font-size: 12pt;
  margin-right: 30px;
}

li >>> a:hover {
  color: #000000;
  background-color: #b08a4f;
}

.part-two {
  padding-bottom: 25px;
}

.choose {
    background-color: black;
    color: white;
}
@media (min-width: 1200px) and (max-width:1400px) {
    .adjust {
        width: 70%;
        justify-content: space-between;
    }
}


@media (min-width: 1050px) and (max-width:1200px) {
    .adjust {
        width: 80%;
        justify-content: space-between;
    }
}

@media (min-width: 950px) and (max-width:1050px) {
    .adjust {
        width: 90%;
        justify-content: space-between;
    }
}

@media (min-width: 850px) and (max-width:950px) {
    .adjust {
        width: 1000%;
        justify-content: space-between;
    }
}

@media (max-width:850px) {
    .adjust {
        justify-content: center;
    }
    body {
        font-size: .7em;
    }
    li a {
      font-size: 8pt;
    }

}

@media (max-width:480px) {
    #playagain h1 {
        width:100%;
    }
    #playagain img {
        margin:0;
    }
    li a {
      font-size: 8pt;
    }
}

</style>
