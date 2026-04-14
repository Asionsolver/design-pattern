interface StockObserver {
  onPriceChange(symbol: string, price: number): void;
}

class StockMarket {
  private stocks: { [key: string]: number } = {};
  private observers: StockObserver[] = [];

  attach(observer: StockObserver) {
    this.observers.push(observer);
  }

  updatePrice(symbol: string, price: number) {
    this.stocks[symbol] = price;
    this.observers.forEach((obs) => obs.onPriceChange(symbol, price));
  }
}

class MobileAppDisplay implements StockObserver {
  onPriceChange(symbol: string, price: number) {
    console.log(`[Mobile App] ${symbol} price updated to $${price}`);
  }
}

class TradingBot implements StockObserver {
  onPriceChange(symbol: string, price: number) {
    if (price < 150)
      console.log(`[Bot] Buying ${symbol} because price is low!`);
  }
}

const nasdaq = new StockMarket();
nasdaq.attach(new MobileAppDisplay());
nasdaq.attach(new TradingBot());

nasdaq.updatePrice("AAPL", 145);
nasdaq.updatePrice("AAPL", 155);
nasdaq.updatePrice("GOOGL", 2800);
nasdaq.updatePrice("GOOGL", 2750);
