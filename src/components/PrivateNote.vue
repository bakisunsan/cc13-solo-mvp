<template>
  <div class="privateNote">
    <h1>Put Your Post-it</h1>
    <div class="private-notes-area">
      <div v-for="(privateNote, id) in privateNotes" v-bind:key="id">
        <div class="private-note">
          {{ privateNote.content }}
        </div>
      </div>
    </div>
    <div id="chat-form">
      <textarea v-model="content" name="content" class="form" placeholder="Content"></textarea><br/>
      <button class="submit" v-on:click="createPrivateNote()">Post</button>
    </div>
  </div>
</template>
<script>
import { API, Auth, graphqlOperation} from "aws-amplify"
import { createPrivateNote } from "../graphql/mutations"
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
      limit: 2 ** 31 - 1
    }
  },
  mounted: function () {
    this.setOwner().then(
      this.displayPrivateNotes()
    )
  },
  methods: {
    setOwner: async function () {
      const user = await Auth.currentUserInfo()
      this.owner = user.username
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
  .form {
    font-size: 20px;
    border: solid 1px gray;
    border-radius: 5px;
    height: 80px;
    width: 300px;
  }
  .submit {
    width: 300px;
    font-size: 20px;
    border-radius: 5px;
    vertical-align: top;
  }
  .private-notes-area {
    /*
    width: 300px;
    height: 300px;
    display: inline-block;
    overflow: scroll;
    */
  }
  .private-note {
  line-height: 1;
  text-align:center;     
  width: 275px;    
  margin: 25px;    
  min-height:100px;
  max-height:100px;
  padding-top:35px;
  position:relative;   
  border:1px solid #E8E8E8;  
  border-top:60px solid #fdfd86;
  font-family:'Reenie Beanie';    
  font-size:22px;      
  border-bottom-right-radius: 60px 5px;
  display:inline-block;    
   background: #ffff88; /* Old browsers */
background: -moz-linear-gradient(-45deg, #ffff88 81%, #ffff88 82%, #ffff88 82%, #ffffc6 100%); /* FF3.6+ */
background: -webkit-gradient(linear, left top, right bottom, color-stop(81%,#ffff88), color-stop(82%,#ffff88), color-stop(82%,#ffff88), color-stop(100%,#ffffc6)); /* Chrome,Safari4+ */
background: -webkit-linear-gradient(-45deg, #ffff88 81%,#ffff88 82%,#ffff88 82%,#ffffc6 100%); /* Chrome10+,Safari5.1+ */
background: -o-linear-gradient(-45deg, #ffff88 81%,#ffff88 82%,#ffff88 82%,#ffffc6 100%); /* Opera 11.10+ */
background: -ms-linear-gradient(-45deg, #ffff88 81%,#ffff88 82%,#ffff88 82%,#ffffc6 100%); /* IE10+ */
background: linear-gradient(135deg, #ffff88 81%,#ffff88 82%,#ffff88 82%,#ffffc6 100%); /* W3C */
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffff88', endColorstr='#ffffc6',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
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
</style>