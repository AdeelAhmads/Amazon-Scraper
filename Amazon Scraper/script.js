chrome.runtime.onMessage.addListener((mes, sender, response) => {
  function toUpperCase(searchCity) {
    const words = searchCity.split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    searchCity = words.join(" ");
    return searchCity;
  }

  //To capture reviews...
  function capture(NumOf_reviews, input_value) {
    let value = input_value;
    let inputValue = "input";
    let searchValue = "Searched";
    var parent = document.querySelector('div[class="a-section cr-list-loading reviews-loading aok-hidden"]');
    const observer = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        if ((!mutation.oldValue || !mutation.oldValue.match(/\baok-hidden\b/)) &&mutation.target.classList &&mutation.target.classList.contains("aok-hidden")) {
          console.log("No of page(s) Scraped:" + ++limit);

          //scrape reviews
          function myfunction() {
            let cards = document.querySelectorAll(".review");
            for (let card of cards) {
              var hasNumber = /\d/;
              //to check whether input is Rating?
              if (typeof value == "number") {
                if (value <= 5 && value > 0) {
                  inputValue = value;
                  let rating_data = card.querySelector(".a-icon-alt").innerText;
                  searchValue = parseInt(rating_data);
                }
              }
              //to check whether input is Date
              else if (hasNumber.test(value) && value.length <= 18) {
                const spaces = value.split(" ").length - 1;
                if (spaces == 1) {
                  inputValue = new Date(value);
                  inputValue = inputValue.getTime();
                  city_date = card.querySelector(".review-date").innerText;
                  let date = city_date.split("on");
                  searchValue = date.pop();
                  searchValue = new Date(searchValue);
                  searchValue = searchValue.getTime();
                }
              }
              //to check whether input is City
              else if (!hasNumber.test(value)) {
                inputValue = value;
                inputValue = inputValue.toLocaleLowerCase()
                let city_date = card.querySelector(".review-date").innerText;
                searchValue = city_date.substring(12,city_date.indexOf("on") - 6);
                searchValue=searchValue.toLocaleLowerCase()
                // console.log('search city without the:'+searchValue);
                if (searchValue.includes("the")) {
                  searchValue = city_date.substring(16,city_date.indexOf("on") - 6);
                  searchValue=searchValue.toLocaleLowerCase()
                  // console.log('search city with the:'+searchValue);

                }
              }
              //disconnecting  mutational Observer if input is not valid
              if (searchValue == "Searched" && inputValue == "input") {
                console.log("Not valid Input");
                observer.disconnect();
                break;
              }
              console.log("input value:" + inputValue);
              console.log("serached value:" + searchValue);
              //Compairing values to scrape data
              if (searchValue == inputValue) {
                
                let buyer = card.querySelector(".a-profile-name").innerText; //Name of buyer
                let rating_data = card.querySelector(".a-icon-alt").innerText;
                let rating = parseInt(rating_data); //Rating
                let title = card.querySelector(".review-title").innerText; //Review title
                city_date = card.querySelector(".review-date").innerText;
                city = city_date.substring(12, city_date.indexOf("on")); //City of buyer
                if (city.includes("the")) {
                  city = city_date.substring(16, city_date.indexOf("on") - 6);
                }
                let date = city_date.split("on");
                let date1 = date.pop(); //Review Date
                let body = card.querySelector(".review-text").innerText;

                //Geting images links
                let srcLink = [];
                let imageLinks = [];
                let length = card.querySelectorAll(".review-image-tile").length;
                if (length !== 0) {
                  for (let i = 0; i < length; i++) {
                    let imgLink =
                      card.querySelectorAll(".review-image-tile")[i].src;
                    finalImgLink = imgLink.replace("._SY88.jpg", ".jpg");
                    srcLink.push(finalImgLink); //images in the review section
                  }
                  imageLinks.push(srcLink);
                } else {
                  imageLinks.push("N/A");
                }
                //Object to store all scraped data from one page
                let review = {
                  Buyer: buyer || "N/A",
                  Rating: rating || "N/A",
                  Title: title || "N/A",
                  City: city || "N/A",
                  Date: date1 || "N/A",
                  Body: body || "N/A",
                  Image: imageLinks || "N/A",
                };
                //Storing reviews in the main array
                reviews.push(review);

                if (reviews.length == NumOf_reviews) break;
              }
            }
            let len = document.querySelectorAll(".a-last a").length;
            if (len == 1) {
              document.querySelector(".a-last a").click();
            } else {
              if (reviews.length != 0) {
                alert(
                  `Reviews have been ended and only ${reviews.length} reviews are scraped!`
                );
                observer.disconnect();
                download();
              } else {
                alert(
                  `Sorry we could'nt find any review for this input value:${inputValue}`
                );
              }
            }
            console.log("Scrped reviews:" + reviews.length);
            let res = toString(reviews.length);
            response({ reviews: res });
            response({ farewell: reviews.length });
            console.log("Input Reviews" + NumOf_reviews);
            if (reviews.length == NumOf_reviews) {
              alert(`${reviews.length} reviews are scraped`);
              console.log("break");
              observer.disconnect();
              download();
            }
          }
          setTimeout(myfunction, 2000);
        }
      }
    });

    //Calling mutational observer
    try {
      observer.observe(parent, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ["class"],
      });
    } catch (err) {
      console.log("some error");
    }
  }

  //main.....
  async function getCityNameAndNoOfReviews(numOfReviews, inputValue) {
    capture(numOfReviews, inputValue);
    if (limit == 0) {
      document.querySelector(".a-last a").click();
    }
  }

  //To downlaod reviews
  function download() {
    let rev = "";
    try {
      rev = Papa.unparse(reviews);
    } catch (err) {
      alert("Papaparse library in not used");
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += rev;

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Amazon Scrapes(city).csv");
    document.body.appendChild(link);

    link.click(); // This will download the data file named "my_data.csv".
  }

  let limit = 0;
  let reviews = [];
  let noOfReviews = mes.reviews;
  let value1 = mes.Value;
  console.log("Scrip option recieved:" + value1);
  getCityNameAndNoOfReviews(noOfReviews, value1);
});
