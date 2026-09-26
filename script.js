const INITIAL_BALANCE = 100000;
let currentUser = null;
let usersData = JSON.parse(localStorage.getItem('tradeSimUsers')) || {};

// Language Support
const translations = {
    en: { market: "Market", portfolio: "Portfolio", watchlist: "Watchlist", orders: "Orders", how_to_use: "How to Use", about_app: "About App", virtual_cash: "Virtual Cash", welcome: "Welcome", logout: "Logout", buy: "BUY", sell: "SELL" },
    hi: { market: "बाज़ार", portfolio: "पोर्टफोलियो", watchlist: "वॉचलिस्ट", orders: "ऑर्डर", how_to_use: "उपयोग कैसे करें", about_app: "ऐप के बारे में", virtual_cash: "वर्चुअल कैश", welcome: "स्वागत है", logout: "लॉग आउट", buy: "खरीदें", sell: "बेचें" },
    te: { market: "మార్కెట్", portfolio: "పోర్ట్‌ఫోలియో", watchlist: "వాచ్‌లిస్ట్", orders: "ఆర్డర్లు", how_to_use: "ఎలా వాడాలి", about_app: "యాప్ గురించి", virtual_cash: "వర్చువల్ క్యాష్", welcome: "స్వాగతం", logout: "లాగ్అవుట్", buy: "కొనుగోలు", sell: "అమ్మకం" },
    ta: { market: "சந்தை", portfolio: "போர்ட்ஃபோலியோ", watchlist: "பட்டியல்", orders: "ஆர்டர்கள்", how_to_use: "எப்படி பயன்படுத்துவது", about_app: "ஆப் பற்றி", virtual_cash: "மெய்நிகர் பணம்", welcome: "வரவேற்பு", logout: "வெளியேறு", buy: "வாங்கு", sell: "விற்க" },
    kn: { market: "ಮಾರುಕಟ್ಟೆ", portfolio: "ಪೋರ್ಟ್ಫೋಲಿಯೊ", watchlist: "ವೀಕ್ಷಣಾಪಟ್ಟಿ", orders: "ಆದೇಶಗಳು", how_to_use: "ಬಳಸುವುದು ಹೇಗೆ", about_app: "ಅಪ್ಲಿಕೇಶನ್ ಬಗ್ಗೆ", virtual_cash: "ವರ್ಚುವಲ್ ನಗದು", welcome: "ಸ್ವಾಗತ", logout: "ಲಾಗ್ ಔಟ್", buy: "ಖರೀದಿಸಿ", sell: "ಮಾರಿ" }
};

