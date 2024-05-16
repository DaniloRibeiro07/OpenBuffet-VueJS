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
      if (view == 'homeScreen'){
        this.screen = this.homeScreen
      }
    },

    translate(text){
      if(text == "pix"){
        return "Pix"
      }else if(text == "boleto"){
        return "Boleto"
      }else if(text == "credit_card"){
        return "Cartão de Crédito"
      }else if(text == "debit_card"){
        return "Cartão de Débito"
      }else if(text == "bitcoin"){
        return "Bitcoin"
      }else if(text == "money"){
        return "Dinheiro"
      }
    },

    async buffetDetails(id){
      let response = await fetch(`http://127.0.0.1:3000/api/v1/buffet_registrations/${id}`)
      let data = await response.json()
      console.log(data)

      this.buffet = data
      this.buffet.payment =  Object.keys(this.buffet.payment_method).filter( key => {
        return this.buffet.payment_method[key]
      })

      this.buffet.payment = this.buffet.payment.map((payment) => this.translate(payment))

      response = await fetch(`http://127.0.0.1:3000/api/v1/buffet_registrations/${id}/event_types`)
      data = await response.json()

      console.log(data)

      this.buffet.event_types = data

      this.buffet.event_types.forEach(element => {
        if (element.outsider && element.insider){
          element.insiderOutsider = "dentro ou fora do buffet"
        }else if(element.outsider){
          element.insiderOutsider = "apenas fora do buffet"
        }else{
          element.insiderOutsider = "apenas dentro do buffet"
        }
      });
      
      this.screen = this.detailsScreen
      
    }
  }
})

app.mount('#app')