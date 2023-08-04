package com.test.response;
import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
@Data
public class Response implements Serializable{
    private boolean success;
}