// 15 Detailed Indian Stocks with Fundamentals
let marketData = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', basePrice: 2450.00, price: 2450.00, change: 0, history: [], fund: { mcap: "16.5L Cr", pe: "25.4", roe: "18.2%", yield: "0.4%", high: "₹2600", low: "₹2100" } },
    { symbol: 'TCS', name: 'Tata Consultancy', basePrice: 3520.50, price: 3520.50, change: 0, history: [], fund: { mcap: "13.2L Cr", pe: "30.1", roe: "43.5%", yield: "1.2%", high: "₹3650", low: "₹3100" } },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', basePrice: 1600.25, price: 1600.25, change: 0, history: [], fund: { mcap: "11.8L Cr", pe: "16.5", roe: "16.8%", yield: "1.0%", high: "₹1720", low: "₹1480" } },
    { symbol: 'INFY', name: 'Infosys Ltd', basePrice: 1450.10, price: 1450.10, change: 0, history: [], fund: { mcap: "6.1L Cr", pe: "24.2", roe: "31.8%", yield: "2.1%", high: "₹1620", low: "₹1350" } },
    { symbol: 'ITC', name: 'ITC Limited', basePrice: 440.30, price: 440.30, change: 0, history: [], fund: { mcap: "5.5L Cr", pe: "27.8", roe: "29.1%", yield: "3.5%", high: "₹499", low: "₹399" } },
    { symbol: 'TATAMOTORS', name: 'Tata Motors', basePrice: 620.80, price: 620.80, change: 0, history: [], fund: { mcap: "2.3L Cr", pe: "16.0", roe: "11.5%", yield: "0.3%", high: "₹650", low: "₹400" } },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', basePrice: 950.40, price: 950.40, change: 0, history: [], fund: { mcap: "6.6L Cr", pe: "17.2", roe: "17.1%", yield: "0.8%", high: "₹1010", low: "₹790" } },
    { symbol: 'ZOMATO', name: 'Zomato Ltd', basePrice: 95.50, price: 95.50, change: 0, history: [], fund: { mcap: "0.8L Cr", pe: "NA", roe: "-4.2%", yield: "0.0%", high: "₹102", low: "₹48" } },
    { symbol: 'SBIN', name: 'State Bank of India', basePrice: 580.10, price: 580.10, change: 0, history: [], fund: { mcap: "5.2L Cr", pe: "9.5", roe: "16.2%", yield: "1.9%", high: "₹629", low: "₹499" } },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', basePrice: 880.60, price: 880.60, change: 0, history: [], fund: { mcap: "4.9L Cr", pe: "54.2", roe: "11.8%", yield: "0.5%", high: "₹905", low: "₹740" } },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance', basePrice: 7200.00, price: 7200.00, change: 0, history: [], fund: { mcap: "4.3L Cr", pe: "35.2", roe: "23.5%", yield: "0.4%", high: "₹7800", low: "₹5500" } },
    { symbol: 'ASIANPAINT', name: 'Asian Paints', basePrice: 3200.50, price: 3200.50, change: 0, history: [], fund: { mcap: "3.1L Cr", pe: "65.1", roe: "27.5%", yield: "0.8%", high: "₹3560", low: "₹2700" } },
    { symbol: 'HUL', name: 'Hindustan Unilever', basePrice: 2500.20, price: 2500.20, change: 0, history: [], fund: { mcap: "5.9L Cr", pe: "58.4", roe: "20.1%", yield: "1.5%", high: "₹2750", low: "₹2350" } },
    { symbol: 'MARUTI', name: 'Maruti Suzuki', basePrice: 10400.00, price: 10400.00, change: 0, history: [], fund: { mcap: "3.1L Cr", pe: "29.2", roe: "15.4%", yield: "0.8%", high: "₹10800", low: "₹8100" } },
    { symbol: 'WIPRO', name: 'Wipro Ltd', basePrice: 410.80, price: 410.80, change: 0, history: [], fund: { mcap: "2.1L Cr", pe: "19.5", roe: "16.4%", yield: "1.1%", high: "₹440", low: "₹360" } }
];

// Pre-fill history arrays to make initial charts look realistic
marketData.forEach(stock => {
    let tempPrice = stock.basePrice;
    for(let i=0; i<20; i++) {
        tempPrice = tempPrice * (1 + (Math.random() * 0.01 - 0.005));
        stock.history.push(tempPrice);
    }
});

let selectedStock = null;
let detailStockSymbol = null; // currently viewed in detail modal
let portfolioChartInstance = null;
let stockLineChartInstance = null;

window.changeLanguage = function() {
    const lang = document.getElementById('lang-select').value;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(translations[lang] && translations[lang][key]) el.innerText = translations[lang][key];
    });
};

window.login = function() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    if (!user || !pass) return alert('Enter username and password!');

    if (!usersData[user]) {
        usersData[user] = { password: pass, balance: INITIAL_BALANCE, portfolio: {}, history: [], watchlist: [] };
    } else if (usersData[user].password !== pass) {
        return alert('Incorrect Password!');
    }

    currentUser = user; 
    saveData();
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('app-screen').classList.remove('hidden');
    document.getElementById('bg-orbs').classList.add('hidden');
    document.getElementById('display-user').innerText = currentUser;
    initApp();
};

window.logout = function() {
    currentUser = null;
    document.getElementById('app-screen').classList.add('hidden');
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('bg-orbs').classList.remove('hidden');
    document.getElementById('username').value = ''; 
    document.getElementById('password').value = '';
};

function saveData() { localStorage.setItem('tradeSimUsers', JSON.stringify(usersData)); }
function getUserData() { return usersData[currentUser]; }

function initApp() {
    changeLanguage(); 
    updateBalance(); 
    renderMarket(); 
    renderHistory(); 
    initPortfolioChart();
    setInterval(simulatePrices, 3000);
}

