package com.test.service.impl;

import com.test.pojo.Ticket;
import com.test.mapper.TicketMapper;
import com.test.service.TicketService;
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
public class TicketServiceImpl implements TicketService{
    private final TicketMapper ticketMapper;

    public TicketServiceImpl(TicketMapper ticketMapper) {
        this.ticketMapper = ticketMapper;
    }

    @Override
    public List<Ticket> queryAll() {
        return ticketMapper.queryAll();
    }

    @Override
    public Ticket findById(Integer id) {
        return ticketMapper.selectByPrimaryKey(id);
    }

    @SneakyThrows
    @Override
    public int insert(Ticket ticket) {
        //userMapper.insert(user);        //将除id所有的列都拼SQL
        if (ticket.getUserId() == null){
            return -1;
        }else if (ticket.getEventId() == null){
            return -2;
        }
        ticketMapper.insertSelective(ticket);
        return ticket.getTicketId();
    }

    @Override
    public void deleteById(Integer id) {
        ticketMapper.deleteByPrimaryKey(id);
    }

    @Override
    public String update(Ticket ticket) {
        if (ticket.getTicketId() == null){
            return "null comment id";
        }
        ticketMapper.updateByPrimaryKeySelective(ticket);
        return "success";
    }

    @Override
    public List<Ticket> getByTwo(Ticket ticket) {
        return ticketMapper.getByTwo(ticket);
    }
}





