package com.test.controller;

import com.test.pojo.Event;
import com.test.pojo.Users;
import com.test.response.Response;
import com.test.service.UsersService;
import com.test.mapper.EventMapper;
import com.test.service.EventService;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.json.JSONObject;
import org.json.JSONException;

import javax.sql.rowset.serial.SerialBlob;
import java.sql.Blob;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.text.ParseException;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@RequestMapping("/event")
public class EventController {
    @Autowired
    private EventService eventService;
    @Autowired
    private UsersService usersService;

    @GetMapping("/query")
    public List<Event> queryAll(){
        return eventService.queryAll();
    }

    /**
     * 通过ID查询
     */
    @GetMapping("/query/{id}")
    public Event queryById(@PathVariable Integer id){
        return eventService.findById(id);
    }

    /**
     * 删除
     * @param id
     * @return
     */
    @DeleteMapping("/delete/{id}")
    public Response delete(@PathVariable Integer id){
        eventService.deleteById(id);
        Response response = new Response();
        response.setSuccess(true);
        return response;
    }

    /**
     * 新增
     * @param event
     * @return
     */
    @PostMapping("/insert")
    public int insert(@RequestBody Event event){
        eventService.insert(event);
        return event.getEventId();
    }

    /**
     * 修改
     * @param event
     * @return
     */
    @PutMapping("/update")
    public Response update(@RequestBody Event event){
        eventService.update(event);
        Response response = new Response();
        response.setSuccess(true);
        return response;
    }

