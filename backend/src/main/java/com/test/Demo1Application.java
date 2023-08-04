package com.test;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.FileOutputStream;
import java.io.File;
import java.io.IOException;

@SpringBootApplication
//使用的Mybatis,扫描com.test.mapper
@MapperScan("com.test.mapper")
public class Demo1Application {

    public static void main(String[] args) {
        // 获取当前的工作目录
        String currentWorkingDir = System.getProperty("user.dir");

        // 定义目标文件路径
        String targetPath = currentWorkingDir + File.separator + "project.sqlite";

        File file = new File(targetPath);

        // 如果数据库文件还不存在，就从JAR复制出来
        if (!file.exists()) {
            try (InputStream is = Demo1Application.class.getResourceAsStream("/project.sqlite");
                 OutputStream os = new FileOutputStream(targetPath)) {

                // 创建缓冲区
                byte[] buffer = new byte[1024];
                int length;

                // 将文件从JAR复制到工作目录
                while ((length = is.read(buffer)) != -1) {
                    os.write(buffer, 0, length);
                }

                System.out.println("Database file copied to " + targetPath);

            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        SpringApplication.run(Demo1Application.class, args);
    }

}
