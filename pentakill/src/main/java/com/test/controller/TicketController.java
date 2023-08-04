package com.test.controller;
import com.test.pojo.Ticket;
import com.test.response.Response;
import com.test.service.TicketService;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.sql.rowset.serial.SerialBlob;
import java.sql.Blob;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/ticket")
public class TicketController {
    @Autowired
    private TicketService ticketService;

    @GetMapping("/query")
    public List<Ticket> queryAll(){
        return ticketService.queryAll();
    }

    @PutMapping("/getId")
    public List<Ticket> getByTwo(@RequestBody Ticket ticket){
        if(ticket.getEventId()==null || ticket.getUserId()==null){
            return new ArrayList<>();
        }
        return ticketService.getByTwo(ticket);
    }

    /**
     * 通过ID查询
     */
    @GetMapping("/query/{id}")
    public Ticket queryById(@PathVariable Integer id){
        return ticketService.findById(id);
    }

    /**
     * 删除
     * @param id
     * @return
     */
    @DeleteMapping("/delete/{id}")
    public Response delete(@PathVariable Integer id){
        ticketService.deleteById(id);
        Response response = new Response();
        response.setSuccess(true);
        return response;
    }

    /**
     * 新增
     * @param ticket
     * @return
     */
    @PostMapping("/insert")
    public int insert(@RequestBody Ticket ticket){
        if(ticket.getTicketRow()==null || ticket.getUserId()==null
                || ticket.getTicketColumn()==null || ticket.getEventId()==null) {
            return -1;
        }
        return ticketService.insert(ticket);
    }

    /**
     * 修改
     * @param ticket
     * @return
     */
    @PutMapping("/update")
    public Response update(@RequestBody Ticket ticket){
        ticketService.update(ticket);
        Response response = new Response();
        response.setSuccess(true);
        return response;
    }
}
