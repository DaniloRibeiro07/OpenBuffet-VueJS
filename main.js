const app = Vue.createApp({

  data(){
    const homeScreen = 0
    return {
      homeScreen: 0,
      detailsScreen: 1,
      screen: homeScreen,
      inputSearchBuffet: "",
      buffets: []
    }
  },

  async mounted(){
    this.getBuffets();
  },

  computed:{
    searchBuffets(){
      if(this.inputSearchBuffet){
        return this.buffets.filter((buffet) => {
          return buffet.trading_name.toLowerCase().includes(this.inputSearchBuffet)
        })
      }else{
        return this.buffets
      }
    }
  },

  methods: {
    async getBuffets(){
      let response = await fetch('http://127.0.0.1:3000/api/v1/buffet_registrations')
      let data = await response.json()
      this.buffets = data
      console.log(data)
    },

    changeView(view){
      if (view=='homeScreen'){
        this.screen = this.homeScreen
      }
    },

    async buffetDetails(id){
      let response = await fetch(`http://127.0.0.1:3000/api/v1/buffet_registrations/${id}`)
      let data = await response.json()
      this.buffet = data
      this.buffet.payment =  Object.keys(this.buffet.payment_method).filter( key => {
        return this.buffet.payment_method[key]
      })
      this.screen = this.detailsScreen
      console.log(data)
    }
  }
})

app.mount('#app')