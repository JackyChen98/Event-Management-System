package com.test.pojo;
import java.io.Serializable;
import java.sql.Timestamp;

import lombok.Data;

/**
 *
 * @TableName command
 */
@Data
public class Ticket implements Serializable {
    /**
     *
     */
    private Integer ticketId;

    /**
     *
     */
    private Integer userId;

    /**
     *
     */
    private Integer ticketRow;

    /**
     *
     */
    private Integer ticketColumn;

    /**
     *
     */
    private Integer eventId;

    private Integer ticketPrice;

    private static final long serialVersionUID = 1L;
}