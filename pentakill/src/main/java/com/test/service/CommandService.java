package com.test.service;

import com.test.pojo.Command;
import com.test.pojo.Event;

import java.util.List;

/**
* @author 40255
* @description 针对表【command】的数据库操作Service
* @createDate 2023-07-04 19:42:12
*/
public interface CommandService{
    List<Command> queryAll();

    Command findById(Integer Command_Id);

    int insert(Command command);

    void deleteById(Integer Command_Id);

    String update(Command Command);
}
