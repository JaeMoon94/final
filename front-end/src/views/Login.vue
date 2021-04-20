<template>
<div class="hero">
  <div class="heroBox">
    <h1>Join us...</h1>
    <form class="pure-form">
      <div>
        <h2>Register for an account</h2>
        <input placeholder="First Name" class = "bigger" v-model="firstName">
        <input placeholder="Last Name" class = "bigger" v-model="lastName">
      </div>
      <div>
        <input placeholder="username"  class = "bigger" v-model="username">
        <input type="password" placeholder="password" class = "bigger" v-model="password">
      </div>

      <div>
        <input placeholder="contact/email"  class = "bigger" v-model="contact">
      </div>



      <div>
        <button type="submit" class="pure-button" @click.prevent="register" @click="register()">Register</button>
      </div>
    </form>
    <div  v-if="error" class="error">
      <p>{{error}}</p>
    </div>
    <form class="pure-form">
    <div>
      <h2>Login</h2>
      <input placeholder="username" class = "bigger" v-model="usernameLogin">
      <input type="password" placeholder="password" class = "bigger" v-model="passwordLogin">
    </div>
    <div>
      <button type="submit" class="pure-button" @click.prevent = "login" @click="login()">Login</button>
    </div>
  </form>
  <div v-if="errorLogin" class = "error">
    <p >{{errorLogin}}</p>
  </div>
</div>
<div class = "back"></div>
</div>
</template>

<script>
import axios from "axios";
export default {
  name: 'Home',
  data: function() {
    return {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      contact:"",
      email:"",
      usernameLogin: "",
      passwordLogin: "",
      error: "",
      errorLogin: "",
      registerReady: true
    }
  },
  components: {
  },
  methods: {
    async register() {
      if (!this.registerReady) {
        return
      }
      this.registerReady = false;
      this.error = '';
      this.errorLogin = '';
      if (!this.firstName || !this.lastName || !this.username || !this.password|| !this.email|| !this.contact) {
        this.registerReady = true;
        return;
      }
      try {
        let response = await axios.post('/api/users', {
          firstname: this.firstName,
          lastname: this.lastName,
          username: this.username,
          password: this.password,
          contact: this.contact,
          email: this.email,
        });
        this.$root.$data.user = response.data.user;
        this.$root.$data.profile = response.data.profile;
        this.$router.push("/")
      } catch (error) {
        this.error = error.response.data.message;
        this.$root.$data.user = null;
        this.$root.$data.profile = null;
      }
      this.firstName = ""
      this.lastName = ""
      this.username = ""
      this.password = ""
      this.email = ""
      this.contact = ""
      this.registerReady = true
    },
    async login() {
      this.error = '';
      this.errorLogin = '';
      if (!this.usernameLogin || !this.passwordLogin) {
        return;
      }
      try {
        let response = await axios.post('/api/users/login', {
          username: this.usernameLogin,
          password: this.passwordLogin,
        });
        this.$root.$data.user = response.data.user;
        this.$root.$data.profile = response.data.profile;
        this.$router.push("/")
      } catch (error) {
        this.errorLogin = error.response.data.message;
        this.$root.$data.user = null;
        this.$root.$data.profile = null;
      }
      this.usernameLogin = ""
      this.passwordLogin = ""
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cherry+Swash&display=swap');
h1 {
  font-size: 36px;
  font-variant: capitalize;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: blakc;
  margin-bottom: 20px;
  background-color: greenyellow;
  padding: 10px;
}

h2 {
  font-size: 28px;
  font-variant: capitalize;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: black;
  margin-bottom: 20px;
}

.bigger {
  font-size: 24px;
  margin-bottom: 10px;
}


.hero {
  padding: 30px;
  display: flex;
  justify-content: center;
}

.pure-button {
  background-color: greenyellow;
  color: #b08a4f;
  border-radius: 30px;
  margin-bottom: 20px;
  font-size: 18px;
  padding: 15px;
}

.heroBox {
  background: white;
  opacity: 0.95;
  display: inline;
  padding: 20px;
  font-size: 20px;
  text-align: center;
  border-radius: 30px;
}

.hero::after {
content: "";
background: url(/images/car.jpg);
background-size: 100%;
background-repeat: no-repeat;
top: 0;
left: 0;
bottom: 0;
right: 0;
position: absolute;
z-index: -1;
}

.hero img {
height: 20px;
margin: 0px;
}


.hero form {
  font-size: 14px;
}

.hero form legend {
  font-size: 20px;
}

input {
  margin-right: 10px;
}

.back {
  min-height: 100vh;
  background-color: pink;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: -2;
}

.error {
  padding: 5px 20px;
  margin-bottom:10px;
  border-radius: 30px;
  font-size: 20px;
  background-color: #d9534f;
  color: #fff;
}

@media only screen and (max-width: 990px) {
  h1 {
    font-size: 16pt;
  }
  h2 {
    font-size: 14pt;
  }
  .bigger {
    font-size: 12pt;
  }
  .pure-button {
    font-size: 12pt;
  }

}
</style>
