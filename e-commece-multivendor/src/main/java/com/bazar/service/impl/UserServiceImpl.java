package com.bazar.service.impl;

import com.bazar.config.JwtProvider;
import com.bazar.model.User;
import com.bazar.repository.UserRepository;
import com.bazar.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    @Override
    public User findUserByJwtToken(String jwt) throws Exception {
        String email= jwtProvider.getEmailFromToken(jwt);
        return this.findUserByEmail(email);

    }

    @Override
    public User findUserByEmail(String email) throws Exception {
        User user=userRepository.findByEmail(email);
        if (user==null){
            throw new Exception ("User not found with email: "+email);
        }
        return user;
    }
}
