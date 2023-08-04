package com.test.mapper;

import com.test.pojo.Users;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsersMapper {
    int deleteByPrimaryKey(Integer id);

    int insertSelective(Users record);

    Users selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Users record);

    List<Users> queryAll();

    Users selectOnt(String userEmail, String userPassword);

    Users selectOno(String userEmail);
}




