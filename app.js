
// Cached elements
const addToCart = document.querySelectorAll('.addToCart')
const cartValue = document.querySelector('.cartValue')
const decrement = document.querySelectorAll('.decrement')
const increment = document.querySelectorAll('.increment')
const totalCartPriceEl = document.querySelector('.totalCartPrice')
const productList = document.getElementById('product-list')
const confirmEl = document.getElementById('confirm-order')
const orderModal = document.getElementById('order-modal')
const modalButton = document.getElementById('modal-button')
const emptyCartContent = document.getElementById('empty-cart')
const showCartContent = document.getElementById('show-cart')
const overlay = document.getElementById('overlay');


// Variables
let cart = {};
let productUI = {};
let isAnythingInCart = false;

// Functions
fetch('./data.json').then(res => res.json()).then(collection => {
    collection.forEach((data) => {
        const productCard = document.createElement('div')
        productCard.classList.add('productCard')
        productList.appendChild(productCard)
        
        const imgButton = document.createElement('div')
        imgButton.classList.add('imgButton')
        productCard.appendChild(imgButton)
        
        const mobileImage = document.createElement('img')
        mobileImage.src = data.image.mobile
        mobileImage.alt = data.name
        imgButton.append(mobileImage)

        const addToCart = document.createElement('button')
        addToCart.classList.add('addToCart')
        
        const addToCartImg = document.createElement('img')
        addToCartImg.src = "./assets/images/icon-add-to-cart.svg"
        addToCartImg.alt = "add to cart icon"
        
        addToCart.appendChild(addToCartImg)
        addToCart.append('Add to Cart')
        imgButton.appendChild(addToCart)

        const foodCard = document.createElement('div')
        foodCard.classList.add('foodCard')
        productCard.appendChild(foodCard)

        const foodTitle = document.createElement('p')
        foodTitle.classList.add('foodTitle')
        foodTitle.textContent = data.category
        foodCard.appendChild(foodTitle)

        const foodDescription = document.createElement('p')
        foodDescription.classList.add('foodDescription')
        foodDescription.textContent = data.name
        foodCard.appendChild(foodDescription)

        const foodPrice = document.createElement('p')
        foodPrice.classList.add('foodPrice')
        foodPrice.textContent = `$${data.price.toFixed(2)}`
        foodCard.appendChild(foodPrice)

        const incDecButton = document.createElement('button')
        incDecButton.classList.add('incDec', 'hide')
        imgButton.appendChild(incDecButton)

        const decrementButton = document.createElement('div')
        decrementButton.textContent = '−'
        decrementButton.classList.add('dot', 'decrement')
        incDecButton.append(decrementButton)

        const buttonValue = document.createElement('p')
        buttonValue.classList.add('buttonValue')
        buttonValue.textContent = 0
        incDecButton.appendChild(buttonValue)

        const incrementButton = document.createElement('div')
        incrementButton.classList.add('dot', 'increment')
        incrementButton.textContent = '+'
        incDecButton.append(incrementButton)

        addToCart.addEventListener('click', () => {
            addToCart.classList.add('hide')
            incDecButton.classList.remove('hide')
            imgButton.classList.add('active')

        })
        
        incrementButton.addEventListener('click', () => {

            if (cart[data.name]) {
                cart[data.name].quantity++
            } else {
                cart[data.name] = {
                    name: data.name,
                    price: data.price,
                    image: data.image,
                    quantity: 1
                }
                isAnythingInCart = true
                showCartContent.classList.remove('hide')
            }
            buttonValue.textContent = cart[data.name].quantity
            renderCart()
        })
        
        decrementButton.addEventListener('click', () => {

            if (!cart[data.name]) return

            cart[data.name].quantity--
            
            if (cart[data.name].quantity <= 0) {
                delete cart[data.name]
                buttonValue.textContent = 0
                isAnythingInCart = false
            } else {
                buttonValue.textContent = cart[data.name].quantity
            }
            renderCart()
            }
        )

        productUI[data.name] = {
            buttonValue,
            incDecButton,
            addToCart,
            imgButton,
        }
    })

    const renderCart = () => {
        let numberOfItemsIncart = 0;
        let totalCartPrice = 0;
    
        const blocker = document.querySelector('.blocker')
        const modalCartHolder = document.getElementById('modal-cart-info')
        blocker.innerHTML = ""
        modalCartHolder.innerHTML = ""
    
        Object.values(cart).forEach((item) => {
    
            numberOfItemsIncart += item.quantity
            totalCartPrice += item.quantity * item.price
    
            const cartCardSeperator = document.createElement('div')
            cartCardSeperator.classList.add('cartCardSeperator')
            blocker.appendChild(cartCardSeperator)
            
            const cartCardInfoContainer = document.createElement('div')
            cartCardInfoContainer.classList.add('cartCardInfoContainer')
            cartCardSeperator.appendChild(cartCardInfoContainer)
            
            const cartCardInfoTitle = document.createElement('p')
            cartCardInfoTitle.classList.add('cartCardInfoTitle')
            cartCardInfoTitle.textContent = item.name
            cartCardInfoContainer.appendChild(cartCardInfoTitle)
            
            const cartCardInfo = document.createElement('div')
            cartCardInfo.classList.add('cartCardInfo')
            cartCardInfoContainer.appendChild(cartCardInfo)
            
            const quantity = document.createElement('p')
            quantity.id = 'quantity'
            quantity.textContent = `${item.quantity}x`
            cartCardInfo.appendChild(quantity)
            
            const originalItemPrice = document.createElement('p')
            originalItemPrice.id = 'originalItemPrice'
            originalItemPrice.textContent = `@ $${item.price.toFixed(2)}`
            cartCardInfo.appendChild(originalItemPrice)
            
            const totalItemPrice = document.createElement('p')
            totalItemPrice.id = 'totalItemPrice'
            totalItemPrice.textContent = `$${(item.quantity * item.price).toFixed(2)}`
            cartCardInfo.appendChild(totalItemPrice)
            
            const removeItem = document.createElement('div')
            removeItem.classList.add('dot')
            removeItem.id = 'remove-item'
            cartCardSeperator.appendChild(removeItem)

            const removeTextContent = document.createElement('p')
            removeTextContent.textContent = '×'
            removeItem.appendChild(removeTextContent)
     
            const hr = document.createElement('hr')
            hr.classList.add('hr')
            blocker.appendChild(hr)

            removeItem.addEventListener('click', () => {
                delete cart[item.name]
                isAnythingInCart = false
                renderCart()
            })


            const modalCartInfo = document.createElement('div')
            modalCartInfo.id = 'modal-cart'
            modalCartHolder.appendChild(modalCartInfo)
    
            const cartInfo1 = document.createElement('div')
            cartInfo1.id = 'cartInfo1'
            modalCartInfo.appendChild(cartInfo1)
    
            const cartImageHolder = document.createElement('div')
            cartImageHolder.id = 'cartImageHolder'
            cartInfo1.appendChild(cartImageHolder)
    
            const cartImage = document.createElement('img')
            cartImage.id = 'cartImage'
            cartImage.src = item.image.thumbnail
            cartImage.alt = item.name
            cartImageHolder.appendChild(cartImage)
    
            const cartPrices = document.createElement('div')
            cartPrices.id = 'cartPrices'
            cartInfo1.appendChild(cartPrices)
    
            const cartTitle = document.createElement('div')
            cartTitle.id = 'cartTitle'
            cartTitle.textContent = item.name
            cartPrices.appendChild(cartTitle)
    
            const cartQuaPrice = document.createElement('div')
            cartQuaPrice.id = 'cartQuaPrice'
            cartPrices.appendChild(cartQuaPrice)
    
            const cartQuantity = document.createElement('div')
            cartQuantity.id = 'cartQuantity'
            cartQuantity.textContent = `${item.quantity}x`
            cartQuaPrice.appendChild(cartQuantity)
    
            const cartOriginalPrice = document.createElement('div')
            cartOriginalPrice.id = 'cartOriginalPrice'
            cartOriginalPrice.textContent = `@$${item.price.toFixed(2)}`
            cartQuaPrice.appendChild(cartOriginalPrice)
    
            const cartInfo2 = document.createElement('div')
            cartInfo2.id = 'cartInfo2'
            cartInfo2.textContent = `$${(item.quantity * item.price).toFixed(2)}`
            modalCartInfo.appendChild(cartInfo2)
    
            const cartHr = document.createElement('hr')
            cartHr.id = 'hr2'
            modalCartHolder.appendChild(cartHr)
    
            const cartTotal = document.getElementById('cart-total')
            cartTotal.textContent = `$${totalCartPrice.toFixed(2)}`

            modalButton.addEventListener('click', () => {
                delete cart[item.name]
                isAnythingInCart = false
                showCartContent.classList.add('hide')
                orderModal.classList.remove('active')
                overlay.classList.remove('active');
                renderCart()
            })
        })
        
        cartValue.textContent = `Your Cart (${numberOfItemsIncart})`
        totalCartPriceEl.textContent = `$${totalCartPrice.toFixed(2)}`

        if (numberOfItemsIncart != 0) {
            emptyCartContent.classList.add('hide')
        } else {
            emptyCartContent.classList.remove('hide')
            showCartContent.classList.add('hide')
        }

        Object.keys(productUI).forEach(name => {
            const product = productUI[name]
            const cartItem = cart[name]

            if (cartItem) {
                product.buttonValue.textContent = cartItem.quantity
            } else {
                product.buttonValue.textContent = 0
                product.incDecButton.classList.add('hide')
                product.addToCart.classList.remove('hide')
                product.imgButton.classList.remove('active')
            }
        })

        confirmEl.addEventListener('click', () => {
            if (numberOfItemsIncart) {
                orderModal.classList.add('active')
                overlay.classList.add('active');
            } else {
                return
            }
        })
    }
});
