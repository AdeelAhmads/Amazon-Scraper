

//selects filters
const radioButtons = document.querySelectorAll('input[name="option"]');
for (const radioButton of radioButtons) 
{
     radioButton.onclick = function() {
          if(this.value=='country'){
               document.querySelector('.country').style.display='block'
               document.querySelector('.rating').style.display='none'
               document.querySelector('.date').style.display='none'
          }
          else if(this.value=="rating"){
               document.querySelector('.rating').style.display='block'
               document.querySelector('.country').style.display='none'
               document.querySelector('.date').style.display='none'
          }
          else if(this.value=='date'){
               document.querySelector('.rating').style.display='none'
               document.querySelector('.country').style.display='none'
               document.querySelector('.date').style.display='block'
          }
      }
}

//Validates reviews quantity
let Qnt_reviews=document.getElementById('Qnt_reviews')
Qnt_reviews.addEventListener('input',function(){
     var text=this.value;
     text=parseInt(text)
     if(text>100000 || text<1){
      alert('Please writes reviews under 100000')
     }
})

//Passes information 
document.getElementById('submit').addEventListener('click',function(){
    chrome.tabs.query({currentWindow:true,active:true}, function(tabs){
          let numOfReviews= document.getElementById('Qnt_reviews').value
          let filter;
          let value;
          let date;
          const radioButtons = document.querySelectorAll('input[name="option"]');
         
          for (const radioButton of radioButtons) {
              if (radioButton.checked) {
                  filter = radioButton.value;
                  if(filter=='country'){
                    value=document.querySelector('.country').value
                    console.log(value);
                   
                  }
                  else if(filter=='rating'){
                    value=document.querySelector('.rating').value
                    value=parseInt(value)
                    
                  }
                  else if(filter=='date'){
                    value=document.querySelector('.date').value
                    console.log(value.length)
                    value=dateformat(value)
                    date=value.length
                  }
              }
          }
            var activeTab=tabs[0]
            let pass=weblink(tabs[0].url)
            if(pass)
            {
               if(date!=11 && numOfReviews.length!=0){
                    chrome.tabs.sendMessage(activeTab.id,{Value:value,reviews:numOfReviews})
                  }
                  else{
                     document.querySelector('.msg2').style.display='block'
                  }  
            }
            else{
               document.querySelector('.msg').style.display='block'
            }
    });
});
    
function weblink(link)
{   
    const str1 = link
    console.log(str1)
    let test1=str1.includes('www.amazon.com');
    let test2=str1.includes('product-reviews')
    if(test1 && test2){
     return true
    }
    else{
     return false
    }
}


//Converts date into LL format
function dateformat(date){
     let arr=[]
     let month=''
     arr=date.split('-')
    
     if(arr[1]=="01")
     {
          month='January'
     }
     if(arr[1]=="02")
     {
          month='February'
     }
     if(arr[1]=="03")
     {
          month='March'
     }
     if(arr[1]=="04")
     {
          month='April'
     }
     if(arr[1]=="05")
     {
          month='May'
     }
     if(arr[1]=="06")
     {
          month='June'
     }
     if(arr[1]=="07")
     {
          month='July'
     }
     if(arr[1]=="08")
     {
          month='August'
     }
     if(arr[1]=="09")
     {
          month='September'
     }
     if(arr[1]=="10")
     {
          month='October'
     }
     if(arr[1]=="11")
     {
          month='November'
     }
     if(arr[1]=="12")
     {
          month='December'
     }
     
   return `${month} ${arr[2]},${arr[0]}`
}