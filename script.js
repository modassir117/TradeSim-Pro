
const INITIAL_BALANCE = 100000;

let currentUser = null;
let selectedStock = null;
let detailStockSymbol = null;

let portfolioChartInstance = null;
let stockLineChartInstance = null;

let priceSimulationInterval = null;


/* ================= LOCAL STORAGE ================= */

let usersData = {};

try {
    usersData =
        JSON.parse(
            localStorage.getItem("tradeSimUsers")
        ) || {};
} catch (error) {

    console.error(
        "Could not read Local Storage:",
        error
    );

    usersData = {};
}


/* =========================================================
   LANGUAGE
   ========================================================= */

const translations = {

    en: {
        market: "Market",
        portfolio: "Portfolio",
        watchlist: "Watchlist",
        orders: "Orders",
        how_to_use: "How to Use",
        about_app: "About App",
        virtual_cash: "Virtual Cash",
        welcome: "Welcome",
        logout: "Logout",
        buy: "BUY",
        sell: "SELL"
    },

    hi: {
        market: "बाज़ार",
        portfolio: "पोर्टफोलियो",
        watchlist: "वॉचलिस्ट",
        orders: "ऑर्डर",
        how_to_use: "उपयोग कैसे करें",
        about_app: "ऐप के बारे में",
        virtual_cash: "वर्चुअल कैश",
        welcome: "स्वागत है",
        logout: "लॉग आउट",
        buy: "खरीदें",
        sell: "बेचें"
    },

    te: {
        market: "మార్కెట్",
        portfolio: "పోర్ట్‌ఫోలియో",
        watchlist: "వాచ్‌లిస్ట్",
        orders: "ఆర్డర్లు",
        how_to_use: "ఎలా వాడాలి",
        about_app: "యాప్ గురించి",
        virtual_cash: "వర్చువల్ క్యాష్",
        welcome: "స్వాగతం",
        logout: "లాగ్అవుట్",
        buy: "కొనుగోలు",
        sell: "అమ్మకం"
    },

    ta: {
        market: "சந்தை",
        portfolio: "போர்ட்ஃபோலியோ",
        watchlist: "பட்டியல்",
        orders: "ஆர்டர்கள்",
        how_to_use: "எப்படி பயன்படுத்துவது",
        about_app: "ஆப் பற்றி",
        virtual_cash: "மெய்நிகர் பணம்",
        welcome: "வரவேற்பு",
        logout: "வெளியேறு",
        buy: "வாங்கு",
        sell: "விற்க"
    },

    kn: {
        market: "ಮಾರುಕಟ್ಟೆ",
        portfolio: "ಪೋರ್ಟ್ಫೋಲಿಯೊ",
        watchlist: "ವೀಕ್ಷಣಾಪಟ್ಟಿ",
        orders: "ಆದೇಶಗಳು",
        how_to_use: "ಬಳಸುವುದು ಹೇಗೆ",
        about_app: "ಅಪ್ಲಿಕೇಶನ್ ಬಗ್ಗೆ",
        virtual_cash: "ವರ್ಚುವಲ್ ನಗದು",
        welcome: "ಸ್ವಾಗತ",
        logout: "ಲಾಗ್ ಔಟ್",
        buy: "ಖರೀದಿಸಿ",
        sell: "ಮಾರಿ"
    }

};


/* =========================================================
   MARKET DATA
   ========================================================= */

