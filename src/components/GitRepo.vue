

<template>
    <div >
        <div class="header"> 
            <h2 style="color: white;" > Git Repo  <span style="color: black ; margin-right:100px;"> {{owner}}/{{repo}}</span> <span></span>
            {{userName}}
            </h2>
        </div>
        <div class="form-container">

        <!-- Enter your name  -->

    <div class="form-inline" style="background-color: red;"  v-if="offUserEntry">
      <h3 >Please Enter Your name</h3>
  <input v-model="userName" placeholder="Name">
 <button @click="addName"> Submit User Name</button>
    </div>

      <div class="form-inline" >
  <label >Repo Owner</label>
  <input v-model="owner" placeholder="vuejs">
  <label >
    Repo Name
  </label>
  <input v-model="repo"  placeholder="vuefire" >
  
  <button @click="searchRepo"> Search Repo</button>

</div>
        </div>
        <div> 
          <h1 v-if="success">Successfully found the information</h1>
          <h1 v-if="error">Error occur</h1>
        </div>
        <div class="main-content" >

         <!-- <div id="chart">
     <apexchart type="pie" width="380" :options="chartOptions" :series="series"></apexchart>
      </div> -->
     <fusioncharts
      :type="type"
      :width="width"
      :height="height"
      :dataFormat="dataFormat"
      :dataSource="dataSource"
      >
      </fusioncharts>


      </div>
        </div>     
   
  
</template>


<script>
import gql from 'graphql-tag'
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';



Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
     owner:"nodejs",
     repo: "node",
     userName: " ",
     offUserEntry: true,
     success: false,
     error: false,
  },
  plugins: [createPersistedState()],
  mutations: {
    changeOwner: (state, newOwner) => state.owner = newOwner,
    changeRepo: (state,repo)=> state.repo = repo,
    setUserName: (state, newUser) =>state.userName= newUser ,
    setOffUserEntry: state => state.offUserEntry = false,
    setSuccess: (state,bool) => state.success = bool,
    setError: (state,bool) => state.error = bool,
  }
});






export default{
   apollo: {
    // Simple query that will update the 'hello' vue property
  getContributors: gql`query {
      getContributors(owner:"nodejs" ,repo:"node"){
   login,
   contributions
  }
    }`,
  },


  data: function(){
       return{ 
//NecessaryData
       
         offUserEntry: store.state.offUserEntry,
         userName:store.state.userName,
         owner: store.state.owner,
         repo:store.state.repo,
         success: store.state.success,
         error: store.state.error,

         //Chart Data

    chartData: [],
    type: 'pie2d',
    width: '100%',
    height: '500',
    dataFormat: 'json',
    data: {
    caption: "Top 50 Contributors in this repo",
    plottooltext: "<b>$percentValue</b> of web servers run on $label servers",
    subcaption: " in pie chart",
    xaxisname: "Country",
    yaxisname: "Reserves (MMbbl)",
    numbersuffix: "K",
    theme: "fusion",
    showlegend: "0"
  },
    dataSource:{
        chart: this.data,
  data: this.chartData
  },

      }
    },


 
   mounted () {
      
   console.log(this.getContributors);
 const userName =  store.state.userName; 
   
setTimeout(()=>{
this.setDataToChart(this.getContributors);
if(this.getContributors){
  this.setDataToChart(this.getContributors)
 }
      }, 1500)
 



 if(userName){
     store.commit('setOffUserEntry')
   this.userName = userName;
      }
 
  
 },
methods:{
      addName(){
       if(this.userName){
         const userName=this.userName
  store.commit('setUserName', userName );
  store.commit( 'setOffUserEntry');
  this.offUserEntry = false;
  return;
        }
  return null;
      },

  setDataToChart(data){
    if(data){
     this.chartData = data.map(data1=>{
        const name = `Hi ${data1.login} your distribution of first 50 contributors are`
        const data= {
          label: name,
          value:  data1.contributions
        } 
        return data;
      });

      console.log(this.chartData);

      this.dataSource  ={
         chart: this.data,
      data: this.chartData
      }

    }if(!data){
       this.dataSource  ={
         chart: null,
      data: null
      }
    }
 
      },

   async  searchRepo(){
      this.success = false;
      this.error = false;
    try{
const responce = await this.$apollo.mutate({
      // Query
      mutation: gql`mutation($owner: String, $repo:String){
  getContributors(owner:$owner,repo:$repo){
  login,
  contributions
  }
}`, 
 // Parameters
      variables: {
        owner: this.owner,
        repo: this.repo
      },
    });
    

     
     
    const data = responce.data.getContributors;
    if(data){
      this.success =true;
      this.setDataToChart(data);
    }else{
     this.error = true;
this.setDataToChart(null);
    }

    }catch(err){
      console.log(err.message);
    } 

     

   }
   },
    
    
       
        }


</script>


<style  scoped>
   .header{
     text-align: center;
     padding: 15px;
        height: 50px;
        background-color: rgb(56, 209, 209);
        justify-content: center;
        align-self: center;
        font-style: italic;
   }
   .main-content{
        display: flex;
        justify-content: center;
   }
   .form-inline {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  background-color: rgb(243, 232, 128);
  padding: 10px;
}

/* Add some margins for each label */
.form-inline label {
  margin: 5px 10px 5px 0;
}

/* Style the input fields */
.form-inline input {
  vertical-align: middle;
  margin: 5px 10px 5px 0;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
}

/* Style the submit button */
.form-inline button {
  padding: 10px 20px;
  background-color: #65da9f;
  border: 1px solid #ddd;
  border-radius: 8px;
  color: white;
}

.form-inline button:hover {
  background-color: rgb(69, 172, 66);
}

/* Add responsiveness - display the form controls vertically instead of horizontally on screens that are less than 800px wide */
@media (max-width: 800px) {
  .form-inline input {
    margin: 10px 0;
  }

  .form-inline {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
