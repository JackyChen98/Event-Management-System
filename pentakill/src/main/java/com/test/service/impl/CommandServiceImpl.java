package com.test.service.impl;

import com.test.pojo.Command;
import com.test.mapper.CommandMapper;
import com.test.service.CommandService;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
* @author 40255
* @description 针对表【command】的数据库操作Service实现
* @createDate 2023-07-04 19:42:12
*/
@Service
public class CommandServiceImpl implements CommandService{
    private final CommandMapper commandMapper;

    public CommandServiceImpl(CommandMapper commandMapper) {
        this.commandMapper = commandMapper;
    }

    @Override
    public List<Command> queryAll() {
        return commandMapper.queryAll();
    }

    @Override
    public Command findById(Integer id) {
        return commandMapper.selectByPrimaryKey(id);
    }

    @SneakyThrows
    @Override
    public int insert(Command command) {
        //userMapper.insert(user);        //将除id所有的列都拼SQL
        if (command.getUserId() == null){
            return -1;
        }else if (command.getCommandDetail() == null){
            return -2;
        }
        commandMapper.insertSelective(command);
        return command.getCommandId();
    }

    @Override
    public void deleteById(Integer id) {
        commandMapper.deleteByPrimaryKey(id);
    }

    @Override
    public String update(Command command) {
        if (command.getCommandId() == null){
            return "null comment id";
        }
        commandMapper.updateByPrimaryKeySelective(command);
        return "success";
    }
}




