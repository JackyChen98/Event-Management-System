package com.test.pojo;
import java.io.Serializable;
import java.sql.Date;

import lombok.Data;

/**
 * 
 * @TableName users
 */
@Data
public class Users implements Serializable {
    /**
     * 
     */
    private Integer userId;

    /**
     * 
     */
    private String userPassword;

    /**
     * 
     */
    private String userName;

    /**
     * 
     */
    private String userBirthday;

    /**
     * 
     */
    private String userEmail;

    /**
     * 
     */
    private Integer userPoint;

    /**
     * 
     */
    private String userVoucher;

    /**
     * 
     */
    private String userParticipateActivityList;

    /**
     * 
     */
    private String userHoldActivityList;

    /**
     * 
     */
    private String userNewsList;

    private Integer userPostcode;

    private String userThumbnail;

    private String userFollowing;

    private String userFollowed;

    private Integer userReceivedLikes;

    private String gameDate;

    private String userTag;

    private static final long serialVersionUID = 1L;

}