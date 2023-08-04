package com.test.pojo;
import java.io.Serializable;
import java.sql.Timestamp;

import lombok.Data;

/**
 * 
 * @TableName command
 */
@Data
public class Command implements Serializable {
    /**
     * 
     */
    private Integer commandId;

    /**
     * 
     */
    private Integer userId;

    /**
     * 
     */
    private Integer eventId;

    /**
     * 
     */
    private Integer holderId;

    /**
     * 
     */
    private String commandDetail;

    /**
     * 
     */
    private String commandReply;

    private static final long serialVersionUID = 1L;
}