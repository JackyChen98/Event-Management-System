package com.test.service.impl;

import com.test.mapper.UsersMapper;
import com.test.pojo.Users;
import com.test.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsersServiceImpl implements UsersService {

    private final UsersMapper usersMapper;

    public UsersServiceImpl(UsersMapper usersMapper) {
        this.usersMapper = usersMapper;
    }

    @Override
    public List<Users> queryAll() {
        return usersMapper.queryAll();
    }

    @Override
    public Users findById(Integer id) {
        return usersMapper.selectByPrimaryKey(id);
    }

    @Override
    public int insert(Users users) {
        //userMapper.insert(user);        //将除id所有的列都拼SQL
        if (users.getUserEmail() == ""){
            return -1;
        } else if(users.getUserPassword() == ""){
            return -2;
        }
        Users users1 = usersMapper.selectOno(users.getUserEmail());
        if (users1 != null){
            return 0;
        }
        usersMapper.insertSelective(users); //只是将不为空的列才拼SQL
        Users users2 = usersMapper.selectOnt(users.getUserEmail(), users.getUserPassword());
        return users2.getUserId();
    }

    @Override
    public void deleteById(Integer id) {
        usersMapper.deleteByPrimaryKey(id);
    }

    @Override
    public void update(Users users) {
        usersMapper.updateByPrimaryKeySelective(users);
    }

    @Override
    public int login(Users users) {
        Users users1 = usersMapper.selectOno(users.getUserEmail());
        if (users1 != null) {
            if (users1.getUserPassword().equals(users.getUserPassword())){
                return users1.getUserId();
            } else {
                return -1;
            }
        } else{
            return 0;
        }
    }
}




