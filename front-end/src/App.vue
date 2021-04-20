<template>
  <div id="app">
    <div id="nav">

      <router-link to="/" class="Home">Home</router-link><span v-if="!this.$root.login">|</span>
      <router-link to="/Table" v-if="!this.$root.login">Black Jack</router-link><span v-if="!this.$root.login">|</span>
      <router-link to="/UserDetails" v-if="!this.$root.login" >User Details</router-link>
      <router-link to="/Login" v-if="this.$root.login" style="float:right;">Login</router-link>
      <a href="/" style="float:right;" v-if="!this.$root.login" v-on:click = "SignOut()"> Sign Out</a>
      </div>
      <router-view/>

      <footer>
        <a href="https://github.com/JaeMoon94/final">github</a>
      </footer>

  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  methods: {
    SignOut() {
      this.user = null;
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cherry+Swash&display=swap');
* {
  margin: 0;
}

footer {
  background-color: pink;
  border-top: 5px solid yellow;
  border-bottom: 5px solid yellow;
  text-align: center;
  color: yellow;
  font-size: 40px;

}

li a {
  display: block;
  color: yellow;
  text-align: center;
  padding: 8px 10px;
  text-decoration: none;
  font-size: 12pt;
  margin-right: 30px;
  font-size: 40px;
}

li a:hover {
  color: #000000;
  background-color: yellow;
}

.part-two {
  padding-bottom: 25px;
}

#menu {
  list-style-type: none;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav{
  padding: 30px;
  background: pink;
  font-size: 24pt;
  font-family: "Century Gothic", CenturyGothic, Geneva, AppleGothic, sans-serif;
}

#nav a {
  font-weight: bold;
  color: yellow;
  padding-left: 5px;
  padding-right: 5px;
}

#nav a.router-link-exact-active{
  color: white;
}

@media only screen and (max-width: 990px) {
  #nav{
    font-size: 10pt;
  }
  li a {
    font-size: 6pt;

  }
}
</style>
