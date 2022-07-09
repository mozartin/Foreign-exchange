window.onload = function () {

   let url = `https://api.exchangerate.host/latest`
   axios.get(url)
      .then((response) => {
         let month = document.getElementById('month')
         let from = document.getElementById('from')
         let to = document.getElementById('to')
         let from2 = document.getElementById('from2')
         let to2 = document.getElementById('to2')
         let date = document.getElementById('date')
         let btnOk = document.getElementById('btnOk')
         let latestTable = document.getElementById('latestTable')
         let nowMonth = new Date()
         let currentMonth1 = nowMonth.getMonth() < 10 ? `0${nowMonth.getMonth()+1}` : nowMonth.getMonth()+1
         let defaule = `${nowMonth.getFullYear()}-${currentMonth1}`
         console.log(defaule)
         month.setAttribute('value', defaule)
         for (const key in response.data.rates) {
            let option = document.createElement('option')
            option.setAttribute('name', key)
            option.innerText = key
            
            
            from.appendChild(option)
            
            let option2 = document.createElement('option')
            option2.setAttribute('name', key)
            option2.innerText = key
            
            from2.appendChild(option2)

            let optionTo = document.createElement('option')
            optionTo.setAttribute('name', key)
            optionTo.innerText = key
            to.appendChild(optionTo)


            let optionTo2 = document.createElement('option')
            optionTo2.setAttribute('name', key)
            optionTo2.innerText = key

            if(key == 'EUR'){
               option.setAttribute('selected', '')
               option2.setAttribute('selected', '')
            }
            if(key == 'UAH'){
               optionTo.setAttribute('selected', '')
               optionTo2.setAttribute('selected', '')
            }


            to2.appendChild(optionTo2)
            let tr = document.createElement('tr')
            latestTable.appendChild(tr)
            let td = document.createElement('td')
            tr.appendChild(td)
            let td2 = document.createElement('td')
            tr.appendChild(td2)
            td.innerText = key
            
            td2.innerText = response.data.rates[key]


         }



         jQuery(document).ready(function ($) {

            $('#latestTable').paginathing({
               perPage: 10,
               // containerClass: 'panel-footer'
               // insertAfter: '.table',
               // pageNumbers: true,
               limitPagination: 5,
               firstLast: false,
               prevText: 'Previous',
               nextText: 'Next',
               containerClass: 'my-pagination-container',
               ulClass: 'pagination my-pagination rounded',
               liClass: 'page my-page',
               activeClass: 'my-active',
            })
         });
         let currentDate = new Date()
         let currentDay = currentDate.getDate()
         let currentMonth = currentDate.getMonth() + 1
         let currentYear = currentDate.getFullYear()
         config = {
            dateFormat: "Y-m-d",
            disable: [
               {
                  from: `${currentYear}-${currentMonth}-${currentDay + 1}`,
                  to: "2092-09-01"
               }
            ],

            // mode: "multiple",
            dateFormat: "Y-m-d",
            defaultDate: [`${currentYear}-${currentMonth}-${currentDay}`]

         }
         flatpickr(date, config);





         let currency = from.value
         btnOk.addEventListener('click', () => {

            let spinner = document.getElementById('spinner')
            spinner.classList.add('display')
            document.getElementById('output').classList.remove('display-block')
            let dateNeeded = date.value
            let url = `https://api.exchangerate.host/${dateNeeded}`
            axios.get(url, {
               params: {
                  base: from.value,
                  symbols: to.value
               }
            })
               .then((response) => {
                  spinner.classList.remove('display')
                  let res = Object.values(response.data.rates)
                  console.log(res[0])
                  document.getElementById('output').classList.add('display-block')
                  let result = document.getElementById('result')
                  result.innerText = res[0]

                  from2.value = from.value
                  to2.value = to.value
                  chartMaker()
               })
               .catch((error) => {
                  console.log(error)
               })

         })
      })
      .catch((error) => {
         console.log(error)
      })
}


let month = document.getElementById('month')
// flatpickr(month, {})
month.addEventListener('change', () => {
   chartMaker()
})

chartMaker = () => {
   let url = `https://api.exchangerate.host/timeseries?`
   axios.get(url, {
      params: {
         base: from2.value,
         symbols: to2.value,
         start_date: `${month.value}-01`,
         end_date: `${month.value}-30`
      }
   })
      .then((response) => {
         showChart = () => {
            let labelsArr = []
            let dataArr = []
            for (const key in response.data.rates) {
               let res = String(key)
               res = res.slice(5, 10)
               labelsArr.push(res)
               dataArr.push(String(Object.values(response.data.rates[key])))
            }
            chart(labelsArr, dataArr)
         }
         showChart()
      })
      .catch((error) => {
         console.log(error)
      })
} 




let chart = (labels, data) => {
   chsrtBlock.innerHTML = ''

   let canv = document.createElement('canvas')
   chsrtBlock.appendChild(canv)
   canv.setAttribute('width', '100')
   canv.setAttribute('height', '80')
   const ctx = canv.getContext('2d');

   const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
         labels: labels,
         datasets: [{
            label: 'Month Rate',
            data: data,
            backgroundColor: [
               '#d2618c',
               '#f7e0f4',
               '#9db6c7',
               '#e3adca',
               '#dfd3eb',
               'rgb(78, 83, 155)'
            ],
            borderWidth: 1
         }]
      },
      options: {
         scales: {
            x: {
               stacked: true
            },
            y: {
               stacked: true
            }
         }
      }
   });
}


