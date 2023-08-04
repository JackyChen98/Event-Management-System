package com.test.mapper;

import com.test.pojo.Command;

import com.test.pojo.Event;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
* @author 40255
* @description 针对表【command】的数据库操作Mapper
* @createDate 2023-07-04 19:42:12
* @Entity com.test.pojo.Command
*/
@Repository
public interface CommandMapper{
    int deleteByPrimaryKey(Integer id);

    int insertSelective(Command record);

    Command selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Command record);

    List<Command> queryAll();

}




