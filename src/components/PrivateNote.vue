<template>
  <div class="privateNote">
    <div id="icon">
          <font-awesome-icon v-if="email" :icon="['fas', 'user']" size="2x" />  
          <div v-if="email"> Hello, {{email}} ! </div>
    </div>
    <br/>
    <h1>Put Your Post-it</h1>
    <div id="chat-form">
      <textarea v-model="content" name="content" class="form" placeholder="New Task" />
      <button class="submit" v-on:click="createPrivateNote()">Put It! 🤏</button>
    </div>
    <div class="private-notes-area">
      <div v-for="(privateNote, id) in privateNotes" v-bind:key="id">
        <div class="private-note" :color="randomColor(privateNote.content)">
          <div>
            <div>{{ privateNote.content }}</div>
            <a @click="() => deletePrivateNote(privateNote.id)"><font-awesome-icon :icon="['fas', 'times']" size="1x" /></a>	
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { API, Auth, graphqlOperation} from "aws-amplify"
import { createPrivateNote, deletePrivateNote } from "../graphql/mutations"
import { listPrivateNotes } from "../graphql/queries"
import { getPrivateNote } from "../graphql/queries"
import { onCreatePrivateNote } from "../graphql/subscriptions"
import _ from 'lodash'

export default {
  name: 'PrivateNote',
  data () {
    return {
      content: "",
      privateNote: null,
      privateNotes: [],
      owner: "",
      email: "",
      limit: 2 ** 31 - 1
    }
  },
  mounted: function () {
    this.setOwner().then(
      this.displayPrivateNotes()
    )
  },
  methods: {
    randomColor: function (content) {
      const color = content.length%3;
      switch(color) {
        case 0:
          return "blue";
        case 1:
          return "red";
        default:
          return "yellow";
      }
    },
    setOwner: async function () {
      const user = await Auth.currentUserInfo()
      this.owner = user.username
      this.email = user.attributes.email.slice(0, 4) + "**@**" ;
    },
    createPrivateNote: async function () {
      if (this.content === "") return
      const privateNote = {content: this.content}
      try {
        this.content = ""
        await API.graphql(graphqlOperation(createPrivateNote, {input: privateNote}))
      } catch (error) {
        error
      }
    },
    deletePrivateNote: async function (id) {
      if (!id) return
      try {
        this.content = ""
        await API.graphql(graphqlOperation(deletePrivateNote, {input: {id: id}}))
        // TODO subscribe or read
      } catch (error) {
        error
      }
    },
    displayPrivateNotes: async function () {
      let privateNotes = await API.graphql(graphqlOperation(
        listPrivateNotes, {limit: this.limit}
      ))
      this.privateNotes = _.orderBy(privateNotes.data.listPrivateNotes.items, 'updatedAt', 'desc').slice(0, 100)
      
      API.graphql(
        graphqlOperation(onCreatePrivateNote, {limit: this.limit, owner: this.owner})
      ).subscribe({
        next: (eventData) => {
          const privateNote = eventData.value.data.onCreatePrivateNote
          const privateNotes = [...this.privateNotes, privateNote]
          this.privateNotes = _.orderBy(privateNotes, 'updatedAt', 'desc').slice(0, 100)
        }
      })
    },
    singlePrivateNote: async function (selectedNote) {
      let privateNote = await API.graphql(graphqlOperation(
        getPrivateNote, {id: selectedNote.id}
      ))
      this.privateNote = privateNote
    }
  }
}
</script>
<style scoped>
  #icon {
    font-size: 20px;
    font-weight: bold;
    color: #2c3e50;
    bottom: 10px;
  }
  h1 {
    margin: 0 auto;
    width: 22rem;
    height: 4rem;
    overflow: hidden;
    box-shadow: .25rem 0 .25rem hsla(0, 0%, 0%, .1);
    background-image:
      linear-gradient(180deg, hsla(0, 0%, 45%, .1) 2rem, hsla(0, 100%, 100%, 0) 2.5rem)
    , linear-gradient(180deg, hsla(15, 100%, 85%, 1), hsla(15, 100%, 85%, 1));font-size: 1.7rem;
    line-height: 1.8;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .form {
    word-wrap: break-word;
    line-height: 1;
    text-align:center;     
    width: 275px;
    height: 180px;    
    margin: 25px;    
    padding-top:50px;
    position:relative;   
    border:1px solid #E8E8E8;  
    font-family:'Reenie Beanie';    
    font-size:22px;
    border-bottom-right-radius: 60px 5px;
    display:inline-block;
    left: 60px;
    background: -webkit-linear-gradient(-45deg, #ffff88 81%,#ffff88 82%,#ffff88 82%,#ffffc6 100%);
  }
  .submit {
    margin-bottom: 20px;
    font-size: 18px;
    text-align: center;
    position: relative;
    font-family: 'Reenie Beanie';       
    display: inline-block;
    top: 5px;
    right: 50px;     
  }
  .private-notes-area {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(275px, 1fr));
    border: 10px solid transparent;
    border-radius: 4px;
    background: linear-gradient(white, white), linear-gradient(#4d4d4d, #4d4d4d) no-repeat 100% 100% / 30px 30px, linear-gradient(#4d4d4d, #4d4d4d) no-repeat 0 100% / 30px 30px, linear-gradient(#4d4d4d, #4d4d4d) no-repeat 100% 0 / 30px 30px, linear-gradient(#4d4d4d, #4d4d4d) no-repeat 0 0 / 30px 30px, linear-gradient(#e6e6e6, #e6e6e6);
    background-clip: padding-box, border-box, border-box, border-box, border-box, border-box;
    background-origin: border-box;
  }
  .private-note {
    word-wrap: break-word;
    line-height: 1;
    text-align:center;     
    width: 275px;
    height: 180px;    
    margin: 25px;    
    padding-top:50px;
    position:relative;   
    border:1px solid #E8E8E8;  
    font-family:'Reenie Beanie';    
    font-size:22px;
    border-bottom-right-radius: 60px 5px;
    display:inline-block;
    background-image:
    linear-gradient(180deg, hsla(0, 0%, 45%, .1) 2rem, hsla(0, 100%, 100%, 0) 2.5rem), 
    linear-gradient(180deg, hsla(60, 100%, 85%, 1), hsla(60, 100%, 85%, 1));
  }

  div[color="blue"] {
    background-image:
    linear-gradient(180deg, hsla(0, 0%, 45%, .1) 2rem, hsla(0, 100%, 100%, 0) 2.5rem), 
    linear-gradient(180deg, hsla(200, 100%, 85%, 1), hsla(200, 100%, 85%, 1));
  }

  div[color="red"] {
    background-image:
    linear-gradient(180deg, hsla(0, 0%, 45%, .1) 2rem, hsla(0, 100%, 100%, 0) 2.5rem), 
    linear-gradient(180deg, hsla(15, 100%, 85%, 1), hsla(15, 100%, 85%, 1));
  }

.private-note:after {     
  content: "";
  position:absolute;
  z-index:-1;
  right:-0px; bottom:20px;
  width:200px;
  height: 25px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow:2px 15px 5px rgba(0, 0, 0, 0.40);
  -moz-transform: matrix(-1, -0.1, 0, 1, 0, 0);
  -webkit-transform: matrix(-1, -0.1, 0, 1, 0, 0);
  -o-transform: matrix(-1, -0.1, 0, 1, 0, 0);
  -ms-transform: matrix(-1, -0.1, 0, 1, 0, 0);
  transform: matrix(-1, -0.1, 0, 1, 0, 0);
}

.private-note:hover {     
    opacity: 80%;
}

a {
  position: absolute;
  top: 2%;
  left: 2%;
  opacity: 0%;
}

a:hover {
  opacity: 30%;
}

</style>