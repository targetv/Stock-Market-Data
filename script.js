let state = {
  stocks: {
    stockdata: [],
    APPL: [],
    MSFT: [],
  },
  tickers: ["AAPL", "MSFT", "ATVI"],
};

function getStocksFromSever() {
  fetch(
    `http://api.marketstack.com/v1/eod?access_key=APIKEYHERE&symbols=${state.tickers}&limit=90`
  )
    .then((response) => response.json())
    .then((data) => {
      state.stocks.stockdata = data.data;
      render();
    });
}

function createElm(tag, attobj) {
  const elm = document.createElement(tag);
  for (const key of Object.keys(attobj)) {
    elm[key] = attobj[key];
  }
  return elm;
}

function setState(setState) {
  state = { ...state, ...setState };
  render();
}

function filterRenderCards() {
  const stockcards = document.querySelector(".stocksCards");
  let renderedCards = [];
  for (let i = 0; i < state.tickers.length; i++) {
    let test = state.stocks.stockdata.filter(function (stockTarget) {
      return stockTarget.symbol === state.tickers[i];
    });
    renderedCards = [...renderedCards, test];
  }
  for (const data of renderedCards) {
    const cardEl = stockCard(data);

    stockcards.append(cardEl);
  }
}

// for (let stock of renderedStocks) {
//   console.log(stock);
//   const cardEl = stockCard(stock);
//   stockcards.append(cardEl);
// }

function stockCard(stock) {
  const stockCard = createElm("div", { className: "stockcard" });
  const topSectionEL = createElm("div", { className: "top-seciton" });
  const tickerEL = createElm("h2", {
    className: "ticker",
    innerText: stock[0].symbol,
  });
  const stockGraph = createElm("div", { className: "stockgraph" });
  const lastPriceData = stock[29];
  const currentPriceData = stock[0];

  const overallDiffrence =
    ((currentPriceData.adj_close - lastPriceData.adj_close) /
      lastPriceData.adj_close) *
    100;
  let statsEL = createElm("h3", {
    className: "stats",
    innerText: `30 Days  ${overallDiffrence.toFixed(2)}%`,
  });
  if (overallDiffrence < 0) {
    statsEL.classList.add("negative");
    console.log("negative");
  } else {
    statsEL.classList.add("positive");
  }
  const statsSection = createElm("div", { className: "statsSection" });
  const historyEL = createElm("h3", { innerText: "7 Days History" });
  const ulEl = document.createElement("ul");
  const test = stock.slice(0, 7);
  for (const stock of test) {
    let date = new Date(stock.date);
    const liEl = createElm("li", {
      innerText: `${date.toLocaleDateString("en-GB")}  $ ${stock.adj_close}`,
    });
    ulEl.append(liEl);
  }

  topSectionEL.append(tickerEL, stockGraph, statsEL);
  statsSection.append(historyEL, ulEl);

  stockCard.append(topSectionEL, statsSection);
  return stockCard;
}

function render() {
  filterRenderCards();
}

function init() {
  getStocksFromSever();
}
init();
