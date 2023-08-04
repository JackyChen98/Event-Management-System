package com.test.service;

import com.test.pojo.Users;

import java.util.List;

/**
* @author 40255
* @description 针对表【users】的数据库操作Service
* @createDate 2023-06-20 10:17:11
*/
public interface UsersService {
    List<Users> queryAll();

    Users findById(Integer User_Id);

    int login(Users users);

    int insert(Users users);

    void deleteById(Integer User_Id);

    void update(Users users);

}