let marketData = [

    {
        symbol: "RELIANCE",
        name: "Reliance Industries",
        basePrice: 2450,
        price: 2450,
        change: 0,
        history: [],
        fund: {
            mcap: "16.5L Cr",
            pe: "25.4",
            roe: "18.2%",
            yield: "0.4%",
            high: "₹2600",
            low: "₹2100"
        }
    },

    {
        symbol: "TCS",
        name: "Tata Consultancy",
        basePrice: 3520.50,
        price: 3520.50,
        change: 0,
        history: [],
        fund: {
            mcap: "13.2L Cr",
            pe: "30.1",
            roe: "43.5%",
            yield: "1.2%",
            high: "₹3650",
            low: "₹3100"
        }
    },

    {
        symbol: "HDFCBANK",
        name: "HDFC Bank",
        basePrice: 1600.25,
        price: 1600.25,
        change: 0,
        history: [],
        fund: {
            mcap: "11.8L Cr",
            pe: "16.5",
            roe: "16.8%",
            yield: "1.0%",
            high: "₹1720",
            low: "₹1480"
        }
    },

    {
        symbol: "INFY",
        name: "Infosys Ltd",
        basePrice: 1450.10,
        price: 1450.10,
        change: 0,
        history: [],
        fund: {
            mcap: "6.1L Cr",
            pe: "24.2",
            roe: "31.8%",
            yield: "2.1%",
            high: "₹1620",
            low: "₹1350"
        }
    },

    {
        symbol: "ITC",
        name: "ITC Limited",
        basePrice: 440.30,
        price: 440.30,
        change: 0,
        history: [],
        fund: {
            mcap: "5.5L Cr",
            pe: "27.8",
            roe: "29.1%",
            yield: "3.5%",
            high: "₹499",
            low: "₹399"
        }
    },

    {
        symbol: "TATAMOTORS",
        name: "Tata Motors",
        basePrice: 620.80,
        price: 620.80,
        change: 0,
        history: [],
        fund: {
            mcap: "2.3L Cr",
            pe: "16.0",
            roe: "11.5%",
            yield: "0.3%",
            high: "₹650",
            low: "₹400"
        }
    },

    {
        symbol: "ICICIBANK",
        name: "ICICI Bank",
        basePrice: 950.40,
        price: 950.40,
        change: 0,
        history: [],
        fund: {
            mcap: "6.6L Cr",
            pe: "17.2",
            roe: "17.1%",
            yield: "0.8%",
            high: "₹1010",
            low: "₹790"
        }
    },

    {
        symbol: "ZOMATO",
        name: "Zomato Ltd",
        basePrice: 95.50,
        price: 95.50,
        change: 0,
        history: [],
        fund: {
            mcap: "0.8L Cr",
            pe: "NA",
            roe: "-4.2%",
            yield: "0.0%",
            high: "₹102",
            low: "₹48"
        }
    },

    {
        symbol: "SBIN",
        name: "State Bank of India",
        basePrice: 580.10,
        price: 580.10,
        change: 0,
        history: [],
        fund: {
            mcap: "5.2L Cr",
            pe: "9.5",
            roe: "16.2%",
            yield: "1.9%",
            high: "₹629",
            low: "₹499"
        }
    },

    {
        symbol: "BHARTIARTL",
        name: "Bharti Airtel",
        basePrice: 880.60,
        price: 880.60,
        change: 0,
        history: [],
        fund: {
            mcap: "4.9L Cr",
            pe: "54.2",
            roe: "11.8%",
            yield: "0.5%",
            high: "₹905",
            low: "₹740"
        }
    },

    {
        symbol: "BAJFINANCE",
        name: "Bajaj Finance",
        basePrice: 7200,
        price: 7200,
        change: 0,
        history: [],
        fund: {
            mcap: "4.3L Cr",
            pe: "35.2",
            roe: "23.5%",
            yield: "0.4%",
            high: "₹7800",
            low: "₹5500"
        }
    },

    {
        symbol: "ASIANPAINT",
        name: "Asian Paints",
        basePrice: 3200.50,
        price: 3200.50,
        change: 0,
        history: [],
        fund: {
            mcap: "3.1L Cr",
            pe: "65.1",
            roe: "27.5%",
            yield: "0.8%",
            high: "₹3560",
            low: "₹2700"
        }
    },

    {
        symbol: "HUL",
        name: "Hindustan Unilever",
        basePrice: 2500.20,
        price: 2500.20,
        change: 0,
        history: [],
        fund: {
            mcap: "5.9L Cr",
            pe: "58.4",
            roe: "20.1%",
            yield: "1.5%",
            high: "₹2750",
            low: "₹2350"
        }
    },

    {
        symbol: "MARUTI",
        name: "Maruti Suzuki",
        basePrice: 10400,
        price: 10400,
        change: 0,
        history: [],
        fund: {
            mcap: "3.1L Cr",
            pe: "29.2",
            roe: "15.4%",
            yield: "0.8%",
            high: "₹10800",
            low: "₹8100"
        }
    },

    {
        symbol: "WIPRO",
        name: "Wipro Ltd",
        basePrice: 410.80,
        price: 410.80,
        change: 0,
        history: [],
        fund: {
            mcap: "2.1L Cr",
            pe: "19.5",
            roe: "16.4%",
            yield: "1.1%",
            high: "₹440",
            low: "₹360"
        }
    }

];


/* =========================================================
   CREATE INITIAL CHART HISTORY
   ========================================================= */

marketData.forEach(stock => {

    let tempPrice = stock.basePrice;

    for (let i = 0; i < 20; i++) {

        tempPrice =
            tempPrice *
            (1 + (Math.random() * 0.01 - 0.005));

        stock.history.push(tempPrice);
    }

    stock.history.push(stock.price);
});


