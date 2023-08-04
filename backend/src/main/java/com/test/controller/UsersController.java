package com.test.controller;

import com.test.pojo.Users;
import com.test.response.Response;
import com.test.service.UsersService;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/user")
public class UsersController {

    @Autowired
    private UsersService usersService;

    /**
     * restful格式进行访问
     * 查询：GET
     * 新增: POST
     * 更新：PUT
     * 删除: DELETE
     */
    /**
     * 查询所有
     * @return
     */
    @GetMapping("/query")
    public List<Users> queryAll(){
        return usersService.queryAll();
    }

    /**
     * 通过ID查询
     */
    @GetMapping("/query/{id}")
    public Users queryById(@PathVariable Integer id){
        return usersService.findById(id);
    }

    /**
     * 删除
     * @param id
     * @return
     */
    @DeleteMapping("/delete/{id}")
    public Response delete(@PathVariable Integer id){
        usersService.deleteById(id);
        Response response = new Response();
        response.setSuccess(true);
        return response;
    }

    /**
     * 新增
     * @param users
     * @return
     */
    @PostMapping("/insert")
    public int insert(@RequestBody Users users){
        return usersService.insert(users);
    }

    /**
     * 修改
     * @param users
     * @return
     */
    @PutMapping("/update")
    public Response update(@RequestBody Users users){
        if(users.getUserEmail()!=null){
            Response response = new Response();
            response.setSuccess(false);
            return response;
        }
        usersService.update(users);
        Response response = new Response();
        response.setSuccess(true);
        return response;
    }

    @PutMapping("/login")
    public int login(@RequestBody Users users){
        int id = usersService.login(users);
        return id;
    }


    //String User_Email, String User_Password



}
