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
          return buffet.trading_name.toLowerCase().includes(this.inputSearchBuffet.toLowerCase())
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

    convertDatetoBr(date){
      const dateSplit = date.split("-")
      return (dateSplit[2] + '/' + dateSplit[1] + '/' + dateSplit[0])
    },

    displayData(element){
      if( element.srcElement.nodeName  != 'DIV'){
        element = element.srcElement.parentElement.nextElementSibling.classList.toggle("hidden")
      }else{
        element.srcElement.nextElementSibling.classList.toggle("hidden")
      }
    },

    getDate(){
      let today = new Date();
      let dd = String(today.getDate()).padStart(2, '0')
      let mm = String(today.getMonth() + 1).padStart(2, '0')
      let yyyy = today.getFullYear()

      return (yyyy+'-' + mm + '-' + dd )
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
      
    },

    async consult(element){
      const amountOfPeople = element.srcElement['amountOfPeople'].value
      const date = element.srcElement['date'].value
      const id = element.srcElement['id'].value
      
      let response = await fetch(`http://localhost:3000/api/v1/event_types/${id}/orders?date=${date}&amount_of_people=${amountOfPeople}`, {method: "POST"})
      console.log(response.status)
      let data = await response.json()
      divResult = element.srcElement.parentElement.nextElementSibling
      
      if (response.status == 200){
        divResult.innerHTML = `
          <h3>Valor Previsto</h3>
          <strong>Evento para o dia:</strong> ${this.convertDatetoBr(date)} <br>
          <strong>Quantidade de pessoas:</strong> ${amountOfPeople} <br>
          <strong>Valor previsto:</strong> R$ ${data.prior_value.toFixed(2)}
          `
      }else{
        divResult.innerHTML = `
        <h3>Erro ao consultar a disponibilidade:</h3>
        <strong>Motivo</strong>: ${data.errors}
        `
      }

    }
  }
})

app.mount('#app')