    @GetMapping("/name/{name}")
    public List<Event> searchByName(@PathVariable String name){
        String[] items = name.split("\\s+");
        List<Event> res = eventService.searchByName(items);
        res = res.stream().distinct().collect(Collectors.toList());
        res.sort((e1, e2) -> {
            try {
                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                Date date1 = sdf1.parse(e1.getEventStartDate());
                Date date2 = sdf1.parse(e2.getEventStartDate());
                return date1.compareTo(date2);
            } catch (ParseException e) {
                e.printStackTrace();
                return 0;
            }
        });
        return res;
    }
    @GetMapping("/type/{type}")
    public List<Event> searchByType(@PathVariable String type){
        List<Event> temp1 = eventService.searchByType(type);
        Date currentDate = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);
        calendar.add(Calendar.MONTH, 1);
        Date oneMonthLater = calendar.getTime();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        List<Event> result1 = new ArrayList<>();
        for (int i = 0; i < temp1.size(); i++) {
            Event currentEvent = temp1.get(i);
            if (currentEvent != null) {
                try {
                    Date eventStartDate = sdf.parse(currentEvent.getEventStartDate());
                    if(eventStartDate.after(currentDate) && eventStartDate.before(oneMonthLater)) {
                        result1.add(currentEvent);
                    }
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }
        }
        List<Event> res = new ArrayList<>();
        for (int i = 0; i < result1.size(); i++) {
            Event currentEvent = result1.get(i);
            if(currentEvent != null) { // 添加这一行
                String ticketsJson = currentEvent.getEventTicketLeft();
                try {
                    JSONObject tickets = new JSONObject(ticketsJson);
                    Iterator<String> keys = tickets.keys();
                    while (keys.hasNext()) {
                        String key = keys.next();
                        if (!tickets.isNull(key)) {
                            int count = tickets.getInt(key);
                            if (count > 0) {
                                res.add(currentEvent);
                                break;
                            }
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
        res.sort((e1, e2) -> {
            try {
                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                Date date1 = sdf1.parse(e1.getEventStartDate());
                Date date2 = sdf1.parse(e2.getEventStartDate());
                return date1.compareTo(date2);
            } catch (ParseException e) {
                e.printStackTrace();
                return 0;
            }
        });
        return res;
    }
    @GetMapping("/postcode/{code}")
    public List<Event> searchByType(@PathVariable Integer code){
        List<Event> temp1 = eventService.searchByCode(code);
        Date currentDate = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);
        calendar.add(Calendar.MONTH, 1);
        Date oneMonthLater = calendar.getTime();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        List<Event> result1 = new ArrayList<>();
        for (int i = 0; i < temp1.size(); i++) {
            Event currentEvent = temp1.get(i);
            if (currentEvent != null) {
                try {
                    Date eventStartDate = sdf.parse(currentEvent.getEventStartDate());
                    if(eventStartDate.after(currentDate) && eventStartDate.before(oneMonthLater)) {
                        result1.add(currentEvent);
                    }
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }
        }
        List<Event> res = new ArrayList<>();
        for (int i = 0; i < result1.size(); i++) {
            Event currentEvent = result1.get(i);
            if(currentEvent != null) { // 添加这一行
                String ticketsJson = currentEvent.getEventTicketLeft();
                try {
                    JSONObject tickets = new JSONObject(ticketsJson);
                    Iterator<String> keys = tickets.keys();
                    while (keys.hasNext()) {
                        String key = keys.next();
                        if (!tickets.isNull(key)) {
                            int count = tickets.getInt(key);
                            if (count > 0) {
                                res.add(currentEvent);
                                break;
                            }
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
        res.sort((e1, e2) -> {
            try {
                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                Date date1 = sdf1.parse(e1.getEventStartDate());
                Date date2 = sdf1.parse(e2.getEventStartDate());
                return date1.compareTo(date2);
            } catch (ParseException e) {
                e.printStackTrace();
                return 0;
            }
        });
        if (res.size() > 4) {
            res = res.subList(0, 4);
        }
        return res;
    }
    @GetMapping("/homeType/{type}")
    public List<Event> searchByTypeHome(@PathVariable String type){
        List<Event> temp1 = eventService.searchByTypeHome(type);
        Date currentDate = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);
        calendar.add(Calendar.MONTH, 1);
        Date oneMonthLater = calendar.getTime();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        List<Event> result1 = new ArrayList<>();
        for (int i = 0; i < temp1.size(); i++) {
            Event currentEvent = temp1.get(i);
            if (currentEvent != null) {
                try {
                    Date eventStartDate = sdf.parse(currentEvent.getEventStartDate());
                    if(eventStartDate.after(currentDate) && eventStartDate.before(oneMonthLater)) {
                        result1.add(currentEvent);
                    }
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }
        }
        List<Event> res = new ArrayList<>();
        for (int i = 0; i < result1.size(); i++) {
            Event currentEvent = result1.get(i);
            if(currentEvent != null) { // 添加这一行
                String ticketsJson = currentEvent.getEventTicketLeft();
                try {
                    JSONObject tickets = new JSONObject(ticketsJson);
                    Iterator<String> keys = tickets.keys();
                    while (keys.hasNext()) {
                        String key = keys.next();
                        if (!tickets.isNull(key)) {
                            int count = tickets.getInt(key);
                            if (count > 0) {
                                res.add(currentEvent);
                                break;
                            }
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
        res.sort((e1, e2) -> {
            try {
                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                Date date1 = sdf1.parse(e1.getEventStartDate());
                Date date2 = sdf1.parse(e2.getEventStartDate());
                return date1.compareTo(date2);
            } catch (ParseException e) {
                e.printStackTrace();
                return 0;
            }
        });
        if (res.size() > 4) {
            res = res.subList(0, 4);
        }
        return res;
    }

    @GetMapping("/upcoming")
    public List<Event> searchUpcoming() {
        List<Event> temp1 = eventService.queryAll();
        Date currentDate = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);
        calendar.add(Calendar.MONTH, 1);
        Date oneMonthLater = calendar.getTime();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        List<Event> result1 = new ArrayList<>();
        for (int i = 0; i < temp1.size(); i++) {
            Event currentEvent = temp1.get(i);
            if (currentEvent != null) {
                try {
                    Date eventStartDate = sdf.parse(currentEvent.getEventStartDate());
                    if(eventStartDate.after(currentDate) && eventStartDate.before(oneMonthLater)) {
                        result1.add(currentEvent);
                    }
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }
        }
        List<Event> res = new ArrayList<>();
        for (int i = 0; i < result1.size(); i++) {
            Event currentEvent = result1.get(i);
            if(currentEvent != null) { // 添加这一行
                String ticketsJson = currentEvent.getEventTicketLeft();
                try {
                    JSONObject tickets = new JSONObject(ticketsJson);
                    Iterator<String> keys = tickets.keys();
                    while (keys.hasNext()) {
                        String key = keys.next();
                        if (!tickets.isNull(key)) {
                            int count = tickets.getInt(key);
                            if (count > 0) {
                                res.add(currentEvent);
                                break;
                            }
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
        res.sort((e1, e2) -> {
            try {
                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                Date date1 = sdf1.parse(e1.getEventStartDate());
                Date date2 = sdf1.parse(e2.getEventStartDate());
                return date1.compareTo(date2);
            } catch (ParseException e) {
                e.printStackTrace();
                return 0;
            }
        });
        if (res.size() > 4) {
            res = res.subList(0, 4);
        }
        return res;
    }
    @GetMapping("/following/{id}")
    public List<Event> searchFollowing(@PathVariable Integer id) {
        Set<Integer> eventSet = new HashSet<>();
        Users user = usersService.findById(id);
        String temp = user.getUserFollowing();
        temp = temp.substring(1, temp.length() - 1);
        String[] strArray = temp.split(",");
        for(String s : strArray) {
            s = s.trim();
            if (!s.isEmpty()) {
                int userId = Integer.parseInt(s);
                Users f = usersService.findById(userId);
                String events = f.getUserHoldActivityList();
                events = events.substring(1, events.length() - 1);
                String[] a = events.split(",");
                for(String s2 : a) {
                    s2 = s2.trim();
                    if (!s2.isEmpty()) {
                        eventSet.add(Integer.parseInt(s2));
                    }
                }
            }
        }
        List<Integer> eventIds = new ArrayList<>(eventSet);
        List<Event> result = eventIds.stream()
                .map(eventId -> eventService.findById(eventId))
                .filter(Objects::nonNull)  // 过滤掉所有返回null的事件
                .collect(Collectors.toList());
        List<Event> temp1 = result;
        Date currentDate = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);
        calendar.add(Calendar.MONTH, 1);
        Date oneMonthLater = calendar.getTime();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        List<Event> result1 = new ArrayList<>();
        for (int i = 0; i < temp1.size(); i++) {
            Event currentEvent = temp1.get(i);
            if (currentEvent != null) {
                try {
                    Date eventStartDate = sdf.parse(currentEvent.getEventStartDate());
                    if(eventStartDate.after(currentDate)) {
                        result1.add(currentEvent);
                    }
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }
        }
        List<Event> res = new ArrayList<>();
        for (int i = 0; i < result1.size(); i++) {
            Event currentEvent = result1.get(i);
            if(currentEvent != null) { // 添加这一行
                String ticketsJson = currentEvent.getEventTicketLeft();
                try {
                    JSONObject tickets = new JSONObject(ticketsJson);
                    Iterator<String> keys = tickets.keys();
                    while (keys.hasNext()) {
                        String key = keys.next();
                        if (!tickets.isNull(key)) {
                            int count = tickets.getInt(key);
                            if (count > 0) {
                                res.add(currentEvent);
                                break;
                            }
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
        res.sort((e1, e2) -> {
            try {
                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                Date date1 = sdf1.parse(e1.getEventStartDate());
                Date date2 = sdf1.parse(e2.getEventStartDate());
                return date1.compareTo(date2);
            } catch (ParseException e) {
                e.printStackTrace();
                return 0;
            }
        });
        if (res.size() > 4) {
            res = res.subList(0, 4);
        }
        return res;
    }
}