/* =========================================================
   LANGUAGE FUNCTION
   ========================================================= */

window.changeLanguage = function () {

    const select =
        document.getElementById("lang-select");

    if (!select) return;

    const lang = select.value;

    document
        .querySelectorAll("[data-i18n]")
        .forEach(element => {

            const key =
                element.getAttribute("data-i18n");

            if (
                translations[lang] &&
                translations[lang][key]
            ) {

                element.innerText =
                    translations[lang][key];
            }

        });

    if (currentUser) {

        renderMarket();

        if (
            document
                .getElementById("portfolio")
                .classList
                .contains("active-tab")
        ) {
            renderPortfolio();
        }

        if (
            document
                .getElementById("watchlist")
                .classList
                .contains("active-tab")
        ) {
            renderWatchlist();
        }
    }
};


/* =========================================================
   LOGIN / SIGNUP
   ========================================================= */

window.login = function () {

    const usernameInput =
        document.getElementById("username");

    const passwordInput =
        document.getElementById("password");

    const user =
        usernameInput.value.trim();

    const pass =
        passwordInput.value.trim();


    /* VALIDATION */

    if (!user || !pass) {

        alert(
            "Please enter username and password!"
        );

        return;
    }


    /* ================= CONSOLE DEBUG ================= */

    console.log(
        "========================================"
    );

    console.log(
        "        TRADE SIM PRO LOGIN"
    );

    console.log(
        "========================================"
    );

    console.log(
        "Username:",
        user
    );

    console.log(
        "Password:",
        pass
    );


    /* ================= NEW USER ================= */

    if (!usersData[user]) {

        usersData[user] = {

            password: pass,

            balance: INITIAL_BALANCE,

            portfolio: {},

            history: [],

            watchlist: []

        };

        console.log(
            "Status: New user created"
        );

    }


    /* ================= EXISTING USER ================= */

    else {

        const existingUser =
            usersData[user];


        /* Repair old Local Storage */

        existingUser.portfolio =
            existingUser.portfolio || {};

        existingUser.history =
            existingUser.history || [];

        existingUser.watchlist =
            existingUser.watchlist || [];


        if (
            typeof existingUser.balance !==
            "number"
        ) {

            existingUser.balance =
                INITIAL_BALANCE;
        }


        /* PASSWORD CHECK */

        if (
            existingUser.password !==
            pass
        ) {

            console.log(
                "Status: Incorrect password"
            );

            alert(
                "Incorrect Password!"
            );

            return;
        }

        console.log(
            "Status: Existing user logged in"
        );
    }


    /* ================= SET CURRENT USER ================= */

    currentUser = user;

    saveData();


    console.log(
        "Current User:",
        currentUser
    );

    console.log(
        "User Data:",
        usersData[currentUser]
    );

    console.log(
        "========================================"
    );


    /* ================= SHOW APP ================= */

    document
        .getElementById("auth-screen")
        .classList
        .add("hidden");

    document
        .getElementById("app-screen")
        .classList
        .remove("hidden");

    document
        .getElementById("bg-orbs")
        .classList
        .add("hidden");


    document
        .getElementById("display-user")
        .innerText =
        currentUser;


    initApp();

};


/* =========================================================
   ENTER KEY LOGIN
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const passwordInput =
            document.getElementById("password");

        if (passwordInput) {

            passwordInput.addEventListener(
                "keydown",
                function (event) {

                    if (event.key === "Enter") {

                        window.login();
                    }

                }
            );
        }

    }
);


/* =========================================================
   LOGOUT
   ========================================================= */

window.logout = function () {

    stopPriceSimulation();

    currentUser = null;

    document
        .getElementById("app-screen")
        .classList
        .add("hidden");

    document
        .getElementById("auth-screen")
        .classList
        .remove("hidden");

    document
        .getElementById("bg-orbs")
        .classList
        .remove("hidden");

    document
        .getElementById("username")
        .value = "";

    document
        .getElementById("password")
        .value = "";

};


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function saveData() {

    localStorage.setItem(
        "tradeSimUsers",
        JSON.stringify(usersData)
    );
}


/* =========================================================
   GET CURRENT USER
   IMPORTANT FIX FOR watchlist ERROR
   ========================================================= */

function getUserData() {

    if (
        !currentUser ||
        !usersData[currentUser]
    ) {

        return null;
    }


    const user =
        usersData[currentUser];


    /* Repair missing properties */

    user.portfolio =
        user.portfolio || {};

    user.history =
        user.history || [];

    user.watchlist =
        user.watchlist || [];


    if (
        typeof user.balance !==
        "number"
    ) {

        user.balance =
            INITIAL_BALANCE;
    }


    return user;
}


