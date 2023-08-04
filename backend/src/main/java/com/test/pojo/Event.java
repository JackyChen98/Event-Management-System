package com.test.pojo;
import java.io.Serializable;
import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

/**
 * 
 * @TableName event
 */
@Data
public class Event implements Serializable {
    /**
     * 
     */
    private Integer eventId;

    /**
     * 
     */
    private Integer eventHolderId;

    /**
     * 
     */
    private String eventName;

    /**
     * 
     */
    private String eventType;

    /**
     * 
     */
    private String eventDescription;

    /**
     * 
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private String eventStartDate;

    /**
     * 
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private String eventEndDate;

    /**
     * 
     */
    private String eventLocation;

    /**
     * 
     */
    private String eventMemberList;

    /**
     * 
     */
    private String eventCommandList;

    /**
     * 
     */
    private String eventTicketPrice;

    /**
     * 
     */
    private String eventTicketLeft;

    /**
     * 
     */
    private Integer eventMaxRow;

    /**
     * 
     */
    private Integer eventMaxColumn;

    /**
     * 
     */
    private String eventThumbnail;

    private String eventLikeList;

    private String eventDetailLocation;

    private static final long serialVersionUID = 1L;

}