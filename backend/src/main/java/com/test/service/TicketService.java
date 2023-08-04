package com.test.service;

import com.test.pojo.Ticket;

import java.util.List;

/**
 * @author 40255
 * @description 针对表【command】的数据库操作Service
 * @createDate 2023-07-04 19:42:12
 */
public interface TicketService{
    List<Ticket> queryAll();

    Ticket findById(Integer Ticket_Id);

    int insert(Ticket ticket);

    void deleteById(Integer Ticket_Id);

    String update(Ticket ticket);

    List<Ticket> getByTwo(Ticket ticket);
}