/* =========================================================
   INIT APP
   ========================================================= */

function initApp() {

    changeLanguage();

    updateBalance();

    renderMarket();

    renderHistory();

    initPortfolioChart();

    startPriceSimulation();

}


/* =========================================================
   PRICE SIMULATION START
   ========================================================= */

function startPriceSimulation() {

    stopPriceSimulation();

    priceSimulationInterval =
        setInterval(
            simulatePrices,
            3000
        );
}


/* =========================================================
   STOP PRICE SIMULATION
   ========================================================= */

function stopPriceSimulation() {

    if (priceSimulationInterval) {

        clearInterval(
            priceSimulationInterval
        );

        priceSimulationInterval = null;
    }
}


/* =========================================================
   SWITCH TAB
   ========================================================= */

window.switchTab = function (
    tabId,
    event
) {

    document
        .querySelectorAll(".tab-content")
        .forEach(tab => {

            tab.classList.add("hidden");

            tab.classList.remove(
                "active-tab"
            );

        });


    const selectedTab =
        document.getElementById(tabId);

    if (!selectedTab) return;


    selectedTab.classList.remove(
        "hidden"
    );

    selectedTab.classList.add(
        "active-tab"
    );


    document
        .querySelectorAll(".nav-btn")
        .forEach(button => {

            button.classList.remove(
                "active"
            );

        });


    if (
        event &&
        event.currentTarget
    ) {

        event.currentTarget.classList.add(
            "active"
        );

    } else {

        const nav =
            document.getElementById(
                "nav-" + tabId
            );

        if (nav) {

            nav.classList.add(
                "active"
            );
        }
    }


    if (tabId === "portfolio") {

        renderPortfolio();
    }


    if (tabId === "watchlist") {

        renderWatchlist();
    }


    if (tabId === "history") {

        renderHistory();
    }

};


/* =========================================================
   UPDATE BALANCE
   ========================================================= */

function updateBalance() {

    const user =
        getUserData();

    if (!user) return;


    const balanceElement =
        document.getElementById(
            "wallet-balance"
        );


    balanceElement.innerText =
        "₹" +
        user.balance.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
}


/* =========================================================
   SIMULATE PRICES
   ========================================================= */

function simulatePrices() {

    if (!currentUser) return;


    marketData.forEach(stock => {

        const volatility =
            0.005;


        const changePercent =
            (
                Math.random() *
                volatility *
                2
            ) - volatility;


        stock.price =
            stock.price *
            (1 + changePercent);


        stock.change =
            (
                (stock.price -
                    stock.basePrice) /
                stock.basePrice
            ) * 100;


        stock.history.push(
            stock.price
        );


        if (
            stock.history.length >
            30
        ) {

            stock.history.shift();
        }

    });


    if (
        document
            .getElementById("dashboard")
            .classList
            .contains("active-tab")
    ) {

        renderMarket();
    }


    if (
        document
            .getElementById("portfolio")
            .classList
            .contains("active-tab")
    ) {

        renderPortfolio();
    }


    if (
        document
            .getElementById("watchlist")
            .classList
            .contains("active-tab")
    ) {

        renderWatchlist();
    }


    if (
        !document
            .getElementById("trade-modal")
            .classList
            .contains("hidden")
        &&
        selectedStock
    ) {

        updateModalPrice();
    }


    if (
        !document
            .getElementById(
                "stock-detail-modal"
            )
            .classList
            .contains("hidden")
        &&
        detailStockSymbol
    ) {

        updateStockDetailLive();
    }

}


/* =========================================================
   STOCK CARD
   ========================================================= */

