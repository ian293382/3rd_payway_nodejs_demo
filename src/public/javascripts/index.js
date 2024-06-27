const serverDomain = 'http://localhost:30000'

const app = Vue.createApp ({
    data() {
        return {
            products: []
        }
    },
    // vue 是要在mount 階段才把資料撈出來 並且是打後端api 要用async await 直接(res, rej) 其中res 為 json函式
    async mounted() {
        // 這行就會把一開始設定好的東西塞進products裡面 v-for 
        this.products = await fetch(`${serverDomain}/products/list`).then(res => res.json())
        // 寫入資料用用console 去查看
        //console.log(this.products)
    }
})
// 將資料掛載到 id = app上才會顯示資料
app.mount('#app');