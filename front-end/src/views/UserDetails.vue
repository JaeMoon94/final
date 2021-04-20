<template>
<div class="users">
  <div class="box">
    <div v-if="!edit">
        <h1>User Information:</h1>
          <ul class = "information">
      <li> Name: {{this.$root.$data.user.firstname}} {{this.$root.$data.user.lastname}}</li>
      <li>Username: {{this.$root.$data.user.username}} </li>
      <br>
      <li class = "money" > Current Balance: </li>
      <li class = "money"> <strong>${{this.$root.$data.profile.balance}}</strong></li>
      <br>
      <li> {{this.$root.$data.profile.wins}} Wins, {{this.$root.$data.profile.ties}} Ties, {{this.$root.$data.profile.losses}} Losses </li>
      <br>
      <li>Total Winnings: ${{this.$root.$data.profile.balance - this.$root.$data.profile.totalDeposited}}</li>
          </ul>
      <h2 class = "button" v-on:click="addMoney=true" >CLICK HERE to add Money to your Account </h2>
      <p h2 v-if="addMoney"> Enter the amount of Money you wish to deposit below:</p>
      <input v-if="addMoney" placeholder="Please Enter Amount to Add" class = "bigger" v-model="amountToAdd">
      <button v-if="addMoney" type="submit" class="gameButton" v-on:click="addTheMoney()">Submit</button>
      <p v-if="added"> Thank You for your deposit!</p>
      <h2 class = "button" v-on:click="edit=true" >CLICK HERE to Edit your Account Information </h2>
      </div>
      <div v-if="edit">
	<div>
        <h1>Enter the Information that you would like to change in the boxes below:</h1>
      </div>
      <div>
        <input placeholder="username"  class = "bigger" v-model="username">
        <input type="password" placeholder="password" class = "bigger" v-model="password">
      </div>
      <div>
        <button type="submit" class="pure-button" v-on:click="editAccount()" style="margin-top: 10px;">Change Username/Password</button>
      </div>
      <div id = "done"></div>
        <button class ="pure-button" v-on:click = "deleteAccount()"> Delete Account</button>
        <button class ="pure-button" v-on:click= "resetStats()">Reset Game Statistics</button>
        <button class ="pure-button" v-on:click = "withdraw()">Withdraw All Money</button>
      </div>
      </div>
      <div class="back"></div>
    </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'UserDetails',
  data: function() {
    return {
      addMoney: false,
      amountToAdd: 0,
      error: "",
      added: false,
      edit: false,
      username: "",
      password: "",
    }
  },
  components: {
  },
  methods: {
    async addTheMoney() {
      this.error = '';
      try {
        let newbalance = this.$root.$data.profile.balance + parseFloat(this.amountToAdd);
        let newDeposit = this.$root.$data.profile.totalDeposited + parseFloat(this.amountToAdd);	       
        let response = await axios.put("/api/users/" + this.$root.$data.user.username, {
                balance: newbalance,
                totalDeposited: newDeposit
          })
      this.added = true;
      this.addMoney = false;
      this.$root.$data.user = response.data.user;
      this.$root.$data.profile = response.data.profile;
      }
      catch(error) {
        console.log(error)
      }
    },
    async editAccount() {
    this.error = '';
    try {
	let response = await axios.put("/api/users/" + this.$root.$data.user.username, {
		username: this.username,
		password: this.password
	});
	this.$root.$data.user = response.data.user;
	this.$root.$data.profile = response.data.profile;
    } catch (error) {
	this.error = error.response.data.message;
    }
    this.username = ""
    this.password = ""
    this.edit = false;
  },
  async resetStats() {
    console.log("resetting")
	this.error = '';
	try {
		let response = await axios.put("/api/users/" + this.$root.$data.user.username, {
      wins: 0,
      ties: 0,
			losses: 0
    });
    console.log(response)
		this.$root.$data.user = response.data.user;
		this.$root.$data.profile = response.data.profile;
	} catch (error) {
		this.error = error.response.data.message;
	}
	this.$router.push("/")
},
  SignOut() {
      console.log("sign out attempted")
      this.$root.$data.user = null;
  },
  deleteAccount() {
    try {
      axios.delete('/api/users/' + this.$root.$data.user.username, {})
      this.SignOut()
      this.$router.push("/")
    }
    catch(error) {
      console.log(error)
    }
  },
  async withdraw() {
    try {
      console.log('/api/users/' + this.$root.$data.user.username)
      let response = await axios.put('/api/users/' + this.$root.$data.user.username, {
        balance: 0,
        totalDeposited: 0,
      });
      console.log(response)
      this.$root.$data.user = response.data.user;
      this.$root.$data.profile = response.data.profile;
      this.$router.push("/")
    }
    catch(error) {
      console.log(error)
    }
  }
}
}

</script>

<style scoped>
.bigger {
  font-size: 22px;
  margin-bottom: 10px;
  margin-right: 5px;
  margin-left: 5px;
}

p {
  color: white;
}

.gameButton {
    font-size: 12pt;
    border-radius: 8px;
    background-color: white;
    padding: 5px;
    margin: 20px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
}

ul {
  list-style-type: none;
  font-size: 24pt;
  color: white;
}

li {
  margin-top: 5px;
}

.box {
  margin-bottom: 20px;
}

.back {
  min-height: 1100px;
  background-color:pink;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: -2;
}

.editbutton


.button {
  font-family: "Century Gothic", CenturyGothic, Geneva, AppleGothic, sans-serif;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  display: block;
  width: 70%;
  margin-top: 20px;
  margin-bottom: 50px;
  font-size: 24pt;
  border: 5px solid yellowgreen;
  border-radius: 30px;
  cursor: pointer;
  padding: 5px;

}

.button:hover {
  background-color: white;
  color: pink;
}

.pure-button {
  background-color: black;
  color: white;
  border-radius: 30px;
  margin-bottom: 20px;
  margin-right: 10px;
  margin-left: 10px;
  font-size: 18px;
  padding: 15px;
  cursor: pointer;
}

h1 {
  font-size: 48px;
  font-variant: capitalize;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: white;
  margin-bottom: 20px;
  background-color: pink;
  padding: 10px;
}

#done {
  margin-top: 20px;
}

h2 {
  font-size: 22px;
  font-variant: capitalize;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: white;
}

.black {
  background-color: pink;
  width: 100%;
  height: 500px;
}

.users {
  min-height: calc(100vh - 402px);
  padding: 30px;
  padding-bottom: 0px;
  display: flex;
  justify-content: center;
}

.users::after {
content: "";
background: url(/images/user.jpg);
background-size: 100%;
background-repeat: no-repeat;
top: 0;
left: 0;
bottom: 0;
right: 0;
position: absolute;
z-index: -1;
min-height: calc(100vh - 402px);
}

.box {
  background: pink;
  opacity: 0.95;
  width: 50%;
  padding: 20px;
  font-size: 20px;
  text-align: center;
  border-radius: 5px;
  justify-content: center;
  text-align: center;
  display: inline;
  border: 5px solid white;
  border-radius: 30px;
}

@media (max-width:960px) {
    h1 {
        font-size: 16pt;
    }
    li {
	font-size: 12pt;
    }
    p {
	font-size: 12 pt;
    }
    .button {
	font-size: 12pt;
    }

    .bigger {
	font-size: 12pt;
    } 
    .box {
	width: 80%;
    }
}
</style>
