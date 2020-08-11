<template>
  <div id="app">
    <header>
        <div id="nav">
          <router-link to="/signin">Sign In/Out</router-link> |
          <router-link to="/">Kanban</router-link> |
          <router-link to="/about">About</router-link>
        </div>
        <div>{{email}}</div>
    </header>
    <router-view/>
 </div>
</template>

<script>
import {Auth} from "aws-amplify"

export default {
  name: 'PApp',
  data () {
    return {
      email: ""
    }
  },
  mounted: function () {
    this.setEmail();
  },
  methods: {
    setEmail: async function () {
      const user = await Auth.currentUserInfo()
      this.email = user.attributes.email;
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

footer {
    margin:  0 auto;
    overflow: hidden;
    box-shadow: .25rem 0 .25rem hsla(0, 0%, 0%, .1);
    background-image:
      linear-gradient(180deg, hsla(0, 0%, 45%, .1) 2rem, hsla(0, 100%, 100%, 0) 2.5rem)
    , linear-gradient(180deg, hsla(15, 100%, 85%, 1), hsla(15, 100%, 85%, 1));font-size: 1.7rem;
    line-height: 0.8;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
