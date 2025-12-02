package com.bazar.service.impl;

import com.bazar.model.CartItem;
import com.bazar.model.User;
import com.bazar.repository.CartItemRepository;
import com.bazar.service.CartItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartItemServiceImpl implements CartItemService {
    private final CartItemRepository cartItemRepository;

    @Override
    public CartItem updateCartItem(CartItem cartItem, Long id, Long userId) throws Exception {
        CartItem item=findCartItemById(id);
        User cartItemUser=item.getCart().getUser();
        if (cartItemUser.getId().equals(userId)){
            item.setQuantity(cartItem.getQuantity());
            item.setMrpPrice((int) (item.getQuantity()*item.getProduct().getMrpPrice()));
            item.setSellingPrice((int) (item.getQuantity()*item.getProduct().getSellingPrice()));
            return cartItemRepository.save(item);
        }
        throw new Exception("Unauthorized to update this cart item");
    }

    @Override
    public void removeCartItem(Long cartItemId, Long userId) throws Exception {
        CartItem item=findCartItemById(cartItemId);
        User cartItemUser=item.getCart().getUser();
        if (cartItemUser.getId().equals(userId)){
            cartItemRepository.delete(item);
        }
        else throw new Exception("Unauthorized to delete this cart item");
    }

    @Override
    public CartItem findCartItemById(Long id) throws Exception {
        return cartItemRepository.findById(id).orElseThrow(()->
                new Exception("Cart item not found with id: "+id));
    }
}
