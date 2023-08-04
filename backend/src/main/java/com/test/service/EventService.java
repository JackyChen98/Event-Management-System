package com.test.service;

import com.test.pojo.Event;
import com.test.pojo.Users;

import javax.persistence.criteria.CriteriaBuilder;
import java.util.List;

/**
* @author 40255
* @description 针对表【event】的数据库操作Service
* @createDate 2023-06-25 11:42:07
*/
public interface EventService{
    List<Event> queryAll();

    Event findById(Integer Event_Id);

    int insert(Event event);

    void deleteById(Integer Event_Id);

    String update(Event event);

    List<Event> searchByName(String[] items);

    List<Event> searchByType(String type);

    List<Event> searchByCode(Integer code);

    List<Event> searchByTypeHome(String type);
}
