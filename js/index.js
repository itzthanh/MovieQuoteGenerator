"use strict";

$(document).ready(function () {

  //Quote generator that is an IIFE so private data cannot be modified. getQuote is
  //and quoteInfo are returned and are the only visible public properties. When
  //getQuote() is called, it sets and returns quoteInfo to be used as a Promise later.
  var quoteGenerator = function () {
    var url = "https://andruxnet-random-famous-quotes.p.mashape.com/?cat=movies";
    var apiHeader = new Headers({
      "X-Mashape-Key": "d4ddcaXPmFmshcMSqBCbIySnXxWsp1dbUj2jsn22jbSHOuLty9"
    });
    var init = {
      headers: apiHeader
    };
    var quoteInfo = {};

    var getQuote = function getQuote() {
      return fetch(url, init).then(function (response) {
        if (response.ok) {
          return response.json();
        }
      }).catch(function (networkError) {
        console.error('Error: ' + networkError);
        return Promise.reject(networkError);
      }).then(function (jsonResponse) {
        quoteInfo.quote = jsonResponse.quote;
        quoteInfo.author = jsonResponse.author;
        return quoteInfo;
      });
    };

    return {
      quoteInfo: quoteInfo,
      getQuote: getQuote
    };
  }();

  //Triggers when user clicks on a button and calls corresponding handler.
  //Twitter button: Checks to see if quote has been generated from quoteGenerator before
  //sharing it, if not, then button does nothing.
  //NewQuote button: Calls quoteGenerator to get a new quote and display to the page.
  //Could also make a "style" module to handle changing style/apperance of page.
  var clickHandler = function () {
    var triggerClicked = function triggerClicked() {
      $("#twitter").on("click", function (e) {
        e.preventDefault();
        var quoteInfo = quoteGenerator.quoteInfo;
        if (Object.keys(quoteInfo).length !== 0) {
          window.open("https://twitter.com/intent/tweet?hashtags=MovieQuotes&text=\"" + quoteInfo.quote + " - " + quoteInfo.author + " #MovieQuotes\"?");
        }
      });
      $("#newQuoteButton").on("click", function (e) {
        $(".quote-text").animate({ opacity: 0 }, 500).promise().then(function () {
          $("#quoteSection > h2").html("<div class='loader'></div>");
          $("#quoteSection > h4").html("");
          $(".quote-text").animate({ opacity: 1 }, 500);
        });
        quoteGenerator.getQuote().then(function (quoteInfo) {
          var colors = ["#193347", "#472d19", "#2d1947", "#19472d", "#474419", "#47191c", "#471933"];
          var colorChosen = colors[Math.floor(Math.random() * colors.length)];
          $(".quote-text").animate({ opacity: 0 }, 800).promise().then(function () {
            $(".quote-text").animate({ opacity: 1 }, 800);
            $("#quoteSection > h2").html("<i class='fa fa-quote-left'></i>" + quoteInfo.quote + "<i class='fa fa-quote-right'></i>");
            $("#author").html("<i>- " + quoteInfo.author + "</i>");
            $("body").animate({ backgroundColor: colorChosen }, 1000);
            $(".quote-text").animate({ color: colorChosen }, 700);
          });
        }).catch(function (e) {
          console.error(e);
        });
      });
    };
    return {
      handleClicks: triggerClicked
    };
  }();

  clickHandler.handleClicks();
});