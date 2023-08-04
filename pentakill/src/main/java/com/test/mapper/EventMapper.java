package com.test.mapper;

import com.test.pojo.Event;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
* @author 40255
* @description 针对表【event】的数据库操作Mapper
* @createDate 2023-06-25 11:42:07
* @Entity com.test.pojo.Event
*/
@Repository
public interface EventMapper{
    int deleteByPrimaryKey(Integer id);

    int insertSelective(Event record);

    Event selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Event record);

    int updateByPrimaryKey(Event record);

    List<Event> queryAll();

    List<Event> searchByName(String item);

    List<Event> searchByType(String type);

    Event selectOnt(int eventHolderId, String eventName);

    List<Event> searchByCode(Integer code);

    List<Event> searchByTypeHome(String type);

}