window.switchTab = function(tabId, event) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active-tab'));
    
    document.getElementById(tabId).classList.remove('hidden');
    document.getElementById(tabId).classList.add('active-tab');
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if(event && event.currentTarget) event.currentTarget.classList.add('active');
    else document.getElementById('nav-' + tabId).classList.add('active');

    if (tabId === 'portfolio') renderPortfolio();
    if (tabId === 'watchlist') renderWatchlist();
    if (tabId === 'history') renderHistory();
};

function updateBalance() { 
    document.getElementById('wallet-balance').innerText = `₹${getUserData().balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}`; 
}

function simulatePrices() {
    marketData.forEach(stock => {
        const volatility = 0.005; // 0.5% max volatility per 3 sec
        const changePercent = (Math.random() * volatility * 2) - volatility; 
        stock.price = stock.price * (1 + changePercent);
        stock.change = ((stock.price - stock.basePrice) / stock.basePrice) * 100;
        
        // Update history for chart (Keep max 30 points)
        stock.history.push(stock.price);
        if(stock.history.length > 30) stock.history.shift();
    });

    if (document.getElementById('dashboard').classList.contains('active-tab')) renderMarket();
    if (document.getElementById('portfolio').classList.contains('active-tab')) renderPortfolio();
    if (document.getElementById('watchlist').classList.contains('active-tab')) renderWatchlist();
    
    if (!document.getElementById('trade-modal').classList.contains('hidden') && selectedStock) updateModalPrice();
    if (!document.getElementById('stock-detail-modal').classList.contains('hidden') && detailStockSymbol) updateStockDetailLive();
}

function createStockCard(stock, isStarred) {
    const colorClass = stock.change >= 0 ? 'profit' : 'loss';
    const sign = stock.change >= 0 ? '+' : '';
    const btnBuy = translations[document.getElementById('lang-select').value]?.buy || "BUY";
    const btnSell = translations[document.getElementById('lang-select').value]?.sell || "SELL";

    return `
        <div class="stock-card">
            <div class="stock-header">
                <h3 class="stock-name-click" onclick="window.openStockDetails('${stock.symbol}')" title="View Chart & Info">${stock.symbol}</h3>
                <button class="star-btn ${isStarred ? 'starred' : ''}" style="background:none;border:none;color:${isStarred?'#ffb800':'#888'};cursor:pointer;font-size:1.2rem;" onclick="window.toggleWatchlist('${stock.symbol}')"><i class="fas fa-star"></i></button>
            </div>
            <p style="color:var(--text-muted); margin-bottom:15px; font-size:0.9rem;">${stock.name}</p>
            <div class="price-row">
                <h3 class="${colorClass}">₹${stock.price.toFixed(2)}</h3>
                <span class="${colorClass}">${sign}${stock.change.toFixed(2)}%</span>
            </div>
            <div style="display:flex; gap:10px;">
                <button class="btn-buy" onclick="window.openTradeModal('${stock.symbol}', 'BUY')">${btnBuy}</button>
                <button class="btn-sell" onclick="window.openTradeModal('${stock.symbol}', 'SELL')">${btnSell}</button>
            </div>
        </div>
    `;
}

// ---- Professional Stock Detail & Chart (Groww Style) ----
window.openStockDetails = function(symbol) {
    detailStockSymbol = symbol;
    updateStockDetailLive();
    document.getElementById('stock-detail-modal').classList.remove('hidden');
};

function updateStockDetailLive() {
    if(!detailStockSymbol) return;
    const stock = marketData.find(s => s.symbol === detailStockSymbol);
    if(!stock) return;

    const isProfit = stock.change >= 0;
    const colorClass = isProfit ? 'profit' : 'loss';
    const chartColor = isProfit ? '#00d09c' : '#ff5c5c';

    // Update Header
    document.getElementById('detail-title').innerText = stock.symbol;
    document.getElementById('detail-name').innerText = stock.name;
    
    const currEl = document.getElementById('detail-current');
    currEl.innerText = `₹${stock.price.toFixed(2)}`;
    currEl.className = colorClass;

    const changeEl = document.getElementById('detail-change');
    changeEl.innerText = `${isProfit?'+':''}${stock.change.toFixed(2)}%`;
    changeEl.className = colorClass;

    // Update Fundamentals
    document.getElementById('fund-mcap').innerText = stock.fund.mcap;
    document.getElementById('fund-pe').innerText = stock.fund.pe;
    document.getElementById('fund-roe').innerText = stock.fund.roe;
    document.getElementById('fund-yield').innerText = stock.fund.yield;
    document.getElementById('fund-high').innerText = stock.fund.high;
    document.getElementById('fund-low').innerText = stock.fund.low;

    // Update Chart
    renderStockLineChart(stock.history, chartColor);
}