function createStockCard(
    stock,
    isStarred
) {

    const colorClass =
        stock.change >= 0
            ? "profit"
            : "loss";


    const sign =
        stock.change >= 0
            ? "+"
            : "";


    const lang =
        document
            .getElementById("lang-select")
            ?.value || "en";


    const btnBuy =
        translations[lang]?.buy ||
        "BUY";


    const btnSell =
        translations[lang]?.sell ||
        "SELL";


    return `

        <div class="stock-card">

            <div class="stock-header">

                <h3
                    class="stock-name-click"
                    onclick="window.openStockDetails('${stock.symbol}')"
                >
                    ${stock.symbol}
                </h3>


                <button
                    class="star-btn"
                    style="
                        background:none;
                        border:none;
                        color:${isStarred ? "#ffb800" : "#888"};
                        cursor:pointer;
                        font-size:1.2rem;
                    "
                    onclick="window.toggleWatchlist('${stock.symbol}')"
                    title="Add to Watchlist"
                >
                    <i class="fas fa-star"></i>
                </button>

            </div>


            <p
                style="
                    color:var(--text-muted);
                    margin-bottom:15px;
                    font-size:0.9rem;
                "
            >
                ${stock.name}
            </p>


            <div class="price-row">

                <h3 class="${colorClass}">
                    ₹${stock.price.toFixed(2)}
                </h3>

                <span class="${colorClass}">
                    ${sign}${stock.change.toFixed(2)}%
                </span>

            </div>


            <div
                style="
                    display:flex;
                    gap:10px;
                "
            >

                <button
                    class="btn-buy"
                    onclick="window.openTradeModal('${stock.symbol}', 'BUY')"
                >
                    ${btnBuy}
                </button>


                <button
                    class="btn-sell"
                    onclick="window.openTradeModal('${stock.symbol}', 'SELL')"
                >
                    ${btnSell}
                </button>

            </div>

        </div>

    `;
}


/* =========================================================
   STOCK DETAILS
   ========================================================= */

window.openStockDetails =
function (symbol) {

    detailStockSymbol =
        symbol;

    updateStockDetailLive();

    document
        .getElementById(
            "stock-detail-modal"
        )
        .classList
        .remove("hidden");
};


/* =========================================================
   UPDATE STOCK DETAILS
   ========================================================= */

function updateStockDetailLive() {

    if (!detailStockSymbol) return;


    const stock =
        marketData.find(
            s =>
                s.symbol ===
                detailStockSymbol
        );


    if (!stock) return;


    const isProfit =
        stock.change >= 0;


    const colorClass =
        isProfit
            ? "profit"
            : "loss";


    const chartColor =
        isProfit
            ? "#00d09c"
            : "#ff5c5c";


    document
        .getElementById(
            "detail-title"
        )
        .innerText =
        stock.symbol;


    document
        .getElementById(
            "detail-name"
        )
        .innerText =
        stock.name;


    const currentElement =
        document.getElementById(
            "detail-current"
        );


    currentElement.innerText =
        `₹${stock.price.toFixed(2)}`;


    currentElement.className =
        colorClass;


    const changeElement =
        document.getElementById(
            "detail-change"
        );


    changeElement.innerText =
        `${isProfit ? "+" : ""}${stock.change.toFixed(2)}%`;


    changeElement.className =
        colorClass;


    /* Fundamentals */

    document.getElementById(
        "fund-mcap"
    ).innerText =
        stock.fund.mcap;


    document.getElementById(
        "fund-pe"
    ).innerText =
        stock.fund.pe;


    document.getElementById(
        "fund-roe"
    ).innerText =
        stock.fund.roe;


    document.getElementById(
        "fund-yield"
    ).innerText =
        stock.fund.yield;


    document.getElementById(
        "fund-high"
    ).innerText =
        stock.fund.high;


    document.getElementById(
        "fund-low"
    ).innerText =
        stock.fund.low;


    renderStockLineChart(
        stock.history,
        chartColor
    );
}


/* =========================================================
   STOCK LINE CHART
   ========================================================= */

function renderStockLineChart(
    dataArray,
    lineColor
) {

    const canvas =
        document.getElementById(
            "stockLineChart"
        );


    if (!canvas) return;


    const ctx =
        canvas.getContext("2d");


    if (stockLineChartInstance) {

        stockLineChartInstance.destroy();

        stockLineChartInstance =
            null;
    }


    const labels =
        dataArray.map(
            (_, index) =>
                index + 1
        );


    stockLineChartInstance =
        new Chart(
            ctx,
            {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            data: dataArray,

                            borderColor:
                                lineColor,

                            borderWidth: 2,

                            pointRadius: 0,

                            pointHoverRadius: 5,

                            tension: 0.25,

                            fill: false

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    animation: false,

                    plugins: {

                        legend: {
                            display: false
                        },

                        tooltip: {

                            mode: "index",

                            intersect: false,

                            callbacks: {

                                label:
                                function (
                                    context
                                ) {

                                    return (
                                        "₹" +
                                        context.parsed.y
                                            .toFixed(2)
                                    );
                                },

                                title:
                                function () {
                                    return "";
                                }

                            }

                        }

                    },


                    scales: {

                        x: {
                            display: false
                        },

                        y: {
                            display: false
                        }

                    },


                    interaction: {

                        mode: "nearest",

                        axis: "x",

                        intersect: false

                    }

                }

            }
        );
}


