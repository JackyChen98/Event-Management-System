package com.test.service.impl;

import com.test.mapper.UsersMapper;
import com.test.pojo.Event;
import com.test.mapper.EventMapper;
import com.test.pojo.Users;
import com.test.service.EventService;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
* @author 40255
* @description 针对表【event】的数据库操作Service实现
* @createDate 2023-06-25 11:42:07
*/
@Service
public class EventServiceImpl implements EventService {
    private final EventMapper eventMapper;

    public EventServiceImpl(EventMapper eventMapper) {
        this.eventMapper = eventMapper;
    }

    @Override
    public List<Event> queryAll() {
        return eventMapper.queryAll();
    }

    @Override
    public Event findById(Integer id) {
        return eventMapper.selectByPrimaryKey(id);
    }

    @SneakyThrows
    @Override
    public int insert(Event event) {
        //userMapper.insert(user);        //将除id所有的列都拼SQL
        if (event.getEventHolderId() == null){
            return -1;
        }else if (event.getEventName() == null){
            return -2;
        }
        eventMapper.insertSelective(event);
        return event.getEventId();
    }

    @Override
    public void deleteById(Integer id) {
        eventMapper.deleteByPrimaryKey(id);
    }

    @Override
    public String update(Event event) {
        if (event.getEventId() == null){
            return "null event id";
        }
        eventMapper.updateByPrimaryKeySelective(event);
        return "success";
    }

    public List<Event> searchByName(String[] items){
        List<Event> temp = new ArrayList<>();
        for (int i = 0; i < items.length; i++) {
            temp.addAll(eventMapper.searchByName(items[i]));
        }
        return temp;
    }

    public List<Event> searchByType(String type){
        return eventMapper.searchByType(type);
    }

    public List<Event> searchByCode(Integer code){
        return eventMapper.searchByCode(code);
    }

    public List<Event> searchByTypeHome(String type){
        return eventMapper.searchByTypeHome(type);
    }
}