function renderStockLineChart(dataArray, lineColor) {
    const ctx = document.getElementById('stockLineChart').getContext('2d');
    
    if(stockLineChartInstance) {
        stockLineChartInstance.destroy();
    }

    const labels = dataArray.map((_, i) => i); // Dummy X-axis labels

    stockLineChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: dataArray,
                borderColor: lineColor,
                borderWidth: 2,
                pointRadius: 0, // Removes the dots for a smooth line (Groww style)
                pointHoverRadius: 5,
                tension: 0.1, // Slight curve
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false, // Prevent bouncy animation on live update
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) { return '₹' + context.parsed.y.toFixed(2); },
                        title: function() { return ''; }
                    }
                }
            },
            scales: {
                x: { display: false }, // Hide X axis completely
                y: { display: false }  // Hide Y axis completely
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// ---- Watchlist & Market ----
window.toggleWatchlist = function(symbol) {
    const u = getUserData();
    const idx = u.watchlist.indexOf(symbol);
    if (idx > -1) u.watchlist.splice(idx, 1); else u.watchlist.push(symbol);
    saveData(); 
    renderMarket(); 
    if (document.getElementById('watchlist').classList.contains('active-tab')) renderWatchlist();
};

window.filterStocks = function() { renderMarket(); };
function renderMarket() {
    const query = document.getElementById('search-input').value.toUpperCase();
    const u = getUserData();
    document.getElementById('market-grid').innerHTML = marketData.filter(s => s.symbol.includes(query) || s.name.toUpperCase().includes(query)).map(s => createStockCard(s, u.watchlist.includes(s.symbol))).join('');
}

function renderWatchlist() {
    const u = getUserData(), wStocks = marketData.filter(s => u.watchlist.includes(s.symbol));
    document.getElementById('watchlist-grid').innerHTML = wStocks.length === 0 ? "<p style='color:#888; grid-column: 1/-1;'>Watchlist is empty. Add stars from Market.</p>" : wStocks.map(s => createStockCard(s, true)).join('');
}

// ---- Trade Logic (Buy / Sell) ----
window.openTradeModal = function(symbol, type) {
    selectedStock = marketData.find(s => s.symbol === symbol);
    document.getElementById('modal-title').innerText = `${type} ${selectedStock.symbol}`;
    document.getElementById('trade-qty').value = ''; 
    document.getElementById('modal-total').innerText = '₹0.00';
    updateModalPrice(); 
    document.getElementById('trade-modal').classList.remove('hidden');
};

function updateModalPrice() { if(selectedStock) { document.getElementById('modal-price').innerText = `₹${selectedStock.price.toFixed(2)}`; window.calculateTotal(); } }
window.calculateTotal = function() { const qty = parseInt(document.getElementById('trade-qty').value) || 0; if (selectedStock) document.getElementById('modal-total').innerText = `₹${(qty * selectedStock.price).toFixed(2)}`; };

window.closeModal = function(id) { 
    document.getElementById(id).classList.add('hidden'); 
    if(id === 'trade-modal') selectedStock = null;
    if(id === 'stock-detail-modal') detailStockSymbol = null;
};

window.executeTrade = function(type) {
    const qty = parseInt(document.getElementById('trade-qty').value);
    if (!qty || qty <= 0) return alert("Enter valid quantity!");
    const u = getUserData(), price = selectedStock.price, total = qty * price;

    if (type === 'BUY') {
        if (u.balance < total) return alert("Insufficient Virtual Cash!");
        u.balance -= total;
        if (!u.portfolio[selectedStock.symbol]) u.portfolio[selectedStock.symbol] = { qty: 0, avgPrice: 0 };
        let p = u.portfolio[selectedStock.symbol]; p.avgPrice = ((p.qty * p.avgPrice) + total) / (p.qty + qty); p.qty += qty;
    } else {
        let p = u.portfolio[selectedStock.symbol];
        if (!p || p.qty < qty) return alert("Not enough shares to sell!");
        u.balance += total; p.qty -= qty; if (p.qty === 0) delete u.portfolio[selectedStock.symbol];
    }
    
    u.history.unshift({ time: new Date().toLocaleString(), type, symbol: selectedStock.symbol, qty, price, total });
    saveData(); 
    updateBalance(); 
    window.closeModal('trade-modal'); 
    alert(`Successfully ${type} ${qty}x ${selectedStock.symbol}`);
    
    if (document.getElementById('portfolio').classList.contains('active-tab')) renderPortfolio();
    if (document.getElementById('history').classList.contains('active-tab')) renderHistory();
};

// ---- Portfolio ----
function renderPortfolio() {
    const u = getUserData(), tbody = document.getElementById('portfolio-body'); tbody.innerHTML = '';
    let totalInvested = 0, currentValue = 0, chartLabels = [], chartData = [];
    const btnSell = translations[document.getElementById('lang-select').value]?.sell || "SELL";

    for (const sym in u.portfolio) {
        const p = u.portfolio[sym], stock = marketData.find(s => s.symbol === sym), ltp = stock ? stock.price : p.avgPrice;
        const invested = p.qty * p.avgPrice, current = p.qty * ltp, pnl = current - invested;
        totalInvested += invested; currentValue += current; chartLabels.push(sym); chartData.push(current);

        tbody.innerHTML += `<tr><td><strong class="stock-name-click" onclick="window.openStockDetails('${sym}')">${sym}</strong></td><td>${p.qty}</td><td>₹${p.avgPrice.toFixed(2)}</td><td>₹${ltp.toFixed(2)}</td><td class="${pnl >= 0 ? 'profit' : 'loss'}">${pnl >= 0 ? '+' : ''}₹${pnl.toFixed(2)}</td><td><button class="btn-sell" style="padding: 5px 10px;" onclick="window.openTradeModal('${sym}', 'SELL')">${btnSell}</button></td></tr>`;
    }
    
    document.getElementById('total-invested').innerText = `₹${totalInvested.toFixed(2)}`;
    document.getElementById('current-value').innerText = `₹${currentValue.toFixed(2)}`;
    
    const pnlEl = document.getElementById('total-pnl');
    const totalPnl = currentValue - totalInvested;
    pnlEl.innerText = `${totalPnl >= 0 ? '+' : ''}₹${totalPnl.toFixed(2)}`;
    pnlEl.className = totalPnl >= 0 ? 'profit' : 'loss'; 
    
    updatePortfolioChart(chartLabels, chartData);
}

function initPortfolioChart() {
    const ctx = document.getElementById('portfolioChart').getContext('2d'); 
    Chart.defaults.color = '#888';
    if(portfolioChartInstance) portfolioChartInstance.destroy();

    portfolioChartInstance = new Chart(ctx, { 
        type: 'doughnut', 
        data: { labels: [], datasets: [{ data: [], backgroundColor: ['#00d09c', '#4d7cfe', '#9c27b0', '#ffb800', '#e91e63', '#ff5c5c', '#00bcd4'], borderWidth: 0 }] }, 
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } }, cutout: '70%' } 
    });
}

function updatePortfolioChart(labels, data) { 
    if (!portfolioChartInstance) return; 
    portfolioChartInstance.data.labels = labels; 
    portfolioChartInstance.data.datasets[0].data = data; 
    portfolioChartInstance.update(); 
}

function renderHistory() { 
    document.getElementById('history-body').innerHTML = getUserData().history.map(h => `<tr><td><small>${h.time}</small></td><td class="${h.type === 'BUY' ? 'profit' : 'loss'}"><strong>${h.type}</strong></td><td>${h.symbol}</td><td>${h.qty}</td><td>₹${h.price.toFixed(2)}</td><td>₹${h.total.toFixed(2)}</td></tr>`).join(''); 
}