/* =========================================================
   WATCHLIST
   ========================================================= */

window.toggleWatchlist =
function (symbol) {

    const user =
        getUserData();


    if (!user) {

        alert(
            "Please login first."
        );

        return;
    }


    /* IMPORTANT FIX */

    user.watchlist =
        user.watchlist || [];


    const index =
        user.watchlist.indexOf(
            symbol
        );


    if (index > -1) {

        user.watchlist.splice(
            index,
            1
        );

    } else {

        user.watchlist.push(
            symbol
        );
    }


    saveData();

    renderMarket();


    if (
        document
            .getElementById(
                "watchlist"
            )
            .classList
            .contains("active-tab")
    ) {

        renderWatchlist();
    }

};


/* =========================================================
   FILTER STOCKS
   ========================================================= */

window.filterStocks =
function () {

    renderMarket();
};


/* =========================================================
   RENDER MARKET
   ========================================================= */

function renderMarket() {

    const user =
        getUserData();


    if (!user) return;


    user.watchlist =
        user.watchlist || [];


    const input =
        document.getElementById(
            "search-input"
        );


    const query =
        input
            ? input.value
                .trim()
                .toUpperCase()
            : "";


    const filteredStocks =
        marketData.filter(
            stock =>
                stock.symbol
                    .includes(query)
                ||
                stock.name
                    .toUpperCase()
                    .includes(query)
        );


    const marketGrid =
        document.getElementById(
            "market-grid"
        );


    marketGrid.innerHTML =
        filteredStocks.length === 0

            ? `
                <p style="
                    color:#888;
                    grid-column:1/-1;
                    padding:20px;
                ">
                    No stocks found.
                </p>
              `

            :

            filteredStocks
                .map(
                    stock =>
                        createStockCard(
                            stock,
                            user.watchlist.includes(
                                stock.symbol
                            )
                        )
                )
                .join("");
}


/* =========================================================
   RENDER WATCHLIST
   ========================================================= */

function renderWatchlist() {

    const user =
        getUserData();


    if (!user) return;


    user.watchlist =
        user.watchlist || [];


    const watchlistStocks =
        marketData.filter(
            stock =>
                user.watchlist.includes(
                    stock.symbol
                )
        );


    const grid =
        document.getElementById(
            "watchlist-grid"
        );


    if (
        watchlistStocks.length === 0
    ) {

        grid.innerHTML = `
            <p style="
                color:#888;
                grid-column:1/-1;
                padding:20px;
            ">
                Watchlist is empty.
                Add stars from Market.
            </p>
        `;

        return;
    }


    grid.innerHTML =
        watchlistStocks
            .map(
                stock =>
                    createStockCard(
                        stock,
                        true
                    )
            )
            .join("");
}


/* =========================================================
   TRADE MODAL
   ========================================================= */

window.openTradeModal =
function (
    symbol,
    type
) {

    selectedStock =
        marketData.find(
            stock =>
                stock.symbol ===
                symbol
        );


    if (!selectedStock) return;


    document.getElementById(
        "modal-title"
    ).innerText =
        `${type} ${selectedStock.symbol}`;


    document.getElementById(
        "trade-qty"
    ).value = "";


    document.getElementById(
        "modal-total"
    ).innerText =
        "₹0.00";


    updateModalPrice();


    document
        .getElementById(
            "trade-modal"
        )
        .classList
        .remove("hidden");
};


/* =========================================================
   UPDATE MODAL PRICE
   ========================================================= */

function updateModalPrice() {

    if (!selectedStock) return;


    document.getElementById(
        "modal-price"
    ).innerText =
        `₹${selectedStock.price.toFixed(2)}`;


    window.calculateTotal();
}


/* =========================================================
   CALCULATE TOTAL
   ========================================================= */

window.calculateTotal =
function () {

    const quantity =
        parseInt(
            document.getElementById(
                "trade-qty"
            ).value
        ) || 0;


    const total =
        selectedStock
            ? quantity *
              selectedStock.price
            : 0;


    document.getElementById(
        "modal-total"
    ).innerText =
        `₹${total.toFixed(2)}`;
};


/* =========================================================
   CLOSE MODAL
   ========================================================= */

window.closeModal =
function (id) {

    const modal =
        document.getElementById(id);


    if (!modal) return;


    modal.classList.add(
        "hidden"
    );


    if (
        id === "trade-modal"
    ) {

        selectedStock = null;
    }


    if (
        id ===
        "stock-detail-modal"
    ) {

        detailStockSymbol = null;
    }

};


