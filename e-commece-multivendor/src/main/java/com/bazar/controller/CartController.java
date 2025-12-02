package com.bazar.controller;

import com.bazar.model.Cart;
import com.bazar.model.CartItem;
import com.bazar.model.Product;
import com.bazar.model.User;
import com.bazar.request.AddItemRequest;
import com.bazar.response.ApiResponse;
import com.bazar.service.CartItemService;
import com.bazar.service.CartService;
import com.bazar.service.ProductService;
import com.bazar.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;
    private final CartItemService cartItemService;
    private final UserService userService;
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Cart> findUserCartHandler(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Cart cart = cartService.findUserCart(user);

        return new ResponseEntity<Cart>(cart, HttpStatus.OK);
    }

    @PutMapping("/add")
    public ResponseEntity<CartItem> addCartItemHandler(@RequestBody AddItemRequest req,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Product product = productService.findProductById(req.getProductId());
        CartItem item = cartService.addCartItem(user, product, req.getSize(), req.getQuantity());
        ApiResponse res = new ApiResponse();
        res.setMessage("Item added to cart successfully");
        return new ResponseEntity<>(item, HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/item/{cartItemId}")
    public ResponseEntity<ApiResponse> deleteCartItemHandler(@PathVariable Long cartItemId,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        cartItemService.removeCartItem(cartItemId, user.getId());
        ApiResponse res = new ApiResponse();
        res.setMessage("Cart item removed successfully");
        return new ResponseEntity<ApiResponse>(res, HttpStatus.ACCEPTED);
    }

    @PutMapping("/item/{cartItemId}")
    public ResponseEntity<CartItem> updateCartItemHandler(@PathVariable Long cartItemId,
            @RequestBody CartItem cartItem,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        CartItem updatedCartItem = null;
        if (cartItem.getQuantity() > 0) {
            updatedCartItem = cartItemService.updateCartItem(cartItem, cartItemId, user.getId());
        }
        return new ResponseEntity<>(updatedCartItem, HttpStatus.ACCEPTED);
    }

}
