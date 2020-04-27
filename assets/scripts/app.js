class Product {
  constructor(title, image, desc, price) {
    this.title = title;
    this.imageUrl = image;
    this.description = desc;
    this.price = price;
  }
}

class ElementAttribiute {
  constructor(attrName, attrValue) {
    this.name = attrName;
    this.value = attrValue;
  }
}

class Component {
  constructor(renderHookId, shouldRender = true) {
    this.hookId = renderHookId;
    if (shouldRender) {
      this.render();
    }
  }

  render() {}

  createRootElement(tag, cssClasses, attribiutes) {
    const rootElement = document.createElement(tag);
    if (cssClasses) {
      rootElement.className = cssClasses;
    }
    if (attribiutes && attribiutes.length > 0) {
      for (const attr of attribiutes) {
        rootElement.setAttribute(attr.name, attr.value);
      }
    }
    document.getElementById(this.hookId).append(rootElement);
    return rootElement;
  }
}

class ShoppingCart extends Component {
  items = [];

  get totalAmount() {
    const sum = this.items.reduce((prevValue, curItem) => {
      return prevValue + curItem.price;
    }, 0);
    return sum;
  }

  constructor(renderHookId) {
    super(renderHookId);
  }

  addProduct(product) {
    this.items.push(product);
    this.totalOutput.innerHTML = `<h2>Total: \$${this.totalAmount.toFixed(
      2
    )}</h2>`;
  }

  orderProducts() {
    if (this.items.length > 0) {
      this.totalOutput.innerHTML = `<h2>Total: Ordered! You should pay: \$<span class="ordered">${this.totalAmount.toFixed(
        2
      )}</span></h2>`;
    } else {
      this.totalOutput.innerHTML = `<h2>You have to add something to the cart.</h2>`;
    }
  }

  render() {
    const cartEl = this.createRootElement("section", "cart");
    cartEl.innerHTML = `
        <h2>Total: \$${0}</h2>
        <button>Order Now!</button>
        `;
    const orderButton = cartEl.querySelector("button");
    orderButton.addEventListener("click", this.orderProducts.bind(this));
    this.totalOutput = cartEl.querySelector("h2");
  }
}

class ProductItem extends Component {
  constructor(product, renderHookId) {
    super(renderHookId, false);
    this.product = product;
    this.render();
  }

  addToCart() {
    App.addProductToCart(this.product);
  }

  render() {
    const prodEl = this.createRootElement("li", "product-item");
    prodEl.innerHTML = `
                    <div>
                      <img src="${this.product.imageUrl}" alt="${this.product.title}">
                      <div class="product-item__content">
                      <h2>${this.product.title}</h2>
                      <h3>\$${this.product.price}</h3>
                      <p>${this.product.description}</p>
                      <button>Add to Cart</button>
                      </div>
                    </div>
                    `;
    const addCartButton = prodEl.querySelector("button");
    addCartButton.addEventListener("click", this.addToCart.bind(this));
  }
}

class ProductList extends Component {
  products = [];

  constructor(renderHook) {
    super(renderHook);
    this.fetchProducts();
  }

  fetchProducts() {
    this.products = [
      new Product(
        "A ball",
        "https://www.futboloutlet.pl/data/gfx/pictures/medium/6/4/45046_1.jpg",
        "Nike ball from Final Champions League!",
        19.99
      ),
      new Product(
        "A shoes",
        "https://www.intersport.pl/media/catalog/product/cache/1/image/700x/0dc2d03fe217f8c83829496872af24a0/1/9/19_JESIEN_NIKE_AQ4176_822990902kw.jpg",
        "Football shoes for real players!",
        39.99
      ),
      new Product(
        "A shirt",
        "https://sklep.redboxsport.pl/10901-large_default/koszulka-adidas-real-madryt-201920-dw4433.jpg",
        "Official shirt of Real Madrid",
        49.99
      )
    ];
    this.renderProducts();
  }

  renderProducts() {
    for (const prod of this.products) {
      new ProductItem(prod, "prod-list");
    }
  }

  render() {
    this.createRootElement("ul", "product-list", [
      new ElementAttribiute("id", "prod-list")
    ]);
    if (this.products && this.products.length > 0) {
      this.renderProducts();
    }
  }
}

class Shop {
  constructor() {
    this.render();
  }
  render() {
    this.cart = new ShoppingCart("app");
    new ProductList("app");
  }
}

class App {
  static cart;
  static init() {
    const shop = new Shop();
    this.cart = shop.cart;
  }

  static addProductToCart(product) {
    this.cart.addProduct(product);
  }
}
App.init();