/* =========================================================
   EXECUTE TRADE
   ========================================================= */

window.executeTrade =
function (type) {

    const user =
        getUserData();


    if (!user) {

        alert(
            "Please login first."
        );

        return;
    }


    if (!selectedStock) {

        alert(
            "Please select a stock."
        );

        return;
    }


    const quantity =
        parseInt(
            document.getElementById(
                "trade-qty"
            ).value
        );


    if (
        !quantity ||
        quantity <= 0 ||
        !Number.isInteger(quantity)
    ) {

        alert(
            "Enter a valid quantity!"
        );

        return;
    }


    const price =
        selectedStock.price;


    const total =
        quantity * price;


    /* ================= BUY ================= */

    if (type === "BUY") {

        if (
            user.balance <
            total
        ) {

            alert(
                "Insufficient Virtual Cash!"
            );

            return;
        }


        user.balance -= total;


        if (
            !user.portfolio[
                selectedStock.symbol
            ]
        ) {

            user.portfolio[
                selectedStock.symbol
            ] = {

                qty: 0,

                avgPrice: 0

            };
        }


        const portfolioStock =
            user.portfolio[
                selectedStock.symbol
            ];


        portfolioStock.avgPrice =
            (
                (
                    portfolioStock.qty *
                    portfolioStock.avgPrice
                )
                +
                total
            )
            /
            (
                portfolioStock.qty +
                quantity
            );


        portfolioStock.qty +=
            quantity;

    }


    /* ================= SELL ================= */

    else {

        const portfolioStock =
            user.portfolio[
                selectedStock.symbol
            ];


        if (
            !portfolioStock ||
            portfolioStock.qty <
            quantity
        ) {

            alert(
                "Not enough shares to sell!"
            );

            return;
        }


        user.balance += total;


        portfolioStock.qty -=
            quantity;


        if (
            portfolioStock.qty ===
            0
        ) {

            delete user.portfolio[
                selectedStock.symbol
            ];
        }

    }


    /* ================= HISTORY ================= */

    user.history.unshift({

        time:
            new Date()
                .toLocaleString(),

        type:
            type,

        symbol:
            selectedStock.symbol,

        qty:
            quantity,

        price:
            price,

        total:
            total

    });


    saveData();

    updateBalance();

    window.closeModal(
        "trade-modal"
    );


    alert(
        `Successfully ${type} ${quantity}x ${selectedStock.symbol}`
    );


    if (
        document
            .getElementById(
                "portfolio"
            )
            .classList
            .contains("active-tab")
    ) {

        renderPortfolio();
    }


    if (
        document
            .getElementById(
                "history"
            )
            .classList
            .contains("active-tab")
    ) {

        renderHistory();
    }

};


/* =========================================================
   PORTFOLIO
   ========================================================= */

function renderPortfolio() {

    const user =
        getUserData();


    if (!user) return;


    const tbody =
        document.getElementById(
            "portfolio-body"
        );


    tbody.innerHTML = "";


    let totalInvested = 0;

    let currentValue = 0;

    const chartLabels = [];

    const chartData = [];


    const lang =
        document
            .getElementById(
                "lang-select"
            )
            ?.value || "en";


    const sellText =
        translations[lang]?.sell ||
        "SELL";


    for (
        const symbol
        in user.portfolio
    ) {

        const portfolioStock =
            user.portfolio[
                symbol
            ];


        const stock =
            marketData.find(
                s =>
                    s.symbol ===
                    symbol
            );


        const ltp =
            stock
                ? stock.price
                : portfolioStock.avgPrice;


        const invested =
            portfolioStock.qty *
            portfolioStock.avgPrice;


        const current =
            portfolioStock.qty *
            ltp;


        const pnl =
            current -
            invested;


        totalInvested +=
            invested;


        currentValue +=
            current;


        chartLabels.push(
            symbol
        );


        chartData.push(
            current
        );


        tbody.innerHTML += `

            <tr>

                <td>

                    <strong
                        class="stock-name-click"
                        onclick="window.openStockDetails('${symbol}')"
                    >
                        ${symbol}
                    </strong>

                </td>


                <td>
                    ${portfolioStock.qty}
                </td>


                <td>
                    ₹${portfolioStock.avgPrice.toFixed(2)}
                </td>


                <td>
                    ₹${ltp.toFixed(2)}
                </td>


                <td
                    class="${
                        pnl >= 0
                            ? "profit"
                            : "loss"
                    }"
                >
                    ${
                        pnl >= 0
                            ? "+"
                            : ""
                    }₹${pnl.toFixed(2)}
                </td>


                <td>

                    <button
                        class="btn-sell"
                        style="
                            padding:5px 10px;
                        "
                        onclick="window.openTradeModal('${symbol}', 'SELL')"
                    >
                        ${sellText}
                    </button>

                </td>

            </tr>

        `;
    }


    document.getElementById(
        "total-invested"
    ).innerText =
        `₹${totalInvested.toFixed(2)}`;


    document.getElementById(
        "current-value"
    ).innerText =
        `₹${currentValue.toFixed(2)}`;


    const totalPnl =
        currentValue -
        totalInvested;


    const pnlElement =
        document.getElementById(
            "total-pnl"
        );


    pnlElement.innerText =
        `${
            totalPnl >= 0
                ? "+"
                : ""
        }₹${totalPnl.toFixed(2)}`;


    pnlElement.className =
        totalPnl >= 0
            ? "profit"
            : "loss";


    updatePortfolioChart(
        chartLabels,
        chartData
    );

}


