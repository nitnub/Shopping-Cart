const products = [
  { id: 1001, name: 'Apples', country: 'Italy', cost: 3, instock: 10 },
  { id: 1002, name: 'Oranges', country: 'Spain', cost: 4, instock: 3 },
  { id: 1003, name: 'Beans', country: 'USA', cost: 2, instock: 5 },
  { id: 1004, name: 'Cabbage', country: 'USA', cost: 1, instock: 8 },
];

const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });
  console.log(`useDataApi called`);

  useEffect(() => {
    console.log('useEffect Called on', url);
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });
      try {
        const result = await axios(url);
        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE' });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
  // return [state];
};
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

function Products(props) {
  const [items, setItems] = React.useState(products);
  const [cart, setCart] = React.useState([]);
  const { Card, Accordion, Button, Container, Row, Col, Image, Navbar } =
    ReactBootstrap;
  //  Fetch Data
  const { useState, useReducer } = React;
  const [query, setQuery] = useState('products');
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    `http://localhost:1337/api/${query}`,
    {
      data: [],
    }
  );
  function Header() {
    return (
      <Navbar className=" navbar-dark bg-dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">React Shopping Cart</Navbar.Brand>
        </Container>
      </Navbar>
    );
  }
  function incrementStock(id) {
    const productCopy = [...items];

    for (let product of productCopy) {
      if (product.id === id) {
        product.instock++;
        product.inCart--;
        setItems((product) => productCopy);
        return true;
      }
    }
    return false;
  }

  const addToCart = (id) => {
    const [item] = items.filter((item) => item.id === id);
    console.log(`add to Cart ${JSON.stringify(item)}`);
    if (item.instock === 0) {
      return;
    }

    item.inCart ? (item.inCart += 1) : (item.inCart = 1);
    item.instock -= 1;

    setCart([...cart, item]);
  };

  const deleteCartItem = (index) => {
    let newCart = cart.filter((item, i) => index != i);

    setCart(newCart);
  };

  const closeAccordion = (id) => {
    const target = document.getElementById(id);
    target.classList.remove('show');
  };

  const list = items.map((item, index) => {
    const photoUrl = `https://picsum.photos/id/${index * 10}/50/50`;

    return (
      <li key={index}>
        <div className="product-listing">
          <Image className="product-image" src={photoUrl} width={70}></Image>
          <div className="product-details">
            <Button
              className="product-button btn-warning"
              variant="primary"
              size="large"
            >
              {item.name} ${item.cost} Stock:{item.instock}
            </Button>
            <input
              className="product-add-to-cart"
              name={item.name}
              type="submit"
              value={'Add to Cart'}
              onClick={() => addToCart(item.id)}
            ></input>
          </div>
        </div>
      </li>
    );
  });

  let cartList = cart.map((item, index) => {
    const cartId = `${item.name}-${index}`;
    return (
      <Card key={cartId}>
        <Accordion.Toggle
          as={Card.Header}
          className="cart-item-toggle"
          eventKey={cartId}
        >
          {item.name}
        </Accordion.Toggle>
        <Accordion.Collapse id={cartId} className="collapse" eventKey={cartId}>
          <Card.Body>
            <div className="cart-item">
              ${item.cost} from {item.country}
              <Button
                className="btn btn-dark btn-remove"
                onClick={() => {
                  closeAccordion(cartId);
                  incrementStock(item.id);
                  deleteCartItem(index);
                }}
              >
                Remove
              </Button>
            </div>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  });

  function groupedCart(cart) {
    const gCart = {};
    cart.forEach((item) => {
      const { name, cost, id } = item;
      if (!gCart[name]) {
        gCart[name] = { id, name, cost, inCart: 1 };
      } else {
        gCart[name].inCart += 1;
      }
    });

    return Object.values(gCart);
  }

  const finalList = () => {
    const total = checkOut();

    let final = groupedCart(cart).map((item, index) => {
      return (
        <>
          <div className="checkout-item" key={index} index={index}>
            <div>
              {item.name} (x{item.inCart})
            </div>
            <div>${item.cost * item.inCart}</div>
          </div>
          <hr className="checkout-spacer"></hr>
        </>
      );
    });
    return { final, total };
  };

  const checkOut = () => {
    let costs = cart.map((item) => item.cost);
    const reducer = (accum, current) => accum + current;
    let newTotal = costs.reduce(reducer, 0);
    return newTotal;
  };

  // TODO: implement the restockProducts function

  const restockProducts = async (url) => {
    doFetch(url);
    const res = await fetch(url);
    const data = await res.json();

    const tempItems = data.data.map((item, index) => {
      const id = items.length + index; // create a new unique identifier
      const { name, cost, country, instock } = item.attributes;
      return { id, name, cost, country, instock, inCart: 0 };
    });

    setItems([...items, ...tempItems]);
  };

  return (
    <>
      <Header />

      <Container>
        <Row>
          <Col>
            <h1>Product List</h1>
            <ul style={{ listStyleType: 'none' }}>{list}</ul>
          </Col>
          <Col>
            <h1>Cart Contents</h1>
            <Accordion>{cartList}</Accordion>
          </Col>
          <Col>
            <h1>Check Out</h1>
            <Card>
              <Button
                className={`btn-warning ${cart.length && ' checkout-button '}`}
                onClick={checkOut}
              >
                Check Out ${finalList().total}
              </Button>
              <div> {finalList().total > 0 && finalList().final} </div>
            </Card>
          </Col>
        </Row>
        <Row>
          <form
            onSubmit={(event) => {
              restockProducts(`http://localhost:1337/api/${query}`);
              event.preventDefault();
            }}
          >
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit">Restock Products</button>
          </form>
        </Row>
      </Container>
    </>
  );
}
// ========================================
ReactDOM.render(<Products />, document.getElementById('root'));
