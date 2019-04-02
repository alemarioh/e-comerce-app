import React from 'react';
import {storeProducts, detailProduct} from './data'


const ProductContext = React.createContext();

// Provider
// Consumer

class ProductProvider extends React.Component {
	
	state = {
	  products: storeProducts,
	  detailProduct: detailProduct,
	  cart: [],
	  // cart: storeProducts,
	  modalOpen: false,
	  modalProduct: detailProduct,
	  cartSubtotal: 0,
	  cartTax: 0, 
	  cartTotal: 0
	}


	componentDidMount(){
		this.setProducts();
	}

	setProducts = ()=>{
		let tempProducts =[]
		storeProducts.forEach(item=>{
			const singleItem = {...item};
			tempProducts = [...tempProducts, singleItem];
		});
		this.setState(()=>{
			return {products: tempProducts};
		});
	}
 
	getItem = (id) => {
		const product = this.state.products.find(item => item.id === id)
		return product
	}

	handleDetail = (id) => {
		const product = this.getItem(id);
		this.setState(()=>{
		  return {
			detailProduct:product
		  }
		})
	}

	addToCart = (id) => {
		let tempProducts = [...this.state.products];
		const index = tempProducts.indexOf(this.getItem(id));
		const product = tempProducts[index];
		product.inCart = true;
		product.count = 1;
		const price = product.price;
		product.total = price;
		this.setState(()=>{
			return{
				products: tempProducts,
				cart: [...this.state.cart, product]
			}
		}, ()=>this.addTotals());
			
	}

	openModal = (id) => {
	  const product = this.getItem(id);
	  this.setState(()=>{
	  	return {modalProduct: product, modalOpen: true}
	  })
	}

	closeModal = () => {
	  this.setState(() =>{
	    return {modalOpen: false}
	  })
	}
	 
	// tester = () =>{
	// 	console.log('state products: ', this.state.products[0].inCart);
	// 	console.log('data products: ', storeProducts[0].inCart);
	
	// 	const tempProducts = [...this.state.products];
	// 	tempProducts[0].inCart = true;

	// 	this.setState(
	// 		()=>{
	// 			return {
	// 				products: tempProducts
	// 			};
	// 		}
	// 	, ()=> {
	// 		console.log('state products: ', this.state.products[0].inCart);
	// 		console.log('data products: ', storeProducts[0].inCart);
	// 	})

	// }

	increment = (id) => {
		let tempCart = [...this.state.cart];
		const selectedProduct = tempCart.find(item => item.id ===id);
		const index = tempCart.indexOf(selectedProduct);
		const product = tempCart[index];
		product.count += 1;
		product.total += product.price;

		this.setState(()=>{
		  return {
			cart: [...tempCart]
		  }
		}, ()=>{
			this.addTotals();
		})
	}

	decrement = (id) => {
		let tempCart = [...this.state.cart];
		const selectedProduct = tempCart.find(item => item.id ===id);
		const index = tempCart.indexOf(selectedProduct);
		const product = tempCart[index];
		if(product.count>1){

		  product.count -= 1;
		  product.total -= product.price;

		  this.setState(()=>{
		    return {
			  cart: [...tempCart]
		    }
		  }, ()=>{
			   this.addTotals();
		})}
		else {
		  product.count = 1;
		  product.total = product.price;

		  this.setState(()=>{
		    return {
			  cart: [...tempCart]
		    }
		  }, ()=>{
			   this.addTotals();
			 }
		  )
		}
	}

	removeItem = (id) => {
		let tempProducts = [...this.state.products];
		let tempCart = [...this.state.cart];

		tempCart = tempCart.filter(item => item.id !==id);

		const index = tempProducts.indexOf(this.getItem(id));
		const product = tempProducts[index];
		product.inCart = false;
		product.count = 0;
		product.total = 0;

		this.setState(()=>{
		  return{
		  	products: [...tempProducts],
		  	cart: [...tempCart]
		  }
		}, ()=>{
			this.addTotals();
		})

	}

	clearCart = () => {
		this.setState(()=>{
			return ({
			  cart:[]
			})
		},
			()=>{
			  this.setProducts()
			}
		)
	}

	addTotals = () =>{
		let subTotal = 0;
		this.state.cart.map(item => subTotal += item.total);
		const tempTax = subTotal * 0.1;
		const tax = parseFloat(tempTax.toFixed(2));
		const total = subTotal + tax;
		this.setState(()=>{
		  return {
		  	cartSubtotal: subTotal,
		  	cartTax: tax,
		  	cartTotal: total
			}
		});
	}

	render() {
		return (
			<ProductContext.Provider value={{
				...this.state,
				handleDetail:this.handleDetail,
				addToCart:this.addToCart,
				openModal: this.openModal,
				closeModal: this.closeModal,
				increment: this.increment,
				decrement: this.decrement,
				removeItem: this.removeItem,
				clearCart: this.clearCart
			}}> 
			 {/*<button onClick={this.tester}>test me</button>*/}
			  {this.props.children}

			</ProductContext.Provider>
		);
	}
}
const ProductConsumer = ProductContext.Consumer;

export  {ProductProvider, ProductConsumer};