/* =========================================================
   PORTFOLIO CHART
   ========================================================= */

function initPortfolioChart() {

    const canvas =
        document.getElementById(
            "portfolioChart"
        );


    if (!canvas) return;


    const ctx =
        canvas.getContext("2d");


    Chart.defaults.color =
        "#888";


    if (
        portfolioChartInstance
    ) {

        portfolioChartInstance.destroy();
    }


    portfolioChartInstance =
        new Chart(
            ctx,
            {

                type: "doughnut",

                data: {

                    labels: [],

                    datasets: [

                        {

                            data: [],

                            backgroundColor: [
                                "#00d09c",
                                "#4d7cfe",
                                "#9c27b0",
                                "#ffb800",
                                "#e91e63",
                                "#ff5c5c",
                                "#00bcd4"
                            ],

                            borderWidth: 0

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {

                            position:
                                "right"

                        }

                    },

                    cutout: "70%"

                }

            }
        );
}


/* =========================================================
   UPDATE PORTFOLIO CHART
   ========================================================= */

function updatePortfolioChart(
    labels,
    data
) {

    if (
        !portfolioChartInstance
    ) {

        return;
    }


    portfolioChartInstance.data.labels =
        labels;


    portfolioChartInstance.data
        .datasets[0]
        .data =
        data;


    portfolioChartInstance.update();

}


/* =========================================================
   ORDER HISTORY
   ========================================================= */

function renderHistory() {

    const user =
        getUserData();


    if (!user) return;


    const history =
        user.history || [];


    const tbody =
        document.getElementById(
            "history-body"
        );


    if (
        history.length ===
        0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="
                        text-align:center;
                        color:#777;
                        padding:30px;
                    "
                >
                    No orders yet.
                </td>

            </tr>

        `;

        return;
    }


    tbody.innerHTML =
        history
            .map(
                order => `

                    <tr>

                        <td>
                            <small>
                                ${order.time}
                            </small>
                        </td>


                        <td
                            class="${
                                order.type ===
                                "BUY"
                                    ? "profit"
                                    : "loss"
                            }"
                        >
                            <strong>
                                ${order.type}
                            </strong>
                        </td>


                        <td>
                            ${order.symbol}
                        </td>


                        <td>
                            ${order.qty}
                        </td>


                        <td>
                            ₹${Number(
                                order.price
                            ).toFixed(2)}
                        </td>


                        <td>
                            ₹${Number(
                                order.total
                            ).toFixed(2)}
                        </td>

                    </tr>

                `
            )
            .join("");

}


/* =========================================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
   ========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const tradeModal =
            document.getElementById(
                "trade-modal"
            );

        const detailModal =
            document.getElementById(
                "stock-detail-modal"
            );


        if (
            event.target ===
            tradeModal
        ) {

            window.closeModal(
                "trade-modal"
            );
        }


        if (
            event.target ===
            detailModal
        ) {

            window.closeModal(
                "stock-detail-modal"
            );
        }

    }
);


/* =========================================================
   ESC KEY CLOSE MODAL
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !==
            "Escape"
        ) {

            return;
        }


        const tradeModal =
            document.getElementById(
                "trade-modal"
            );


        const detailModal =
            document.getElementById(
                "stock-detail-modal"
            );


        if (
            !tradeModal.classList
                .contains("hidden")
        ) {

            window.closeModal(
                "trade-modal"
            );
        }


        if (
            !detailModal.classList
                .contains("hidden")
        ) {

            window.closeModal(
                "stock-detail-modal"
            );
        }

    }
);