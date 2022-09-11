// simulate getting products from DataBase

const products = [
  { id: 1001, name: 'Apples', country: 'Italy', cost: 3, instock: 10 },
  { id: 1002, name: 'Oranges', country: 'Spain', cost: 4, instock: 3 },
  { id: 1003, name: 'Beans', country: 'USA', cost: 2, instock: 5 },
  { id: 1004, name: 'Cabbage', country: 'USA', cost: 1, instock: 8 },
];
//=========Cart=============
const Cart = (props) => {
  const { Card, Accordion, Button } = ReactBootstrap;
  let data = props.location.data ? props.location.data : items;
  console.log(`data:${JSON.stringify(data)}`);

  return (
    <Accordion className="accordion" defaultActiveKey="0">
      {list}
    </Accordion>
  );
};

const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });
  console.log(`useDataApi called`);
  // console.log(`Current state object: ${JSON.stringify(state.data)}`);
  useEffect(() => {
    console.log('useEffect Called on', url);
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });
      try {
        const result = await axios(url);
        console.log('FETCH FROM URL');
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
  const [total, setTotal] = React.useState(0);
  const [tempId, setTempId] = React.useState(products.length);
  const { Card, Accordion, Button, Container, Row, Col, Image, Input } =
    ReactBootstrap;
  //  Fetch Data
  const { Fragment, useState, useEffect, useReducer } = React;
  const [query, setQuery] = useState('products');
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    `http://localhost:1337/api/${query}`,
    {
      data: [],
    }
  );

  function decrementStock(item) {
    const productCopy = [...items];
    for (let product of productCopy) {
      if (product.id === item.id && product.instock > 0) {
        product.instock -= 1;
        setItems((product) => productCopy);
        return true;
      }
    }
    return false;
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
  const photos = [
    './images/apple.png',
    './images/orange.png',
    './images/beans.png',
    './images/cabbage.png',
  ];

  const list = items.map((item, index) => {
    const photoUrl = `https://picsum.photos/id/${index * 10}/50/50`;

    return (
      <li key={index}>
        <div className="product-listing">
          <Image className="product-image" src={photoUrl} width={70}></Image>
          <div className="product-details">
            <Button className="product-button" variant="primary" size="large">
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
    return (
      <Accordion>
        <Accordion.Item
          className="accordion-item"
          key={1 + index}
          eventKey={1 + index}
        >
          <Accordion.Header>
            {item.name} {item.inCart}
          </Accordion.Header>
          <Accordion.Body
            onClick={() => {
              incrementStock(item.id);
              deleteCartItem(index);
            }}
            eventKey={1 + index}
          >
            $ {item.cost} from {item.country}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  });

  function groupedCart(cart) {
    const gCart = {};
    const groupedArray = [];
    cart.forEach((item) => {
      const { name } = item;
      const total = item.inCart;
      if (!gCart[name]) {
        const { id, cost, inCart } = item;
        gCart[name] = { id, name, cost, inCart: 1 };
      } else {
        const currentCount = gCart[name].inCart;
        gCart[name].inCart += 1;
      }
    });

    for (let key in gCart) {
      groupedArray.push(gCart[key]);
    }
    return groupedArray;
  }
  let finalList = () => {
    let total = checkOut();

    let final = groupedCart(cart).map((item, index) => {
      return (
        <div key={index} index={index}>
          {item.name} (x{item.inCart})... ${item.cost * item.inCart}
        </div>
      );
    });
    return { final, total };
  };

  const checkOut = () => {
    let costs = cart.map((item) => item.cost);
    const reducer = (accum, current) => accum + current;
    let newTotal = costs.reduce(reducer, 0);
    console.log(`total updated to ${newTotal}`);
    return newTotal;
  };
  // TODO: implement the restockProducts function
  let productId = tempId;
  const restockProducts = (url) => {
    doFetch(url);
    const res = data.data; // Data object is nested in response
    const tempItems = res.map((item) => {
      // utilize a dummy ID so that we can restock as many times as we'd like w/o ID collisions
      const id = productId;
      productId++;
      setTempId((tempId) => tempId + 1);
      const { name, cost, country, instock } = item.attributes;
      return { id, name, cost, country, instock, inCart: 0 };
    });
    setItems([...items, ...tempItems]);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Product List</h1>
          <ul style={{ listStyleType: 'none' }}>{list}</ul>
        </Col>
        <Col>
          <h1>Cart Contents</h1>
          <Accordion defaultActiveKey="0">{cartList}</Accordion>
        </Col>
        <Col>
          <h1>CheckOut </h1>
          <Button onClick={checkOut}>CheckOut $ {finalList().total}</Button>
          <div> {finalList().total > 0 && finalList().final} </div>
        </Col>
      </Row>
      <Row>
        <form
          onSubmit={(event) => {
            restockProducts(`http://localhost:1337/api/${query}`);
            console.log(`Restock called on ${query}`);
            event.preventDefault();
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit">ReStock Products</button>
        </form>
      </Row>
    </Container>
  );
}
// ========================================
ReactDOM.render(<Products />, document.getElementById('root'));
