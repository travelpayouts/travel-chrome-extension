!function(e){function n(r){if(t[r])return t[r].exports;var a=t[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,n),a.l=!0,a.exports}var t={};n.m=e,n.c=t,n.i=function(e){return e},n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=6)}([function(e,n){var t=function(e){var n=Math.floor(e/10);return{number:n,index:e-10*n}};e.exports={get_chunk_info:t,get_deal_by_index:function(e,n){var r=t(e),a="deals_"+r.number.toString();chrome.storage.sync.get(a,function(e){var t=e[a];n(t[r.index])})},items_per_key:10}},,,function(e,n){e.exports=[{price:null,destination_name:"Сан-Марино, Италия",search_url:null,image_url:"img/san-marino.jpg"},{price:null,destination_name:"Шефшауэн, Марокко",search_url:null,image_url:"img/chefchaouen.jpg"},{price:null,destination_name:"Гонконг, Гонконг",search_url:null,image_url:"img/hong-kong.jpg"},{price:null,destination_name:"Амстердам, Нидерланды",search_url:null,image_url:"img/amsterdam.jpg"},{price:null,destination_name:"Мале, Мальдивская Республика",search_url:null,image_url:"img/male.jpg"},{price:null,destination_name:"Гальштат, Австрия",search_url:null,image_url:"img/hallstatt.jpg"}]},,,function(e,n,t){var r=t(3),a=t(0),i=function(e){e.classList.remove("hidden")},l=function(e){e.classList.add("hidden")},o=function(){var e=["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],n=[],t=new Date;t.setDate(1);for(var r=0;r<12;r++){future_date=new Date(t),future_date.setMonth(future_date.getMonth()+r);var a=("0"+(future_date.getMonth()+1)).slice(-2);n.push({id:future_date.getFullYear()+"-"+a,month_name:e[future_date.getMonth()]})}return n},c=function(){var e=document.createElement("div");e.classList.add("preloader");for(var n=0;n<3;n++)!function(t){var r=document.createElement("div");r.classList.add("item"),r.classList.add("item-"+(n+1)),e.appendChild(r)}();return e},d=function(e,n){for(var t=document.createElement(e),r=n.length-1;r>=0;r--)t.classList.add(n[r]);return t},u=function(e){for(var n=document.querySelector(".prices-calendar"),t=e.length-1;t>=0;t--)!function(e){var t=n.querySelector("#month-"+e.id),r=t.querySelector(".prices-calendar-preloader"),a=t.querySelector(".prices-calendar-month_dates"),i=d("span",["price_value"]);r.innerHTML="",e.price?(r.appendChild(document.createTextNode("от ")),i.innerText=e.price.toLocaleString(),r.appendChild(i),r.appendChild(document.createTextNode(" ₽")),t.classList.add("has-price"),t.setAttribute("href",e.search_url),t.setAttribute("target","_blank")):r.innerText="—",a.innerText=e.dates}(e[t]);console.log(e)},s=function(e){var n=e.split("-");return n[2]+" "+["янв","фев","мар","апр","мая","июн","июл","авг","сен","окт","ноя","дек"][Number(n[1])-1]},p=function(e,n,t,r){var a=t.split("-"),i=r.split("-");return"https://search.aviasales.ru/"+e+a[2]+a[1]+n+i[2]+i[1]+1};!function(e){chrome.storage.sync.get(["next_deal_index","deals_length"],function(n){var t=n.next_deal_index;0!=n.deals_length&&navigator.onLine?a.get_deal_by_index(t,function(r){console.log("choose deal",r),e(r),chrome.storage.sync.set({next_deal_index:(t+1)%n.deals_length})}):(console.log("use_default_deals",r[Math.floor(Math.random()*r.length+1)-1]),e(r[Math.floor(Math.random()*r.length+1)-1]))})}(function(e){var n=document.querySelectorAll(".blackout")[0];l(n),function(){var e=o(),n=document.querySelectorAll(".prices-calendar-container")[0],t=document.createElement("div");t.classList.add("prices-calendar");for(var r=0;r<e.length;r++)!function(e){var n=d("a",["prices-calendar-month"]),r=d("div",["prices-calendar-preloader","price"]),a=d("div",["date_container"]),i=d("div",["prices-calendar-month_name","slider-elem"]),l=d("div",["prices-calendar-month_dates","slider-elem"]);n.setAttribute("id","month-"+e.id),i.innerText=e.month_name,a.appendChild(i),a.appendChild(l),r.appendChild(c()),n.appendChild(r),n.appendChild(a),t.appendChild(n)}(e[r]);n.appendChild(t)}(),function(e,n,t){var r=new XMLHttpRequest,a="http://api.travelpayouts.com/v1/prices/monthly?currency=RUB&origin="+e+"&destination="+n+"&token=2db8244a0b9521ca2b0e0fbb24c4d1015b7e7a6b",i=o();r.open("GET",a,!0),r.onload=function(){if(200==r.status){year_data=JSON.parse(r.responseText).data;for(var a=0;a<i.length;a++){if(year_data[i[a].id]){var l=year_data[i[a].id],o=l.departure_at.slice(0,10),c=l.return_at.slice(0,10);i[a].price=l.price}else var o=i[a].id+"-01",c=i[a].id+"-08";i[a].dates=s(o)+" - "+s(c),i[a].search_url=p(e,n,o,c)}t(i)}},r.send()}(e.origin_iata,e.destination_iata,u),function(e,n){var t=document.body,r=new Image;r.onload=function(){console.log("IMG loaded"),n()},t.setAttribute("style","background-image:url("+e.image_url+")"),r.src=e.image_url}(e,function(){i(n),function(e){var n=document.querySelectorAll(".btn-container")[0],t=n.querySelector(".prices-calendar-container"),r=n.querySelectorAll(".btn-price")[0],a=r.querySelectorAll(".btn-price-value")[0],o=!1;l(n),e.price&&(a.innerText=e.price.toLocaleString(),r.onclick=function(e){o?(o=!1,t.classList.add("prices-calendar-container--hidden")):(o=!0,t.classList.remove("prices-calendar-container--hidden"))},i(n))}(e),function(e){var n=document.querySelectorAll(".destination")[0];n.innerText=e.destination_name,i(n)}(e),function(e){var n=document.querySelectorAll(".origin-container")[0],t=n.querySelectorAll(".origin")[0];l(n),e.origin_name&&(t.innerText="из "+e.origin_name,i(n))}(e),function(e){var n=document.querySelectorAll(".tags-container")[0],t=n.querySelectorAll(".tags")[0];if(l(n),t.innerHtml="",e.tags&&e.tags.length>0){for(var r=e.tags.length-1;r>=0;r--)!function(e){var n=document.createElement("span");n.classList.add("tag"),n.innerText=e,t.appendChild(n)}(e.tags[r]);i(n)}}(e),function(e){var n=document.querySelectorAll(".review-container")[0].querySelector(".review"),t=n.querySelector(".review-content"),r=t.querySelector(".review-title"),a=t.querySelector(".review-text"),o=t.querySelector(".review-author"),c=t.querySelector(".review-date");l(n),e.review&&(r.innerText=e.review.title,a.innerText=e.review.text,o.innerText=e.review.author,c.innerText=e.review.date,i(n))}(e)})})}]);